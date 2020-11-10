---
title: How I manage GitHub notifications
description: My philosophy, workflow, settings, and tools for how I manage the never-ending stream of notifications on GitHub.
---

As a Product Manager at GitHub, GitHub.com is my primary means of communication day-to-day. I'm constantly reading and replying to GitHub threads to coordinate work within and across teams. On the average work day it's not uncommon that I'll receive upwards of 200 GitHub notifications (about 15 per hour on average during the work day). While that volume could easily become distracting or overwhelming, it's not (well, not usually at least). Here's how I manage GitHub notifications to remain focused and productive:

### Philosophy and workflow

*TL;DR: I use web notifications for everything but @mentions, which I have pushed to me via email. I subscribe to lots of repositories to ensure I don't miss anything, but unsubscribe from any thread not immediately relevant to me to keep noise to a minimum. I also have a few tools I've built to customize GitHub notifications for [the way I work](/2020/08/14/tools-of-the-trade/).*

#### Work on GitHub is asynchronous

I primarily use GitHub [web notifications](https://github.com/notifications) to stay abreast of work (and as a result, get maybe a handful of emails a day). I read most notifications in batches during natural breaks (via `github.com/notifications`) to avoid context switching and to encourage flow. Web notifications also have the added benefit of syncing state with the GitHub mobile app for when you're away from your desk. If you wanted to take it further, you could make a point to check web notifications at the top of every hour for example, but natural stopping points in whatever I'm doing (meetings, writing, etc.) work well enough for me.

#### @mentions are important

I treat @mentions (when a colleague specifically mentions you by name) as high signal-to-noise and potentially blocking. @mentions go to email, which causes a desktop (and mobile) notification which I can easily ignore, or choose to immediately respond to, if necessary. This somewhat mirrors how Slack works by default, with @mentions causing a notification and messages in channels queueing up as unread until you have a chance to read them. 

#### Watch liberally, unsubscribe frequently

I watch a lot of repositories (more than 200, as of this writing) to be able to flag initiatives that might affect my teams. I often care about issues and pull requests being opened (for example, when an item is added to our internal roadmap), but unless I'm directly involved with the matter, I often don't care about the subsequent conversation and will quickly unsubscribe from or mute the thread to avoid additional noise. You can do this when managing your web notifications by clicking the speaker icon, or in GMail by pressing `m` while viewing the message. As an added benefit, if you're ever @mentioned in the thread, you'll be automatically resubscribed via GitHub and your email will appear in the to the `to` field to break the mute in GMail.

#### Queue up work in tabs

While I'm not one of those tabs-as-todo people, I do make extensive use of browser tabs to more quickly triage notifications. GitHub's great, but sometimes conversations can take a bit longer to load than I'd like, and when you're spending all day in issues and pull requests, those precious few seconds quickly add up. From the web notifications list or from GMail, I open notifications in new tabs, meaning the issues, discussions, and pull requests load in parallel and are waiting for me when I'm ready for them, not the other way around.

#### Triage then focus

I block off the first hour of the workday to triage notifications so that I can free up the rest of the day to focus on less reactive and more impactful work. Being on the East Coast and working for a globally distributed and asynchronous company, there's almost always a hefty backlog of notifications waiting to greet me in the morning when I get to my desk. I'll check email (@mentions) first then web notifications, which also helps to avoid duplicates since viewing a notification via email will automatically mark the corresponding web notification as read.

#### One search to rule them all

Even though I only use email for @mentions, I still send all notifications to GMail (more on how below). While GitHub's search function is powerful, it's not always perfect, and sometimes I can't find what I'm looking for (or remember if it was on GitHub, A Google Doc, or in an email). I know I can always search GMail to find something across both GSuite and GitHub. As an added benefit, it's naturally limited to threads I'm watching instead of all activity I have access to across GitHub or the organization.

### Settings

To put that philosophy into practice, I have set the following settings via [`github.com/settings/notifications`](https://github.com/settings/notifications):

1. Enabled both email and Web notifications for all "participating" and "watching" conversations
2. Under "Email notification preferences":
   1. Set my "Default notification email" to my personal email to default non-work (e.g., open source) notifications to my personal inbox
   2. Enabled notifications for "Comments on Issues and Pull Requests" and "Pull Request reviews", but not pushes or my own updates
3. Under "Custom routing", set custom organization routing rules to route work-related emails to my work email address

### GMail filters

Because I have both web and email notifications enabled (and there's no way to only get @mentions via email without also getting notifications for any thread you participate in), I use the following GMail filters to further customize how and when I receive GitHub notifications:

* `from:(notifications@github.com) cc:mention@noreply.github.com` - Apply label "github/mention", Never send it to Spam, Mark it as important to ensure I get notifications for @mentions
* `from:(notifications@github.com) cc:REASON@noreply.github.com` - Skip Inbox, Apply label "github/REASON" to ensure all non-@mentions are immediately archived

You'll notice that GitHub cc's a specific email address based on the reason for the notification. In the second filter, you need to replace `REASON` with all of [the documented cc-able reasons](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#filtering-email-notifications) and create one filter for each. If you don't care about applying the GMail labels/folders and are looking for something simpler, you can just use two filters, one `from:(notifications@github.com) -@USERANME` and one `from:(notifications@github.com) @USERNAME` to more easily segment mentions from other notifications. 

### Tools

There are four tools I use regularly to support my notification workflow:

#### GitHub mention highlighter

When I click through a notification, I want to know exactly what's being asked of me, if anything. I use my own [GitHub Mention Highlighter plugin](https://github.com/benbalter/github-mention-highlighter) to highlight any personal or team @mentions in high-visibility florescent yellow, so that I can skim lengthy threads more easily.

#### Notifier for GitHub

While the blue notification light at the top of every page is great, I like easier access to the `/notifications` page when I'm not on GitHub. [Notifier for GitHub](https://github.com/sindresorhus/notifier-for-github), is a browser extension that adds a GitHub notification badge (with number of unread notifications) to your address bar to that you always have easy access.

#### Bot notification silencer

I rely on [Stale bot](https://github.com/probot/stale) to prune the backlogs of the open source projects I maintain, but don't need to be notified every time the bot bumps a thread to see if there's still interest in an old feature request. Likewise, [Dependabot](https://dependabot.com/) is a great way to keep dependencies up to date, but I don't need to worry about the dependency bump pull request until it's time for a release. As a result, I use [this tiny script](https://github.com/benbalter/bot-notification-silencer) to silence notifications from bots entirely (please don't tell our robot overlords).

#### gmailctl

While not GitHub-notification specific, [gmailctl](https://github.com/mbrt/gmailctl) makes it easier to manage your GMail filters by allowing you to generate and maintain GMail filters in a declarative way. Granted, managing GMail settings in JSON isn't going to be for everyone, but here's what my GitHub filters look like:

<details markdown="1">
  <summary>Filters</summary>

```jsonnet
// Non-@mention GitHub notifications
local notifications = [
  { type: 'assign', label: 'assign' },
  { type: 'author', label: 'author' },
  { type: 'comment', label: 'comment' },
  { type: 'manual', label: 'manual' },
  { type: 'push', label: 'push' },
  { type: 'review_requested', label: 'review requested' },
  { type: 'security_alert', label: 'security alert' },
  { type: 'state_change', label: 'state change' },
  { type: 'subscribed', label: 'subscribed' },
  { type: 'team_mention', label: 'team mention' },
  { type: 'your_activity', label: 'your activity' },
];

local notificationFilters = [
  {
    filter: {
      and: [
        { from: 'notifications@github.com' },
        { cc: notification.type + '@noreply.github.com' },
      ],
    },
    actions: {
      archive: true,
      labels: [
        'github/' + notification.label,
      ],
    },
  }
  for notification in notifications
];
```

And

```jsonnet
// GitHub @mentions
{
  filter: {
    and: [
      { from: 'notifications@github.com' },
      { cc: 'mention@noreply.github.com' },
    ],
  },
  actions: {
    labels: ['github/mention'],
    markimportant: true,
    markspam: false,
  },
}
```

</details><br />

And that's how I manage GitHub notifications. It's far from perfect (and looks a bit over engineered now that I've written it down), but it works for me and has for 7+ years now. I hope that sharing my notification workflow can help you find one that works best for you. Have a tip or trick for how you manage GitHub notifications? Let me know in the comments below.
