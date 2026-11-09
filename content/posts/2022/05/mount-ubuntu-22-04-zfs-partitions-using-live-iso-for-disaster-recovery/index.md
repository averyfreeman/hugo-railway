---
title: Mount Ubuntu 22.04 ZFS partitions using live ISO for disaster recovery
description: My system runs ZFS and lately has been dropping to the initramfs / busybox prompt on boot. I had a hard time finding a fleshed-out guide on how to mount ZFS in a live environment for performing disaster recovery tasks like chroot and grub repair, so I thought I'd write something…
summary: My system runs ZFS and lately has been dropping to the initramfs / busybox prompt on boot. I had a hard time finding a fleshed-out guide on how to mount ZFS in a live environment for performing disaster recovery tasks like chroot and grub repair, so I thought I'd write something…
date: 2022-05-20T14:45:54Z
author: Avery Freeman
slug: mount-ubuntu-22-04-zfs-partitions-using-live-iso-for-disaster-recovery
categories:
  - Random
thumbnail: https://ap-content.storage.googleapis.com/2012/04/zfs-banner.png
thumbnail_alt: ZFS Send and Receive ·
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2022/05/mount-ubuntu-22-04-zfs-partitions-using-live-iso-for-disaster-recovery/
---

<!-- Imported from WordPress post 548. -->

