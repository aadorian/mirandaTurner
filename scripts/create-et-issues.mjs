#!/usr/bin/env node
/**
 * Create GitHub issues from docs/issues/*.md (exploratory testing findings).
 * Requires GITHUB_TOKEN or GH_TOKEN with repo scope.
 *
 * Usage: node scripts/create-et-issues.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const owner = "aadorian";
const repo = "mirandaTurner";

const issues = [
  {
    file: "001-grammar-tests-fail-on-windows.md",
    title: "test:grammar / test:all fails on Windows (glob not resolved)",
    labels: ["bug", "windows", "tests"],
  },
  {
    file: "002-dev-scripts-require-bash-on-windows.md",
    title: "npm run dev / guide / start require Bash on Windows",
    labels: ["bug", "windows", "documentation"],
  },
  {
    file: "003-mirandarc-json-not-loaded.md",
    title: ".mirandarc.json is shipped but not loaded by the extension",
    labels: ["bug", "documentation"],
  },
];

async function createIssue({ title, body, labels }) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, labels }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

async function main() {
  if (!token) {
    console.error("Set GITHUB_TOKEN or GH_TOKEN with repo scope, then re-run.");
    process.exit(1);
  }

  const created = [];
  for (const spec of issues) {
    const body = readFileSync(join(root, "docs", "issues", spec.file), "utf8");
    const issue = await createIssue({ title: spec.title, body, labels: spec.labels });
    created.push({ number: issue.number, url: issue.html_url, title: spec.title });
    console.log(`Created #${issue.number}: ${issue.html_url}`);
  }
  return created;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
