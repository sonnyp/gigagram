<img style="vertical-align: middle;" src="data/icons/hicolor/scalable/apps/re.sonny.Tangram.svg" align="left" width="120" height="120">

# Tangram

Browser for your pinned tabs

![screenshot](data/appdata/desktop.png)

<a href='https://flathub.org/apps/details/re.sonny.Tangram'><img width='240' alt='Download on Flathub' src='https://flathub.org/api/badge?svg&locale=en'/></a>

## About

Tangram is a new kind of browser. It is designed to organize and run your Web applications.
Each tab is persistent and independent. You can set multiple tabs with different accounts for the same application.

- Stay up to date with your favorite communities
- Merge all these chat applications into one
- Group your organization tools under one application
- One-stop for multiple sources of documentation or information

## Features

- Setup and manage web applications
  <!-- - Custom icon -->
- Persistent and independent tabs
- Custom title
- Re-order tabs
- Change tabs position
- Navigation
- Shortcuts
- Smart notifications
- Downloads
- [Touchpad/touchscreen gestures](https://blogs.gnome.org/alexm/2019/09/13/gnome-and-gestures-part-1-webkitgtk/)

## Security

Tabs are independant and sandboxed from each others.

Both Flatpak and non-Flatpak versions of Tangram provide sandboxing for Web applications.

- Flatpak via [our restricted permissions](https://github.com/sonnyp/Tangram/blob/main/re.sonny.Tangram.json)
- Non-Flatpak through [WebkitGTK Sandboxing](https://www.youtube.com/watch?v=5TDg83LHZ6o) (requires WebkitGTK >= 2.26)

<!-- ## Roadmap

- Custom icon (WIP)
- Custom applications (WIP)
- Expose WebKitGTK settings (todo)
- SearchProvider (todo)
- Custom CSS/JS for better integration (todo)
- WebExtensions (todo) -->

<!-- Disabled for now, enable with TANGRAM_ENABLE_CUSTOM_APPLICATIONS=true -->
<!-- use at your own risk -->
<!--
### Custom applications

You can create custom applications with one or multiple tabs. They work the same as the main instance.

See demo: https://www.youtube.com/watch?v=y9MIXn4Iw70

You can create a custom application by

- dragging the tab out (see demo)
- right click on the tab
- via the application menu -->

## In the media

[howtogeek.com - This Linux App Turns Websites Into Apps Themselves—Here's Why It's Great](https://www.howtogeek.com/tangram-linux-app-turns-websites-into-apps/) - 2024-09

[omglinux.com - Tangram for Linux is a Browser Built for Web Apps](https://www.omglinux.com/tangram-web-app-browser-for-linux/) - 2023-01

TechHut - 5 AWESOME LINUX APPS - GNOME Circle [odysee.com](https://odysee.com/@TechHut:1/5-awesome-linux-apps-gnome-circle:8) / [youtube.com](https://www.youtube.com/watch?v=aYlzSk7mB0Y) - 2022-02

Tangram - Manage Social Media sites on #Linux and #GNOME (#shorts) [youtube.com](https://www.youtube.com/shorts/e7eY3Plroww) - 2021-11

TechHut - NEW Kind of Web Browser on Linux [odysee.com](https://odysee.com/@TechHut:1/new-kind-of-web-browser-on-linux:b) / [youtube.com](https://www.youtube.com/watch?v=KmQRh-ekaYw) - 2021-10

[techrepublic.com - Try this Linux web browser dedicated solely to web applications](https://www.techrepublic.com/article/try-this-linux-web-browser-dedicated-solely-to-web-applications/) - 2021-09

Conheça programas para profissionais que usam Linux - Diolinux App Showcase #9 [youtube.com](https://www.youtube.com/watch?v=OJVPIYaIBZY&t=230s) - 2021-05

[GNU/Linux.ch – Tangram - eine neue Art des Webbrowsers (Review)](https://gnulinux.ch/tangram-eine-neue-art-des-webbrowsers) - 2021-04

Chris Were Digital - Tangram a browser just for web apps [share.tube](https://share.tube/videos/watch/684332bf-cf6a-415d-970b-fb6ca996996b) / [youtube.com](https://www.youtube.com/watch?v=M1NEZ6fVBQQ) - 2021-02

How to run web apps with ease on Linux [youtube.com](https://www.addictivetips.com/ubuntu-linux-tips/run-web-apps-linux/) - 2020-11

[addictivetips.com - How to run web apps with ease on Linux](https://www.addictivetips.com/ubuntu-linux-tips/run-web-apps-linux/) - 2020-09

[ubunlog.com - Tangram, nueva opción basada en GNOME para agrupar nuestras web-apps](https://ubunlog.com/tangram-nueva-opcion-basada-en-gnome-para-agrupar-nuestras-web-apps/) - 2020-09

[ubunlog.com - Tangram, a new option based on GNOME to group our web-apps](https://ubunlog.com/en/tangram-nueva-opcion-basada-en-gnome-para-agrupar-nuestras-web-apps/) - 2020-09

[edivaldobrito.com.br - Como instalar o navegador Tangram no Linux via Flatpak](https://www.edivaldobrito.com.br/como-instalar-o-navegador-tangram-no-linux-via-flatpak/) - 2020-08

[linux-magazine.com - Tangram integrates social media services in a single app](https://www.linux-magazine.com/Issues/2020/235/Tangram) - 2020-06

[linux-community.de - Tangram integriert Social-Media-Dienste und Messenger in eine App](https://www.linux-community.de/ausgaben/linuxuser/2020/02/zusammengepuzzelt/) - 2020-02

[linuxdicasesuporte.blogspot.com - Navegador Tangram no GNU/Linux ](https://linuxdicasesuporte.blogspot.com/2019/11/navegador-tangram-no-gnulinux.html) - 2019-11

[diolinux.com.br - Tangram, um app para gerenciar Webapps](https://diolinux.com.br/aplicativos/tangram-um-app-para-gerenciar-webapps.html) - 2019-09

## Translation

If you'd like to help translating Tangram into your language, please head over to [Weblate](https://hosted.weblate.org/engage/tangram/).

<a href="https://hosted.weblate.org/engage/tangram/">
  <img src="https://hosted.weblate.org/widgets/tangram/-/tangram/multi-auto.svg" alt="Translation status" />
</a>

Thank you for your help!

## Development

Use [GNOME Builder](https://apps.gnome.org/app/org.gnome.Builder/).

If you knwo what you are doing - you can run from source locally instead:

`./run.sh` runs the application in `development` mode. Hit `<Ctrl><Shift>Q` to restart the application.

- data files are stored in `./var/data/` instead of `$XDG_DATA_HOME/Tangram/`
- cache files are stored in `./var/cache/` instead of `XDG_CACHE_HOME/Tangram/`
  <!-- TODO application -->
  <!-- - desktop files are stored in `./var/applications/` instead of `$XDG_DATA_HOME/applications/` -->
  <!-- "--filesystem=xdg-data/applications:create" -->

To test desktop notifications you can add `https://jhmux.codesandbox.io/`.

### Test

```sh
make test
```

### Meson

```sh
meson --reconfigure --prefix $PWD/install build
ninja -C build install
GSETTINGS_SCHEMA_DIR=./install/share/glib-2.0/schemas/ ./install/bin/re.sonny.Tangram
```

### Flatpak

```sh
flatpak-builder --user --force-clean --install-deps-from=flathub flatpak re.sonny.Tangram.json
flatpak-builder --run flatpak re.sonny.Tangram.json re.sonny.Tangram
```

### Flatpak sandboxed

```sh
flatpak-builder --user  --force-clean --repo=repo --install-deps-from=flathub flatpak re.sonny.Tangram.json
flatpak --user remote-add --no-gpg-verify --if-not-exists Tangram repo
flatpak --user install --reinstall --assumeyes Tangram re.sonny.Tangram
```

### Inspect

```sh
gsettings set org.gtk.Settings.Debug enable-inspector-keybinding true
GTK_DEBUG=interactive ./run.sh
```

### Release

```sh
# bump meson.build version
git tag $VERSION
git push origin $VERSION
# send PR to https://github.com/flathub/re.sonny.Tangram/blob/master/re.sonny.Tangram.json
```

## Credits

Icon by [Tobias Bernard](https://tobiasbernard.com/)

[Igalia](https://www.igalia.com/) and contributors for the amazing work on [WebKitGTK](https://webkitgtk.org/)

Inspired by [GNOME Web](https://wiki.gnome.org/Apps/Web), [Rambox](https://rambox.pro/#home) and [Franz](https://meetfranz.com/).

See also [Wavebox](https://wavebox.io/) and [Station](https://getstation.com/).
