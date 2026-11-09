---
title: Want BTRFS CoW snapshots but need to use Dropbox?
description: "Update: Not sure when this happened but I was checking the requirements for FS on Linux at Dropbox.com and apparently they DO support BTRFS once again. So the process outlined in this post is no longer necessary. See announcement: https://hardware.slashdot.org/story/19/07/22/153…"
summary: "Update: Not sure when this happened but I was checking the requirements for FS on Linux at Dropbox.com and apparently they DO support BTRFS once again. So the process outlined in this post is no longer necessary. See announcement: https://hardware.slashdot.org/story/19/07/22/153…"
date: 2019-12-17T07:28:17Z
author: Avery Freeman
slug: want-btrfs-cow-snapshots-but-need-to-use-dropbox
categories:
  - Random
thumbnail: /post-thumbnails/attachment-264.webp
thumbnail_alt: Want BTRFS CoW snapshots but need to use Dropbox?
thumbnail_width: 225
thumbnail_height: 225
thumbnail_aspect: 1
type: post
status: publish
url: /posts/2019/12/want-btrfs-cow-snapshots-but-need-to-use-dropbox/
---

<!-- Imported from WordPress post 263. -->

![](/wp-content/uploads/2019/12/image-2.webp)

Update: Not sure when this happened but I was checking the requirements for FS on Linux at Dropbox.com and apparently they DO support BTRFS once again. So the process outlined in this post is no longer necessary.

See announcement: [https://hardware.slashdot.org/story/19/07/22/1534200/dropbox-brings-back-support-for-zfs-xfs-btrfs-and-ecryptfs-on-linux](https://hardware.slashdot.org/story/19/07/22/1534200/dropbox-brings-back-support-for-zfs-xfs-btrfs-and-ecryptfs-on-linux)

Old article: This is less of a write up and more of a PSA:

Want to put BTRFS on every device you have like me because you can't get enough of CoW FS? Especially for operating systems? Because `snapper`? `cgroups`? `timeshift`? `machinectl`? The list goes on...

<!-- more -->

Use `BTRFS` to your heart's content! Just create a separate partition formatted with `EXT4` and mount it to your Dropbox-using user's `/home/username/Dropbox` in `/etc/fstab`

This can be done while initially setting up your OS, which if you're like me you'll be doing all sorts of finagling with your partition layout anyway, or shrink one of your partitions after the fact (`/home` comes to mind, since that's where Dropbox is usually located).

I've done this in several builds so I can have snapshot+rollback capabilities while working around the new(ish) Dropbox file system requirements in OS like OpenSUSE, Debian and Ubuntu. Admittedly, less of the VMs are in service now that Dropbox limits free accounts to 3 devices.

What about snapshots of your Dropbox folder, you ask? Well, Dropbox has its own file versioning system built-in that should keep your files safe from accidental deletion for at least 1 month. So if you delete anything from your `EXT4` Dropbox folder, just get on the Dropbox website and click "deleted files" before it's too late (!)

In another post, I'll have to explain how I set up a Dropbox+Syncthing VM to share files across platforms and then propagate those files to other machines using Syncthing so as to skirt the 3-device limit.

I only use about 2GB on Dropbox in the form of PDFs and text files for work - I don't need a $10/mo 1TB of storage, but I still have LOTS of devices I like to use. Thankfully Syncthing doesn't have any high-falutin' requirements for underlying file system types like Dropbox does \[insert pointed stink-eye at Dropbox developers\].

I've done this specifically to retain Dropbox notifications (changed/added file, etc.) which are easily connected to IFTTT for push notifications on cell phones. It's not a functionality I've found easy to recreate using other methods.

If you want to delve deeper into the partitioning issue, here's a thread in the BTRFS subreddit about the original topic - with an interesting alternative to creating a separate partition, a loop device!

[Embedded content](https://www.reddit.com/r/btrfs/comments/b60y2n/best_way_to_create_an_ext4_folder_for_dropbox_on/?utm_source=share&utm_medium=web2x)

Nerd out.
