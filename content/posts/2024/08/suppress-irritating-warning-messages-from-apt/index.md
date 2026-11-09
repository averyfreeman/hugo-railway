---
title: Suppress Irritating Warning Messages From `apt`
description: Yes, really. You know the error messages you get any time you're trying to pipe the output of apt to something? They're kind of irritating since they don't help in any meaningful way. e.g. you might want to reduce apt search results to packages that contain a string either in th…
summary: Yes, really. You know the error messages you get any time you're trying to pipe the output of apt to something? They're kind of irritating since they don't help in any meaningful way. e.g. you might want to reduce apt search results to packages that contain a string either in th…
date: 2024-08-15T01:31:40Z
author: Avery Freeman
slug: suppress-irritating-warning-messages-from-apt
categories:
  - Random
thumbnail: /post-thumbnails/attachment-971.webp
thumbnail_alt: Suppress Irritating Warning Messages From `apt`
thumbnail_width: 480
thumbnail_height: 474
thumbnail_aspect: 1.0126582278481013
type: post
status: publish
url: /posts/2024/08/suppress-irritating-warning-messages-from-apt/
---

<!-- Imported from WordPress post 969. -->

![Stickman says what](/wp-content/uploads/2024/08/hand-drawn-stickman-shocked-with-speech-bubble-1024x1011.webp)

*Yes, really.*

You know the error messages you get any time you're trying to pipe the output of `apt` to something? They're kind of irritating since they don't help in any meaningful way. e.g. you might want to reduce `apt search` results to packages that contain a string either in the name or description, but the error message is sure to appear:

```bash
apt search ufw | grep -A 1 ufw

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

gufw/noble 24.04.0-2 all
  graphical user interface for ufw

--
ufw/noble,now 0.36.2-6 all [installed,automatic]
  program for managing a Netfilter firewall
```

Or if you're trying to get a list of installed packages in a way to which they can be referred to by scripts or other piping, there it is again...

```bash
apt list --installed | cut -d '/' -f1

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Listing...
accountsservice
acl
adcli
. . .
```

A _slight_ caveat: If you're _actually_ scripting, there's better commands to use than `apt`, such as `dpkg` or even `apt-get` (probably only still around because of it). Please research them if you're working on something substantive or important, such as an installation script or `Dockerfile` you anticipate distributing.

But, if you're just messing around in your shell doing the odd one-off, it's nice to be able to use the command with which you're probably most familiar, rather than having to look up more commands, flags, and modifiers.

The good thing is, there's an easy fix: Create an `alias` that accepts any number of arguments (as a string), and pipe the `stderr` output to `/dev/null`:

```bash
alias apt="apt $* 2> /dev/null"
```

This _will_ omit other error messages from `apt` while you're using it, but in all my experience I can't remember ever seeing one for a different reason.

Note: you need this `alias` to be encapsulated with quotation marks, since it contains spaces, but invoking an environment variable (the `$*` argument) cannot be done with single-quotes `'`, so be sure to use double-quotes `"`

Luckily, that leaves the single-quotes available to wrap the whole expression and append it to your `rc` (`.bash_aliases`, etc.):

```bash
echo 'alias apt="apt $* 2> /dev/null"' >> $HOME/.bashrc
```

If you're interested in further reading, I recommend this short explanation of the differences between `$*, "$*", $@ and "$@"`:  
[https://unix.stackexchange.com/questions/129072/whats-the-difference-between-and](https://unix.stackexchange.com/questions/129072/whats-the-difference-between-and)

Questions? 😊
