---
title: "Windows Server Core: Setting a New IP Address For Your DC (including IPv6 & Client DNS)"
description: All your .cpl are belong to us (all 6 of them, woah) I've been working on moving to Windows Server Core for my DCs, and getting adjusted to PowerShell has been slightly daunting, as the only CLI I'm really familiar with is Unix-based, and, while there are similarties to be sure,…
summary: All your .cpl are belong to us (all 6 of them, woah) I've been working on moving to Windows Server Core for my DCs, and getting adjusted to PowerShell has been slightly daunting, as the only CLI I'm really familiar with is Unix-based, and, while there are similarties to be sure,…
date: 2022-11-24T04:35:46Z
author: Avery Freeman
slug: windows-server-core-setting-a-new-ip-address-for-your-dc-including-ipv6-client-dns
categories:
  - Random
thumbnail: /post-thumbnails/post-616.webp
thumbnail_alt: All your .cpl are belong to us (all 6 of them, woah)
thumbnail_width: 480
thumbnail_height: 368
thumbnail_aspect: 1.3043478260869565
type: post
status: publish
url: /posts/2022/11/windows-server-core-setting-a-new-ip-address-for-your-dc-including-ipv6-client-dns/
---

<!-- Imported from WordPress post 616. -->

![All your .cpl are belong to us (all 6 of them, woah)](/wp-content/uploads/2022/11/vmrc_axHKBc0QDR-768x589.webp)

*All your .cpl are belong to us (all 6 of them, woah)*

I've been working on moving to Windows Server Core for my DCs, and getting adjusted to PowerShell has been slightly daunting, as the only CLI I'm really familiar with is Unix-based, and, while there are similarties to be sure, they are also very different in a lot of respects. There's a plethora of remote-based GUI programs for configuring Core servers available that are useful as "training wheels", like [Windows Admin Center](https://www.microsoft.com/en-us/windows-server/windows-admin-center) (aka [Webmin](https://www.techrepublic.com/article/webmin-one-big-drawback-to-using-this-data-center-management-tool/) for Windows) and the ever-ubiquitous [RSAT](https://www.pluralsight.com/blog/it-ops/windows-vista-rsat) tools, which are desktop applications that, by using [WinRM](https://www.serverbrain.org/securing-2008/remote-server-administration-tools-rsat.html), can manage remote machines - programs like [Server Manager](https://subscription.packtpub.com/book/cloud-and-networking/9781838987190/1/ch01lvl1sec06/managing-remote-servers-from-a-single-pane-with-server-manager), ADUC, [PSRemoting](https://adamtheautomator.com/enable-psremoting/) (aka MS-SSH - hint: just use SSH), and time-tested (old) [MMC](https://www.makeuseof.com/microsoft-management-console-how-to-use-it/) snap-ins.

