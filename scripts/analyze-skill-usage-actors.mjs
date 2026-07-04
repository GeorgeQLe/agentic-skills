#!/usr/bin/env node
import { createReadStream, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative } from 'node:path';
import { createInterface } from 'node:readline';

const repoRoot = process.cwd();
const home = homedir();
const cutoffArgIndex = process.argv.indexOf('--cutoff');
const cutoffIso = cutoffArgIndex >= 0 ? process.argv[cutoffArgIndex + 1] : null;
const cutoffMs = cutoffIso ? Date.parse(cutoffIso) : null;
if (cutoffIso && Number.isNaN(cutoffMs)) {
  throw new Error(`Invalid --cutoff value: ${cutoffIso}`);
}

function withinCutoff(ts) {
  if (!cutoffMs || !ts) return true;
  const value = typeof ts === 'number' ? (ts > 1e12 ? ts : ts * 1000) : Date.parse(ts);
  if (Number.isNaN(value)) return true;
  return value <= cutoffMs;
}

function walk(dir, predicate, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path, predicate, out);
    } else if (predicate(path)) {
      out.push(path);
    }
  }
  return out;
}

function activeSkillNames() {
  const skills = new Set();
  const packsDir = join(repoRoot, 'packs');
  let packNames = [];
  try {
    packNames = readdirSync(packsDir);
  } catch {
    return skills;
  }
  for (const pack of packNames) {
    for (const agent of ['claude', 'codex']) {
      const agentDir = join(packsDir, pack, agent);
      let children = [];
      try {
        children = readdirSync(agentDir, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const child of children) {
        if (!child.isDirectory()) continue;
        try {
          if (statSync(join(agentDir, child.name, 'SKILL.md')).isFile()) {
            skills.add(child.name);
          }
        } catch {
          // Not an active skill directory.
        }
      }
    }
  }
  return skills;
}

const skillNames = activeSkillNames();
const known = (name) => skillNames.has(name);

function inc(map, key, n = 1) {
  map.set(key, (map.get(key) || 0) + n);
}

function top(map, limit = 25) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
}

function iso(ts) {
  if (!ts) return null;
  const date = typeof ts === 'number' ? new Date(ts > 1e12 ? ts : ts * 1000) : new Date(ts);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function updateRange(range, timestamp) {
  const value = iso(timestamp);
  if (!value) return;
  if (!range.first || value < range.first) range.first = value;
  if (!range.last || value > range.last) range.last = value;
}

function leadingSkillInvocation(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  const match = trimmed.match(/^([/$])([a-zA-Z][a-zA-Z0-9-]*)(?:\s|$|[.:,;?!])/);
  if (!match) return null;
  return { prefix: match[1], skill: match[2] };
}

function textFromClaudeContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((part) => part && part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n');
}

function textFromCodexContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((part) => part && typeof part.text === 'string' && (part.type === 'text' || part.type === 'output_text'))
    .map((part) => part.text)
    .join('\n');
}

function stringLeaves(value, out = []) {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) stringLeaves(item, out);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) stringLeaves(item, out);
  }
  return out;
}

