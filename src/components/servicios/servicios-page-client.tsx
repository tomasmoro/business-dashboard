"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Plus, Clock, DollarSign } from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createServicioAction, deleteServicioAction, deactivateServicioAction, updateServicioAction } from "@/app/servicios/actions";
import type { ServicioItem, ServicioMutationInput } from "@/lib/services/servicios";
import { formatCurrency } from "@/lib/utils";

type ConfirmType = "delete" | "inactive" | null;

interface ServiciosPageClientProps {
  servicios: ServicioItem[];
  loadError?: string | null;
}

export function ServiciosPageClient({
  servicios,
  loadError = null,
}: ServiciosPageClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioItem | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ServicioItem | null>(null);
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(loadError);
  const [isPending, startTransition] = useTransition();

  const isEditing = editingServicio !== null;

  const sortedServicios = useMemo(
    () => [...servicios].sort((a, b) => Number(b.activo) - Number(a.activo) || a.nombre.localeCompare(b.nombre)),
    [servicios]
  );

  const closeDialog = () => {
    setOpen(false);
    setEditingServicio(null);
    setFormError(null);
  };

  const openCreateDialog = () => {
    setEditingServicio(null);
    setFormError(null);
    setOpen(true);
  };

  const handleEditService = (servicio: ServicioItem) => {
    setEditingServicio(servicio);
    setFormError(null);
    setOpen(true);
  };

  const handleSetInactiveService = (servicio: ServicioItem) => {
    setConfirmTarget(servicio);
    setConfirmType("inactive");
    setActionError(null);
  };

  const handleDeleteService = (servicio: ServicioItem) => {
    setConfirmTarget(servicio);
    setConfirmType("delete");
    setActionError(null);
  };

  const closeConfirm = () => {
    setConfirmTarget(null);
    setConfirmType(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setActionError(null);

    const formData = new FormData(event.currentTarget);
    const input: ServicioMutationInput = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      precio: Number(formData.get("precio") ?? 0),
      duracionMinutos: Number(formData.get("duracion") ?? 0),
    };

    startTransition(async () => {
      const result = isEditing && editingServicio
        ? await updateServicioAction(editingServicio.id, input)
        : await createServicioAction(input);

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      closeDialog();
      router.refresh();
    });
  };

  const handleConfirmAction = () => {
    if (!confirmTarget || !confirmType) return;

    setActionError(null);

    startTransition(async () => {
      const result =
        confirmType === "delete"
          ? await deleteServicioAction(confirmTarget.id)
          : await deactivateServicioAction(confirmTarget.id);

      if (!result.success) {
        setActionError(result.error);
        return;
      }

      closeConfirm();
      router.refresh();
    });
  };

  return (
    <DashboardShell
      title="Servicios"
      description="Gestión de servicios del negocio"
      actions={
        <>
          <Button onClick={openCreateDialog} disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
          </Button>
          <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                closeDialog();
                return;
              }
              setOpen(true);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar servicio" : "Nuevo servicio"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Modificá los datos del servicio guardados en Supabase."
                    : "Completá los datos para crear un nuevo servicio en Supabase."}
                </DialogDescription>
              </DialogHeader>

              <form
                key={editingServicio?.id ?? "new"}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
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
                  <label htmlFor="duracion" className="text-sm font-medium">
                    Duración (minutos)
                  </label>
                  <Input
                    id="duracion"
                    name="duracion"
                    type="number"
                    min={1}
                    placeholder="Ej: 45"
                    defaultValue={editingServicio?.duracionMinutos ?? ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="precio" className="text-sm font-medium">
                    Precio
                  </label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Ej: 15000"
                    defaultValue={editingServicio?.precio ?? ""}
                    required
                  />
                </div>

                <div className="rounded-md border border-border/70 bg-accent/30 p-3 text-xs text-muted-foreground">
                  La tabla `servicios` en Supabase no tiene columna `descripcion`, por eso este formulario usa los campos reales: `nombre`, `duracion_minutos` y `precio`.
                </div>

                {formError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isEditing ? "Actualizar servicio" : "Crear servicio"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      }
    >
      {actionError && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {sortedServicios.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">
                No hay servicios cargados
              </p>
              <p className="text-sm text-muted-foreground">
                Creá tu primer servicio y se guardará directamente en Supabase.
              </p>
            </div>
            <Button onClick={openCreateDialog} disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedServicios.map((servicio) => (
            <Card
              key={servicio.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
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
                <CardTitle className="mt-3 text-base">{servicio.nombre}</CardTitle>
                <CardDescription className="text-xs">
                  Servicio disponible para agendamiento
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{servicio.duracionMinutos} min</span>
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
      )}

      <ConfirmDialog
        open={confirmType === "delete" && confirmTarget !== null}
        onOpenChange={(value) => {
          if (!value) closeConfirm();
        }}
        title="Eliminar servicio"
        description={`¿Estás seguro de que querés eliminar "${confirmTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={handleConfirmAction}
      />

      <ConfirmDialog
        open={confirmType === "inactive" && confirmTarget !== null}
        onOpenChange={(value) => {
          if (!value) closeConfirm();
        }}
        title="Desactivar servicio"
        description={`¿Querés marcar como inactivo el servicio "${confirmTarget?.nombre}"?`}
        confirmLabel="Desactivar"
        variant="default"
        onConfirm={handleConfirmAction}
      />
    </DashboardShell>
  );
}
