---
title: Building required VMWare Workstation Kernel Modules Ubuntu ** updated for Secure Boot **
description: Ubuntu logo VMWare Workstation on Ubuntu requires another step to run. Sometimes the installer will install the kernel modules it requires in the installer, other times it won't. There's another step to the setup after running the installer that might as well be documented as pa…
summary: Ubuntu logo VMWare Workstation on Ubuntu requires another step to run. Sometimes the installer will install the kernel modules it requires in the installer, other times it won't. There's another step to the setup after running the installer that might as well be documented as pa…
date: 2020-06-07T07:34:59Z
author: Avery Freeman
slug: whats-wrong-with-vmware-workstation-on-ubuntu
categories:
  - Random
thumbnail: https://res.cloudinary.com/teepublic/image/private/s--4oq15QQn--/c_crop,x_10,y_10/c_fit,w_830/c_crop,g_north_west,h_1038,w_1038,x_-104,y_-175/l_upload:v1565806151:production:blanks:vdbwo35fw6qtflw9kezw/fl_layer_apply,g_north_west,x_-215,y_-286/b_rgb:e95420/c_limit,f_jpg,h_630,q_90,w_630/v1503909913/production/designs/1855918_1.jpg
thumbnail_alt: Ubuntu Authentic Logo - Ubuntu Linux - Pin | TeePublic
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2020/06/whats-wrong-with-vmware-workstation-on-ubuntu/
---

<!-- Imported from WordPress post 316. -->

![Ubuntu Authentic Logo - Ubuntu Linux - Pin | TeePublic](https://res.cloudinary.com/teepublic/image/private/s--4oq15QQn--/c_crop,x_10,y_10/c_fit,w_830/c_crop,g_north_west,h_1038,w_1038,x_-104,y_-175/l_upload:v1565806151:production:blanks:vdbwo35fw6qtflw9kezw/fl_layer_apply,g_north_west,x_-215,y_-286/b_rgb:e95420/c_limit,f_jpg,h_630,q_90,w_630/v1503909913/production/designs/1855918_1.jpg)

*Ubuntu logo*

VMWare Workstation on Ubuntu requires another step to run. Sometimes the installer will install the kernel modules it requires in the installer, other times it won't. There's another step to the setup after running the installer that might as well be documented as part of the installation process.

It's compiling kernel extensions for `vmmon` and `vmnet` - and Workstation tries to compile them out of the box, but it never works. It's missing some essential kernel extensions that are only available from GitHub. Get used to it, because every time you upgrade your kernel, you'll have to do this again (unless you create a hook for apt ... I'll have to put that in a later post).

I had to write a post about it since after doing it for the umpteenth time I realized this might be a problem for a lot of people that isn't well documented and might be exceedingly confusing for first-time users.

<!-- more -->

Make sure you have the headers and modules for your kernel - this oneliner will refresh your package cache and install them if you don't have them:  
  
`$ sudo apt update && sudo apt install -y linux-headers-$(uname -r) linux-modules-$(uname -r)`

First, you'll have to download the kernel extensions. Here's where they're available:  
  
[https://github.com/mkubecek/vmware-host-modules/releases](https://github.com/mkubecek/vmware-host-modules/releases)

You'll see filenames available for download that look like `w15.5.5-k5.7` - you want to match the first 3 numbers to your Workstation version, and the last two to your kernel - this example would be for Workstation 15.5.5 and an OS with 5.7 kernel.

Thankfully there's plenty of releases to find one that'll work for your setup. At the time of writing there is nearly 700 releases to choose from _(indicating that this has probably been a major issue for a long, long time... )_

After downloading the release, `unzip` or `untar` it and it'll create a folder called:  
  
`vmware-host-modules-_\<release version\>_`

`cd` into this folder and try making the `.ko` files:

`$ cd vmmon-only && make && cd ..`  
`$ cd vmnet-only && make && cd ..`

Create two `.tar`s:  
  
`$ tar -cf vmmon.tar vmmon-only`  
`$ tar -cf vmnet.tar vmnet-only`

Then copy them to the modules source directory for Workstation (as root):  
  
`$ sudo cp -v vmmon.tar vmnet.tar /usr/lib/vmware/modules/source/`

After copying the `.tar` files to /usr/lib/vmware/modules/source/ run this command:  
  
`$ sudo vmware-modconfig --console --install-all`

If all goes as planned, you should be able to run Workstation now.

If you notice `vmware-modconfig` complaining about errors / failing, you're probably booted under secureboot. You can disable secureboot if you'd like to make this process easier for next time, but if not - here's some additional steps you'll have the pleasure of performing over and over.

Note: Keep in mind that if you upgrade your kernel you'll absolutely have to go through this process all over again. Sometimes, but not always, updates to Workstation will require it, too.  
  
You're sure to get just as familiar with the process as I am before long.

For systems using secure boot, regarding the additional steps, they may only be necessary when changing release version of kernel, but not point version - so `5.8.0-19` to `5.8.0-21` _might_ not need a `mokutil` update, but `5.6.2` to `5.8.0` definitely would.

Generate a key pair using the openssl to sign vmmon and vmnet modules:

`$ openssl req -new -x509 -newkey rsa:2048 -keyout MOK.priv -outform DER -out MOK.der -nodes -days 36500 -subj "/CN=VMware/"`

Sign the modules using the generated key:  
  
`$ sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 ./MOK.priv ./MOK.der $(modinfo -n vmmon)`  
  
`$ sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 ./MOK.priv ./MOK.der $(modinfo -n vmnet)`

Import the public key to the system's MOK list:

`$ sudo mokutil --import MOK.der`

Choose a password you'll remember for the MOK key enrollment, since the next step is rebooting and enrolling it in your UEFI firmware.

Reboot your machine. Follow the instructions to enroll the MOK key in your firmware from the UEFI console, and go back to your Ubuntu terminal and run:  
  
`$ sudo vmware-modconfig --console --install-all`

That should take care of it for you.  
  
Now just make sure you bookmark this page and the Github releases page so you can come back when you upgrade your kernel and do this all over again!

Good luck!

References:  
  
[https://github.com/mkubecek/vmware-host-modules/releases](https://github.com/mkubecek/vmware-host-modules/releases)  
  
[https://askubuntu.com/questions/1135343/ubuntu-19-04-vmware-kernel-modules-updater](https://askubuntu.com/questions/1135343/ubuntu-19-04-vmware-kernel-modules-updater)  
  
[https://kb.vmware.com/s/article/2146460](https://kb.vmware.com/s/article/2146460)
