import { readProjectConfig } from './project-config.mjs';

const HIBERNATED_ARCHIVE_RELATIVE_PATH = 'archive/hibernated-packs/2026-06-poketowork-rebuild';
const HIBERNATED_REACTIVATION_TEXT =
  'Reactivation requires a stable service/API, a known auth contract, and updated smoke tests.';

const PACK_ALIAS_GROUPS = [
  {
    aliases: ['business', 'business_app', 'businessapp', 'product', 'saas', 'business-app'],
    packs: ['business-research', 'customer-lifecycle', 'business-growth', 'business-ops']
  },
  {
    aliases: ['business-research', 'business-discovery', 'discovery', 'research'],
    packs: ['business-research']
  },
  {
    aliases: [
      'customer-lifecycle',
      'customer_lifecycle',
      'lifecycle',
      'journey',
      'customer-journey',
      'customer_journey',
      'user-journey',
      'user_journey',
      'onboarding',
      'conversion',
      'transactions',
      'transaction'
    ],
    packs: ['customer-lifecycle']
  },
  {
    aliases: ['business-growth', 'growth', 'gtm-growth', 'gtm_growth'],
    packs: ['business-growth']
  },
  {
    aliases: ['business-ops', 'business_ops', 'ops', 'business-operations', 'business_operations'],
    packs: ['business-ops']
  },
  {
    aliases: ['creator', 'creator_media', 'creatormedia', 'media', 'founder-media', 'creator-media'],
    packs: ['creator-foundation', 'youtube-ops']
  },
  {
    aliases: [
      'creator-foundation',
      'creator_foundation',
      'creator-strategy',
      'creator_strategy',
      'founder-media-foundation'
    ],
    packs: ['creator-foundation']
  },
  {
    aliases: ['youtube', 'youtube-media', 'youtube_media', 'youtube-ops', 'youtube_ops'],
    packs: ['youtube-ops']
  },
  {
    aliases: [
      'remotion',
      'video-production',
      'video_production',
      'video-build',
      'videobuild',
      'video-script',
      'videoscript'
    ],
    packs: ['remotion']
  },
  {
    aliases: [
      'project-fleet',
      'project_fleet',
      'fleet',
      'portfolio',
      'portfolio-ops',
      'portfolio_ops',
      'clone-spec-store',
      'spin-off',
      'spinoff',
      'spinoff-idea',
      'spinoff_idea'
    ],
    packs: ['project-fleet']
  },
  {
    aliases: ['quality', 'codequality', 'code_quality', 'code-quality'],
    packs: ['code-quality']
  },
  {
    aliases: ['games'],
    packs: ['game']
  },
  {
    aliases: ['dev', 'dev-tool', 'dev-tools', 'developer-tool', 'developer-tools'],
    packs: ['devtool']
  },
  {
    aliases: ['alignment', 'align', 'taste', 'alignment_loop', 'alignmentloop'],
    packs: ['alignment-loop']
  },
  {
    aliases: ['product', 'product-design', 'product_design', 'productdesign', 'ux', 'design'],
    packs: ['product-design']
  },
  {
    aliases: ['agent-work', 'agent_work_admin', 'agent-work-admin', 'work-admin', 'planning', 'planner'],
    packs: ['agent-work-admin']
  },
  {
    aliases: ['review', 'code-review', 'code_review', 'codereview', 'audit'],
    packs: ['code-review']
  },
  {
    aliases: ['code-debug', 'code_debug', 'codedebug', 'debugging'],
    packs: ['code-debug']
  },
  {
    aliases: ['release', 'release-ops', 'release_ops', 'releaseops', 'releases'],
    packs: ['release-ops']
  },
  {
    aliases: ['exec', 'exec-loop', 'exec_loop', 'execloop', 'execution'],
    packs: ['exec-loop']
  },
  {
    aliases: ['research', 'research-admin', 'research_admin'],
    packs: ['research-admin']
  },
  {
    aliases: ['testing', 'product-testing', 'product_testing', 'producttesting', 'uat'],
    packs: ['product-testing']
  },
  {
    aliases: ['docs', 'docs-health', 'docs_health', 'docshealth', 'doc-health'],
    packs: ['docs-health']
  },
  {
    aliases: ['skill', 'skill-dev', 'skill_dev', 'skilldev', 'skills-dev'],
    packs: ['skill-dev']
  },
  {
    aliases: ['walkthrough', 'guided-walkthrough', 'guided_walkthrough', 'guides'],
    packs: ['guided-walkthrough']
  },
  {
    aliases: ['sessions', 'session-analytics', 'session_analytics', 'analytics'],
    packs: ['session-analytics']
  },
  {
    aliases: ['teardown', 'tear-down', 'tear_down'],
    packs: ['teardown']
  },
  {
    aliases: ['maintenance', 'code-maintenance', 'code_maintenance', 'codemaintenance'],
    packs: ['code-maintenance']
  },
  {
    aliases: ['git', 'gitops', 'git-ops', 'git_ops'],
    packs: ['gitops']
  },
  {
    aliases: ['website', 'website-polish', 'website_polish'],
    packs: ['website-polish']
  },
  {
    aliases: ['report', 'report-gen', 'report_gen', 'reportgen', 'reports'],
    packs: ['report-gen']
  },
  {
    aliases: ['context', 'context-transfer', 'context_transfer'],
    packs: ['context-transfer']
  },
  {
    aliases: ['bridge', 'agent-bridge', 'agent_bridge'],
    packs: ['agent-bridge']
  },
  {
    aliases: ['knowledge', 'knowledge-check', 'knowledge_check', 'quiz'],
    packs: ['knowledge-check']
  },
  {
    aliases: ['repo', 'repo-maintenance', 'repo_maintenance'],
    packs: ['repo-maintenance']
  },
  {
    aliases: ['exec-profile', 'exec_profile', 'execprofile'],
    packs: ['exec-profile']
  },
  {
    aliases: ['alignment-page', 'alignment-page-admin', 'alignment_page_admin'],
    packs: ['alignment-page-admin']
  },
  {
    aliases: ['vard', 'viral', 'viral-app', 'viral_app', 'rapid-app', 'rapid_app'],
    packs: ['vard']
  },
  {
    aliases: ['ord', 'oss-rapid', 'oss_rapid', 'rapid-oss', 'rapid_oss', 'oss-dist', 'oss_dist'],
    packs: ['ord']
  }
];

