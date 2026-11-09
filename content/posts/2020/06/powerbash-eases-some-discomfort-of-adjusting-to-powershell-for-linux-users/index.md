---
title: PowerBash eases some discomfort of adjusting to PowerShell for Linux users
description: Want to use grep or vim from your powershell env? Now you can! OK, I just stumbled across the coolest thing. Occasionally I use PowerShell because it's the easiest way to get batch processes accomplished on a Windows computer, or sometimes the only way to implement a feature (e.…
summary: Want to use grep or vim from your powershell env? Now you can! OK, I just stumbled across the coolest thing. Occasionally I use PowerShell because it's the easiest way to get batch processes accomplished on a Windows computer, or sometimes the only way to implement a feature (e.…
date: 2020-07-01T02:06:41Z
author: Avery Freeman
slug: powerbash-eases-some-discomfort-of-adjusting-to-powershell-for-linux-users
categories:
  - Random
thumbnail: /post-thumbnails/attachment-333.webp
thumbnail_alt: PowerBash eases some discomfort of adjusting to PowerShell for Linux users
thumbnail_width: 480
thumbnail_height: 310
thumbnail_aspect: 1.5483870967741935
type: post
status: publish
url: /posts/2020/06/powerbash-eases-some-discomfort-of-adjusting-to-powershell-for-linux-users/
---

<!-- Imported from WordPress post 332. -->

![](/wp-content/uploads/2020/06/image-2.webp)

*Want to use grep or vim from your powershell env?  Now you can!*

OK, I just stumbled across the coolest thing.

Occasionally I use PowerShell because it's the easiest way to get batch processes accomplished on a Windows computer, or sometimes the only way to implement a feature (e.g. making folders case-sensitive to avoid naming conflicts when syncing with nix computers).

But it's always a bit of a pain because I have to look up ways to do basic things I can easily do in a POSIX-style environment without needing a reference (e.g. `find`, `grep`, `sed`, `df`, `vim`) and sometimes their implementation is awkward or clunky, or just not easily possible.

Enter Powerbash:

<!-- more -->

![](/wp-content/uploads/2020/06/PowerBash-demo-1024x854.gif)

*Another way of installing - import the script*

From the Github repo, "PowerBash Module allows you to run bash commands and other Linux programs from the Windows Subsystem for Linux directly from PowerShell, with support for piping to and from PowerShell commands."

Here's the link to the repo: [https://github.com/jimmehc/PowerBash](https://github.com/jimmehc/PowerBash)

They recommend getting the script from the repo and importing it using `import-module` but I just installed it from the Powershell Gallery using:  
`install-package powerbash`  
from a PS prompt  
  
(note, I did try installing it from the script using `import-module` but it points to an older directory structure for WSL than that used in 1809, so it would need some modification for more modern WSL implementations. The PSGallery package works OTB)

![](/wp-content/uploads/2020/06/image-3.webp)

*Using grep -E with find-package command in PowerShell*

To install the PS Gallery and get started with the PowerShell method of package management, check this out:  
[https://copdips.com/2018/05/setting-up-powershell-gallery-and-nuget-gallery-for-powershell.html](https://copdips.com/2018/05/setting-up-powershell-gallery-and-nuget-gallery-for-powershell.html)

It does require WSL, as well, and 14316 or higher version of Windows.

It makes using PowerShell a lot easier when you can pull out the random nix command in a pinch!

![](/wp-content/uploads/2020/06/image-4.webp)

*Looks like VIM works just fine in PowerShell now...*

You can still use PowerShell in msys64 (also in "Git Bash") which gives you some of the same functionality, but PowerShell's functionality is somewhat impaired when running inside msys64, so it's not that great of a solution.

PowerBash starts with PowerShell and adds the Linux compatibility layer to it, rather than the other way around, so it's inherently more friendly to your PS cmdlets. Also nice that it uses WSL for compatibility instead of msys64's re-compiled utilities. Definitely a two-fer.

PowerBash looks in locations in the Linux Subsystem's filesystem for programs, equivalent to the following `$PATH`:

```text
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/gcc/x86_64-linux-gnu/4.8:/usr/games
```

This is currently hardcoded (damn!) but that may be changed in the future (yay!).

Any existing commands available to the current PowerShell session, including EXEs in the PowerShell `$env:PATH`, cmdlets, functions, and aliases, will not be overridden by Linux programs. If you would like to use a Linux program of the same name instead, remove all functions, cmdlets, and aliases from your session prior to importing the module. For EXEs, you can pass the names of the programs you want over-ridden to the module via `-ArgumentList` when importing (comma separated).
