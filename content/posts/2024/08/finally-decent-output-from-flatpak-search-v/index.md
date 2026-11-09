---
title: Finally, Decent Output From `Flatpak search -v` (updated to include `snap search` and conditionals)
description: You're welcome flatpak search doesn't really work, my terminal is always too narrow for the output not to truncate the name of the app, when I need the full thing in order to install it. But flatpak search -v is generally unreadable, as the descriptions are invariably longer tha…
summary: You're welcome flatpak search doesn't really work, my terminal is always too narrow for the output not to truncate the name of the app, when I need the full thing in order to install it. But flatpak search -v is generally unreadable, as the descriptions are invariably longer tha…
date: 2024-08-18T20:02:27Z
author: Avery Freeman
slug: finally-decent-output-from-flatpak-search-v
categories:
  - Random
thumbnail: /post-thumbnails/attachment-1026.webp
thumbnail_alt: Finally, Decent Output From `Flatpak search -v` (updated to include `snap search` and conditionals)
thumbnail_width: 480
thumbnail_height: 185
thumbnail_aspect: 2.5945945945945947
type: post
status: publish
url: /posts/2024/08/finally-decent-output-from-flatpak-search-v/
---

<!-- Imported from WordPress post 1024. -->

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-18-12-37-40-1024x394.webp)

*You're welcome*

`flatpak search` doesn't really work, my terminal is always too narrow for the output not to truncate the name of the app, when I need the full thing in order to install it. But `flatpak search -v` is generally unreadable, as the descriptions are invariably longer than my terminal width, so the output ends up making the columns super weird and unreadable. So I've been looking for a good solution for a while now.

I came across this post on the [Unix Stack Exchange site](https://unix.stackexchange.com/questions/754006/how-to-force-flatpak-output-to-be-in-a-table-even-when-stdout-is-piped), and it describes a solution that has such wonderful results, I had to grab it and make a script out of it real quick. I thought I had a solution using `tr` or `column` I wrote about back in [name your distro: flatpaks irritatingly dont follow desktop theme](/posts/2024/03/name-your-distro-flatpaks-irritatingly-dont-follow-desktop-theme-on-kde-plasma-desktop-6), but I'm not seeing it there, so I went scouring the web for a solution _again_ (I should have made a script of it back then, but I guess that's OK since I like this better!)

This solution was interesting to find because it makes use of a program I'd never heard of before called `miller` (I thought I'd heard everything :P). The command is `mlr`, and it's a pipe formatter capable of making garbage-readable output look pretty.

