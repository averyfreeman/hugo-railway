---
title: Running an Arch Linux Router for About a Year
description: So, I wasn't so sure how soon I should write about this, but I have a fiber connection here in Seattle I'm pretty excited about. For the past decade I'd been living in Olympia, WA, where Comcast is the only game in town, and upload speeds are hampered by only having 4 channels a…
summary: So, I wasn't so sure how soon I should write about this, but I have a fiber connection here in Seattle I'm pretty excited about. For the past decade I'd been living in Olympia, WA, where Comcast is the only game in town, and upload speeds are hampered by only having 4 channels a…
date: 2024-07-18T20:33:06Z
author: Avery Freeman
slug: running-an-arch-linux-router-for-about-a-year
categories:
  - Random
thumbnail: /post-thumbnails/attachment-1068.webp
thumbnail_alt: Icon of person cooking for a studio audience (inserted for dramatic reveal coming later)
thumbnail_width: 480
thumbnail_height: 480
thumbnail_aspect: 1
type: post
status: publish
url: /posts/2024/07/running-an-arch-linux-router-for-about-a-year/
---

<!-- Imported from WordPress post 936. -->

![Icon of person cooking for a studio audience (inserted for dramatic reveal coming later)](/wp-content/uploads/2024/07/image-26.webp)

So, I wasn't so sure how soon I should write about this, but I have a fiber connection here in Seattle I'm pretty excited about. For the past decade I'd been living in Olympia, WA, where Comcast is the only game in town, and upload speeds are hampered by only having 4 channels across cable (~40Mbps top-out), even for "up to 1200Mbps" service. For anyone who wants to do anything "fun" with their internet, poor upload speeds can be a real hurdle to get over.

Fast forward, and I've got my own place, and I'm wanting to run a PC as a router/firewall appliance so I don't have to be locked into the little proprietary `mips` box the phone company forces me to rent. So, I set up pfSense since it's my old go-to, and I am definitely not getting 1Gbps download speeds. In fact, throughput was limited to about 250-300 Mbps. What gives?

That's pretty unacceptable for the guy who's been longing for nearly a decade to get their own 1Gbps symmetrical fiber connection. So I throw more hardware at it, thinking it's a matter of IOPS, but lo-and-behold, even in a VM with 4 cores on a Broadwell E5-2650v3, my speeds seem to be capped around this 250-300Mbps mark.

This is not an new issue: FreeBSD and relatives have had very little attention paid to their drivers for several generations now, as there are not many companies contributing to their source tree anymore (upstream). Certainly not the powerhouse conglomeration of companies contributing to the Linux kernel to keep up all the development in container tech and web servers and what-not. I don't want to turn this into a BSD v. Linux flame war or anything, because I really don't care about that, but there are many things that are empirically true about there being a chasm between the two in terms of money being thrown at them (aka developer hours) by the companies that depend on them to operate.

