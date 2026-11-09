---
title: Getting touchpad scroll to work in VMWare Workstation
description: Shiny new Kubuntu 20.04 dev platform So, I develop using NodeJS, and I use Windows. Anyone who uses both together and has used Linux as a dev platform has probably realized the Windows version is a little lackluster and has edge configuration issues that make it a pain. So I was…
summary: Shiny new Kubuntu 20.04 dev platform So, I develop using NodeJS, and I use Windows. Anyone who uses both together and has used Linux as a dev platform has probably realized the Windows version is a little lackluster and has edge configuration issues that make it a pain. So I was…
date: 2020-06-10T02:56:39Z
author: Avery Freeman
slug: getting-touchpad-scroll-to-work-in-vmware-workstation
categories:
  - Random
thumbnail: /post-thumbnails/attachment-319.webp
thumbnail_alt: Getting touchpad scroll to work in VMWare Workstation
thumbnail_width: 480
thumbnail_height: 369
thumbnail_aspect: 1.3008130081300813
type: post
status: publish
url: /posts/2020/06/getting-touchpad-scroll-to-work-in-vmware-workstation/
---

<!-- Imported from WordPress post 318. -->

![](/wp-content/uploads/2020/06/image-1024x787.webp)

*Shiny new Kubuntu 20.04 dev platform*

So, I develop using NodeJS, and I use Windows. Anyone who uses both together and has used Linux as a dev platform has probably realized the Windows version is a little lackluster and has edge configuration issues that make it a pain.

So I was setting up a dev environment on an ESXi host so I could have one place in which I do my development and not have to switch back and forth between Windows and Linux platforms, deal with the painfully slow WSL, Windows 'git bash', etc. do everything native.

That was a great idea until I got it all set up and realized my touchpad wouldn't scroll anymore.

<!-- more -->

Not just in the new Kubuntu dev VM, but everywhere! My Thinkpad's touchpad literally would not scroll ANYWHERE, not in Ubuntu, not in Windows, nada.

I had just installed `VMWare-tools 10.3.21` which as of June 2020 was still the latest edition at over a year old (surprising). However, there is a KB article in which VMWare recommends using the `open-vm-tools` package, which I had thought was an open-source knock-off, but through a little digging I found out it is actually an official release from VMWare that appears to have been open-sourced.  
  
Reference: [https://github.com/vmware/open-vm-tools](https://github.com/vmware/open-vm-tools)

Thinking this might have contributed to my non-scrolling touchpad issue, I promptly uninstalled `VMWare-tools` and installed the `open-vm-tools-desktop` package.

To my surprise, my touchpad started scrolling again, both in the VM and in Windows.

So, as a PSA, anyone who's experiencing this issue (maybe it's a Synaptics-related thing?) try using the `open-vm-tools` package instead of `VMWare-tools` and maybe your touchpad will magically start scrolling again...

![Genuine Lenovo Thinkpad T460S T470S Three button Touchpad Clickpad ...](https://c1.neweggimages.com/ProductImage/A7BJ_1_20171130250419596.jpg)

*"I feel so alive!"*
