---
title: Have I really not written about `rsync`?
description: Kyun-Chan, a shy, Japanese pika disguised as a deer There's lots of great backup tools out there - borg, rdiffbackup, bareos, zfs and btrfs send/receive, pvesync, etc. and the cutest mascotted backup program ever, of course, pikabackup (it's adorable!) all with their own traits…
summary: Kyun-Chan, a shy, Japanese pika disguised as a deer There's lots of great backup tools out there - borg, rdiffbackup, bareos, zfs and btrfs send/receive, pvesync, etc. and the cutest mascotted backup program ever, of course, pikabackup (it's adorable!) all with their own traits…
date: 2024-06-15T09:03:15Z
author: Avery Freeman
slug: have-i-really-not-written-about-rsync
categories:
  - Random
thumbnail: /post-thumbnails/attachment-861.webp
thumbnail_alt: Kyun-Chan, a shy, Japanese pika disguised as a deer
thumbnail_width: 290
thumbnail_height: 300
thumbnail_aspect: 0.9666666666666667
type: post
status: publish
url: /posts/2024/06/have-i-really-not-written-about-rsync/
---

<!-- Imported from WordPress post 859. -->

![Kyun-Chan, a shy, Japanese pika disguised as a deer](/wp-content/uploads/2024/06/kyun_chan_smaller_shy_japanese_pika_disguised_as_deer_v1-290x300.webp)

*Kyun-Chan, a shy, Japanese pika disguised as a deer*

There's lots of great backup tools out there - `borg`, `rdiffbackup`, `bareos`, `zfs` and `btrfs` send/receive, `pvesync`, etc. and the cutest mascotted backup program ever, of course, `pikabackup` (it's adorable!) all with their own traits and best-practice use cases.

I have to say, though, call me DIY, a glutton for punishment, or just plain nerdy, but I really like my hand-written backup scripts more than anything else. Part of it is because I want to know what is happening in the process intimately enough that debugging shouldn't be a problem, but I also find something satisfying about going through the process of identifying what each flag will do and curating them carefully for a specific use case, and (of course) learning new things about how some of my favorite timeless classics.

`rsync` is definitely one of those timeless classics. It's to copying files what `ssh` is to remote login: Simultaneously beautiful and indispensable. And so adaptable to whatever file-level copy procedure you want to complete. For example, check out what the Arch wiki suggests for replacing your typical copy (`cp`) and move (`mv`):

```text
cpr
```

It seems `rsync` flags are pretty personal, if someone's familiar, usually they'll have some favorite flags - whether they're easy to remember, they saw them somewhere else, or think they look cool to type. I know for me, mine are `-avhP` for home (user files) and `-aAvX` for root (system files), but I painstakingly researched the documentation for this next script to create my own `systemd.timer` backups to (you guessed it) [rsync.net](https://rsync.net):

```bash
TIMESTAMP="$(date +%Y%m%d_%Hh%Mm)"
LOGFILE="$HOME/.var/log/$TIMESTAMP_rsyncnet.log."
BATCHFILE=$HOME/.var/log/$TIMESTAMP-rsyncnet.sh
EXCLUDE_LIST={"*.iso","*.ISO","*.img",".asdf","build",".cache",".cargo",".config/google-chrome/Default/Service\ Worker/CacheStorage",".conda","containers",".cpan",".docker","Downloads",".dotnet",".electron-gyp","grive","go",".java",".local/share/flatpak",".local/share/Trash",".npm",".nuget","OneDrive",".pnpm-store",".pyenv",".rustup",".rye",".ssh",".var","Videos","vms",".yarn"}

rsync --log-file=$LOGFILE \
    -AcDgHlmoprtuXvvvz \
    --ignore-existing \
    --fsync --delete-after \
    --info=stats3,name0,progress2 \
    --write-batch=$BATCHFILE \
    --exclude=$EXCLUDE_LIST \
    $HOME $RSYNCNET:$(hostname); \
    ssh RSYNCNET cp $LOGFILE $(hostname)/.
```

where `$LOGFILE` is the (very detailed) log of the backup, `$TIMESTAMP` is the time the script is invoked, and the `$EXCLUDE_LIST` is stuff I don't want in my backups, like folders from other cloud services, browser cache, `$HOME/.ssh`, development libraries, flatpaks, and build directories for AUR and git repos.

A quick note about `--exclude`, it can be a little fiddly. It can be repeated for one flag at a time without an equals sign, e.g. `--exclude *.iso` `--exclude ~/Videos`, but if you want to chain them together, then they need the equals sign. I had them working from a separate file once years ago with each pattern on separate lines, but now I can't remember how I did it, so the big one-line mess with curly braces, commas, and single-pattern quotes is how I've been rocking it lately. It's ugly, but it works.

Here's the manual for `rsync` in case you actually want to know what the flags are doing (definitely recommend it): [https://linux.die.net/man/1/rsync](https://linux.die.net/man/1/rsync)

And another quick, but good, `rsync` reference by Will Haley: [https://www.willhaley.com/blog/rsync-filters/](https://www.willhaley.com/blog/rsync-filters/) - this guy does all sorts of interesting stuff, and I liked his granular, yet opinionated, walk-through of `rsync`: how he sees it. (spoiler: two people's `rsync`s are rarely the same)

Of course, file-level backups are _not_ the same as system images, and for that I use `fsarchiver`. If you're not familiar, I definitely recommend checking them, and their awesome Arch-Based rescue ISO distro out: [https://www.system-rescue.org/](https://www.system-rescue.org/)

I wrote my own script for that, too (of course), but I'll probably link it in a repo since it's quite a bit longer than the script for `rsync`. It is timed to run right before the `rsync` backup, in the same script, along with dumps of separate lists of my supported dist (`pacman -Qqe`) and AUR (`pacman -Qqm`) packages.

Oh, and also, if you ever need to do file recovery, check out granddaddy `testdisk`: [https://www.cgsecurity.org/testdisk\_doc/presentation.html](https://www.cgsecurity.org/testdisk_doc/presentation.html)

What's your favorite backup software, and why? Any stories about how they got you (or failed to get you) out of a bind? Unfortunately, everybody's got one these days... would love to hear about them in the comments below...
