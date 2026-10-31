---
title: How I over-engineered Halloween with two hacked Furbies
description: "Two hacked Furby Connects by my front door ran a two-act horror show for trick-or-treaters: an evil pink one with demon eyes, a sweet blue one, and a hidden ESP32 cueing them over Bluetooth."
tldr: "I turned two Furby Connects into a Halloween double act: custom voice lines, demon and jack-o'-lantern eyes, a motion sensor, and an ESP32 cueing it all over Bluetooth. Along the way I bisected an undocumented Furby eye bug with numbered digits and learned that two Furbies will sing each other into hiding. The code is open source, and you can build your own with a laptop and two Furbies."
published: false
---

<!-- PUBLISH CHECKLIST: rename the file to the real publish date, fill every TK, swap every :::info placeholder for real media, recount commits, optionally add `image:` (1200x630) with a porch still for the social card (otherwise the site generates one), delete this comment, then set published: true. -->

"Happy Halloween! Take one!" chirped the blue Furby by my front door. Then the pink one, eyes glowing red, answered: "Take two... if you DARE."

One Furby wants you to follow the rules. The other wants all of your candy. They bickered all night.

:::info[Placeholder: hero-video]
**Ben shoots:** porch wide shot, both Furbies mid-scene, about 8 seconds, muted, with the lines burned in as captions. No faces, nothing that shows where the house is. Path: `/video/furby-halloween/hero.{webm,mp4,jpg}`. Caption: "Pink and blue, mid-argument." Shot `porch-wide` in the Furby repository's [shot list](https://github.com/benbalter/Furby/blob/master/tools/blog_shotlist.md).
:::

<!-- placeholder: hero-video -->

If you've read how I [over-engineered my home network](/2020/12/04/over-engineered-home-network-for-privacy-and-security/) ([twice](/2021/09/01/how-i-re-over-engineered-my-home-network/)) or [my book](/2026/08/17/how-i-over-engineered-my-book/), you know where this is going. A normal person buys an animatronic skeleton. I spent two weeks teaching a pair of 2016 toys to do a comedy routine over Bluetooth Low Energy.

