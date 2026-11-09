---
title: "`quickemu` PPA Available on Launchpad"
description: Up and running in about half an hour! I've been aware of quickemu for 4-5 years now, and just went out looking for it again since I thought it'd be helpful for a project on endpoint management with Microsoft Intune. I'd like to see if I can't set up a few devices running Windows…
summary: Up and running in about half an hour! I've been aware of quickemu for 4-5 years now, and just went out looking for it again since I thought it'd be helpful for a project on endpoint management with Microsoft Intune. I'd like to see if I can't set up a few devices running Windows…
date: 2024-08-17T09:16:11Z
author: Avery Freeman
slug: quickemu-ppa-available-on-launchpad
categories:
  - Random
thumbnail: /post-thumbnails/attachment-991.webp
thumbnail_alt: "`quickemu` PPA Available on Launchpad"
thumbnail_width: 480
thumbnail_height: 345
thumbnail_aspect: 1.391304347826087
type: post
status: publish
url: /posts/2024/08/quickemu-ppa-available-on-launchpad/
---

<!-- Imported from WordPress post 974. -->

![Windows Server bootstrapped by Quickemu](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-01-46-49-1024x737.webp)

*Up and running in about half an hour!*

I've been aware of `quickemu` for 4-5 years now, and just went out looking for it again since I thought it'd be helpful for a project on endpoint management with Microsoft Intune. I'd like to see if I can't set up a few devices running Windows, Mac OS, Ubunu and Redhat, remotely manage some dependencies and document retention features, and eventually destroy them "remotely" in a mock trial of a lost laptop and/or stolen domain controller.

Has anyone else tried `quickemu`? It's a VM bootstrapping framework for Linux comprised of bash scripts, a UI written in `flutter`, there's a new test-writing framework called `quicktest` somewhat in the vein of `vagrant` but unencapsulated, and last but not least, my favorite, `quickget`. The entire ecosystem's goal is to allow people to quickly bootstrap and run tests with VMs in a Linux or MacOS environment with a few simple commands. It's not particularly well documented, but it is very functional, and the most interesting part is its wide range of operating systems you can download with `quickget`. So what's available out there to play around with?

About every Mac OS flavor you could imagine that runs on Intel - these are getting older, but should still be supported a few more years. (QEMU _can_ emulate other chipsets, albeit slowly, but it's entirely possible there's work being done on that front). There's Nearly every on-prem version of Windows available, including Windows Server, Unix-like OS including something like 20 Linux distros, FreeBSD, OpenBSD, DragonflyBSD - you name it. Each with their own sane set of defaults to get a VM up and running locally in no time at all.

I'd usually installed `quickemu` directly from a clone of their repo, or via AUR scripts in the past, but I've been running a copy of Ubuntu on one of my machines after documenting the [installation of Ubuntu in a very Arch-like way](/posts/2024/08/the-miracle-of-debootstrap-installing-ubuntu-to-thin-lvm-in-a-very-archlinux-like-way) since I thought I should start with a supported OS for Intune, and see the world through the eyes of the more "mainstream" Linux users among us, even while being too picky for installers for bare metal provisioning after using Arch for the last few years.

Along those lines of pretending to be "mainstream", I discovered there's a PPA I just found that appears to be tracking the official repo closely: [https://launchpad.net/~flexiondotorg/+archive/ubuntu/quickemu](https://launchpad.net/~flexiondotorg/+archive/ubuntu/quickemu)

