---
title: "`nerdctl`: NTT's Gift to Humanity?"
description: "Virtual network flow chart details stunningly-performant namespace network: Bypass4NetNS I've been keeping an eye on nerdctl. While it's still a little trickier than Docker or Podman for commands to work consistently, there's fascinating innovation happening under its hood. One…"
summary: "Virtual network flow chart details stunningly-performant namespace network: Bypass4NetNS I've been keeping an eye on nerdctl. While it's still a little trickier than Docker or Podman for commands to work consistently, there's fascinating innovation happening under its hood. One…"
date: 2024-08-28T18:09:34Z
author: Avery Freeman
slug: nerdctl-ntts-gift-to-humanity
categories:
  - Random
thumbnail: https://github.com/containerd/nerdctl/blob/main/docs/images/rootlessKit-network-design.png?raw=true
thumbnail_alt: Block diagram of network design using Bypass4NetNS
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2024/08/nerdctl-ntts-gift-to-humanity/
---

<!-- Imported from WordPress post 896. -->

![Block diagram of network design using Bypass4NetNS](https://github.com/containerd/nerdctl/blob/main/docs/images/rootlessKit-network-design.png?raw=true)

*Virtual network flow chart details stunningly-performant namespace network: Bypass4NetNS*

I've been keeping an eye on `nerdctl`. While it's still a little trickier than Docker or Podman for commands to work consistently, there's fascinating innovation happening under its hood. One such innovation is `Bypass4NetNS`, the new virtual network framework used by _rootless containers_ that's \*faster\* than root kernel networking. Yes, you read that right.

And why shouldn't it be? Userspace networking shouldn't need to be complicated, should it? I mean, it's right in the name: bypass your usual cruft of unnecessary kernel infrastructure by sending packets through a network namespace. It's as beautiful as it is simple. Gotta hand it to the researchers who finally saw something we couldn't, but in retrospect should have known all along.

For more on `nerdctl`, [check out this interview](https://www.youtube.com/watch?v=LjPijo0yCUE) with its top contributer [Akihiro Suda](https://github.com/AkihiroSuda) from [NTT](https://group.ntt/en/topics/2023/11/21/cncf2023.html) published by the [RedHat Community](https://learn.redhat.com/) - it's definitely eye-opening!
