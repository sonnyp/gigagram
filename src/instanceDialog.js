import Gtk from "gi://Gtk";

import instance_dialog from "./instanceDialog.blp" assert { type: "string" };

export function instanceDialog({ window, instance, onDeleteInstance }) {
  const builder = Gtk.Builder.new_from_string(instance_dialog, -1);
  const dialog = builder.get_object("dialog");
  dialog.title = instance.name;

  const button_delete = builder.get_object("button_delete");
  button_delete.connect("clicked", () => {
    onDeleteInstance(instance.id);
    dialog.close();
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
