---
title: How to fix 3d rendering for a Windows guest in VMWare Workstation 11 Ubuntu 14.10 host
description: How to fix 3d rendering for a Windows guest in VMWare Workstation 11 Ubuntu 14.10 host Hi all! Getting a message when you start your Windows guest in VMWare Workstation 11 hosted by Ubuntu 14.10? I was, and I had a little trouble finding a fix, until finally it worked! it's simp…
summary: How to fix 3d rendering for a Windows guest in VMWare Workstation 11 Ubuntu 14.10 host Hi all! Getting a message when you start your Windows guest in VMWare Workstation 11 hosted by Ubuntu 14.10? I was, and I had a little trouble finding a fix, until finally it worked! it's simp…
date: 2015-02-15T20:42:00Z
author: Avery Freeman
slug: how-to-fix-3d-rendering-for-a-windows-guest-in-vmware-workstation-11-ubuntu-14-10-host
categories:
  - Random
thumbnail: /post-thumbnails/post-33.webp
thumbnail_alt: How to fix 3d rendering for a Windows guest in VMWare Workstation 11 Ubuntu 14.10 host
thumbnail_width: 480
thumbnail_height: 346
thumbnail_aspect: 1.3872832369942196
type: post
status: publish
url: /posts/2015/02/how-to-fix-3d-rendering-for-a-windows-guest-in-vmware-workstation-11-ubuntu-14-10-host/
---

<!-- Imported from WordPress post 33. -->

## How to fix 3d rendering for a Windows guest in VMWare Workstation 11 Ubuntu 14.10 host

  

[![](/wp-content/uploads/2015/02/speccy_vmware_3d_cropped.webp)](/wp-content/uploads/2015/02/speccy_vmware_3d_cropped.webp)

  

  

  
Hi all!  
  
Getting a message when you start your Windows guest in VMWare Workstation 11 hosted by Ubuntu 14.10?  
  
I was, and I had a little trouble finding a fix, until finally it worked!  it's simply a matter of upgrading to the latest OpenGL drivers in Ubuntu.  
  

To install open a terminal window and enter

WP\_CODE\_PLACEHOLDER\_0

To remove, you can use ppa-purge

WP\_CODE\_PLACEHOLDER\_1

  
Now when you start your Windows guest, it should no longer complain about 3D acceleration!  
  

That's it!  If you have any questions or comments, feel free to reply!
