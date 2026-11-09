---
title: Quick and dirty SSH key for pfSense / OPNsense gateway
description: "PSA: Stop using password login for root on your router! NOW!!! OK, now that I got your attention, here's how I did it in Git Bash (MINGW64) on Windows LTSC. I promise this is QUICK and EASY, so there's NO EXCUSE not to do it. Open your terminal and run ssh-keygen - you don't nee…"
summary: "PSA: Stop using password login for root on your router! NOW!!! OK, now that I got your attention, here's how I did it in Git Bash (MINGW64) on Windows LTSC. I promise this is QUICK and EASY, so there's NO EXCUSE not to do it. Open your terminal and run ssh-keygen - you don't nee…"
date: 2019-12-17T06:16:18Z
author: Avery Freeman
slug: quick-and-dirty-ssh-key-for-pfsense-opnsense-gateway
categories:
  - Random
thumbnail: /post-thumbnails/attachment-260.webp
thumbnail_alt: Quick and dirty SSH key for pfSense / OPNsense gateway
thumbnail_width: 480
thumbnail_height: 198
thumbnail_aspect: 2.4242424242424243
type: post
status: publish
url: /posts/2019/12/quick-and-dirty-ssh-key-for-pfsense-opnsense-gateway/
---

<!-- Imported from WordPress post 258. -->

![](/wp-content/uploads/2019/12/image-1.webp)

**PSA: Stop using password login for root on your router! NOW!!!**

OK, now that I got your attention, here's how I did it in Git Bash (MINGW64) on Windows LTSC. I promise this is QUICK and EASY, so there's NO EXCUSE not to do it.

<!-- more -->

Open your terminal and run `ssh-keygen` - you don't need a passphrase unless you want one (just hit enter).

Navigate to `~/.ssh/` and display your `id_rsa.pub` file:

```text
avery@winsalad MINGW64 /c/users/avery/.ssh
$ cat id_rsa.pub
ssh-rsa REDACTED ... REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ... = avery@winsalad
```

Copy the redacted portion above from ssh-rsa to the username@computername portion (get all of it)

Log into your gateway via SSH, drop to shell and run `ssh-keygen` (if you haven't already):

```text
avery@winsalad MINGW64 /c/users/avery/.ssh
$ ssh root@gateway
Last login: Mon Dec 16 21:21:17 2019 from 192.168.1.122
----------------------------------------------
|      Hello, this is OPNsense 19.7          |         @@@@@@@@@@@@@@@
|                                            |        @@@@         @@@@
| Website:      https://opnsense.org/        |         @@@\\\   ///@@@
| Handbook:     https://docs.opnsense.org/   |       ))))))))   ((((((((
| Forums:       https://forum.opnsense.org/  |         @@@///   \\\@@@
| Lists:        https://lists.opnsense.org/  |        @@@@         @@@@
| Code:         https://github.com/opnsense  |         @@@@@@@@@@@@@@@
----------------------------------------------
*** gateway.webtool.space: OPNsense 19.7.7 (amd64/OpenSSL) ***
 LAN (vmx0)      -> v4: 192.168.1.1/24
                    v6/t6: REDACTED ... REDACTED .../64
 WAN (em0)       -> v4/DHCP4: REDACTED ... /21
                    v6/DHCP6: REDACTED ... REDACTED .../128
 HTTPS: SHA256 REDACTED ... REDACTED ...REDACTED ... REDACTED ...
               REDACTED ... REDACTED ...REDACTED ... REDACTED ...
 SSH:   SHA256 REDACTED ... REDACTED ...  (ECDSA)
 SSH:   SHA256 REDACTED ... REDACTED ...  (ED25519)
 SSH:   SHA256 REDACTED ... REDACTED ...  (RSA)
  0) Logout                              7) Ping host
  1) Assign interfaces                   8) Shell
  2) Set interface IP address            9) pfTop
  3) Reset the root password            10) Firewall log
  4) Reset to factory defaults          11) Reload all services
  5) Power off system                   12) Update from console
  6) Reboot system                      13) Restore a backup
Enter an option: 8
root@gateway:~ # ssh-keygen
```

paste your id\_rsa.pub to the end of `~/.ssh/authorized_keys` :

```text
root@gateway:~/.ssh # echo 'ssh-rsa  REDACTED ... REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ...REDACTED ... = avery@winsalad' >> authorized_keys
```

Navigate to your web UI and de-select "Permit password login" under SSH section (or similar - depending on your gateway of preference, I'm using OPNsense):

![](/wp-content/uploads/2019/12/image.webp)

*OPNsense gateway used as example*

Note: You should probably create a new user and su to root once you're connected via SSH, but this is the "quick and dirty" version, so we'll save that for another day.

Open A NEW TERMINAL instance or tab (don't log out of SSH yet!) and try logging into your gateway. I've found it good practice to always try things that effect SSH login in a new instance because you never know when your settings alterations will lock you out. It's not such a big deal in this example, but it's a good practice to be in the habit of.

If you've gone through these steps properly, you should be able to log into your gateway without a password now (unless you specified a passphrase using `ssh-keygen`).

Now you'll be limited to connecting via SSH only with this one machine. For additional machines, there's several things you could do:

-   Copy the contents of your ~/.ssh folder to other machines
-   repeat the ssh-keygen step for the next computer and copy the id\_rsa.pub to the gateway's authorized\_keys again
-   My personal favorite, read this man page: [https://www.ssh.com/ssh/copy-id](https://www.ssh.com/ssh/copy-id)

OK that's all for now. Happy hashing!
