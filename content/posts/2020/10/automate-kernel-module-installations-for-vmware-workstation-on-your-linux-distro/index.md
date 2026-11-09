---
title: Automate kernel module installations for VMware Workstation on your Linux distro
description: "VMware Robot does a little dance Update April 2021: I noticed VMware Workstation 16 in Ubuntu tends to install kernel modules fine through its GUI now, so a lot of this info about how to compile and install vmmon and vmnet is probably obsolete. But since it may be useful to some…"
summary: "VMware Robot does a little dance Update April 2021: I noticed VMware Workstation 16 in Ubuntu tends to install kernel modules fine through its GUI now, so a lot of this info about how to compile and install vmmon and vmnet is probably obsolete. But since it may be useful to some…"
date: 2020-10-24T03:55:46Z
author: Avery Freeman
slug: automate-kernel-module-installations-for-vmware-workstation-on-your-linux-distro
categories:
  - Random
thumbnail: https://www.shapeblue.com/wp-content/uploads/2016/06/Marvin.png
thumbnail_alt: VMWare Archives - The CloudStack Company
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2020/10/automate-kernel-module-installations-for-vmware-workstation-on-your-linux-distro/
---

<!-- Imported from WordPress post 350. -->

![VMWare Archives - The CloudStack Company](https://www.shapeblue.com/wp-content/uploads/2016/06/Marvin.png)

*VMware Robot does a little dance*

Update April 2021: I noticed VMware Workstation 16 in Ubuntu tends to install kernel modules fine through its GUI now, so a lot of this info about how to compile and install `vmmon` and `vmnet` is probably obsolete. But since it may be useful to someone using an older version of Workstation, I'll leave it up for the time being.

In reference to this post I made earlier: [https://develmonk.com/2020/10/20/solve-the-system-cannot-find-the-file-specified-error-in-vmware-workstation/](/posts/2020/10/solve-the-system-cannot-find-the-file-specified-error-in-vmware-workstation)

I found the most helpful script, just drop this in a text file called `/etc/kernel/install.d/vmmodules.install`

<!-- more -->

```text

#!/usr/bin/bash

export LANG=C

COMMAND="$1"
KERNEL_VERSION="$2"
BOOT_DIR_ABS="$3"
KERNEL_IMAGE="$4"

ret=0

case "$COMMAND" in
    add)
       VMWARE_VERSION=$(cat /etc/vmware/config | grep player.product.version | sed '/.*\"\(.*\)\".*/ s//\1/g')

       [ -z VMWARE_VERSION ] && exit 0

       mkdir -p /tmp/git; cd /tmp/git
       git clone -b workstation-${VMWARE_VERSION} https://github.com/mkubecek/vmware-host-modules.git
       cd vmware-host-modules
       make VM_UNAME=${KERNEL_VERSION}
       make install VM_UNAME=${KERNEL_VERSION}

       ((ret+=$?))
       ;;
    remove)
        exit 0
        ;;
    *)
        usage
        ret=1;;
esac

exit $ret
```

It's so exciting! That should download, compile, and install the proper `vmmon` and `vmnet` kernel extensions required for Workstation every time a new kernel is installed (!!).

Now I just have to work out a way to get the `MOKutil` key submission in there for secure boot, but it's definite a good start to making the installation of new kernels less painful for Workstation users on Linux.

Tested in: Ubuntu 20.10

Reference:  
[https://docs.fedoraproject.org/en-US/quick-docs/how-to-use-vmware/](https://docs.fedoraproject.org/en-US/quick-docs/how-to-use-vmware/)
