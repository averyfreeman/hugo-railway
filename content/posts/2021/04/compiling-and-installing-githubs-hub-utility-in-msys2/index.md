---
title: Compiling and installing GitHub's Hub Utility in msys2
description: Hub project source code root directory So I've been liking msys2 so far. I've replaced the default git install with msys2's utilities in C:\tools\msys64\usr\bin and they seem to work from Windows command prompt just fine, except for bash, which complains of cygwin1.dll mismatch,…
summary: Hub project source code root directory So I've been liking msys2 so far. I've replaced the default git install with msys2's utilities in C:\tools\msys64\usr\bin and they seem to work from Windows command prompt just fine, except for bash, which complains of cygwin1.dll mismatch,…
date: 2021-04-27T18:08:17Z
author: Avery Freeman
slug: compiling-and-installing-githubs-hub-utility-in-msys2
categories:
  - Random
thumbnail: /post-thumbnails/attachment-477.webp
thumbnail_alt: Compiling and installing GitHub's Hub Utility in msys2
thumbnail_width: 480
thumbnail_height: 353
thumbnail_aspect: 1.3597733711048159
type: post
status: publish
url: /posts/2021/04/compiling-and-installing-githubs-hub-utility-in-msys2/
---

<!-- Imported from WordPress post 474. -->

![](/wp-content/uploads/2021/04/image-21.webp)

*Hub project source code root directory*

So I've been liking msys2 so far. I've replaced the default `git` install with msys2's utilities in `C:\tools\msys64\usr\bin` and they seem to work from Windows command prompt just fine, except for `bash`, which complains of `cygwin1.dll` mismatch, but that's OK, I'll just run the `msys2_shell.cmd` which is how it's intended to be used anyway (inside Mintty - or, alternately ConEmu or defterm). So it's slightly less flexible (git-bash's `bash.exe` could be run from inside a standard `cmd.exe` terminal), but I'm OK with that since [I now have man files in Windows](/posts/2021/04/man-command-in-windows-possible) (!) and I can update the utilities using `pacman`, instead of waiting for updates to come through git-bash updates (I have my doubts that it ever happens).

Why do all of this hacky 3rd-party linux sublayer stuff instead of just enabling Windows Subsystem for Linux (WSL)? Simple: I am fairly certain you cannot run WSL binaries from Windows (please correct me if I'm wrong!).

<!-- more -->

Therefore, if I wanted to `grep` a `dir`, that's not going to happen, whereas with git-bash or msys2, I can run (most) those utilities inside `cmd`, so it doesn't matter where I am or which terminal I'm using. I even discovered `man` works from `cmd`, too (note: not administrative prompt)! See?

![](/wp-content/uploads/2021/04/image-19.webp)

*hub man page shown in Windows cmd.exe terminal*

That brings me to hub:

Hub is a nice little addition to git that extends its functionality. You set some variables in your `.bashrc` regarding your git identity (GitHub or otherwise) and a token for access to your repositories, and suddenly you can do a bunch of stuff git wasn't able to, or do the same things much more easily. If you'd like to study up on how `hub` can make your life easier, check this out: [https://hub.github.com/](https://hub.github.com/) - My favorite feature is creating a new repo from the terminal - `hub create`.

But I was using Hub installed in Windows, and while it appeared to work OK, it didn't have a `man` file, and I'm constantly looking up references for it while I get the hang of it and would rather not have to consult a browser window every time I want to read about its features. Since I had this new msys2 installation with `man` working and everything, I thought I should migrate over `hub`, too, and since most the other utilities from msys2 work from `cmd.exe`, I figured maybe I'd get lucky and `hub` would be the same...

First, I searched the msys2 repos, but although there's a lot of `git`\-related packages, nothing for `hub` itself... so the next thing I tried was installing from `pip`, but that resulted in a barrage of errors (which is common with `pip`), primarily regarding unresolved dependencies.

Note: Even though pypi (`pip`) is listed as an installation method for Hub, I actually have my doubts that python is still a dependency of Hub, as from looking at the source code it appears to have been re-built in Golang, a common trend among python developers, it seems. So that might explain why `pip` didn't work for installing Hub.

So I just cloned the Hub repo and built it from there. I have a working copy of `go` installed in Windows, so since that's the primary dependency, the rest was easy. Note: golang does not appear to be in the msys2 repos, so it'll has to be installed in Windows with `%PATH%` variable enabled, and then use `msys64_shell.cmd -use-full-path` to start msys2 so you have all your Windows `%PATH%` variables in addition to those included by default.

A quick run-down of the dependencies (other than Golang, which you installed in Windows...):

```text

# Currently installed packages:
$ pacman -Qe
base 2020.12-1
cmake 3.20.1-1
gcc 10.2.0-1
git 2.31.1-2
make 4.3-1
man-db 2.9.4-1
python 3.8.7-1
python-pip 20.2.2-1
tree 1.8.0-1

# depdendencies for Hub - if you want tests and docs, include ruby and man-db
$ pacman -S make gcc git make

# make yourself a clean parent directory for all your builds
$ mkdir build && cd build

# clone the repo
$ git clone https://github.com/github/hub && cd hub

# run make and allow it to run through compilation w/ go - will download any necessary dependencies that may have not been resolved 
$ make

# instead of running 'make install', use the installation script: 
$ cp script/install.sh . && ./install.sh
```

That worked great for me. If I had it to do over again, I might try using the `bootstrap` script in the `./hub/script` directory. I believe from looking at a couple of the scripts, they're meant to either be copied to the .`/hub` directory or run from hub's root - although, I tried running `install.sh` from `./hub` with `./script/install.sh` and it failed, so I scanned through it and it looked like it was meant to be copied to `./hub`. Check them out a bit if you want to use them and see what the author intended, it should be relatively obvious.

OK, so now `hub` is working from msys2 - complete with `man` file - both inside and outside mintty! Super excited. That's all for now...
