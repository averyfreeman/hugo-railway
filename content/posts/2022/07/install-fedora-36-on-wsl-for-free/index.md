---
title: Install Fedora 36 from RAW disk image on WSL - for free - by using WSL
description: Neofetch doesn't find much when you have no DE/WM/DM or icons, but tries its best... Some people are charging for Fedora in the Windows store. I guess it's good work if you can get it (?) Charging for someone else's free OS seems kinda lame to me, but I don't mind getting my han…
summary: Neofetch doesn't find much when you have no DE/WM/DM or icons, but tries its best... Some people are charging for Fedora in the Windows store. I guess it's good work if you can get it (?) Charging for someone else's free OS seems kinda lame to me, but I don't mind getting my han…
date: 2022-07-29T08:46:27Z
author: Avery Freeman
slug: install-fedora-36-on-wsl-for-free
categories:
  - Random
thumbnail: /post-thumbnails/attachment-598.webp
thumbnail_alt: Install Fedora 36 from RAW disk image on WSL - for free - by using WSL
thumbnail_width: 480
thumbnail_height: 363
thumbnail_aspect: 1.322314049586777
type: post
status: publish
url: /posts/2022/07/install-fedora-36-on-wsl-for-free/
---

<!-- Imported from WordPress post 597. -->

![](/wp-content/uploads/2022/07/image.webp)

*Neofetch doesn't find much when you have no DE/WM/DM or icons, but tries its best...*

Some people are charging for Fedora in the Windows store. I guess it's good work if you can get it (?) Charging for someone else's free OS seems kinda lame to me, but I don't mind getting my hands dirty.

I could see this process being intimidating for some people, for them $5.99 might be a worthwhile investment to be able to _not_ do what I explain herein. But if that's the case, it's probably better you just don't use Linux to begin with. Those are the people for whom paying like 2000% more for a Macintosh is like, totally worth it. You know who you are.

Note: you do need a working installation of WSL (like the Ubuntu base image), or a linux machine to do this on to start with. Or you could try a util like `imdisk` in Windows, but I couldn't figure it out, so I used WSL since I already knew how this process could be achieved in Linux (fairly easily).

Open up a command prompt in Windows and find suitable dir for downloading a large file, such as:

```text
cd %USERPROFILE%\Downloads
```

download raw - e.g.:

```text
wget https://mirror.sfo12.us.leaseweb.net/fedora/linux/releases/36/Cloud/x86_64/images/Fedora-Cloud-Base-36-1.5.x86_64.raw.xz
```

I chose Fedora Cloud, which is pretty cool, mainly just because it was available in a `.raw` file, while Fedora Server was only available in `.iso`. I don't know much about it, but I noticed it uses `systemd-networkd` instead of `NetworkManager`, which makes sense for a cloud-centric OS. That's a plus in my book.

Choose a distro to invoke, enter `wsl` from `cmd`, and you should be in same dir as you were previously:

```text
wsl -l -v

  NAME             STATE           VERSION
* Ubuntu           Running         2

wsl -d ubuntu  # you can just invoke wsl unless need to specify distro
```

Once you're in wsl, you can use `bash` to save an environment variable for your username and copy these commands straight across (except `/dev/loop` - make sure you're using the right loop number and partitions, those are unique to your system, unlikely to be the same, esp if you use a dif distro or release).

```text
export USERNAME=<your username on the PC>
```

Decompress the raw from any archive. E.g.:

```text
xz -d Fedora-Cloud-Base-36-1.5.x86_64.raw.xz
```

`xz` deletes the original, so no need to worry about that. Now create a loop for all the partitions, and list those mounts :

```text
losetup -f -P ./Fedora-Cloud-Base-36-1.5.x86_64.raw<br>losetup -l
```

At e.g. `/dev/loop0` you should have your `.raw` file mounted as a device. Now you actually have to mount it as one image (as if it were booted). Create a working subdirectory:

```text
mkdir -p /media/raw
```

list the partitions on your loop device:

```text
fdisk -l /dev/loop0

Disk /dev/loop0: 5 GiB, 5368709120 bytes, 10485760 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: BF6BA5C6-0688-4AB6-B09C-942136A8C104

Device Start End Sectors Size Type
/dev/loop0p1 2048 4095 2048 1M BIOS boot
/dev/loop0p2 4096 2052095 2048000 1000M Linux filesystem
/dev/loop0p3 2052096 2256895 204800 100M EFI System
/dev/loop0p4 2256896 2265087 8192 4M PowerPC PReP boot
/dev/loop0p5 2265088 10483711 8218624 3.9G Linux filesystem
```

The root partition is going to go first, and then boot, and finally efi, so in that order.

```text
mount /dev/loop0p5 /media/raw # largest partition generally indicates root
```

Look at what you're working with, sometimes there's a root subdir, but usually there isn't:

```text
ls /media/raw<br>home root
```

This time there was a subdir named `root`, so base the subsequent mounts off of your new information:

```text
mount /dev/loop0p2 /media/raw/root/boot<br>mount /dev/loop0p3 /media/raw/root/boot/efi
```

Now you can go to the root folder of the filesystem and archive the image in one go - the trick to making the syntax simple is being inside the directory but saving the `.tar` elsewhere (in this example, we'll use the parent folder):

```text
cd /media/raw/root
tar -cvf ../fedora-cloud-36.tar .  # notice these periods, they indicate $pwd
```

And in the parent directory will be your tar. Now move it out to C:

```text
mv -v /media/raw/fedora-cloud-36.tar /mnt/c/Users/$USERNAME/Downloads/.
```

exit WSL, but stay at command prompt:

```text
exit
```

cd your save location:

```text
cd %USERPROFILE%\Downloads
```

Import `.tar` into WSL:

```text
mkdir %PROGRAMDATA%\wsl
C:\Users\avery\Downloads>wsl --import Fedora-Server %PROGRAMDATA%\wsl\fedora-server .\fedora-cloud-36.tar
```

Run it to see if it works:

```text
wsl -d fedora-server
cat /etc/os-release

NAME="Fedora Linux"
VERSION="36 (Cloud Edition)"
ID=fedora
VERSION_ID=36
VERSION_CODENAME=""
PLATFORM_ID="platform:f36"
PRETTY_NAME="Fedora Linux 36 (Cloud Edition)"
ANSI_COLOR="0;38;2;60;110;180"
LOGO=fedora-logo-icon
CPE_NAME="cpe:/o:fedoraproject:fedora:36"
HOME_URL="https://fedoraproject.org/"
DOCUMENTATION_URL="https://docs.fedoraproject.org/en-US/fedora/f36/system-administrators-guide/"
SUPPORT_URL="https://ask.fedoraproject.org/"
BUG_REPORT_URL="https://bugzilla.redhat.com/"
REDHAT_BUGZILLA_PRODUCT="Fedora"
REDHAT_BUGZILLA_PRODUCT_VERSION=36
REDHAT_SUPPORT_PRODUCT="Fedora"
REDHAT_SUPPORT_PRODUCT_VERSION=36
PRIVACY_POLICY_URL="https://fedoraproject.org/wiki/Legal:PrivacyPolicy"
VARIANT="Cloud Edition"
VARIANT_ID=cloud
```

BTW, you can safely remove the kernel, since WSL always uses the one installed through Windows:

```text
dnf remove -y kernel-core
```

Enjoy Fedora …

PS: for homework, you could figure out what else you don't need you could uninstall or replace, depending on what distro you choose. Systemd comes to mind, or whatever init system you're using, since you can't use that in WSL, either... fun fact: you use task scheduler in Windows to schedule stuff to run in WSL instead of `cron`...
