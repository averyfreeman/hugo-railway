---
title: More ways to help Linux users hate Windows less
description: Ok, so obviously if you hate Windows, you probably just shouldn't be using it. But what if you love the way Linux operates, but have a plethora of Windows-only applications you have to have at your fingertips at any moment's notice? Here are some ways the discerning Linux user w…
summary: Ok, so obviously if you hate Windows, you probably just shouldn't be using it. But what if you love the way Linux operates, but have a plethora of Windows-only applications you have to have at your fingertips at any moment's notice? Here are some ways the discerning Linux user w…
date: 2021-04-21T00:15:12Z
author: Avery Freeman
slug: more-ways-to-help-linux-users-hate-windows-less
categories:
  - Random
thumbnail: https://openclipart.org/image/800px/204065
thumbnail_alt: Evil Computer Laptop - Openclipart
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2021/04/more-ways-to-help-linux-users-hate-windows-less/
---

<!-- Imported from WordPress post 419. -->

![Evil Computer Laptop - Openclipart](https://openclipart.org/image/800px/204065)

Ok, so obviously if you _hate_ Windows, you probably just shouldn't be using it. But what if you _love_ the way Linux operates, but have a plethora of Windows-only applications you _have_ to have at your fingertips at any moment's notice?

Here are some ways the discerning Linux user who's stuck by vendor lock-in can make Windows a little more palatable in the command line:

<!-- more -->

1) Install a package manager.

If you haven't already, install Chocolatey package manager for Windows [https://docs.chocolatey.org/en-us/choco/setup](https://docs.chocolatey.org/en-us/choco/setup)

Don't even bother reading up on it, just do it. Chocolatey is the most accepted and proliferate package manager for Windows. There's other options out there, but none that have as many packages, or that have as large of a community.

Almost anything you can imagine has been packaged using it, it can automatically manage their updates (with varying success), and it'll give you an all-in-one place to install and uninstall software, (almost) just like using a Linux distro.

The basic commands are `choco search \<packageName\>`, `choco install \<packageName\>` and `choco uninstall \<packageName\>`. There's also `choco info \<packageName\>` to read a package's description, and `choco list --local-only` to list all the software you've installed using it.

Easy, right? You'll be feeling more at home in no time. If you're looking for a GUI management tool, there's one of those, too, but it kind of defeats the purpose: [https://community.chocolatey.org/packages/ChocolateyGUI](https://community.chocolatey.org/packages/ChocolateyGUI)

2) Get `git-bash` and put its posix tool folders in your `%PATH%`:

A while back I wrote a post on PowerBash, and while it had some nice features, they were limited, worked with varying success, and you had to be in PowerShell to use them.

Before that, I had written about `git-bash` and how awesome it is, but using its posix utilities appeared to be relegated to only its terminal.

Well, now I found a way you can use the posix utils in _any_ terminal, regardless of what kind it is!

Now that you have Chocolatey installed, you can install `git-bash` by invoking the following in an administrative terminal - if you haven't installed `git-bash`, you are totally missing out, so do this now:

```text

 choco install -y git
```

Now that you have git-bash installed, add its primary posix util folders to your path, like this (must be administrative command prompt):

```text

setx /m '%PATH%;C:\Program Files\Git\bin;C:\Program Files\Git\usr;C:\Program Files\Git\usr\bin;C:\Program Files\Git\usr\libexec;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\mingw64\libexec\git-core'
```

As always, you can check your path in Windows with:

```text

echo %PATH%
```

Here's mine as an example from `cmd`:

```text

C:\>echo %PATH%
C:\Python39\Scripts\;C:\Python39\;C:\Program Files (x86)\VMware\VMware Workstation\bin\;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\ProgramData\chocolatey\bin;C:\Program Files\Git\cmd;C:\Program Files\PowerShell\7\;C:\Program Files\Microsoft VS Code\bin;C:\Program Files\OpenSSH-Win64;C:\Program Files\Git\bin;C:\Program Files\Git\usr;C:\Program Files\Git\usr\bin;C:\Program Files\Git\usr\libexec;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\mingw64\libexec\git-core;C:\ProgramData\chocolatey\lib\mpv.install\tools;C:\tools\BCURRAN3;C:\Program Files\Go\bin;C:\Program Files\dotnet\;C:\Program Files\Microsoft SQL Server\130\Tools\Binn\;C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\;C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Microsoft\VisualStudio\NodeJs;C:\Program Files\CMake\bin;C:\Program Files (x86)\ClockworkMod\Universal Adb Driver;C:\Users\avery\bin\cmdline-tools\bin;C:\Program Files\Java\jdk1.8.0_211\bin;C:\Android\android-sdk\tools;C:\Android\android-sdk\platform-tools;C:\Android\android-sdk\tools\bin;C:\Program Files (x86)\dotnet\;C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Microsoft\VisualStudio\NodeJs\;%PATH;C:\Program Files (x86)\gedit\bin;C:\Program Files\Microsoft VS Code;C:\Users\avery\.dotnet\tools;C:\ProgramData\chocolatey\lib\psutils\tools\psutils-master\;C:\Users\avery\AppData\Roaming\npm
```

