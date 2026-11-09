---
title: Do you use both Visual Studio Code and Sublime Text 3?
description: If so, wouldn't you like both their keyboard shortcuts to be consistent? I personally am using both Visual Studio Code and Sublime Text 3 on my main dev laptop. Once I got used to all the nice features in a pseudo-IDE text editor like VS Code, it became hard to go back to editin…
summary: If so, wouldn't you like both their keyboard shortcuts to be consistent? I personally am using both Visual Studio Code and Sublime Text 3 on my main dev laptop. Once I got used to all the nice features in a pseudo-IDE text editor like VS Code, it became hard to go back to editin…
date: 2021-08-24T09:41:02Z
author: Avery Freeman
slug: do-you-use-both-visual-studio-code-and-sublime-text-3
categories:
  - Random
thumbnail: https://i.ytimg.com/vi/_nu2_Rb6Wd8/maxresdefault.jpg
thumbnail_alt: Stripe Elements with Laravel (and Vue) - YouTube
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2021/08/do-you-use-both-visual-studio-code-and-sublime-text-3/
---

<!-- Imported from WordPress post 527. -->

![Stripe Elements with Laravel (and Vue) - YouTube](https://i.ytimg.com/vi/_nu2_Rb6Wd8/maxresdefault.jpg)

If so, wouldn't you like both their keyboard shortcuts to be consistent?

I personally am using both Visual Studio Code and Sublime Text 3 on my main dev laptop. Once I got used to all the nice features in a pseudo-IDE text editor like VS Code, it became hard to go back to editing things like `.conf` files in editors like `vim` and `notepad`. Wrapping text with parenthesis, quotes or brackets, simply by highlighting the word and hitting the opening character is probably my favorite feature, but things like duplicating lines, moving lines up and down, etc. are all very nice ways to save some time.

However, once my VS Code setup had enough formatting extensions like `Prettier`, or other handlers for package managers like `npm`, version control with `git`, `color manager`, `gistpad`, `python`, `markdown parser`, `:emoji sense:`, etc. etc. load times have gotten longer, and the editor feels less up to the task of opening a little `.conf` or `.sh` file just to do a little revision.

That's where Sublime Text comes in. For one thing, _it's smaller_. The fact that it doesn't take up as much room on my screen makes it much more convenient for basic text-editing tasks. It also loads faster without so many plugins (I try to keep it down to only one or two). But it still has essentially all of the really awesome interactive qualities of VS code.

The only thing that ever really irks me is when I try to do something the way I'm used to in vscode with the keyboard and it does something else, or doesn't work at all.

Luckily, when the keyboard shortcuts are inconsistent, ST3 is _really_ easy to extend. I've forked a GitHub user's keyboard shortcuts who started mapping ST3's keyboard mapping and added a few of my own - for example, `alt+z` for enabling word wrap didn't even have a keyboard shortcut in ST3, but now it can (!).

![](/wp-content/uploads/2021/08/image.webp)

Whenever I run into another inconsistency, I'll add it and push it to GH. If you'd like to see (or use) it, it's located here: [https://github.com/averyfreeman/vscode-keybindings-for-sublime](https://github.com/averyfreeman/vscode-keybindings-for-sublime)
