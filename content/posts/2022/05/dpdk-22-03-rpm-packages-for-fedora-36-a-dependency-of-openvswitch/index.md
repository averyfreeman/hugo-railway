---
title: "dpdk 22.03 rpm packages for Fedora 36: a dependency of openvswitch"
description: I meant to post this over a month ago, but got sidetracked, so I'm coming in a little late. Unfortunately, it looks like even though Fedora 36 has officially been released, the dpdk 22.03 rpms still aren't available. Back when I compiled these, I realized there were no official…
summary: I meant to post this over a month ago, but got sidetracked, so I'm coming in a little late. Unfortunately, it looks like even though Fedora 36 has officially been released, the dpdk 22.03 rpms still aren't available. Back when I compiled these, I realized there were no official…
date: 2022-05-19T02:13:28Z
author: Avery Freeman
slug: dpdk-22-03-rpm-packages-for-fedora-36-a-dependency-of-openvswitch
categories:
  - Random
thumbnail: https://slideplayer.com/slide/17900458/108/images/7/Open+vSwitch+%28OVS%29+With+DPDK+ARCHITECTURE.jpg
thumbnail_alt: "open vswitch with DPDK: architecture and performance - ppt download"
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2022/05/dpdk-22-03-rpm-packages-for-fedora-36-a-dependency-of-openvswitch/
---

<!-- Imported from WordPress post 545. -->

![open vswitch with DPDK: architecture and performance - ppt download](https://slideplayer.com/slide/17900458/108/images/7/Open+vSwitch+%28OVS%29+With+DPDK+ARCHITECTURE.jpg)

I meant to post this over a month ago, but got sidetracked, so I'm coming in a little late. Unfortunately, it looks like even though Fedora 36 has officially been released, the dpdk 22.03 rpms still aren't available.

Back when I compiled these, I realized there were no official dpdk 22.03 rpms available in the yum repos, despite being required for openvswitch. So I compiled them so I could install openvswitch for use with virt-manager.

Dpdk on Fedora has an official maintainer, they probably just got sidetracked themselves - I can relate. But I had these packages already and wanted to help other people install openvswitch, so I posted the resulting packages in a github repo case other people want to download it.

So if you (like me) want to run openvswitch on your fancy new officially-released non-beta Fedora 36 workstation (or server, or silverblue, kinoite or iot using rpm-ostree), and you don't want to wait or downgrade, you'd have to either have to compile dpdk 22.03 for yourself, or now you can download them from my repo.

I've got all the instructions to go through the build process if you'd like to get your hands dirty with compilation (it's pretty straightforward): https://github.com/averyfreeman/dpdk-2203-for-fedora36

The .rpm files are also there if you don't care for all the fuss of compilation. You can use them as openvswitch dependencies, just install them before you try and install openvswitch using dnf.

I should have made this post sooner so people knew the rpms were available, but at least I put a note or two in on reddit in a couple key places (now that I think about it, probably just /r/fedora). Nothing beats the officialism of posting a fancy notice on your wordpress blog, though, amirite?

Speaking of which, I think I will be looking at a way of integrating this blog with my repo - I'm hoping I can figure out a way to produce and update posts on wordpress automatically by creating a gist or a new repo. Then the two would be more tightly integrated, and could avoid this whole getting sidetracked issue...

The less people get sidetracked, the sooner they use software...