BTW, go give the guy who created `miller` [John Kerl](https://github.com/johnkerl) a shout out. It's basically a `bash` version of `pandas`. Definitely a great piece of software!

If you want to run this wrapper, go ahead and grab `miller` on your distro (It's conveniently available in package repos on `Arch` and `Ubuntu`), and then make a script file out of this:

```bash
#!/usr/bin/env bash
SEARCH_STRING="$1"
COLS="name,version,application,description"

flatpak --user search --columns "${COLS}" "${SEARCH_STRING}" |\
mlr --itsv --opprint --barred --implicit-csv-header label "${COLS}"
```

Then save the file to somewhere in your `$PATH` (I saved mine to `$HOME/bin` and called it `fp-search`), give it executable permissions (`chmod +x $HOME/bin/fp-search`) and then you can run it like:

```bash
fp-search usb
```

And then the output looks something like this:

![Output from flatpak search -v formatted with Miller](/wp-content/uploads/2024/08/Screenshot-from-2024-08-18-12-45-03-1024x607.webp)

*Try opening the pic in a new tab if it's too small to read*

Definitely an improvement over the old output. It still requires the terminal to be as wide as the output in order not to wrap, but it makes such a difference in terms of readability, it's shocking. I might have to bug `flatpak`'s dev team with a feature request.

Now, obviously it doesn't really do anything for how many unrelated flatpaks are returned, so I created another script essentially the same, but that `grep`s the output before it's put into `mlr`:

```bash
#!/usr/bin/env bash
SEARCH_STRING="$1"
COLS="name,version,application,description"

flatpak --user search --columns "${COLS}" "${SEARCH_STRING}" |\
grep -i "${SEARCH_STRING}" |\
mlr --itsv --opprint --barred --implicit-csv-header label "${COLS}"
```

I called this one `fp-search-strict`, and it restricts the output to results that contain the word being searched for. You can see right away, it gets far fewer results, but they are also quite a bit more relevant:

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-18-12-55-24-1024x607.webp)

*Wading through unrelated stuff sucks*

So there we go, much nicer ways to search for flatpaks without relying on the GUI. I guess you could always use `gnome-software`, but that'd be too easy, right?

Update: `Miller` can very easily be adapted for snaps, too. It's not really as necessary, since the native output doesn't truncate the application name required for installing them, but still is nice to have a guide for where the columns end: The `--barred` flag in `miller` makes resizing the terminal to read them a lot more intuitive.

Here is pretty much the same wrapper script, but using `snap` command. `snap` has a `section` flag, too, which are like software type categories (`utilities`, `productivity`, `games`, etc.) - here's the full list from the command:

```bash
snap search --section

 * art-and-design
 * books-and-reference
 * development
 * devices-and-iot
 * education
 * entertainment
 * featured
 * finance
 * games
 * health-and-fitness
 * music-and-audio
 * news-and-weather
 * personalisation
 * photo-and-video
 * productivity
 * science
 * security
 * server-and-cloud
 * social
 * utilities
```

In this example, I've combined both `fp-search` and `fp-search-strict` in **one command**, and used a test to see if a `grep` search filter should be slipped in before drawing the table. Also, I've put all the sections in an array, and created a test to see if any of them were included, otherwise it'll return an empty string so the search doesn't error out (same as not having a `section` argument)

```bash
#!/usr/bin/env bash
SEARCH_STRING="$1"
STRICT="$2"
SECTION="$3"
COLS="Name	Version	Publisher	Notes	Summary"

sections=(
 art-and-design
 books-and-reference
 development
 devices-and-iot
 education
 entertainment
 featured
 finance
 games
 health-and-fitness
 music-and-audio
 news-and-weather
 personalisation
 photo-and-video
 productivity
 science
 security
 server-and-cloud
 social
 utilities
)

function test_strict () {
	[[ "${STRICT}" = "strict" || "${STRICT}" = "1" ]] &amp;&amp; echo "1" || echo "0"
}

function test_valid_section () {
	[[ "${SECTION}" &amp;&amp; -v sections["${SECTION}"] &amp;&amp; ! "${SECTION}" = "strict" ]] &amp;&amp; echo "${SECTION}" || echo ""
}

STRICT="$(test_strict)"
SECTION="$(test_valid_section)"

if [[ "${STRICT}" -eq 1 ]]
	then
		snap search "${SEARCH_STRING}" --section="${SECTION}" |\
		grep -i "${SEARCH_STRING}" |\
		mlr --itsv --opprint --barred label "${COLS}"
		exit 0
	else
		snap search "${SEARCH_STRING}" --section="${SECTION}" |\
		mlr --itsv --opprint --barred label "${COLS}"
		exit 0
fi
```

So, if the command invoked is `sp-search drive`, you get the original search results of `snap search, but with this nicely forma`tted table border :

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-22-11-36-10-1024x556.webp)

`sp-search drive strict` provides narrower results (ones with only the search word being found in either the name or the description):

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-22-13-47-27-1024x499.webp)

And then the narrowest search breadth, `sp-search drive strict games` (you can also substitute `1` for `strict` if you're not much of a typer):

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-22-13-47-38-1024x499.webp)

It's a little wonky in that it needs a placeholder in order to disable `strict` _and_ search in a particular `section`, that would be `sp-search drive 0 games` (if anyone has a thought about how to do this without loads of more conditionals, I'd love to hear from you!):

![](/wp-content/uploads/2024/08/Screenshot-from-2024-08-22-13-44-34-1024x499.webp)

But, nonetheless, definitely an improvement.

Lastly, here's a re-write of the `flatpak` search wrapper `fp-search` with support for the `strict` conditional argument:

```bash
#!/usr/bin/env bash
SEARCH_STRING="$1"
COLS="name,version,application,description"
STRICT="$2"

function test_strict () {
	[[ "${STRICT}" = "strict" \
	|| "${STRICT}" = "1" ]] \
	&amp;&amp; echo "1" || echo "0"
}

STRICT="$(test_strict)"

echo "strict: ${STRICT}"

if [[ "${STRICT}" -eq 1 ]]
	then
		flatpak --user search \
						--columns="${COLS}" \
						"${SEARCH_STRING}" |\
		grep -i "${SEARCH_STRING}" |\
		mlr --itsv --opprint --barred \
				--no-implicit-tsv-header label "${COLS}"
		exit 0
	else
		flatpak --user search \
						--columns="${COLS}" \
						"${SEARCH_STRING}" |\
		mlr --itsv --opprint --barred \
				--no-implicit-tsv-header label "${COLS}"
		exit 0
fi
```
