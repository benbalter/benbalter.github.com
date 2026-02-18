# CodeQL Setup Instructions

## Current Configuration

This repository uses **CodeQL Advanced Setup** with a custom workflow (`.github/workflows/codeql.yml`) that:

- Scans only JavaScript/TypeScript code (not Ruby or other languages)
- Runs on pushes to `main`, pull requests, and weekly on Sundays
- Uses `build-mode: none` (appropriate for JavaScript/TypeScript)

## Important: Default Setup Must Be Disabled

GitHub Code Scanning offers two types of setup:

1. **Default Setup** (GitHub-managed, auto-detects languages)
2. **Advanced Setup** (custom workflow file)

**You can only have ONE type enabled at a time.** Having both will cause the error:

```
CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled
```

## How to Disable Default Setup

Default setup can ONLY be disabled through the GitHub repository settings UI:

1. Navigate to: **Settings** → **Security** → **Code security and analysis**
2. Find "CodeQL analysis" section
3. If default setup is enabled, click the button to disable it or switch to "Advanced"
4. Confirm the change

**Note:** There is no API endpoint or configuration file that can disable default setup. The `.github/code-scanning.yml` file with `default-setup: disabled` is NOT a valid GitHub configuration.

## Why Default Setup Was Re-Enabled

GitHub automatically re-enables default setup if advanced setup is considered "inactive":

- Advanced setup is inactive if CodeQL analysis hasn't run successfully in the last 90 days
- Advanced setup is inactive if the workflow file is deleted or disabled

To prevent automatic re-enablement, ensure the custom workflow runs successfully at least once every 90 days.

## Troubleshooting

If you see CodeQL failures with the error about "default setup is enabled":

1. Check if default setup was automatically re-enabled due to inactivity
2. Disable default setup in repository settings (see steps above)
3. Trigger a manual run of the CodeQL workflow
4. Verify the workflow succeeds

## References

- [GitHub Docs: Advanced Setup for Code Scanning](https://docs.github.com/en/code-security/code-scanning/creating-an-advanced-setup-for-code-scanning)
- [GitHub Docs: Default Setup Overrides](https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/troubleshooting-security-configurations/unexpected-default-setup)
- [CodeQL Action Issue #1528](https://github.com/github/codeql-action/issues/1528)
