---
title: Booting Fedora 36 on default btrfs partition structure from the grub prompt
description: One of the many logos from the many articles discussing Fedora 33's stunning move to finally ditch XFS, after their unfortunate habit of talking much trash about btrfs for a number of years Hey I ran into an issue where I had an unpopulated grub menu on a Fedora 36 Workstation i…
summary: One of the many logos from the many articles discussing Fedora 33's stunning move to finally ditch XFS, after their unfortunate habit of talking much trash about btrfs for a number of years Hey I ran into an issue where I had an unpopulated grub menu on a Fedora 36 Workstation i…
date: 2022-05-26T14:05:28Z
author: Avery Freeman
slug: booting-fedora-36-on-default-btrfs-partition-structure-from-the-grub-prompt
categories:
  - Random
thumbnail: /post-thumbnails/attachment-585.webp
thumbnail_alt: Booting Fedora 36 on default btrfs partition structure from the grub prompt
thumbnail_width: 480
thumbnail_height: 252
thumbnail_aspect: 1.9047619047619047
type: post
status: publish
url: /posts/2022/05/booting-fedora-36-on-default-btrfs-partition-structure-from-the-grub-prompt/
---

<!-- Imported from WordPress post 584. -->

![](/wp-content/uploads/2022/05/image.webp)

*One of the many logos from the many articles discussing Fedora 33's stunning move to finally ditch XFS, after their unfortunate habit of talking much trash about btrfs for a number of years*

Hey

I ran into an issue where I had an unpopulated grub menu on a Fedora 36 Workstation installation. It ended up only booting to the empty menu, but at least I could drop to a prompt to try and figure out how to get through it.

The usual booting with a live USB, mounting the affected drive to `/mnt` and the other partitions and bind mounts respectively, and rebuilding `grub.cfg` from `chroot` didn't appear to be functional due to an error in the chroot environment that makes it unable to see `/dev` and use any of the usual tools to build the file.

**TL;DR** -

**All you really need to read in this article to boot from grub prompt is in the 2nd codeblock below** (some people just here for the lols)

So booting from the grub prompt was necessary in order to be in an environment where `/dev` would be recognized and `grub.cfg` could be rebuilt - since `grub.cfg` isn't anything that can be edited manually, unfortunately (it looks like it could be the way it's named, but if you know anything about how grub works, you know it's definitely not. Not even a little bit...)

I had written a while back about how to use the grub prompt in general here: [The GRUB prompt: Demystified](/posts/2021/04/the-grub-prompt-demystified)

