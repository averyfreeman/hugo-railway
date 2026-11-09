---
title: Using VDO on Ubuntu
description: Pack and dedupe your files automatically! Unfortunately, this hasn't gotten as much attention as I think it should, but vdo volumes are now officially supported as in-tree modules in kernel 6.9 and newer. If you don't know what vdo volumes are yet, check this out (they're really…
summary: Pack and dedupe your files automatically! Unfortunately, this hasn't gotten as much attention as I think it should, but vdo volumes are now officially supported as in-tree modules in kernel 6.9 and newer. If you don't know what vdo volumes are yet, check this out (they're really…
date: 2024-08-22T01:03:56Z
author: Avery Freeman
slug: using-vdo-on-ubuntu
categories:
  - Random
thumbnail: /post-thumbnails/attachment-1032.webp
thumbnail_alt: Icon showing compression
thumbnail_width: 480
thumbnail_height: 480
thumbnail_aspect: 1
type: post
status: publish
url: /posts/2024/08/using-vdo-on-ubuntu/
---

<!-- Imported from WordPress post 1031. -->

![Icon showing compression](/wp-content/uploads/2024/08/image-3.webp)

*Pack and dedupe your files automatically!*

Unfortunately, this hasn't gotten as much attention as I think it should, but `vdo` volumes are now officially supported as in-tree modules in kernel 6.9 and newer. If you don't know what `vdo` volumes are yet, [check this out](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/deduplicating_and_compressing_logical_volumes_on_rhel/introduction-to-vdo-on-lvm_deduplicating-and-compressing-logical-volumes-on-rhel) (they're really cool).

In my opinion, `vdo` is the best alternative to `zfs`'s compression and deduplication on Linux, especially since its license is not incompatible, allowing it to receive a lot more support from developers for being released under GPL-2. I've been using it off and on for the last few months, and while I haven't done any formal benchmarks yet, subjectively it seems to be a lot more effective for reducing space consumption than `zfs` ever was (`zfs`'s compression worked great, but `dedupe` is hampered by unreasonable ram usage).

The kernel 6.9 requirement makes using `vdo` a little difficult in Ubuntu 24.04, which does have `lvm` libraries new enough to make `vdo` volumes, but not without upgrading the kernel to one newer than stock, since it's pinned at kernel `6.8`. Thankfully, you can add kernels from a 3rd-party rather easily, such as [zen](https://github.com/zen-kernel/zen-kernel), [liquorix](https://liquorix.net/), or [xanmod](https://xanmod.org/) (I have personally done all my testing with xanmod).

With a `6.9` (or newer) kernel booted, all you need besides `lvm` and `thin-provisioning-tools` is the userspace modules for maintaing a `vdo` volume, and those can be downloaded here: [https://github.com/dm-vdo/vdo/releases/tag/8.3.0.71](https://github.com/dm-vdo/vdo/releases/tag/8.3.0.71)

They need to be compiled manually, but luckily it's really easy. First, install required libraries and `autotools`, etc.

```bash
apt install -y build-essential uuid-dev libblkid-dev zlib1g-dev
```

grab the tar from the `dm-vdo/vdo` [releases page](https://github.com/dm-vdo/vdo/releases/tag/8.3.0.71) and decompress it. Then, navigate to the folder and run:

```bash
make
sudo make install
```

The prefix is automatically set to `/usr`, so the executables are in `/usr/bin`:

```bash
ls -1 /usr/bin | grep vdo                                                                 

vdoaudit
vdodebugmetadata
vdodumpblockmap
vdodumpmetadata
vdoforcerebuild
vdoformat
vdolistmetadata
vdoreadonly
vdorecover
vdostats
```

With some accompanying `man` files:

```bash
/usr/man/man8/vdoaudit.8
/usr/man/man8/vdodebugmetadata.8
/usr/man/man8/vdodumpblockmap.8
/usr/man/man8/vdodumpmetadata.8
/usr/man/man8/vdoforcerebuild.8
/usr/man/man8/vdoformat.8
/usr/man/man8/vdolistmetadata.8
/usr/man/man8/vdoreadonly.8
/usr/man/man8/vdorecover.8
/usr/man/man8/vdostats.8
```

A `bash-completion` file for `vdostats`:

```bash
/usr/share/bash-completion/completions/vdostats
```

And 3 example files written in `perl` for monitoring space on a `vdo` volume:

```bash
ls -1 /usr/share/doc/vdo/examples/monitor                  
                                                                                              
monitor_check_vdostats_logicalSpace.pl
monitor_check_vdostats_physicalSpace.pl
monitor_check_vdostats_savingPercent.pl
```

(you can invoke them with `perl /usr/share/doc/vdo/examples/$EXAMPLE_NAME.pl`)

If you do any side-by-side benchmarks with `vdo` v. `zfs`, please leave a comment and let me know your results. I plan to do my own eventually, but if you get around to them before I do, I'd love to see your results!
