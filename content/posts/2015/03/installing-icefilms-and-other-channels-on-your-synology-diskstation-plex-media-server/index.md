---
title: Installing IceFilms (and other) Channel(s) on your Synology DiskStation Plex Media Server
description: So, have you been looking for the IceFilms channel plug-in for your Synology DiskStation, but only seen Windows and Mac OSX referenced for install methods on the sites you've visited? Well, look no further! I installed IceFilms on my Synology DiskStation tonight (which, in reali…
summary: So, have you been looking for the IceFilms channel plug-in for your Synology DiskStation, but only seen Windows and Mac OSX referenced for install methods on the sites you've visited? Well, look no further! I installed IceFilms on my Synology DiskStation tonight (which, in reali…
date: 2015-03-09T05:51:00Z
author: Avery Freeman
slug: installing-icefilms-and-other-channels-on-your-synology-diskstation-plex-media-server
categories:
  - Random
thumbnail: /post-thumbnails/post-31.webp
thumbnail_alt: Installing IceFilms (and other) Channel(s) on your Synology DiskStation Plex Media Server
thumbnail_width: 480
thumbnail_height: 258
thumbnail_aspect: 1.8604651162790697
type: post
status: publish
url: /posts/2015/03/installing-icefilms-and-other-channels-on-your-synology-diskstation-plex-media-server/
---

<!-- Imported from WordPress post 31. -->

![](/wp-content/uploads/2015/03/icefilms1.webp)

So, have you been looking for the IceFilms channel plug-in for your Synology DiskStation, but only seen Windows and Mac OSX referenced for install methods on the sites you've visited?

Well, look no further!

<!-- more -->

I installed IceFilms on my Synology DiskStation tonight (which, in reality, is a server I built running XPEnology, but on a software/OS-level, it isn't any different than a DSM x86 unit).

It appears to be working without a hitch!  I know you've probably been dying to install IceFilms (as I know I was!), so I thought I should probably share how to do it:

**Assumptions:**

1) You know a little bit about how to navigate using a UNIX-style command line interface.  
2) You have SSH enabled on your NAS.  If you don't, [please visit this site to find out how](http://forum.synology.com/wiki/index.php/Enabling_the_Command_Line_Interface).  
3) You have a method of connecting to your SSH-enabled NAS, [such as using PuTTY for Windows](http://internal.math.arizona.edu/services/computing/remote-access/shell/putty), or the [Terminal in Mac OS](http://mac.appstorm.net/how-to/utilities-how-to/how-to-use-terminal-the-basics/) or Linux.  [Download PuTTY HERE.](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)  
4) You have the Plex Media Server package installed on your Synology DiskStation NAS.  If you need to install it on your NAS, [please download the latest version here and install it manually](https://plex.tv/downloads) as this is the best way to ensure that the package is up-to-date.  (To do this, you may have to allow plug-ins from any source in your Synology Package Manager).

**Quick guide for less techincally-inclined readers:**   \*Confirmed working!\* The easiest way to do this is to download the zip and rename IceFilms.bundle-master to IceFilms.bundle move it to your Plex Media Center Plug-Ins directory, and re-start your Plex Server.  Here's a quick walk-through:

Step one:  Navigate to the Git repository for the IceFilms.bundle package:

[Embedded content](https://github.com/ReallyFuzzy/IceFilms.Bundle)

![](/wp-content/uploads/2015/03/icefilms1_0.webp)

Step two: Click on "Download ZIP" at the bottom-right corner of the page.  Unzip this and it will give you a folder called IceFilms.bundle-master

![](/wp-content/uploads/2015/03/icefilms2.webp)

Step three:  Rename the IceFilms.bundle-master folder to IceFilms.bundle and copy it to your synology diskstation.  We'll use /volume1/home/ as an example.

![](/wp-content/uploads/2015/03/icefilms3.webp)

Plex user folder, under the path:  /volume1/Plex/

Step four:  After copying the IceFilms.bundle package to your home folder, open your terminal and navigate to your server by typing ssh root@(server address):

![](/wp-content/uploads/2015/03/icefilms5.webp)

Quick tip:  Log to Synology SSH using your admin password.

Navigate to your home directory (e.g. /volume1/homes/username/ ) and move the .bundle file to the Plex Library folder:

NA$ mv /volume1/homes/avery/IceFilms.bundle/ /volume1/Plex/Library/Application Support/Plex Media Server/Plug-ins/

Notes: You can hit "tab" in most terminals to auto-complete the name of a directory.  The forward-slash indicates that there is a space in the name of the path or file.

Step five:  Navigate to your Synology DiskStation manager in your browser and open Package Center.  Navigate to your installed packages and click on Plex Media Server.  Under the Actions drop-down menu, choose "Stop".  Then click the Actions menu again and choose "Run".

![](/wp-content/uploads/2015/03/icefilms4.webp)

Now, if all went well, you should be able to go to your Plex Media Center in your browser, or Plex Media Theater, etc. and see "IceFilms" as one of your channels.

![](/wp-content/uploads/2015/03/icefilms6.webp)

It's as simple as that!

TIP:  Look in ReallyFuzzy's GitHub page to find other plug-ins, as well!

**Now, here's the more involved method I used (I can personally verify that both of these methods work):**

Caveats: This more complicated guide is only useful for those who  
1) Have an interest in obtaining and installing bootstrapper and ipkg package management functionality for their Synology DiskStation  
2) Have an interest in having Git clone functionality for their Synology DiskStation

