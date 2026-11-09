---
title: Tricks for Importing VMware Workstation VMDK to ESXi 6.7
description: Turnkey Linux's VM packages are available as iso, vmdk, qcow2, tar, and Docker images So I've been playing with some of the Turnkey Linux VMs, which are nice a lightweight Debian Linux OS core packaged with purpose-built software. They run lighttpd out of the box and have web po…
summary: Turnkey Linux's VM packages are available as iso, vmdk, qcow2, tar, and Docker images So I've been playing with some of the Turnkey Linux VMs, which are nice a lightweight Debian Linux OS core packaged with purpose-built software. They run lighttpd out of the box and have web po…
date: 2019-08-19T19:12:34Z
author: Avery Freeman
slug: tricks-for-importing-vmware-workstation-vmdk-to-esxi-6-7
categories:
  - Random
thumbnail: /post-thumbnails/attachment-251.webp
thumbnail_alt: Tricks for Importing VMware Workstation VMDK to ESXi 6.7
thumbnail_width: 480
thumbnail_height: 342
thumbnail_aspect: 1.4035087719298245
type: post
status: publish
url: /posts/2019/08/tricks-for-importing-vmware-workstation-vmdk-to-esxi-6-7/
---

<!-- Imported from WordPress post 250. -->

![](/wp-content/uploads/2019/08/image-2-1024x729.webp)

*Turnkey Linux's VM packages are available as iso, vmdk, qcow2, tar, and Docker images*

So I've been playing with some of the [Turnkey Linux VMs](https://www.turnkeylinux.org/), which are nice a lightweight Debian Linux OS core packaged with purpose-built software.

<!-- more -->

They run lighttpd out of the box and have web portals, web-accessible shells, webmin for easy administration, Let's Encrypt SSL certificate management automation, and usually some web administration specific to the purpose for which they are built.

They're really pretty nice! Nothing too fancy as far as their looks, but they get the job done and seem very stable. They can really save a lot of time.

So I was trying a couple for torrent server and openvpn, and since I run ESXi hosts, I opted for the vmdk images. I was expecting just a disk image (.vmdk), but lo-and-behold, they're not the image files but full VMs built on VMware Workstation.

This is cool but also presents some compatibility issues, as you can't just copy a Workstation VM to your datastore and run it like anything else. I tried it personally not knowing what I was in for, and my host couldn't open the .VMX file when I clicked on "edit settings" (it just gets stuck at "loading").

So OK, cool, let's figure out how to get this working. The easiest way if you have Workstation is to download the VM locally and load it up in Workstation. Then connect to your ESXi host and click "upload":

![](/wp-content/uploads/2019/08/esxi-10103.webp)

*In workstation go to VM --> Manage --> Upload*

Then specify the host you want to send the VM to and it will automatically convert it for you.

However it's not without its problems. You will probably want to upgrade the VM type - mine was woefully outdated, being at version 6 when the host's capability was version 14. This prevented me from using newer device types and changing the OS to Debian 9.

But even after upgrading the VM, I still couldn't add vmxnet3 or paravirtual scsi drivers. This I solved by cloning the VM in VCSA. Somehow, the cloned VM was able to add the vmxnet3 and paravirtual scsi drivers. I'm not sure why they weren't just available from upgrading the VM, but it worked.

What if you don't have a copy of VMware Workstation? Well, it's not that hard to get around. This is how I did it the first time I tried importing a Turnkey appliance, since I already had the VM on my host's datastore.

SSH into the host and invoke the following command:

```text
[Host@VMdir] # vmkfstools -i HostedVirtualDisk ESXVirtualDisk
```

Where the HostedVirtualDisk is the one supplied by the Turnkey Appliance and ESXVirtualDisk is the output you're going to use for your new VM.

You can read the KB on this procedure here: [https://kb.vmware.com/s/article/1028943](https://kb.vmware.com/s/article/1028943)

Then just manually create a VM and import the existing disk, using the one you just output with vmkfstools.

After that, you can safely delete the files that were included with the Turnkey appliance, being careful to save your vmkfstools output vmdk file.

Also, I noticed on VMFS v6 I could not re-locate the vmdk file. For some reason it had to be left in its original location (folder) where it was created. There may be a way to work around this, but it's easy enough just to leave the dir. Maybe that'll be for another post...

Happy virtualizing!
