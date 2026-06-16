# `npm run dev` / `guide` / `start` require Bash on Windows

**Source:** Exploratory testing session report (16/06/2026)

## Summary

The documented quick-development workflow (`npm run dev`, `npm run guide`, `npm start`) invokes `bash scripts/dev.sh` and is not usable from native Windows PowerShell or cmd without WSL or Git Bash.

## Steps to reproduce

1. On Windows, open PowerShell in the repo root
2. Run `npm run dev`

## Expected

Extension dev host opens with `examples/fib.m` (per README).

## Actual

Script fails because `bash` is not available or `EDITOR_CLI=code-insiders bash scripts/dev.sh` does not run in PowerShell.

## Current scripts (`package.json`)

```json
"dev": "EDITOR_CLI=code-insiders bash scripts/dev.sh",
"guide": "EDITOR_CLI=code-insiders bash scripts/dev.sh --walkthrough --skip-tests",
"start": "EDITOR_CLI=code-insiders bash scripts/dev.sh"
```

## Suggested fix

- Add a cross-platform Node or PowerShell dev launcher (`scripts/dev.mjs` or `scripts/dev.ps1`)
- Document Windows-specific steps in README (F5 / `code --extensionDevelopmentPath`)
- Optionally detect platform in npm scripts (`node scripts/dev.js`)

## Environment

- OS: Windows 10
- Shell: PowerShell