_If neither of these apply to you, I suggest you just follow the easy guide above!_

Install Git on your Synology NAS by using ipkg.  This will enable the ability to get the latest build of the IceFilms.bundle file required for the IceFilms Plex Media Server channel.

Note:  installing and using the ipkg package management infrastructure is beyond the scope of this post.  To learn more about using a bootstrapper and ipkg on your system, please visit:

[http://forum.synology.com/wiki/index.php/Overview\_on\_modifying\_the\_Synology\_Server,\_bootstrap,\_ipkg\_etc](http://forum.synology.com/wiki/index.php/Overview_on_modifying_the_Synology_Server,_bootstrap,_ipkg_etc)

I also found this forum post helpful (note the post by "LittleLama"):

[http://xpenology.com/forum/viewtopic.php?f=2&t=2564](http://xpenology.com/forum/viewtopic.php?f=2&t=2564)

I prefer using Nano to VI, which you can install using ipkg prior to doing the steps explained in the link above for editing your configuration files.  Also, I prefer using the command EXPORT for setting the env for the ipkg path, rather than rebooting to acquire the PATH variable (as recommended in the LittleLama post I referenced).

Try it by entering the following and you should be able to run ipkg from anywhere:

NA$ export PATH=/opt/bin:/opt/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/syno/bin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/syno/bin:/usr/syno/sbin:/usr/local/bin:/usr/local/sbin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/syno/bin:/usr/syno/sbin:/usr/local/bin:/usr/local/sbin  
  
  
Note: I am using NA$ to signify the command prompt, as the "less-than" sign is not displayed in blogger - you will see a "less than" sign at the end of your server name for the display of your command prompt of your NAS.  
  
  
If you use export, you do \*not\* need to reboot in order to use ipkg.  Then invoke:  
  
NA$ ipkg update   
  
And  
  
NA$ ipkg upgrade  
  
  
Install Bash for a more familiar command line interface:  
  
NA$ ipkg instal bash  
  
then run it by invoking:  
  
NA$ bash  
  
  
Now you will see the # sign as your command prompt, which signifies that you have root access (note - you already HAD root access, but this is the more common convention seen in \*NIX OS).  
  
Add a couple lines to your to log-in with Bash next time you SSH to the server by invoking:  
  
\# nano /etc/profile  
  
and adding a line that says the following:  
  
\[ -e /opt/bin/bash \] && /opt/bin/bash  
  
  
Also add the line  
  
PATH=$PATH:/opt/bin:/opt/sbin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/syno/bin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/syno/bin:/usr/syno/sbin:/usr/local/bin:/usr/local/sbin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/syno/bin:/usr/syno/sbin:/usr/local/bin:/usr/local/sbin  
  
to avoid having to "export PATH=" next time you log-in --- make sure you delete any other references to PATH in this file (There was one at the end of mine).   
  
Quick tip:  You can also have Bash show you the current directory you're in by invoking:  
  
\# nano /root/.bashrc  
  
and adding a line that says  
  
PS1='w$ '  
  
  
Bind the /volume1/@optware directory to your /opt folder:

\# nano /etc/fstab  
  
  
Add the following:  
  
/volume1/@optware /opt none defaults,bind 0 0

Exit by pressing CTRL-X and save changes.

And permit a user environment in your /etc/sshd\_config

\# nano /etc/ssh/sshd\_config

Find the line that says #PermitUserEnvironment no by pressing CTRL-W and typing in part of the string.  Uncomment it by removing the # sign and enable it by changing no to yes.  Exit by pressing CTRL-X and save changes.

Restart SSHD

# synoservicectl --reload sshd

And you should be good to go!

Now for the fun stuff!

Log back into your DiskStation using SSH (same as above)

Install Git by using Ipkg to download the package:

\# ipkg install git

Navigate to the Plex Plug-ins directory by invoking:  
  
\# cd /volume1/Plex/Library/Application Support/Plex Media Server/Plug-ins/  
  
  
Then clone the IceFilms.bundle file by invoking:   
  
\# git clone https://github.com/ReallyFuzzy/IceFilms.bundle.git  
  
Note: You can copy the URL from the bottom-right corner of the github page:

[Embedded content](https://github.com/ReallyFuzzy/IceFilms.Bundle)

Verify that the IceFilms.bundle file has been copied by invoking:

\# ls

You should see IceFilms.bundle listed amongst the other plug-ins (.bundle files) in your plug-ins directory.

Now go to your DSM home page and open "Package Center".  Navigate to your installed packages and click on Plex Media Server.  Under the Actions drop-down menu, choose "Stop".  Then click the Actions menu again and choose "Run".

Navigate to your Plex Media Center and look at your channels.  You should see that IceFilms has been installed.  
  
**This is the best way to install plug-ins to Plex on your Synology DiskStation, as now you can simply invoke # git clone \[URL\] to clone any package you want!  Just don't forget that you have to restart your Plex Media Server before using the new plug-ins.**

Any questions?  Want any further explanations?  Please leave a comment!

Thanks for reading!
