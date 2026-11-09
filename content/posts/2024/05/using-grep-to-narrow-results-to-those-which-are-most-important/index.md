---
title: Using `grep` to focus only on that which is important
description: How can grep clear the clutter obstructing our goals? This is a little beginner command-line demonstration for finding the results you need most. A lot of the time in the command line, a simple ls can return way more than any one person can reasonably deal with. Most people know…
summary: How can grep clear the clutter obstructing our goals? This is a little beginner command-line demonstration for finding the results you need most. A lot of the time in the command line, a simple ls can return way more than any one person can reasonably deal with. Most people know…
date: 2024-05-29T16:30:41Z
author: Avery Freeman
slug: using-grep-to-narrow-results-to-those-which-are-most-important
categories:
  - Random
thumbnail: /post-thumbnails/attachment-826.webp
thumbnail_alt: How can grep clear the clutter obstructing our goals?
thumbnail_width: 480
thumbnail_height: 320
thumbnail_aspect: 1.5
type: post
status: publish
url: /posts/2024/05/using-grep-to-narrow-results-to-those-which-are-most-important/
---

<!-- Imported from WordPress post 801. -->

![Clear the clutter obstructing our goals](/wp-content/uploads/2024/05/image-15.webp)

*How can grep clear the clutter obstructing our goals?*

This is a little beginner command-line demonstration for finding the results you need most. A lot of the time in the command line, a simple `ls` can return way more than any one person can reasonably deal with. Most people know how to use `ls` with extension flags: `ls *.sh ; ls -a ; ls -a .??*` , but what about situations when file extensions aren't relevant, or when doing other things?

For those who don't already know, `grep` is your spectacularly special search superhero you can use to slice and dice strings in a smattering of situations - and here's a few instructive ways it can be used to make life easier when looking for something.

Say I'm troubleshooting `kernel-install`. `kernel-install` is an intrinsic part of making sure kernels are installed properly, but on most (if not all) distros, it's packaged with `systemd`, a fairly sprawling package with tentacles in virtually everything. How can we sift through the `systemd` package to narrow down what we're looking for, so our search becomes less overwhelming?

```bash
❯ pacman -Ql systemd | wc -l
1450
```

A quick analysis of the number of lines contained in the `systemd` package is 1,450 lines! That's a lot of stuff to sort through in order to find a rather narrow section of it we need for our issue. That's where some strategic use of the `grep` command can come in handy:

```bash
❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale' | wc -l
873
```

I usually start by thinking about what I **don't** want in the results, since there's almost always a lot more of what we don't need than what we do need.

This filter with `grep -v` does the opposite of what `grep` does by default, and removes everything in a given search string. By using `-E` we can chain strings together, as if to instruct `grep` _not_ to return results with _any_ of these values (note the single quotes and pipe character separators)

If we use `grep` to omit all `zsh` functions, `bash-completions`, `man` files, `polkit` definitions, and `locale` settings, that can get us a little closer, but it's still only narrowed down by 577 results. `systemd` is a lengthy package, indeed.

```bash
❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale' | grep kernel
systemd /etc/kernel/
systemd /etc/kernel/install.d/
systemd /usr/bin/kernel-install
systemd /usr/lib/kernel/
systemd /usr/lib/kernel/install.conf
systemd /usr/lib/kernel/install.d/
systemd /usr/lib/kernel/install.d/50-depmod.install
systemd /usr/lib/kernel/install.d/90-loaderentry.install
systemd /usr/lib/kernel/install.d/90-uki-copy.install
systemd /usr/lib/systemd/system/sockets.target.wants/systemd-udevd-kernel.socket
systemd /usr/lib/systemd/system/sys-kernel-config.mount
systemd /usr/lib/systemd/system/sys-kernel-debug.mount
systemd /usr/lib/systemd/system/sys-kernel-tracing.mount
systemd /usr/lib/systemd/system/sysinit.target.wants/sys-kernel-config.mount
systemd /usr/lib/systemd/system/sysinit.target.wants/sys-kernel-debug.mount
systemd /usr/lib/systemd/system/sysinit.target.wants/sys-kernel-tracing.mount
systemd /usr/lib/systemd/system/systemd-udevd-kernel.socket

❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale' | grep kernel | wc -l
17
```

