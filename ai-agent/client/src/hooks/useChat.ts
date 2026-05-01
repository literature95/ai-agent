import { useState, useCallback, useRef } from "react";
import { sendChatCompletion, parseSSEStream, type SSEEvent } from "@/lib/api/chat";
import type { ChatMessage, Provider } from "@/types";

const genId = () => crypto.randomUUID();

interface UseChatOptions {
  provider: Provider | null;
  systemPrompt?: string;
  initialMessages?: ChatMessage[];
}

export function useChat({ provider, systemPrompt, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const send = useCallback(
    async (content: string) => {
      if (!provider || isStreaming) return;

      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const assistantMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const previousMessages = messagesRef.current.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await sendChatCompletion({
          providerId: provider.id,
          model: provider.model,
          messages: [
            ...previousMessages,
            { role: "user", content },
          ],
          systemPrompt,
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        let fullContent = "";
        for await (const event of parseSSEStream(reader)) {
          if (controller.signal.aborted) break;

          if (event.type === "delta" && event.content) {
            fullContent += event.content;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id
                  ? { ...m, content: fullContent }
                  : m,
              ),
            );
          } else if (event.type === "error") {
            throw new Error(event.message || "Stream error");
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, isStreaming: false } : m,
          ),
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: `Error: ${errorMsg}`, isStreaming: false }
              : m,
          ),
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [provider, systemPrompt, isStreaming],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const loadMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
  }, []);

  return { messages, isStreaming, send, stop, clearMessages, loadMessages };
}
