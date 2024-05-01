import Gtk from "gi://Gtk";
import GLib from "gi://GLib";
import Gio from "gi://Gio";

import AboutDialog from "./AboutDialog.js";

import * as instances from "./instances.js";

import InterfaceShortcuts from "./shortcuts.blp";

export default function Actions({
  window,
  application,
  selectTab,
  state,
  editTab,
}) {
  const builder = Gtk.Builder.new_from_resource(InterfaceShortcuts);

  const showAboutDialog = new Gio.SimpleAction({
    name: "about",
    parameter_type: null,
  });
  showAboutDialog.connect("activate", () => {
    AboutDialog({ application });
  });
  application.add_action(showAboutDialog);

  const action_editTab = new Gio.SimpleAction({
    name: "editTab",
    parameter_type: null,
  });
  action_editTab.connect("activate", () => {
    const instance_id = state.get("webview")?.instance_id;
    if (!instance_id) return;
    const instance = instances.get(instance_id);
    if (!instance) return;
    editTab(instance);
  });
  window.add_action(action_editTab);

  const showShortcutsDialog = new Gio.SimpleAction({
    name: "shortcuts",
    parameter_type: null,
  });
  showShortcutsDialog.connect("activate", () => {
    const shortcutsWindow = builder.get_object("shortcuts-window");
    shortcutsWindow.set_transient_for(window);
    shortcutsWindow.present();
  });
  application.add_action(showShortcutsDialog);

  const showInstanceAction = new Gio.SimpleAction({
    name: "showInstance",
    parameter_type: GLib.VariantType.new("s"),
  });
  showInstanceAction.connect("activate", (self, parameters) => {
    const id = parameters.unpack();

    const instance = instances.get(id);
    if (instance) {
      selectTab(instance);
    }

    // FIXME: temporary workaround
    // Calling this twice to work around: https://gitlab.gnome.org/GNOME/gtk/-/issues/5239
    window.present();
    window.present();
  });
  application.add_action(showInstanceAction);

  const quit = new Gio.SimpleAction({
    name: "quit",
    parameter_type: null,
  });
  quit.connect("activate", () => {
    application.quit();
  });
  application.add_action(quit);
}
