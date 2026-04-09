"use client";

import { FormEvent, useState } from "react";
import { Scissors, Plus, Clock, DollarSign } from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Servicio } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { mockServicios } from "@/lib/mock-data";
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function ServiciosPage() {
  const [open, setOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Servicio | null>(null);
  const [confirmType, setConfirmType] = useState<"delete" | "inactive" | null>(null);

  const isEditing = editingServicio !== null;

  const closeDialog = () => {
    setOpen(false);
    setEditingServicio(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeDialog();
  };

  const handleEditService = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setOpen(true);
  };

  const handleSetInactiveService = (servicio: Servicio) => {
    setConfirmTarget(servicio);
    setConfirmType("inactive");
  };

  const handleDeleteService = (servicio: Servicio) => {
    setConfirmTarget(servicio);
    setConfirmType("delete");
  };

  const closeConfirm = () => {
    setConfirmTarget(null);
    setConfirmType(null);
  };

  const handleConfirmAction = () => {
    if (!confirmTarget || !confirmType) return;
    if (confirmType === "delete") {
      console.log("Deleted service", confirmTarget.id);
    } else {
      console.log("Set inactive service", confirmTarget.id);
    }
    closeConfirm();
  };

  return (
    <DashboardShell
      title="Servicios"
      description="Gestión de servicios del negocio"
      actions={
        <>
          <Button onClick={() => { setEditingServicio(null); setOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
          </Button>
          <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar servicio" : "Nuevo servicio"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Modificá los datos del servicio."
                    : "Completá los datos para registrar un nuevo servicio."}
                </DialogDescription>
              </DialogHeader>

              <form key={editingServicio?.id ?? "new"} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: Corte clásico"
                    defaultValue={editingServicio?.nombre ?? ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="descripcion" className="text-sm font-medium">
                    Descripción
                  </label>
                  <Input
                    id="descripcion"
                    name="descripcion"
                    placeholder="Ej: Corte y peinado"
                    defaultValue={editingServicio?.descripcion ?? ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="duracion" className="text-sm font-medium">
                    Duración (minutos)
                  </label>
                  <Input
                    id="duracion"
                    name="duracion"
                    type="number"
                    min={1}
                    placeholder="Ej: 45"
                    defaultValue={editingServicio?.duracion_minutos ?? ""}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Actualizar servicio" : "Crear servicio"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockServicios.map((servicio) => (
          <Card
            key={servicio.id}
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={servicio.activo ? "success" : "secondary"}>
                    {servicio.activo ? "Activo" : "Inactivo"}
                  </Badge>
                  <EntityActionsMenu
                    onEdit={() => handleEditService(servicio)}
                    onSetInactive={() => handleSetInactiveService(servicio)}
                    onDelete={() => handleDeleteService(servicio)}
                  />
                </div>
              </div>
              <CardTitle className="text-base mt-3">{servicio.nombre}</CardTitle>
              {servicio.descripcion && (
                <CardDescription className="text-xs">
                  {servicio.descripcion}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{servicio.duracion_minutos} min</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{formatCurrency(servicio.precio)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={confirmType === "delete" && confirmTarget !== null}
        onOpenChange={(v) => { if (!v) closeConfirm(); }}
        title="Eliminar servicio"
        description={`¿Estás seguro de que querés eliminar "${confirmTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={handleConfirmAction}
      />

      <ConfirmDialog
        open={confirmType === "inactive" && confirmTarget !== null}
        onOpenChange={(v) => { if (!v) closeConfirm(); }}
        title="Desactivar servicio"
        description={`¿Querés marcar como inactivo el servicio "${confirmTarget?.nombre}"?`}
        confirmLabel="Desactivar"
        variant="default"
        onConfirm={handleConfirmAction}
      />
    </DashboardShell>
  );
}
