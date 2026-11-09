---
title: VMware Upgrade renders Workstation 16.2.1 useless, thanks to Houdini-like disappearance of DLLs
description: Picture depicts Houdinis as books disappearing from a library, while our problem depicts missing libraries themselves. Kinda makes you think, doesn't it? Hey, I just came across an issue many people have been experiencing after upgrading VMware Workstation to 16.2.1 in Windows.…
summary: Picture depicts Houdinis as books disappearing from a library, while our problem depicts missing libraries themselves. Kinda makes you think, doesn't it? Hey, I just came across an issue many people have been experiencing after upgrading VMware Workstation to 16.2.1 in Windows.…
date: 2022-05-21T15:11:59Z
author: Avery Freeman
slug: vmware-upgrade-renders-workstation-16-2-3-useless-thanks-to-houdini-like-disappearance-of-dlls
categories:
  - Random
thumbnail: /post-thumbnails/attachment-575.webp
thumbnail_alt: Librarian replies to man inquiring about biography of famous escape artist, "I
thumbnail_width: 480
thumbnail_height: 480
thumbnail_aspect: 1
type: post
status: publish
url: /posts/2022/05/vmware-upgrade-renders-workstation-16-2-3-useless-thanks-to-houdini-like-disappearance-of-dlls/
---

<!-- Imported from WordPress post 553. -->

![Librarian replies to man inquiring about biography of famous escape artist, &quot;I'm sorry sir, all the books about Houdini have disappeared&quot;](/wp-content/uploads/2022/05/houdini-cartoon-from-facebook-disappearing-books-cute-af-1024x1024.webp)

*Picture depicts Houdinis as books disappearing from a library, while our problem depicts missing libraries themselves. Kinda makes you think, doesn't it?*

Hey,

I just came across an issue many people have been experiencing after upgrading VMware Workstation to 16.2.1 in Windows. It looks like the installer has a bug that deletes two necessary files by accident, and their absence prevents the programs from running, beginning with `vmware-tray.exe`, which is the precursor to all things Workstation.

The lawnmowered files are two dynamic link libraries ("DLLs") responsible for encryption. Their names are `libssl-1_1.dll` and `libcrypto-1_1.dll`. Thankfully, I've managed to gather them from a reliable source and have re-packaged them for your convenience. Below is an archive containing both missing files for you to download, in hopes that you may use them to remedy this rank insipidity:

[
vmware-workstation-missing-dll-filesDownload
](/wp-content/uploads/2022/05/vmware-workstation-missing-dll-files.7z)

The organization responsible for storing and distributing DLL files such as these is named [dll-files.com, located at https://www.dll-files.com](https://www.dll-files.com) in lovely Tilf AB, Sweden. Their website offers a surprisingly painless, hassle-free download (full disclosure: no affiliation).

I actually visited a few other sites looking for these DLL files before I found dll-files.com, but all the other sites "provided" were dubious "utilities" containing code that made my antivirus software blush a deep shade of "seriously?".

Speaking of malware, everything I am providing today has been scanned with [Malwarebytes](https://www.malwarebytes.com/), the best antivirus software in the biz (full disclosure: no affiliation), which reports these DLLs, and obligatory license + attribution document, are as squeaky-clean as a newborn antelope (devouring placenta does have advantages). I installed them on my laptop, the one I'm using now, and it's been smoother sailing than vacationing on Velveeta.

Installing random files with these kinds of file names actually _can_ be a little scary, considering all the ransomware thieves who were wreaking havoc across the US a couple years ago, but legitimate programs use cryptographic libraries just often as cyber-criminals, perhaps even more. So never you be a' feared of them scary ol' names, now, their bark a' far worse than their soo-eey.

Come to think of it, in contrast to the wrath of cryptographic criminals a couple years ago, it seems that recently the media is more likely to associate "crypto" with blockchain currency. At least wealth is a more pleasant association than robbery... \<dentist office music\>

To install the files above after you download them, unzip the `.7z` file using [7zip archive software](https://www.7-zip.org/download.html), and move the two `.dll` files contained therein to the folder located at `C:\Program Files (x86)\VMware\VMware Workstation\\<files go here\>`

I used an admin command prompt to move mine, but you could just as easily open your file explorer to drag-and-drop them, I'm sure. Once Meta gets off their behinds and releases the first telekinesis controller, we'll all be able to will our files across our hard drives with sheer focus and determination, but until then it's a flail across our mice and keyboards. Sorry to remind you we're still savages with disappearing DLLs.
