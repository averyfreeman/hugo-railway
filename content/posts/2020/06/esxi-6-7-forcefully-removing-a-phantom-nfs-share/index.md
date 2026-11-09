---
title: ESXi 6.7 - Forcefully Removing a Phantom NFS Share
description: Interesting thing happened to me today. I had to do some work on one of my ESXi 6.7 hosts, so I powered it off (which is something I rarely ever do). I had just done some static configuration of ipv6 on my domain controllers, provisioned DNSSEC, etc. so I was playing with a rela…
summary: Interesting thing happened to me today. I had to do some work on one of my ESXi 6.7 hosts, so I powered it off (which is something I rarely ever do). I had just done some static configuration of ipv6 on my domain controllers, provisioned DNSSEC, etc. so I was playing with a rela…
date: 2020-06-04T23:06:55Z
author: Avery Freeman
slug: esxi-6-7-forcefully-removing-a-phantom-nfs-share
categories:
  - Random
thumbnail: https://images.iconfu.com/sets/10-paper/icons/link_broken_icon.png
thumbnail_alt: Link Broken Icon - Paper Style - Iconfu
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2020/06/esxi-6-7-forcefully-removing-a-phantom-nfs-share/
---

<!-- Imported from WordPress post 314. -->

![Link Broken Icon - Paper Style - Iconfu](https://images.iconfu.com/sets/10-paper/icons/link_broken_icon.png)

Interesting thing happened to me today. I had to do some work on one of my ESXi 6.7 hosts, so I powered it off (which is something I rarely ever do). I had just done some static configuration of ipv6 on my domain controllers, provisioned DNSSEC, etc. so I was playing with a relatively recently modified network.

Well, it must have been a little too different for my ESXi configuration to handle, because when I powered up my ESXi host again, two out 5 of my NFS datastores couldn't reconnect. It was a little perplexing because ESXi doesn't give you much of a sense of what's going on - just a message saying:

'**Can't mount NFS share - Operation failed, diagnostics report: Unable to get console path for volume**'

<!-- more -->

There's some logs you can check, like `hostd.log, vmkernel.log`, etc. but they didn't tell me much, either. (If you want to check these they're in `/var/log` and the most convenient way I've found is to use:  
`# tail -n \<number of lines\> \<name of log file\>`

But here's the thing - no matter how many times I tried to reconnect, I was unable. I could, however, reconnect the datastore as long as I gave it a different name

Finally after a while it dawned on me that the share still existed (although it did not show up in):  
`# esxcli storage nfs list`

That was the whole reason I couldn't re-create it - ESXi thought it was still there although it wasn't giving me any real indication (only the failed attempt to manually re-connect)

**Tl;dr** - to Fix the issue,

1.  Remove any references to your phanton NFS datastore - remove any HDDs that reference it, any ISO files (connected or not), remove VMs from your inventory that are imported from it.  
    
2.  Remove the NFS share link from SSH using the command:  
    `# esxcli storage nfs remove -v \<phantom datastore name\>`  
    (note, the -v will give you a little more feedback)  
    
3.  At this point I decided to reboot, but if you can probably just restart the agents from the DCUI: [https://kb.vmware.com/s/article/1003490](https://kb.vmware.com/s/article/1003490)  
    
4.  Now you should be able to re-connect your NFS datastore, with the same name and everything.

If you have any VMs on the datastore, ISOs, vHDDs, etc. you need to re-connect, now you should be able to without any problem.
