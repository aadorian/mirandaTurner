#!/usr/bin/env node
/**
 * Create GitHub issues using GITHUB_TOKEN/GH_TOKEN or git credential helper.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const owner = "aadorian";
const repo = "mirandaTurner";

const issues = [
  {
    file: "001-grammar-tests-fail-on-windows.md",
    title: "test:grammar / test:all fails on Windows (glob not resolved)",
    labels: ["bug"],
  },
  {
    file: "002-dev-scripts-require-bash-on-windows.md",
    title: "npm run dev / guide / start require Bash on Windows",
    labels: ["bug"],
  },
  {
    file: "003-mirandarc-json-not-loaded.md",
    title: ".mirandarc.json is shipped but not loaded by the extension",
    labels: ["bug"],
  },
];

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  const result = spawnSync("git", ["credential", "fill"], {
    input: "protocol=https\nhost=github.com\n\n",
    encoding: "utf8",
  });
  if (result.status !== 0) return null;
  const password = result.stdout
    .split("\n")
    .find((line) => line.startsWith("password="))
    ?.slice("password=".length);
  return password || null;
}

async function createIssue(token, { title, body, labels }) {
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
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error("No GitHub token available. Run: gh auth login");
    process.exit(1);
  }

  for (const spec of issues) {
    const body = readFileSync(join(root, "docs", "issues", spec.file), "utf8");
    const issue = await createIssue(token, {
      title: spec.title,
      body,
      labels: spec.labels,
    });
    console.log(`Created #${issue.number}: ${issue.html_url}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
