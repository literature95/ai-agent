import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SystemPromptEditor } from "./SystemPromptEditor";
import type { ChatMessage } from "@/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled: boolean;
}

export function ChatWindow({
  messages,
  systemPrompt,
  onSystemPromptChange,
  onSend,
  onStop,
  isStreaming,
  disabled,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full">
      <SystemPromptEditor value={systemPrompt} onChange={onSystemPromptChange} />
      <MessageList messages={messages} />
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        isStreaming={isStreaming}
        disabled={disabled}
      />
    </div>
  );
}
