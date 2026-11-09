#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function exists(candidate) {
  try {
    fs.accessSync(candidate, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function realPath(candidate) {
  try {
    return fs.realpathSync(candidate);
  } catch {
    return path.resolve(candidate);
  }
}

function findRepoRoot(start) {
  let current = realPath(start);
  while (true) {
    if (exists(path.join(current, 'hugo.toml')) && exists(path.join(current, 'mcp-hugo-server-go', 'go.mod'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function yamlString(value) {
  return JSON.stringify(value);
}

const pluginRoot = realPath(path.join(__dirname, '..'));
const repoCandidates = [
  process.env.MCP_HUGO_REPO_ROOT,
  pluginRoot,
  process.cwd(),
  path.join(os.homedir(), 'plugins', 'hugo-railway'),
].filter(Boolean);
const repoRoot = repoCandidates.map(findRepoRoot).find(Boolean);
if (!repoRoot) {
  console.error('hugo-railway: could not locate the monorepo. Set MCP_HUGO_REPO_ROOT to the Hugo project root.');
  process.exit(2);
}

const hugoRoot = realPath(process.env.MCP_HUGO_HUGO_ROOT || repoRoot);
const siteRoot = realPath(process.env.MCP_HUGO_SITE_ROOT || path.join(hugoRoot, 'public'));
const contentRoot = realPath(process.env.MCP_HUGO_CONTENT_ROOT || path.join(hugoRoot, 'content'));
const siteURL = process.env.MCP_HUGO_SITE_URL || 'http://localhost:1313';
const siteName = process.env.MCP_HUGO_SITE_NAME || 'Signal CV';
const configPath = path.join(os.tmpdir(), `hugo-railway-${process.pid}.yaml`);

const config = [
  'transport: stdio',
  `site_root: ${yamlString(siteRoot)}`,
  `hugo_root: ${yamlString(hugoRoot)}`,
  `content_root: ${yamlString(contentRoot)}`,
  `site_url: ${yamlString(siteURL)}`,
  `site_name: ${yamlString(siteName)}`,
  'language_default: en',
  'reject_symlinks: true',
  'reject_hidden_paths: true',
].join('\n') + '\n';

fs.writeFileSync(configPath, config, { encoding: 'utf8', mode: 0o600 });

const serverRoot = path.join(repoRoot, 'mcp-hugo-server-go');
const bundledBinary = process.env.MCP_HUGO_SERVER_BINARY || path.join(serverRoot, 'mcp-hugo-server-go');
let command;
let args;
try {
  const executable = fs.statSync(bundledBinary).isFile() && (fs.statSync(bundledBinary).mode & 0o111) !== 0;
  if (executable) {
    command = bundledBinary;
    args = process.argv.slice(2);
  } else {
    command = 'go';
    args = ['run', './cmd/mcp-hugo-server-go', ...process.argv.slice(2)];
  }
} catch {
  command = 'go';
  args = ['run', './cmd/mcp-hugo-server-go', ...process.argv.slice(2)];
}

const result = spawnSync(command, args, {
  cwd: serverRoot,
  env: { ...process.env, MCP_HUGO_SERVER_CONFIG: configPath },
  stdio: 'inherit',
});

try { fs.unlinkSync(configPath); } catch {}

if (result.error) {
  console.error(`hugo-railway: failed to launch ${command}: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
