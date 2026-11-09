---
title: man command in Windows possible (?)
description: Continuing along in my series about how to make Windows more palatable for Linux users, one thing that's been more difficult to find a workaround for is the man command For about an hour, I went on a wild goose chase for some sort of alternative in Windows, and found relatively…
summary: Continuing along in my series about how to make Windows more palatable for Linux users, one thing that's been more difficult to find a workaround for is the man command For about an hour, I went on a wild goose chase for some sort of alternative in Windows, and found relatively…
date: 2021-04-26T20:58:28Z
author: Avery Freeman
slug: man-command-in-windows-possible
categories:
  - Random
thumbnail: /post-thumbnails/attachment-432.webp
thumbnail_alt: man command in Windows possible (?)
thumbnail_width: 480
thumbnail_height: 335
thumbnail_aspect: 1.4328358208955223
type: post
status: publish
url: /posts/2021/04/man-command-in-windows-possible/
---

<!-- Imported from WordPress post 431. -->

![](/wp-content/uploads/2021/04/image-14.webp)

Continuing along in my series about how to make Windows more palatable for Linux users, one thing that's been more difficult to find a workaround for is the `man` command

For about an hour, I went on a wild goose chase for some sort of alternative in Windows, and found relatively little. I discovered a win32 implementation of `mandoc` [here](https://embedeo.org/ws/doc/man_windows/), which sounds interesting, but I decided not to explore it further than seeing if it'd run (_spoiler: it does_), since where would I download all the man files for the utilities that were included with git-bash? Sounded like too much of a chore.

Instead, I opted to go with an entirely new shell framework, called msys2. It's slightly different than git-bash, in that, although both link to `cygwin.dll` for their tools, it starts logins an entirely new user folder in the `C:\tools\msys64\home\user` directory, and uses pacman as a package manager. You can supposedly compile tools that are totally win32 compatible with minGW (also included in the installation package) without having to link to `cygwin.dll`, but I've yet to see that in action.

Besides, all I really cared about at the time was getting my `man` back! Does that sound like you? Are you also a Windows user missing your `man`? Well, read further!

<!-- more -->

msys2 can be easily installed using chocolatey, ala:

```text

C:\>choco install msys2
```

This will install it to its default directory in `C:\tools\msys64`. If you're interested in other command line arguments for the installation, head over to: [https://community.chocolatey.org/packages/msys2/](https://community.chocolatey.org/packages/msys2/)

I mostly just wanted to have a working man command, for which I invoked:

```text

 $ pacman -Syuu
 
 $ pacman -S man-db
 
 $ pacman -S git
```

This updates the package references, downloads any updates, and then installs man-db, the framework for man files on an Arch Linux machine (and apparently msys2, as well). In fact, I would assume, at least in terms of package management, it should operate very similarly to Arch Linux. I'm not the hugest fan of pacman, as it uses short flags instead of verb + noun syntax, which I find, although shorter, requires more memorization since it's not as intuitive. For a reference to the command flags, [look here](https://devhints.io/pacman) (short and sweet). For the official manual, [go here](https://wiki.archlinux.org/index.php/pacman).

Since I wanted the man file for `git`, I installed it. Sure enough, it came along with the commensurate `man` file. Finally, it looks like my lack of `man` in Windows has been solved!

![man file for git displayed in Windows 10](/wp-content/uploads/2021/04/image-15.webp)

*man file for git displayed in Windows 10*

I'm not really sure if I'll need to re-install any of the packages I've been using through git-bash all this time, or if I can put msys2's utilities in my `%PATH%` for Windows and use them from any terminal like I had been the ones from git-bash. I'll update both those posts in the future if that's something I end up implementing.

I did test a binary in msys2's `bin` directory from cmd.exe and it worked just fine - I'm not sure if it's statically linked to `cygwin.dll` or "natively" compatible with Windows, but I suppose if I have msys2 installed it doesn't really matter...

![](/wp-content/uploads/2021/04/image-18.webp)

*msys2 gawk running from Windows cmd.exe*

But for now, I just wanted to get this post up quickly since I was so excited I'd managed to get `man` in Windows (!) which I had been lacking all this time. My penguinification of Windows is nearly complete!

One exciting thing I did notice about msys2 relative to git-bash is `bash` itself has been well updated - I wonder if that's because it's compiled from Arch Linux repositories? I'll have to do some investigating as to the source of the source codes...

![](/wp-content/uploads/2021/04/image-16.webp)

*bash version in git-bash is 4.4.23*

![](/wp-content/uploads/2021/04/image-17.webp)

*bash version in msys2 is 5.1.4(1) - quite an upgrade!*

So I do suppose I'll probably end up replacing git-bash's utilities with the ones from msys2 in my `%PATH%` if they work everywhere on my machine, and they're more up to date. I presume I can keep all the standard utilities updated using `pacman`, now, too, which was a feature missing in git-bash, as _git-bash lacks its own package manager_.

I suppose while I'm at it, I should probably link to [the official msys2 documentation](https://www.msys2.org/). I also found this a while back about [the differences between MinGW and msys2](https://gist.github.com/ReneNyffenegger/a8e9aa59166760c5550f993857ee437d) (which can get rather confusing), but disclaimer: I have not verified its accuracy or current status.

BTW, if anyone liked my prompt, here's the code to add to your `.bashrc` file - it'll test if there's a `.git` directory present in the pwd, and if so, tell you which branch you're in:

```text

PS1='\[\033[0;32m\]\[\033[0m\033[0;32m\]\u\[\033[0;36m\] @ \[\033[0;36m\]\h \w\[\033[0;32m\]`[ -d ./.git ] && git branch`\n\[\033[0;32m\]└─\[\033[0m\033[0;32m\] ▶\[\033[0m\] '
```

The `git branch` feature is compatible with git-bash _and_ msys2 in Windows. Through all this, I discovered `$(cmd)` references are not compatible with `.bashrc` / bash startup files (but _hopefully_ not _any_ shell script) in Windows, but backticks are, e.g. `` `cmd` ``. Good to know.

If you're interested in learning more about initalizing `bash` on startup, there's [a great reference here](https://www.gnu.org/software/bash/manual/) - or I suppose now you can run `man bash` if you've installed msys2 on your machine 😎 Also, if you're in a hurry, the first answer in [this stack exchange question](https://superuser.com/questions/789448/choosing-between-bashrc-profile-bash-profile-etc) is very helpful for differentiating startup files and identifying their purposes.

Alright, this is getting off-topic, I suppose I'd better stop writing...
