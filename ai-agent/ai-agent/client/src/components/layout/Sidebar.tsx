import { Cpu, MessageSquare, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ConversationList } from "@/components/chat/ConversationList";
import { ModeToggle } from "@/components/mode-toggle";

interface SidebarProps {
  conversations: Array<{ id: string; title: string; messageCount: number; updatedAt: number }>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: SidebarProps) {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
      isActive
        ? "bg-blue-500 text-white"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    );

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-border-default bg-card shrink-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default">
        <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center">
          <Cpu className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-sm">{t("sidebar.brand")}</span>
      </div>

      <nav className="px-2 py-3 space-y-1 border-b border-border-default">
        <NavLink to="/" end className={linkClass}>
          <Cpu className="h-4 w-4" />
          {t("sidebar.providers")}
        </NavLink>
        <NavLink to="/chat" className={linkClass}>
          <MessageSquare className="h-4 w-4" />
          {t("sidebar.chat")}
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          <Settings className="h-4 w-4" />
          {t("sidebar.settings")}
        </NavLink>
      </nav>

      <div className="flex-1 overflow-hidden">
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={onSelectConversation}
          onNew={onNewConversation}
          onDelete={onDeleteConversation}
        />
      </div>

      <div className="p-3 border-t border-border-default">
        <ModeToggle />
      </div>
    </aside>
  );
}