The example I gave in the last article was done on Ubuntu. It looks like pretty much any other grub rescue operation using EXT4, XFS, etc. but it's actually a homebrew ZFS initrd- I used to make my own ZFS built-in kernels regularly, and threw together a script for automating the process if you're interested: [https://github.com/averyfreeman/zfs-kernel-builder](https://github.com/averyfreeman/zfs-kernel-builder)

But lately I've been dabbling with Fedora so this article's related to Fedora. It's upstream for some great software, what can I say. I had an NVMe from a Thinkpad I've had for a couple years I tried to swap into a newer Thinkpad I was upgrading to, because Thinkpads. For some reason `grub.cfg` got hosed in the process and I couldn't boot from it.

Not wanting to take too much time troubleshooting, I fresh-installed a new copy of Fedora 36 to another NVMe in the new laptop and copied as much as I could from `/home` and a package list from `repoquery -a --installed` run using `chroot` from the old NVMe in an external enclosure (gee willikers, I sure love my external NVMe with Thunderbolt 3, by golly).

Since I still had the old installation all set up, I thought I'd try and rescue it eventually, so when I got a moment I booted it from the external NVMe enclosure on another laptop with Thunderbolt using VMware Workstation and the enclosure as a physical disk `.vmdk` (hypervisors are awesome).

After failing with the tried-and-true live USB `chroot` rescue method, at least I could get into the grub menu without issue. That poor, empty menu, so lonely feeling with its 0 boot loader entries. I knew the OS was still there, but how to get into it without the entries? What's a nerd to do? Start messing around with the prompt to explore how to crack open the damn thing!

Since this was btrfs, of course, it was a little different, and since each distro uses a different subvolume layout, none of the info about any of them translate to the others very well. At the time of writing, I didn't see any definitive info on how to boot from grub prompt on stock btrfs Fedora Workstation, which is kind of surprising since it's been btrfs default for 3-4 years now, since version 33.

[There's a great guide here about Ubutntu using btrfs on "nixventure"](http://nixventure.blogspot.com/2015/08/grub-rescue-btrfs.html), which I admit I'd never heard of before, but appears very thorough, and I saw one from Debian (I believe) that I'm not going to reference because it was less remarkable, but Fedora there were just a bunch of forums with people flailing about trying to figure out the same thing I was, and ending up being unsuccessful and presumably giving up from the look of their abruptly truncated threads. So that was concerning, to say the last.

I even tried ["rescatux"](https://www.supergrubdisk.org/rescatux/) automated rescue tool, if you can believe that, because I was being lazy and kind of running out of ideas. I can't say I give it a glowing review, but it tries. That statement probably indicates how well it worked for my needs. I had to suck it up and adapt what I knew about using the grub prompt to the new partition layout and filesystem. Thankfully, it all turned out well in the end.

Here's some notes I took while I was working through the process:

```text
# Fedora's variant of grub has some helpful btrfs-specific commands:

grub> help

. . . commands . . . 
btrfs-get-default-subvol (hd0,gpt3)
btrfs-info
btrfs-list-subvols (hd0,gpt3)
btrfs-mount-subvol
. . . more commands . . .  

# so you get information like this:

grub> btrfs-list-subvols (hd0,gpt3)

ID 256 path home
ID 257 path root
ID 258 path var

# and this:

grub> btrfs-info (hd0,gpt3)

Label: 'fedora_treygouty' uuid: 7caff388-2bb3-434a-a927-096dac2dc892
        Total devices 1 FS bytes used 298520481792

# Intuitively, I thought this would work, but I was mistaken:

grub> linux /vmlinuz-5.17.9-300 <tab-tab works> root=UUID=7caff388-2bb3-434a-a927-096dac2dc892 ro rootflags=subvol=root

# You'd probably have to write all that out by hand, so be thankful I'm telling you ahead of time it didn't work for me
```

**TL;DR #2 - you're getting closer ...**

Anyway, I'll cut to the chase and show how I did it. Note, again, for the record, this is the bare-minimum default partition structure on an Anaconda installed Fedora 36 Workstation setup. No LUKS or other encryption, no LVM.

Note: For the record, this is the first Anaconda (RedHat's) installer where LVM hasn't been enabled for the default partition configuration. LVM is marginally useful for btrfs, I've tried it before on OpenSUSE, but comparitively it's _much_ less of a crutch than it is for EXT4 or XFS filesystems. So if RH's installer says don't bother with LVM, don't bother... It's RH, you know how they LOVE their LVM, if _they're_ not recommending it it _really_ must not be necessary. /rant

```text
# Quick grub prompt recap --
# First, list your storage devices:

grub> ls

(proc) (hd0) (hd0,gpt3) (hd0,gpt2) (hd0,gpt1) (cd0) (cd0,msdos2) 

# If you're lucky like me and you only have one drive connected, /boot will be easy to find. /boot is almost always gpt2, and there's only one hard drive, so...:

grub> set root=(hd0,gpt2)

grub> ls /

config-5.17.9-300.fc36.x86_64
efi
extlinux
grub2
initramfs-0-rescue-334f7d6e8a0942d388bafdab5fa2a0a1.img
initramfs-5.17.9-300.fc36.x86_64.img
loader
lost+found
symvers-5.17.9-300.fc36.x86_64.gz
System.map-5.17.9-300.fc36.x86_64
vmlinuz-0-rescue-334f7d6e8a0942d388bafdab5fa2a0a1
vmlinuz-5.17.9-300.fc36.x86_64

# Set your vmlinuz and root device + partition. Here (hd0,gpt3) corresponds with /dev/sda3:

grub> linux /vmlinuz-5.17.9-300.fc36.x86_64 root=/dev/sda3 ro rootflags=subvol=root

# Then boot 'er up:

grub> boot
```

That's really all there is to it. It's not too bad once you know what you're doing. Since the process is so short, you might want to poke around some more to try and get more info, or to try and give your life meaning. There's the `(hd0,gpt2)/grub/grub.cfg` file, or the `/loader/entries folder` - you can `cat` anything in either of those. Type `help` or something. Go wild.

Coincidentally, all the loaders were in the loader directory the entire time, but none of them would load all of the things. Such a bummer when one cannot load all of the things. So, frustrating, but glad it all worked out in the end. Hope this helps someone else, too.
