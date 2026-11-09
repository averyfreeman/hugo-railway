---
title: "Name Your Distro: Flatpaks irritatingly don't follow desktop theme (written specific to KDE / Plasma-Desktop 6)"
description: Brings back memories of being read the Ugly Duckling This is not an issue with any Linux distro specifically, but with all distros in general. If anyone out there's had this issue, I'm sure you've shared my pain. I'd struggled with getting flatpaks to follow the (dark) system th…
summary: Brings back memories of being read the Ugly Duckling This is not an issue with any Linux distro specifically, but with all distros in general. If anyone out there's had this issue, I'm sure you've shared my pain. I'd struggled with getting flatpaks to follow the (dark) system th…
date: 2024-03-24T00:13:37Z
author: Avery Freeman
slug: name-your-distro-flatpaks-irritatingly-dont-follow-desktop-theme-on-kde-plasma-desktop-6
categories:
  - Random
thumbnail: /post-thumbnails/attachment-740.webp
thumbnail_alt: "Name Your Distro: Flatpaks irritatingly don't follow desktop theme (written specific to KDE / Plasma-Desktop 6)"
thumbnail_width: 480
thumbnail_height: 365
thumbnail_aspect: 1.3150684931506849
type: post
status: publish
url: /posts/2024/03/name-your-distro-flatpaks-irritatingly-dont-follow-desktop-theme-on-kde-plasma-desktop-6/
---

<!-- Imported from WordPress post 736. -->

![Window style looks out of place](/wp-content/uploads/2024/03/Screenshot_20240323_170829-1024x778.webp)

*Brings back memories of being read the Ugly Duckling*

This is not an issue with any Linux distro specifically, but with all distros in general. If anyone out there's had this issue, I'm sure you've shared my pain. I'd struggled with getting flatpaks to follow the (dark) system theme I set for a while, and I finally just got it fixed, so I thought I'd run through the process real quick:

-   make sure you're setting a theme that has a flatpak version available (I chose `adw-gtk3{,-dark}`)

-   install the flatpak versions: as of writing, `gtk3` flatpak themes are the only ones you need to download, but if your theme doesn't include a `gtk4` variant, YMMV

-   install the `gtk` themes for your desktop environment and ensure they are in the proper location

-   enable `gtk` themes in `gsettings`

-   A couple last-ditch effort recommendations if 1-4 doesn't work

Here's the steps expanded:

