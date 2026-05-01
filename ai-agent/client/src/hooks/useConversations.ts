import { useCallback } from "react";
import { useConversationsQuery } from "@/lib/query/queries";
import {
  useCreateConversation,
  useUpdateConversation,
  useDeleteConversation,
} from "@/lib/query/mutations";
import type { ChatMessage } from "@/types";

export function useConversations() {
  const { data: conversations = [], refetch } = useConversationsQuery();
  const createMutation = useCreateConversation();
  const updateMutation = useUpdateConversation();
  const deleteMutation = useDeleteConversation();

  const create = useCallback(
    async (title: string, providerId: string, model: string, systemPrompt?: string) => {
      const result = await createMutation.mutateAsync({ title, providerId, model, systemPrompt });
      await refetch();
      return result;
    },
    [createMutation, refetch],
  );

  const update = useCallback(
    async (id: string, data: { title?: string; messages?: ChatMessage[]; systemPrompt?: string }) => {
      await updateMutation.mutateAsync({ id, data });
      await refetch();
    },
    [updateMutation, refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
      await refetch();
    },
    [deleteMutation, refetch],
  );

  return { conversations, create, update, remove, refetch };
}