I could have spent my time trying to find better drivers, or compile the Netflix-RACK mods for FreeBSD, as I had in the past for OpnSense [the last time I ran into a similar issue](https://forum.opnsense.org/index.php?topic=18754.msg91806#msg91806) - that time, I couldn't get `iperf3` throughput above 2Gbps on a 10Gbps LAN, and in 2019 the writing wasn't quite on the wall yet that FreeBSD is pretty much a dead OS walking (aka IX-Systems hadn't ported TrueNAS to Debian and killed off Core yet). The same thing happened to me with my beloved OmniOS, a fork of OpenSolaris, and the birthplace of the ZFS Filesystem - once OpenZFS moved their development platform to Linux in 2017, I sadly admitted it was over - so I know how hard it can be to accept the end of a Unix-like ecosystem.

But this time was different: I had just ditched my VMware vSphere hypervisor cluster when I moved (I hate restrictive licensing). I had been vowing to only use FOSS from then on. And I was really getting back into Arch Linux, refusing to depend on any sort of installer-forward fork like Manjaro or Arco, and wanting to standardize all my systems to a single distro after running different distros and Unices all over the place for different purposes.

So, I thought I should attempt my first roll-your-own router with a general-purpose distro, and since Arch was my go-to at the time, I chose Arch. Yes, for a router. And I've been running it for about a year now without any problems.

Proof? Not much, so I'd suppose you'd have to believe me (don't have much of a poker face), but I did just run a speed test on it to make sure what I'm saying is true:

```bash
❯ pacman -Qq | grep speed
ookla-speedtest-bin

❯ pacman -Ql ookla-speedtest-bin | grep '/bin/' #*
ookla-speedtest-bin /usr/bin/
ookla-speedtest-bin 

❯ speedtest

   Speedtest by Ookla

      Server: CenturyLink - Seattle, WA (id: 8864)
         ISP: CenturyLink
Idle Latency:     2.46 ms   (jitter: 0.05ms, low: 2.40ms, high: 2.50ms)
    Download:   939.19 Mbps (data used: 657.4 MB)                                                   
                  3.75 ms   (jitter: 18.85ms, low: 2.27ms, high: 218.63ms)
      Upload:   932.69 Mbps (data used: 454.0 MB)                                                   
                  3.64 ms   (jitter: 0.24ms, low: 2.97ms, high: 4.46ms)
 Packet Loss: Not available.
  Result URL: https://www.speedtest.net/result/c/cd5545b5-7a9d-4052-9e84-58e1b1b51a0a
```

\*have since aliased 'grep "/bin/"' to something easier to type

You can tell I hadn't run a `speedtest` in so long, I had to remind myself the name of the binary so I could run it 😂  
  
Speedtest Result URL: [https://www.speedtest.net/result/c/cd5545b5-7a9d-4052-9e84-58e1b1b51a0a](https://www.speedtest.net/result/c/cd5545b5-7a9d-4052-9e84-58e1b1b51a0a)

![](/wp-content/uploads/2024/07/image-20.webp)

*That looks like 1Gbps line-speed to me!*

Crazy to use a rolling distribution for an appliance, you say? Hasn't been bad at all. I keep thinking I should move to a more "stable" distro, or use OpenSUSE TW cuz already-set-up BTRFS snapshots, but I've literally have never had a real reason to switch. I haven't experienced a problem that wasn't due to an easily solvable configuration issue. There's been no hard-to-track-down weirdness that appears to come out of nowhere. And since I configured the system as a router myself, I have a pretty good idea of what the components are, what they do, how they should be configured, and where to look if things go wrong.

So, I just make a point to update the package ecosystem about once a week while I babysit the process, usually right before I'm about to go spend the week with my girlfriend.

The first principle I thought would be pretty important for an Arch router would be not to try and do _too much_ with it. It's a pretty common belief among the sysadmin community, since if you do more than just route or drop packets with it, it'll be more difficult to troubleshoot things that go wrong, or something else you're using it for might bring it down.

Whatever _too much_ to do with a router will obviously be subjective, but in exact terms, I've been keeping it down to `firewalld`, `hostapd`, and `systemd-networkd`. But who in their right mind would want to run anything more than that on their router, anyway? (_looking at you, every CentOS-based router distro ever made!)_

Oh, and now I'm running `snapperd` for snapshots - that's right, I just set up snapper on it to take a thin-lvm snapshot on boot, which is why I was excited to finally write about it. Check it out:

![](/wp-content/uploads/2024/07/image-21-1024x768.webp)

*Laptop router always has a monitor and built-in ~1 hr "UPS"*

Oh no, did I forget to mention the best thing about it ever?  
**My Arch router is the first Thinkpad I've ever owned**, my _as-beloved-as-weathered_ Thinkpad T520!

It's always hooked up to a monitor if something goes wrong, and has a built-in 1-hour "UPS" _(womp womp)_

This one's touchpad has died twice now, even after I replaced it the first time with a brand-new top cover. So, I was trying to figure out what to do with it, since I am attached for _obvious_ reasons, but it's a little heavy to lug around and a little shitty to use without a touchpad (is that unreasonable?). I used it as a domain controller for several years running server core 2019, but I ditched the domain when I moved, and needed a gateway more, so ... history has been written.

I don't think many people know, these laptops actually have really nice Intel chipset network adapters - years ago, I noticed it has the same 82574L NIC as a Supermicro X9SCL-F server motherboard, and if you think like I do, yes you _can_ run vSphere on it (however, they're limited to 16GB ram - yes, at one point I was eyeing a cluster of T520s since they were about $50/ea at the time). This one's got an i5-2450m processor, with a **passmark at** **2073**, and about a real-world 45w-50w at-wall power consumption with the screen on (20-25w closed). So, it's not going to burn the house down or throw you into the poor house to be running one 24/7.

What's more, these old laptops actually have some good expansion capabilities, as PCMCIA is literally a PCI interface. The hardest thing about using PCMCIA was finding a decent 1Gbps PCMCIA network card, but I found the NexExtreme BCM57762, which has been fine. It certainly wasn't expensive ($10 shipped 3 years ago?) so it makes a damn good router, when you consider the whole thing was destined for a trash compactor.

Kudos to all the other small-timers out there who have written about being nuts enough to run their router on Arch. All the ones I'm seeing right now use `netctl` - I can't find the guy's who set his with `systemd-networkd` (his blog was pretty flakey), but I'll put up a repo with the config files, so you guys can peep how I did this...  
(repo): [https://github.com/averyfreeman/Arch-Router-Laptop](https://github.com/averyfreeman/Arch-Router-Laptop)

```bash
[root@router avery]# snapper list
# │ Type   │ Date               │ Cleanup │ Descrip
──┼────────┼─────────────────────┼─────────┼────────
0 │ single │                    │         │ current     
1 │ single │ 17 Jul 03:17:07 PM │ number  │ boot        
2 │ single │ 17 Jul 03:27:43 PM │ number  │ boot  
# Table truncated to fit in codeblock
```

Oh, also, I've been running [the Unbreakable Linux Kernel](https://github.com/oracle/linux-uek/releases/tag/v5.15.0-209.161.4) with it, since it's an older kernel with a lot of backports - as of writing, it's at version [v5.15.0-209.161.4](https://github.com/oracle/linux-uek/releases/tag/v5.15.0-209.161.4). If you visit, don't forget to hit "tags" so you can find the most appropriate branch, and clone with:  
`git clone --depth 1 -b $TAG linux-uek-$TAG`

Update: I put a little build script for the UEK in the repo
