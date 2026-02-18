# URGENT: CodeQL Workflow Failure - Action Required

## Summary

The CodeQL workflow on the `main` branch is failing because GitHub's **default setup** for code scanning is enabled, which conflicts with the repository's **advanced setup** (custom workflow).

## Error Message

```
Code Scanning could not process the submitted SARIF file:
CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled
```

## Required Action

**You must manually disable the default setup through the GitHub web interface:**

### Steps to Fix

1. Go to: https://github.com/benbalter/benbalter.github.com/settings/security_analysis
2. Find the "CodeQL analysis" section under "Code scanning"
3. Look for a button or setting that says "Default" or "Disable"
4. Click it and select "Advanced" or "Disable default setup"
5. Confirm the change

**This is the ONLY way to disable default setup** - there is no API endpoint or configuration file that works for this.

## Why This Happened

GitHub automatically re-enabled default setup because:
- The advanced setup (custom workflow) hadn't had a successful run in >90 days
- All 24 recent CodeQL workflow runs failed with this same error (circular problem)

## After Fixing

Once you disable default setup in the UI:
1. The next push to `main` will trigger the custom CodeQL workflow
2. The workflow should complete successfully  
3. Future runs will work as expected
4. Keep the workflow running at least once every 90 days to prevent automatic re-enablement

## What Was Changed in This PR

- ❌ Removed `.github/code-scanning.yml` (this file doesn't actually work - it's not a valid GitHub configuration)
- ✅ Added comments to `.github/workflows/codeql.yml` explaining the setup
- ✅ Created comprehensive documentation in `.github/CODEQL-SETUP.md`

## More Information

See `.github/CODEQL-SETUP.md` for detailed documentation about CodeQL setup and troubleshooting.

## Timeline

- **All recent runs failing since:** At least 24 workflow runs ago (all with same error)
- **Most recent failure:** 2026-02-18 00:13:27Z
- **Cause identified:** Default setup automatically re-enabled due to 90+ days of inactivity

---

**This issue will be resolved as soon as default setup is disabled in the repository settings.**
