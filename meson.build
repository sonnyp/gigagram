project(
  'Tangram',
  version: '3.2',
  meson_version: '>= 0.59.0',
  license: 'GPL-3.0-only',
)

gnome = import('gnome')
i18n = import('i18n')

app_id = 're.sonny.Tangram'
prefix = get_option('prefix')
bindir = join_paths(prefix, 'bin')
datadir = join_paths(prefix, get_option('datadir'))
pkgdatadir = join_paths(datadir, app_id)

subdir('data')
subdir('src')
subdir('po')

gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: true,
  update_desktop_database: true,
)
