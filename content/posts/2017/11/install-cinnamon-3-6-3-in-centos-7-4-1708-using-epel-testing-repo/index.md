---
title: Install Cinnamon 3.6.3 in CentOS 7.4 1708 using EPEL-Testing repo
description: After being a long-time Debian user, for some reason I've been going all-in for CentOS lately. It started after I installed it as a virtualization platform with KVM on an E3 server. I just love how stable and methodically planned it is. I've probably gone a little too far, as I'…
summary: After being a long-time Debian user, for some reason I've been going all-in for CentOS lately. It started after I installed it as a virtualization platform with KVM on an E3 server. I just love how stable and methodically planned it is. I've probably gone a little too far, as I'…
date: 2017-11-21T19:36:00Z
author: Avery Freeman
slug: install-cinnamon-3-6-3-in-centos-7-4-1708-using-epel-testing-repo
categories:
  - Random
thumbnail: /post-thumbnails/post-26.webp
thumbnail_alt: Install Cinnamon 3.6.3 in CentOS 7.4 1708 using EPEL-Testing repo
thumbnail_width: 300
thumbnail_height: 169
thumbnail_aspect: 1.7751479289940828
type: post
status: publish
url: /posts/2017/11/install-cinnamon-3-6-3-in-centos-7-4-1708-using-epel-testing-repo/
---

<!-- Imported from WordPress post 26. -->

![](/wp-content/uploads/2017/11/Screenshot-2Bfrom-2B2017-11-21-2B10-27-03-300x169.webp)

After being a long-time Debian user, for some reason I've been going all-in for CentOS lately.  It started after I installed it as a virtualization platform with KVM on an E3 server.  I just love how stable and methodically planned it is.

I've probably gone a little too far, as I've also installed it on my Thinkpad x220 Laptop.  It's definitely not much of a desktop OS - its packages are stable but they're OLD.  But, I guess my laptop is old, too, and I still love both of them.  They work awesome together.

To avoid being too bored by its aged userland, I decided to breathe new life into the desktop experience by installing a new version of Cinnamon.  After poking around the Wiki for a few days, totally by accident, I noticed EPEL has a testing branch for packages that are pre-release.  A little repo package list inspection, and I noticed the pre-release version of Cinnamon they're working on currently is 3.6.3 (!)

<!-- more -->

While installing from a testing repo is rather antithetical to the entire notion of running a 10-year service OS like CentOS, I thought for a desktop it might be fun.  I haven't had any problems with it so far after running it a couple days (besides the little missing app here or there).  Maybe I've been too spoiled (ruined?) by running Debian testing for years?  Anyway, I don't judge if you don't...

Example for a fresh install:

Install current version - CentOS 7.4 1704 - you can start with Minimal install or install Gnome Desktop group during the install process. I'll explain the extra steps for minimal just in case.

log in as root or su root

\# yum update  
\# yum groupinstall "gnome server"  
\# yum install epel-release  
\# systemctl set-default graphical.target (not necessary if Gnome installed during install process)  
\# yum update  
\# yum install rpm-utils (optional: if yum-config-manager not installed)  
yum-config-manager --enable epel-testing  
yum update  
yum install cinnamon\*  
  
check:  
cinnamon --version  
  
if 2.8,  
\# yum update again  
reboot

_Note:_  Somewhere during the process, after installing Gnome Desktop, if you are in the GUI and open gnome-tweak-tool, selecting global dark theme  helps Gnome apps match cinnamon apps if you use a dark theme in Cinnamon.

Select Cinnamon using the gear icon that appears under your name after you enter your name

Now you should have a shockingly modern-looking and acting CentOS Cinnamon desktop system.

The Gnome installed from EPEL-testing is pretty new, too (for CentOS anyway) at 3.22.3 as of 11/21/2017. Be aware, most of the other packages have not caught up as the libraries and kernel, etc. still originate circa 2014 (kernel 3.10.0 anybody?).  But they're very, very stable and safe, relative to other Linux distros, and will be supported until 2024.

I can't confirm if the older kernel is too old for newer systems (e.g. z170 z270, etc. chipsets) but it's worth a shot, I know RHEL backports all sorts of security updates, so they might backport compatibility, too.  I have no idea since I do not have any computers newer than 7 years old. :P

Hope this helps someone out!

References:  
https://wiki.centos.org/AdditionalResources/Repositories  
https://fedoraproject.org/wiki/EPEL  
https://fedoraproject.org/wiki/EPEL/testing  
https://dl.fedoraproject.org/pub/epel/testing/7/x86\_64/Packages/  
https://wiki.centos.org/FAQ/General#head-fe8a0be91ee3e7dea812e8694491e1dde5b75e6d
