---
title: Fetch a file from a Clonezilla image without restoring to disk
description: Dinosaurs are cute I thought this was neat, but I got the info from a site that presented it in a way that was a bit difficult to decipher, so I wanted to pass it on in a presentation that is easier to understand. If you're not using CloneZilla, you're definitely missing out. It…
summary: Dinosaurs are cute I thought this was neat, but I got the info from a site that presented it in a way that was a bit difficult to decipher, so I wanted to pass it on in a presentation that is easier to understand. If you're not using CloneZilla, you're definitely missing out. It…
date: 2021-05-06T05:32:42Z
author: Avery Freeman
slug: fetch-a-file-from-a-clonezilla-image-without-restoring-to-disk
categories:
  - Random
thumbnail: /post-thumbnails/attachment-483.webp
thumbnail_alt: Fetch a file from a Clonezilla image without restoring to disk
thumbnail_width: 225
thumbnail_height: 225
thumbnail_aspect: 1
type: post
status: publish
url: /posts/2021/05/fetch-a-file-from-a-clonezilla-image-without-restoring-to-disk/
---

<!-- Imported from WordPress post 482. -->

![](/wp-content/uploads/2021/05/image.webp)

*Dinosaurs are cute*

I thought this was neat, but I got the info from a site that presented it in a way that was a bit difficult to decipher, so I wanted to pass it on in a presentation that is easier to understand.

If you're not using CloneZilla, you're definitely missing out. It's a super easy way to clone hard drives, USB thumb drives, etc. into a format that's easy to restore. It does disk-to-image, disk-to-disk, disk-to-network supporting ssh, nfs and cifs, and even has a p2p cloning framework for two networked computers using CloneZilla live USBs (!)

Needless to say, that's definitely cool. But what if you want to grab a file out of an archive you've already created?

I had made a backup of a client's computer I wanted to have in case something went south, but I needed to make sure I could get to the files in case I was asked to deliver files while the computer was in a state of (dis)repair.

Well, thankfully that's pretty easy, since CloneZilla's default image format is just some gzipped archives. You basically just unzip them into another file, which appears as the raw image file (e.g. `.img`), which at that point you can mount and traverse like any other mounted drive.

The basic structure of an image is contained inside a directory created by CloneZilla. It looks like this:

```text

$ ls -la
total 55474810
drwxr-xr-x 2 avery avery                  43 May  5 18:57 .
drwxrwxrwx 9 avery administrators         16 May  5 21:36 ..
-rw-r--r-- 1 avery avery                 874 May  5 17:28 blkdev.list
-rw-r--r-- 1 avery avery                 706 May  5 17:28 blkid.list
-rw-r--r-- 1 avery avery               10068 May  5 18:57 clonezilla-img
-rw-r--r-- 1 avery avery                 235 May  5 18:56 dev-fs.list
-rw-r--r-- 1 avery avery                   4 May  5 18:57 disk
-rw-r--r-- 1 avery avery                 482 May  5 18:57 efi-nvram.dat
-rw-r--r-- 1 avery avery                7354 May  5 18:57 Info-dmi.txt
-rw-r--r-- 1 avery avery                 236 May  5 18:57 Info-img-id.txt
-rw-r--r-- 1 avery avery               19252 May  5 18:57 Info-lshw.txt
-rw-r--r-- 1 avery avery                2401 May  5 18:57 Info-lspci.txt
-rw-r--r-- 1 avery avery                 313 May  5 18:57 Info-OS-prober.txt
-rw-r--r-- 1 avery avery                 211 May  5 18:57 Info-packages.txt
-rw-r--r-- 1 avery avery                 114 May  5 18:57 Info-saved-by-cmd.txt
-rw-r--r-- 1 avery avery               10192 May  5 18:57 Info-smart.txt
-rw-r--r-- 1 avery avery                  20 May  5 18:57 parts
-rw------- 1 avery avery            13784650 May  5 17:28 sda1.vfat-ptcl-img.gz.aa
-rw------- 1 avery avery             7477849 May  5 17:28 sda2.dd-ptcl-img.gz.aa
-rw------- 1 avery avery          4096000000 May  5 17:36 sda3.ntfs-ptcl-img.gz.aa
-rw------- 1 avery avery          4096000000 May  5 17:42 sda3.ntfs-ptcl-img.gz.ab
-rw------- 1 avery avery          4096000000 May  5 17:48 sda3.ntfs-ptcl-img.gz.ac
-rw------- 1 avery avery          4096000000 May  5 17:54 sda3.ntfs-ptcl-img.gz.ad
-rw------- 1 avery avery          4096000000 May  5 18:00 sda3.ntfs-ptcl-img.gz.ae
-rw------- 1 avery avery          4096000000 May  5 18:07 sda3.ntfs-ptcl-img.gz.af
-rw------- 1 avery avery          4096000000 May  5 18:13 sda3.ntfs-ptcl-img.gz.ag
-rw------- 1 avery avery          4096000000 May  5 18:19 sda3.ntfs-ptcl-img.gz.ah
-rw------- 1 avery avery          4096000000 May  5 18:25 sda3.ntfs-ptcl-img.gz.ai
-rw------- 1 avery avery          4096000000 May  5 18:32 sda3.ntfs-ptcl-img.gz.aj
-rw-r--r-- 1 avery avery               16384 May  5 17:28 sda-gpt-2nd
-rw-r--r-- 1 avery avery               17920 May  5 17:28 sda-gpt.gdisk
-rw-r--r-- 1 avery avery                 790 May  5 17:28 sda-gpt.sgdisk
-rw-r--r-- 1 avery avery                 512 May  5 17:28 sda-mbr
-rw-r--r-- 1 avery avery                 621 May  5 17:28 sda-pt.parted
-rw-r--r-- 1 avery avery                 551 May  5 17:28 sda-pt.parted.compact
-rw-r--r-- 1 avery avery                 849 May  5 17:28 sda-pt.sf
```

They're logically named with tags for partitions, like `sda1`, `sda2`, etc. You can see the super huge files are `.gz.*` files - gzip archives (or zstd, depending on what option you chose) that have to be re-combined to decompress properly, but that's no big deal.

If you want to save a partition to an image file, make sure you have a copy of partclone installed on your system (e.g. `# apt install partclone -y` if on a debian-based distro). That'll automate the restructuring of the partition from the gzip archives.

Make sure you have enough room on whatever drive you're doing it on for the _entire_ partition (and then some) - might want to `du` and `df` first just to be safe.

Note: if you used zstd instead of gzip for the archives, you'll have to look up the `zstd` command switches and adapt the one-liner to accommodate the differences in their APIs. I haven't tried it, but I assume the result should be the same.

Here's a quick run-down of how the process goes:

```text

# These instructions assume you're in a dir containing the backup dir
$ ls -la
drwxrwxrwx  9 avery                       administrators           16 May  5 21:36  .
drwxr-xr-x  6 root                        root                      7 Mar 23 00:21  ..
-rw-------  1 root                        root               14196736 
drwxr-xr-x  2 avery                       avery                    43 May  5 18:57  laptop-drive-backup 

# create the file that will be your raw image - any name will do
$ touch laptopPartition.img

# pipe the archives to gzip and use partclone to construct the .img 
$ cat ./laptop-drive-backup/sda3.ntfs-ptcl-img.gz.* | gzip -d -c | partclone.restore -C -s - -O ./laptopPartition.img

# then you can mount your .img file as a loop
$ sudo mount -o loop -t ntfs ./laptopPartition.img /mnt/someEmptyDir

# and browse it like anywhere else
$ ls -la /mnt/someEmptyDir # which is now loop-mounted .img file
```

Another thing to note is that loop mounts are read-only, kind of like mounting an `.iso` file, or more recently, a snap container. So you can copy stuff off, but you can't put stuff on. But this is just a copy of your original `.gz.*` backup, so there's really no chance in harming the original's integrity anyway.

It's always important to conduct yourself with the utmost (file) integrity!
