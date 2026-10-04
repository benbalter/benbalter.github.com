# CI required checks

The `Main` repository ruleset decides what a PR needs before it can merge. It's the source of truth, so check it rather than a copy:

```bash
gh api repos/benbalter/benbalter.github.com/rules/branches/main
```

As of October 2026 it requires these status checks, plus CodeQL results (the ruleset's code scanning rule):

| Check | Workflow |
| --- | --- |
| `Content Linting` | [`ci.yml`](../.github/workflows/ci.yml) |
| `Code Tests` | [`ci.yml`](../.github/workflows/ci.yml) |
| `Run Astro Check` | [`ci.yml`](../.github/workflows/ci.yml) |
| `Run Vitest Tests` | [`ci.yml`](../.github/workflows/ci.yml) |
| `Build Astro Site` | [`astro-e2e.yml`](../.github/workflows/astro-e2e.yml) |
| `Lighthouse CI` | [`astro-e2e.yml`](../.github/workflows/astro-e2e.yml) |
| `Playwright Tests` | [`astro-e2e.yml`](../.github/workflows/astro-e2e.yml) |

`LanguageTool Grammar` (`ci.yml`) runs on every PR but isn't required.

## Never path-filter a required workflow

A workflow with a `paths` or `paths-ignore` filter on its `push`/`pull_request` triggers doesn't run at all when the filter excludes a PR. Its checks then never report, and a required check that never reports blocks the merge with everything else green. The only way past it is an admin bypass.

This has bitten three times: E2E checks on Actions-only PRs (#2064), CI checks on PRs touching only `public/` or Vale config (#2066), and CodeQL on post-only PRs once the ruleset gained the code scanning rule (#2072).

So:

- **Workflows that report required checks, or that the code scanning rule waits on, have no trigger-level path filter.** That covers `ci.yml`, `astro-e2e.yml`, and `codeql.yml`.
- **To skip expensive work, filter inside the workflow.** `astro-e2e.yml` has a `changes` job ([`dorny/paths-filter`](https://github.com/dorny/paths-filter)) and gates the build on its output. GitHub counts a skipped job as passing a required check, while a workflow that never ran counts as missing.
- **When adding a required check to the ruleset**, confirm its workflow runs on every PR, then update the table above.
