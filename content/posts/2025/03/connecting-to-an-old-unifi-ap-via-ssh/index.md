---
title: Connecting to an old Unifi AP via SSH
description: "In vibrant new TechniBW Also called, \"what to do when encountering the following Error: No matching host key type found. Their offer: ssh-rsa,ssh-dss\" ?? I've got a super old UAP-LR I still manage with an old version of the Unifi Controller locally, since I barely use WIFI for a…"
summary: "In vibrant new TechniBW Also called, \"what to do when encountering the following Error: No matching host key type found. Their offer: ssh-rsa,ssh-dss\" ?? I've got a super old UAP-LR I still manage with an old version of the Unifi Controller locally, since I barely use WIFI for a…"
date: 2025-03-14T19:58:15Z
author: Avery Freeman
slug: connecting-to-an-old-unifi-ap-via-ssh
categories:
  - Random
thumbnail: /post-thumbnails/attachment-1135.webp
thumbnail_alt: Connecting to an old Unifi AP via SSH
thumbnail_width: 480
thumbnail_height: 439
thumbnail_aspect: 1.0933940774487472
type: post
status: publish
url: /posts/2025/03/connecting-to-an-old-unifi-ap-via-ssh/
---

<!-- Imported from WordPress post 1132. -->

![](/wp-content/uploads/2025/03/image-2.webp)

*In vibrant new TechniBW*

## Also called, "what to do when encountering the following `Error: No matching host key type found. Their offer: ssh-rsa,ssh-dss`" ??

I've got a super old UAP-LR I still manage with an old version of the Unifi Controller locally, since I barely use WIFI for anything and I am just not interested in upgrading. However, every once in a while I need to get in and tinker with something manually, and I'm finding the older the stuff gets the harder it's been for me to be able to get on the device, even when using the same process

Therefore, I wanted to make sure to make this available to others in case they're having the same issue - _I can't imagine I'm the only one..._

**Substitution examples:**  
$USER = SSH username, as configured in the Unifi controller site page (below)  
`$UNIFI_DEVICE_IP = 192.168.1.20` (default)  
`$UNIFI_CONTROLLER_IP = 192.168.1.30` (self-configured)

**Defaults for older devices:**  
If you've never set up the device before, the username is `ubnt` and the password is `ubnt` - try these if the ones listed in the Site menu of the controller don't work

-   Check password and ssh key in Unifi Controller site settings: `https://$UNIFI_CONTROLLER_IP:8443/manage/site/default/settings/site`

-   Make sure you have a copy of the same key in your .ssh folder, in my case, I created this keyfile for my old UAP-LR: `id_ubnt{,.pub}` and had already uploaded it to the Unifi Controller under the link mentioned above (For reference, I'm running controller version 6.0 on Debian 12 so I can continue to manage my old broadcom-based UAP)

-   Specify the key when connecting, e.g:  
    `ssh -i /home/avery/.ssh/id_ubnt $USER@$UNIFI_DEVICE_IP`

-   If you get the error: ``Unable to negotiate with `$UNIFI_DEVICE_IP` port 22: no matching host key type found. Their offer: ssh-rsa,ssh-dss`` specify host algorithm explicitly:  
    `` ssh -o HostKeyAlgorithms=+ssh-rsa -i /home/avery/.ssh/id_ubnt $USER@`$UNIFI_DEVICE_IP` ``

-   If you are still getting errors, check SSH version - newest versions apparently cannot connect despite mitigations shown above - here's a real-world example:

```bash
# fedora 41 (my desktop OS) is unable to connect
ssh -V
OpenSSH_9.9p1, OpenSSL 3.2.4 11 Feb 2025

# Debian 12 (my controller VM OS) is able to connect
ssh -V
OpenSSH_9.2p1 Debian-2+deb12u5, OpenSSL 3.0.15 3 Sep 2024
```

Btw, if anyone is looking for an older version of the Debian Unifi controller software, this is where I got mine: [GlennR Unifi installation scripts](https://community.ui.com/questions/UniFi-Installation-Scripts-or-UniFi-Easy-Update-Script-or-UniFi-Lets-Encrypt-or-UniFi-Easy-Encrypt-/ccbc7530-dd61-40a7-82ec-22b17f027776)

Good luck!