From there, I realize we got lucky looking for `kernel-install`, since anything related to it is likely to have the word `kernel` in it. A quick addition of `grep kernel` as a subsequent filter on the end narrowed our search down to 17 results.

Now the list is fairly manageable. But what if we want it to be very accurate?

```bash
❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale|mount|socket' | grep kernel
systemd /etc/kernel/
systemd /etc/kernel/install.d/
systemd /usr/bin/kernel-install
systemd /usr/lib/kernel/
systemd /usr/lib/kernel/install.conf
systemd /usr/lib/kernel/install.d/
systemd /usr/lib/kernel/install.d/50-depmod.install
systemd /usr/lib/kernel/install.d/90-loaderentry.install
systemd /usr/lib/kernel/install.d/90-uki-copy.install

❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale|mount|socket' | grep kernel | wc -l
9
```

At this point, I'd go back to considering what _not to include -_ in this case I know we don't want any `mount` or `socket` files.

Are you noticing a pattern in these results, though? They include the files we're looking for, related to `kernel-install` infrastructure, but also the _folders_. We know which folders they're in through getting results for the files, so the folder locations are redundant:

```bash
❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale|mount|socket|/$' | grep kernel
systemd /usr/bin/kernel-install
systemd /usr/lib/kernel/install.conf
systemd /usr/lib/kernel/install.d/50-depmod.install
systemd /usr/lib/kernel/install.d/90-loaderentry.install
systemd /usr/lib/kernel/install.d/90-uki-copy.install

❯ pacman -Ql systemd | grep -v -E 'zsh|bash|man|polkit|locale|mount|socket|/$' | grep kernel | wc -l
5
```

This handy filter, `grep -v '/$'` should remove all the lines that _end_ with a forward slash: `/` -- and look, it **ends up being only 5 related files:** `kernel-install`, the binary, and the included `.install` scripts.

Since `kernel` is a fairly unique word, not often used in more than one context, it's one of the easier ones to narrow down. We could have started by looking for the word `kernel` first:

```bash
❯ pacman -Ql systemd | grep 'kernel' | grep -v -E '/$'
systemd /usr/bin/kernel-install
systemd /usr/lib/kernel/install.conf
systemd /usr/lib/kernel/install.d/50-depmod.install
systemd /usr/lib/kernel/install.d/90-loaderentry.install
systemd /usr/lib/kernel/install.d/90-uki-copy.install
systemd /usr/lib/systemd/system/sockets.target.wants/systemd-udevd-kernel.socket
systemd /usr/lib/systemd/system/sys-kernel-config.mount
systemd /usr/lib/systemd/system/sys-kernel-debug.mount
systemd /usr/lib/systemd/system/sys-kernel-tracing.mount
systemd /usr/lib/systemd/system/sysinit.target.wants/sys-kernel-config.mount
systemd /usr/lib/systemd/system/sysinit.target.wants/sys-kernel-debug.mount
systemd /usr/lib/systemd/system/sysinit.target.wants/sys-kernel-tracing.mount
systemd /usr/lib/systemd/system/systemd-udevd-kernel.socket
systemd /usr/share/bash-completion/completions/kernel-install
systemd /usr/share/man/man7/kernel-command-line.7.gz
systemd /usr/share/man/man8/kernel-install.8.gz
systemd /usr/share/man/man8/systemd-udevd-kernel.socket.8.gz
systemd /usr/share/zsh/site-functions/_kernel-install

❯ pacman -Ql systemd | grep 'kernel' | grep -v -E '/$'  | wc -l
18
```

Since we put `grep kernel` first, and did what was most obvious (filter out all the bare folder results), this search becomes admittedly less complicated. However, I thought it might be helpful to demonstrate a more narrow, selective reduction with search filters, since there are likely to be situations where one is looking for something more difficult to narrow down, and eliminating results might make more sense than immediately looking for keywords related to it.

