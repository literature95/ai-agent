import { useQuery } from "@tanstack/react-query";
import { providersApi } from "@/lib/api/providers";
import { conversationsApi } from "@/lib/api/conversations";
import { settingsApi } from "@/lib/api/settings";

export function useProvidersQuery() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: providersApi.getAll,
  });
}

export function useActiveProviderQuery() {
  return useQuery({
    queryKey: ["providers"],
    queryFn: providersApi.getAll,
    select: (providers) => providers.find((p) => p.isActive) || null,
  });
}

export function useConversationsQuery() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationsApi.getAll,
  });
}

export function useConversationQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => conversationsApi.get(id!),
    enabled: !!id,
  });
}

export function useSettingsQuery() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
  });
}
