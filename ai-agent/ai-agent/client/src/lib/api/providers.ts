import { apiFetch } from "./client";
import type { Provider } from "@/types";
import type { TestResult, FetchModelsResult } from "./types";

export interface ProvidersResponse {
  providers: Provider[];
  currentProviderId: string;
}

export const providersApi = {
  getAll: async (): Promise<ProvidersResponse> => {
    const res = await apiFetch<ProvidersResponse>("/providers");
    return res;
  },

  get: (id: string) => apiFetch<Provider>(`/providers/${id}`),

  create: (data: Omit<Provider, "id" | "createdAt">) =>
    apiFetch<Provider>("/providers", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Provider>) =>
    apiFetch<Provider>(`/providers/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/providers/${id}`, { method: "DELETE" }),

  setActive: (id: string) =>
    apiFetch<Provider>(`/providers/${id}/set-active`, { method: "POST" }),

  test: (id: string) =>
    apiFetch<TestResult>(`/providers/${id}/test`, { method: "POST" }),

  fetchModels: (id: string) =>
    apiFetch<FetchModelsResult>(`/providers/${id}/fetch-models`, { method: "POST" }),
};
