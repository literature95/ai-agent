const COMPAT_SUFFIXES = [
  "/api/claudecode", "/api/anthropic", "/apps/anthropic",
  "/api/coding", "/claudecode", "/anthropic", "/step_plan",
  "/coding", "/claude", "/v1/chat/completions",
];

export function buildModelUrlCandidates(baseUrl: string, modelsUrlOverride?: string): string[] {
  if (modelsUrlOverride?.trim()) return [modelsUrlOverride.trim()];

  const trimmed = baseUrl.trim().replace(/\/$/, "");
  const candidates: string[] = [];

  if (trimmed.endsWith("/v1")) {
    candidates.push(`${trimmed}/models`);
  } else {
    candidates.push(`${trimmed}/v1/models`);
  }

  const sortedSuffixes = [...COMPAT_SUFFIXES].sort((a, b) => b.length - a.length);
  for (const suffix of sortedSuffixes) {
    if (trimmed.endsWith(suffix)) {
      const root = trimmed.slice(0, -suffix.length);
      candidates.push(`${root}/v1/models`);
      candidates.push(`${root}/models`);
      break;
    }
  }

  return [...new Set(candidates)];
}