But what if you just want to get something essential done, especially if you don't have remote access available? Well, there's actually a lot of options still: The [Sconfig](https://www.prajwaldesai.com/windows-server-core-sconfig-options/) TUI program, which is always included, but it's extremely limited in scope, and I've realized through difficult experiences can be problematic (more later).

You actually _can_ use MMC locally on a Server Core machine, but it's more limited in snap-ins, and often these don't cover what you need.

![](/wp-content/uploads/2022/11/vmrc_54CD8IASfl.webp)

*MMC on Server Core 2022 doesn't even have Network Shares or Computer Management - boo.*

I've learned through installing [RocketDock](https://punklabs.com/) for giggles (honorable mention) there actually _is_ an instance of the control panel on Windows Server Core (I had read otherwise), but it's pretty :_sad trombone_:.

![Featured image also shows cult-beloved Rocket Dock, which does seem rather applicable to this bolt-on situation](/wp-content/uploads/2022/11/vmrc_axHKBc0QDR-768x589.webp)

*Featured image also shows cult-beloved Rocket Dock, which does seem rather applicable to this bolt-on situation*

If none of those fit your necessities, you're looking at using `netsh`, `wmic`, or PowerShell. Thankfully, they are all fairly comprehensive and easy to learn, even if they have completely different syntax from anything you've had to rely on CLI commands over the past few decades.

OK, enough rant and external links. Here's something I discovered pawing through the MS wiki and random blog posts about configuring my DCs IP addresses.

I've had to re-configure the IPs on my DCs now a couple times since I've been migrating them between hosts to deal with hardware upgrades. Every time I clone one and start it on a new machine, it either resets the NIC to DHCP or a link-local address, so I have to re-set the static IP manually and (sometimes) re-authorize the connection to the domain (on the _domain_ controller ... irony?).

![](/wp-content/uploads/2022/11/vmrc_MpOhwdmKng.webp)

*HAPPYMUFFIN has decided not to recognize he's a DC anymore, probably because he's barfing out this Link-Local address*

Setting your IP address is obviously trivial on a Server instance with Desktop Experience. Observe:

![](/wp-content/uploads/2022/11/chrome_AdzS8ONEJU.webp)

*Like any other Windows Desktop, via Control Panel -> Network Connections*

Server Core _should_ be even easier since the SConfig menu pops up whenever you log in, but Sconfig _routinely_ fails to accept a static configuration. Observe:

![](/wp-content/uploads/2022/11/V1GJ98rjiu.webp)

*boo.*

Note, if you hate that SConfig pops up when you log in, you can disable it with the cmdlet Set-SConfig, ala:

```text
Set-SConfig -AutoLaunch $false
```

TL;DR

That was an _incredibly_ long wind-up to say, here's how to set the `NetIPAddress` and `DnsClientServerAddress` in Windows Server Core

Synopsis:

-   If you've got a pre-existing static IP, be sure to delete it first (`Remove-NetIPAddress`)

-   If you've got DHCP configured, disable it first (`Set-NetIPInterface`)

-   Use `New-NetIPAddress` to create your new address (_not_ `Set-NetIPInterface`)

-   Use `Set-DnsClientServerAddress` to point to your DNS forwarders - which, in my case, are these very DCs I'm configuring

Basics - gathering necessary info:  
  
`Get-NetIPInterface` will give you a list of network adapters inside your machine currently (including `loopback`):

```text
PS C:\Users\administrator.DOMAIN> Get-NetIPInterface

ifIndex InterfaceAlias            AddressFamily NlMtu(Bytes) InterfaceMetric
------- --------------            ------------- ------------ ---------------
4       Ethernet0                       IPv6            1500              15
1       Loopback Pseudo-Interface 1     IPv6      4294967295              75
4       Ethernet0                       IPv4            1500              15
1       Loopback Pseudo-Interface 1     IPv4      4294967295              75
```

`Get-NetIPConfiguration` will give you more info about a given interface (you can identify it with `-InterfaceIndex` (e.g. `4`), or `-InterfaceAlias` (e.g. `Ethernet0`)

```text
PS C:\Users\administrator.DOMAIN> Get-NetIPConfiguration

InterfaceAlias       : Ethernet0
InterfaceIndex       : 4
InterfaceDescription : vmxnet3 Ethernet Adapter
NetProfile.Name      : webtool.space
IPv6Address          : 2601::dead
                       2601::beef
IPv4Address          : 10.0.0.33
IPv6DefaultGateway   : fe80::f00d
IPv4DefaultGateway   : 10.0.0.1
DNSServer            : ::1
                       10.0.0.3
                       10.0.0.33
```

Removing an old configured IP address:  
  
`Remove-NetIPAddress` can help you get rid of that old, pesky address that might be stopping you from employing a new one (if they're on the same subnet, they'll probably co-exist peacefully, but different subnets = food for gremlins)

```text
Remove-NetIPAddress -AddressFamily IPv4 -IPAddress '192.168.21.3' -Confirm:$false
```

You can pipe these commands to some extent with `Get-` and `Set-NetIPInterface` - here's an example (albeit, not a very good one since it requires more typing):

```text
Get-NetIPInterface -InterfaceIndex 4 | Set-NetIPInterface -AddressFamily IPv6 -Dhcp Disabled
```

The one you're probably really after isn't `Set-NetIPInterface`, but `New-NetIPInterface`. That kind of threw me off at first, but it's reflected in how the workflow expects you to delete prior addresses (before creating a new one, right?)

```text
PS C:\Users\administrator.DOMAIN> New-NetIPAddress -InterfaceIndex 4 -AddressFamily IPv6 -IPAddress '2601::dc01' -PrefixLength 64 -DefaultGateway '2601::beef'

IPAddress         : 2601::dc01
InterfaceIndex    : 4
InterfaceAlias    : Ethernet0
AddressFamily     : IPv6
Type              : Unicast
PrefixLength      : 64
PrefixOrigin      : Manual
SuffixOrigin      : Manual
AddressState      : Tentative
ValidLifetime     : Infinite ([TimeSpan]::MaxValue)
PreferredLifetime : Infinite ([TimeSpan]::MaxValue)
SkipAsSource      : False
PolicyStore       : ActiveStore

IPAddress         : 2601::dc01
InterfaceIndex    : 4
InterfaceAlias    : Ethernet0
AddressFamily     : IPv6
Type              : Unicast
PrefixLength      : 64
PrefixOrigin      : Manual
SuffixOrigin      : Manual
AddressState      : Invalid
ValidLifetime     : Infinite ([TimeSpan]::MaxValue)
PreferredLifetime : Infinite ([TimeSpan]::MaxValue)
SkipAsSource      : False
PolicyStore       : PersistentStore
```

**DNS Client configuration:**  
  
Now that your IP and Gateway are set, the only thing missing is your DNS settings, right? Since this is a DC, I'm going to point it towards myself and the other DC.

```text
Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses ('2601::dc01','2601::dc02')

InterfaceAlias       : Ethernet0
InterfaceIndex       : 4
InterfaceDescription : vmxnet3 Ethernet Adapter
NetProfile.Name      : webtool.space
IPv6Address          : 2601::dc01
IPv4Address          : 10.0.0.33
IPv6DefaultGateway   : {2601::f00d,
                       fe80::f00d}
IPv4DefaultGateway   : 10.0.0.1
DNSServer            : 2601::dc01
                       2601::dc02
                       10.0.0.3
                       10.0.0.33
```

OK, this post ended up being way longer than I anticipated, but that's how you get the basics of your network adapter working again if SConfig takes the ultimate dump when trying to use it to configure your Server Core network interfaces. Enjoy!
