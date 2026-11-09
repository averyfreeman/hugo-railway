---
title: "The GRUB prompt: Demystified"
description: OK, so practically everyone who uses Linux has come to this menacing prompt at least once or twice. Typically, unless you're a seasoned sysadmin, it's a harbinger of death, requiring more than you bargained for to be able to use the computer that day without dire intervention. B…
summary: OK, so practically everyone who uses Linux has come to this menacing prompt at least once or twice. Typically, unless you're a seasoned sysadmin, it's a harbinger of death, requiring more than you bargained for to be able to use the computer that day without dire intervention. B…
date: 2021-04-06T05:19:38Z
author: Avery Freeman
slug: the-grub-prompt-demystified
categories:
  - Random
thumbnail: https://lh3.googleusercontent.com/proxy/DQOyfL1SFKFS33jY23nEia0VOwqkRHph7wrpQfaeyN8SkCb-FhmT7xVCW8DxWMtehVV7_G29OvlGlm2FIDxKXOiT
thumbnail_alt: Free Computer People Cliparts, Download Free Computer People Cliparts png  images, Free ClipArts on Clipart Library
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2021/04/the-grub-prompt-demystified/
---

<!-- Imported from WordPress post 409. -->

![Free Computer People Cliparts, Download Free Computer People Cliparts png  images, Free ClipArts on Clipart Library](https://lh3.googleusercontent.com/proxy/DQOyfL1SFKFS33jY23nEia0VOwqkRHph7wrpQfaeyN8SkCb-FhmT7xVCW8DxWMtehVV7_G29OvlGlm2FIDxKXOiT)

OK, so practically everyone who uses Linux has come to this menacing prompt at least once or twice. Typically, unless you're a seasoned sysadmin, it's a harbinger of death, requiring more than you bargained for to be able to use the computer that day without dire intervention.

But if you know how to navigate the GRUB prompt, you can get back to work just like you were hoping.

These two skills are extremely useful to have in your arsenal of command-line fu, because if you can knowledgably tackle a GRUB prompt in a reasonable amount of time, it can save you hours of headaches and hassle.

So don't be afraid, embrace the unknown and learn how to navigate GRUB!

<!-- more -->

First of all, what's a GRUB prompt?

```text

             GNU GRUB Version 2.04~beta2-36ubuntu3.15
Minimal BASH-like line editing is supported. For the first word, TAB lists possible for device or command completion.

grub>
```

It's a black screen that has a prompt like this, instead of the list of OS you were hoping to boot.

_What do you need to know to boot from a GRUB prompt?_

You should have...

1.  A decent understanding of what disk-type devices you have in your computer
2.  A working memory of which partition is used for what purpose
3.  The ability to differentiate between which root GRUB is asking you for at which time

I'll explain what #3 means more in a minute, but first let's start with #1 - _building a decent understanding of what disk-type devices you have in your computer:_

Unix-like operating systems locate all system devices in a folder hierarchy, starting with `/dev`

Where `*` denotes a number or letter for ordering, typical disk-type endpoints in the `/dev` folder are `/dev/sd**` and `/dev/nvme*n*p*` in Linux, `/dev/da*` and `/dev/ada*` in FreeBSD, or `/dev/dsk/c*t*d*` and `/dev/rdsk/c*t*d*` in Solaris-like OS.

While not all these OS use GRUB by default, all of these OS are potential consumers of the GRUB bootloader, and all _must_ have a bootloader of some kind, so understanding what to look for might become useful even if not specifically troubleshooting GRUB.

But, back to GRUB specifically, the only reason you need to know which `/dev` your disk is is so you can point GRUB to which partiton to ultimately boot from.

That's because the GRUB prompt throws the standard heirarchy for disk devices and partitions out the window, and instead presents you with an ordering system that looks like this:

```text

grub> ls
(hd0) (hd0,gpt1) (hd0,gpt2) (hd0, gpt3) (hd0,gpt4) (hd1) (hd1,gpt1) (hd1,gpt9)
grub>
```

This is an actual scenario of a computer with two hard drives, `(hd0)` and `(hd1)`, the first drive is configured to boot using UEFI. `(hd0)` is a typical partition structure created by default using an Ubuntu installer. `(hd1)` looks like what you might see when looking at a volume formatted using ZFS (which is beyond the scope of this article).

Which brings me to topic #2: _You need to be able to remember which partition is responsible for what function_...

Say `(hd0,gpt1)` is your installer-created EFI partition. That is very common, so it's an easy guess that's likely to be correct. But which partition holds your `vmlinuz` or `initrd.img`? Is it on the EFI partition, as required by `systemd-boot`? Or the second partition which is standard for many automated GRUB installations?

Which partition holds your root directory, is it `(hd0,gpt3)` or `(hd0,gpt4)`? Do you remember which one is swap? Because you can't boot to that...

If you hadn't noticed the correlation of the GRUB partition ordering scheme to a standard Linux `/dev` ordinal, here's a chart on how it breaks down:

<figure class="wp-block-table is-style-stripes"><table><thead><tr><th>GRUB Ordinals</th><th>SATA/SAS Ordinals</th><th>SCSI Ordinals</th><th>NVME Ordinals</th></tr></thead><tbody><tr><td>(hd0,gpt1)</td><td>/dev/sda1</td><td>/dev/sga1</td><td>/dev/nvme0n1p1</td></tr><tr><td>(hd0,gpt2)</td><td>/dev/sda2</td><td>/dev/sga2</td><td>/dev/nvme0n1p2</td></tr><tr><td>(hd0,gpt3)</td><td>/dev/sda3</td><td>/dev/sga3</td><td>/dev/nvme0n1p3</td></tr><tr><td>(hd0,gpt4)</td><td>/dev/sda4</td><td>/dev/sga4</td><td>/dev/nvme0n1p4</td></tr></tbody></table><figcaption>Note: This is an example of a typical Ubuntu installation, but not everyone's partitions are ordered the same way, so learn what signs to look for that indicate which one is which</figcaption></figure>

If you remember your root partition is `/dev/sda4`, and your boot partition is `/dev/sda2`, it will come in handy for this process. So look for the signs while your computer is working so you can remember how to get yourself out of the potential mess that is the inevitable, eventual greeting by the dreaded GRUB prompt!

Here's a real world example of some partition structures using `lsblk`:

```text

$ lsblk -pf
 NAME FSTYPE LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINT
 /dev/sda
 │
 ├─/dev/sda1
 │    vfat         D76E-7DEB                             807.3M    19% /boot/efi
 ├─/dev/sda2
 │    ext4         b1cfa7fa-cd24-469a-87fb-d28f0062fb65  692.7M    22% /boot
 ├─/dev/sda3
 │    xfs    root  31aad6f4-98bf-4ae1-a00c-cfa43be07840   12.2G    66% /
 └─/dev/sda4
      swap         d07bf51d-1ef9-4d07-bc86-450945e83a93                [SWAP]
 /dev/sdb
 │
 └─/dev/sdb1
 /dev/sdc
 │
 ├─/dev/sdc1
 │    zfs_me epool 11659485700310844622
 └─/dev/sdc9
 /dev/sdd
 │
 ├─/dev/sdd1
 │    zfs_me epool 11659485700310844622
 └─/dev/sdd9
```

You can see the first drive, /dev/sda , is the drive used to boot from. It has an EFI partition, a `/boot` partition, a `/` (root) partition, and a swap partition. Get to know these and remember which one's what.

These would subsequently correspond to the following:

<figure class="wp-block-table is-style-stripes"><table><thead><tr><th>in GRUB</th><th>in Linux</th><th>Purpose</th></tr></thead><tbody><tr><td>(hd0,gpt1)</td><td>/dev/sda1</td><td>efi</td></tr><tr><td>(hd0,gpt2)</td><td>/dev/sda2</td><td>vmlinuz, initrd</td></tr><tr><td>(hd0,gpt3)</td><td>/dev/sda3</td><td>root</td></tr><tr><td>(hd0,gpt4)</td><td>/dev/sda4</td><td>swap</td></tr></tbody></table><figcaption>The breakdown of how these partition ordinals correspond to one another, depending on which interface you are interacting with. This is a good thing to remember!</figcaption></figure>

Issue #3: Say you can remember these, you know what each of them do. _Can you figure out what the GRUB prompt is asking you for?_

GRUB prompt will ask you for root. This has two different meanings in the context of the GRUB prompt.

The first root is which partition you will be browsing, loading files from, etc. The second one will be _the one that you will be booting from_.

Try it - here's how the _first_ root works (the one that's _only relevant in GRUB_):

