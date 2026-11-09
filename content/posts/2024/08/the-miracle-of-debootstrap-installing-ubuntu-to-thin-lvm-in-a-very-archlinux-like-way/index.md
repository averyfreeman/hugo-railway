---
title: "Getting Granular: `arch-install-scripts` and `debootstrap` used to install Ubuntu 26.04 Resolute Raccoon to Thin-LVM like the Archlinux install guide"
description: Get ready for some cross-distro Linux synesthesia Can you spot Jimi Hendrix? Installing Ubuntu to Thin-lvm in a Very Arch-Like Way This is a way you can install a Debian-like OS on thin-lvm. It's 2026, and installers I've tried still don't have options for thin-lvm, as far as I'…
summary: Get ready for some cross-distro Linux synesthesia Can you spot Jimi Hendrix? Installing Ubuntu to Thin-lvm in a Very Arch-Like Way This is a way you can install a Debian-like OS on thin-lvm. It's 2026, and installers I've tried still don't have options for thin-lvm, as far as I'…
date: 2024-08-13T01:20:05Z
author: Avery Freeman
slug: the-miracle-of-debootstrap-installing-ubuntu-to-thin-lvm-in-a-very-archlinux-like-way
categories:
  - Random
thumbnail: /post-thumbnails/attachment-963.webp
thumbnail_alt: "Getting Granular: `arch-install-scripts` and `debootstrap` used to install Ubuntu 26.04 Resolute Raccoon to Thin-LVM like the Archlinux install guide"
thumbnail_width: 480
thumbnail_height: 599
thumbnail_aspect: 0.8013355592654424
type: post
status: publish
url: /posts/2024/08/the-miracle-of-debootstrap-installing-ubuntu-to-thin-lvm-in-a-very-archlinux-like-way/
---

<!-- Imported from WordPress post 962. -->

Get ready for some cross-distro Linux synesthesia

![Astral Albert Hoffman examines molecule of LSD](/wp-content/uploads/2024/08/image-821x1024.webp)

*Can you spot Jimi Hendrix?*

**Installing Ubuntu to Thin-lvm in a Very Arch-Like Way**

This is a way you can install a Debian-like OS on thin-lvm. It's 2026, and installers I've tried still don't have options for thin-lvm, as far as I'm aware. Therefore, I usually install Debian-like OS using `debootstrap`, so I have both benefits of copy-on-write (CoW) at the volume level, while still enjoying the lower latency of using a journaling filesystem (`ext4`, `xfs`, etc.) as opposed to CoW filesystems (`btrfs`, `zfs`).

Most people who have used Proxmox will notice ext4 on thin-lvm is the default installation configuration. If CoW filesystems are universally higher latency, `ext4` on thin-lvm is a great way to overcome each one's deficiencies. Proxmox's other recommended filesystem is `zfs`, which mitigates slow latency to some degree by implementing an ARC, but for a VM host (hypervisor), using valuable RAM for VMs is less ideal than not needing a cache to improve IOPS in the first place, especially for lower-end setups such as edge deployments, IoT servers, homelabs, etc. Therefore, the most straightforward way to get benefits of both CoW and journaled FS is using thin-lvm with `ext4` or `xfs`.

