---
title: How I manage GitHub notifications
description: My philosophy, workflow, settings, and tools about how I manage the onslaught of notifications on GitHub.
---

As a Product Manager at GitHub, GitHub is my primary means of workplace communication day-to-day. I'm regularly participating in GitHub issues to coordinate work within and across teams. On the average work day it's not uncommon that I'll receive upwards of 200 GitHub notifications (15 per hour on average during the work day). While that volume could easily become overwhelming, here's how I manage GitHub notifications to remain focused and productive:

### Philosophy and workflow

*TL;DR: I use web notifications for everything but @mentions, which I want pushed to me. I subscribe to lots of repositories to ensure I don't miss anything, but unsubscribe from any thread not immediately relevant to me to keep noise to a minimum.*

#### Work on GitHub is asynchronous

I primarily use [web notifications](https://github.com/notifications) to stay abreast of work (and as a result, get maybe a handful of emails a day, if that). I read most notifications in batches during natural breaks in work (via `github.com/notifications`) to avoid context switching and to encourage flow. This also has the added benefit of syncing state with the mobile app.

#### @mentions are important

I treat @mentions (when a colleague specifically mentions you by name) as high signal-to-noise. @mentions go to email, which causes a desktop (and mobile) notification which I can easily ignore, or choose to immediately respond to, if necessary. This somewhat mirrors have Slack works by default, with @mentions causing a notification and messages in channels queueing up as unread until you have a chance to read them. As an added benefit, when you view a notification via email, the corresponding web notification is automatically marked as read.

#### Watch liberally, unsubscribe frequently

I watch a lot of repositories (more than 200, as of this writing) to be able to flag initiatives that might affect my teams. I often care about issues and pull requests being opened (for example, when an item is added to our internal roadmap), but unless I'm directly involved with the matter, I don't care about the subsequent conversation and will quickly unsubscribe from or mute the thread to avoid creating additional notifications. You can do this when managing your web notifications by clicking the speaker icon, or in GMail by pressing `m` on the message. As an added benefit, if you're ever @mentioned in the thread, you'll be automatically resubscribed via GitHub and you're email will appear in the to the `to` field to break the mute in GMail.

#### Queue up work in tabs

While I'm not one of those tab-as-todos people, I do use browser tabs so that I can more quickly triage notifications. GitHub's great, but sometimes conversations can take a bit longer to load than I'd like, and when you're spending all day in issues and pull requests, those seconds quickly add up. From the web notifications list, or from GMail, I open notifications in new tabs, meaning the issues, discussions, and pull requests load in parallel rather than serial and are waiting for me when I'm ready for them, not the other way around.

#### One search to rule them all

Even though I only use email for @mentions (more on how below), I still send all notifications to GMail. While GitHub's search function is powerful, it's not perfect, and sometimes I can't find what I'm looking for (or remember if it was on GitHub, A Google Doc, or in an email). I know I can always search GMail to find something across both email and GitHub. As an added benefit, it's naturally limited to threads I'm watching instead of all activity I have access to across GitHub.

### Settings

To achieve this workflow, I have set the following settings via [`github.com/settings/notifications`](https://github.com/settings/notifications):

1. Enabled both email and Web notifications for all "participating" and "watching" conversations
2. Under "Email notification preferences" 
    1. Set my "Default notification email" to my personal email to default open source to my personal inbox
    2. Enabled notifications for "Comments on Issues and Pull Requests" and "Pull Request reviews", but not pushes or my own updates
3. Under "Custom routing", set custom routing rules to route GitHub-related emails to my GitHub email address

### GMail filters

Because I have both web and email notifications enabled (and there's no way to only get @mentions via email without also getting notifications for any thread you participate in), I use the following GMail filters:

* `from:(notifications@github.com) cc:mention@noreply.github.com` - Apply label "github/mention", Never send it to Spam, Mark it as important to ensure I get notifications for @mentions
* `from:(notifications@github.com) cc:REASON@noreply.github.com` - Skip Inbox, Apply label "github/REASON" to ensure all non-@mentions are immediately archived

You'll notice that GitHub cc's a specific email address based on the reason for the notification. In the second filter, you need to replace `REASON` with all of [the documented cc-able reasons](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#filtering-email-notifications) and create one filter for each.

Pro-tip: If you don't care about applying labels, you can use two filters, one `from:(notifications@github.com) -@USERANME` and one `from:(notifications@github.com) @USERNAME` to more easily segment mentions from other notifications. 

### Tools

There are three tools I use regularly to support my notification workflow:

#### GitHub Mention highlighter

When I click through a notification, I want to know exactly what is being asked of me, if anything. I use [my own GitHub Mention Highlighter plugin](https://github.com/benbalter/github-mention-highlighter) to highlight any personal or team @mentions in high-visibility yellow, so I don't have to skim lengthy threads.

#### Notifier for GitHub

While the blue notification light at the top of every page is great, I like easier access to the `/notifications` page when I'm not on GitHub. [Notified for GitHub](https://github.com/sindresorhus/notifier-for-github), is a browser extension that adds a GitHub notification badge (with number of unread notifications) to your address bar.

#### gmailctl

While not GitHub notification specific, [gmailctl](https://github.com/mbrt/gmailctl) makes it easier to manage your GMail filters by allowing you to generate and maintain Gmail filters in a declarative way. While it's not for everyone, here's what my GitHub filters look like:

<details>
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
// GitHUb @mentions
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

</details>

And That's how I manage GitHub notifications. It's far from perfect, but it works for me (and has for 7+ years now). Have a tip or trick for how you manage GitHub notifications? Let me know below.