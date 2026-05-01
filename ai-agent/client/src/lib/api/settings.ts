import { apiFetch } from "./client";

export const settingsApi = {
  get: () => apiFetch<Record<string, unknown>>("/settings"),
  update: (data: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/settings", { method: "PUT", body: JSON.stringify(data) }),
};
