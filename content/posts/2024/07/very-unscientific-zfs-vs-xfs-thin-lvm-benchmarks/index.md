---
title: (very) Unscientific ZFS vs XFS + Thin LVM Benchmarks
description: "Explaining the feels: XFS + Thin LVM is on the left, ZFS is on the right I found this screenshot from a couple days ago, but it illustrates something I've known subjectively for a long time now: ZFS is the mother of all sequential read filesystems, but it's quite a bit \"slower\"…"
summary: "Explaining the feels: XFS + Thin LVM is on the left, ZFS is on the right I found this screenshot from a couple days ago, but it illustrates something I've known subjectively for a long time now: ZFS is the mother of all sequential read filesystems, but it's quite a bit \"slower\"…"
date: 2024-07-16T21:30:32Z
author: Avery Freeman
slug: very-unscientific-zfs-vs-xfs-thin-lvm-benchmarks
categories:
  - Random
thumbnail: /post-thumbnails/attachment-906.webp
thumbnail_alt: xfs numbers on left.  zfs numbers on right.
thumbnail_width: 480
thumbnail_height: 306
thumbnail_aspect: 1.5686274509803921
type: post
status: publish
url: /posts/2024/07/very-unscientific-zfs-vs-xfs-thin-lvm-benchmarks/
---

<!-- Imported from WordPress post 905. -->

![Comparing benchmarks of ZFS vs. XFS](/wp-content/uploads/2024/07/Screenshot-from-2024-07-15-20-33-22-1024x652.webp)

*Explaining the feels: XFS + Thin LVM is on the left, ZFS is on the right*

I found this screenshot from a couple days ago, but it illustrates something I've known subjectively for a long time now: ZFS is the mother of all sequential read filesystems, but it's quite a bit "slower" than other common filesystems (especially non-`cow`). That's mainly because Linux uses a boatload of tiny files necessary to be read at random, and does very little, if any, sequential file serving: **Represented here by the two lower fields in these benchmarks.**

ZFS definitely has its place, but through using ZFS on root for Linux over the years, it became obvious the machines I installed it on weren't as "snappy" feeling as when they ran journaling filesystems. These benchmarks aren't so wildly different I wouldn't consider it for a good root OS filesystem, though, especially if you need other resources: e.g. snapshots are orders of magnitude less supported on thin-lvm than ZFS.

This particular test comes with another caveat, too: The two SSDs compared in my "test machine" (Dell precision 7730 laptop) are a generation apart, and different sizes: The one with ZFS on it (left) is a 1TB Samsung pm981a and the one running XFS on thin LVM is a 2TB Samsung pm9A3. However, it was taken on a fresh installation of Ubuntu 24.04 on ZFS (no encryption) with completely stock partition setup. The bus only supports PCIe 3.0, so the pm9a3 has no advantage there.

This quick test was mostly done on a lark, but for my own curiosity I've been planning to do more benchmarks comparing compression using `kvdo` vs. ZFS + lz4 or zstd, and for those benchmarks I'll use two separate, empty PM981a drives so it can be a more apples-to-apples comparison. If you like these kind of benchmarks, _watch this space._
