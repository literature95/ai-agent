import { useMutation, useQueryClient } from "@tanstack/react-query";
import { providersApi } from "@/lib/api/providers";
import { conversationsApi } from "@/lib/api/conversations";
import { settingsApi } from "@/lib/api/settings";
import type { Provider } from "@/types";
import type { TestResult, FetchModelsResult } from "@/lib/api/types";

export function useCreateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Provider, "id" | "createdAt">) => providersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["providers"] }),
  });
}

export function useUpdateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Provider> }) => providersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["providers"] }),
  });
}

export function useDeleteProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => providersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["providers"] }),
  });
}

export function useSetActiveProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => providersApi.setActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["providers"] }),
  });
}

export function useTestProvider() {
  return useMutation({
    mutationFn: (id: string) => providersApi.test(id),
  });
}

export function useFetchModels() {
  return useMutation({
    mutationFn: (id: string) => providersApi.fetchModels(id),
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; providerId: string; model: string; systemPrompt?: string }) =>
      conversationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useUpdateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      conversationsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useDeleteConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conversationsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => settingsApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
