---
title: Old Tech, New Tricks
description: Well, not \that\ new, but still ... different, and decidedly unconventional... I keep telling myself I've gotta write about the Hikvision setup I put together at my friend's fast food restaurant/mini dinosaur theme park, because it's so unusual, I doubt many people have done it…
summary: Well, not \that\ new, but still ... different, and decidedly unconventional... I keep telling myself I've gotta write about the Hikvision setup I put together at my friend's fast food restaurant/mini dinosaur theme park, because it's so unusual, I doubt many people have done it…
date: 2024-11-29T09:11:52Z
author: Avery Freeman
slug: old-tech-new-tricks
categories:
  - Random
thumbnail: /post-thumbnails/attachment-1098.webp
thumbnail_alt: Old Tech, New Tricks
thumbnail_width: 480
thumbnail_height: 258
thumbnail_aspect: 1.8604651162790697
type: post
status: publish
url: /posts/2024/11/old-tech-new-tricks/
---

<!-- Imported from WordPress post 1097. -->

Well, not \_that\_ new, but still ... different, and decidedly unconventional...

I keep telling myself I've gotta write about the Hikvision setup I put together at my friend's fast food restaurant/mini dinosaur theme park, because it's so unusual, I doubt many people have done it before. I didn't "put it together" originally, per se, he bought the Hikvision \_ages\_ ago, when BNC connectors were the only way security cameras connected (AFAIK), and IP cameras were still a relative fantasy for the common cam curmudgeon. But, then I came along with all my crazy interests in using computers for new solutions, and he asked me, "Hey, we've already maxed out that Hikvision DVR with four 8TB internal hard drives, but it only records (32 cameras) continuously for about 2 months, is there any way we could get it up to ... seven?", and I was like, "uh, I doubt it..."

![](/wp-content/uploads/2024/11/mike-basement-server-ledgible-labels-1024x550.webp)

Meet Samson. He's a 16-drive X9SCL-F white box "Super Super". There really is no such thing, it's just my way of saying I've never bought a box off the rack. The motherboard was actually purchased by me new (open box) from NewEgg all the way back in 2011. The first version of the server and I co-inhabited a 132 sqft apartment (I measured), along with my "you'll pry them from my cold, dead fingers" SL-1200mk2 turntables, and about 2000 12" vinyl singles (yep, we still had vinyl) overlooking iconic Market Street in San Francisco. The motherboard's been present for a few parades, so it's got history.

Fast forward to 2016, and I haven't done a whole lot with the 'board, other than run a LAMP and file server on Ubuntu, but this odd-looking 4-letter name (acronym? still not sure) I noticed scholarly-appearing enthusiasts discussing on StackOverflow catapulted me nto an obsession with VMs/hypervisors. "This is going to be a really a fun project," I thought, as I extruded said board from its prior bottom-shelf Chinese 4U rackmount, and put it in a more decent set of duds. A couple 2.5" SSDs, a couple 3.5"" HDDs, a circular dependency of ZFS running on a VM for datasets on the host , and scrape-bottom homelabbing, away we go!

![](/wp-content/uploads/2024/11/image-1.webp)

You can see from the picture, eventually I got a clue and started buying \_actual\_ Supermicro chassis. Wait ..

![](/wp-content/uploads/2024/11/image-2-1024x768.webp)

*There we go... Samson on bottom, and on the top is anX10SRW-F running Milestone Essential+ ESXi 8 (so we can run more VMs to avoid the >8 camera licensing fees, of course)*

There's really no comparison. I guess everyone has trials and tribulations. One stepping-stone to that 3U 16 hot-swap bay baddie was another 3U SM case that had 15 drive bays and 3 (yes 3) power supplies I got for about $100, I couldn't believe it. Well, another thing I couldn't believe was our power bill. The damn thing was apparently from a period of extremely inefficient design decisions, circa ~2008, when engineers appeared to have no inkling about increasing "speed" or efficacy in any way other than throwing as much electricity at them as possible (remember Pentium 4s? If not, be thankful). I got rid of that thing as quickly as I could, and found a newer case with one less PSU for redundancy, but virtually generations more discernment (seriously, 2 PSUs = plenty, starkly contrasting how common mindsets changed so drastically about computing within ~7-8 years).

