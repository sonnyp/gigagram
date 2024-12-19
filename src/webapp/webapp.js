import GLib from "gi://GLib";
import Soup from "gi://Soup";
import GdkPixbuf from "gi://GdkPixbuf";

import { promiseTask } from "../../troll/src/async.js";

import {
  getWebAppIcon,
  getWebAppTitle,
  getWebAppManifest,
  getWebAppURL,
} from "./ephy.js";

export function runJavaScript(webview, script) {
  return promiseTask(
    webview,
    "evaluate_javascript",
    "evaluate_javascript_finish",
    script, // script
    -1, // length
    null, // world_name
    null, // source_uri
    null, // cancellable
  );
}

// FIXME: we should use troll fetch but it doesn't support reading an InputStream
// without a `content-length` header
// import fetch from "../troll/std/fetch";
export async function fetchManifest(url, webview) {
  try {
    const uri = GLib.Uri.parse(url, GLib.UriFlags.NONE);

    let bytes;

    const scheme = uri.get_scheme();
    if (scheme === "data") {
      [bytes] = Soup.uri_decode_data_uri(url);
    } else {
      const session = new Soup.Session();
      const message = new Soup.Message({
        method: "GET",
        uri,
      });
      message.get_request_headers().append("Cache-Control", "no-cache");
      if (webview) {
        message
          .get_request_headers()
          .append("User-Agent", webview.get_settings().get_user_agent());
      }
      bytes = await promiseTask(
        session,
        "send_and_read_async",
        "send_and_read_finish",
        message,
        GLib.PRIORITY_DEFAULT,
        null,
      );
    }

    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (err) {
    logError(err);
  }

  return null;
}

async function getTitle(webview) {
  const script = `(${getWebAppTitle.toString()})()`;

  let title = webview.get_title();
  try {
    const value = await runJavaScript(webview, script);
    if (value.is_string()) {
      title = value.to_string();
    }
  } catch (err) {
    logError(err);
  }

  return title;
}

async function getURL(webview) {
  const script = `(${getWebAppURL.toString()})()`;

  let url = webview.get_uri();
  try {
    const value = await runJavaScript(webview, script);
    if (value.is_string()) {
      url = value.to_string();
    }
  } catch (err) {
    logError(err);
  }

  return url;
}

// eslint-disable-next-line no-unused-vars
function getIcon(webview) {
  const script = `(${getWebAppIcon.toString()})()`;

  return runJavaScript(webview, script)
    .then((javascriptValue) => {
      const url = javascriptValue.object_get_property("url");
      if (!url.is_string()) return null;
      return url.to_string();
      // const color = javascriptValue.object_get_property('color').to_string();
    })
    .catch((err) => {
      logError(err);
      return null;
    });
}

async function getManifestURL(webview) {
  const script = `(${getWebAppManifest.toString()})()`;

  let manifestURL = null;
  try {
    const value = await runJavaScript(webview, script);
    if (value.is_string()) {
      manifestURL = value.to_string();
    }
  } catch (err) {
    logError(err);
  }
  return manifestURL;
}

const supported_formats = (() => {
  const formats = GdkPixbuf.Pixbuf.get_formats();
  return [].concat(...formats.map((format) => format.get_mime_types()));
})();

function getMaxSize(icon) {
  const sizes = [];

  for (const size of icon.sizes.split(" ")) {
    if (!size) continue;
    sizes.push(+size.split("x")[0]);
  }

  return Math.max(...sizes);
}

// eslint-disable-next-line no-unused-vars
function findBestIcon(icons) {
  let bestIcon;

  for (const icon of icons) {
    if (!supported_formats.includes(icon.type)) continue;
    if (!icon.src) continue;

    const size = getMaxSize(icon);
    if (!size) continue;

    if (!bestIcon) {
      bestIcon = icon;
      continue;
    }

    if (size >= getMaxSize(bestIcon)) {
      bestIcon = icon;
    }
  }

  return bestIcon;
}

function resolveURI(webview, URL) {
  return GLib.Uri.resolve_relative(webview.get_uri(), URL, GLib.UriFlags.NONE);
}

export async function getWebAppInfo(webview) {
  const title = await getTitle(webview);
  // const icon = await getIcon(webview);
  const URL = await getURL(webview);

  const info = { title };
  if (URL) info.URL = resolveURI(webview, URL);
  // if (icon) {
  // info.icon = resolveURI(webview, icon);
  // }

  const manifestURL = await getManifestURL(webview);
  if (!manifestURL) {
    return info;
  }

  console.debug(`manifestURL <${manifestURL}>`);

  const manifest = await fetchManifest(manifestURL, webview);
  if (!manifest) {
    return info;
  }

  const {
    name,
    short_name,
    // icons = [],
    start_url,
  } = manifest;

  if (short_name) {
    info.title = short_name;
  } else if (name) {
    info.title = name;
  }

  if (start_url) {
    info.URL = resolveURI(webview, start_url);
  }

  // const bestIcon = findBestIcon(icons);
  // if (bestIcon) {
  //   info.icon = resolveURI(webview, bestIcon.src);
  // }

  info.manifest = manifest;
  return info;
}
