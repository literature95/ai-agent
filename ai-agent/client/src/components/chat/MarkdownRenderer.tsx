import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        components={{
          pre: ({ children }) => (
            <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">{children}</pre>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