Choose a theme you can get in a desktop version - a good place to see if you can find the theme you want is [gnome-look.org](https://www.gnome-look.org/browse?cat=135&ord=rating). Make sure if you use both user and system flatpaks you have a theme for both _(I personally only use userspace flatpaks from flathub to avoid complications)_ Here's the current list of flatpak theme runtimes as of writing:

```bash
❯ clear &amp;&amp; flatpak search --user --columns=app theme | grep org.gtk | sort -d
```

```bash
# output:
org.gtk.Gtk3theme.Adapta
org.gtk.Gtk3theme.Adapta-Brila
org.gtk.Gtk3theme.Adapta-Brila-Eta
org.gtk.Gtk3theme.Adapta-Eta
org.gtk.Gtk3theme.Adapta-Nokto
org.gtk.Gtk3theme.Adapta-Nokto-Eta
org.gtk.Gtk3theme.Adementary
org.gtk.Gtk3theme.Adwaita-dark
org.gtk.Gtk3theme.adw-gtk3
org.gtk.Gtk3theme.adw-gtk3-dark
. . .
```

You can see at the top of the list `adw-gtk3` and `adw-gtk3-dark` are separate packages, so if you wanted to support both light and dark modes, install them both (note, the `-u` flag means `user`):

```bash
❯ for THEME in adw-gtk3 adw-gtk3-dark; do flatpak install -uy org.gtk.Gtk3theme.$THEME; done
```

See if there's a packaged or scripted version of the same theme on your distro before installing from Gnome Look - I lucked out and there was one already in the AUR _(number 3 looked good to me!)_:

```bash
❯ paru -Ss adw-gtk3
aur/adw-gtk35.3-1 [+43 ~3.15]
   The theme from libadwaita ported to GTK-3
aur/adw-gtk3-git1.0.r2.a2a0114-1 [+15 ~1.21]
   The theme from libadwaita ported to GTK-3
aur/adw-gtk-theme1.1-2 [+12 ~1.00]
   LibAdwaita Theme for all GTK3 and GTK4 Apps. NOTE: This is a meta package
   which uses adw-gtk3 for GTK3 and official LibAdwaita theme for GTK4
```

If you do have to install a theme package manually, just remember they can go in either `/usr/share/themes/.` (system-wide) or `$HOME/.local/share/themes` (user), but **not both!**

Go to `kcm_style` in your KDE settings panel and choose "Configure GNOME/GTK Application Style" (top right)

```bash
❯ systemsettings kcm_style
```

![](/wp-content/uploads/2024/03/Screenshot_20240323_161012-1024x775.webp)

*KDE Settings Configuration (part 1)*

![](/wp-content/uploads/2024/03/Screenshot_20240323_161122-1-1024x775.webp)

*KDE Settings Configuration (part 2)*

Last step (hopefully):  
  
Tell `gsettings` your defaults - this has to be done from the command line unless you have `dconf-editor` or `gnome-tweaks` installed for some reason (unusual and unnecessary for a KDE-centric system). Here's the key-value pairs:

```bash
❯ gsettings set org.gnome.desktop.interface gtk-theme 'adw-gtk3-dark'; 
  gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'
```

Replace the values at the end with your particular theme and preference, of course (again, I choose `adw-gtk3-dark`, mostly because I knew it would be the best supported theme). Obviously, if you don't `'prefer-dark'` that second line is _optional_.

OK now try starting one of the flatpaks you've been having issues with and see how it went!

If it's still not loading in your preferred theme, I'd go back and check the steps to make sure you covered them properly. You can try `gsettings get` on `org.gnome.desktop.interface gtk-theme` to check that it has your proper value, or check `/usr/share/themes` to make sure a folder exists with the name of the theme you thought you installed (manually or with a package manager) or `$HOME/.local/share/themes/` if you installed it manually to your user folder.

If those all seem legit, check out `xsettingsd`: It looks like it's a dependency of `kde-gtk-config` on Arch Linux currently, so you might already have it:

```bash
❯ pacman -Qi xsettingsd
Name            : xsettingsd
Version         : 1.0.2-1
Description     : Provides settings to X11 applications via the XSETTINGS specification
Architecture    : x86_64
URL             : https://github.com/derat/xsettingsd
Licenses        : custom:BSD
Groups          : None
Provides        : None
Depends On      : libx11  gcc-libs
Optional Deps   : None
Required By     : kde-gtk-config
Optional For    : None
Conflicts With  : None
Replaces        : None
Installed Size  : 78.82 KiB
Packager        : Antonio Rojas <arojas@archlinux.org>
Build Date      : Mon 09 Aug 2021 04:16:10 AM PDT
Install Date    : Sat 16 Mar 2024 10:31:30 PM PDT
Install Reason  : Installed as a dependency for another package
Install Script  : No
Validated By    : Signature
```

Do the usual checks to make sure it's running (it's only visible using `systemctl --user` in Arch):

```bash
❯  systemctl --user status xsettingsd.service
● xsettingsd.service - XSETTINGS-protocol daemon
     Loaded: loaded (/usr/lib/systemd/user/xsettingsd.service; static)
     Active: active (running) since Sat 2024-03-23 14:35:18 PDT; 1h 52min ago
   Main PID: 469119 (xsettingsd)
      Tasks: 1 (limit: 9084)
     Memory: 156.0K (peak: 696.0K swap: 344.0K swap peak: 344.0K zswap: 55.8K)
        CPU: 4ms
     CGroup: /user.slice/user-1000.slice/user@1000.service/session.slice/xsettingsd.service
             └─469119 /usr/bin/xsettingsd

Mar 23 14:35:18 purplehippo systemd[1283]: Started XSETTINGS-protocol daemon.
Mar 23 14:35:18 purplehippo xsettingsd[469119]: xsettingsd: Loaded 14 settings from /home/avery/.config/xsettingsd/xsettingsd.conf
Mar 23 14:35:18 purplehippo xsettingsd[469119]: xsettingsd: Created window 0xc00001 on screen 0 with timestamp 5373106
Mar 23 14:35:18 purplehippo xsettingsd[469119]: xsettingsd: Selection _XSETTINGS_S0 is owned by 0x0
Mar 23 14:35:18 purplehippo xsettingsd[469119]: xsettingsd: Took ownership of selection _XSETTINGS_S0
Mar 23 14:53:07 purplehippo xsettingsd[469119]: xsettingsd: Reloading configuration
Mar 23 14:53:07 purplehippo xsettingsd[469119]: xsettingsd: Loaded 14 settings from /home/avery/.config/xsettingsd/xsettingsd.conf
```

