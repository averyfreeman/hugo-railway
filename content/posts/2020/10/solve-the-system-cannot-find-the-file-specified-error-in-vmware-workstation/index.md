---
title: Solve "The system cannot find the file specified" error in VMware Workstation
description: If you've ever run into this, it's a real bummer. I encountered it after using rsync to clone a vm. At the outset, I want to say either using vm -> manage -> clone or file -> export to OVF are both easier options, but if you've already copied a vm by hand, you can try this out:…
summary: If you've ever run into this, it's a real bummer. I encountered it after using rsync to clone a vm. At the outset, I want to say either using vm -> manage -> clone or file -> export to OVF are both easier options, but if you've already copied a vm by hand, you can try this out:…
date: 2020-10-20T15:47:21Z
author: Avery Freeman
slug: solve-the-system-cannot-find-the-file-specified-error-in-vmware-workstation
categories:
  - Random
thumbnail: /post-thumbnails/attachment-348.webp
thumbnail_alt: Solve "The system cannot find the file specified" error in VMware Workstation
thumbnail_width: 480
thumbnail_height: 337
thumbnail_aspect: 1.42433234421365
type: post
status: publish
url: /posts/2020/10/solve-the-system-cannot-find-the-file-specified-error-in-vmware-workstation/
---

<!-- Imported from WordPress post 347. -->

![](/wp-content/uploads/2020/10/image.webp)

If you've ever run into this, it's a real bummer. I encountered it after using rsync to clone a vm.  
  
At the outset, I want to say either using `vm -> manage -> clone` or `file -> export to OVF` are both easier options, but if you've already copied a vm by hand, you can try this out:

<!-- more -->

After I rsynced my VM, I wanted to rename the files to differentiate it from the old VM.

For the example, let's say my old VM's name was `Windows Ent EFI` and I wanted to rename it to `winInsiders`

I use this one-liner just to rename the `.vmdk` files:

```text
for f in *.vmdk; do mv "$f" "$(echo "$f" | sed s/"Windows Ent EFI"/winInsiders/)"; done
```

and renamed the remaining files `{$f.nvram, $f.vmds, $f.vmx, $f.vmxf}` by hand (wanted to be careful)

At first, I had forgotten about references in the `winInsiders.vmx` to old filenames, so when I tried to re-add the hard drive, I ran into the "cannot find the file specified" error

I deleted any `.lck` directories first (not sure if this is necessary, but it seemed like a good idea)

Then I looked inside the `.vmx` file with a text editor, and found a few keys that needed new values, because they referenced the old names.

They were:

`nvram   extendedConfigFile   scsi0:0.fileName`

There could always be more, that's why instead of editing it by hand, run `sed` on the `.vmx` file, as it is faster and far less error-prone (just like the renaming command above, but with the `-i` flag, meaning inside the file):

`sed -i s/"Windows Ent EFI"/winInsiders/g winInsiders.vmx`

Then do the same for the `.vmxf` and first `.vmdk` file (the first `.vmdk` in a split virtual disk is just a file descriptor, plain text):

`sed -i s/"Windows Ent EFI"/winInsiders/g winInsiders.vmxf   sed -i s/"Windows Ent EFI"/winInsiders/g winInsiders.vmdk`

It should work now (at least, it did for me).