This makes adding it to deb-style distros a breeze, and, if the maintainer keeps with it, should also include updates through `apt` when they're available. It appears the maintainer is one of the main protagonists of the project, Martin Wimpress (thanks, Martin!) and their project seems quite vibrant - I think I first discovered it back in 2019, and it's still going strong (probably because it's so cool). If you'd like to get involved with the project, their repo is here: [https://github.com/quickemu-project](https://github.com/quickemu-project) and even if you're not a developer, I'm sure they'd love people contributing art or documentation.

Let's try it out:

```bash
# adding the PPA
sudo add-apt-repository ppa:flexiondotorg/quickemu

# quickemu installed already by default
quickemu --version
# 4.9.6

sudo systemctl daemon-reload

# I've been wanting to try quicktest, so this is exciting
sudo apt install quicktest quickgui
```

The beauty of `quickemu` is mainly in the command line - the lifecycle typically starts with a program for OS retrieval, `quickget` (I'm in love with this program)

```bash
quickget -h

             _      _              _
  __ _ _   _(_) ___| | ____ _  ___| |_
 / _` | | | | |/ __| |/ / _` |/ _ \ __|
| (_| | |_| | | (__|   &lt; (_| |  __/ |_
 \__, |\__,_|_|\___|_|\_\__, |\___|\__|
    |_|                 |___/ v4.9.6, using curl 8.5.0
--------------------------------------------------------------------------------
 Project - https://github.com/quickemu-project/quickemu
 Discord - https://wimpysworld.io/discord
--------------------------------------------------------------------------------

Usage:
  quickget &lt;os> &lt;release> [edition]
  quickget ubuntu 22.04

Advanced usage:
  quickget &lt;arg> [path] &lt;os> [release] [edition]
  quickget --download ubuntu 22.04

Arguments:
  --download      &lt;os> &lt;release> [edition] : Download image; no VM configuration
  --create-config &lt;os> [path/url]          : Create VM config for a OS image
  --open-homepage &lt;os>                     : Open homepage for the OS
  --show          [os]                     : Show OS information
  --version                                : Show version
  --help                                   : Show this help message
-------------------------- For testing &amp; development ---------------------------
  --url           [os] [release] [edition] : Show image URL(s)
  --check         [os] [release] [edition] : Check image URL(s)
  --list                                   : List all supported systems
  --list-csv                               : List everything in csv format
  --list-json                              : List everything in json format
--------------------------------------------------------------------------------

Supported Operating Systems:

alma alpine android antix archcraft archlinux arcolinux artixlinux athenaos
batocera bazzite biglinux blendos bodhi bunsenlabs cachyos centos-stream
chimeralinux crunchbang++ debian deepin devuan dragonflybsd easyos edubuntu
elementary endeavouros endless fedora freebsd freedos garuda gentoo ghostbsd
gnomeos guix haiku holoiso kali kdeneon kolibrios kubuntu linuxlite linuxmint
lmde lubuntu macos mageia manjaro mxlinux netboot netbsd nitrux nixos nwg-shell
openbsd openindiana opensuse oraclelinux parrotsec peppermint popos porteus
primtux pureos reactos rebornos rockylinux siduction slackware slax slint
slitaz solus sparkylinux spirallinux tails tinycore trisquel truenas-core
truenas-scale tuxedo-os ubuntu ubuntu-budgie ubuntu-mate ubuntu-server
ubuntu-unity ubuntucinnamon ubuntukylin ubuntustudio vanillaos void vxlinux
windows windows-server xubuntu zorin
```

Isn't that cool? Just choose your VM you want to bootstrap, and it downloads the ISO and spits out a `your-chosen-OS.conf` file with sane defaults in the directory you run it in, along with helpers like `ovmf` for `uefi` devices in a subdirectory by the same name (I usually put mine in `$HOME/vms`).

The project hasn't been particularly well documented, often forcing users to read threads in their issues or on support forums, but the are working on a wiki, which is really encouraging: [https://github.com/quickemu-project/quickemu/wiki](https://github.com/quickemu-project/quickemu/wiki) Hopefully the `quickemu` help menu has gotten better, too, since it's left me a little clueless in the past.

Since I'm pretending to be mainstream for now, though, why not check out what most users will probably gravitate towards - the graphical user interface. I haven't seen `quickgui` in ages, but I remember it was brand new last time I saw it. It's always looked simple, but elegant - even then. At that point, it required finding one of `quickemu`'s `.conf` files in a file chooser, and because it didn't have any packaging to speak of (I compiled it), it wasn't integrated with the desktop with `.desktop` files and icons, and had to be run from the command line.

This time, `quickgui` was immediately available in my desktop, which was pretty remarkable considering what I'd remembered going through previously. I'm on `vanilla-gnome-desktop` on Ubuntu `Noble`/`24.04`. And since there's so many cray distros nobody will ever support sprouting day after day, the project also releases `AppImage` files (available in the Github repo).

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-14-37.webp)

Woah, that _was_ quick!

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-05-58-1024x858.webp)

The interface is beautifully straightforward.

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-05-52-1024x858.webp)

Ooh, looks like dark mode is in the works, but not implemented yet (looking forward to that)

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-07-40-1024x858.webp)

Create a folder to organize your VMs in userspace - for the record, the `quickemu` ecosystem is not really meant for `virsh` / `virt-manager` compatibility, so `/var/lib/libvirtd/images` is out (and don't run `quickgui` as root - `virt-manager`'s default permissions on my system have been `libvirt-qemu:kvm`)

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-09-40-1024x858.webp)

Select an OS to play around with. I thought I'd get into Windows Server for my Intune project - oh look, here it is!  
  
These are the icons from their `quickemu-icons` repo (very nice!): [https://github.com/quickemu-project/quickemu-icons](https://github.com/quickemu-project/quickemu-icons)

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-09-50-1024x858.webp)

Choose your version - looks pretty up to date!

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-12-51-1024x858.webp)

Choose your language

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-00-12-59-1024x858.webp)

Hit `download` and we're off and running

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-01-13-10-1024x858.webp)

Then, close the window and go back to `manage existing machines`. Look, here it is:

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-01-14-56-1024x858.webp)

The window was a little tiny, and I had to reboot into the BIOS and select the file on the `edk2` partition they so generously include for us (not the `dvd-rom`), but it appears to be working after that minor snafu.

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-01-21-43-1024x737.webp)

Sure enough, I was able to walk through the installation steps, no problem. Nice!

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-17-01-51-17-1024x737.webp)

BTW, if you also want to install Windows Server, the server eval edition license is good for 180 days, plenty of time to use for educational purposes or to buy a license. You can find out more about licensing here on Microsoft's official volume licensing repo: [https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/get-started/kms-client-activation-keys.md](https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/get-started/kms-client-activation-keys.md)

To be sure, some of the default settings are a little quirky (e.g. I'd definitely recommend making a network bridge) but they are understandable and elegant once you get used to them, and there's other neat features like a built-in ssh tunnel to your VMs. For more info on networking specifically, I found it in this part of the wiki: [https://github.com/quickemu-project/quickemu/wiki/05-Advanced-quickemu-configuration](https://github.com/quickemu-project/quickemu/wiki/05-Advanced-quickemu-configuration)

Have fun!
