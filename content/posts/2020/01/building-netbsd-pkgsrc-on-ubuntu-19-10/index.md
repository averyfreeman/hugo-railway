---
title: Building NetBSD pkgsrc on Ubuntu 19.10
description: pkgsrc is a package manager and port tree, kind of like FreeBSD ports and pkg combined. Messing around with my Ubuntu 19.10 rpool installation (ZFS is offered by default in the desktop installer now), and I couldn't help but think to myself, "gee, it sure would be cool if the AR…
summary: pkgsrc is a package manager and port tree, kind of like FreeBSD ports and pkg combined. Messing around with my Ubuntu 19.10 rpool installation (ZFS is offered by default in the desktop installer now), and I couldn't help but think to myself, "gee, it sure would be cool if the AR…
date: 2020-01-25T04:45:11Z
author: Avery Freeman
slug: building-netbsd-pkgsrc-on-ubuntu-19-10
categories:
  - Random
thumbnail: https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Pkgsrc.svg/1200px-Pkgsrc.svg.png
thumbnail_alt: Building NetBSD pkgsrc on Ubuntu 19.10
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2020/01/building-netbsd-pkgsrc-on-ubuntu-19-10/
---

<!-- Imported from WordPress post 271. -->

![](https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Pkgsrc.svg/1200px-Pkgsrc.svg.png)

*pkgsrc is a package manager and port tree, kind of like FreeBSD ports and pkg combined.*

Messing around with my Ubuntu 19.10 rpool installation (ZFS is offered by default in the desktop installer now), and I couldn't help but think to myself, "gee, it sure would be cool if the ARC was in `top` like it is in FreeBSD and OmniOS."

So I thought I'd try to compile the NetBSD version of top using pkgsrc, since I figured the BSD versions of posix software might have more resources for ZFS.

<!-- more -->

Pkgsrc isn't used on Linux very often. Maybe for some more obscure scientific and development purposes, but not common end-users. Therefore, I haven't seen a succinct guide on how to install it that's palatable to most users.

There IS a version of pkgsrc compiled for RHEL7, but the toolchain is super old and it doesn't appear to be compatible with Ubuntu 19.10. Therefore, you'll have to compile everything (including the package manager) from source if you want to use it with a modern Linux distribution.

I'm going to include resources for the information so you can dive into it with more detail, because chances are you'll need it given the complicated process, but the goal here is to create a start-to-finish how-to article that's easy for most people to follow without too much info that it becomes inundating.

Here's how I managed to build pkgsrc in my environment. Please note, I'm using an unprivileged (read: non-sudo) environment and built everything in my `$HOME` dir, but you're welcome to put it in the default `/usr` directory if you want - just modify accordingly.

