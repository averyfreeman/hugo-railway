---
title: Bring Single-Meta-Keypress Overview Behavior to KDE6 (just like Gnome!)  - and a bit on KDE configuration files...
description: "I missed KDE... best of both worlds? UPDATE: I tried to implement these instructions on a new installation of KDE, and realized I made some mistakes: The kwin accelerator that should be used is Overview, not ExposeAll as I had originally thought, because ExposeAll doesn't allow…"
summary: "I missed KDE... best of both worlds? UPDATE: I tried to implement these instructions on a new installation of KDE, and realized I made some mistakes: The kwin accelerator that should be used is Overview, not ExposeAll as I had originally thought, because ExposeAll doesn't allow…"
date: 2024-03-24T00:20:00Z
author: Avery Freeman
slug: kde-can-have-meta-super-key-blow-up-the-screen-just-like-gnome
categories:
  - Random
thumbnail: /post-thumbnails/attachment-743.webp
thumbnail_alt: Bring Single-Meta-Keypress Overview Behavior to KDE6 (just like Gnome!)  - and a bit on KDE configuration files...
thumbnail_width: 480
thumbnail_height: 221
thumbnail_aspect: 2.171945701357466
type: post
status: publish
url: /posts/2024/03/kde-can-have-meta-super-key-blow-up-the-screen-just-like-gnome/
---

<!-- Imported from WordPress post 742. -->

![Gnome-like overview in KDE 6 set to a single meta keypress](/wp-content/uploads/2024/03/Screenshot_20240323_171505-1024x471.webp)

*I missed KDE... best of both worlds?*

UPDATE: I tried to implement these instructions on a new installation of KDE, and realized I made some mistakes:

-   The `kwin` accelerator that should be used is `Overview`, _not_ `ExposeAll` as I had originally thought, because `ExposeAll` doesn't allow for searching outside of the Window names (can't find applications, files, etc.). I am pretty sure my understanding of their features was backwards when I originally wrote the article. I have corrected the article to reflect using `Overview` only.

-   One of the people who responded said there's no need for the `[ModifierOnlyShortcuts]` portion in `$HOME/.config/kwinrc` - maybe try only editing `kglobalshortcutsrc` first and restarting `sddm` before adding it?

-   People who have configured this behavior often mention rebooting their computer in order for it to start working, but it's not necessary. You can restart the login process with `sudo killall sddm` or `sudo systemctl restart display-manager`, the latter of which is display-manager agnostic (if you use something else like `gdm3`, `lightdm/slickgreeter`, `lemus`, etc.)

Like a lot of things in the tech world these days, it all started with a short question on Reddit:

> [Keyboard shortcut to search programs in overview like Gnome?](https://www.reddit.com/r/kde/comments/1b3bem5/keyboard_shortcut_to_search_programs_in_overview/)  
> by[u/AveryFreeman](https://www.reddit.com/user/AveryFreeman/) in[kde](https://www.reddit.com/r/kde/)

Teal;Deer:

> I found out the meta-only modifier is one thing that needed to be set in `$HOME/.config/kwinrc`, but also the `Overview=Meta` config in `$HOME/.config/kglobalshortcutsrc` - so there's two places where it needs to be set. You're supposed to be able to add `/KWin reconfigure` to the end to make it work immediately (reloads kwin config), but I've only been able to get it to work by killing `sddm` and logging back in. But hey, thanks so much for pointing me in the right direction!

The biggest impediment to getting the Gnome-like `super` key behavior in KDE is getting KDE to interpret a single keypress as a keyboard shortcut. If you look at it critically, you can see there's a lot going on in that single keypress in Gnome: In Gnome, a single keypress gives you both the open windows overview, and a search bar, and even has additional menus accessible from repeating the action (double-pressing `super`).

KDE isn't really able to allow single-keypress shortcuts _by default_, but there's a spot they've carved out where users can add the behavior if they _really want to_ (I get the sense it's _caveat emptor_). I've never been particularly interested in sticking to pre-defined conventions, so I set out to find out how we could make `super` behave like it does in Gnome. It couldn't be _that_ hard, right?

I wanted to know what was going on under the hood, so I did some digging. The most complete reference on the KDE configuration files I've found so far is here: [https://userbase.kde.org/KDE\_System\_Administration/Configuration\_Files](https://userbase.kde.org/KDE_System_Administration/Configuration_Files)

There's a whole bunch of really great examples here: [https://userbase.kde.org/Plasma/Tips](https://userbase.kde.org/Plasma/Tips)

There's some man files that are also helpful here (I don't think this particular spec has changed from KDE 5 to 6):  
[https://linuxcommandlibrary.com/man/kreadconfig5](https://linuxcommandlibrary.com/man/kreadconfig5)  
[https://linuxcommandlibrary.com/man/kwriteconfig5](https://linuxcommandlibrary.com/man/kwriteconfig5)

I found the shortcuts in KDE6 are located in a file named `/home/$USER/.config/kglobalshortcutsrc`. They're grouped by category with the names in brackets, like `[ActivityManager]`, `[kmix]`, etc.

So, related to my question, when I opened this file, under `[kwin]` I found this:

```bash
# $HOME/.config/kglobalshortcutsrc
[kwin]
Activate Window Demanding Attention=Meta+Ctrl+A,Meta+Ctrl+A,Activate Window Demanding Attention
Cycle Overview=Meta+Tab,none,Cycle through Overview and Grid View
Cycle Overview Opposite=none,none,Cycle through Grid View and Overview
. . . 
# The important bit is right here, was line 62 in my config:
Overview=Meta\tMeta+W,Meta+W,Toggle Overview
. . .
```

And when I ran the following:

```bash
kreadconfig6 --file kglobalshortcutsrc --group kwin --key Overview
```

I get this response in my terminal:

```bash
Overview=Meta\tMeta+W,Meta+W,Toggle Overview
```

So in reference to the `kreadconfig6` syntax, the `key` is the `kwin` action named `ExposeAll`. The group should be the category of actions, `[kwin]`. The harder part is keeping the description in there when writing from the command line, because it's tab-separated, `\t` to the right of the same line. But anyway, it should be written like this, as a key-value pair - key has an explicit flag, and value is whatever is after it. The value has spaces, so be sure to put it in quotes:

```bash
kwriteconfig6 --file kglobalshortcutsrc --group kwin --key Overview "${YOUR_META_KEY_OVERVIEW_VALUE}"
```

Specific example is like this:

```bash
kwriteconfig6 --file kglobalshortcutsrc --group kwin --key Overview "Meta\tMeta+W,Meta+W,Toggle Overview"
```

I'm not sure if `kwriteconfig6` can sort out the tab-separated sections on its own, but I imagine it probably can. I have shied away from editing these config files in a text editor just in case there's some specificity they have regarding tab and whitespace I might mess up, but I imagine it could be one option - if you try it, be sure to use a `tabspace` v `whitespace` identifier plugin for `vim`

Now, I'm not showing you all this stuff just to be geeky, but because you _cannot configure this behavior from the GUI_ under `Ksettings -> Shortcuts -> Kwin`, - it doesn't allow modifier keys like `Meta` to be assigned without an additional keypress.

Note from update on 10/30/2024: A reader has disputed the validity of this next section, you may want to stop here and restart your display manager and see if your configuration works before adding these additional lines. If not, come back and finish it out.

A bigger issue might be specifying that you can use only a modifier key as a shortcut (e.g. `meta`, `alt`, `shift`, etc.) which is what the answer to my reddit question addressed (although I don't think they were aware, exactly).

Therefore, settings need to be created or modified in two separate places, once for the key behavior, `Overview` (previous example), and another for _allowing the key to behave like a shortcut_. As far as I can tell, allowing `Meta` on its own to 'be' a shortcut _does_ need to be invoked at the command line. Here's the process:

`Meta` (the keypress) is the `key` value in the pair, analogous to the example with `Overview`. It will end up in the config file for `kwin`:

```bash
# $HOME/.config/kwinrc 

[ModifierOnlyShortcuts]
Meta=org.kde.kglobalaccel,/component/kwin,org.kde.kglobalaccel.Component,invokeShortcut,Overview
```

Coincidentally, there the syntax to add it is provided at the end of the `kwriteconfig5` man file I linked above. At the very end, it gives the example:

```text
### example only - using krunner not Overview ###
kwriteconfig5 --file ~/.config/kwinrc --group ModifierOnlyShortcuts --key Meta "org.kde.kglobalaccel,/component/krunner_desktop,org.kde.kglobalaccel.Component,invokeShortcut,_launch"
```

… which is for launching `krunner` if you hit `meta` by itself.

If you'd want the config to be reloaded (to start working immediately) you can add `/KWin reconfigure` to the end. I have not found this to be the case, but you can try it (who knows). Configuring KDE seems to be a bit of a dark art.

The only way I've been able to get the config to start behaving the way I intend is by killing the display manager and logging back in:

```bash
sudo systemctl restart display-manager
```

So, if you have the `Overview` behavior in your `kglobalshortcutsrc` and the (disputed) `[ModifierOnlyShortcuts]` section in your `kwinrc`, pointing to `Overview` being invoked by `org.kde.globalaccel.component`, and you've just logged back in, which has re-loaded all of these configuration files we've been talking about ...

Plasma should interpret a `Meta` keypress as a shortcut, not a modifier - aka, by itself, without any other keys, and basically give us that behavior that's essentially just like Gnome. That's why we're going through all of this, right?

TBH I was trying all sorts of stuff when I was doing this and am not sure the exact point at which I got the desired behavior, it might require re-logging in or something like that, too. But these are the two elements you'd need in which to get the Gnome-like action from smashing your `Meta` key.

One last thing - you may have noticed there's a more _conventional_ keyboard shortcut `Meta+W` for `Overview` in `$HOME/.config/kglobalshortcutsrc` - one that actually _combines_ two keys, like _normal_ (seems quaint. Gnome has ruined me for other desktops forever)

```text
[kwin]
. . . 
Overview=Meta\tMeta+W,Meta+W,Toggle Overview
. . .
```

That's because the `userbase.kde.org` site I linked at the top says a single-key shortcut (`Meta`) might not work if there isn't a key combination shortcut also configured for the same action (`Meta+W`). Note: The convention for all of these is:  
1\. FIRST section are however many USER-CONFIG shortcuts, separated by tabstops (`\t`)  
2\. SECOND shortcut listed is the DEFAULT shortcut, after the first comma  
3\. THIRD is the description, after the final comma.

Lastly, I threw together a little one-liner that dumps all the configs into a single text file for analyzing. It makes them a little easier to sift and not have to open each one individually. Just run it from the `$HOME/.` folder:

```text
for i in $(ls -a1 .config/k*); do echo "File: $(pwd)/$i"; echo ' '; cat $i; echo ' '; echo '--- end ---';  echo ' '; done > ./kde-config-files.txt
```

I'll probably put all my KDE6 configs in a git repo one of these days, but for now, I'm off to study `golang`
