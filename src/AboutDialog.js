import Gtk from "gi://Gtk";
import WebKit from "gi://WebKit";
import Soup from "gi://Soup";
import Adw from "gi://Adw";
import { gettext as _ } from "gettext";
import Gst from "gi://Gst";

import {
  getGIRepositoryVersion,
  getGjsVersion,
  getGLibVersion,
} from "../troll/src/util.js";

let dialog;

export default function AboutDialog({ application }) {
  if (!dialog) {
    const debug_info = `
WebKitGTK ${getGIRepositoryVersion(WebKit)}
GJS ${getGjsVersion()}
Adw ${getGIRepositoryVersion(Adw)}
GTK ${getGIRepositoryVersion(Gtk)}
GLib ${getGLibVersion()}
libsoup ${getGIRepositoryVersion(Soup)}
${Gst.version_string()}
    `.trim();
    dialog = new Adw.AboutWindow({
      application_name: "Tangram",
      developer_name: "Sonny Piers",
      copyright: "© 2019-2023 Sonny Piers",
      license_type: Gtk.License.GPL_3_0_ONLY,
      version: pkg.version,
      website: "https://tangram.sonny.re",
      application_icon: pkg.name,
      issue_url: "https://tangram.sonny.re/feedback",
      // TRANSLATORS: eg. 'Translator Name <your.email@domain.com>' or 'Translator Name https://website.example'
      translator_credits: _("translator-credits"),
      debug_info,
      developers: ["Sonny Piers https://sonny.re"],
      designers: [
        "Sonny Piers https://sonny.re",
        "Tobias Bernard <tbernard@gnome.org>",
      ],
      artists: ["Tobias Bernard <tbernard@gnome.org>"],
      hide_on_close: true,
    });
    dialog.add_credit_section(_("Contributors"), [
      "codyfish https://github.com/codyfish",
      // Add yourself as
      // "John Doe",
      // or
      // "John Doe <john@example.com>",
      // or
      // "John Doe https://john.com",
    ]);
  }
  dialog.set_transient_for(application.get_active_window());
  dialog.present();
  return dialog;
}
