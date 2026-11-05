---
title: How I over-engineered my home office shades
description: "A schedule left the sun in my eyes mid-meeting, so my home office's Tilt shades now track the sun in Home Assistant and know when I'm on a call."
tldr: "My west-facing home office shades ran on a schedule, so as the seasons changed, the sun kept landing in my eyes mid-meeting. I rescued the shades before their maker's cloud goes dark, moved them to Home Assistant, and taught them to account for the sun and whether I'm on a call. Then I gave the living room the same treatment for weekend TV. If you own Tilt or MySmartBlinds shades, [export your keys today](https://github.com/benbalter/smartblinds-ble#-rescue-your-keys-now-do-this-before-the-cloud-goes-dark)."
---

I had a standing afternoon meeting with Evan,[^evan] my engineering counterpart, and despite endless tinkering with my shades, every time the seasons changed it went the same way. Halfway through, right on *its own* schedule, the sun would drop into my office window and land in my eyes.

My home office windows face west, and their motorized shades ran on the Tilt app's built-in schedule, which can close them relative to sunset. That sounds smart, but sunset is one number a day. Whether the sun is in my eyes depends on where it sits in the sky right now, and its path shifts with the seasons, so an offset from sunset that worked one month was wrong the next. Every time it was wrong, I found out on that call.

I taught the shades to track the sun instead. The sun's azimuth (its compass direction) and elevation (its height in the sky), cloud cover, whether I'm on a video call. Now they follow the sun instead of the clock, in every season.

I've worked from home for well over a decade, and my home office has picked up a long list of (unnecessary) optimizations along the way. Over-engineering isn't limited to the office, either. See my [home network](/2020/12/04/over-engineered-home-network-for-privacy-and-security/) ([twice](/2021/09/01/how-i-re-over-engineered-my-home-network/)), [my book](/2026/08/17/how-i-over-engineered-my-book/), and [two Furbies](/2026/11/02/hacking-furbies-for-halloween/). Most people would have bought blackout curtains.

## The shades almost died with the company that made them

Before I could teach the shades anything, I had to keep them alive.

### I bought the safe pick

They're Tilt roller shades, from the company that also sold MySmartBlinds, and I bought them because [Wirecutter](https://www.nytimes.com/wirecutter/reviews/best-smart-blinds/), The New York Times' product-review site, recommended them. Buying the reviewed pick is supposed to be the low-risk choice. Then the company started shutting down. I emailed it and never heard back, and every command to my shades still ran through its cloud.[^chain]