Throughput + latency references:  
[https://chronicle.software/linux-file-systems-and-application-latency/](https://chronicle.software/linux-file-systems-and-application-latency/)  
[https://www.dimoulis.net/posts/benchmark-of-postgresql-with-ext4-xfs-btrfs-zfs/](https://www.dimoulis.net/posts/benchmark-of-postgresql-with-ext4-xfs-btrfs-zfs/)

On the flip side, some of us just prefer installing our OS the way Arch compels its users to install Arch - it allows for a lot more customization and granular control. In my case, I got used to installing distros the way I installed Arch after installing it over and over again so many times, and moreover, automated installer programs tended to lack the ability to install features I wanted. The only downside compared to using an installer to the `Arch Install Scripts` or `debootstrap` install methods, besides simplicity, is having to understand what it is you're doing.

**Disclaimer:** Remember your device names, such as `/dev/mapper/vg-lv` should reflect the names for volume group and logical volumes you decide to use. They're unlikely to be exactly like mine, unless you choose to use them exactly.

Another blooger named Ansemjo published his method for bootstrapping Ubuntu with `debootstrap` to use LUKS - it was my main source for adaptation, so I wanted to give him a shout out (thanks, Ansemjo!).

My adaptation I provide here is more simple _(aka less difficult to implement)_, and specific to newer versions of Debian and Ubuntu, but does not include options for encryption. If you're interested in adding a LUKS volume and encrypting your drive, I definitely recommend checking out Ansemjo's original instructions here: [https://semjonov.de/posts/2021-09/minimal-ubuntu-installation-with-debootstrap/](https://semjonov.de/posts/2021-09/minimal-ubuntu-installation-with-debootstrap/)

Let's get started.

The easiest thing to do is use an installer ISO from Ubuntu or Debian live ISO, where one can use the operating system straight from a USB flash drive. Boot from the flash drive and open a terminal, which in Ubuntu is `ctrl+alt+T`

Enter `sudo su` so you can operate with `root` permissions, and install `arch-install-scripts` and `debootstrap` (updating or upgrading the live ISO's packages not necessary, and can eventually lead to buffer overflow errors, making the live environment inoperable - we want to make sure the OS we're installing is up-to-date, not the live ISO)

```bash
# open terminal 
ctrl-alt-T

# become root
sudo su

# install the two packages we need
apt install -y arch-install-scripts debootstrap
```

Presume we have a Samsung PM981a SSD with 256GB advertised available storage (around 230GB in reality). First, wipe it and use `fdisk` to make it a GPT volume, and create three partitions (EFI, BOOT, and LVM) (be sure to replace `/dev/nvme0n1` with whichever device you're using)

```bash
# CAREFUL, THIS WIPES THE ENTIRE DISK
wipefs -a /dev/nvme0n1
[... wipefs output ...]
```

Then, follow this process while you're inside `fdisk`:

```bash
fdisk /dev/nvme0n1

# in fdisk, create GPT partition structure:
g, w [enter]

# open fdisk again, and create partitions:
fdisk /dev/nvme0n1

# a 1GB EFI partition which will be /dev/nvme0n1p1
n, [enter], +1G [enter]
# set to EFI type:
t, [enter], 1

# a 2GB XBOOTLDR partition /dev/nvme0n1p2
n, [enter], +2G [enter]
t, 2 (or [enter]), 142  # extended boot partition

# then we use the rest for LVM, since we can create a swap partition that won't automatically take up its entire allocated space

n, [enter], [enter] # for the rest of the space
t, 3 (or [enter]), 44 # lvm partition

# then write changes and exit
w [enter]
```

You'll need to mark that 3rd partition to be an LVM volume. Start that process by configuring it as a `physical volume`:

```bash
pv /dev/nvme0n1p3
```

Then you need a volume group - you can name it whatever you like. Numbers can help with collisions if you plan to have more than one (if I'm only planning to have one per system, I don't worry about it):

```bash
# [vg command] [physical volume] [volume group name]
vg /dev/nvme0n1p3 vg
```

Then, I like to separate the thinpool creation step from creating any logical volumes. You can double them up, but I plan on creating a few, so I prefer the 2-step granularity:

```bash
# [lv] [type] [% allocated] [pool options] [vg name]
lvcreate --type thin-pool -l 90%FREE -Zn -c64 -n thinpool vg
```

```bash
apt update && apt install -y arch-install-scripts
mount /dev/mrvg/mrrootlv /mnt
arch-chroot /mnt mount -a
```

If you want to check out the current layout, try running `lsblk -f` (especially nice with the alias I recommended if you're on Ubuntu)

RE: the 90%FREE allocation, I like to leave some space as an insurance policy for the chance I commit more data to a volume than space it has been allocated (a bad situation). You're welcome to make it 100%FREE if you're more confident (less careful).

The thin-pool is just a container, we won't actually be writing to it directly. Inside the pool are the actual volumes we're going to use - let's create those:

```bash
lvcreate -V 80G -n root vg/thinpool 
lvcreate -V 40G -n home vg/thinpool
lvcreate -V 40G -n containers vg/thinpool
lvcreate -V 32G -n swap vg/thinpool
```

You can probably see right away this is getting awfully close to the physical space we've allocated for our pool from our ~230GB drive, but don't worry - as long as they're not full, they won't be automatically taking up all the space we're assigning to them. The beauty of using thin LVM is it automatically implements sparse volumes. Just be careful and don't go too crazy with overcommitting. I personally like to overcommit swap since it's rarely used, but if you need it for a `crashdump` log, it'll be there if when necessary _(rule of thumb is to create a swap the same size as total system RAM)_.

Example of `lsblk` with alias (removes `iso` and `loop` devices):

```bash
# use alias to reduce extraneous lsblk output:
alias lsblk="lsblk -f | grep -v -E 'loop|sr0'"

lsblk

NAME                    MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1                 253:0    0   232G  0 disk 
├─nvme0n1p1             253:1    0     1G  0 part /efi
├─nvme0n1p2             253:2    0     2G  0 part /boot
└─nvme0n1p3             253:3    0 228.6G  0 part 
  ├─vg-thinpool_tmeta   252:0    0    24M  0 lvm  
  │ └─vg-thinpool-tpool 252:2    0  20.8G  0 lvm  
  │   ├─vg-thinpool     252:3    0 198.8G  1 lvm  
  │   ├─vg-swap         252:4    0    32G  0 lvm  
  │   └─vg-root         252:5    0    40G  0 lvm  
  │   └─vg-home         252:5    0    80G  0 lvm  
  │   └─vg-containers   252:5    0    40G  0 lvm  
  └─vg-thinpool_tdata   252:1    0 198.8G  0 lvm  
    └─vg-thinpool-tpool 252:2    0  20.8G  0 lvm  
      ├─vg-thinpool     252:3    0 198.8G  1 lvm  
      ├─vg-swap         252:4    0    32G  0 lvm  
      └─vg-root         252:5    0    40G  0 lvm  
      └─vg-home         252:5    0    80G  0 lvm  
      └─vg-containers   252:5    0    40G  0 lvm 
      
  # Note: These values are calculated as example
  # not actual values taken from running machine
```

Create filesystems:

```bash
# first, create FS on raw partitions
mkfs.msdos -F 32 -n EFI /dev/nvme0n1p1
mkfs.ext4 -L BOOT /dev/nvme0n1p2

# then, create FS on logical volumes
mkswap -v -L SWAP /dev/vg/swap

# ext4 is nice since can be shrunk if necessary
mkfs.ext4 -L ROOT /dev/vg/root
mkfs.ext4 -L HOME /dev/vg/home

# I like XFS for docker's overlay2 FS, but 
# be aware that XFS never be shrunk!
mkfs.xfs -L CONTAINERS /dev/vg/containers
```

Here's an example of some Ubuntu meta-packages on 26.04, for instance `ubuntu-server` (TUI, no desktop), `ubuntu-desktop`, `vanilla-gnome-desktop` (my favorite) etc. etc. You can install more meta-packages using `tasksel`, so I actually like to start with the smallest one possible, making `ubuntu-server` the best pick in that regard (sometimes `debootstrap` craps out while installing packages):

```bash
apt search ubuntu-desktop
Sorting... Done
Full Text Search... Done
edubuntu-desktop/resolute 26.04 amd64
  educational desktop for Ubuntu

edubuntu-desktop-minimal/resolute 26.04 amd64
  educational desktop for Ubuntu

kubuntu-desktop/resolute 1.451 amd64
  Kubuntu Plasma Desktop/Netbook system

lubuntu-desktop/resolute 24.04.10 amd64
  Lubuntu Desktop environment

ubuntu-desktop/resolute 1.539 amd64
  Ubuntu desktop system

ubuntu-desktop-minimal/resolute 1.539 amd64
  Ubuntu desktop minimal system

xubuntu-desktop/resolute 2.262 amd64
  Xubuntu desktop system

xubuntu-desktop-minimal/resolute 2.262 amd64
  Xubuntu minimal system
```

Mount FS structure and bootstrap:

```bash
# mount the root volume to /mnt
mount /dev/vg/root /mnt

# create boot folder, mount boot partition nvme0n1p2
mkdir -pv /mnt/boot
mount -v /dev/nvme0n1p2 /mnt/boot

# create efi folder, mount efi partition nvme0n1p1
mkdir -pv /mnt/boot/efi
mount -v /dev/nvme0n1p1 /mnt/efi

# create home folder and mount home lv
mkdir -pv /mnt/home
mount -v /dev/vg/home /mnt/home

# this step optional
mkdir -pv /mnt/var/lib/docker
mount -v /dev/vg/containers /mnt/var/lib/docker

debootstrap --arch=amd64 \
        --components=main,restricted,universe,multiverse \
        --include=systemd-boot,systemd-boot-efi,systemd-boot-tools,arch-install-scripts,debootstrap,ubuntu-server,vim-scripts,vim-airline-themes,git,efibootmgr,bash-completion,thin-provisioning-tools,apt-file \
        --keyring=/usr/share/keyrings/ubuntu-archive-keyring.gpg \
        resolute /mnt https://mirror.leaseweb.com/ubuntu/
```

If you're using the Ubuntu 26.04 live ISO, you can copy the host's `apt` sources file to your new filesystem:

```bash
cp /etc/apt/sources.list.d/ubuntu.sources /mnt/etc/apt/sources.list.d
```

Create `/mnt/etc/kernel/cmdline` with a `/dev/mapper` appropriate for you (note: it's more reliable to use `/dev/mapper/vg-lv` for initramfs than `/dev/vg/lv`):

```bash
echo 'root=/dev/mapper/vg-root ro loglevel=6 intel_iommu=1 iommu=pt kvm.ignore_msrs=1 crashkernel=1024M' > /mnt/etc/kernel/cmdline
```

Mount the swap before creating `fstab` - here's an example using the partition `LABEL` instead of the device path:

```bash
arch-chroot /mnt swapon -v -L SWAP
```

Create your fstab. `genfstab -t PARTUUID` is nice because it should contain all the currently mounted filesystems, but additionally will replace `PARTUUID` with `UUID` or device path where appropriate (e.g. `EFI` partition will automatically use `UUID`, and logical volumes will use device mapper paths):

```bash
genfstab -t PARTUUID /mnt > /mnt/etc/fstab
```

Delete the `/mnt` from the paths in the new fstab:

```bash
sed -i 's|/mnt||g' /mnt/etc/fstab
```

Here's a finished example - view  
using `cat /mnt/etc/fstab`:

```bash
# &lt;file system> &lt;mount point>   &lt;type>  &lt;options>       &lt;dump>  &lt;pass>
# /dev/mapper/mrvg-mrrootlv UUID=37374f8c-a4bf-4577-96c0-1cd8a9fbe114 LABEL=MR_ROOTLV
/dev/mapper/vg-root    /           ext4         rw,relatime   0 1

# /dev/vda1 PARTUUID=a5a6570a-ea64-4480-b6d7-fb3f6a504cbf LABEL=MR_EFI
UUID=C615-2241            /efi        vfat        rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro    0 2

# /dev/vda2 UUID=2a466a62-2a00-4a2e-b8aa-734d71039d67 LABEL=MR_XBOOTLDR
PARTUUID=03b8e7e8-a010-4d06-b09c-5503b609d022    /boot       ext4        rw,relatime 0 2

/dev/mapper/vg-home    /home       ext4         rw,relatime   0 1

/dev/mapper/vg-containers /var/lib/docker           xfs      rw,relatime   0 1

# /dev/dm-4 UUID=fb30403b-2101-4cf9-a083-a5debd8ad60a LABEL=MR_SWAPLV
/dev/mapper/vg-swap     none        swap        defaults    0 0
```

Important step (don't miss!):  
Try and run `arch-chroot /mnt` to log into your new filesystem.  
  
If you get this error when trying to use `arch-chroot`:

```bash
arch-chroot /mnt
mount: /mnt/dev: udev already mounted on /dev.
       dmesg(1) may have more information after failed mount system call.
==> ERROR: failed to setup chroot /mnt
```

Solution was to:

```bash
swapoff -a
umount /mnt/dev
```

Try `arch-chroot /mnt` again!  
  
`bash-completion` wasn't initialized, so I set it up for root login (tab-completion can help with diagnoses):

```bash
sed -i 's|#if|if|g' $HOME/.bashrc
sed -i 's|#fi|fi|g' $HOME/.bashrc
sed -i 's|#    . /etc/bash_completion|    . /etc/bash_completion|g' $HOME/.bashrc

# if you also want to uncomment the dircolors aliases:
sed -i 's|#alias|alias|g' $HOME/.bashrc
```

It's good to install the kernels while you're chrooted into the new filesystem, but first, update `dpkg`'s `locale` settings before installing any more packages (otherwise, lots of errors):

```bash
arch-chroot /mnt 
locale-gen "en_US.UTF-8"
dpkg-reconfigure locales
(skip to OK, enter)
(select "en_US.UTF-8", OK, enter)

# update just in case - will show error
# if locale settings not resolved
apt update
apt upgrade -y
```

Install kernel (and optional headers):

```bash
cp /usr/lib/kernel/install.conf /etc/kernel
apt install -y linux-image-generic linux-headers-generic
```

Make sure you have `dm_thin_pool` modules loaded

```bash
lsmod | grep thin
dm_thin_pool           73728  0
dm_persistent_data     90112  1 dm_thin_pool
dm_bio_prison          20480  1 dm_thin_pool
```

If you don't see an output like that, do this:

```bash
echo 'dm-thin-pool' > /etc/modules-load.d/dm-thin-pool.conf

# re-create your initramfs
update-initramfs -vuk all
```

Whilst still in chroot, check and make sure `/mnt/boot` has your `initrd` with `tree`:

```bash
apt list --installed | grep linux-image

tree /boot
/boot
├── EFI
│   └── Linux
├── System.map-6.18.0-12-generic
├── $(cat /etc/machine-id)
│   └── 6.18.0-12-generic
│       ├── initrd.img-6.18.0-12-generic
│       └── linux
├── config-6.18.0-12-generic
├── grub
│   ├── gfxblacklist.txt
│   └── unicode.pf2
├── initrd.img -> initrd.img-6.18.0-12-generic
├── initrd.img-6.18.0-12-generic
├── loader
│   ├── entries
│   │   └── $(cat /etc/machine-id)-6.18.0-12-generic.conf
│   └── entries.srel
├── lost+found
├── vmlinuz -> vmlinuz-6.18.0-12-generic
├── vmlinuz-6.18.0-12-generic
```

(Still in chroot) install the systemd bootloader - this is best done after `linux-image-generic`, since it'll install GRUB's `BOOTx64.EFI` over systemd-boot's copy - `bootctl update` won't work for this

```bash
bootctl --esp-path=/efi --boot-path=/boot install
```

I'm not sure if you need the `efifs` packages (`*.efi` files) so `systemd-boot` can load your `/boot` partition in Ubuntu 26.04, but it's probably a good idea to do this step just in case  
  
Check the URL[https://github.com/pbatard/efifs/releases](https://github.com/pbatard/efifs/releases) first to make sure downloading latest ver, and change `v1.10` to whatever that might be:

```bash
cd /efi/EFI/systemd/ && mkdir drivers && cd drivers
for EFIFS in affs afs bfs btrfs cbfs cpio_be cpio erofs exfat ext2 f2fs fat hfs hfsplus iso9660 jfs minix2_be minix2 minix3_be minix3 minix_be minix newc nilfs2 ntfs odc procfs reiserfs romfs sfs squash4 tar udf ufs1_be ufs1 ufs2 xfs zfs; do \
wget "https://github.com/pbatard/efifs/releases/download/v1.10/${EFIFS}_x64.efi"; done
cd /
```

Create a user and a root password, give the user `sudo` group access:

```bash
# root
passwd

# user
useradd -m username
passwd username
usermod -aG sudo username
# default shell probably /bin/sh
chsh username -s /bin/bash
```

You can check to make sure `sudo` is working for your user

```bash
su username
sudo ls -la /
[sudo] password for avery: 
(should output `ls -la /`)
```

I'm thinking this system should boot now, so I'm going to power off, change the boot device to `/dev/nvme0n1p1`, and check it out

```bash
exit  # chroot
poweroff
```

TL;DR if you experienced boot failure, perhaps you'd not installed `thin-provisioning-tools` before building your `initramfs` images. If you _did_ install it, and had no problems, feel free to skip this part unless you're curious…

I didn't include `thin-provisioning-tools` in one of the earlier lists of modules included with `debootstrap`, so my system didn't boot. There is a file in `thin-provisioning-tools` that adds functionality to `initramfs-tools` package, namely the hook file `/usr/share/initramfs-tools/hooks/thin-provisioning-tools` that adds the `dm-thin-pool` module at the bottom of this example of the hook to be compiled along with the rest of the `initrd`. Here's the hook:

```bash
# File: /usr/share/initramfs-tools/hooks/thin-provisioning-tools

#!/bin/sh

PREREQ=""

prereqs()
{
    echo "$PREREQ"
}

case $1 in
prereqs)
    prereqs
    exit 0
    ;;
esac

. /usr/share/initramfs-tools/hook-functions

copy_exec /usr/sbin/pdata_tools
ln -s pdata_tools ${DESTDIR}/usr/sbin/cache_check
ln -s pdata_tools ${DESTDIR}/usr/sbin/thin_check

manual_add_modules dm-cache dm-cache-smq dm-thin-pool
```

If rebuilding your `initrd` _after_ installing `thin-provisioning-tools`, run `update-initramfs -vuk all` and look for lines corresponding to the modules added at the bottom of `/usr/share/initramfs-tools/hooks/thin-provisioning-tools` in the output - that should be an indicator that required modules are being added now:

```bash
  . . .

dracut-install: mkdir '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md'
dracut-install: cp '/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-cache.ko.zst' '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-cache.ko.zst'
dracut-install: cp '/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-bufio.ko.zst' '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-bufio.ko.zst'
dracut-install: cp '/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-bio-prison.ko.zst' '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-bio-prison.ko.zst'
dracut-install: mkdir '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/persistent-data'
dracut-install: cp '/lib/modules/6.18.0-12-generic/kernel/drivers/md/persistent-data/dm-persistent-data.ko.zst' '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/persistent-data/dm-persistent-data.ko.zst'
dracut-install: cp '/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-cache-smq.ko.zst' '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-cache-smq.ko.zst'
dracut-install: cp '/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-thin-pool.ko.zst' '/var/tmp/mkinitramfs_Y5NSco/lib/modules/6.18.0-12-generic/kernel/drivers/md/dm-thin-pool.ko.zst'

. . .
```

A quick synopsis is that without these tools, initrd will lack required modules, but with it, initrd should boot fine. For a more lengthy explanation, see old workaround:  
https://bugs.launchpad.net/ubuntu/+source/lvm2/+bug/1539934/comments/2 \[comment 2\]  
https://askubuntu.com/questions/673815/how-do-i-start-my-laptop-with-root-partition-on-lvm2-thin-pool

Of course, none of this is really necessary if you install the `thin-provisioning-tools` package initially.

Last, but definitely not least, if you want to use `snapper`, you can set up a very minimal configuration for snapshots taken on each boot [like this when you reboot](https://github.com/averyfreeman/Arch-Router-Laptop/blob/main/partition-lvm-and-snapper-setup.sh) into your new machine:

```bash
systemctl disable snapper-timeline.timer
systemctl enable snapper-boot.timer
systemctl enable snapper-cleanup.timer

snapper --no-dbus -c root create-config \
                --fstype="lvm(ext4)" /

snapper --no-dbus set-config \
                NUMBER_LIMIT=6 \
                NUMBER_LIMIT_IMPORTANT=3 \
                TIMELINE_CLEANUP=no \
                TIMELINE_CREATE=no \
                TIMELINE_LIMIT_DAILY=2 \
                TIMELINE_LIMIT_HOURLY=1 \
                TIMELINE_LIMIT_WEEKLY=3 \
                TIMELINE_LIMIT_MONTHLY=5 \
                TIMELINE_LIMIT_QUARTERLY=5 \
                TIMELINE_LIMIT_YEARLY=5

snapper --no-dbus list-configs
```

That ought to do it! Hope this went well for you.

If you see anything missing, or have any information you'd like to share, especially detailing your experience trying an _Archlinux-like install process with a Debian-like OS_, please write the community in the comments section below!
