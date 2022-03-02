---
title: Using GitHub Actions to get notified when an API response (or web page) changes
description: A customizable GitHub Action workflow that uses cURL, jq, and Twilio to notify you via text message when a web page or API response changes.
---

Given all the uncertainty in the global supply chain these days, I was recently in the dark as to when an eagerly-expected purchase would arrive. Luckily the manufacturer had a hidden API you could call that indicated where in the supply chain the product was as it made its journey around the globe. Better still, as it got closer to delivery, the response also included its estimated delivery date.

Rather than smashing refresh on the endpoint compulsively, I realized I could use GitHub Actions to regularly call the API on my behalf and report back with any changes. These types of easy-on-the-surface projects all too often harbor the risk of over-engineering, so I purposely kept things simple, using `cURL` to fetch the data, [`jq`](https://stedolan.github.io/jq/) to parse the response, and GitHub Action's [native caching library](https://github.com/actions/cache) to maintain state between runs. The implementation was surprisingly easy to implement as a no/low code solution with only a handful of lines of YAML, and it ended up working better than expected.[^1]

If you find yourself needing to track when an API response (or web page) changes - delivery related or otherwise - you're welcome to follow my approach. I used [Twilio's SMS action](https://github.com/twilio-labs/actions-sms) (along with a free trial account) to send a text message when the response changed, but there are a number of existing community Actions available that could be used for notifications, from GitHub Issues, to app-based mobile push, to Slack - you name it.

### Setup

To set up the notify-on-changes GitHub Action to track changes to your own API or web page response, just follow these steps:

1. Save the below snippet as a YAML file in the `.github/workflows/` folder (for example, `.github/workflows/check.yml`) of a public or private GitHub repository.
2. Swap out the `<URL YOU WANT TO CHECK HERE>` placeholder, for the actual API endpoint or web page URL you want to check.[^3]
3. If you want to parse out the JSON response so that you can include a specific field or fields from the response in the notification you send yourself, modify the `jq` query. Otherwise, you can remove the "Parse data" step entirely.
4. If using Twilio to receive notifications via text message, follow [the setup instructions](https://github.com/twilio-labs/actions-sms), saving the keys and phone numbers as [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) and customizing the message for your use case. Otherwise, swap out the "Notify if data has changed" step to use your own notification mechanism.[^2]
5. Commit and effortlessly receive notifications any time the response changes.

### Example workflow

Here's the annotated YAML for the workflow I used, in its entirety:

```yaml
on:
  schedule:
    # Run every hour, on the hour. This can be customized to checking as frequently as every 5 minutes.
    - cron:  '0 * * * *'

name: Check for changes

jobs:
  check:
    runs-on: ubuntu-latest
    steps:

      # Use cURL to fetch the given URL, saving the response to `data.json`
      - name: Fetch data
        run: curl "<URL YOU WANT TO CHECK HERE>" -o data.json

      # Optionally, use `jq` to pull one or more fields from the JSON to include in the SMS message
      - name: Parse data
        id: parse_data
        run: echo '::set-output name=someField::'$(jq -r '.someField' data.json)
          
      # Compare the response to the previous run, using a hash of the response as the cache key
      - name: Fetch Cache
        id: cache
        uses: actions/cache@v2
        with:
          path: data.json
          key: {% raw %}${{ hashFiles('data.json') }}{% endraw %}
      
      # If there was not a cache hit (meaning the response changed), notify me via text message
      # See https://github.com/twilio-labs/actions-sms for setup instructions
      # You could use a different notification action here, so long as you include the `if` condition below
      - name: Notify if data has changed
        uses: twilio-labs/actions-sms@v1
        if: steps.cache.outputs.cache-hit != 'true'
        env:
          TWILIO_ACCOUNT_SID: {% raw %}${{ secrets.TWILIO_ACCOUNT_SID }}{% endraw %}
          TWILIO_API_KEY: {% raw %}${{ secrets.TWILIO_API_KEY }}{% endraw %}
          TWILIO_API_SECRET: {% raw %}${{ secrets.TWILIO_API_SECRET }}{% endraw %}
        with:
          fromPhoneNumber: {% raw %}${{ secrets.from_phone }}{% endraw %}
          toPhoneNumber: {% raw %}${{ secrets.to_phone }}{% endraw %}
          message: "There's been a change! someField is now {% raw %}${{ steps.parse_data.outputs.someField }}{% endraw %}."
```

### Conclusion

I hope that my unnecessarily obsessive product tracking can help others to track status changes or generally save others from needlessly hitting refresh repeatedly for other reasons. If you do adapt the workflow for your own creative use, I'd love to hear about it. Happy change tracking!

[^1]: In fact, the purchase arrived ahead of schedule, but I don't think I can give the workflow credit for that.

[^2]: If you use a different notification mechanism, be sure to include the `if: steps.cache.outputs.cache-hit != 'true'` conditional, to ensure that the notification is only sent if the response has changed.

[^3]: There's no reason it couldn't be an authenticated endpoint that you're checking, just be sure to store your API key as a [repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets), to keep the secret out of your codebase.