The motors themselves don't need the cloud. They're ordinary BLE devices. But each one only accepts commands encrypted with a key derived from its own 32-byte pairing key, and the only copy of that key you can get at lives on the vendor's servers. Once those servers shut down, any key you didn't export is gone for good.[^keys] If you own these shades, [export your keys](https://github.com/benbalter/smartblinds-ble#-rescue-your-keys-now-do-this-before-the-cloud-goes-dark) before you read the rest of this.

### Someone had already done the hard part

I did the "obvious" thing and recorded the Bluetooth traffic between my phone and a shade. I got a clean transcript of an encrypted session and nothing I could do with it.[^sniff] My notes concluded that cracking it would take pulling apart the firmware.

That conclusion was right about the cryptography and wrong about the work, because someone had already done it. A project called [`tilt-local-bridge`](https://github.com/Sunrise-Labs-Dot-AI/tilt-local-bridge) had published the encrypted handshake and the status and position commands under an MIT license. :quote[I spent a day reverse engineering something that was already on GitHub.]{#shades-prior-art} I've long said the hardest part of open source is remembering to search for an existing project before you [nerd-snipe](https://xkcd.com/356/) yourself.

### One small board replaced the hub

What I built is the plumbing around it. [`smartblinds-ble`](https://github.com/benbalter/smartblinds-ble) is a Python library that talks to the shades directly and exports every pairing key from the vendor's cloud while it still answers.[^auth0] [`ha-smartblinds-ble`](https://github.com/benbalter/ha-smartblinds-ble) turns each shade into a regular cover (Home Assistant's word for a shade, blind, or garage door) in Home Assistant, the open source home automation hub that runs my house.

The house's server sits out of Bluetooth range of the shades, so a small ESP32 board in the office relays Bluetooth over Wi-Fi. It's a FireBeetle 2 ESP32-S3, the same kind of board that [cued the Furbies on my porch](/2026/11/02/hacking-furbies-for-halloween/#one-board-runs-the-show) on Halloween. Now all four shades move on a command from Home Assistant, with no cloud, hub, or phone anywhere in the path.

### The relay isn't just for shades

The relay turned out to be the best part of the project. Home Assistant treats any ESP32 running [ESPHome's Bluetooth proxy firmware](https://esphome.io/components/bluetooth_proxy/) as an extra antenna for every Bluetooth device in range, so other Bluetooth gadgets around the house (smart locks, etc.) now run through it too, locally, with no vendor bridge.

That also made one small board a single point of failure. My standing desk already has an ESP32 in it, an [Upsy Desky](https://upsy-desky.tjhorner.dev) that lets Home Assistant raise and lower the desk, so it now runs as a second proxy.[^desk-proxy]

## A west window turns the whole day into one equation

Once the shades took local commands, I could finally retire the schedule. A west window has exactly one problem: late-afternoon glare. In the morning the sun isn't in the window at all. At midday it's too high to reach in. The trouble starts when it swings around and drops.

### One number for glare

That reduces to one number, which I called penetration: how squarely the sun hits the window.

> **penetration** = cos(the gap between the sun's azimuth and the window's) × cos(the sun's elevation)

Straight out the window and on the horizon gives you 1.0, the worst glare there is. Sun overhead gives you nearly 0, and the model clamps it to 0 when the sun is behind the wall or below the horizon.[^profile] The shade stays wide open while penetration is low and closes as it climbs. Shade positions here run from 0 (fully closed) to 100 (fully open).

### Battery motors want fewer, bigger moves

The math took an afternoon. Fitting it to the hardware took longer. The model runs every 30 minutes, snaps to 25% steps, and skips any move smaller than 20 points, so the shades make a handful of moves a day instead of a few hundred.[^cadence]

There's also a dead zone. Penetration below 0.35 doesn't count as glare at all, because the sun is still too high to reach anyone's eyes. Above it, the response climbs in a straight line, from 0 at 0.35 to full at 1.0. On a clear day around the equinox, the shades now stay fully open until 3 PM, then ease down to half closed by 4 PM.

## The forecast isn't the window

Then I got clever. The model assumes a clear sky, so on a gray afternoon it still computes a low, head-on sun and closes the shades against glare that isn't there. Home Assistant already pulls a weather forecast with a cloud-cover percentage. Discount the glare by the clouds, I figured, and the shades stop closing on overcast days.

In the office, it backfired. A sunny break under a cloudy forecast opened the shades straight into my eyes, because a forecast covers a whole region and I was right next to one window. Now the office ignores the forecast and tracks the sun as if the sky were always clear, which costs a little light on gray afternoons.

### Every move explains itself

The most useful thing I added was a status line. Every run writes down the numbers it used next to the sun's angles, which is how I figured out why the shades opened into my eyes without recomputing a single sun angle. :quote[If you can't answer "why are my shades half closed?" from one line on a dashboard, you'll end up doing the trigonometry yourself.]{#shades-why}

## My desk decides how far down the shades go

The right position depends less on the sun than on where the person is.

### Measure from your eyes, not the window

The shades have a floor, the lowest they go during the day, because the room still wants light. A strong low sun can clear a half-closed shade and land right at my eye line, so the office floor sits low, at 25.[^standing]

### Meeting mode takes over

Since Home Assistant can move my desk, a "meeting mode" button on my Stream Deck (a small panel of programmable keys) raises the desk to standing height and pauses the music. It turns on the key light, the main light aimed at my face for video calls. It also pulls the shades down far enough that the bright west window doesn't wash out the camera. Sun tracking leaves the office alone until the call ends.

When the meeting ends, the light goes back to normal, and nothing else moves.[^meeting-off] The shades wait for the next 30-minute check instead of snapping open mid-sentence. The desk stays up, because you might still be standing, and lowering furniture under someone is rude.

## The living room gets the weekend shift

Once the office worked, I gave the living room shades the same treatment. Their job there isn't a meeting. It's a weekend afternoon in front of the TV. Like the monitor in my office, the TV shares a wall with the window, so a low afternoon sun sits right behind the screen and lands in your eyes.

The living room wants different things than the office. The room still wants daylight, so its shades never close more than halfway during the day. And the cloud forecast is fine there: if it guesses wrong, the cost is some squinting during a movie, not the sun in my eyes mid-call.

### Winter sun is free heat

When the house is heating, the living room flips from blocking the afternoon sun to letting it in.[^season] The office keeps blocking it year-round, because the monitors care more about glare than the furnace does about heat.

### My code in the office, someone else's in the living room

After building all of this, I found [Adaptive Cover](https://github.com/basbruss/adaptive-cover), a custom integration you install through HACS (the Home Assistant Community Store) that already does most of it. Yes, I should have searched first. Again. The living room now runs on Adaptive Cover, and the office keeps my code. Having both in one house makes the tradeoffs easy to name.

Adaptive Cover is the better default. It tracks the sun across a window, works out how far into the room the sun reaches from the window's height and how deep you'll tolerate it, lets winter sun in, checks the weather or a light sensor, limits how often it moves, and backs off when you move a shade by hand. Someone else maintains it, and you set it up in Home Assistant's settings without writing a line of code.[^adaptive]

My code earns its keep where a mistake costs more. It holds the shades still during a call, ignores the forecast for the one window I sit next to, and puts a one-line reason for every move on my dashboard. It's also mine to maintain, which is the real cost of custom anything.

If you're not as concerned about glare as I am, start with Adaptive Cover. If a wrong move puts the sun in your eyes on camera, you'll want the control.

:::objection[Why not just buy shades that already follow the sun?]
You're asking the wrong question. For someone like me, it's never "why not just buy it?" It's "can I build it?"

For the record, you can buy shades that follow the sun. Wirecutter's current blinds pick, Lutron's Caséta Smart Wood Blinds, can tilt its slats with the sun's position through Lutron's hub. But I already owned shades, and they were about to become expensive fabric.

The rescue had to happen either way. Once the shades took local commands, the model cost an afternoon, and tuning it cost a few weeks of watching them misbehave. A light sensor in the home office window is still the right fix for the cloud problem. A sensor tells you how bright the window is. It still won't know you're on a call.
:::

## Steal the dials for sun-tracking shades

Whether you start with Adaptive Cover or roll your own, these are the lessons that survived contact with an actual afternoon:

1. **Use penetration, not a schedule.** cos(the gap between the sun's azimuth and the window's) × cos(the sun's elevation), clamped to 0 when the sun is behind the wall or below the horizon. Your home automation hub probably already exposes both angles, and a compass app gives you the window's azimuth.
1. **Add a glare dead zone.** Below some penetration (0.35 for me), there's no glare worth reacting to. Without it, the shades close hours early.
1. **Round to big steps and skip small moves.** 25-point steps, no move smaller than 20, a check every 30 minutes. Battery motors and your sanity both prefer a few big moves a day.
1. **Set a floor per room, based on where people's eyes are.** Measure from the desk, not from the window.
1. **Don't let a forecast overrule a window someone faces.** Use cloud cover where a mistake is cheap, and a real light sensor where it isn't.
1. **Hold the shades when a person takes over.** A meeting, a guest, a nap: a mode that pauses the automation beats one that fights you every 30 minutes.
1. **Log the why.** Write the inputs and the decision somewhere visible on every run.
1. **Rescue your keys now.** If your smart-home gear depends on a cloud from a company that's struggling, export whatever it needs to work locally while you still can. For Tilt shades, that's [`smartblinds-ble`](https://github.com/benbalter/smartblinds-ble#-rescue-your-keys-now-do-this-before-the-cloud-goes-dark) and [`ha-smartblinds-ble`](https://github.com/benbalter/ha-smartblinds-ble). Store the export like a password, quit the Tilt app while Home Assistant drives the shades (a shade takes one connection at a time), and don't run `tilt-local-bridge`'s pairing tool on shades you've already exported, because it installs a new key and can make your export stale.

Next time your house does something baffling, check whether it can tell you why in one line. Mine can now.

[^evan]: Name changed to protect the innocent, who had to watch me squint.

[^chain]: The motors are solar-charged and talk Bluetooth Low Energy to the phone app directly, or to a little hub that connects them to the vendor's cloud. As I write this, parts are unavailable, the company's online stores just say "This store is unavailable," and its older [MySmartBlinds app](https://apps.apple.com/us/app/mysmartblinds/id1042778784) has already switched to offline-only mode "in preparation for shutdown of Cloud services." The Tilt cloud still answers, for now. Wirecutter's guide has since moved on to other picks.

[^keys]: A 32-byte key has a 78-digit number of possible values, so guessing is out. In normal use, the key also never crosses the air: the shade and the app use it to derive a session key, and only the session traffic shows up in a capture. Treat an exported key file like a password, since anyone with it and Bluetooth range controls the shades.

[^sniff]: iOS can log every Bluetooth packet a phone sends, so I captured the app moving a shade and parsed the log into a readable transcript. The two sides trade a 16-byte challenge and response, and everything after that is ciphertext. I tested that exchange against all four pairing keys with every AES mode, key length, and padding scheme I could think of, and got zero hits. The session key was derived from the pairing key somehow, and a capture alone couldn't say how.

[^auth0]: The key export turned out to be one parameter. The Tilt app logs in through the same login service (Auth0) as the older MySmartBlinds cloud. That's why logging in with the old tools succeeds and then returns zero shades: the login is for the wrong service. Asking for the Tilt storage service instead returns a login the key store accepts, with nothing but your email and password in most cases. If your account uses two-factor login or the login gets blocked, [the README](https://github.com/benbalter/smartblinds-ble#tilt-roller-shades) has a fallback.

[^desk-proxy]: The Upsy Desky's maker ships a Bluetooth proxy add-on for its firmware, so turning the desk into a second relay was a firmware update, not new hardware. It adds three more connection slots and a second path to two of the shades, and Home Assistant routes each device through whichever relay hears it best.

[^cadence]: Home Assistant updates the sun's position every few minutes, and following it that closely would mean a Bluetooth write every few minutes. These are solar-charged battery motors, and every move costs battery plus a Bluetooth connection through the relay, which only has a few connection slots to go around. The skip-small-moves rule matters when a shade isn't on a 25-point step, like after someone nudges it by hand. A re-sync button on the dashboard overrides it.

[^profile]: Strictly, this measures how squarely the sun hits the glass, not how deep it reaches. Depth depends on the sun's height too: a low sun off to the side scores lower here but still reaches deep into the room. For my office's west window and an afternoon of glare, the simpler number worked well enough, and the dead zone below absorbs most of the difference.

[^adaptive]: Adaptive Cover keeps its settings in Home Assistant's UI, which I don't love, so a small script keeps them in my repository instead: it compares the live settings to the ones I chose, writes them back through Home Assistant's own setup forms, and won't hand Adaptive Cover the living room shades until my own automation has let go of them. Two systems moving the same shade over a flaky Bluetooth link is how a shade ends up somewhere neither one asked for.

[^standing]: Still on my to-do list: that floor assumes I'm sitting. The desk already reports its height, so the math could follow my actual eye line, sitting or standing, instead of only knowing whether I'm in a meeting.

[^meeting-off]: The music doesn't resume either. Meeting mode also turns itself off after three hours in case I forget, and music starting by itself in an empty office is creepier than a Furby.

[^season]: Adaptive Cover calls it winter when the indoor temperature drops below a comfort threshold, which I set just above the thermostat's heating setpoint. A house holding at its setpoint counts as winter, and the shades open for the sun.
