import Gtk from "gi://Gtk";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import { gettext as _ } from "gettext";

Gio._promisify(Adw.AlertDialog.prototype, "choose", "choose_finish");

import instance_dialog from "./instanceDialog.blp" assert { type: "string" };

export function instanceDialog({ window, instance, onDeleteInstance }) {
  const builder = Gtk.Builder.new_from_string(instance_dialog, -1);
  const dialog = builder.get_object("dialog");
  dialog.title = instance.name;

  const button_delete = builder.get_object("button_delete");
  button_delete.connect("clicked", () => {
    onDelete({ dialog, onDeleteInstance, instance }).catch(console.error);
  });

  const nameEntry = builder.get_object("name");
  nameEntry.text = instance.settings.get_string("name");

  const URLEntry = builder.get_object("url");
  URLEntry.text = instance.settings.get_string("url");

  const button_save = builder.get_object("button_save");
  button_save.set_sensitive(!!URLEntry.text);
  URLEntry.connect("changed", () => {
    const isValid = !!URLEntry.text;
    button_save.set_sensitive(isValid);
  });

  const notificationsPriority = builder.get_object("notifications-priority");
  notificationsPriority.selected = instance.settings.get_enum(
    "notifications-priority",
  );

  const userAgentEntry = builder.get_object("user-agent");
  userAgentEntry.text = instance.settings.get_string("user-agent");

  const button_cancel = builder.get_object("button_cancel");
  button_cancel.connect("clicked", () => {
    dialog.close();
  });

  button_save.connect("clicked", () => {
    instance.settings.set_string("name", nameEntry.text);
    instance.settings.set_string("url", URLEntry.text);
    instance.settings.set_string("user-agent", userAgentEntry.text);
    instance.settings.set_enum(
      "notifications-priority",
      notificationsPriority.selected,
    );
    dialog.close();
  });

  dialog.present(window);
}

async function onDelete({ dialog, onDeleteInstance, instance }) {
  const alert_dialog = new Adw.AlertDialog({
    heading: _("Delete Tab?"),
    body: _("The Tab and locally saved data will be gone."),
    close_response: "cancel",
  });

  alert_dialog.add_response("cancel", "Cancel");
  alert_dialog.add_response("delete", "Delete");
  alert_dialog.set_response_appearance(
    "delete",
    Adw.ResponseAppearance.DESTRUCTIVE,
  );

  const response = await alert_dialog.choose(dialog, null);

  if (response === "delete") {
    onDeleteInstance(instance.id);
    dialog.force_close();
  }
}