const skillPathPatterns = [
  /(?:^|[\s"'`])(?:\.?\.?\/)?\.codex\/skills\/([a-zA-Z0-9-]+)\/SKILL\.md\b/g,
  /(?:^|[\s"'`])(?:\.?\.?\/)?\.claude\/skills\/([a-zA-Z0-9-]+)\/SKILL\.md\b/g,
  /\/\.codex\/skills\/([a-zA-Z0-9-]+)\/SKILL\.md\b/g,
  /\/\.claude\/skills\/([a-zA-Z0-9-]+)\/SKILL\.md\b/g,
  /packs\/[^/\s"'`]+\/(?:codex|claude)\/([a-zA-Z0-9-]+)\/SKILL\.md\b/g,
];

function skillContractLoads(text) {
  const found = [];
  if (!text || typeof text !== 'string') return found;
  for (const pattern of skillPathPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      if (known(match[1])) found.push(match[1]);
    }
  }
  return found;
}

function assistantSkillRecommendations(text) {
  const found = [];
  if (!text || typeof text !== 'string') return found;
  const patterns = [
    /Recommended next skill:\s*[$/]([a-zA-Z][a-zA-Z0-9-]*)/g,
    /Recommended next command:\s*[$/]([a-zA-Z][a-zA-Z0-9-]*)/g,
    /(?:invoke|run|use)\s+[$/]([a-zA-Z][a-zA-Z0-9-]*)\b/gi,
    /\b(?:using|use|invoke|invoking)\s+(?:the\s+)?`?([a-zA-Z][a-zA-Z0-9-]*)`?\s+skill\b/gi,
  ];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      if (known(match[1])) found.push(match[1]);
    }
  }
  return found;
}

async function readJsonl(path, onRecord) {
  let lines = 0;
  let parsed = 0;
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    lines += 1;
    if (!line.trim()) continue;
    try {
      parsed += 1;
      onRecord(JSON.parse(line), path);
    } catch {
      // Keep going; history files can contain partial writes.
    }
  }
  return { lines, parsed };
}

const result = {
  generated_at: new Date().toISOString(),
  cutoff: cutoffIso,
  repo_skill_count: skillNames.size,
  user: {
    prompts: { claude: 0, codex: 0 },
    command_prompts: { claude: 0, codex: 0 },
    known_skill_invocations: { claude: 0, codex: 0 },
    by_skill: {},
    by_source_skill: {},
    date_range: { first: null, last: null },
  },
  agent: {
    rich_session_files: { claude: 0, codex: 0 },
    assistant_messages: { claude: 0, codex: 0 },
    tool_call_records: { claude: 0, codex: 0 },
    contract_load_events: 0,
    contract_load_events_by_source: { claude: 0, codex: 0 },
    contract_load_sessions: 0,
    contract_load_session_skill_pairs: 0,
    contract_load_by_skill: {},
    recommendation_events: 0,
    recommendation_events_by_source: { claude: 0, codex: 0 },
    recommendation_sessions: 0,
    recommendation_session_skill_pairs: 0,
    recommendation_by_skill: {},
    date_range: { first: null, last: null },
    examples: [],
  },
  coverage: {},
};

const userBySkill = new Map();
const userBySourceSkill = new Map();
const contractBySkill = new Map();
const recommendationBySkill = new Map();
const contractSessions = new Set();
const recommendationSessions = new Set();
const contractSessionSkillPairs = new Set();
const recommendationSessionSkillPairs = new Set();

function recordContract(source, sessionId, timestamp, skill, example) {
  inc(contractBySkill, skill);
  result.agent.contract_load_events += 1;
  result.agent.contract_load_events_by_source[source] += 1;
  if (sessionId) contractSessions.add(`${source}:${sessionId}`);
  if (sessionId) contractSessionSkillPairs.add(`${source}:${sessionId}:${skill}`);
  updateRange(result.agent.date_range, timestamp);
  if (result.agent.examples.length < 8) {
    result.agent.examples.push({ type: 'contract-load', source, session_id: sessionId || null, skill, example });
  }
}

function recordRecommendation(source, sessionId, timestamp, skill, example) {
  inc(recommendationBySkill, skill);
  result.agent.recommendation_events += 1;
  result.agent.recommendation_events_by_source[source] += 1;
  if (sessionId) recommendationSessions.add(`${source}:${sessionId}`);
  if (sessionId) recommendationSessionSkillPairs.add(`${source}:${sessionId}:${skill}`);
  updateRange(result.agent.date_range, timestamp);
  if (result.agent.examples.length < 8) {
    result.agent.examples.push({ type: 'recommendation', source, session_id: sessionId || null, skill, example });
  }
}

const claudeHistory = join(home, '.claude/history.jsonl');
const codexHistory = join(home, '.codex/history.jsonl');

result.coverage.claude_history = await readJsonl(claudeHistory, (record) => {
  if (!withinCutoff(record.timestamp)) return;
  const text = record.display || '';
  result.user.prompts.claude += 1;
  updateRange(result.user.date_range, record.timestamp);
  const invocation = leadingSkillInvocation(text);
  if (!invocation) return;
  result.user.command_prompts.claude += 1;
  if (!known(invocation.skill)) return;
  result.user.known_skill_invocations.claude += 1;
  inc(userBySkill, invocation.skill);
  inc(userBySourceSkill, `claude:${invocation.skill}`);
});

result.coverage.codex_history = await readJsonl(codexHistory, (record) => {
  if (!withinCutoff(record.ts)) return;
  const text = record.text || '';
  result.user.prompts.codex += 1;
  updateRange(result.user.date_range, record.ts);
  const invocation = leadingSkillInvocation(text);
  if (!invocation) return;
  result.user.command_prompts.codex += 1;
  if (!known(invocation.skill)) return;
  result.user.known_skill_invocations.codex += 1;
  inc(userBySkill, invocation.skill);
  inc(userBySourceSkill, `codex:${invocation.skill}`);
});

const codexSessionFiles = walk(join(home, '.codex/sessions'), (path) => path.endsWith('.jsonl'));
result.agent.rich_session_files.codex = codexSessionFiles.length;
for (const file of codexSessionFiles) {
  let currentSessionId = null;
  await readJsonl(file, (record) => {
    const timestamp = record.timestamp;
    if (!withinCutoff(timestamp)) return;
    const payload = record.payload || {};
    const sessionId = payload.session_id || payload.id || record.session_id || null;
    if (record.type === 'session_meta') {
      currentSessionId = sessionId || currentSessionId;
      return;
    }
    if (record.type !== 'response_item') return;
    const effectiveSessionId = sessionId || currentSessionId;

    if (payload.type === 'message' && payload.role === 'assistant') {
      result.agent.assistant_messages.codex += 1;
      const text = textFromCodexContent(payload.content);
      for (const skill of assistantSkillRecommendations(text)) {
        recordRecommendation('codex', effectiveSessionId, timestamp, skill, text.slice(0, 180));
      }
    } else if (payload.type === 'function_call') {
      result.agent.tool_call_records.codex += 1;
      let args = payload.arguments || '';
      try {
        args = JSON.stringify(JSON.parse(args));
      } catch {
        // Arguments are still searchable as raw text.
      }
      for (const skill of skillContractLoads(args)) {
        recordContract('codex', effectiveSessionId, timestamp, skill, args.slice(0, 180));
      }
      for (const skill of assistantSkillRecommendations(args)) {
        recordRecommendation('codex', effectiveSessionId, timestamp, skill, args.slice(0, 180));
      }
    }
  });
}

const claudeProjectFiles = walk(join(home, '.claude/projects'), (path) => path.endsWith('.jsonl'));
result.agent.rich_session_files.claude = claudeProjectFiles.length;
for (const file of claudeProjectFiles) {
  await readJsonl(file, (record) => {
    const timestamp = record.timestamp;
    if (!withinCutoff(timestamp)) return;
    const sessionId = record.sessionId || null;
    if (record.type !== 'assistant') return;
    const content = record.message?.content;
    const text = textFromClaudeContent(content);
    if (text) {
      result.agent.assistant_messages.claude += 1;
      for (const skill of assistantSkillRecommendations(text)) {
        recordRecommendation('claude', sessionId, timestamp, skill, text.slice(0, 180));
      }
    }
    for (const leaf of stringLeaves(content)) {
      if (leaf.includes('SKILL.md')) {
        result.agent.tool_call_records.claude += 1;
        for (const skill of skillContractLoads(leaf)) {
          recordContract('claude', sessionId, timestamp, skill, leaf.slice(0, 180));
        }
      }
      for (const skill of assistantSkillRecommendations(leaf)) {
        recordRecommendation('claude', sessionId, timestamp, skill, leaf.slice(0, 180));
      }
    }
  });
}

result.user.by_skill = Object.fromEntries(top(userBySkill, 100));
result.user.by_source_skill = Object.fromEntries(top(userBySourceSkill, 120));
result.agent.contract_load_by_skill = Object.fromEntries(top(contractBySkill, 100));
result.agent.recommendation_by_skill = Object.fromEntries(top(recommendationBySkill, 100));
result.agent.contract_load_sessions = contractSessions.size;
result.agent.recommendation_sessions = recommendationSessions.size;
result.agent.contract_load_session_skill_pairs = contractSessionSkillPairs.size;
result.agent.recommendation_session_skill_pairs = recommendationSessionSkillPairs.size;
result.user.total_prompts = result.user.prompts.claude + result.user.prompts.codex;
result.user.total_command_prompts = result.user.command_prompts.claude + result.user.command_prompts.codex;
result.user.total_known_skill_invocations =
  result.user.known_skill_invocations.claude + result.user.known_skill_invocations.codex;

console.log(JSON.stringify(result, null, 2));
