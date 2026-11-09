---
title: Easiest WSL2 Bridge Network (without Hyper-V Virtual Network Manager)
description: Grilling a Linksys. Delicious... I am testing certbot locally with Create-React-App, but I'm using WSL2. Little did I know, the networking for Ubuntu in WSL2 is a little strange when coming from your typical systemd-network, NetworkManager, ifupdown, \ Apparently, the networking…
summary: Grilling a Linksys. Delicious... I am testing certbot locally with Create-React-App, but I'm using WSL2. Little did I know, the networking for Ubuntu in WSL2 is a little strange when coming from your typical systemd-network, NetworkManager, ifupdown, \ Apparently, the networking…
date: 2021-06-05T08:38:22Z
author: Avery Freeman
slug: easiest-wsl2-bridge-network-without-hyper-v-virtual-network-manager
categories:
  - Random
thumbnail: /post-thumbnails/attachment-495.webp
thumbnail_alt: Burning a Wireless Router - YouTube
thumbnail_width: 300
thumbnail_height: 168
thumbnail_aspect: 1.7857142857142858
type: post
status: publish
url: /posts/2021/06/easiest-wsl2-bridge-network-without-hyper-v-virtual-network-manager/
---

<!-- Imported from WordPress post 491. -->

![Burning a Wireless Router - YouTube](/wp-content/uploads/2021/06/image.webp)

*Grilling a Linksys.  Delicious...*

I am testing certbot locally with Create-React-App, but I'm using WSL2. Little did I know, the networking for Ubuntu in WSL2 is a little strange when coming from your typical `systemd-network`, `NetworkManager`, `ifupdown`, \<insert your favorite networking API\>

Apparently, the networking is taken care of in the `lxssManager` service (you can reveal it / restart it, etc. in task manager - `ctrl-shift-esc -> services`). This is because WSL doesn't have an init system, unless you get some kind of hack to give you a systemd-ish responsive system - I've heard of something called 'genie', but I haven't wanted to try it, since I'm trying to do WSL the "right" way 😂

Anywho, if you want an IP from your WSL installation that's in the same subnet as your LAN, you're out of luck, since the IP address supplied to your WSL instance is provided through NAT. Some threads I was scanning while looking for a solution talked about installing Hyper-V Virtual Network Manager, but wanting to keep things as light as possible, I have no interest in installing Hyper-V or any of its tools just to get a bridge network setup for WSL.

So I poked around the Network Connections in the Control Panel - this can be revealed by searching for _Control_ in the start menu (it's been getting progressively more hidden every release since the introduction of the UWP "Settings" app). Once you're in there, go to `Control Panel\Network and Internet\Network Connections` (you can paste that line straight in the address bar) and look at what you've got. You should see something like this:

![](/wp-content/uploads/2021/06/chrome_ws7CBL6cx6.webp)

*Control Panel Network Connections - quaint, isn't it?*

Although it's likely you won't have a "Network Bridge"... yet.

Here's what to do:  
  
Highlight your Ethernet (or WIFI) connection (or both) and the "vEthernet (WSL)" adapter (can select multiple by holding down CTRL while clicking on them), then right-click and select "Create Bridge" from the menu.

That'll take a minute, but should leave you with this thing:

![network bridge software adapter (Windows 10 control panel)](/wp-content/uploads/2021/06/explorer_vVne3ucJxC.webp)

One of the threads I read said you have to restart after creating this thing, but that was not my experience. If you're having weird networking issues you can't figure out, you might want to give that a shot.

Then once you have it bridging your WSL adapter with your choice of wired-NIC or WIFI, head over to your bash prompt and set the adapter - note, my LAN's subnet is `192.168.1.0/24`, you'll want to adjust that for whatever yours is:

```text

 sudo ip addr flush dev eth0
 sudo ip addr add 192.168.1.244/24 dev eth0
 ip addr show dev eth0
 sudo ip link set eth0 up
 sudo ip route add default via 192.168.1.1 dev eth0
 ip route show
 ping 192.168.1.1
 ping google.com
```

So I'll run through these real quick:

First you flush your old NAT ip settings, then you assign an address to your WSL adapter. I just picked one at random, but I'd definitely recommend checking to make sure you don't have the IP address assigned first (try an IP scanner, like `arp-scan`, or something in Windows - note: I always get horribly paltry results with `arp -a` for some reason).

Give your WSL eth0 adapter the IP in CIDR notation, then set it to up so you can create a route for it. Create the route to your local gateway (e.g. 192.168.1.1 or whatever yours is...)

Show that your address has been created, the default route has been created, then I like to ping a local machine like my gateway, then something that requires name resolution (here I used google).

Funny thing is, that actually worked before setting up the DNS resolver file, but you have to do that next. I don't think it was pinging using ipv6, so that doesn't explain why it worked - probably some weird Windows networking dichotomy, but sure enough, nothing else will really work in name resolution land beyond that, so it's time to do the next step...

You'll want to move the /etc/resolv.conf file to /etc/wsl.conf (unless you already have a wsl.conf file, of course - but it's not created by default). I just invoked `# mv /etc/resolv.conf /etc/wsl.conf` since it already had the lines I had to add to wsl.conf in it, and I was about to replace it anyway...

Make your /etc/wsl.conf file look like this:

```text

└─ ▶ cat /etc/wsl.conf
# This file was automatically generated by WSL. To stop automatic generation of this file, add the following entry to /etc/wsl.conf:
[network]
generateResolvConf = false
```

Then create an /etc/resolv.conf file using your favorite DNS servers (1.1.1.1, 1.0.0.1, 8.8.8.8, etc.) I have local DNS, so here's mine:

```text

# echo 'nameserver 192.168.1.2
> nameserver 192.168.1.3
> search webtool.space' > /etc/resolv.conf
```

Run something like `# apt update` to make sure stuff's resolving now. In my case it was all good.

Note: These `ip` commands are ephemeral, so you'll probably want to do some research into how to making them more permenant. I literally put that first block of `ip` commands in a script to run for when I come back after a restart, because I'm almost 100% certain all this setup will be lost.

One really interesting caveat is that I noticed the Network Bridge in the Control Panel didn't include the "vEthernet WSL" adapter when I restarted. The bridge was still there, but only had my Ethernet adapter in it, so I had to manually add the WSL adapter again manually in properties.  
  
There's apparently two config files - one's the `/etc/wsl.conf` file we just created, the other is `C:\Users\YourUserName\.wslconfig`

Unfortunately, the `/etc/wsl.conf` file is pretty limited as to network config - I did add the `generateHosts = false` line in mine, because my /etc/hosts had a bunch of weird Windows-only subdomains created by programs that are totally unnecessary to have in Linux, but there's a lot of other neat stuff in there related to selective case sensitivity, mounting different filesystems, etc. you might want to check out.

So I'm still searching for ways to make this permanent, but once I figure it out, I'll come back and finish this post. Might have to send an issue to the devs over on GitHub, but I'll get this working eventually. For now, adding WSL back in the bridge if I restart and running my script isn't that big of a deal.

Update: This post is a small part of a comprehensive project I was working on. So far, I have posted my raw notes for others to scour if they want to try and re-create the environment: [https://develmonk.com/2021/06/05/raw-notes-from-creating-a-local-dev-and-build-https-server-for-create-react-app-using-nginx-and-certbot/](/posts/2021/06/raw-notes-from-creating-a-local-dev-and-build-https-server-for-create-react-app-using-nginx-and-certbot)
