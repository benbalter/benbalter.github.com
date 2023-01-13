---
title: How to write a great extended leave document
description: This is the template I use to prepare for an extended leave (or to hand off responsibilities as I transition to a new role).
---

I recently came back from an extended leave to find several of my colleagues asking to copy my "leave doc" for their own planned leaves. Having transitioned roles within GitHub now a number of times over the years, I'm no stranger to temporarily or permanently handing off work, and have evolved a preferred format I use to ensure business continuity during the transition. In service of ["everything should have a URL"](https://ben.balter.com/2015/11/12/why-urls/), I'm sharing my leave template here in case it's helpful for planning your own leave.

## Sections to include

#### ⏳ TL;DR:

"Too long, didn't read". This is for the folks who have a question or request, but don't have time to read the whole document. Put it up front and make it visually distinct. The TL;DR can be as simple as:

> If your question or request isn't answered below, open an issue in `X` or post in `Y` and someone will point you in the right direction. Wondering the status of an in-flight project? Check out `Z`.

#### 📅 Dates

When is your last day in the office? When do you anticipate being back? If the exact date of your leave is unknown, you can provide an estimated range, or describe the leave in relative terms (e.g., `event + 2 weeks`). Keep this section up to date as your plans change. Here's an example of what that might look like:

| &nbsp;       | Start           | End             | Dates                |
|--------------|-----------------|-----------------|----------------------|
| First Leave  | Event           | Event + 2 weeks | 1/1/2020 - 1/15/2020 |
| Second Leave | Event + 4 weeks | Event + 6 weeks | 2/1/2020 - 2/15/2020 |
{: .table .w-75 .mx-auto}

#### ☎️ Contact preferences

How do you want to be contacted while on leave, if at all? What do you want to be contacted about? What's considered urgent? Set expectations as to how often you will be checking email, Slack, your phone, etc. if you are going to check them at all, so that colleagues know how to get in touch with you, and when to expect a response.

#### ✍️ Points of contact

Enumerate all your ongoing responsibilities, along with a point of contact that will be responsible while you are on leave. Be sure to include "points of escalation" for anything not accounted for within your doc, and be sure to check with each named individual to ensure they are comfortable with the responsibility and have the bandwidth to take it on. Consider a dedicated "responsibilities to handoff" section for any key milestones, deadlines, or events expected to occur while you are out. Example:

| What              | Who    |
|-------------------|--------|
| Widget production | Walter |
| People management | Paula  |
{: .table .w-50 .mx-auto}

#### 📹 Regular meetings

List any recurring meetings you normally run or attend, their frequency, and who if anyone will be taking your place at those meetings. Be explicit with any host or presenter responsibilities, and include links to standing agendas or other supporting documents.

| Meeting           | Frequency      | Responsibilities      | Who   |
|-------------------|----------------|-----------------------|-------|
| Staff meeting     | Mondays @ 10AM | Set agenda, run       | Susie |
| 1:1s with directs | Weekly         | Take notes, follow up | Danny |
{: .table .w-75 .mx-auto}

#### 👥 Rolodex

For everything you touch regularly, list your primary point of contact. This will allow others to unblock themselves if they have a question or request of another department or team. Example:

| What    | Who   |
|---------|-------|
| HR      | Henry |
| IT      | Iris  |
| Legal   | Larry |
| Finance | Fran  |
{: .table .w-50 .mx-auto}

#### 👉 Stuff you touched recently or hope can be picked up while your out

List any projects, initiatives, or other work you've been involved in recently, and any that you hope to be able to hand off to others while you are out. I linked out to our team project board, which captured the in-flight work, and created a "@benbalter's GitHub Fan Fiction" document, with the backlog of ships that I had hoped would be GitHub cinematic universe cannon before going on leave. My fan fiction looked something like this, framed in terms of [problems and solutions](https://ben.balter.com/2018/07/16/problems-not-solutions/):

> **Problem**: I'm going on leave and want to ensure that the work I've been involved with recently is not lost or forgotten while I'm out.
>
> **Ben's solution**: Write a great leave doc.
>
> **Ideal DRI**: @benbalter

#### 📁 Important links

This is your long-tail appendix of anything you think your colleague might need while you're out. This could include links to team documentation, commonly referenced spreadsheets or reports, planning materials, or anything else you think might be useful.

## Share early and often

You could have the best leave or transition document in the world, but if nobody knows about it, it's not much use. Socialize the document with key stakeholders well before your leave to ensure accuracy and completeness[^1], and make your document readily discoverable while you are out by linking to it from your chat status,[^2] the out of office on your calendar, and any other "APIs" you have for communicating with colleagues.

## Putting it all together

If you're preparing to go on leave (or transition to a new role), feel free to use the template below as a starting point.[^3] Of course, if you have any suggestions or proposed improvements, {% github_edit_link "pull requests are always welcome" %}.

```
# @your leave document

## ⏳ TL;DR:

## 📅 Dates

## ☎️ Contact preferences

## ✍️ Points of contact

## 📹 Regular meetings

## 👥 Rolodex

## 👉 Stuff you touched recently or hope can be picked up while your out

## 📁 Important links
```

[^1]: I often ask, "Are there any questions not answered here that you can imagine might arise while I am out?"

[^2]: Using an internal or external link shortener (e.g., `bit.ly/benbalter-leave`) to create a more memorable URL for your colleagues to regularly reference your doc.

[^3]: If you're looking for even more extended leave resources, @isethi has a great talk on [navigating parental leave as a senior engineering leader](https://leaddev.com/san-francisco/video/navigating-parental-leave-as-a-senior-engineering-leader). If you're preparing to go on parental leave, be sure to check out her [parental leave checklist template](https://docs.google.com/document/d/1VjY8xvZtHV_4p_xXUz7rRIIC4VT8B_2NasL950pQk4U/edit#heading=h.oso3zy2cszfb) as well.
