---
title: Linux or MacOS lover, but have to use Windows?
description: "editing bashrc in nano using a mingw64 (git-bash) terminal window on Windows 1809 LTSC Make your Windows experience more nerdy! I tend to notice Windows users fall into a few major categories: Unaware any OS besides Windows exists Uses Windows because that's what they're most co…"
summary: "editing bashrc in nano using a mingw64 (git-bash) terminal window on Windows 1809 LTSC Make your Windows experience more nerdy! I tend to notice Windows users fall into a few major categories: Unaware any OS besides Windows exists Uses Windows because that's what they're most co…"
date: 2019-07-30T21:40:22Z
author: Avery Freeman
slug: linux-or-macos-lover-but-have-to-use-windows
categories:
  - Random
thumbnail: /post-thumbnails/attachment-236.webp
thumbnail_alt: Linux or MacOS lover, but have to use Windows?
thumbnail_width: 480
thumbnail_height: 313
thumbnail_aspect: 1.5335463258785942
type: post
status: publish
url: /posts/2019/07/linux-or-macos-lover-but-have-to-use-windows/
---

<!-- Imported from WordPress post 222. -->

![](/wp-content/uploads/2019/07/image.webp)

*editing bashrc in nano using a mingw64 (git-bash) terminal window on Windows 1809 LTSC*

### Make your Windows experience more nerdy!

I tend to notice Windows users fall into a few major categories:

1.  Unaware any OS besides Windows exists
2.  Uses Windows because that's what they're most comfortable with
3.  Doesn't like Windows per se, but can't afford a Mac, and doesn't want to grapple with Linux
4.  Likes posix-compliant OS better, but trapped by vendor lock-in requiring use of proprietary software only available on Windows

If you're like me, you're in the 4th category. I love package managers, bash shells, am most comfortable with nix commands and regex, and while I think powershell is a step in the right direction, the syntax is unfamiliar enough that I still have to consult references in order to do most things. It's also ridiculously verbose compared to posix OS.

<!-- more -->

But alas, I'm in an environment with proprietary Windows software. If I want to edit server settings in my Windows Domain environment, there really isn't any cross-platform tools to do it with. I could remote in using SSH and run powershell scripts, but that's definitely not as easy as just using the GUI tools that are readily available to install on any Windows platform.

Well, thankfully I've been able to make Windows a more comfortable environment for nix users with a few add-ons that have really made life a lot easier!

In a lot of ways, it's the best of both worlds (or, attempting to have cake and eat it - pick your metaphor).

### 1) Install a package manager (or a couple!)

![](/wp-content/uploads/2019/07/image-1.webp)

*scoop info command showing description of mingx package*

Here's some of what I've done:

