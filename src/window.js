import Gtk from "gi://Gtk";
import Gio from "gi://Gio";

import Shortcuts from "./Shortcuts.js";
import Actions from "./Actions.js";
import { Settings, observeSetting } from "./util.js";
import { getWebAppInfo } from "./webapp/webapp.js";

import {
  get as getInstance,
  attach as attachInstance,
  destroy as destroyInstance,
  list as instanceList,
  load as loadInstances,
} from "./instances.js";

import { MODES } from "./constants.js";
import * as instances from "./instances.js";

import WindowInterface from "./window.blp";
import ViewTabsInterface from "./ViewTabs.blp";
import ViewNewInterface from "./ViewNew.blp";

import "./icons/tabs-stack-symbolic.svg" assert { type: "icon" };
import { ViewTabs } from "./ViewTabs.js";
import { ViewNew } from "./ViewNew.js";

export default function Window({ application, state }) {
  const settings = new Settings({
    schema_id: "re.sonny.Tangram",
    path: "/re/sonny/Tangram/",
  });

  const builder_window = Gtk.Builder.new_from_resource(WindowInterface);
  const builder_view_tabs = Gtk.Builder.new_from_resource(ViewTabsInterface);
  const builder_view_new = Gtk.Builder.new_from_resource(ViewNewInterface);

  const window = builder_window.get_object("window");
  const breakpoint = builder_window.get_object("breakpoint");

  const view_new = builder_view_new.get_object("view_new");
  const { focusAddressBar, onNewTab } = ViewNew({
    onAddTab,
    onCancelNewTab,
    state,
    builder: builder_view_new,
  });

  function deleteInstance(id) {
    const instance = instances.get(id);
    instances.detach(settings, instance.id);
    tabs.removeTab(instance);
    instances.destroy(instance);
  }

  const view_tabs = builder_view_tabs.get_object("view_tabs");
  const { tabs } = ViewTabs({
    application,
    onReload,
    onStopLoading,
    onGoBack,
    onGoForward,
    onGoHome,
    state,
    onNewTab,
    builder: builder_view_tabs,
    window,
    onNotification,
    deleteInstance,
    breakpoint,
  });

  const stack_views = builder_window.get_object("stack_views");
  state.bind("view", stack_views, "visible_child_name");
  stack_views.add_named(view_tabs, "tabs");
  stack_views.add_named(view_new, "new");

  function onStopLoading() {
    const tab = state.get("webview");
    tab?.stop_loading();
  }

  function onReload(bypass_cache) {
    const tab = state.get("webview");
    if (!tab) return;
    if (bypass_cache) {
      tab.reload_bypass_cache();
    } else {
      tab.reload();
    }
  }

  function onGoBack() {
    const tab = state.get("webview");
    tab?.go_back();
  }

  function onGoForward() {
    const tab = state.get("webview");
    tab?.go_forward();
  }

  function onGoHome() {
    const tab = state.get("webview");
    if (!tab?.instance_id) return;
    const instance = getInstance(tab.instance_id);
    if (!instance) return;
    tab.load_uri(instance.url);
  }

  function onToggleWebInspector() {
    const tab = state.get("webview");
    if (!tab) return;
    const inspector = tab.get_inspector();

    if (inspector.attached_height) {
      inspector.close();
    } else {
      inspector.show();
    }
  }

  window.set_application(application);

  // https://developer.gnome.org/documentation/tutorials/save-state.html
  // FIXME: choppy
  // https://github.com/sonnyp/Tangram/issues/192#issuecomment-1382729140
  settings.bind(
    "window-width",
    window,
    "default-width",
    Gio.SettingsBindFlags.DEFAULT,
  );
  settings.bind(
    "window-height",
    window,
    "default-height",
    Gio.SettingsBindFlags.DEFAULT,
  );
  settings.bind(
    "window-maximized",
    window,
    "maximized",
    Gio.SettingsBindFlags.DEFAULT,
  );

  function onNotification(webkit_notification, instance_id) {
    const priority = instances
      .get(instance_id)
      .settings.get_enum("notifications-priority");

    // TODO
    // report gjs bug webkit_notification.body and webkit_notification.title return undefined
    const body = webkit_notification.get_body();
    const title = webkit_notification.get_title();

    // https://gjs-docs.gnome.org/gio20~2.0_api/gio.notification
    const notification = new Gio.Notification();
    if (title) notification.set_title(title);
    if (body) notification.set_body(body);
    notification.set_priority(priority);
    notification.set_default_action(`app.showInstance('${instance_id}')`);
    application.send_notification(instance_id, notification);
  }

  const stack_new = builder_view_new.get_object("stack_new");
  async function onAddTab() {
    const webview = stack_new.get_child_by_name("new-tab");
    const { instance_id } = webview;
    const instance = getInstance(instance_id);
    instance.url = webview.uri;

    const info = await getWebAppInfo(webview);
    console.debug(`WebApp info for ${instance.url}`, info);

    instance.url = info.URL;

    if (!instance.name) {
      instance.name = info.title || webview.title || "";
    }

    webview.load_uri(instance.url);
    webview.mode = MODES.PERMANENT;

    attachInstance(settings, instance.id);
    stack_new.remove(webview);

    tabs.addTab(instance);
    tabs.selectTab(instance);
  }

  function onCancelNewTab() {
    state.set({ view: "tabs" });
    const webView = stack_new.get_child_by_name("new-tab");
    if (!webView) return;
    stack_new.remove(webView);
    const { instance_id } = webView;
    const instance = getInstance(instance_id);
    if (!instance) return;
    destroyInstance(instance);
  }

  loadInstances(settings);
  instanceList.forEach((instance) => {
    tabs.addTab(instance);
  });
  builder_view_tabs.get_object("tab_overview").open = instanceList.length > 1;

  observeSetting(settings, "instances", (instances) => {
    state.set({ instances });
    if (instances.length === 0) {
      onNewTab();
    } else {
      state.set({
        view: "tabs",
      });
    }
  });

  Shortcuts({
    window,
    application,
    onStopLoading,
    onReload,
    onGoBack,
    onGoForward,
    onGoHome,
    onToggleWebInspector,
    onFocusAddressBar: focusAddressBar,
  });

  Actions({
    window,
    application,
    selectTab: tabs.selectTab,
    editTab: tabs.editTab,
    state,
  });

  return window;
}