By putting the posix tools from `git-bash` in your `%PATH%`, you can use pretty much all of them the same way as on a Linux machine, in any type of terminal window - `cmd.exe`, `pwsh.exe`, `bash.exe` - and they'll be available in any current working directory. Most of them work just fine, you just have to remember to use backslashes for directories instead of forward slashes if you're in cmd or powershell, but `git-bash` even uses forward slashes for maximum comfort and compatibility.

All your favs are there - `ssh scp sed sha256sum grep which sort cat cut awk gawk vim nano ls rm wc du df less more` etc. The only one I can think of that doesn't work correctly is the `find` command - probably because it creates a command conflict with the MS-DOS equivalent (here's proof):

```text

C:\>which find
/c/Windows/system32/find
```

If you want to install `tree`, that's _not_ included, but now you can install it with:

```text

C:\>choco install tree
```

And if you were discerning enough to search for sudo, you'd notice that was there, too, allowing you to install software from a non-administrative prompt (requires UAC administrative privileges).

Here's the tree of the `git-bash usr/bin` dir - check it out, it's pretty comprehensive!:

```text

$ tree usr/bin | grep .exe

$ tree usr/bin | grep .exe
|-- [.exe
|-- arch.exe
|-- awk.exe
|-- b2sum.exe
|-- base32.exe
|-- base64.exe
|-- basename.exe
|-- basenc.exe
|-- bash.exe
|-- bunzip2.exe
|-- bzcat.exe
|-- bzip2.exe
|-- bzip2recover.exe
|-- captoinfo.exe
|-- cat.exe
|-- chattr.exe
|-- chcon.exe
|-- chgrp.exe
|-- chmod.exe
|-- chown.exe
|-- chroot.exe
|-- cksum.exe
|-- clear.exe
|-- cmp.exe
|-- column.exe
|-- comm.exe
|-- cp.exe
|-- csplit.exe
|-- cut.exe
|-- cygcheck.exe
|-- cygpath.exe
|-- cygwin-console-helper.exe
|-- d2u.exe
|-- dash.exe
|-- date.exe
|-- dd.exe
|-- df.exe
|-- diff.exe
|-- diff3.exe
|-- dir.exe
|-- dircolors.exe
|-- dirmngr-client.exe
|-- dirmngr.exe
|-- dirname.exe
|-- dos2unix.exe
|-- du.exe
|-- dumpsexp.exe
|-- echo.exe
|-- env.exe
|-- envsubst.exe
|-- ex.exe
|-- expand.exe
|-- expr.exe
|-- factor.exe
|-- false.exe
|-- fido2-assert.exe
|-- fido2-cred.exe
|-- fido2-token.exe
|-- file.exe
|-- find.exe
|-- fmt.exe
|-- fold.exe
|-- funzip.exe
|-- gapplication.exe
|-- gawk-5.0.0.exe
|-- gawk.exe
|-- gdbus.exe
|-- gencat.exe
|-- getconf.exe
|-- getfacl.exe
|-- getopt.exe
|-- gettext.exe
|-- gio-querymodules.exe
|-- gkill.exe
|-- glib-compile-schemas.exe
|-- gobject-query.exe
|-- gpg-agent.exe
|-- gpg-connect-agent.exe
|-- gpg-error.exe
|-- gpg-wks-server.exe
|-- gpg.exe
|-- gpgconf.exe
|-- gpgparsemail.exe
|-- gpgscm.exe
|-- gpgsm.exe
|-- gpgsplit.exe
|-- gpgtar.exe
|-- gpgv.exe
|-- grep.exe
|-- groups.exe
|-- gsettings.exe
|-- gzexe
|-- gzip.exe
|-- head.exe
|-- hmac256.exe
|-- hostid.exe
|-- hostname.exe
|-- iconv.exe
|-- id.exe
|-- infocmp.exe
|-- infotocap.exe
|-- install.exe
|-- join.exe
|-- kbxutil.exe
|-- kill.exe
|-- ldd.exe
|-- ldh.exe
|-- less.exe
|-- lessecho.exe
|-- lesskey.exe
|-- link.exe
|-- ln.exe
|-- locale.exe
|-- locate.exe
|-- logname.exe
|-- ls.exe
|-- lsattr.exe
|-- mac2unix.exe
|-- md5sum.exe
|-- minidumper.exe
|-- mintty.exe
|-- mkdir.exe
|-- mkfifo.exe
|-- mkgroup.exe
|-- mknod.exe
|-- mkpasswd.exe
|-- mktemp.exe
|-- mount.exe
|-- mpicalc.exe
|-- msgattrib.exe
|-- msgcat.exe
|-- msgcmp.exe
|-- msgcomm.exe
|-- msgconv.exe
|-- msgen.exe
|-- msgexec.exe
|-- msgfilter.exe
|-- msgfmt.exe
|-- msggrep.exe
|-- msginit.exe
|-- msgmerge.exe
|-- msgunfmt.exe
|-- msguniq.exe
|-- mv.exe
|-- nano.exe
|-- nettle-hash.exe
|-- nettle-lfib-stream.exe
|-- nettle-pbkdf2.exe
|-- ngettext.exe
|-- nice.exe
|-- nl.exe
|-- nohup.exe
|-- nproc.exe
|-- numfmt.exe
|-- od.exe
|-- openssl.exe
|-- p11-kit.exe
|-- passwd.exe
|-- paste.exe
|-- patch.exe
|-- pathchk.exe
|-- perl.exe
|-- perl5.32.1.exe
|-- pinentry-w32.exe
|-- pinentry.exe
|-- pinky.exe
|-- pkcs1-conv.exe
|-- pldd.exe
|-- pluginviewer.exe
|-- pr.exe
|-- printenv.exe
|-- printf.exe
|-- ps.exe
|-- psl.exe
|-- ptx.exe
|-- pwd.exe
|-- readlink.exe
|-- realpath.exe
|-- rebase.exe
|-- recode-sr-latin.exe
|-- regtool.exe
|-- reset.exe
|-- rm.exe
|-- rmdir.exe
|-- rnano.exe
|-- runcon.exe
|-- rview.exe
|-- rvim.exe
|-- scp.exe
|-- sdiff.exe
|-- sed.exe
|-- seq.exe
|-- setfacl.exe
|-- setmetamode.exe
|-- sexp-conv.exe
|-- sftp.exe
|-- sh.exe
|-- sha1sum.exe
|-- sha224sum.exe
|-- sha256sum.exe
|-- sha384sum.exe
|-- sha512sum.exe
|-- shred.exe
|-- shuf.exe
|-- sleep.exe
|-- sort.exe
|-- split.exe
|-- ssh-add.exe
|-- ssh-agent.exe
|-- ssh-keygen.exe
|-- ssh-keyscan.exe
|-- ssh-pageant.exe
|-- ssh.exe
|-- sshd.exe
|-- ssp.exe
|-- stat.exe
|-- strace.exe
|-- stty.exe
|-- sum.exe
|-- sync.exe
|-- tabs.exe
|-- tac.exe
|-- tail.exe
|-- tar.exe
|-- tclsh.exe
|-- tclsh8.6.exe
|-- tee.exe
|-- test.exe
|-- tic.exe
|-- tig.exe
|-- timeout.exe
|-- toe.exe
|-- touch.exe
|-- tput.exe
|-- tr.exe
|-- true.exe
|-- truncate.exe
|-- trust.exe
|-- tset.exe
|-- tsort.exe
|-- tty.exe
|-- tzset.exe
|-- u2d.exe
|-- umount.exe
|-- uname.exe
|-- unexpand.exe
|-- uniq.exe
|-- unix2dos.exe
|-- unix2mac.exe
|-- unlink.exe
|-- unzip.exe
|-- unzipsfx.exe
|-- users.exe
|-- vdir.exe
|-- view.exe
|-- vim.exe
|-- vimdiff.exe
|-- watchgnupg.exe
|-- wc.exe
|-- which.exe
|-- who.exe
|-- whoami.exe
|-- winpty-agent.exe
|-- winpty-debugserver.exe
|-- winpty.exe
|-- xargs.exe
|-- xgettext.exe
|-- xxd.exe
|-- yat2m.exe
|-- yes.exe
|-- zipinfo.exe
```

There's even this cute little `df` replacement called `dfc` I like to use in Linux for a more graphical representation of hard drive usage - it's called `duf` in Windows (slightly truncated for formatting purposes):

![](/wp-content/uploads/2021/04/image-12.webp)

Or `htop` which is called `ntop` in Windows:

![](/wp-content/uploads/2021/04/image-13.webp)

See, now Windows isn't so bad after all, is it?
