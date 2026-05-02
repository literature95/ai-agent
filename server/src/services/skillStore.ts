import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { PATHS, type AppId } from "../utils/paths.js";
import type {
  InstalledSkill, DiscoverableSkill, UnmanagedSkill,
  ImportSkillSelection, SkillBackupEntry, SkillUpdateInfo,
  SkillsShSearchResult, SkillRepo,
} from "../types/migrated.js";

const DATA_DIR = PATHS.aiAgentData;
const SKILLS_DIR = PATHS.skillsDir;
const BACKUP_DIR = PATHS.skillsBackupDir;
const SKILLS_FILE = join(DATA_DIR, "skills.json");
const REPOS_FILE = join(DATA_DIR, "skill_repos.json");

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(SKILLS_DIR)) mkdirSync(SKILLS_DIR, { recursive: true });
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
}

function readSkills(): InstalledSkill[] {
  ensureDir();
  if (!existsSync(SKILLS_FILE)) { writeFileSync(SKILLS_FILE, "[]", "utf-8"); return []; }
  return JSON.parse(readFileSync(SKILLS_FILE, "utf-8"));
}

function writeSkills(skills: InstalledSkill[]): void {
  ensureDir();
  writeFileSync(SKILLS_FILE, JSON.stringify(skills, null, 2), "utf-8");
}

function readRepos(): SkillRepo[] {
  ensureDir();
  if (!existsSync(REPOS_FILE)) { writeFileSync(REPOS_FILE, "[]", "utf-8"); return []; }
  return JSON.parse(readFileSync(REPOS_FILE, "utf-8"));
}

function writeRepos(repos: SkillRepo[]): void {
  ensureDir();
  writeFileSync(REPOS_FILE, JSON.stringify(repos, null, 2), "utf-8");
}

// --- Skills ---

export function getInstalledSkills(): InstalledSkill[] {
  return readSkills();
}

export function installSkill(skill: DiscoverableSkill, currentApp: AppId): InstalledSkill {
  const skills = readSkills();
  const now = Date.now();
  const installed: InstalledSkill = {
    id: uuid(),
    name: skill.name,
    description: skill.description,
    version: skill.version,
    repo: skill.repo,
    directory: skill.directory,
    enabledApps: { [currentApp]: true },
    installedAt: now,
    updatedAt: now,
  };
  skills.push(installed);
  writeSkills(skills);
  return installed;
}

export function uninstallSkill(id: string): { success: boolean; backupPath?: string } {
  const skills = readSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) return { success: false };
  const filtered = skills.filter((s) => s.id !== id);
  writeSkills(filtered);
  return { success: true };
}

export function toggleSkillApp(id: string, app: AppId, enabled: boolean): InstalledSkill | null {
  const skills = readSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) return null;
  skill.enabledApps[app] = enabled;
  skill.updatedAt = Date.now();
  writeSkills(skills);
  return skill;
}

export function getSkillBackups(): SkillBackupEntry[] {
  ensureDir();
  if (!existsSync(BACKUP_DIR)) return [];
  return readdirSync(BACKUP_DIR).map((f) => ({
    id: f,
    skillName: f.replace(/\.zip$/, ""),
    backupPath: join(BACKUP_DIR, f),
    createdAt: 0,
  }));
}

// --- Repos ---

export function getRepos(): SkillRepo[] {
  return readRepos();
}

export function addRepo(repo: SkillRepo): SkillRepo {
  const repos = readRepos();
  const entry: SkillRepo = { ...repo, addedAt: Date.now() };
  repos.push(entry);
  writeRepos(repos);
  return entry;
}

export function removeRepo(owner: string, name: string): boolean {
  const repos = readRepos();
  const filtered = repos.filter((r) => r.owner !== owner || r.name !== name);
  if (filtered.length === repos.length) return false;
  writeRepos(filtered);
  return true;
}

// --- Discovery ---

export function discoverSkills(): DiscoverableSkill[] {
  // Returns skills from configured repos
  // Real implementation would git clone/fetch repos and parse skill manifests
  return [];
}

export function searchSkillsSh(_query: string, _limit = 20, _offset = 0): SkillsShSearchResult {
  // Real implementation would call skills.sh API
  return { results: [], total: 0 };
}