```text

grub> set root=(hd0,gpt3)
grub> ls /
 bin   etc   lib32   media  proc  sbin        srv  usr
 boot  home  lib64   mnt    root  selections  sys  var
 dev   lib   libx32  opt    run   snap        tmp
```

Structure look familiar? This is your root partiton.

```text

grub> set root=(hd0,gpt2)
grub> ls /
config-5.10.0-1013-oem   lost+found
 config-5.4.0-26-generic  System.map-5.10.0-1013-oem
 config-5.4.97            System.map-5.4.0-26-generic
 config-5.4.98.zfs        System.map-5.4.97
 efi                      System.map-5.4.98.zfs
 grub                     vmlinuz
 initrd.img               vmlinuz-5.4.97
 initrd.img-5.4.97        vmlinuz-5.4.98.zfs
 initrd.img-5.4.98.zfs    vmlinuz.old
 initrd.img.old
```

Now _GRUB's_ root is _set_ to your boot partition...

It's important to know what the EFI partition looks like, too, so here is an example of an EFI partition with both GRUB and systemd-boot:

```text

grub> set root=(hd0,gpt1)
grub> ls /
b0993a91342e4baea30901c5d7533f4d  EFI  loader  ubuntu
grub> ls /EFI
BOOT  Linux  systemd
grub> ls /EFI/BOOT
BOOTX64.EFI
```

