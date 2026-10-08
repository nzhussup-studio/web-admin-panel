import Badge from "react-bootstrap/Badge";
import { Globe2, Lock, Users } from "lucide-react";

interface AlbumVisibilityBadgeProps {
  type?: string;
  className?: string;
}

const visibility = {
  private: { variant: "danger", icon: Lock, label: "Private" },
  "semi-public": { variant: "warning", icon: Users, label: "Semi-public" },
  public: { variant: "success", icon: Globe2, label: "Public" },
} as const;

export function AlbumVisibilityBadge({
  type,
  className = "",
}: AlbumVisibilityBadgeProps) {
  const config = visibility[type as keyof typeof visibility];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge
      bg={`${config.variant}-subtle`}
      text={config.variant}
      className={`album-visibility-badge ${className}`.trim()}
    >
      <Icon size={14} />
      {config.label}
    </Badge>
  );
}
