import { cn } from "@/lib/utils";
import type { EstadoTurno } from "@/types";
import { Badge, type BadgeVariant } from "@/components/ui/badge";

const estadoConfig: Record<
  EstadoTurno,
  { label: string; variant: BadgeVariant }
> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  confirmado: { label: "Confirmado", variant: "success" },
  en_curso: { label: "En curso", variant: "default" },
  completado: { label: "Completado", variant: "secondary" },
  cancelado: { label: "Cancelado", variant: "destructive" },
  no_asistio: { label: "No asistió", variant: "outline" },
};

interface EstadoBadgeProps {
  estado: EstadoTurno;
  className?: string;
}

export function EstadoBadge({ estado, className }: EstadoBadgeProps) {
  const config = estadoConfig[estado];
  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
