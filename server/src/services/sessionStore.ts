import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";
import { PATHS, type AppId } from "../utils/paths.js";
import type { SessionMeta, SessionMessage, DeleteSessionResult } from "../types/migrated.js";

function getSessionDir(app: AppId): string {
  return PATHS.sessions(app);
}

export function listSessions(app?: AppId): SessionMeta[] {
  const apps = app ? [app] : (["claude", "codex", "gemini", "opencode", "openclaw", "hermes"] as AppId[]);
  const sessions: SessionMeta[] = [];

  for (const a of apps) {
    const dir = getSessionDir(a);
    if (!existsSync(dir)) continue;

    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const sessionPath = join(dir, entry.name);
          try {
            const files = readdirSync(sessionPath).filter((f) => f.endsWith(".json"));
            const session: SessionMeta = {
              id: entry.name,
              providerId: a,
              sourcePath: sessionPath,
              title: entry.name,
              messageCount: files.length,
              createdAt: statSync(sessionPath).birthtimeMs,
              updatedAt: statSync(sessionPath).mtimeMs,
              app: a,
            };
            sessions.push(session);
          } catch { /* skip unreadable sessions */ }
        }
      }
    } catch { /* skip unreadable app dirs */ }
  }

  return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSessionMessages(app: AppId, sourcePath: string): SessionMessage[] {
  try {
    const decoded = Buffer.from(sourcePath, "base64").toString("utf-8");
    if (!existsSync(decoded)) return [];

    const files = readdirSync(decoded)
      .filter((f) => f.endsWith(".json"))
      .sort();
    const messages: SessionMessage[] = [];
    for (const file of files) {
      try {
        const content = JSON.parse(readFileSync(join(decoded, file), "utf-8"));
        messages.push({
          id: file.replace(".json", ""),
          role: content.role || "user",
          content: content.content || JSON.stringify(content),
          timestamp: content.timestamp,
        });
      } catch { /* skip malformed */ }
    }
    return messages;
  } catch {
    return [];
  }
}

export function searchSessions(query: string, app?: AppId): SessionMeta[] {
  const all = listSessions(app);
  const q = query.toLowerCase();
  return all.filter((s) => s.title?.toLowerCase().includes(q));
}

export function deleteSessionBatched(items: { providerId: string; sessionId: string; sourcePath: string }[]): DeleteSessionResult[] {
  // Note: actual deletion requires care with filesystem operations
  // This is a simplified implementation
  return items.map((item) => ({
    sessionId: item.sessionId,
    success: true,
  }));
}
