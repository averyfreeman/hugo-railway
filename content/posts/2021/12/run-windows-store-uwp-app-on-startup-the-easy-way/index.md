---
title: Run Windows Store (UWP) App on Startup - the EASY way
description: "TL;DR: drag the icon from the shell:AppsFolder over to the shell:startup folder! I am building a dedicated TV viewing VM for HDHomeRun View using Windows IoT 2021 LTSC, so I can watch TV while using a computer running Linux with the smallest possible KVM-QEMU VM I can possibly p…"
summary: "TL;DR: drag the icon from the shell:AppsFolder over to the shell:startup folder! I am building a dedicated TV viewing VM for HDHomeRun View using Windows IoT 2021 LTSC, so I can watch TV while using a computer running Linux with the smallest possible KVM-QEMU VM I can possibly p…"
date: 2021-12-24T15:42:59Z
author: Avery Freeman
slug: run-windows-store-uwp-app-on-startup-the-easy-way
categories:
  - Random
thumbnail: /post-thumbnails/attachment-541.webp
thumbnail_alt: Run Windows Store (UWP) App on Startup - the EASY way
thumbnail_width: 480
thumbnail_height: 323
thumbnail_aspect: 1.4860681114551084
type: post
status: publish
url: /posts/2021/12/run-windows-store-uwp-app-on-startup-the-easy-way/
---

<!-- Imported from WordPress post 540. -->

![](/wp-content/uploads/2021/12/vmware_Lyq4pXg5Ay.webp)

*TL;DR: drag the icon from the shell:AppsFolder over to the shell:startup folder!*

I am building a dedicated TV viewing VM for HDHomeRun View using Windows IoT 2021 LTSC, so I can watch TV while using a computer running Linux with the smallest possible KVM-QEMU VM I can possibly put together. That's because, unfortunately, the app I have to use is only available in Windows, and _only through the Windows Store on top of that_, which in the past has created an additional layer of potential configuration difficulties due to app sandboxing, obscured location paths, etc.

Well, thankfully starting UWP apps (also called "Windows Store" apps, but herein will be referred to as UWP apps) have gotten a lot easier in newer versions of Windows. I'm not actually sure of this because I haven't looked into any changelogs detailing new Windows shell or explorer features, but I'm assuming because I've gone through all sorts of trouble to get them to start up automatically in the past (this HDHomeRun one in particular), but now it seems ridiculously easy given what I had previously gone through.

I was reading through [this article on how to start a UWP app on startup](https://www.howtogeek.com/364263/how-to-open-windows-store-apps-on-startup-in-windows-10) from HowToGeek.com. It's a good article with lots of interesting points, but it seemed unnecessarily difficult to me. Between it, and [this question answered on superuser.com](https://superuser.com/questions/1540101/windows-10-webstore-apps-how-do-i-run-them-in-a-batch-file), I came up with the easiest possible way to start a UWP app on startup.

-   In Windows File Explorer (the manilla folder icon), type `shell:AppsFolder` in the location bar and hit enter. This will bring up a list of icons, "regular" Windows applications in addition to UWP (store) apps.
-   Navigate through the icons until you find the UWP app you're looking for.
-   In a separate Explorer window, type `shell:startup` and hit enter.
-   Drag the UWP app you want to start during startup into the `shell:startup` folder. It might ask you if you want to create a shortcut in that folder (hit yes).
-   Log out and back in to make sure it worked.

This worked for me on the first try. The hardest thing I did was remove the `- shortcut` string that was auto-appended to the icon. It really doesn't get much easier than that.

In the past, I'd gone through all sorts of trouble figuring out which folder holds the app - they're all in a hidden folder `C:\Program Files\WindowsApps` with folders named things like `EF712BA7.HDHomeRunDVR_1.1.345.0_x64__23nna27hyxhag` only accessible from administrative shell, isn't that fun? - getting the application name and path from the `AppManifest.xml` file, and then creating a batch file for the startup script for the UWP app to be started with `C:\Windows\System32\cmd.exe /C:`, etc.

As I said, I'm not sure if using UWP apps is just getting easier on newer versions of Windows, but this is pretty darn convenient. If I was just doing something unnecessary in the past, it sure was a lot of trouble.

If you're interested in running Windows Store for the apps you can't find anywhere else on LTSC, check out this github repo - says last updated 3 years ago, but the script has worked for me on newer versions of LTSC for me just fine: [https://github.com/kkkgo/LTSC-Add-MicrosoftStore](https://github.com/kkkgo/LTSC-Add-MicrosoftStore)