[I went with Scoop,](https://scoop.sh/) which is a package manager that installs normal Windows programs through the command line.

It's kind of interesting in that it installs programs to your user folder, negating permissions issues and UAC prompts for installing/uninstalling programs. Also, any user-specific settings will be local to each program, so they can be customized and preserved more fully than system-wide installs.

The drawback, obviously, is that if you want to install programs for multiple users you'll want to install them the old-fashioned way, or [use chocolatey](https://chocolatey.org/)

Here's an example of finding and installing [QEMU](https://www.qemu.org/) using scoop:

```text
avery@tunasalad MINGW64 /bin
$ scoop search qemu
'main' bucket:
    qemu (4.1.0-rc2)
avery@tunasalad MINGW64 /bin
$ scoop install qemu
Updating Scoop...
Updating 'extras' bucket...
 * 33f73563 oh-my-posh: Update to version 2.0.311                        2 hours ago
 * 35865425 ssh-agent-wsl: Update to version 2.4                         3 hours ago
 * 2fa7048f oh-my-posh: Update to version 2.0.307                        3 hours ago
 * 63f7fcdb gcloud: Update to version 256.0.0                            3 hours ago
 * f92493a8 kibana: Update to version 7.2.1                              4 hours ago
 * 6f9fb8d5 elasticsearch: Update to version 7.2.1                       4 hours ago
Updating 'main' bucket...
 * f8034317 aws: Update to version 1.16.209                              53 minutes ago
Scoop was updated successfully!
Installing 'qemu' (4.1.0-rc2) [64bit]
Downloading https://qemu.weilnetz.de/w64/qemu-w64-setup-20190724.exe#/dl.7z (121.3 MB)...
Checking hash of qemu-w64-setup-20190724.exe ... ok.
Extracting dl.7z ... done.
Linking ~\scoop\apps\qemu\current => ~\scoop\apps\qemu\4.1.0-rc2
Creating shim for 'qemu-edid'.
Creating shim for 'qemu-ga'.
Creating shim for 'qemu-img'.
Creating shim for 'qemu-io'.
Creating shim for 'qemu-system-aarch64'.
Creating shim for 'qemu-system-aarch64w'.
Creating shim for 'qemu-system-alpha'.
Creating shim for 'qemu-system-alphaw'.
Creating shim for 'qemu-system-arm'.
Creating shim for 'qemu-system-armw'.
Creating shim for 'qemu-system-cris'.
Creating shim for 'qemu-system-crisw'.
Creating shim for 'qemu-system-hppa'.
Creating shim for 'qemu-system-hppaw'.
Creating shim for 'qemu-system-i386'.
Creating shim for 'qemu-system-i386w'.
Creating shim for 'qemu-system-lm32'.
Creating shim for 'qemu-system-lm32w'.
Creating shim for 'qemu-system-m68k'.
Creating shim for 'qemu-system-m68kw'.
Creating shim for 'qemu-system-microblaze'.
Creating shim for 'qemu-system-microblazeel'.
Creating shim for 'qemu-system-microblazeelw'.
Creating shim for 'qemu-system-microblazew'.
Creating shim for 'qemu-system-mips'.
Creating shim for 'qemu-system-mips64'.
Creating shim for 'qemu-system-mips64el'.
Creating shim for 'qemu-system-mips64elw'.
Creating shim for 'qemu-system-mips64w'.
Creating shim for 'qemu-system-mipsel'.
Creating shim for 'qemu-system-mipselw'.
Creating shim for 'qemu-system-mipsw'.
Creating shim for 'qemu-system-moxie'.
Creating shim for 'qemu-system-moxiew'.
Creating shim for 'qemu-system-nios2'.
Creating shim for 'qemu-system-nios2w'.
Creating shim for 'qemu-system-or1k'.
Creating shim for 'qemu-system-or1kw'.
Creating shim for 'qemu-system-ppc'.
Creating shim for 'qemu-system-ppc64'.
Creating shim for 'qemu-system-ppc64w'.
Creating shim for 'qemu-system-ppcw'.
Creating shim for 'qemu-system-riscv32'.
Creating shim for 'qemu-system-riscv32w'.
Creating shim for 'qemu-system-riscv64'.
Creating shim for 'qemu-system-riscv64w'.
Creating shim for 'qemu-system-s390x'.
Creating shim for 'qemu-system-s390xw'.
Creating shim for 'qemu-system-sh4'.
Creating shim for 'qemu-system-sh4eb'.
Creating shim for 'qemu-system-sh4ebw'.
Creating shim for 'qemu-system-sh4w'.
Creating shim for 'qemu-system-sparc'.
Creating shim for 'qemu-system-sparc64'.
Creating shim for 'qemu-system-sparc64w'.
Creating shim for 'qemu-system-sparcw'.
Creating shim for 'qemu-system-tricore'.
Creating shim for 'qemu-system-tricorew'.
Creating shim for 'qemu-system-unicore32'.
Creating shim for 'qemu-system-unicore32w'.
Creating shim for 'qemu-system-x86_64'.
Creating shim for 'qemu-system-x86_64w'.
Creating shim for 'qemu-system-xtensa'.
Creating shim for 'qemu-system-xtensaeb'.
Creating shim for 'qemu-system-xtensaebw'.
Creating shim for 'qemu-system-xtensaw'.
'qemu' (4.1.0-rc2) was installed successfully!
```

See? That wasn't so hard, was it?

### 2) Install git for Windows (and get an awesome nix-like terminal shell!)

Note, I usually install VS code before installing git, since that way you can set it to be your default editor during the install process. Now that you have your package manager set up, you can install it by running:

```text
$ scoop install code
```

Obviously git is a hugely useful program for versioning code, documents, etc. and there are multiple sites it can be configured to work with your favorite version tracking site, such as Github, BitBucket, GitLab, et. al.

Helpful info about using git:

-   [Why you should be using git as a developer](https://codeburst.io/number-one-piece-of-advice-for-new-developers-ddd08abc8bfa)
-   [git for documents, spreadsheets, and work collaboration](https://medium.com/@dis_is_patrick/git-for-non-programmers-49c85d3f647d)
-   [Using](https://www.simuldocs.com/) [git for technical writing](https://www.cuttlesoft.com/using-git-software-documentation/)[](https://www.simuldocs.com/)

But the beauty of the [git windows installer](https://git-scm.com/download/win) is it also installs a fork of [mintty](https://mintty.github.io/) called [git-bash](https://gitforwindows.org/), which is a terminal emulator with a very comprehensive set of posix tools that'll make you feel way more at home in a Windows environment if you're used to working on posix systems.

Learn more about it by checking out [this discussion,](https://superuser.com/questions/1053633/what-is-git-bash-for-windows-anyway) "What is git-bash, anyway?"

If you have more questions about nuts-and-bolts, the [git-bash github faq](https://github.com/git-for-windows/git/wiki/FAQ) is a good place to start, including cmd console compatibility, long path or file names,

If you REALLY want to take posix-compatibility to the next level, you could install [MinGW](http://www.mingw.org/wiki/InstallationHOWTOforMinGW) which includes [pacman package manager](https://wiki.archlinux.org/index.php/pacman) (from [Arch Linux](https://wiki.archlinux.org/index.php/Arch_Linux)), [makepkg](https://wiki.archlinux.org/index.php/Makepkg), and a [GNU compiler suite](https://gcc.gnu.org/) (!)

There's also a [64-bit fork called MinGW-W64](https://mingw-w64.org/doku.php)

If you're having trouble keeping track of all this, check out: [What is the difference between MinGW, MinGW-w64 and MinGW-builds?](https://stackoverflow.com/questions/25582110/what-is-the-difference-between-mingw-mingw-w64-and-mingw-builds)

I've tried both of these, and I personally didn't need to compile or install packages from arch linux often enough to keep the full suite, so I usually just stick with git-bash since it's a happy medium. But it's pretty cool that any of that is even possible. If you're a developer, the full development suite will probably be right up your alley. Apparently the applications you compile can even be used outside the shell (supposedly - although I wouldn't count on it).

Some of the tools I've found to be a bit wonky, like "find" and "du", but if you keep your expectations tempered I think you'll be pleasantly surprised. I love that I can invoke "nano" or "vim" to edit text files right in the shell so much, if nothing else worked I'd be fine with it.

Don't get me started on how happy I am with "ssh" and "openssl"...

Check out a list of the /bin directory of MingW64 - I've listed the commands I imagine people use most often on posix platforms:

```text
arch.exe*
awk.exe*
b2sum.exe*
base32.exe*
base64.exe*
basename.exe*
bash.exe*
bunzip2.exe*
bzcat.exe*
bzip2.exe*
bzip2recover.exe*
captoinfo.exe*
cat.exe*
chcon.exe*
chgrp.exe*
chmod.exe*
chown.exe*
chroot.exe*
cksum.exe*
clear.exe*
cmp.exe*
column.exe*
comm.exe*
cp.exe*
csplit.exe*
cut.exe*
cygcheck.exe*
cygpath.exe*
cygwin-console-helper.exe*
d2u.exe*
dash.exe*
date.exe*
dd.exe*
df.exe*
diff.exe*
diff3.exe*
dir.exe*
dircolors.exe*
dirmngr.exe*
dirmngr-client.exe*
dirname.exe*
docx2txt.pl*
dos2unix.exe*
du.exe*
dumpsexp.exe*
echo.exe*
env.exe*
envsubst.exe*
ex.exe*
expand.exe*
expr.exe*
factor.exe*
false.exe*
file.exe*
find.exe*
findssl.sh*
fmt.exe*
fold.exe*
funzip.exe*
gapplication.exe*
gawk.exe*
gawk-4.2.1.exe*
gdbus.exe*
gencat.exe*
getconf.exe*
getfacl.exe*
getopt.exe*
gettext.exe*
gettext.sh*
gio-querymodules.exe*
gkill.exe*
glib-compile-schemas.exe*
gobject-query.exe*
gpg.exe*
gpg-agent.exe*
gpgconf.exe*
gpg-connect-agent.exe*
gpg-error.exe*
gpgparsemail.exe*
gpgscm.exe*
gpgsm.exe*
gpgtar.exe*
gpgv.exe*
gpg-wks-server.exe*
grep.exe*
groups.exe*
gsettings.exe*
gzip.exe*
head.exe*
hmac256.exe*
hostid.exe*
hostname.exe*
iconv.exe*
id.exe*
infocmp.exe*
infotocap.exe*
install.exe*
join.exe*
kbxutil.exe*
kill.exe*
ldd.exe*
ldh.exe*
less.exe*
lessecho.exe*
lesskey.exe*
link.exe*
ln.exe*
locale.exe*
locate.exe*
logname.exe*
ls.exe*
mac2unix.exe*
md5sum.exe*
minidumper.exe*
mintty.exe*
mkdir.exe*
mkfifo.exe*
mkgroup.exe*
mknod.exe*
mkpasswd.exe*
mktemp.exe*
mount.exe*
mpicalc.exe*
msgattrib.exe*
msgcat.exe*
msgcmp.exe*
msgcomm.exe*
msgconv.exe*
msgen.exe*
msgexec.exe*
msgfilter.exe*
msgfmt.exe*
msggrep.exe*
msginit.exe*
msgmerge.exe*
msgunfmt.exe*
msguniq.exe*
mv.exe*
nano.exe*
nettle-hash.exe*
nettle-lfib-stream.exe*
nettle-pbkdf2.exe*
ngettext.exe*
nice.exe*
nl.exe*
nohup.exe*
nproc.exe*
numfmt.exe*
od.exe*
openssl.exe*
p11-kit.exe*
passwd.exe*
paste.exe*
patch.exe*
pathchk.exe*
perl.exe*
perl5.26.2.exe*
pinentry.exe*
pinentry-w32.exe*
pinky.exe*
pkcs1-conv.exe*
pldd.exe*
pluginviewer.exe*
pr.exe*
printenv.exe*
printf.exe*
ps.exe*
psl.exe*
ptx.exe*
pwd.exe*
readlink.exe*
realpath.exe*
rebase.exe*
recode-sr-latin.exe*
regtool.exe*
reset.exe*
rm.exe*
rmdir.exe*
rnano.exe*
runcon.exe*
rview.exe*
rvim.exe*
sasldblistusers2.exe*
saslpasswd2.exe*
scp.exe*
sdiff.exe*
sed.exe*
seq.exe*
setfacl.exe*
setmetamode.exe*
sexp-conv.exe*
sftp.exe*
sh.exe*
sha1sum.exe*
sha224sum.exe*
sha256sum.exe*
sha384sum.exe*
sha512sum.exe*
shred.exe*
shuf.exe*
sleep.exe*
sort.exe*
split.exe*
ssh.exe*
ssh-add.exe*
ssh-agent.exe*
sshd.exe*
ssh-keygen.exe*
ssh-keyscan.exe*
ssh-pageant.exe*
ssp.exe*
stat.exe*
strace.exe*
stty.exe*
sum.exe*
sync.exe*
tabs.exe*
tac.exe*
tail.exe*
tar.exe*
tee.exe*
test.exe*
tic.exe*
tig.exe*
timeout.exe*
toe.exe*
touch.exe*
tput.exe*
tr.exe*
true.exe*
truncate.exe*
trust.exe*
tset.exe*
tsort.exe*
tty.exe*
tzset.exe*
u2d.exe*
umount.exe*
uname.exe*
unexpand.exe*
uniq.exe*
unix2dos.exe*
unix2mac.exe*
unlink.exe*
unzip.exe*
unzipsfx.exe*
users.exe*
vdir.exe*
view.exe*
vim.exe*
vimdiff.exe*
watchgnupg.exe*
wc.exe*
which.exe*
who.exe*
whoami.exe*
winpty.dll*
winpty.exe*
winpty-agent.exe*
winpty-debugserver.exe*
xargs.exe*
xgettext.exe*
xxd.exe*
yat2m.exe*
yes.exe*
zipinfo.exe*
```
