---
title: Using BinChunker to convert .BIN/.CUE CD/DVD images to .ISO on a Mac
description: Binchunker is a great command-line utility for converting .bin and .cue format cd-rom backups to .iso format for easy mounting / burning. It also has a .raw and .wav conversion functions for use with video and audio disk images. I've primarily been using it for converting video…
summary: Binchunker is a great command-line utility for converting .bin and .cue format cd-rom backups to .iso format for easy mounting / burning. It also has a .raw and .wav conversion functions for use with video and audio disk images. I've primarily been using it for converting video…
date: 2012-01-25T04:56:00Z
author: Avery Freeman
slug: using-binchunker-to-convert-bin-cue-cd-dvd-images-to-iso-on-a-mac
categories:
  - Random
thumbnail_alt: Using BinChunker to convert .BIN/.CUE CD/DVD images to .ISO on a Mac
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2012/01/using-binchunker-to-convert-bin-cue-cd-dvd-images-to-iso-on-a-mac/
---

<!-- Imported from WordPress post 44. -->

Binchunker is a great command-line utility for converting .bin and .cue format cd-rom backups to .iso format for easy mounting / burning.  It also has a .raw and .wav conversion functions for use with video and audio disk images.  
  
I've primarily been using it for converting video and sample CD (.VCD and SCD) images I've downloaded off the web, using the -r (.RAW) and -w (.WAV) flags for video and audio conversion.  
  
Installing binchunker on a mac ---  
  
This post assumes you have homebrew installed.  Find out how to install it here:  
  
[http://mxcl.github.com/homebrew/](http://mxcl.github.com/homebrew/)  
  
Once homebrew is installed, type:  
  
brew -v install chunk  
  
The '-v' is optional, it gives you more feedback about the compile process.  
  
Then to use binchunker, type:  
  
bchunk -v infile.bin infile.cue outfile  
  
the '.iso' extension will automatically be appended to your 'outfile' name.  
  
For reference, the bchunk executable is installed in this path:  
  
/usr/local/Cellar/bchunk/(version#)/bin  
  
Happy chunking!
