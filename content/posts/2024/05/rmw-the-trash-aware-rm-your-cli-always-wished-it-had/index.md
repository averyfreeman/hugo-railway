---
title: "`rmw` - the trash-aware `rm` your CLI probably should've had by default"
description: "Hasn't everybody deleted some stuff in the command line, wishing they had a way to get it back? Well, by default there are no do-overs. That's where rmw comes in: rmw creates a trash can for your command line, so even after you delete some files (as long as you use it), you shou…"
summary: "Hasn't everybody deleted some stuff in the command line, wishing they had a way to get it back? Well, by default there are no do-overs. That's where rmw comes in: rmw creates a trash can for your command line, so even after you delete some files (as long as you use it), you shou…"
date: 2024-05-17T15:11:15Z
author: Avery Freeman
slug: rmw-the-trash-aware-rm-your-cli-always-wished-it-had
categories:
  - Random
thumbnail: /post-thumbnails/attachment-779.webp
thumbnail_alt: "`rmw` - the trash-aware `rm` your CLI probably should've had by default"
thumbnail_width: 450
thumbnail_height: 540
thumbnail_aspect: 0.8333333333333334
type: post
status: publish
url: /posts/2024/05/rmw-the-trash-aware-rm-your-cli-always-wished-it-had/
---

<!-- Imported from WordPress post 772. -->

![trash errors affect everybody](/wp-content/uploads/2024/05/image-1.webp)

Hasn't everybody deleted some stuff in the command line, wishing they had a way to get it back? Well, by default there are no do-overs. That's where `rmw` comes in: `rmw` creates a trash can for your command line, so even after you delete some files (as long as you use it), you should be able to get them back within your specified period of time.

It's a semi-compatible drop-in replacement for `rm` that should leave you feeling more at home than the alternatives - I checked out at least 7 of them, and this appeared to be the most developed and supported out of all the ones I tried. And while `rmw` doesn't (yet) support viewing, deleting, and otherwise co-mingling files with your desktop trash, you can at least keep them all in the same place to avoid confusion.

For me, setup went something like this ...

```bash
# Set your environment variables (ephemeral and persistent):

$ export RMW_CONF_DIR="$HOME/.config/rmw"
$ echo 'export RMW_CONF_DIR="$HOME/.config/rmw"' >> $HOME/.zshrc  # or .bashrc

# Create your configuration directory and go there:

$ mkdir -p $RMW_CONF_DIR
$ cd $RMW_CONF_DIR

# now this is a little weird - rmwrc has to be $CONFIG/rmwrc, but it keeps
two files for configuration in $RMW_CONF_DIR
```

Set up your config:

```bash
# auto-create the config with rmw:

$ rmw --config $RMW_CONF_DIR/rmwrc
```

The auto-created configuration has these defaults, but the `Waste` directory seemed a little redundant to me

```bash
$ cat rmwrc 

# rmw default waste directory, separate from the desktop trash
WASTE = $HOME/.local/share/Waste

# The directory used by the FreeDesktop.org Trash spec
# Note to macOS and Windows users: moving files to 'Desktop' trash
# doesn't work yet
# WASTE=$HOME/.local/share/Trash

# A folder can use the $UID variable.
# See the README or man page for details about using the 'removable' attribute
# WASTE=/mnt/flash/.Trash-$UID, removable

# How many days should items be allowed to stay in the waste
# directories before they are permanently deleted
#
# use '0' to disable purging (can be overridden by using --purge=N_DAYS)
#
expire_age = 0

# purge is allowed to run without the '-f' option. If you'd rather
# require the use of '-f', you may uncomment the line below.
#
# force_required
```

So I switched the commenting to use the desktop trash location instead of the new one `rmw` uses by default:

```bash
# Change configuration to reflect freedesktop (gnome, etc.) default trash location:

$ sed -i 's|# WASTE=$HOME/.local/share/Trash|WASTE=$HOME/.local/share/Trash|g' $RMW_CONF_DIR/rmwrc 

$ sed -i 's|WASTE = $HOME/.local/share/Waste|# WASTE = $HOME/.local/share/Waste|g' $RMW_CONF_DIR/rmwrc 

$ cat $RMW_CONF_DIR/rmwrc 
# rmw default waste directory, separate from the desktop trash
# WASTE = $HOME/.local/share/Waste

# The directory used by the FreeDesktop.org Trash spec
# Note to macOS and Windows users: moving files to 'Desktop' trash
# doesn't work yet
WASTE=$HOME/.local/share/Trash
```

Also, I'd like it to empty itself after a month so I can't forget to do it myself:

```bash
# set 30 day retention policy:

$ sed -i 's|expire_age = 0|expire_age = 30|g' $RMW_CONF_DIR/rmwrc 

$ cat $RMW_CONF_DIR/rmwrc | grep expire_age

expire_age = 30
```

Lastly, I'd like to try it out in place of `rm` for a while and see how it goes...

```bash
alias rm=rmw
```

Here's the online manual: [https://theimpossibleastronaut.com/rmw-website/](https://theimpossibleastronaut.com/rmw-website/)  
And the github repo: [https://github.com/theimpossibleastronaut/rmw/](https://github.com/theimpossibleastronaut/rmw/)  
Hope it gets you out of a bind!