If it's having an issue, try restarting it, or you can examine the configuration file it creates automatically in your `$XDG_CONFIG_HOME` dir and make sure it all looks reasonable:

```bash
❯ bat $XDG_CONFIG_HOME/xsettingsd/xsettingsd.conf
──────┬────────────────────────────────────────────────────────────
      │ File: /home/avery/.config/xsettingsd/xsettingsd.conf
──────┼────────────────────────────────────────────────────────────
  1   │ Gdk/UnscaledDPI 98304
  2   │ Gdk/WindowScalingFactor 1
  3   │ Gtk/EnableAnimations 1
  4   │ Gtk/DecorationLayout "icon:minimize,maximize,close"
  5   │ Net/ThemeName "adw-gtk3-dark"
  6   │ Gtk/PrimaryButtonWarpsSlider 0
  7   │ Gtk/ToolbarStyle 3
  8   │ Gtk/MenuImages 1
  9   │ Gtk/ButtonImages 1
 10   │ Gtk/CursorThemeSize 64
 11   │ Gtk/CursorThemeName "Posy_Cursor_125_175"
 12   │ Net/SoundThemeName "ocean"
 13   │ Net/IconThemeName "Papirus"
 14   │ Gtk/FontName "Noto Sans,  10"
 15   │ 
──────┴────────────────────────────────────────────────────────────
```

if THAT all looks fine, there was one last thing [on wiki.archlinux.org](https://bbs.archlinux.org/viewtopic.php?id=254038) that looked like it might work (especially with Window Manager-type setups like minimal tiling desktop such as sway and dwm - although, if you're into minimal WMs, not sure if you'd like flatpaks - in any event, nobody's a monolith...). You could put something like this in `$HOME/bin` and call it `refresh-flatpak-themes` (etc.) then run it when you see one getting dodgy:

```bash
#!/usr/bin/env bash
for FLATPAK_APP in "$HOME/.var/app/*"; do
  [ -d "$HOME/.var/app/$FLATPAK_APP/config/gtk-3.0" ] ||
  /usr/bin/ln -s "$HOME/.config/gtk-3.0" "$HOME/.var/app/$FLATPAK_APP/config/"
done
```

Which basically just loops through each flatpak app you have in your user's `.var` folder, checks to see if it has a `gtk-3.0` definition folder, and if not, makes a symbolic link to where one usually lives in your `$XDG_CONFIG_HOME`. You could try making the symlink to one manually to see if it works before setting up a script, but if it works out, hey, go for it.

Another option I saw which looks pretty elegant is [outlined here](https://forum.xerolinux.xyz/thread-152.html) on a xerolinux-specific BB, but should apply to pretty much any distro using the `xdg user-dirs` spec:

```bash
❯ export GTK3_THEME=(name of preferred theme);
  flatpak --user override \
    --filesystem=$HOME/.local/share/themes;
  flatpak --user override \
    --filesystem=$XDG_CONFIG_HOME/gtk-3.0:ro;
  for FLATPAK_APP in $HOME/.var/app/*; do \
  flatpak --user override $FLATPAK_APP \
    --env=GTK_THEME=$GTK3_THEME; done
```

Quick pointers for troubleshooting:

-   The `user-dirs.dirs` file usually lives at `$HOME/.config/user-dirs.dirs`

-   Any `$VARIABLE` can be echoed to the screen using `echo $VARNAME` _(make sure they're properly set)_
