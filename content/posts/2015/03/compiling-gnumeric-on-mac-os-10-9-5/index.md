---
title: Compiling Gnumeric on Mac OS 10.9.5
description: "Note: This guide below has been depreciated - now you can just install macports and run: It still installs some xorg dependencies but it links them to the cocoa interface Compiling Gnumeric on Mac OS 10.9.5 using Cocoa instead of X11 Note: No X11 was used in the installation of…"
summary: "Note: This guide below has been depreciated - now you can just install macports and run: It still installs some xorg dependencies but it links them to the cocoa interface Compiling Gnumeric on Mac OS 10.9.5 using Cocoa instead of X11 Note: No X11 was used in the installation of…"
date: 2015-03-04T21:13:00Z
author: Avery Freeman
slug: compiling-gnumeric-on-mac-os-10-9-5
categories:
  - Random
thumbnail: /post-thumbnails/post-32.webp
thumbnail_alt: Compiling Gnumeric on Mac OS 10.9.5
thumbnail_width: 480
thumbnail_height: 278
thumbnail_aspect: 1.7266187050359711
type: post
status: publish
url: /posts/2015/03/compiling-gnumeric-on-mac-os-10-9-5/
---

<!-- Imported from WordPress post 32. -->

Note: This guide below has been depreciated - now you can just install macports and run:

```text
$ sudo port install gnumeric +quartz
```

It still installs some xorg dependencies but it links them to the cocoa interface

[![](/wp-content/uploads/2015/03/gnumeric_mac.webp)](/wp-content/uploads/2015/03/gnumeric_mac.webp)

## Compiling Gnumeric on Mac OS 10.9.5 using Cocoa instead of X11

_**Note:  No X11 was used in the installation of this Gnumeric port!  While you may be instructed to install [XQuartz](http://en.wikipedia.org/wiki/XQuartz) at some point during your MacPorts experience, it is NOT necessary for this particular package (if you follow the instructions properly).**_  

Hi everybody,

So, if you know anything about \*NIX spreadsheet programs, or you are a hardcore statistics nerd, you are probably familiar with [Gnumeric](http://en.wikipedia.org/wiki/Gnumeric).

I like to run several operating systems, and one of my favorite is Mac OS.  But I like Gnumeric quite a bit and there's never been an installer package for a native port of Gnumeric for Mac OS as far as I know.

There IS a how-to on how to compile Gnumeric using MacPorts, though!  However, it's a little outdated:

[Open Source Packages for the Macintosh](https://www.flyn.org/notes/apple/index.html) 

I was really glad to see this as a starting place, as it has some info about how to use flags when porting software to compile in Quartz instead of X11 (thus, to avoid the nasty X11 interface and stay more over-all "Mac-Looking")

Following the directions on the site did not work for me, however -- so here's an update to help people with more modern Mac OS versions (I did this under Mac OS 10.9.5 Mavericks with MacPorts 2.3.3).

[MacPorts Quickstart Guide](https://www.macports.org/install.php)

Installing and using MacPorts is beyond the scope of this article, but it's not too hard to do - just make sure you have the latest (or most appropriate) version of Xcode, including the command-line tools.  you can check to see if you have the Xcode command line tools by opening a terminal, and invoking the command:

$ gcc  
  
  
After a brief pause, you should see the following:

clang: error: no input files

So far, so good!  So now, install MacPorts using the Quickstart guide link provided above, and you should be in business.

After you've installed MacPorts, you're going to need to install some dependencies. Go to the terminal prompt again and type:

$ sudo port install -v cairo +quartz+no\_x11

You should see MacPorts downloading and installing the cairo package on your behalf.  I like to use the -v flag so it returns a little more information, but it's not necessary.

The +quartz+no\_x11 flags are to tell the packages to build such that they do not need to use XQuartz (which, should be rather important since you probably don't have it installed!  X11 is not included by default on Mac OS versions released after Mountain Lion). 

If that all worked properly, next we're going to want to install some more dependencies.  Go back to your prompt and invoke the following:

$ sudo port uninstall -f pango

We're going to remove pango since it has been installed using X11 dependencies.  You cannot install pango using the +quartz+no\_x11 flags unless this package has been uninstalled, and to make it uninstall without removing its dependencies (a hassle), you use the \-f flag to force the uninstall. 

Now that pango's been removed, let's re-install it using our +quartz+no\_x11 flags, by invoking:

$ sudo port install -v pango +quartz+no\_x11

There, now pango's been installed the way we would like!  Using Quartz, instead of X11.  

Now do the same for [GTK3](http://en.wikipedia.org/wiki/GTK%2B) -- remove it by invoking the following:

$ sudo port uninstall gtk3

That will get rid of the X11-dependent gtk3 engine, so we can re-install it with Quartz dependencies, by invoking, yep - you guessed it:

$ sudo port install -v gtk3 +quartz+no\_x11

Starting to get the idea?  We're making sure this Gnumeric install is going to be dependent on Quartz, and not X11 -- so it's got the most Mac-like appearance.  

Now let's go back to the prompt and install two more dependencies before building Gnumeric.  Go to your prompt and invoke:

$ sudo port install -v poppler +quartz+no\_x11 

to install [Poppler](https://www.macports.org/ports.php?by=name&substr=poppler), which is used to render PDFs inside Gnumeric, and

$ sudo port install -v gnome-themes-standard +quartz+no\_x11 

Which is necessary for installing adwaita-icon-theme, icon-naming-utils and other appearance-related dependencies.  

Note:  This package installs [GTK2](http://en.wikipedia.org/wiki/GTK%2B), as well, but since we invoked the install it should be compiled with the same  +quartz+no\_x11 flags as its parent.

Now that you've got the dependencies installed, now it's time to compile Gnumeric!

$ sudo port install -v gnumeric +quartz+no\_x11

Doesn't take that long compared to the GTK+ packages that you installed earlier.  After it's done compiling, invoke:

$ gnumeric

to give it a spin!

OK, now if it's working, here's a quick-and-dirty way to create a link so that you can open it via an icon.

Go back to your terminal and invoke:

$ ln -s /opt/local/bin/gnumeric /Applications/Gnumeric  
  
  
Navigate to your Applications folder via the Finder and you should see a blank icon named "Gnumeric".

Double click on the icon, and you should be prompted with a dialog asking you to choose an application to run the program with.   Select the option to choose the program, then select the Terminal as the program to run it with (under /Applications/Utilities/Terminal).

Now when you double-click on this icon it should run Gnumeric for you without having to enter the terminal.

Alternately, you can create an _alias_ instead of a link, by invoking:

$ osascript -e 'tell application "Finder"' -e 'make new alias to file (posix file "/opt/local/bin/gnumeric-1.12.20") at desktop' -e 'end tell'  
  
  
This does NOT require the step of having to choose the terminal to run it with.  Now the Gnumeric alias will be on your desktop.  You may rename it and move it wherever you like (e.g. the Applications folder).   
  
  
  
Any questions or comments to improve this post are immensely appreciated!  Please leave a post!  Thank you!

Note: I've noticed some of the functions, such as creating check boxes, radio buttons, and lists, do not work and actually crash the program.  I am not sure if these would work in the X11-compiled version, as I have not tried it in a number of years.  Please submit your comments regarding whether or not you have compiled Gnumeric on a Mac using X11, and if these functions work properly in that version.  Also, if you have any ideas of how to fix these functions, I'd be more than happy to hear them!
