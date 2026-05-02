import { ProviderCard } from "./ProviderCard";
import { ProviderEmptyState } from "./ProviderEmptyState";
import type { Provider } from "@/types";

interface ProviderListProps {
  providers: Provider[];
  activeProviderId: string | null;
  onSetActive: (provider: Provider) => void;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function ProviderList({
  providers,
  activeProviderId,
  onSetActive,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
}: ProviderListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl border-2 border-dashed border-border-default animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return <ProviderEmptyState onAdd={onAdd} />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          isActive={provider.id === activeProviderId}
          onSetActive={onSetActive}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
