---
title: Using `obs` CLI controller with my new favorite mind-mapping software Obsidian - in a flatpak container
description: "Obsidian's Mind Map Feature makes use of the MarkMapJS library: https://markmap.js.org/ There's always issues here or there trying to incorporate container apps with the desktop, due to their sandboxed nature and subsequent lack of out-of-the-box feature parity with their distro…"
summary: "Obsidian's Mind Map Feature makes use of the MarkMapJS library: https://markmap.js.org/ There's always issues here or there trying to incorporate container apps with the desktop, due to their sandboxed nature and subsequent lack of out-of-the-box feature parity with their distro…"
date: 2024-05-24T17:43:57Z
author: Avery Freeman
slug: using-obs-cli-controller-with-my-new-favorite-mind-mapping-software-obsidian-in-a-flatpak-container
categories:
  - Random
thumbnail: /post-thumbnails/attachment-793.webp
thumbnail_alt: Obsidian.md mind map example
thumbnail_width: 480
thumbnail_height: 273
thumbnail_aspect: 1.7582417582417582
type: post
status: publish
url: /posts/2024/05/using-obs-cli-controller-with-my-new-favorite-mind-mapping-software-obsidian-in-a-flatpak-container/
---

<!-- Imported from WordPress post 792. -->

![Obsidian's Mind Map Feature makes use of the MarkMapJS library](/wp-content/uploads/2024/05/image-2-1024x582.webp)

*Obsidian's Mind Map Feature makes use of the MarkMapJS library: https://markmap.js.org/*

There's always issues here or there trying to incorporate container apps with the desktop, due to their sandboxed nature and subsequent lack of out-of-the-box feature parity with their distro-packaged and supported counterparts.

This is not a post about how awesome Obsidian is, but if you haven't heard of it, I recommend checking it out: [https://obsidian.md/](https://obsidian.md/)

Rather, it's a response I just put on github issues for an [obsidian CLI controller](https://github.com/Yakitrak/obsidian-cli) I have been using. It's been pretty helpful, but the real gem is Obsidian itself, I just love it, right down to being able to export [`markmap` files](https://markmap.js.org/) and having [`vim` keymap](https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/for+Vim+users) settings.

I just switched to the [flatpak version](https://flathub.org/apps/md.obsidian.Obsidian), though, because I noticed the package distributed through Arch's `extra` repository was pulling electron on to my system as a dependency (I am trying to cordon `nodejs` off as much as possible to my `adsf` environment and away from my main system, because it's caused the most intra-dependency issues out of any language I've dealt with, by far, but that's too irritating to go into here).

The response ended up being so long, I figured I might as well make a blog post out of it. Here's the original: [https://github.com/Yakitrak/obsidian-cli/issues/20](https://github.com/Yakitrak/obsidian-cli/issues/20)

To follow up, according to [Obsidian manual](https://help.obsidian.md/Extending+Obsidian/Obsidian+URI) on its URI interface, `obs` needs 3 things to interface with URI:

-   `.desktop` file

-   `Exec=` line pointing at executable binary

-   `%u` to be a command-line argument

Separate pre-req: `obs` name and path should be different values

```bash
obs print-default
Default vault name:  Obsidian
Default vault path:  **$HOME/Documents/Obsidian**
```

The first thing I'd try is giving the included desktop file a lowercase `%u`

```bash
sed -i 's|%U|%u|g' $HOME/.local/share/flatpak/app/md.obsidian.Obsidian/x86_64/stable/active/export/share/applications/md.obsidian.Obsidian.desktop 

obs open your-vault-name
```

(`md.obsidian.Obsidian` should open even if completely closed)

If that doesn't work, try these steps:

Copy the flatpak desktop file to $HOME/.local/share/applications  
Name it obsidian.desktop  
Point the `Exec=` line to flatpak executable,

```bash
Exec=$HOME/.local/share/flatpak/app/md.obsidian.Obsidian/current/active/export/bin/md.obsidian.Obsidian %u
```

run it with a lowercase `%u` which appears to be an error on both Linux package distributions I've tried so far

One might want to examine the wrapper included with the flatpak to see if there's any other settings they want to incorporate for their setup if they are executing the binary directly. A lot of time these wrappers are outdated and/or unnecessary for their situation, but worth checking out: `$HOME/.local/share/flatpak/app/md.obsidian.Obsidian/x86_64/stable/active/files/bin/obsidian.sh`

```bash
#!/bin/sh

set -oue pipefail

EXTRA_ARGS=()

add_argument() {
    declare -i "$1"=${!1:-0}

    if [[ "${!1}" -eq 1 ]]; then
        EXTRA_ARGS+=(${@:2})
    fi
}

# Nvidia GPUs may need to disable GPU acceleration:
# flatpak override --user --env=OBSIDIAN_DISABLE_GPU=1 md.obsidian.Obsidian
add_argument OBSIDIAN_DISABLE_GPU       --disable-gpu
add_argument OBSIDIAN_ENABLE_AUTOSCROLL --enable-blink-features=MiddleClickAutoscroll

# Wayland support can be optionally enabled like so:
# flatpak override --user --socket=wayland md.obsidian.Obsidian

WL_DISPLAY="${WAYLAND_DISPLAY:-"wayland-0"}"
# Some compositors a real path a instead of a symlink for WAYLAND_DISPLAY:
# https://github.com/flathub/md.obsidian.Obsidian/issues/284
if [[ -e "${XDG_RUNTIME_DIR}/${WL_DISPLAY}" || -e "/${WL_DISPLAY}" ]]; then
    echo "Debug: Enabling Wayland backend"
    EXTRA_ARGS+=(
        --ozone-platform-hint=auto
    --enable-features=WaylandWindowDecorations
    )
    if [[ -c /dev/nvidia0 ]]; then
        echo "Debug: Detecting Nvidia GPU. disabling GPU sandbox."
        EXTRA_ARGS+=(
            --disable-gpu-sandbox
        )
    fi
fi

# The cache files created by Electron and Mesa can become incompatible when there's an upgrade to
# either and may cause Obsidian to launch with a blank screen:
# https://github.com/flathub/md.obsidian.Obsidian/issues/214
if [[ "${OBSIDIAN_CLEAN_CACHE}" -eq 1 ]]; then
    CACHE_DIRECTORIES=(
        "${XDG_CONFIG_HOME}/obsidian/GPUCache"
    )
    for CACHE_DIRECTORY in "${CACHE_DIRECTORIES[@]}"; do
        if [[ -d "${CACHE_DIRECTORY}" ]]; then
            echo "Deleting cache directory: ${CACHE_DIRECTORY}"
            rm -rf "${CACHE_DIRECTORY}"
        fi
    done
fi

echo "Debug: Will run Obsidian with the following arguments: ${EXTRA_ARGS[@]}"
echo "Debug: Additionally, user gave: $@"

export FLATPAK_ID="${FLATPAK_ID:-md.obsidian.Obsidian}"
export TMPDIR="${XDG_RUNTIME_DIR}/app/${FLATPAK_ID}"

# Discord RPC
for i in {0..9}; do
    test -S "$XDG_RUNTIME_DIR"/"discord-ipc-$i" || ln -sf {app/com.discordapp.Discord,"$XDG_RUNTIME_DIR"}/"discord-ipc-$i";
done

zypak-wrapper /app/obsidian $@ ${EXTRA_ARGS[@]}
****
```

Also don't forget `flatseal`.