const HIBERNATED_PACK_ALIAS_GROUPS = [
  {
    aliases: [
      'business-app-kanban',
      'business_app_kanban',
      'businessapp-kanban',
      'businessapp_kanban',
      'business-kanban',
      'business_kanban',
      'saas-kanban',
      'saas_kanban'
    ],
    pack: 'business-app-kanban'
  },
  {
    aliases: [
      'devtool-kanban',
      'devtool_kanban',
      'dev-kanban',
      'dev_kanban',
      'dev-tool-kanban',
      'dev-tool_kanban',
      'dev-tools-kanban',
      'dev-tools_kanban',
      'developer-tool-kanban',
      'developer-tool_kanban',
      'developer-tools-kanban',
      'developer-tools_kanban'
    ],
    pack: 'devtool-kanban'
  },
  {
    aliases: ['game-kanban', 'game_kanban', 'games-kanban', 'games_kanban'],
    pack: 'game-kanban'
  },
  {
    aliases: ['poketowork-kanban', 'poketowork_kanban', 'poketo-work-kanban', 'poketo_work_kanban'],
    pack: 'poketowork-kanban'
  }
];

const SHARED_KANBAN_SKILLS = [
  'brainstorm-kanban',
  'exec-kanban',
  'roadmap-kanban',
  'ship-end-kanban',
  'ship-kanban',
  'spec-interview-kanban'
];

const HIBERNATED_SKILL_PACKS = new Map([
  ...SHARED_KANBAN_SKILLS.map((skill) => [
    skill,
    ['business-app-kanban', 'devtool-kanban', 'game-kanban', 'poketowork-kanban']
  ]),
  ['poketo-kanban', ['poketowork-kanban']],
  ['sync-roadmap-kanban', ['poketowork-kanban']]
]);

const INSTALL_COMPATIBILITY_ALIASES = new Set([
  'business-app',
  'business-discovery',
  'creator-media'
]);

function firstMatchingAlias(groups, token) {
  return groups.find((group) => group.aliases.includes(token));
}

export function normalizePack(token) {
  if (!token || token === 'pack' || token === 'packs') {
    return [];
  }

  const group = firstMatchingAlias(PACK_ALIAS_GROUPS, token);
  if (group) {
    return [...group.packs];
  }

  return [token];
}

export function canonicalHibernatedPack(token) {
  const group = firstMatchingAlias(HIBERNATED_PACK_ALIAS_GROUPS, token);
  return group?.pack || null;
}

export function hibernatedPacksForSkill(skill) {
  return [...(HIBERNATED_SKILL_PACKS.get(skill) || [])];
}

export function hibernatedSkillNamesForPack(pack) {
  return [...HIBERNATED_SKILL_PACKS.entries()]
    .filter(([, packs]) => packs.includes(pack))
    .map(([skill]) => skill)
    .sort((a, b) => a.localeCompare(b));
}

export function tokenizePackArgs(args) {
  const tokens = [];

  for (const raw of args) {
    const parts = String(raw).replaceAll(',', ' ').split(/\s+/);
    for (const part of parts) {
      let token = part.replace(/,$/, '');
      if (token.startsWith('pack:')) {
        token = token.slice('pack:'.length);
      }
      if (!token || token === 'pack' || token === 'packs') {
        continue;
      }
      tokens.push(token);
    }
  }

  return tokens;
}

