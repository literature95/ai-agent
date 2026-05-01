import { cn } from "@/lib/utils";

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

export function StreamingText({ content, isStreaming }: StreamingTextProps) {
  return (
    <span>
      {content}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-blue-500 ml-0.5 animate-pulse-slow align-text-bottom rounded-sm" />
      )}
    </span>
  );
}
