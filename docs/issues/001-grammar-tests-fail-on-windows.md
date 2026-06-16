# `test:grammar` / `test:all` fails on Windows (glob not resolved)

**Source:** Exploratory testing session report (16/06/2026)

## Summary

`npm run test:all` fails on Windows at the grammar test step with `ERROR no test cases found`. The Mocha unit suite (122 tests) passes; grammar tests pass when run individually.

## Steps to reproduce

1. Clone the repo on Windows 10/11
2. Run `npm install`
3. Run `npm run test:all`

## Expected

All tests pass, including 6 TextMate grammar tests documented in README.

## Actual

```
> MirandaTurner@0.1.0 test:grammar
> vscode-tmgrammar-test -g syntaxes/miranda.tmLanguage.json 'src/test/grammar/**/*.test.m'

ERROR no test cases found
```

## Root cause

The glob pattern `'src/test/grammar/**/*.test.m'` in `package.json` is not expanded by `vscode-tmgrammar-test` on Windows (PowerShell/cmd).

## Workaround

Run each grammar test file explicitly:

```powershell
npx vscode-tmgrammar-test -g syntaxes/miranda.tmLanguage.json src/test/grammar/comments.test.m
# ... repeat for all 6 files
```

## Suggested fix

- Use a cross-platform glob in the npm script (e.g. enumerate files with Node or use a pattern that works on Windows)
- Example: `"test:grammar": "node scripts/run-grammar-tests.js"`

## Environment

- OS: Windows 10
- Extension version: 0.1.0
- Node/npm: current LTS
