---
title: The Power of `pv /dev/$DISK_DEVICE | zstd -0f > image.zst`
description: Blowing up old myths about using compression for disk images I've been making these images of my hard drives using fsarchiver for about 6 months, and one of the most amazing things I've discovered through all of it is how tiny .raw.zst images get when you run them through a comp…
summary: Blowing up old myths about using compression for disk images I've been making these images of my hard drives using fsarchiver for about 6 months, and one of the most amazing things I've discovered through all of it is how tiny .raw.zst images get when you run them through a comp…
date: 2024-08-18T15:58:31Z
author: Avery Freeman
slug: the-power-of-pv-dev-disk-device-zstd-0f-image-zst
categories:
  - Random
thumbnail: /post-thumbnails/attachment-1020.webp
thumbnail_alt: The Power of `pv /dev/$DISK_DEVICE | zstd -0f > image.zst`
thumbnail_width: 480
thumbnail_height: 469
thumbnail_aspect: 1.023454157782516
type: post
status: publish
url: /posts/2024/08/the-power-of-pv-dev-disk-device-zstd-0f-image-zst/
---

<!-- Imported from WordPress post 934. -->

![Mind blown emoji](/wp-content/uploads/2024/08/image-2.webp)

*Blowing up old myths about using compression for disk images*

I've been making these images of my hard drives using `fsarchiver` for about 6 months, and one of the most amazing things I've discovered through all of it is how tiny `.raw.zst` images get when you run them through a compression library, whether it's compressing them or not.

Case in point: I way oversized my EFI partition to 2GB on another computer running Arch so I could mess around with unified kernels more easily (fact check: they're awesome), but I was taking raw images of EFI and it was "supposed" to be 2GB uncompressed, right? Well, piping it through `zstd` with ZERO compression actually got it down all the way to 541K. _**Not**_ 541MB. **541K**!

It's because the library's algorithm automatically removes all the zeros, so any space that isn't used is not allocated, and you're left with only used blocks.

Observe the following tests a relatively fresh install of ZFS-Buntu 24.04:

```bash
# show our efi partition
lsblk | grep efi
  nvme1n1p1            259:2    0     1G  0 part /boot/efi
  
# check out the disk usage of the efi partition
dust -d 0 /boot/efi
6.1M ┌── efi│███████████████████████████████████████████ │ 100%

# create a raw file from the efi partition:
pv /dev/nvme1n1p1 > efi.raw

1.05GiB 0:00:00 [1.35GiB/s] [============================>] 100%     

# create a raw file from efi, but through zstd, uncompressed 
pv /dev/nvme1n1p1 | zstd -0f > efi.raw.zst

1.05GiB 0:00:00 [1.98GiB/s] [============================>] 100%            

# where's our files?
ls -1
efi.raw
efi.raw.zst

# check out the disk usage of our new files
dust
317K   ┌── efi.raw.zst│█████                            │   7%
3.9M   ├── efi.raw    │█████████████████████████████     │  93%
4.2M ┌─┴ .            │█████████████████████████████████ │ 100%
```

The `zst` archive is literally 8% the size of the `raw` volume image, despite NOT USING ANY COMPRESSION (that's the `-0` flag). The other amazing thing is that `pv` is reporting it completed `68%` faster, as well.

Note, this is not unique to any compression algorithm, per se, but an artifact of compression, that it removes zero-blocks from disk images.

So next time you make some disk images, run your image through _at least_ a `| zstd -0 > file.img` - It may be a good deal faster while saving you a boatload of space.