function activePackNames(manifest) {
  return (manifest.packs || [])
    .filter((pack) => pack.status === undefined || pack.status === 'active')
    .map((pack) => pack.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function normalizePackTitle(title) {
  return String(title || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function activePackTitleMap(manifest) {
  const map = new Map();

  for (const pack of manifest.packs || []) {
    if (!pack.name || (pack.status !== undefined && pack.status !== 'active')) {
      continue;
    }

    const title = normalizePackTitle(pack.title);
    if (!title || map.has(title)) {
      continue;
    }
    map.set(title, pack.name);
  }

  return map;
}

function packTitleToken(raw, activePackTitles) {
  let token = String(raw).trim().replace(/,$/, '');
  if (token.startsWith('pack:')) {
    token = token.slice('pack:'.length);
  }
  if (!token || token === 'pack' || token === 'packs') {
    return null;
  }

  const title = token.replace(/\s+/g, ' ').trim();
  return activePackTitles.has(normalizePackTitle(title)) ? title : null;
}

function tokenizeInstallArgs(args, activePackTitles) {
  const tokens = [];

  for (const raw of args) {
    const titleToken = packTitleToken(raw, activePackTitles);
    if (titleToken) {
      tokens.push(titleToken);
      continue;
    }
    tokens.push(...tokenizePackArgs([raw]));
  }

  return tokens;
}

function availablePacksInline(manifest) {
  const names = activePackNames(manifest);
  if (names.length === 0) {
    return '(none)';
  }

  return names.reduce((output, name, index) => {
    if (index === 0) {
      return name;
    }
    return `${output}${index % 2 === 1 ? ',' : ' '}${name}`;
  }, '');
}

function skillInstallSourceMap(manifest) {
  const map = new Map();
  const skills = [...(manifest.skills || [])].sort((a, b) => {
    return String(a.path || '').localeCompare(String(b.path || ''));
  });

  for (const skill of skills) {
    if (skill.installable === false || String(skill.path || '').split('/').includes('archive')) {
      continue;
    }
    if (!skill.name || map.has(skill.name)) {
      continue;
    }
    if (skill.pack) {
      map.set(skill.name, skill.pack);
    } else if (skill.scope === 'base') {
      map.set(skill.name, 'base');
    }
  }

  return map;
}

function fuzzyMatchSkills(token, skillPacks) {
  const suffix = [];
  const prefix = [];
  const substring = [];

  for (const [skill, pack] of skillPacks) {
    if (skill === token) continue;
    if (skill.endsWith(`-${token}`)) {
      suffix.push({ skill, pack });
    } else if (skill.startsWith(`${token}-`)) {
      prefix.push({ skill, pack });
    } else if (skill.includes(token)) {
      substring.push({ skill, pack });
    }
  }

  if (suffix.length > 0) return suffix;
  if (prefix.length > 0) return prefix;
  if (substring.length > 0) return substring;
  return [];
}

function fuzzyMatchError(token, matches) {
  const lines = matches.map((m) => `  ${m.skill} (${m.pack})`).join('\n');
  return new Error(`Ambiguous skill name '${token}'. Did you mean:\n${lines}`);
}

function editDistance(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }

  return prev[b.length];
}

function suggestNames(token, manifest) {
  const candidates = [
    ...new Set([...activePackNames(manifest), ...skillInstallSourceMap(manifest).keys()])
  ];

  const maxDistance = token.length <= 4 ? 1 : 2;
  const scored = [];

  for (const candidate of candidates) {
    if (candidate === token) continue;

    let substring = false;
    if (
      candidate.endsWith(`-${token}`) ||
      candidate.startsWith(`${token}-`) ||
      candidate.includes(token)
    ) {
      substring = true;
    }

    const distance = editDistance(token, candidate);
    if (!substring && distance > maxDistance) continue;

    scored.push({ candidate, substring, distance });
  }

  scored.sort((a, b) => {
    if (a.substring !== b.substring) return a.substring ? -1 : 1;
    if (a.distance !== b.distance) return a.distance - b.distance;
    return a.candidate.localeCompare(b.candidate);
  });

  return scored.slice(0, 3).map((entry) => entry.candidate);
}

function enabledSkillPackMap(projectRoot) {
  const config = readProjectConfig(projectRoot);
  if (!config?.enabled_skills || typeof config.enabled_skills !== 'object') {
    return new Map();
  }
  return new Map(Object.entries(config.enabled_skills));
}

function allPacksExist(packs, activePacks) {
  return packs.length > 0 && packs.every((pack) => activePacks.has(pack));
}

function unknownNameError(token, manifest) {
  const suggestions = suggestNames(token, manifest);
  const didYouMean = suggestions.length ? `\nDid you mean: ${suggestions.join(', ')}?` : '';
  return new Error(`Unknown pack or skill '${token}'.${didYouMean} Available packs: ${availablePacksInline(manifest)}\nRun 'npx skillpacks list' to see all available skills.`);
}

function hibernatedPackError(requested, pack) {
  return new Error(
    [
      `ERROR: PoketoWork kanban pack '${pack}' is hibernated while Poketo.work is being rebuilt.`,
      `Requested: ${requested}`,
      `Archive: ${HIBERNATED_ARCHIVE_RELATIVE_PATH}/${pack}`,
      HIBERNATED_REACTIVATION_TEXT,
      `No active install is available. To clean up a stale project designation, run: scripts/pack.sh remove ${pack}`
    ].join('\n')
  );
}

function hibernatedSkillError(skill, packs) {
  return new Error(
    [
      `ERROR: PoketoWork kanban skill '${skill}' is archived in hibernated pack(s): ${packs.join(', ')}`,
      'PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt.',
      `Archive: ${HIBERNATED_ARCHIVE_RELATIVE_PATH}`,
      HIBERNATED_REACTIVATION_TEXT,
      `No active installable pack provides '${skill}'.`
    ].join('\n')
  );
}

function resolveInstallToken(token, context) {
  if (context.skillPacks.has(token)) {
    context.skills.push(token);
    return;
  }

  if (context.activePacks.has(token)) {
    context.packs.push(token);
    return;
  }

  const titlePack = context.activePackTitles.get(normalizePackTitle(token));
  if (titlePack) {
    context.packs.push(titlePack);
    return;
  }

  if (INSTALL_COMPATIBILITY_ALIASES.has(token)) {
    const normalizedPacks = normalizePack(token);
    if (allPacksExist(normalizedPacks, context.activePacks)) {
      context.packs.push(...normalizedPacks);
      return;
    }
  }

  const hibernatedPack = canonicalHibernatedPack(token);
  if (hibernatedPack) {
    throw hibernatedPackError(token, hibernatedPack);
  }

  const hibernatedSkillPacks = hibernatedPacksForSkill(token);
  if (hibernatedSkillPacks.length > 0) {
    throw hibernatedSkillError(token, hibernatedSkillPacks);
  }

  throw unknownNameError(token, context.manifest);
}

function resolveRemoveToken(token, context) {
  const hibernatedPack = canonicalHibernatedPack(token);
  if (hibernatedPack) {
    context.packs.push(hibernatedPack);
    return;
  }

  if (context.enabledSkillPacks.has(token)) {
    context.skills.push(token);
    return;
  }

  const normalizedPacks = normalizePack(token);
  if (allPacksExist(normalizedPacks, context.activePacks)) {
    context.packs.push(...normalizedPacks);
    return;
  }

  if (context.skillPacks.has(token)) {
    context.skills.push(token);
    return;
  }

  const hibernatedSkillPacks = hibernatedPacksForSkill(token);
  if (hibernatedSkillPacks.length > 0) {
    context.skills.push(token);
    return;
  }

  const fuzzyMatches = fuzzyMatchSkills(token, context.skillPacks);
  if (fuzzyMatches.length === 1) {
    console.error(`Resolved '${token}' → '${fuzzyMatches[0].skill}'`);
    context.skills.push(fuzzyMatches[0].skill);
    return;
  }
  if (fuzzyMatches.length > 1) {
    throw fuzzyMatchError(token, fuzzyMatches);
  }

  throw unknownNameError(token, context.manifest);
}

export function resolvePackCommandArgs(command, args, options) {
  if (command !== 'install' && command !== 'remove') {
    throw new Error(`unsupported pack command for Node normalization: ${command}`);
  }
  if (!options?.manifest) {
    throw new Error('manifest is required for pack normalization');
  }

  const context = {
    manifest: options.manifest,
    activePacks: new Set(activePackNames(options.manifest)),
    activePackTitles: activePackTitleMap(options.manifest),
    skillPacks: skillInstallSourceMap(options.manifest),
    enabledSkillPacks: command === 'remove'
      ? enabledSkillPackMap(options.projectRoot || process.cwd())
      : new Map(),
    packs: [],
    skills: []
  };

  const tokens = command === 'install'
    ? tokenizeInstallArgs(args, context.activePackTitles)
    : tokenizePackArgs(args);
  for (const token of tokens) {
    if (command === 'install') {
      resolveInstallToken(token, context);
    } else {
      resolveRemoveToken(token, context);
    }
  }

  if (context.packs.length === 0 && context.skills.length === 0) {
    throw new Error(`${command} requires a pack or skill name`);
  }

  return {
    args: [...context.packs, ...context.skills],
    packs: [...context.packs],
    skills: [...context.skills],
    tokens
  };
}
