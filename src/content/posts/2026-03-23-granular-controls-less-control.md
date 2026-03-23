---
title: The paradox of granular controls
description: "More toggles, permissions, and settings don't give users more control — they create insecurity through feature obscurity, where the controls themselves become the vulnerability."
---

Picture this: you open your phone's privacy settings to lock down a single app's location access. Twenty minutes later, you've scrolled through 47 toggles across six sub-menus, you're no longer sure what you've changed, and you've definitely granted *more* permissions than you intended. You came in wanting more control. You left with less.

This is the paradox of granular controls. Across security, privacy, and permissions — the domains where getting it right matters most — giving users more fine-grained options doesn't make them more secure. It makes them less secure. I call it *insecurity through feature obscurity*: when the settings themselves become so numerous and complex that no human can meaningfully configure them.

## The airplane cockpit anti-pattern

I've [written before](https://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/) about how settings pages tend to march inexorably toward resembling the inside of an airplane cockpit — more knobs, more dials, more switches, all added one at a time, each individually defensible, collectively incomprehensible. That pattern is annoying in a photo-editing app. In security and privacy, it's genuinely dangerous.

Every setting you add is a decision you're asking the user to make. And as WordPress's "decisions not options" philosophy reminds us, [those decisions quickly add up](https://en.wikipedia.org/wiki/Analysis_paralysis). But when the decisions involve cryptographic protocols, permission scopes, and data-sharing policies, the stakes of getting one wrong aren't "my sidebar looks funny" — they're "I've accidentally exposed my production database to the internet."

The irony is that these controls exist because someone, somewhere, demanded them. A compliance officer needed a specific toggle. An enterprise customer required a particular permission boundary. A power user wanted finer-grained access control. Each request was reasonable in isolation. The result, in aggregate, is a settings page that actively undermines the security it's supposed to provide.

## Real-world insecurity through feature obscurity

This isn't theoretical. The pattern plays out everywhere:

**AWS IAM policies.** Amazon's Identity and Access Management is legendarily powerful — and legendarily misconfigured. IAM policies support hundreds of services, thousands of actions, and a JSON-based policy language expressive enough to model almost any permission scheme you can imagine. The result? Misconfigured S3 buckets have been responsible for some of the largest data breaches in recent memory.[^1] Not because AWS lacks security controls, but because it has *too many*. The median engineer writing an IAM policy wants to grant their Lambda function access to a specific S3 bucket. What they get is a policy language so complex that even experienced practitioners routinely get it wrong.

**Facebook (Meta) privacy settings.** Over the years, Facebook's privacy controls have grown from a few simple choices into a labyrinth spanning dozens of screens. Who can see your posts? Who can find you by email? Who can send you friend requests? What about individual photo albums? Past posts? Your phone number? Each setting has its own sub-options, and they've reshuffled the categories often enough that even privacy-conscious users can't be confident they've configured things correctly. Studies have consistently shown that [Facebook users' actual privacy settings rarely match their stated preferences](https://dl.acm.org/doi/10.1145/2470654.2481311) — not because users don't care, but because the interface makes it functionally impossible to verify.

**Android app permissions.** Android moved from an all-or-nothing permission model to a granular one — location, camera, microphone, contacts, each individually grantable, with "while using the app" vs. "always" distinctions. In theory, this is an improvement. In practice, users are so bombarded with permission dialogs that they develop "prompt fatigue" and start tapping "Allow" reflexively. The granularity that was supposed to empower users instead trained them to stop reading.

**GDPR cookie banners.** The regulation was supposed to give Europeans control over their data. What it gave them was an internet where every website presents a modal dialog with 47 categories of cookies, each individually togglable, often with dark patterns that make "Accept All" the easiest path. If your privacy control requires a law degree and three minutes of careful clicking to configure, you haven't given users control. You've given them the *theater* of control.

## Why more options means less security

The mechanism here isn't mysterious. It's the same dynamic I described in [Removing a feature is a feature](https://ben.balter.com/2016/07/21/removing-a-feature-is-a-feature/): anything added dilutes everything else. But in the security domain, the consequences are sharper:

- **Misconfiguration is the primary threat.** The overwhelming majority of security breaches don't involve zero-day exploits or sophisticated attacks. They involve someone leaving a door unlocked — a permission set too broadly, an access key left in a public repo, a firewall rule that grants access to `0.0.0.0/0`. Every additional setting is an additional surface for human error. The more toggles you provide, the more ways there are to get the configuration wrong.

- **Complexity defeats comprehension.** Security is only as strong as the weakest-understood setting. A system with five permissions that every admin understands is more secure than a system with fifty permissions that no one fully grasps. You can't protect what you can't reason about. When your permission model requires a mental model more complex than the system it protects, something has gone sideways.

- **Analysis paralysis leads to default acceptance.** Confronted with a wall of options they don't fully understand, most users do one of two things: accept all the defaults (hoping someone made good choices) or click through as fast as possible to get to the thing they actually wanted to do. In both cases, the granular controls you painstakingly built are functionally invisible. They exist on the screen, but they don't exist in the user's mental model.

- **The illusion of control substitutes for actual control.** A dense settings page *feels* like security. Seeing all those toggles creates a sense that you're in the driver's seat. But feeling in control and *being* in control are different things entirely. If you can't verify that your settings actually produce the outcome you intend — and with enough complexity, you can't — then the settings are security theater, not security.

## What to do instead

If granular controls are the problem, what's the alternative? It's not removing all user agency. It's absorbing the complexity on behalf of your users — what I've called [the hard part of product development](https://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/). Specifically:

### Start with sensible defaults

The single most impactful security decision you can make is choosing the right default. [Research suggests](https://neverworkintheory.org/2016/06/09/too-many-knobs.html) that 90% of users adjust fewer than 10% of settings. That means your default configuration *is* your security model for the vast majority of users. Make it a good one. GitHub, for example, defaults new repositories to private. That one default prevents more accidental data exposure than any permission matrix ever could.

### Use progressive disclosure

Not every user needs every option. Show the simple, secure choice by default. Let power users dig deeper if they need to, but don't force everyone through the cockpit on the way to their seat. Think of it like a well-structured API: a clean, obvious interface for the common case, with escape hatches for the edge cases that genuinely require them.

### Make the secure path the easy path

If the most secure option requires navigating three sub-menus and checking a box that's off by default, you've designed a system that rewards insecurity. The secure choice should be the path of least resistance — the thing that happens when you don't do anything special. Every click between a user and the secure state is a click where they might give up or make a mistake.

### Reduce the decision space

Instead of exposing every possible permission combination, offer curated roles or profiles. "Admin," "Editor," and "Viewer" are infinitely more usable than a matrix of 30 individual permissions.[^2] You'll cover 95% of use cases with three options, and for the remaining 5%, you can offer an "Advanced" path that requires deliberate opt-in.

### Verify, don't trust

Rather than relying on users to configure their own security correctly, build systems that verify outcomes. Audit logs, security dashboards, and configuration scanners that flag misconfigured settings do more for actual security than another toggle ever could. Show users what their current configuration *actually does*, not just what boxes they've checked.

## The courage to decide

Here's the uncomfortable truth for product builders: every setting you add is a decision you're avoiding. [Settings are a crutch](https://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/). It's easier to add a toggle and let the user figure it out than to do the research, make the call, and take responsibility for the outcome. But when the domain is security, that avoidance has real consequences.

The next time someone requests a new permission toggle, a new privacy setting, or a new configuration option, resist the temptation. Instead, ask: "What should the *right* default be?" and have the courage to ship it. Your users — even the ones who asked for the toggle — will be more secure for it.

The best security isn't the kind with the most knobs. It's the kind you never have to think about.

[^1]: Capital One, Twitch, and numerous other high-profile breaches have been traced back to misconfigured AWS resources — not because the tools lacked granularity, but because the granularity itself created room for error.

[^2]: GitHub's repository permission model is a good example of this philosophy in practice: a small set of curated roles (Read, Triage, Write, Maintain, Admin) that cover the vast majority of use cases, with custom roles available for organizations that genuinely need them.