<style>
  .furby-media { margin: 1.5rem 0; }
  .furby-media video { display: block; width: 100%; height: auto; border-radius: .5rem; background: #000; }
  .furby-media figcaption { margin-top: .5rem; font-size: .9rem; opacity: .75; }
</style>

## Why Furbies

Furby Connect is the 2016 reboot, the one with LCD eyes and an app. That app talks to the Furby over Bluetooth, which means anything that speaks Bluetooth can talk to it too. Better yet, the Furby downloads "DLC" packs from the app: files full of sound clips, eye animations, and movement routines that it keeps in memory and plays when told to.

The hard part was done back in 2017. The security researchers at Context [reverse-engineered the DLC format](https://www.contextis.com/blog/dont-feed-them-after-midnight-reverse-engineering-the-furby-connect) and published [Python tools to read and write it](https://github.com/ctxis/Furby), plus [a Web Bluetooth demo](https://github.com/pdjstone/furby-web-bluetooth) that uploads a custom DLC from a browser. The [bluefluff](https://github.com/Jeija/bluefluff) project mapped the Furby's action codes. All I had to do was stand on their shoulders and make a pink Furby say "Trick." with a menacing pause.

Last October, I forked [both](https://github.com/benbalter/Furby) [projects](https://github.com/benbalter/furby-web-bluetooth) to poke at one Furby. I got as far as a Toccata in D minor DLC that came out at about 1.2 MB, too big to upload. This year, I came back and kept going.

## The show

Two Furbies sit by the door. Pink is evil: demon eyes, a red antenna, and lines like "Don't feed Kah after midnight..." Blue is the friendly one: jack-o'-lantern eyes, an orange antenna, and a habit of undercutting pink. ("Kah not scared. Kah has candy.")

They trade lines in short scenes. Some are greetings, which play when someone walks up. The rest play on a timer every 20 to 45 seconds, so the porch never goes quiet. A few of my favorites:

- **Blue:** "Who you gonna call?" Then a two-second pause for the kids to shout the answer, then both Furbies play the Ghostbusters theme together.
- **Blue:** *creaky door.* **Pink:** *scream.* **Blue:** "Hee hee! Gotcha!"
- **Pink:** "Kah is watching you..." **Blue:** "Kah watching too! Hi!"

<figure class="not-prose furby-media">
  <figcaption style="margin:0 0 .4rem">

One scene (door, scream, "Hee hee! Gotcha!") with stand-in voices. The real ones are clones of the Furby's own voice, which isn't mine to share.[^clones]

</figcaption>
  <audio controls preload="none" style="width:100%" aria-label="One scene with stand-in voices: a creaky door, a scream, then the blue Furby saying Hee hee, Gotcha">
    <source src="/audio/furby-halloween/scene-sample.m4a" type="audio/mp4" />
  </audio>
</figure>

## How it works

![Diagram. halloween/show.toml is built by halloween.py into pink.dlc, blue.dlc and show.json, which flash.py uploads to each Furby over Bluetooth. An ESP32 board (or a laptop running porch.py) triggers actions on the pink and blue Furbies over Bluetooth and hears back when each starts and ends. A motion sensor and a button start greetings on the board; an iPhone remote talks to the board over Bluetooth, sending commands and reading its status. EyeLights glasses run on their own with no link to the show.](/assets/img/furby-halloween-architecture-1600x1000.png "One board runs the show. The glasses are a separate costume piece.")

### Teaching a Furby new lines

Each Furby gets its own DLC with that Furby's lines, eyes, and antenna colors. A single [`show.toml`](https://github.com/benbalter/Furby/blob/master/halloween/show.toml) file describes the whole show, every clip and every scene, and one command builds both DLCs from it.

The budget is tight. A DLC upload times out above about 350 KB, and audio costs about 2 KB a second, so each Furby gets a bit under three minutes of sound, *minus* everything else in the file. A single eye theme costs about 36 KB on its own. That's why the Toccata gets five seconds. It's enough to recognize, and a Furby's speaker doesn't do Bach any favors.

![Diagram of a Furby Connect DLC file. A strip shows its sections by size: PAL, SPR and CEL hold the eyes, AMF holds the audio, and small XLS, APL, LPS, SEQ and MTR sections link them. Below, action 75·0·0·2 goes through XLS to sequence 18, which names audio playlist 18 (track 40, about 4 seconds), eye animations and a body movement.](/assets/img/furby-halloween-dlc-anatomy-1600x900.png "Following one action through Hasbro's stock DLC, which comes from the app at 1.1 MB. Ours have to fit in about 350 KB to upload.")

The voices are AI clones of the Furby's own voice, cloned from clips in the stock DLC. That means they're Hasbro's audio at heart, so they stay off the internet. The repository ships a script that makes stand-in lines with your computer's built-in voices instead, or you can record your own in your best squeaky voice.

Loading it all used to mean a browser tool and a tongue-and-tail reset before every upload. Now a terminal script flashes a Furby in 139 seconds, against 340 for the same file in the browser.

### Demon eyes

<figure class="not-prose furby-media">
  <!-- html-validate-disable-next no-autoplay -->
  <video width="1192" height="370" autoplay muted loop playsinline preload="metadata" poster="/video/furby-halloween/eyes-pink-vs-blue.jpg" aria-label="Two pairs of animated Furby eyes side by side on black: pink's glowing red demon eyes with slit pupils, and blue's flickering yellow jack-o'-lantern triangles.">
    <source src="/video/furby-halloween/eyes-pink-vs-blue.webm" type="video/webm" />
    <source src="/video/furby-halloween/eyes-pink-vs-blue.mp4" type="video/mp4" />
  </video>
  <figcaption>Pink's demon eyes and blue's jack-o'-lantern eyes, rendered on a computer. One animation each, the only layout that has shown up cleanly on a real Furby.</figcaption>
</figure>

Each eye is a 128×128 screen in 64 colors, stored as four 64×64 tiles. I drew six themes in code (demon, pumpkin, storm, bloodshot, ghost, and hypno), then chopped them into the tiles the Furby stores.

This was the part that fought back. Custom eyes that looked perfect on my computer came out offset and duplicated on the Furby. I did what you do with any bug you can't see: I bisected it. I built a series of test DLCs, each asking one question, whose eyes showed nothing but numbered digits on black. I flashed each one and wrote down which digits came out clean. It turns out that when both eyes share tiles and the file holds fewer than 16 tiles total, the Furby scrambles them. Pad it to 16 and sharing works fine, which cut each eye theme from about 79 KB to about 36 KB. I couldn't find this documented anywhere.

<!-- placeholder: eyes-bisect -->

:::info[Placeholder: eyes-bisect]
**Ben shoots** (if a probe Furby or photo from the bisect exists): garbled digits next to clean digits on the Furby's eyes. Path: `/assets/img/furby-halloween-eyes-bisect-WxH.jpg`. Caption: "Left: two eyes sharing 10 tiles. Right: the same eyes, padded to 16." Cut this placeholder if no photo exists.
:::

The bisecting found a second limit, too. A DLC with three eye animations didn't garble. It quietly showed the *previous* DLC's tiles in the new colors, as if the new tiles never loaded. Each Furby gets one eye animation for the night: demon for pink, pumpkin for blue. The other four themes are on the bench until I figure out why.

![Six pairs of Furby eyes on black, each labeled: red demon eyes with slit pupils, yellow jack-o'-lantern triangles, a glowing blue storm eye, bloodshot eyes with red veins, white ghosts, and purple hypno spirals.](/assets/img/furby-halloween-eyes-themes-1616x644.jpg "Six eye themes, drawn in code and rendered on a computer. Two made the cut.")

The antenna lights join in. While a Furby talks, its antenna glows in a color that matches its eyes and is meant to swell with the loudness of the line: a red pulse for pink's demon eyes, an orange candle flicker for blue's pumpkin. TK: confirm the swell showed on the night, or keep "is meant to."

### Furbies are divas

A few things I learned about Furby Connects the hard way:

- **Two Furbies near each other start singing together, and then they vanish.** While they're singing to each other, neither one advertises over Bluetooth, so nothing can find them. The fix is to power them up one at a time, and the show tells you when: "Pink is connected. Now power up blue." On the ESP32, a light blinks once for pink and twice for blue.
- **A busy Furby plays your line with no sound.** For a while, about a third of the clips played as eyes and wiggling with no audio. Triggering an action keeps the Furby busy until its movements finish, often long after the clip ends. Trigger it again too soon and it happily runs the action, silently. Now the show listens for the Furby's reply. If it says it's busy, the show waits for it to finish and sends the line again.
- **Identical Furbies are identical.** The show tells them apart only by which DLC each is running. Flash both with pink's file by mistake (TK: "ask me how I know," if it was you) and you have two evil Furbies and no straight man.
- **The DLC only changes what plays when you ask over Bluetooth.** Pet the Furby or make a loud noise, and it reacts from its built-in memory like any other Furby. That's why the show needs something to send the cues.
- **There's no on/off switch.** You turn a Furby off by taking the batteries out. I did this a lot.

![Timeline with a pink lane and a blue lane. blue.door starts at 0.0 s, speaks 2.9 s, busy 9.0 s; pink.scream starts at 3.5 s, speaks 3.0 s, busy 9.0 s; blue.gotcha starts at 9.0 s, speaks 1.3 s, busy 9.0 s. blue was still busy at 7.6 s and waited to retry.](/assets/img/furby-halloween-pacing-chart-1600x680.png "One scene on virtual Furbies, with movements at their slowest. The pale tail is the movement that keeps a Furby busy after its line ends. 20:07 is the Furby's \"busy\" reply, so the show holds gotcha and resends it.")

### No laptop on the porch

You can run the show from a laptop, but I didn't want one sitting by the door all night. The same show engine also runs on an ESP32, a microcontroller board with Bluetooth built in, running MicroPython off a USB power bank. It connects to both Furbies and keeps the show going if one drops. A motion sensor plays a greeting when someone walks up, then ignores everyone for 20 seconds so a crowd doesn't get the same bit three times. Scenes are dealt like a shuffled deck, so every one plays before any repeats.

Porting to MicroPython had its own surprises. It has no `capitalize()`, so the show crashed the first time it tried to announce "Pink is connected." And my log-watching script once spent ten minutes listening to a "silent" board that was actually the LED glasses, plugged in instead of the board. Now it finds the board by its USB vendor ID.

<!-- placeholder: esp32-hidden -->

:::info[Placeholder: esp32-hidden]
**Ben shoots:** the ESP32 board and power bank, then where it hides on the porch (without showing where the house is). Path: `/assets/img/furby-halloween-esp32-WxH.jpg`. Shot `esp32-hidden`.
:::

Then, because the board is out of sight and its log was only readable from a laptop, I wrote an iPhone app as a remote. It shows what the board is doing and fires a specific scene or line on demand. TK: one real moment from the night where the remote earned its keep, or cut this sentence.

<!-- placeholder: iphone-remote -->

:::info[Placeholder: iphone-remote]
**Ben shoots** (or a simulator screenshot): the remote app on the phone. Path: `/assets/img/furby-halloween-remote-WxH.png`. Shot `iphone-remote`.
:::

For whoever hands out the candy, there's a pair of [LED glasses](https://learn.adafruit.com/adafruit-eyelights-led-glasses-and-driver) with sound-reactive demon eyes in pink's colors. The flashes stay under three a second, the safe limit for people with photosensitive epilepsy.

<!-- placeholder: eyelights -->

:::info[Placeholder: eyelights]
**Ben shoots:** the EyeLights glasses on, in the dark, reacting to sound. Muted, no faces. Path: `/video/furby-halloween/eyelights.{webm,mp4,jpg}`. Shot `eyelights`.
:::

## Two weeks, 59 commits, one coding partner

I built almost all of this in the two weeks before Halloween, and I didn't build it alone. Of the 59 commits this year, 53 are co-authored with Claude, and I often had several sessions going at once: one probing eye bugs, one writing the ESP32 firmware, one building a virtual Furby so the tests could run the real show without real Furbies. That virtual Furby now reproduces the silent-clip bug in CI, so it can't sneak back.

TK: a paragraph in Ben's words on what working this way was like. Suggested angle: the agent was great at the tedious parts (decoding a binary format, writing the bisecting probes, making the README friendly enough for a non-technical friend to follow), and the human part was taste. Which lines are funny, how long to hold for the kids' shout, and when to stop adding features. Tie it to firsthand GitHub and management experience if it fits.

The trick was the same one I'd use with any team: [write it down](/2026/10/26/documentation-quality-is-ai-quality/). The repository's notes record every hardware finding and mark which ones were confirmed on a real Furby and which were only inferred. When a session hit a weird bug, the first step was reading what the last session had learned. Without that file, every session would have rediscovered that two Furbies sing each other into hiding.

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

1. Install [uv](https://docs.astral.sh/uv/) and [ffmpeg](https://ffmpeg.org), clone the repository, and run `uv run doctor.py`. It tells you what's missing and how to fix it.
1. Make the voice lines. `uv run voices.py` generates stand-ins with your computer's voices, or record your own. For the cackles, screams, and creaky door, grab a free [Freesound](https://freesound.org) API key and run `audioutils/freesound_fetch.py`. The Ghostbusters bit needs your own copy of the song.
1. Edit [`halloween/show.toml`](https://github.com/benbalter/Furby/blob/master/halloween/show.toml) to write your own scenes.
1. Rehearse with `uv run porch.py --rehearse`, which plays the show through your computer's speakers. No Furbies needed.
1. Build and flash with `uv run deploy.py`, which walks you through waking and loading each Furby one at a time.
1. Run the show with `uv run porch.py`, or [put it on an ESP32](https://github.com/benbalter/Furby#running-the-show-from-an-esp32).

Here's what `doctor.py` says once everything's in place (the Bluetooth check is skipped here):

```text
$ uv run doctor.py
✓ Python 3.12
✓ uv is installed
✓ ffmpeg is installed
✓ Python packages: pillow, a1800-codec, bleak
⚠ pink.ghostbusters is optional and missing (build/music/ghostbusters.mp3), so its scenes are left out.
⚠ blue.ghostbusters is optional and missing (build/music/ghostbusters.mp3), so its scenes are left out.
✓ blue.dlc is built (187 KB) and matches show.json
✓ pink.dlc is built (196 KB) and matches show.json

All set (see the notes above).
Wake one Furby and run `uv run doctor.py --furbies` to check it too; then the other.
```

If you build one, I want to hear what your Furbies say. Mine have a year to come up with new material. Pink says it still wants your candy.

[^clones]: Every line the Furby says is a Hasbro sound recording, and copyright covers sound recordings. A voice cloned from them is close enough to a derivative work that I'm happy to play it on my porch and unwilling to post it on the internet. If you want your own Furby threatening your candy, `uv run audioutils/extract_voice.py` unpacks the stock DLC's clips to WAV, and any voice-cloning tool that takes a sample voice can take it from there. Keep the results on your porch, too.
