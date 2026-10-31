---
title: How I over-engineered Halloween with two hacked Furbies
description: "Two hacked Furby Connects by my front door ran a two-act horror show for trick-or-treaters: an evil pink one with demon eyes, a sweet blue one, and a hidden Bluetooth board cueing their lines."
tldr: "I turned two Furby Connects into a Halloween double act: custom voice lines, demon and jack-o'-lantern eyes, a motion sensor, and a hidden Bluetooth board cueing it all. Along the way I bisected an undocumented Furby eye bug with numbered digits and learned that two Furbies will sing each other into hiding. The code is open source, and you can build your own with a laptop and two Furbies."
---

<!-- PUBLISH CHECKLIST: rename the file to the real publish date, fill every TK, swap every :::info placeholder for real media, optionally add `image:` (1200x630) with a porch still for the social card (otherwise the site generates one), strip metadata from every photo and video (`exiftool -all=`, or `ffmpeg -map_metadata -1`) and check for house numbers and reflections, then delete this comment. Merging to main publishes the post. -->

"Happy Halloween! Take one!" chirped the blue Furby by my front door. Then the pink one, eyes glowing red, answered: "Take two... if you DARE."

:quote[One Furby wants you to follow the rules. The other wants all of your candy.]{#one-furby-wants-your-candy} They bickered all night.

:::info[Placeholder: hero-video]
**Ben shoots:** porch wide shot, both Furbies mid-scene, about 8 seconds, muted, with the lines burned in as captions. No faces, nothing that shows where the house is. Path: `/video/furby-halloween/hero.{webm,mp4,jpg}`. Caption: "Pink and blue, mid-argument." Shot `porch-wide` in the Furby repository's [shot list](https://github.com/benbalter/Furby/blob/master/tools/blog_shotlist.md).
:::

<!-- placeholder: hero-video -->

If you've read how I [over-engineered my home network](/2020/12/04/over-engineered-home-network-for-privacy-and-security/) ([twice](/2021/09/01/how-i-re-over-engineered-my-home-network/)) or [my book](/2026/08/17/how-i-over-engineered-my-book/), you know where this is going. A normal person buys a 12-foot animatronic skeleton. :quote[I spent two weeks teaching a pair of 2016 toys to do a comedy routine over Bluetooth Low Energy.]{#furby-comedy-routine}

<style>
  .furby-media { margin: 1.5rem 0; }
  .furby-media video { display: block; width: 100%; height: auto; border-radius: .5rem; background: #000; }
  .furby-media figcaption { margin-top: .5rem; font-size: .9rem; opacity: .75; }
</style>

## Why Furbies

Furby Connect is the 2016 reboot, the one with LCD screens for eyes, a light-up antenna, and an app. That app talks to the Furby over Bluetooth, which means anything that speaks Bluetooth can talk to it too. Better yet, the Furby downloads "DLC" (downloadable content) packs from the app: files full of sound clips, eye animations, and movement routines that it keeps in memory.

A DLC holds what a Furby *can* do, but the Furby only does it when something sends a cue over Bluetooth. A show needs a conductor: a laptop, or a small board hidden on the porch, telling each Furby when to deliver its next line.

The hard part was done back in 2017, when the security firm Context [reverse-engineered the DLC format](https://www.contextis.com/blog/dont-feed-them-after-midnight-reverse-engineering-the-furby-connect).[^credits] All I had to do was stand on their shoulders and make a pink Furby say "Trick." with a menacing pause.

## The show

Two Furbies sit by the door. Pink is evil: demon eyes, an antenna glowing red, and lines like "Don't feed Kah after midnight..." (Furbies call themselves Kah.) Blue is the friendly one: jack-o'-lantern eyes, an orange antenna, and a habit of undercutting pink. ("Kah not scared. Kah has candy.")

They trade lines in short scenes. Some are greetings, which play when someone walks up. The rest play on a timer every 20 to 45 seconds, so the porch never goes quiet. A few of my favorites:

- **Blue:** "Who you gonna call?" Then a two-second pause for the kids to shout the answer, then both Furbies play the Ghostbusters theme together.
- **Blue:** *creaky door.* **Pink:** *scream.* **Blue:** "Hee hee! Gotcha!"
- **Pink:** "Kah is watching you..." **Blue:** "Kah watching too! Hi!"
- **Pink:** the opening bars of Bach's Toccata in D minor, the haunted-house organ riff. **Blue:** "Ooh! Kah love this song!"

## How it works

![Diagram. A show script is built into one DLC file per Furby, and each is uploaded to its Furby over Bluetooth, which takes about two to three and a half minutes and must stay under 350 KB. A small show board hidden on the porch (or a laptop running the same show) cues each Furby's lines over Bluetooth and hears when each starts and ends. A motion sensor greets new arrivals and a button plays a greeting right away. An iPhone remote talks to the board over Bluetooth to greet, pick a scene or see status. LED glasses worn by the candy-giver show sound-reactive demon eyes and have no link to the show.](/assets/img/furby-halloween-architecture-1600x1000.svg "One board runs the show. The glasses are a separate costume piece.")

### Teaching a Furby new lines

Each Furby gets its own DLC with that Furby's lines, eyes, and antenna colors. A single text file, [`show.toml`](https://github.com/benbalter/Furby/blob/master/halloween/show.toml), describes the whole show, every clip and every scene, and one command builds both DLCs from it.

The budget is tight: each Furby's whole DLC has to fit in about 350 KB.[^budget] That's why pink's Toccata gets five seconds. It's enough to recognize, and :quote[a Furby's speaker doesn't do Bach any favors.]{#furby-speaker-bach}

![Diagram of a Furby DLC file, the package of eyes, sounds and moves the Furby plays. A bar shows its parts by size: the eyes (color palettes, frame lists and image tiles) and the audio clips take nearly all of it, and a small remainder wires them together. Below, one action, number 75·0·0·2, the four-part number the show sends over Bluetooth, is followed through the action table to a sequence. The sequence picks an audio playlist (one clip of compressed audio, about 4 seconds), a body movement and an eye animation, and the Furby stays busy until all of them finish.](/assets/img/furby-halloween-dlc-anatomy-1600x900.svg "Following one action through Hasbro's stock DLC, which comes from the app at 1.1 MB. Ours have to fit in about 350 KB to upload.")

The voices are an AI mimic of the Furby's own, modeled on clips from the stock DLC, and they stay on my porch.[^voices] Every clip, real or stand-in, also has to be converted to the Furby's own compressed audio format, which used to mean a Windows-only tool. John-K's open-source [a1800_codec](https://github.com/John-K/a1800_codec) reverse-engineered it, and it made this whole project a lot easier.

Loading it all used to mean a browser tool and a tongue-and-tail reset before every upload.[^reset] Now a terminal script loads (flashes) a Furby in 139 seconds, against 340 for the same file in the browser.

### Demon eyes

<figure class="not-prose furby-media">
  <!-- html-validate-disable-next no-autoplay -->
  <video width="1192" height="370" autoplay muted loop playsinline preload="metadata" poster="/video/furby-halloween/eyes-pink-vs-blue.jpg" aria-label="Two pairs of animated Furby eyes side by side on black: pink's glowing red demon eyes with slit pupils, and blue's flickering yellow jack-o'-lantern triangles.">
    <source src="/video/furby-halloween/eyes-pink-vs-blue.webm" type="video/webm" />
    <source src="/video/furby-halloween/eyes-pink-vs-blue.mp4" type="video/mp4" />
  </video>
  <figcaption>Pink's demon eyes and blue's jack-o'-lantern eyes, rendered on a computer. One animation each, the only layout that has shown up cleanly on a real Furby.</figcaption>
</figure>

Each eye is a 128×128 screen in 64 colors, stored as four 64×64 tiles. I drew both sets of eyes in code, then chopped them into the tiles the Furby stores.

This was the part that fought back. Custom eyes that looked perfect on my computer came out offset and duplicated on the Furby. :quote[I did what you do with any bug you can't see: I bisected it.]{#bisect-the-bug-you-cant-see}[^bisect] When both eyes share tiles and the file holds fewer than 16 tiles in all, the Furby scrambles them. Pad it to 16 and the eyes come out clean.

<!-- placeholder: eyes-bisect -->

:::info[Placeholder: eyes-bisect]
**Ben shoots** (if a probe Furby or photo from the bisect exists): garbled digits next to clean digits on the Furby's eyes. Path: `/assets/img/furby-halloween-eyes-bisect-WxH.jpg`. Caption: "Left: two eyes sharing 10 tiles. Right: the same eyes, padded to 16." Cut this placeholder if no photo exists.
:::

Each Furby got exactly one eye animation: demon for pink, pumpkin for blue.[^animations]

The antenna lights join in. While a Furby talks, its antenna glows in a color that matches its eyes and is meant to swell with the loudness of the line: a red pulse for pink's demon eyes, an orange candle flicker for blue's pumpkin. TK: confirm the swell showed on the night, or keep "is meant to."

### Furbies are divas

A few things I learned about Furby Connects the hard way:

- **:quote[Two Furbies near each other start singing together, and then they vanish.]{#furbies-sing-and-vanish}** While they're singing to each other, neither one announces itself over Bluetooth, so nothing can find them. The fix is to wake them one at a time (there's no power switch, so that means putting the batteries in one Furby, then the other), and the show tells you when: "Pink is connected. Now power up blue." On the ESP32, a light blinks once for pink and twice for blue.
- **A busy Furby plays your line with no sound.** For a while, about a third of the clips played as eyes and wiggling with no audio, because a Furby that's still moving ignores the sound of its next line.[^busy]
- **Identical Furbies are identical.** The show tells them apart only by which DLC each is running. Flash both with pink's file by mistake and you have two evil Furbies and nobody telling the kids to take one.
- **Pet it and it ignores your DLC.** Its own reactions to petting and loud noises come from built-in memory, whatever DLC is loaded.
- **There's no on/off switch.** You turn a Furby off by taking the batteries out. I did this a lot.

### No laptop on the porch

You can run the show from a laptop, but I didn't want one sitting by the door all night. On the porch, an ESP32 (a microcontroller board with Bluetooth built in) runs the same show engine in MicroPython (a small Python for boards like this), off a USB power bank. It connects to both Furbies and picks one back up if it drops. A motion sensor plays a greeting when someone walks up, then ignores everyone for 20 seconds so a crowd doesn't get the same bit three times. Scenes are dealt like a shuffled deck, so every one plays before any repeats, and a watchdog reboots the board if it ever hangs.

<!-- placeholder: esp32-hidden -->

:::info[Placeholder: esp32-hidden]
**Ben shoots:** the ESP32 board and power bank, then where it hides on the porch (without showing where the house is). Path: `/assets/img/furby-halloween-esp32-WxH.jpg`. Shot `esp32-hidden`.
:::

An iPhone app I built works as the remote. It shows what the board is doing and fires a specific scene or line on demand. TK: one real moment from the night where the remote earned its keep, or cut this sentence.

<!-- placeholder: iphone-remote -->

:::info[Placeholder: iphone-remote]
**Ben shoots** (or a simulator screenshot): the remote app on the phone. Path: `/assets/img/furby-halloween-remote-WxH.png`. Shot `iphone-remote`.
:::

For whoever hands out the candy, there's a pair of [LED glasses](https://learn.adafruit.com/adafruit-eyelights-led-glasses-and-driver) with sound-reactive demon eyes in pink's colors.[^flashes]

<!-- placeholder: eyelights -->

:::info[Placeholder: eyelights]
**Ben shoots:** the EyeLights glasses on, in the dark, reacting to sound. Muted, no faces. Path: `/video/furby-halloween/eyelights.{webm,mp4,jpg}`. Shot `eyelights`.
:::

## The night itself

TK: the night itself. Ideas for what to capture:

- How many trick-or-treaters, roughly, and how many stopped to watch (qualitative is fine)
- The best reaction: a kid who argued back, a parent who asked how it worked, a dog that did not approve
- Whether the Ghostbusters call-and-response landed
- What broke, if anything (it's a live show; something always breaks)
- Which scene got the biggest laugh

<!-- placeholder: kids-reaction -->

:::info[Placeholder: kids-reaction]
**Ben shoots:** kids reacting, no faces (shoot from behind, or only hands reaching for candy). Muted, captioned. Ideally the "Who you gonna call?" moment. Path: `/video/furby-halloween/reactions.{webm,mp4,jpg}`. Shot `kids-reaction`.
:::

## Build your own

The whole thing is [open source](https://github.com/benbalter/Furby), and the README is written so a friend who's never opened a terminal can follow it. You need:

- Two Furby Connects and fresh batteries
- A Mac with Bluetooth (Windows and Linux should work, but I haven't tried them)
- Some time to make the voice lines, which is where most of the setup goes

Then:

1. Install [uv](https://docs.astral.sh/uv/) (it runs the Python scripts) and [ffmpeg](https://ffmpeg.org) (it converts audio), download the code, and run `uv run doctor.py`. It tells you what's missing and how to fix it.
1. Make the voice lines. `uv run voices.py` generates stand-ins with your computer's voices, or record your own. For the cackles, screams, and creaky door, grab a free [Freesound](https://freesound.org) API key and run `audioutils/freesound_fetch.py`. The Ghostbusters bit needs your own copy of the song.
1. Edit [`halloween/show.toml`](https://github.com/benbalter/Furby/blob/master/halloween/show.toml) to write your own scenes.
1. Rehearse with `uv run porch.py --rehearse`, which plays the show through your computer's speakers. No Furbies needed.
1. Build and flash with `uv run deploy.py`, which walks you through waking and loading each Furby one at a time.
1. Run the show with `uv run porch.py`, or [put it on an ESP32](https://github.com/benbalter/Furby#running-the-show-from-an-esp32).

Rather have an AI assistant drive? [furby-mcp](https://github.com/benbalter/furby-mcp) lets Claude and other AI tools find your Furbies, cue their actions, light their antennas, and load new DLCs.

If you build one, I want to hear what your Furbies say. Mine have a year to come up with new material. Pink says it still wants your candy.

*Furby is a trademark of Hasbro. This project isn't affiliated with or endorsed by Hasbro.*

[^voices]: The clips the AI mimics are Hasbro's recordings, and out of caution I'm keeping anything built from them off the internet. If you want your own Furby threatening your candy, here's the recipe. `uv run audioutils/extract_voice.py` unpacks the stock DLC's clips to WAV. Pick four clips where the Furby is just talking (no music, no giggling), trim the silence, and join them into about ten seconds of sample audio. Then give that sample and each line's text to [Chatterbox](https://github.com/resemble-ai/chatterbox), an open-source text-to-speech model that mimics the voice in a short sample. Generate several takes of each line and keep the best. I had [Whisper](https://github.com/openai/whisper) transcribe every take, kept the ones it heard correctly that sounded most like the Furby, and nudged the pitch up a semitone. Keep the results on your porch, too.

[^reset]: To reset a Furby Connect, you hold it upside down, hold its tongue, and pull its tail until its eyes go dark. It looks exactly as undignified as it sounds, for both of you. The browser tool needed a fresh reset for every DLC. The terminal script skips it by telling the Furby to delete the DLCs it already has, which clears the way for the new one.

[^bisect]: Bisecting means splitting the possible causes in half, testing, and repeating until one is left. I built a series of test DLCs, each asking one question, whose eyes showed nothing but numbered digits on black. I flashed each one and wrote down which digits came out clean. Padding to 16 tiles also let the eyes share tiles safely, which cut each set of eyes from about 79 KB to about 36 KB. I couldn't find any of this documented anywhere.

[^flashes]: The flashes stay under three a second, the threshold the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) set to protect people with photosensitive epilepsy, and the glasses' tests fail if they don't.

[^credits]: Context published [Python tools to read and write DLCs](https://github.com/ctxis/Furby), plus [a Web Bluetooth demo](https://github.com/pdjstone/furby-web-bluetooth) that uploads a custom DLC from a browser. The [bluefluff](https://github.com/Jeija/bluefluff) project mapped the Furby's action codes, the numbered commands that make it talk, blink, and wiggle. Rob Miles [drove a Furby Connect from an ESP32](https://www.robmiles.com/journal/2020/5/24/controlling-a-furby-connect-using-an-esp32) back in 2020, and Martin Woodward [had Copilot port bluefluff to Python](https://www.woodwardweb.com/post/2025/10/copilot-hacked-my-furby) last year. Last October, I copied (forked) [the Python tools](https://github.com/benbalter/Furby) and [the browser demo](https://github.com/benbalter/furby-web-bluetooth) to poke at one Furby, and got as far as a Toccata DLC too big to upload. This year, I came back and kept going.

[^budget]: Uploads time out above about 350 KB, and audio costs about 2 KB a second, so each Furby gets a bit under three minutes of sound, minus everything else in the file. A single set of eyes costs about 36 KB on its own.

[^animations]: The bisecting found a second limit. A DLC with three eye animations didn't garble. It quietly showed the *previous* DLC's tiles in the new colors, as if the new tiles never loaded. I only tested three, so to be safe the show sticks to one.

[^busy]: Cueing a Furby keeps it busy until its movements finish, often long after the clip ends. Cue it again too soon and it happily runs the action, silently. Now the show listens for the Furby's reply. If it says it's busy, the show waits for it to finish and sends the line again.