E.g. all executable `bin`aries and `libexec` files in the `libvirt` package:

```bash
❯ pacman -Ql libvirt | grep -v -E 'zsh|bash|man|polkit|locale|mount|socket|/$|\.'
libvirt /usr/bin/libvirtd
libvirt /usr/bin/virsh
libvirt /usr/bin/virt-admin
libvirt /usr/bin/virt-host-validate
libvirt /usr/bin/virt-login-shell
libvirt /usr/bin/virt-pki-query-dn
libvirt /usr/bin/virt-pki-validate
libvirt /usr/bin/virt-qemu-qmp-proxy
libvirt /usr/bin/virt-qemu-run
libvirt /usr/bin/virt-qemu-sev-validate
libvirt /usr/bin/virt-ssh-helper
libvirt /usr/bin/virt-xml-validate
libvirt /usr/bin/virtchd
libvirt /usr/bin/virtinterfaced
libvirt /usr/bin/virtlockd
libvirt /usr/bin/virtlogd
libvirt /usr/bin/virtlxcd
libvirt /usr/bin/virtnetworkd
libvirt /usr/bin/virtnodedevd
libvirt /usr/bin/virtnwfilterd
libvirt /usr/bin/virtproxyd
libvirt /usr/bin/virtqemud
libvirt /usr/bin/virtsecretd
libvirt /usr/bin/virtstoraged
libvirt /usr/bin/virtvboxd
libvirt /usr/lib/libvirt/libvirt_iohelper
libvirt /usr/lib/libvirt/libvirt_leaseshelper
libvirt /usr/lib/libvirt/libvirt_lxc
libvirt /usr/lib/libvirt/libvirt_parthelper
libvirt /usr/lib/libvirt/virt-login-shell-helper
libvirt /usr/share/doc/libvirt/examples/sh/virt-lxc-convert

❯ pacman -Ql libvirt | grep -v -E 'zsh|bash|man|polkit|locale|mount|socket|/$|\.' | wc -l
31
```

This is a fairly good example, because how do you search for executables? Well, they don't usually include a file extension, so that's exactly what we filtered out with `\.` at the end (the dot needs to be escaped).

And, indeed, these are essentially all executable files, even the last one in `/usr/share/doc` (In the case of `kernel-install`, the `.install` files _are_ executables, so it's an awkward juxtaposition, but that's not very common... I'm sure you get the idea...) A couple quick, last ones, along the same vein:

```bash
❯ pacman -Ql libvirt | grep '\.sh'
libvirt /usr/lib/libvirt/libvirt-guests.sh
```

What shell scripts are included in a package? That's a good one, and from our first example:

```bash
❯ pacman -Ql dracut sbctl systemd systemd-ukify | grep -i -E '\.install|\.sh' | grep -ivE 'modules.d|x11' | sort -n
dracut /usr/lib/dracut/dracut-functions.sh
dracut /usr/lib/dracut/dracut-init.sh
dracut /usr/lib/dracut/dracut-logger.sh
dracut /usr/lib/dracut/dracut-version.sh
dracut /usr/lib/kernel/install.d/50-dracut.install
dracut /usr/lib/kernel/install.d/51-dracut-rescue.install
sbctl /usr/lib/kernel/install.d/91-sbctl.install
systemd-ukify /usr/lib/kernel/install.d/60-ukify.install
systemd /usr/lib/kernel/install.d/50-depmod.install
systemd /usr/lib/kernel/install.d/90-loaderentry.install
systemd /usr/lib/kernel/install.d/90-uki-copy.install
```

What `.install` or `.sh` scripts are included in `dracut`, `sbctl`, `systemd` and `systemd-ukify` - sorted in numeric order (which reflects the order of execution in most `freedesktop.org` software). There's a little _"flag-stacking"_ in that `grep -ivE` command, too.

Anyway, I hope this demo helps people. Feel free to leave comments or suggestions, especially if there's anything you think I missed or left out. Thanks!
