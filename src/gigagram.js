#!/usr/bin/gjs

const {
  get_current_dir,
  file_get_contents,
  setenv,
  build_filenamev,
} = imports.gi.GLib;
const { toString } = imports._byteArrayNative;
const { Resource } = imports.gi.Gio;
const prefix = get_current_dir();

function readPackage() {
  const path = build_filenamev([prefix, "package.json"]);
  const [, result] = file_get_contents(path);
  return JSON.parse(toString(result));
}
const { name, version } = readPackage();

// https://gitlab.gnome.org/GNOME/gjs/wikis/Package/Specification
// https://gitlab.gnome.org/GNOME/gjs/blob/master/modules/package.js
imports.package.init({
  name,
  version,
  prefix,
});

setenv("DEV", "true", false);

Resource.load(
  build_filenamev([pkg.pkgdatadir, "re.sonny.gigagram.data.gresource"])
)._register();

imports.package.run(imports.main);
