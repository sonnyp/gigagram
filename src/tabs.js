import Gio from "gi://Gio";
import Gdk from "gi://Gdk";
import GObject from "gi://GObject";

import { MODES } from "./constants.js";
import { buildWebView } from "./WebView.js";
import * as instances from "./instances.js";

import { gettext as _ } from "gettext";
import { instanceDialog } from "./instanceDialog.js";

export function Tabs({
  state,
  builder,
  application,
  window,
  onNotification,
  deleteInstance,
  tab_overview,
}) {
  const tab_view = builder.get_object("tab_view");

  function onSelectedTab() {
    const tab_page = tab_view.selected_page;
    if (!tab_page) {
      state.set({ webview: null });
      return;
    }
    const instance = instances.get(tab_page.child.instance_id);
    if (!instance) {
      state.set({ webview: null });
      return;
    }
    state.set({ webview: instance.webview });
  }
  tab_view.connect("notify::selected-page", onSelectedTab);

  function selectTab(instance) {
    tab_view.set_selected_page(tab_view.get_page(instance.webview));
  }

  let removing_tab = false;
  tab_view.connect("close-page", (_self, tab_page) => {
    if (removing_tab) {
      const instance = instances.get(tab_page.child.instance_id);
      tab_view.close_page_finish(tab_page, true);
      instances.destroy(instance);
      tab_overview.set_open(true);
    }
    removing_tab = false;
    return Gdk.EVENT_STOP;
  });

  return {
    addTab(instance) {
      const webview = buildWebView({
        instance,
        window,
        onNotification,
        application,
      });
      instance.webview = webview;
      webview.mode = MODES.PERMANENT;
      webview.instance_id = instance.id;

      const tab_page = tab_view.append(webview);

      webview.bind_property(
        "favicon",
        tab_page,
        "icon",
        GObject.BindingFlags.SYNC_CREATE,
      );
      instance.bind("name", tab_page, "title", Gio.SettingsBindFlags.GET);

      webview.bind_property(
        "is-loading",
        tab_page,
        "loading",
        GObject.BindingFlags.SYNC_CREATE,
      );

      webview.connect("notify::is-playing-audio", () => {
        let icon = null;
        let tooltip = "";

        if (webview.is_playing_audio) {
          icon = Gio.Icon.new_for_string("audio-volume-high-symbolic");
          tooltip = _("Playing Audio");
        }

        tab_page.set_indicator_icon(icon);
        tab_page.set_indicator_tooltip(tooltip);
      });
    },
    removeTab(instance) {
      removing_tab = true;
      tab_view.close_page(tab_view.get_page(instance.webview));
    },
    selectTab,
    editTab(instance, change_view) {
      selectTab(instance, change_view);
      instanceDialog({
        window,
        instance,
        onDeleteInstance: deleteInstance,
      }).catch(logError);
    },
  };
}
