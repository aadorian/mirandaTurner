# `.mirandarc.json` is shipped but not loaded by the extension

**Source:** Exploratory testing session report (16/06/2026)

## Summary

The repository includes `.mirandarc.json` and the README refers to it for lint configuration, but the extension only reads VS Code workspace settings (`miranda.lint.*`). Project-level `.mirandarc.json` is not applied at runtime.

## Steps to reproduce

1. Create a Miranda project with `.mirandarc.json` setting e.g. `"booleanLiteralCase": "off"`
2. Open a `.m` file with lowercase `true`/`false`
3. Compare behavior with the same rule set to `off` in VS Code Settings

## Expected

Lint rules from `.mirandarc.json` apply to the workspace (ESLint-style project config), or documentation clearly states the file is reference-only.

## Actual

- `buildLintConfig` in `src/linter/config.ts` only reads `miranda.lint.*` from VS Code configuration
- `.mirandarc.json` in the extension repo is not parsed by the linter
- README says: *"You can also use `.mirandarc.json` in the project root as a configuration reference"* — ambiguous for users expecting live config

## Suggested fix

**Option A — Implement:** Load and merge `.mirandarc.json` from workspace root (and optionally parent folders), with VS Code settings taking precedence.

**Option B — Document:** Rename or relocate the file (e.g. `mirandarc.example.json`) and clarify in README that only `settings.json` keys are active.

## Files involved

- `.mirandarc.json`
- `src/linter/config.ts`
- `README.md` (Configuration section)

## Environment

- Extension version: 0.1.0
