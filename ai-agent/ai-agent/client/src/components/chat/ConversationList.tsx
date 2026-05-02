import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ConversationListItem {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: number;
}

interface ConversationListProps {
  conversations: ConversationListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect, onNew, onDelete }: ConversationListProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("chat.chats")}</h2>
        <button
          type="button"
          onClick={onNew}
          className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
          title={t("chat.newChat")}
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="px-3 text-xs text-muted-foreground/50">{t("chat.noConversations")}</p>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} className="group relative">
              <button
                type="button"
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                  activeId === conv.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
                onClick={() => onSelect(conv.id)}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
                <span className="text-[10px] opacity-50">{conv.messageCount}</span>
              </button>
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-all"
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
