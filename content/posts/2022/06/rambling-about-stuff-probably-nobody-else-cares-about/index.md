---
title: Cheap 2U Case Survives Longer than Most Cockroaches, Morphing Several Times More than Caterpillar
description: Ripped everything out of one of these cases to make a router I've noticed lately this blog has turned into being less about the info I'm trying to share with people, and more of a collection of me rambling on about the stuff I've fixed or put together. I'm not sure what's wrong…
summary: Ripped everything out of one of these cases to make a router I've noticed lately this blog has turned into being less about the info I'm trying to share with people, and more of a collection of me rambling on about the stuff I've fixed or put together. I'm not sure what's wrong…
date: 2022-06-04T09:21:11Z
author: Avery Freeman
slug: rambling-about-stuff-probably-nobody-else-cares-about
categories:
  - Random
thumbnail: /post-thumbnails/attachment-589.webp
thumbnail_alt: Cheap 2U Case Survives Longer than Most Cockroaches, Morphing Several Times More than Caterpillar
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2022/06/rambling-about-stuff-probably-nobody-else-cares-about/
---

<!-- Imported from WordPress post 588. -->

![Front-top Picture of inside Norco RPC 230 2U Server Case](/wp-content/uploads/2022/06/norco-rpc-230-open-baptiste-wicht-com-1-1024x576.webp)

*Ripped everything out of one of these cases to make a router*

I've noticed lately this blog has turned into being less about the info I'm trying to share with people, and more of a collection of me rambling on about the stuff I've fixed or put together.

I'm not sure what's wrong with me. I just spent an hour going off on another blog about this case I owned I made a firewall out of. Since I put so much time and energy into it, I thought I'd bring it here and add it to the collection: [http://disq.us/p/2p7i6zw](http://disq.us/p/2p7i6zw)

Orignal on site Baptiste Wicht Norco RPC 230 case review: [https://baptiste-wicht.com/posts/2013/08/norco-rpc-230-case-review.html](https://baptiste-wicht.com/posts/2013/08/norco-rpc-230-case-review.html)

I have one of those Norco RPC-230 cases, I've had it since 2011. It's crossed 2 states during 4 moves (update: 5 moves), and at least 8 different configurations, so it's seen a thing or two.

I suffered through using it longest for a TV recorder PC case, running HDHomeRun for at least a year or two, with 4x HGST 7K2000s in it, which are power-hungry, fast-spinning 7200RPM, hot, old drives. The thermal design of this case is garbage, the fans only hit 2 out of 4 of the drives, so the two coolest HDDs ran 50+ deg C 24/7 that entire time, the other two 55-60+ deg. It was a major testament to HGST's enterprise line, as they were refurbished, so undoubtedly they were tormented mercilessly before I even got them. The case I got new, but was chipped and scraped after the first of my builds it endured. The front USB connector broke in the middle within a year after normal use. It still works, but is difficult to plug into. As far as quality, amazing drives, crap case, both still work, only one deserves praise.

I also used this case for a desktop PC for a while, with a i5-3570K 77w TDP processor. With stock CPU cooler it would idle at 65 deg C within 5 minutes, which was unacceptable. A Thermaltake Gravity cooler got it under 50 deg C, but the clearance was only a couple mm so it probably could have been more efficient had there been more room, or perhaps a shorter cooler. The Gravity is 3-pin non-PWM, though, which in this case is probably better since the case was never not too hot under any circumstances, so there's no reason to give a PWM fan any time to decide to rev up.

I thought about drilling some holes in the side near where the CPU would usually sit, since it doesn't have any airflow from either the side or the back to speak of, but have you ever tried to drill through sheet metal? It's not as easy as it sounds, even with a specialized drill bit. Even the aluminum foil-like character of the RPC-230's build quality would present a painstaking chore. I'm glad I decided not to, because I ended up putting a board in it where the CPU isn't even in the back, it's in the front, so it wouldn't have made any difference for my current config, other than to look hideously abused.

Anything over 40 deg C consistently makes me nervous personally, so I was never at ease running any equipment in the Norco RPC-230 case that wasn't meant to be low-powered, cool, designed for minimal energy consumption, etc. So I finally took a server board X9SPU-F meant for proprietary cases that are near impossible to find, and put it in the RPC with a very low-TDP CPU. I chose the RPC-230 mainly because the motherboard wouldn't fit in anything else I owned at the time, but also because I finally had a very low-TDP processor I intended to use with it. I'd been watching prices of the E3-1220Lv2 for a couple years and they plummeted from being around $150 to around $35 at the time (and now, virtually worthless). Finally, I had the type of components that wouldn't make you think you could fry an egg on the top of this thing.

To fit the X9SPU-F in the RPC-230, I had to rip the drive tray out of the front. There's no use putting drives in the RPC-230 anyway, unless you want to make fried hard drive souffle. Then, I equipped this odd-shaped server board with an E3-1220Lv2 which is 17w TDP, butchered a heatsink out of a CPU cooler from a Dell SFF Optiplex 7020 and tightly zip-tied a Noctua NF-A8 to it (works great). Then, I velcroed a couple mSATA SSDs to the bottom of the case in a single 2-port mSATA to SATA adapter board for a RAID1-ish config designed to keep the system from being taken down by an IO shit-nado of network log files.

Now it's an edge router + firewall! Has dual Intel NICs and IPMI, too, so it's fancy. Pulls less than 40w at the wall, does up to 2.4Gbps as tested with an 82599 (possibly faster if not using FreeBSD/pfSense, which has terrible Intel NIC driver and kernel regressions, and less-than-ideal for 10GbE \`sysctl\` defaults).

For a network device SSD application, I've tended to think size and speed are secondary to being able to take a very certain and constant beating. I've been using these 24GB Intel 313 SLC mSATA SSDs on dual-SATA daughterboards and putting them in some kind of SDS version of RAID1 (either with mdadm or ZFS). The key is they're SLC, which is

hard to find and weren't made very long for cost reasons. However, you'd be hard-pressed to find another SSD that'll take a beating like these. They were designed to be cache devices for an old Windows 7 + RST config that never really caught on in I want to say like 2014. The plus side, is you can find a bunch of them around for cheap, and they're pretty unlikely to die. They only get about 120MB/s read, 60MB/s write, but it doesn't matter, and if you use a mSATA to SATA converter board like mine that has one port per drive, you can reap some benefit in throughput from running your SDS RAID1-ish mirror-type config (in this device's case, it's running ZFS).

And such is the tale of the long and winding life of my poor, beat-up, ill-equipped for most tasks I envisioned, but still utilized, and now humbly revered for being able to fit my bizarrely-shaped server board, Norco RPC-230.

\-- Good lord, I am such a nerd 🤓
