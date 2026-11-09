---
title: Add podman controller to cockpit on Ubuntu 20.04 LTS
description: I am heartened to see podman becoming more comfortable on Ubuntu, since although I'm excited about a lot of the software coming from RHEL's massive portfolio of acquisitions, I still prefer Ubuntu's support length and update schedule, and find its commands and structure more fam…
summary: I am heartened to see podman becoming more comfortable on Ubuntu, since although I'm excited about a lot of the software coming from RHEL's massive portfolio of acquisitions, I still prefer Ubuntu's support length and update schedule, and find its commands and structure more fam…
date: 2020-06-27T10:16:03Z
author: Avery Freeman
slug: add-podman-controller-to-cockpit-on-ubuntu-20-04-lts
categories:
  - Random
thumbnail: https://res.cloudinary.com/practicaldev/image/fetch/s--t74saXlg--/c_imagga_scale,f_auto,fl_progressive,h_1080,q_auto,w_1080/https://dev-to-uploads.s3.amazonaws.com/i/nym5icr1ntmpvxlzbj62.png
thumbnail_alt: Scripting Containers With No Daemons using Podman - DEV Community
thumbnail_width: 480
thumbnail_height: 270
thumbnail_aspect: 1.7777777777777777
type: post
status: publish
url: /posts/2020/06/add-podman-controller-to-cockpit-on-ubuntu-20-04-lts/
---

<!-- Imported from WordPress post 324. -->

![Scripting Containers With No Daemons using Podman - DEV Community](https://res.cloudinary.com/practicaldev/image/fetch/s--t74saXlg--/c_imagga_scale,f_auto,fl_progressive,h_1080,q_auto,w_1080/https://dev-to-uploads.s3.amazonaws.com/i/nym5icr1ntmpvxlzbj62.png)

I am heartened to see `podman` becoming more comfortable on Ubuntu, since although I'm excited about a lot of the software coming from RHEL's massive portfolio of acquisitions, I still prefer Ubuntu's support length and update schedule, and find its commands and structure more familiar.

But what about the accessories that are available for `podman`? Would installing it on Ubuntu make it like a fish out of water?

Thankfully, no! `buildah` is also available in the offical `podman` repo for Ubuntu, and apparently cockpit-podman can be installed fairly easily, too.

<!-- more -->

cockpit-podman is one of the areas in which Fedora/RHEL has an edge out of the gate, as it's not available in Ubuntu repos or PPAs. But I thought it might be fairly easy to build since it's a web application. Naturally, I couldn't find any instructions on how to do it anywhere, but I managed to figure it out on a new VPS I'm setting up. So I wanted to share how I got it working, since I'm pretty sure the procedure isn't described anywhere else yet.

Obviously, first you want to install `podman` and cockpit. Cockpit's in the Ubuntu 20.04 multiverse repo, it's a quick:  
`sudo apt update && sudo apt install -y cockpit`

Podman has Ubuntu in the official documentation and only requires a few easy commands - take a trip to their installation instructions and step through them real quick before continuing here: [https://podman.io/getting-started/installation.html#ubuntu](https://podman.io/getting-started/installation.html#ubuntu)

Then clone the `cockpit-podman` repo: [https://github.com/cockpit-project/cockpit-podman](https://github.com/cockpit-project/cockpit-podman)

Go to your build directory and run this to clone the repo:  
`git clone https://github.com/cockpit-project/cockpit-podman.git`

Install the build requirements (listed in `cockpit-podman.spec`):  
`sudo apt update && sudo apt install -y appstream-util`  
(you need `build-essential` for this even though it uses `node` - so add it to the end of that last command string if you haven't installed it yet)  
  
`appstream-util` should automatically install `libappstream-glib8` which satisfies `libappstream-glib` mentioned in the `.spec` file - other prerequisites mentioned will be installed along with the `cockpit` meta-package)

Also, you'll need to have nodejs installed - but don't use the package maintainer's version, it's several major versions behind. Instead, manage your node installations with `nvm`\-sh from here:  
[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

The installation's pretty easy - you have to have `curl` for `nvm` to work, so this command is appropriate (install `curl` if you haven't already):  
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

Quick side note about choosing a node release with `nvm`: If you'd rather check to see what the latest available node LTS release is when you perform these operations, it's:  
`nvm ls-remote --lts`  
(I definitely recommend you use an LTS release, as building with a bleeding-edge release of node won't offer any benefits and is more likely not to work)

Then, required to install `node` are a few simple commands:  
`~/._bashrc_` (reload your env)  
`nvm install 12.18.1` (as of writing this is latest node LTS)  
`nvm alias default 12.18.1` (set it to default for later)  
Verify it's working by running `node --version`  
If for some reason it's not working, try:  
`nvm use 12.18.1`

Now that `node` is installed, navigate your newly cloned `cockpit-podman` repo and run `make`

Then run your `sudo make install` and it'll install it to your existing cockpit directory.

Now the next time you log into cockpit you'll have a super convenient `podman` controller, just as if you were on a Fedora or RHEL/CentOS machine. (If you're already logged in, obviously you'll want to log out and back in again.)

![](/wp-content/uploads/2020/06/image-1-1024x684.webp)

*Working example on a VPS running Ubuntu 20.04 LTS*
