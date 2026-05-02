import { apiFetch } from "./client";
import type { Conversation } from "@/types";

export const conversationsApi = {
  getAll: () => apiFetch<(Conversation & { messageCount: number })[]>("/conversations"),

  get: (id: string) => apiFetch<Conversation>(`/conversations/${id}`),

  create: (data: Partial<Conversation>) =>
    apiFetch<Conversation>("/conversations", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Conversation>) =>
    apiFetch<Conversation>(`/conversations/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/conversations/${id}`, { method: "DELETE" }),
};