That `BOOTX64.EFI` file is what you're interfacing with right now - that's the binary responsible for the GRUB prompt.

You can use this navigation feature in conjunction with TAB completion to try and figure out which partition is which - if you recognize what kind of files are located in the root of these partitions and what they are used for.

To boot, you need both a `vmlinuz` and an `initrd.img` file. On most machines installed with GRUB as the primary bootloader, these will be located on your second partition when configured with UEFI.

TL;DR

Now you're going to set the GRUB root to _the partition you want to boot from_, then _tell Linux which partition you want to be the root once it boots_ (!) (got that?)

Here's the whole command sequence to initiate the boot process:

```text

grub> set root=(hd0,gpt2)
grub> linux /vmlinuz-5.4.98.zfs root=/dev/sda3
grub> initrd /initrd.img-5.4.98.zfs
grub> boot
```

So, see, when setting the location of the Linux kernel executable, the root you're supplying there is _not_ the root for GRUB, but _the root for Linux_ (once you've booted). It's confusing, so I figured I'd repeat it.

And, this might be obvious, but I'll mention it just to be thorough: Choose the corresponding `vmlinuz` and `initrd.img` files from the same initramfs compression process - don't use `vmlinuz` from `5.10.0-1013-oem` and `initrd` from `5.4.0-26-generic`, for example.

Let's break these aforementioned commands down into each part:

```text

grub> set root=(hd0,gpt2)
```

Set the partition GRUB will be looking at to your boot partition (if it's /dev/sda2, for example)

```text

grub> linux /vmlinuz-5.4.98.zfs root=/dev/sda3
```

Set `vmlinuz-5.4.98.zfs` as your Linux kernel executable (don't forget the `/` to signify it's position located in the root you set in the first step). While setting the root _Linux will be using_ once you're all booted up (in this case, `root=/dev/sda3`) (can't say that enough times)

```text

grub> initrd /initrd.img-5.4.98.zfs
```

Set `initrd.img-5.4.98.zfs` as your initramfs archive (again, don't forget the leading `/` )

```text

grub> boot
```

Start the boot process using the two variables you just set in the last two steps

IF YOU GET STUCK: Try browsing the other partitions to see if you're setting GRUB root properly, try a different `vmlinuz` and `initrd.img` (maybe the one you first tried was hosed?), you can get a list of commands using `help` at the prompt...

And if all else fails, boot to a live installer USB and rebuild GRUB from `chroot`

If you make it through this, I know you'll be loving your computer again in no time...

![](https://geno12.files.wordpress.com/2012/12/happy-computer.jpg?w=611)

hot...
