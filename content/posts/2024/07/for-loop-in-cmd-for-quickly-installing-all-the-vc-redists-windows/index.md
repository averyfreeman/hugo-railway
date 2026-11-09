---
title: Quick On-The-Fly Batch Processing Using `for` Loop in `cmd` (Windows)
description: Because .bat file (amirite?) I thought I'd throw this up real quick, because I am constantly using for loops in bash during normal command traversal, but I am not as familiar about how to do them in Windows - off the top, I can recall cmd has for loops, they omit done, use paren…
summary: Because .bat file (amirite?) I thought I'd throw this up real quick, because I am constantly using for loops in bash during normal command traversal, but I am not as familiar about how to do them in Windows - off the top, I can recall cmd has for loops, they omit done, use paren…
date: 2024-07-18T03:25:42Z
author: Avery Freeman
slug: for-loop-in-cmd-for-quickly-installing-all-the-vc-redists-windows
categories:
  - Random
thumbnail: /post-thumbnails/attachment-943.webp
thumbnail_alt: Bats spilling coffee because they hang out upside down
thumbnail_width: 450
thumbnail_height: 539
thumbnail_aspect: 0.8348794063079777
type: post
status: publish
url: /posts/2024/07/for-loop-in-cmd-for-quickly-installing-all-the-vc-redists-windows/
---

<!-- Imported from WordPress post 942. -->

![Peril of bat attempting to drink coffee upside down](/wp-content/uploads/2024/07/image-23.webp)

*Because .bat file (amirite?)*

I thought I'd throw this up real quick, because I am constantly using `for` loops in `bash` during normal command traversal, but I am not as familiar about how to do them in Windows - off the top, I can recall `cmd` has `for` loops, they omit `done`, use `parens` and `%` in place of `squee-bracks` and `$`, but still have to look up syntax basically every time. I'm sure Powershell is more powerful, being a _real_ programming language, and all, (and MacOS is certified Unix), but also quite a bit more verbose, even if it's _less weird-looking than_ `bash`. Through my own experience, I've a theory that terminal-dwellers, more often than not, have `shell` Stockholm syndrome for the one who brought them to the dance, regardless if they're puking peppermint schnapps while being noticeably hands-y in public. And even if it tended to leave us utterly mortified in the beginning, it's Christmas cane sexual predation vomit we intuitively manage.

So anyway, when I'm tired of invoking `get-help` for every command while using Windows, I'm quick to scrap the _real programming language_ of `pwsh` for bizarre, old `cmd`, because its comparable legacy bonkers makes me feel more at home. As long as my feelings don't grow _too_ complex for you, _`cmd`,_ we'll get by with your `start`, and `shell`, and `REM`, which still makes no sense to me to this day, and that's just fine. There's that `@ECHO OFF` thing, which is _totally_ unintuitive - I mean, gosh, how is anyone supposed to guess what _that_ does? I'll never know. And **your fucking forward slashes drive me up a wall**, but it's still ok, because you don't speak in complete sentences, and _that's_ just **too weird**, even for me.

Ahem. The `vcredists-all` package in the chocolatey repo appeared broken some time ago while I was bootstrapping a new machine that was light on runtimes since it was, well ... new, so I set out on a clandestine mission to find `for`\-loop bliss, with `cmd` as the caretaker, executing all vc runtime installers I amassed manually in a satisfyingly automated succession.

[I visited the official Microsoft site with all the VC Redistributable packages](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) and mouse-fondled the ones marked explicitly not deprecated. Thankfully, they were easy to find, since this story is definitely not about stretching one's imagination. As of the time I write about, there were 8 in total between `x86` and `x86_64` (or, `win32` and `WoW64`, I believe, is the Microsoft vernacular. God, they're weird).

I proceeded to rename them to uniqueness with the familiar and irritatingly manual `F2` keypresses in explorer, since I'd wound up with only `vc_redist (n).exe` -named files through the download process (_thanks, Internet Explorer)_. I'd already forgotten that `ren` is `CMD`\-speak for `mv`, and since help documents were beyond my effort level, I opted for the click-bait of the graphical user interface I would otherwise take pains to avoid. Perhaps this renaming step was onerous and unnecessary, given I was assuredly set to delete them after tumbling about together in the bushes, but, as my grandmother used to tell me, hindsight _always_ keeps one from prison.

I dared not leave whitespace characters in a single one of the filenames, but since I'd made each unique, it's possible my concern was overblown specifically by a set double-quotes. If you have `Save As` set in your browser, you could save each file with a unique name after download, and ensure they exist peacefully in a single folder hierarchy.

![Bat file needs saving](/wp-content/uploads/2024/07/image-24-300x289.webp)

*.bat so silly*

Then, I extrapolated `dir` to list `vc_redist*.exe` files singly with a wily `/B` flag. It's not that `dir` was acting brash, but its option flag, _"bare listing"_, is undeniably suggestive. Apparently _bare_ in this context is _without extra information_, and each filename being listed on its own line, like our tragically gone, but not forgotten, `$(ls -1)`. I mustered the strength not to cry for my loss, and choke-blathered the expression:

```bat
C:\User\Downloads> for %i in (vc*.exe) do cmd /c %i
```

Like a miracle, it opened each runtime installer, one by one, without any additional intervention - that is, if you don't count all the irritating graphical requests for interaction for which Windows is so famous, and me cursing myself for forgetting those damn installer packages often have automation-friendly command-line options.

Yay, as I write this, I feel the true curse of the computer user: The labor-saving device I imagined whisking me away to an easier life was probably far more laborious than clicking on each installer icon, especially considering the file renaming step born out of fright similarity or whitespaces would doom my working twice as hard for half the reward to failure.

But, I must say, the short, taudry escapade of `cmd`\-syntax `for` loop lustiness gave me the sense estranged lovers often feel returning home, such as "why on earth did I do that?", and "what in god's name was I thinking?", inevitably landing on an unconvincing resolve of, "If I hadn't done it, I'd never know."

And, serious apologies: Next time I have the unfortunate occasion to use a Windows machine, I'll be sure to figure out how to create less dialog.
