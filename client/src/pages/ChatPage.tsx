import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useActiveProviderQuery, useConversationQuery } from "@/lib/query/queries";
import { useChat } from "@/hooks/useChat";
import { useConversations } from "@/hooks/useConversations";
import { DEFAULT_SYSTEM_PROMPT } from "@/config/constants";

export function ChatPage() {
  const { t } = useTranslation();
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  const { data: activeProvider } = useActiveProviderQuery();
  const provider = activeProvider || null;

  const { data: conversation } = useConversationQuery(conversationId);
  const { create, update } = useConversations();

  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [currentConvId, setCurrentConvId] = useState<string | null>(conversationId || null);
  const createdConvRef = useRef<string | null>(null);

  const {
    messages,
    isStreaming,
    send,
    stop,
    loadMessages,
    clearMessages,
  } = useChat({
    provider,
    systemPrompt,
  });

  // Sync currentConvId with URL param
  useEffect(() => {
    if (conversationId !== currentConvId) {
      setCurrentConvId(conversationId || null);
    }
  }, [conversationId]);

  // Clear messages when switching to new chat (no conversationId)
  useEffect(() => {
    if (!conversationId) {
      clearMessages();
      setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    }
  }, [conversationId]);

  // Load conversation when switching — only if it has messages to load
  useEffect(() => {
    if (conversation) {
      // Skip loading for conversations we just created in this session
      if (createdConvRef.current === conversation.id) {
        createdConvRef.current = null;
        if (conversation.systemPrompt) setSystemPrompt(conversation.systemPrompt);
        return;
      }
      if (conversation.messages && conversation.messages.length > 0) {
        loadMessages(conversation.messages);
      }
      if (conversation.systemPrompt) setSystemPrompt(conversation.systemPrompt);
    }
  }, [conversation?.id]);

  // Auto-create conversation on first message
  const ensureConversation = useCallback(async () => {
    if (!currentConvId && provider) {
      const conv = await create("New Chat", provider.id, provider.model, systemPrompt);
      createdConvRef.current = conv.id;
      setCurrentConvId(conv.id);
      navigate(`/chat/${conv.id}`, { replace: true });
      return conv.id;
    }
    return currentConvId;
  }, [currentConvId, provider, systemPrompt, create, navigate]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!provider) {
        toast.error(t("chat.noProviderError"));
        return;
      }
      const convId = await ensureConversation();
      if (convId) await send(content);
    },
    [provider, send, ensureConversation],
  );

  // Save messages when streaming completes
  const prevStreamingRef = useRef(isStreaming);
  useEffect(() => {
    if (prevStreamingRef.current && !isStreaming && messages.length > 0 && currentConvId) {
      const title = messages.find((m) => m.role === "user")?.content?.slice(0, 50) || "New Chat";
      update(currentConvId, { title, messages });
    }
    prevStreamingRef.current = isStreaming;
  }, [isStreaming]);

  return (
    <div className="h-full">
      <ChatWindow
        messages={messages}
        systemPrompt={systemPrompt}
        onSystemPromptChange={setSystemPrompt}
        onSend={handleSend}
        onStop={stop}
        isStreaming={isStreaming}
        disabled={!provider}
      />
    </div>
  );
}