Full documentation for pkgsrc lives here: [https://www.netbsd.org/docs/pkgsrc/](https://www.netbsd.org/docs/pkgsrc/)

TIP: Keep track of the `export`variables so can add them to your user's `.profile` or `.bashrc` files later.

Download pkgsrc using cvs - install cvs first if you don't have it (Source: [https://www.netbsd.org/docs/pkgsrc/getting.html](https://www.netbsd.org/docs/pkgsrc/getting.html)):

```text
$ cd ~/ && cvs -q -z2 -d anoncvs@anoncvs.NetBSD.org:/cvsroot checkout -r pkgsrc-2020Q1 -P pkgsrc
```

Navigate to `$HOME/pkgsrc/bootstrap` and invoke:

```text
$ unset PKG_PATH && export bootstrap_sh=/bin/bash && ./bootstrap --unprivileged
```

If something goes wrong, delete your `work` folder or set a new folder with `--workdir=path/to/new/tmp/dir`

Also, there's more info here that might be helpful with the bootstrapping process specific to Linux: [https://wiki.netbsd.org/pkgsrc/how\_to\_use\_pkgsrc\_on\_linux/](https://wiki.netbsd.org/pkgsrc/how_to_use_pkgsrc_on_linux/)

After pkgsrc is done bootstrapping, navigate to `$HOME/pkg` - you'll want to add `$HOME/pkg/bin` and `$HOME/pkg/sbin` to your `$PATH`

```text
$ export PATH=$HOME/pkg/bin:$HOME/pkg/sbin:$PATH
```

Set the `$PKG_PATH` and the `$MAKECONF`:

```text
$ export PKG_PATH=$HOME/pkg
$ export MAKECONF=$PKG_PATH/etc/pkgsrc.mk.conf
```

Then, add this file named `pkgsrc.mk.conf` to `$HOME/pkg/etc/`

```text
# pkgsrc.mk.conf
#
# configuration for non-root pkgsrc builds
# set $MAKECONF to this file for BSD makefiles (/usr/share/mk/*)
# to use it
#
# inspired by:
#   From: "Jeremy C. Reed" <reed@reedmedia.net>
#   Sender: tech-pkg-owner@NetBSD.org
#   To: tech-pkg@NetBSD.org
#   Subject: Re: pkgsrc as non-root?
#   Date: Sat, 27 Sep 2003 21:22:04 -0700 (PDT)

GROUP!=		/usr/bin/id -gn

SU_CMD=		sh -c
DISTDIR=	${HOME}/pkg/distfiles/All
PKG_DBDIR=	${HOME}/pkg/pkgdb
LOCALBASE=	${HOME}/pkg
PKG_TOOLS_BIN=	${HOME}/pkg/sbin
#INSTALL_DATA=	install -c -o ${BINOWN} -g ${BINGRP} -m 444
WRKOBJDIR=	${HOME}/tmp		# build here instead of in pkgsrc
OBJHOSTNAME=	yes			# use work.`hostname`
VARBASE=	${HOME}/var

CHOWN=		true
CHGRP=		true

ROOT_USER=	${USER}
ROOT_GROUP=	${GROUP}

BINOWN=		${USER}
BINGRP=		${GROUP}
DOCOWN=		${USER}
DOCGRP=		${GROUP}
INFOOWN=	${USER}
INFOGRP=	${GROUP}
KMODOWN=	${USER}
KMODGRP=	${GROUP}
LIBOWN=		${USER}
LIBGRP=		${GROUP}
LOCALEOWN=	${USER}
LOCALEGRP=	${GROUP}
MANOWN=		${USER}
MANGRP=		${GROUP}
NLSOWN=		${USER}
NLSGRP=		${GROUP}
SHAREOWN=	${USER}
SHAREGRP=	${GROUP}
ALLOW_VULNERABLE_PACKAGES=yes
.-include "$PKG_PATH/etc/mk.conf"
```

Obviously you'll want to edit variables that you configure differently, but this setup appears to be working well in my unprivileged config.

A note about the `ALLOW_VULNERABLE_PACKAGES` variable, I noticed when building the pkgsrc root there were a LOT of packages that were flagged vulnerable, so I decided to allow them in the repo in case I needed them (e.g. if they were dependencies). I figured I could audit them later if I needed to. Admittedly, it looks kind of scary, but I don't recommend not allowing them because it might cause all sorts of build issues if there's so many unavailable Makefiles. You can always audit them later.

OK, so now you can back go to `$HOME/pkgsrc` and build the `Makefile` for the repo - you have to use `bmake` located in `$PKG_PATH/bin` to do this with all the pkgsrc Makefiles:

```text
$ bmake configure && bmake install
```

This will probably take several hours to build depending on how powerful your machine is.

Note: I tried the `-j` variable, for instance I tried to assign `nproc` number of threads to use for the compilation, but this did not work - I got this error with bmake compiled with pkgsrc bootstrap, and also the one installed from the Ubuntu repo:

```text
ERROR: This package has set PKG_FAIL_REASON:
ERROR: [bsd.pkg.mk] pkgsrc does not support parallel make for the infrastructure.
```

On my Thinkpad T460s using a single core it's taken all night and morning, so if you're in a "hurry" this process is not for you. Also, it crashed on me in Gnome terminal, so I recommend going to another TTY (e.g. alt-shift-F2) starting the process, and leaving the computer alone for a day or two, coming back to check it periodically, of course. Be sure to turn suspend off in your power settings!

I'll come back and update this with how to use the repo + pkg manager itself once it's done. It should be pretty much ready to use after all this, and we'll see if I'll get my shiny new build of top w/ ARC level display (excited!).

Note: I found this compilation from Joyent specifically for Ubuntu: [http://mail-index.netbsd.org/pkgsrc-bulk/2019/10/03/msg017826.html](http://mail-index.netbsd.org/pkgsrc-bulk/2019/10/03/msg017826.html)

It might save Ubuntu users from having to compile the framework from source themselves, but it looks like they stopped building them after this one (the latest) back in October 2019, so it might not a good long-term solution.