OK, enough of this self-flatulating history lesson,

![](/wp-content/uploads/2024/11/image-3.webp)

*Every human, everywhere...*

I really wanted to talk about what we do with ol' Samson, now. Because, sure, Samson's 13, so in computer years, he's an ancient ol' fuck, but he hasn't stopped growing, and has zero experience not finding new shit to do.

That's where we come to my friend with the restaurant's Hikvision DVR. It's around the same age, but nice for it's time. 32 channels, and over 16 can still record in 720P at 30FPS, so for an HD-TVI straggler, it's actually quite a trooper. I spent time with him and another friend running those BNC/RG59 cables everywhere around his property just to catch segments of rooms, since the low resolution means you have to be practically right next to someone's face to pick it out of a lineup. Don't forget, though: 720P is what started "HD", so... what a time to be alive...

I've told my friend he should probably upgrade to IP cameras, since they're so much more efficient, and he did - we cover about as much of the property with around eight 4MP and 8MP Dahuas (our Hik-market traitors), but it's hard to get rid of something when so much time and energy has been spent setting it up, and keeping it going, and the Hikvision is still (incredibly) working, and it's relatively good at catching the odd shit when you have 32 cameras lurking around.

So my friend's like, "can we get more like 7 months of record time out of the DVR?" and I'm like, "probably not", but I look into it, and what do I find? One single manual page describing the totally obscure feature of recording to network shares, and literally zero discussion of anyone doing it anywhere. Seriously? Does anyone believe for a second, if nobody's bragged on the internet about doing it yet, it might actually work?

Seriously, though, let me be clear. I am not recommending anyone do this themselves, unless you're in the same legacy quagmire position (even then, still not recommending it). Get some decent IP cameras, like 4MP+ Starlights with 1/8" sensors. They're so much better, no matter the cost differential. The value gained from the quality of picture and increased coverage from higher resolution you'll get, the two systems are completely incomparable.

But, if you want to keep a 13-yo DVR limping along (and I do mean limping), you can smelling-salts revive it with as much as 14.5TB block storage, essentially a metric shit ton of recording time for a barely-HD DVR. Note, the DVR will consume said agnostic storage with its (ahem) unique, proprietary filesystem, which is unlike anything on any other digital device we are aware of, so you have been warned. Or, the other option is to take your chances creating a file share for the DVR with NFS. Having used both protocols for performance-sensitive tasks, ISCSI was a no-brainer, especially when considering there's only one RJ45 port on the DVR (don't engineers think of everything?) and there's no vlan support to isolate the L2 network.

As far as the NFS goes, no, I did not try it, and I wouldn't bother since it's likely to be a major headache and disappointment. But I do admit, if ol' Hikkie-poo would have taken both simultaneously, I'd have thrown the two of them at it, since my friend cares way less about the time it takes to pull video than the virtual insurance plan long amounts of record time provides him in regards to being able to produce evidence for law enforcement.

So, how does it work? Meh ... fine? I think that's about as excited a response as you'll get out of me. But it \_does\_ work. And while the recording playback responsiveness leaves a little (lot) to be desired, it's definitely a feat to see this old thing that, by all accounts, shouldn't even be functioning anymore, let alone just about doubling its record time, thanks to some other, equally ancient, oft ignored motherboard from my past I was considering donating somewhere, despite having such history it survived being named something as douche-adjacent as Samson.

And since Samson bulked up to a burly 16 4TB drives, he's got about 45TB of space ala mirrored zraid2 pools (two spares), so now he runs Proxmox, and in addition to the Hikvision DVR tent revival, Samson's going to use the other 30TB to migrate us towards the 20-year-old Zoneminder... now that's progress!

![](/wp-content/uploads/2024/11/image.webp)

Questions? Comments? Snark-laden insults?
