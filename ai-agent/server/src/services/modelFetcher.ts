import { buildModelUrlCandidates } from "../utils/urlBuilder.js";
import type { FetchedModel, Provider } from "../types/index.js";

export async function fetchModels(provider: Pick<Provider, "baseUrl" | "apiKey">, modelsUrlOverride?: string): Promise<FetchedModel[]> {
  const candidates = buildModelUrlCandidates(provider.baseUrl, modelsUrlOverride);

  let lastError: Error | null = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${provider.apiKey}` },
        signal: AbortSignal.timeout(15000),
      });

      if (response.status === 404 || response.status === 405) {
        continue;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }

      const data = await response.json() as { data?: Array<{ id: string; owned_by?: string }> };
      const models = (data.data || []).map((m) => ({
        id: m.id,
        ownedBy: m.owned_by || null,
      }));
      models.sort((a, b) => a.id.localeCompare(b.id));
      return models;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.message.includes("HTTP") && !lastError.message.includes("404") && !lastError.message.includes("405")) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("All model fetch candidates failed");
}
