import { Tabs } from "./tabs.js";
import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk";
import GObject from "gi://GObject";
import Adw from "gi://Adw";
import Gio from "gi://Gio";

export function ViewTabs({
  application,
  onReload,
  onStopLoading,
  onGoBack,
  onGoForward,
  onGoHome,
  state,
  onNewTab,
  builder,
  window,
  onNotification,
  deleteInstance,
  breakpoint,
  settings,
}) {
  const tab_overview = builder.get_object("tab_overview");

  const button_back_top = builder.get_object("button_back_top");
  const button_back_bottom = builder.get_object("button_back_bottom");
  button_back_top.connect("clicked", onGoBack);
  button_back_bottom.connect("clicked", onGoBack);

  const button_forward_top = builder.get_object("button_forward_top");
  const button_forward_bottom = builder.get_object("button_forward_bottom");
  button_forward_top.connect("clicked", onGoForward);
  button_forward_bottom.connect("clicked", onGoForward);

  const button_home_top = builder.get_object("button_home_top");
  button_home_top.connect("clicked", onGoHome);
  const button_home_bottom = builder.get_object("button_home_bottom");
  button_home_bottom.connect("clicked", onGoHome);

  const button_reload_top = builder.get_object("button_reload_top");
  // const button_reload_bottom = builder.get_object("button_reload_bottom");

  const event_controller_click = new Gtk.GestureClick({ button: 0 });
  button_reload_top.add_controller(event_controller_click);
  // button_reload_bottom.add_controller(event_controller_click);

  event_controller_click.connect("pressed", () => {
    const event = event_controller_click.get_current_event();
    const button = event.get_button();
    if (button !== Gdk.BUTTON_PRIMARY) {
      event_controller_click.set_state(Gtk.EventSequenceState.DENIED);
      return;
    }

    const webview = state.get("webview");
    if (webview.is_loading) {
      onStopLoading();
    } else {
      const modifier_state = event.get_modifier_state();
      onReload(modifier_state & Gdk.ModifierType.CONTROL_MASK);
    }
  });

  const tabs = Tabs({
    state,
    application,
    builder,
    window,
    onNotification,
    deleteInstance,
    tab_overview,
  });

  const view_tabs = builder.get_object("view_tabs");

  const tabs_bar = builder.get_object("tabs_bar");
  settings.bind("tabs-bar", tabs_bar, "visible", Gio.SettingsBindFlags.DEFAULT);

  tab_overview.bind_property_full(
    "open",
    view_tabs,
    "top-bar-style",
    GObject.BindingFlags.SYNC_CREATE,
    (binding, open) => {
      return [true, Adw.ToolbarStyle[open ? "FLAT" : "RAISED"]];
    },
    null,
  );

  setupTabs({ builder, settings });

  function setupHeaderbar(is_handheld) {
    view_tabs.reveal_bottom_bars = is_handheld;
    view_tabs.reveal_top_bars = !is_handheld;
  }

  breakpoint.connect("apply", () => {
    setupHeaderbar(true);
    // setupHeaderbar(window.maximized || window.fullscreened);
  });
  breakpoint.connect("unapply", () => {
    setupHeaderbar(false);
  });

  const button_add_tab = builder.get_object("button_add_tab");
  button_add_tab.connect("clicked", onNewTab);

  function updateButtons(webview) {
    button_back_top.sensitive = webview.can_go_back();
    button_back_bottom.sensitive = webview.can_go_back();
    button_forward_top.sensitive = webview.can_go_forward();
    button_forward_bottom.sensitive = webview.can_go_forward();
    const icon_name = webview.is_loading
      ? "process-stop-symbolic"
      : "view-refresh-symbolic";
    button_reload_top.icon_name = icon_name;
    // button_reload_bottom.icon_name = icon_name;
  }

  let loadChangedHandlerId = null;
  let backForwardListChangedHandlerId = null;
  state.notify("webview", (webview, previous) => {
    if (previous) {
      if (loadChangedHandlerId) {
        previous.disconnect(loadChangedHandlerId);
        loadChangedHandlerId = null;
      }
      if (backForwardListChangedHandlerId) {
        previous
          .get_back_forward_list()
          .disconnect(backForwardListChangedHandlerId);
        backForwardListChangedHandlerId = null;
      }
    }

    updateButtons(webview);

    if (!webview) return;

    // https://gjs-docs.gnome.org/webkit240~4.0_api/webkit2.backforwardlist#signal-changed
    backForwardListChangedHandlerId = webview
      .get_back_forward_list()
      .connect("changed", () => {
        updateButtons(webview);
      });

    loadChangedHandlerId = webview.connect("load-changed", () => {
      updateButtons(webview);
    });
  });

  return { tabs };
}

function setupTabs({ builder, settings }) {
  const list_box = builder.get_object("list_box");
  const tab_view = builder.get_object("tab_view");
  const sidebar = builder.get_object("sidebar");

  settings.bind(
    "tabs-sidebar",
    sidebar,
    "visible",
    Gio.SettingsBindFlags.DEFAULT,
  );

  tab_view.connect("notify::n-pages", (self) => {
    sidebar.visible =
      settings.get_boolean("tabs-sidebar") && tab_view["n-pages"] > 1;
  });

  // Create a binding between the Gtk.ListBox and the Adw.TabView

  list_box.bind_model(
    tab_view.pages,
    // This function will be called for every new Adw.TabPage
    (tab_page) => {
      return buildTabRow(tab_page);
    },
  );

  list_box.connect("row-selected", (self, row) => {
    tab_view.set_selected_page(row.tab_page);
  });

  tab_view.connect("notify::selected-page", (self, page) => {
    list_box.select_row(tab_view.selected_page.list_box_row);
  });
}

function buildTabRow(tab_page) {
  const list_box_row = new Gtk.ListBoxRow({
    selectable: true,
    height_request: 40,
  });
  list_box_row.tab_page = tab_page;
  const label = new Gtk.Label({
    halign: Gtk.Align.START,
  });
  list_box_row.set_child(label);

  tab_page.list_box_row = list_box_row;

  tab_page.bind_property(
    "title",
    label,
    "label",
    GObject.BindingFlags.SYNC_CREATE,
  );

  return list_box_row;
}
