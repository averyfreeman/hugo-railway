---
title: Burn AKAI format Sample CDs (SCD / AKAiSO) from images on a Mac - works with EMU, ROLAND, KURTZWEIL, etc. too!
description: Hey, So perhaps you've figured out that AKAI, EMU, ROLAND, KURTZWEIL sample CD images can't be read on a Mac, can't be mounted on a Mac, and can't be burned on a Mac with the usual included utilities like diskutil or hdiutil, But you'd still like be able to burn your sampler's C…
summary: Hey, So perhaps you've figured out that AKAI, EMU, ROLAND, KURTZWEIL sample CD images can't be read on a Mac, can't be mounted on a Mac, and can't be burned on a Mac with the usual included utilities like diskutil or hdiutil, But you'd still like be able to burn your sampler's C…
date: 2012-02-01T12:59:00Z
author: Avery Freeman
slug: burn-akai-format-sample-cds-scd-akaiso-from-images-on-a-mac-works-with-emu-roland-kurtzweil-etc-too
categories:
  - Random
thumbnail_alt: Burn AKAI format Sample CDs (SCD / AKAiSO) from images on a Mac - works with EMU, ROLAND, KURTZWEIL, etc. too!
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2012/02/burn-akai-format-sample-cds-scd-akaiso-from-images-on-a-mac-works-with-emu-roland-kurtzweil-etc-too/
---

<!-- Imported from WordPress post 40. -->

Hey,  
  
So perhaps you've figured out that AKAI, EMU, ROLAND, KURTZWEIL sample CD images can't be read on a Mac, can't be mounted on a Mac, and can't be burned on a Mac with the usual included utilities like diskutil or hdiutil,  But you'd still like be able to burn your sampler's CD images without the hassle of emulating a PC to use raw CD burning software.  
  
If you want to save some cash on buying programs to do this for you, [Macports](http://www.macports.org/) or [Homebrew](http://mxcl.github.com/homebrew/) really come in handy.   Use either one to install a UNIX utility called '[cdrdao](http://cdrdao.sourceforge.net/)' by opening a Terminal window and invoking the command:  
  
brew install cdrdao  
  
(homebrew), or  
  
sudo port install cdrdao  
  
(macports)  
  
Then, once cdrdao is installed, change it to the directory of your Akai CD image.  If you're using a .bin/.cue file image you can burn your CD simply by using the following command:  
  
cdrdao write image\_name.cue  
  
Where "image\_name" is obviously replaced with the name of your image file.  Also, the .bin and .cue files have to be in the same location.  
  
If you're using a .iso file, it's not that much more difficult.  Just create a .toc file by typing:  
  
nano image\_name.toc  
  
Once in the Nano text editor, enter the following text:  
  
CD\_ROM  
  
  
TRACK MODE1  
DATAFILE "image\_name.iso"  
  
 Making sure to preserve the quotes in the example - they're necessary for the .toc file - but again, replacing "image\_name" with the name of your Akai disk image.  
  
Hit CTRL-X to exit, and hit 'Y' for yes to save, and then type:  
  
cdrdao write image\_name.toc  
  
For an iso file, you may need to add the --driver generic-mmc-raw option, by typing:  
  
cdrdao write --driver generic-mmc-raw image\_name.toc  
  
But I would recommend you try burning your CD without it at first.  Then try it if you get an "ERROR: Drive does not accept any cue sheet variant" response.  
  
If you're having trouble getting these commands to work, you may want to check to make sure your CD-R drive is ready by typing:  
  
cdrdao scanbus  
  
If you wish to use a different drive than the one automatically mapped by cdrdao, or other features, check out the [cdrdao manual page](http://linux.die.net/man/1/cdrdao), or type 'man cdrdao' at your terminal prompt.  
  
An additional tip:  You can use diskutil (GUI) to eject your disk even if it is not showing up in the finder (as Akai SCDs don't show up anywhere in the finder since they can't be mounted by the Mac file system).  
  
\----------------------------------------------------------------------------------------------------------------------------------  
Using Toast to burn Sampler-format CDs:  
  
Note -- If you want to go the pay software route, you CAN use Toast.   It's DEFINITELY easy, but I don't think it's as fun ;)  Here's how:  
  
1) Open Toast and go to disc copy  
  
2) De-select 'fit-to-DVD video compression'  
  
3) Choose image file you want to burn  
  
Toast will prompt you saying that it doesn't know what format the image file is.  I'm guessing you're certain you want to burn the disc, so choose "continue"  
  
4) use '0' for both pre and post gap, and '2048' for sector size  
  
5) Hit the ominous red button in the bottom left hand of the window  
  
Jolly burning!
