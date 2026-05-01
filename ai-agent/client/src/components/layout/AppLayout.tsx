import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useProvidersQuery } from "@/lib/query/queries";
import { useConversations } from "@/hooks/useConversations";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: providers = [] } = useProvidersQuery();
  const activeProvider = providers.find((p) => p.isActive) || null;
  const { conversations, remove } = useConversations();

  const activeConversationId = location.pathname.startsWith("/chat/")
    ? location.pathname.split("/chat/")[1]
    : null;

  const handleSelectConversation = (id: string) => navigate(`/chat/${id}`);
  const handleNewConversation = () => navigate("/chat");
  const handleDeleteConversation = (id: string) => {
    remove(id);
    if (id === activeConversationId) navigate("/chat");
  };

  const getTitle = () => {
    if (location.pathname === "/" || location.pathname === "/providers") return t("sidebar.providers");
    if (location.pathname.startsWith("/chat")) return t("sidebar.chat");
    if (location.pathname.startsWith("/settings")) return t("sidebar.settings");
    return t("sidebar.brand");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={getTitle()} activeProvider={activeProvider} />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