![ZFS Send and Receive ·](https://ap-content.storage.googleapis.com/2012/04/zfs-banner.png)

My system runs ZFS and lately has been dropping to the initramfs / busybox prompt on boot. I had a hard time finding a fleshed-out guide on how to mount ZFS in a live environment for performing disaster recovery tasks like chroot and grub repair, so I thought I'd write something up.

My system was dropping to the busybox prompt after GRUB menu. I started experiencing the issue after a routine apt upgrade, I rebooted and wasn't able to get any of my initramfs to boot. It seems a little strange, because usually the inability to boot will be limited to a new initramfs - e.g. an older version of the kernel will still have the ZFS drivers, or other necessary components to boot, while the newer versions (the ones just installed) will be lacking these necessary components for whatever reason.

First of all, burn yourself a copy of a live USB, and boot into it. Luckily, the newest version of Ubuntu (22.04 - Jammy Jellyfish) has the ZFS drivers and executables installed by default, unlike prior versions where you had to add the multiverse repo manually, download the packages, and enable the ZFS drivers using `modprobe`.

A peek at `lsmod` shows the ZFS drivers are indeed loaded, and lo-and-behold, there's the `zpool` and `zfs` executables:

```text
ubuntu@ubuntu:~$ lsmod | grep zfs
zfs                  3751936  29
zunicode              348160  1 zfs
zzstd                 487424  1 zfs
zlua                  155648  1 zfs
zavl                   20480  1 zfs
icp                   319488  1 zfs
zcommon               102400  2 zfs,icp
znvpair                94208  2 zfs,zcommon
spl                   122880  6 zfs,icp,zzstd,znvpair,zcommon,zavl

ubuntu@ubuntu:~$ which {zpool,zfs}
/usr/sbin/zpool
/usr/sbin/zfs
```

The drive I am diagnosing is the internal NVMe, so there's no need to attach it. One question I had was how to mount the two pools, and in what order. By default, Ubuntu creates an `rpool` for the root partition, and a `bpool` for the boot partition.

Generally, on an EFI system, one would mount the root partition in a clean directory like `/mnt` first, and subsequently mount boot at `/mnt/boot` once it is provided by the previously mounted root partition, and then mount efi at `/mnt/boot/efi` once that's provided by the boot partition. As you can see, the order of mounting these partitions is therefore of paramount importance, but as there are only 3 options, it's not too complicated.

You'll need to be root for basically all these commands. Using `sudo su` without a password will typically get you to a root prompt (`#`) in a live environment.

**TL;DR - probably way more than you ever wanted to know about an `lsblk` device list:**

First, we should identify the storage devices using `lsblk -f` (the `-f` flag includes the filesystem information, which is important for our purposes):

```text
# lsblk -f
NAME FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
loop0
     squash 4.0                                                    0   100% /rofs
loop1
     squash 4.0                                                    0   100% /snap/bare/5
loop2
     squash 4.0                                                    0   100% /snap/core20/1405
loop3
     squash 4.0                                                    0   100% /snap/snapd/15177
loop4
     squash 4.0                                                    0   100% /snap/snap-store/575
loop5
     squash 4.0                                                    0   100% /snap/gtk-common-themes/1534
loop6
     squash 4.0                                                    0   100% /snap/firefox/1232
loop7
     squash 4.0                                                    0   100% /snap/snapd-desktop-integration/10
loop8
     squash 4.0                                                    0   100% /snap/gnome-3-38-2004/99
sda  iso966 Jolie Ubuntu 22.04 LTS amd64
│                       2022-04-19-10-23-19-00                              
├─sda1
│    iso966 Jolie Ubuntu 22.04 LTS amd64
│                       2022-04-19-10-23-19-00                     0   100% /cdrom
├─sda2
│    vfat   FAT12 ESP   8D6C-A9F8                                           
├─sda3
│                                                                           
└─sda4
     ext4   1.0   writable
                        bb277d84-75cc-473b-b327-fd885d85889a   24.5G     0% /var/crash
                                                                            /var/log
zd0  btrfs              b6239f8a-058b-4a6c-8258-b9a7b50f6c23                
zd16                                                                        
└─zd16p1
     btrfs              d6074499-b9aa-47e0-a08a-58e27c73e771                
zd32 btrfs              c68aa9ca-933a-48cb-9adb-22fd6a8ca8c8                
zd48                                                                        
└─zd48p1
     btrfs              f52702bd-c805-4edc-87d1-6fb877ee6738                
nvme1n1
│                                                                           
├─nvme1n1p1
│    vfat   FAT32       B045-5C3B                                           
├─nvme1n1p2
│    swap   1           584b9b78-7d8d-4a5a-9263-d6f6a48adc6b                
├─nvme1n1p3
│    zfs_me 5000  bpool 11241115695889536197                                
└─nvme1n1p4
     zfs_me 5000  rpool 16130566787573079380                                
nvme0n1
│                                                                           
├─nvme0n1p1
│    vfat   FAT32       EC9D-0344                                           
├─nvme0n1p2
│                                                                           
├─nvme0n1p3
│    ntfs               A4EEBDB4EEBD7F5C                                    
└─nvme0n1p4
     ntfs               989EE7E99EE7BDBE
```

OK, there's a lot there, so what are we looking at? Well, the first 9 devices that say `loop` are snaps, since we're on Ubuntu. Those are responsible for storing some of the programs being run by the OS. Each one gets their own virtual storage device, sometimes referred to as an "overlay". They create a fair amount of clutter in our device list, but that's about all. You can ignore them.

Then, `/dev/sda` is our copy of Ubuntu ISO we booted from - you can see how it says `cdrom` there, and `iso9660` (the cdrom spec). It's read-only, so we couldn't do anything with it if we wanted to, and we don't, so let's move on...

There's a device for `log` and `crash` log, so that's kind of interesting. I imagine the live ISO makes those since you can't write to the USB drive, seeing as the ISO is a virtual CD-ROM, and CD-ROMs are read-only. Then there's a bunch of what are called "zvols" (the `zd0`, `zd16`, etc. devices - see those?). Those are devices created with ZFS that are isolated from the rest of the filesystem. zvols are virtual block devices you can use just like any other block device, but in this context they're typically either formatted with a different filesystem, or mounted via iSCSI for block-level filesharing (filesystem-sharing?). You can see these ones say `btrfs`, they were actually created for use with container runtimes, namely `podman` and `systemd-container`, both of which support btrfs very well and ZFS either nominally or not at all.

Now we get to `nvme1n1` - this is the first NVMe drive listed. Generally `0` would be listed first, but for some reason it's listed second. `n1` is the number of the drive (the second NVMe drive in the laptop), after that the partitions are listed as `p1`, `p2`, `p3`, and so on. Here's the drive in isolation:

```text
nvme1n1
│                                                                           
├─nvme1n1p1
│    vfat   FAT32       B045-5C3B                                           
├─nvme1n1p2
│    swap   1           584b9b78-7d8d-4a5a-9263-d6f6a48adc6b                
├─nvme1n1p3
│    zfs_me 5000  bpool 11241115695889536197                                
└─nvme1n1p4
     zfs_me 5000  rpool 16130566787573079380
```

The canonical address for this drive is: `/dev/nvme1n1p{1,2,3,4}` . The `/dev` (device) folder, while not listed in this output, is important to reference, as the full path is required for mounting a partition. Typically one would only mount a single partition at a time, but you could conceivably chain them in a single command by using curly braces, as shown. This is not common, as you will probably need to mount different partitions in different locations (e.g. `/mnt`, `/mnt/boot`), and usually either in descending order, or with no pattern at all.

If you remember back at the start, I mentioned the `rpool` and `bpool`. These are seen on `/dev/nvme1n1p4` and `/dev/nvme1n1p3` respectively. If the disk were formatted in a block filesystem such as EXT4 (Ubuntu's default filesystem), the root partition could be mounted by attaching `/dev/nvme0n1p4` to an empty folder. The command would therefore be:

```text
# mount /dev/nvme1n1p4 /mnt
```

And then you'd be able to `ls /mnt` and see the files contained on your newly mounted root partition. E.g.:

```text
# ls /mnt
Qogir  boot   dev  home  lib32  libx32  mnt  proc  run   snap  sys  usr
bin    cdrom  etc  lib   lib64  media   opt  root  sbin  srv   tmp  var
```

But this NVMe is formatted using ZFS. So what to do? That's the process I was having difficulty finding that inspired this blog post.

**End TL;DR - here's the ZFS-specific stuff again:**

First, after you confirm that you have your ZFS modules loaded by referencing your list of loaded kernel modules, and confirming that your ZFS executables are available in `PATH` (here's the syntax again so you don't have to scroll back):

```text
# lsmod | grep zfs 
zfs                  3751936  29
zunicode              348160  1 zfs
zzstd                 487424  1 zfs
zlua                  155648  1 zfs
zavl                   20480  1 zfs
icp                   319488  1 zfs
zcommon               102400  2 zfs,icp
znvpair                94208  2 zfs,zcommon
spl                   122880  6 zfs,icp,zzstd,znvpair,zcommon,zavl

# which {zpool,zfs}
/usr/sbin/zpool
/usr/sbin/zfs
```

Here's where it's different than your typical mount. You use `zpool` to import `rpool`, but you need to mount it using an alternate root (at `/mnt`) - otherwise it'll try to mount itself over your live environment! Then confirm that the import worked.

```text
# zpool import -f rpool -R /mnt

# ls /mnt
Qogir  boot   dev  home  lib32  libx32  mnt  proc  run   snap  sys  usr
bin    cdrom  etc  lib   lib64  media   opt  root  sbin  srv   tmp  var
```

OK, that went well. You can see that now we have a `/mnt/boot` folder, which is `boot` inside `rpool` - that's where initramfs lives, but they're stored in the `bpool`. We needed that folder to be available to mount our `bpool` into. So, let's import `bpool` into `/mnt/boot` as an alternate root (if we didn't, it'd try and overwrite our currently mounted `/boot` partition (note - this syntax is correct, ZFS has a slightly different method of dealing with mounts and folders than GNU software -- if curious, see related issue with `rsync`: [https://superuser.com/questions/1425744/why-is-rsync-creating-a-new-subdirectory](https://superuser.com/questions/1425744/why-is-rsync-creating-a-new-subdirectory)):

```text
# zpool import -f bpool -R /mnt

# ls /mnt/boot
config-5.15.32-xanmod1       memtest86+_multiboot.bin
config-5.15.34-xanmod1       System.map-5.15.32-xanmod1
config-5.15.36-xanmod1       System.map-5.15.34-xanmod1
config-5.17.0-xanmod1        System.map-5.15.36-xanmod1
config-5.17.1-xanmod1        System.map-5.17.0-xanmod1
config-5.17.3-xanmod1        System.map-5.17.1-xanmod1
config-5.17.5-xanmod1        System.map-5.17.3-xanmod1
config-5.17.9-xanmod1        System.map-5.17.5-xanmod1
config-5.17.9-xanmod1-x64v2  System.map-5.17.9-xanmod1
efi                          System.map-5.17.9-xanmod1-x64v2
grub                         vmlinuz
initrd.img                   vmlinuz-5.15.32-xanmod1
initrd.img-5.15.32-xanmod1   vmlinuz-5.15.34-xanmod1
initrd.img-5.15.34-xanmod1   vmlinuz-5.15.36-xanmod1
initrd.img-5.17.0-xanmod1    vmlinuz-5.17.0-xanmod1
initrd.img-5.17.1-xanmod1    vmlinuz-5.17.1-xanmod1
initrd.img-5.17.3-xanmod1    vmlinuz-5.17.3-xanmod1
initrd.img-5.17.5-xanmod1    vmlinuz-5.17.5-xanmod1
initrd.img.old               vmlinuz-5.17.9-xanmod1
memtest86+.bin               vmlinuz-5.17.9-xanmod1-x64v2
memtest86+.elf               vmlinuz.old
```

That looks like a bunch of initramfs files to me! Good, so that means those kickstarter runtimes that load from grub are available.

If you look in that list, you'll also see both efi and grub folders. Both of those are empty and waiting for storage to be attached. The efi partition lives in the first partition of the same NVMe drive, and is formatted with FAT, and grub is a bind-mount (you can see it in /etc/fstab):

```text
# mount -t msdos /dev/nvme1n1p1 /mnt/boot/efi

Can also use UUID from lsblk if prefer (just use one or other, not both): 
# mount -t msdos UUID=B045-5C3B /mnt/boot/efi

# ls /mnt/boot/efi
efi  grub  system~1  (confirm it's mounted)

# grep grub /mnt/etc/fstab
/boot/efi/grub	/boot/grub	none	defaults,bind	0	0
(we'll bind-mount this in next step)
```

Then you'll want to mount a few system folders inside your drive's filesystem so you can access them inside the chroot (required for things to work OK):

```text
# for i in proc dev sys dev/pts; do mount -v --bind /$i /mnt/$i; done

mount: /proc bound on /mnt/proc.
mount: /dev bound on /mnt/dev.
mount: /sys bound on /mnt/sys.
mount: /dev/pts bound on /mnt/dev/pts.

# mount -v --bind /mnt/boot/efi/grub /mnt/boot/grub
mount: /mnt/boot/efi/grub bound on /mnt/boot/grub.
```

"`chroot`ing": Now that all 3 partitions are mounted together in a cohesive filesystem tree, and you've got all your necessary bind mounts, one of the most effective ways to diagnose issues as if you're running the affected disk, is to chroot into the filesystem. Run `# chroot /mnt` and now you'll see `/mnt` as `/` (root), and you can run your programs as if you booted the computer using that drive (from the terminal, anyway):

```text
# chroot /mnt

# apt update (failed)

# cd /etc
# ls -la resolv.conf
lrwxrwxrwx 1 root root 39 Feb 17 12:09 resolv.conf -> ../run/systemd/resolve/stub-resolv.conf
```

If your network connection fails inside the `chroot` like mine did, go to `/etc` and delete `resolv.conf` if it's a symlink to `systemd-resolved` (as shown above). Then point `/etc/resolv.conf` to a known good dns forwarder (e.g. `1.1.1.1`, `8.8.8.8`, etc.)

```text
# echo 'nameserver 8.8.8.8' > resolv.conf

# apt update (works)

# apt list --installed | grep dkms

dkms/jammy,now 2.8.7-2ubuntu2 all [installed,automatic]
zfs-dkms/jammy-proposed,now 2.1.4-0ubuntu0.1 all [installed]
```

I was really hoping `zfs-dkms` got uninstalled somehow, because I thought that might have been why my initramfs files didn't have zfs modules. So unfortunately I still have to keep looking to figure out what's wrong...

Note, you'll probably see this error a lot, but it's safe to ignore:

```text
ERROR couldn't connect to zsys daemon: connection error: desc = "transport: Error while dialing dial unix /run/zsysd.sock: connect: connection refused"
```

Let's try upgrading the packages and see what shakes out:

```text
# apt upgrade 

The following packages were automatically installed and are no longer required:
  linux-headers-5.15.32-xanmod1 linux-headers-5.15.34-xanmod1
  linux-headers-5.15.36-xanmod1 linux-headers-5.17.0-xanmod1
  linux-headers-5.17.1-xanmod1 linux-headers-5.17.3-xanmod1
  linux-headers-5.17.5-xanmod1 linux-image-5.15.32-xanmod1
  linux-image-5.15.34-xanmod1 linux-image-5.15.36-xanmod1
  linux-image-5.17.0-xanmod1 linux-image-5.17.1-xanmod1
  linux-image-5.17.3-xanmod1 linux-image-5.17.5-xanmod1
Use 'sudo apt autoremove' to remove them.
```

That was ... interesting ... and then the issue presented itself next while I ran `apt autoremove`:

```text
Setting up linux-image-5.17.9-xanmod1 (5.17.9-xanmod1-0~git20220518.d88d798) ...
 * dkms: running auto installation service for kernel 5.17.9-xanmod1     [ OK ] 
update-initramfs: Generating /boot/initrd.img-5.17.9-xanmod1
<span style="text-decoration: underline;"><strong>zstd: error 25 : Write error : No space left on device (cannot write compressed</strong> </span>
block) 

(emphasis added)
```

`bpool` has no space left. That's almost certainly the problem. I'm going to remove a couple kernels and rebuild all my initramfs, that ought to do it. I'm also noticing my `bpool` is full of snapshots. List current snapshots with this first command, and then destroy them with the second one:

```text
// This lists the snapshots:
# zfs list -H -o name -t snapshot | grep bpool

...auto-snapshots look like pool/BOOT/ubuntu_pd3ehl<strong>@autozsys_xxxx</strong>, 
<strong>snapshots have @ symbol - no @ symbol, not a snapshot, don't delete it!</strong>

// This destroys the snapshots:
# zfs list -H -o name -t snapshot | grep bpool | xargs -n1 zfs destroy -r 
What this does:
(list only snapshots by full name) | (list only bpool) | (delete by ea line)
It's the same as what's above, but with the delete command, destroy. 

Make sure you understand what's going on with this command, as you can delete stuff you don't want to <em>really</em> easily. Please be careful.
```

... looks pretty good to me - much more tidy:

```text
# ls /boot
config-5.15.0-33-generic       memtest86+.elf
config-5.15.40-xanmod1-tt      memtest86+_multiboot.bin
efi                            System.map-5.15.0-33-generic
grub                           System.map-5.15.40-xanmod1-tt
initrd.img                     vmlinuz
initrd.img-5.15.0-33-generic   vmlinuz-5.15.0-33-generic
initrd.img-5.15.40-xanmod1-tt  vmlinuz-5.15.40-xanmod1-tt
initrd.img.old                 vmlinuz.old
memtest86+.bin
```

Install some generic kernel to make sure you have one available, check that `zfs-initramfs` is installed if all you're going to use is generic kernel (or `zfs-dkms` if using `xanmod`, other 3rd-party kernel). E.g. I got rid of my xanmod kernels just so I wouldn't have to deal with building custom `dkms` modules:

```text
# apt list --installed | grep xanmod

linux-headers-5.15.40-xanmod1-tt/unknown,now 5.15.40-xanmod1-tt-0~git20220515.867e3cb amd64 [installed,automatic]
linux-image-5.15.40-xanmod1-tt/unknown,now 5.15.40-xanmod1-tt-0~git20220515.867e3cb amd64 [installed,automatic]
linux-xanmod-tt/unknown,now 5.15.40-xanmod1-tt-0 amd64 [installed]
xanmod-repository/unknown,now 1.0.5 all [installed]

# apt remove linux-headers-5.15.40-xanmod1-tt linux-image-5.15.40-xanmod1-tt xanmod-repository linux-xanmod-tt zfs-dkms
 . . . 
The following packages will be REMOVED:
  linux-headers-5.15.40-xanmod1-tt linux-image-5.15.40-xanmod1-tt
  linux-xanmod-tt xanmod-repository zfs-dkms
Do you want to continue? [Y/n] 
 . . .
# apt autoremove -y

... install a couple kernels...

# apt install -y linux-{image,headers}-5.15.0-28-generic linux-{image,headers}-5.15.0-33-generic

 . . . using versions that are most current & 2nd most current now . . .
```

Then update all the initramfs one last time, just in case. I'll probably re-install grub, too, just bc, but one thing at a time...

```text
# update-initramfs -uvk all  

. . . lots of output . . . that's how you know it's working . . .
```

Let's re-install grub and run `update-grub`

```text
# grub-install --bootloader-id=GRUB --recheck --target=x86_64-efi --efi-directory=/boot/efi --no-floppy

Installing for x86_64-efi platform.
grub-install: warning: EFI variables cannot be set on this system.
grub-install: warning: You will have to complete the GRUB setup manually.
Installation finished. No error reported.
```

When you get this error, it just means you can't set the UEFI boot order while you're in a chroot. I also like to run `update-grub` for good measure (this is `grub2-mkconfig -o /boot/grub/grub.cfg` on most other systems if that's more familiar sounding to you). `Update-grub` rebuilds the entries in your grub menu, along with their parameters detailed in `/etc/default/grub`.

Speaking of which, you can always take a peek at `/etc/default/grub` before you run this command - just in case.

```text
# which update-grub
/usr/sbin/update-grub

# cat /usr/sbin/update-grub

// update-grub:
#!/bin/sh
set -e
exec grub-mkconfig -o /boot/grub/grub.cfg "$@"

# update-grub
Sourcing file `/etc/default/grub'
Sourcing file `/etc/default/grub.d/init-select.cfg'
Generating grub configuration file ...
Found linux image: vmlinuz-5.15.0-33-generic in rpool/ROOT/ubuntu_pd3ehl
Found initrd image: initrd.img-5.15.0-33-generic in rpool/ROOT/ubuntu_pd3ehl
Found linux image: vmlinuz-5.15.0-28-generic in rpool/ROOT/ubuntu_pd3ehl
Found initrd image: initrd.img-5.15.0-28-generic in rpool/ROOT/ubuntu_pd3ehl
Found linux image: vmlinuz-5.15.0-33-generic in rpool/ROOT/ubuntu_pd3ehl@autozsys_yg50xc
 . . . snapshot menu entries . . .
```

Now leave the chroot now, remove the system folder redirects and bind mounts, and reboot, like so:

```text
# exit

# for i in proc dev/pts dev sys boot/grub; do umount -v /mnt/$i; done
umount: /mnt/proc unmounted
umount: /mnt/dev/pts unmounted
umount: /mnt/dev unmounted
umount: /mnt/sys unmounted
umount: /mnt/boot/grub unmounted

# umount -v /dev/nvme1n1p1
umount: /mnt/boot/efi (/dev/nvme1n1p1) unmounted

# zpool export bpool

# zpool export rpool
```

One last quick thing you can do before rebooting is check out `efibootmgr` and see which order your system will start up in. This is a little easier and more predictable, as you can make sure you boot from the right efi file, rather than mashing the startup menu button to make sure it loads the correct disk / efi.

Some stuff I was messing with trying cover all the bases. `efibootmgr` reference: https://wiki.archlinux.org/title/GRUB/EFI\_examples#Asus

```text
# efibootmgr -v
Boot0000* ubuntu	HD(1,GPT,544a9120-eef7-4aae-8311-cd6ca6929213,0x800,0x100000)/File(\EFI\ubuntu\shimx64.efi)
 . . . 
# efibootmgr -B Boot0000 -b 0

# efibootmgr --create /dev/nvme1n1 --part 1 --write-signature --loader /EFI/GRUB/grubx64.efi --label "GRUB" --verbose
BootCurrent: 0002
Timeout: 0 seconds
BootOrder: 0000,0001,0002
Boot0001* UEFI: Samsung SSD 980 1TB, Partition 1	HD(1,GPT,6afa5e93-54a5-4628-978f-313a0dcfe27b,0x800,0xfa000)/File(\EFI\Microsoft\Boot\bootmgfw.efi)..BO
Boot0002* UEFI: Samsung Flash Drive DUO 1100, Partition 2	PciRoot(0x0)/Pci(0x14,0x0)/USB(16,0)/HD(2,GPT,a09db2b8-b5f6-43ae-afb1-91e0a90189a1,0x6cc954,0x2130)..BO
Boot0003  Windows Boot Manager	HD(1,GPT,6afa5e93-54a5-4628-978f-313a0dcfe27b,0x800,0xfa000)/File(\EFI\Microsoft\Boot\bootmgfw.efi)WINDOWS.........x...B.C.D.O.B.J.E.C.T.=.{.9.d.e.a.8.6.2.c.-.5.c.d.d.-.4.e.7.0.-.a.c.c.1.-.f.3.2.b.3.4.4.d.4.7.9.5.}....................
Boot0000* GRUB	HD(1,GPT,a09db2b8-b5f6-43ae-afb2-91e0a90189a1,0x40,0x6cc914)/File(\EFI\GRUB\grubx64.efi)/dev/nvme1n1
```

A troubleshooting tip: If you have issues using the pool names with zpool for some reason, the UUIDs are listed in lsblk. While technically interchangeable, the UUID can coax some commands into to working correctly when the name can't.

If it doesn't boot from the ZFS drive again, boot it into the live ISO and go through everything all over ... ;) Good luck!!
