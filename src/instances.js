import GLib from "gi://GLib";

import { Settings, ensureDirectory } from "./util.js";
import { data_dir, cache_dir } from "./env.js";

export const list = [];

export class Instance {
  constructor(id) {
    this.id = id;
    this.data_dir = GLib.build_filenamev([data_dir, id]);
    this.cache_dir = GLib.build_filenamev([cache_dir, id]);

    // https://gjs-docs.gnome.org/gio20~2.0_api/gio.settings
    this.settings = new Settings({
      schema_id: "re.sonny.Tangram.Instance",
      path: `/re/sonny/Tangram/instances/${id}/`,
    });
  }

  bind(...args) {
    return this.settings.bind(...args);
  }

  observe(prop, fn) {
    const val = this[prop];
    if (val !== undefined) fn(val);
    this.settings.connect(`changed::${prop}`, () => {
      fn(this[prop]);
    });
  }

  get name() {
    return this.settings.get_string("name");
  }
  set name(name) {
    this.settings.set_string("name", name);
  }
  get url() {
    return this.settings.get_string("url");
  }
  set url(url) {
    this.settings.set_string("url", url);
  }
}

export function load(settings) {
  settings.get_strv("instances").forEach((id) => {
    list.push(new Instance(id));
  });
}

export function detach(settings, id) {
  const instances = settings.get_strv("instances");
  const idx = instances.indexOf(id);
  if (idx < 0) return null;
  instances.splice(idx, 1);
  settings.set_strv("instances", instances);
  return idx;
}

export function attach(settings, id) {
  const instances = settings.get_strv("instances") || [];
  settings.set_strv("instances", [...instances, id]);
}

export function create({ id, ...props }) {
  const instance = new Instance(id);

  ensureDirectory(instance.data_dir);
  ensureDirectory(instance.cache_dir);

  Object.assign(instance, props);
  list.push(instance);
  return instance;
}

export function destroy(instance) {
  const idx = list.indexOf(instance);
  if (idx > -1) list.splice(idx, 1);

  const { settings } = instance;
  settings.reset("name");
  settings.reset("url");
  // https://gitlab.gnome.org/GNOME/glib/merge_requests/981#note_551625
  try {
    settings.reset("");
    // eslint-disable-next-line no-empty
  } catch {}

  GLib.rmdir(instance.data_dir);
  GLib.rmdir(instance.cache_dir);
}

export function get(id) {
  return list.find((instance) => instance.id === id);
}
