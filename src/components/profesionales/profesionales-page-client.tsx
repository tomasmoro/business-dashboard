"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Plus, Mail, Phone } from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  createProfesionalAction,
  deactivateProfesionalAction,
  deleteProfesionalAction,
  updateProfesionalAction,
} from "@/app/profesionales/actions";
import type { ProfesionalItem, ProfesionalMutationInput } from "@/lib/services/profesionales";

type ConfirmType = "delete" | "inactive" | null;

interface ProfesionalesPageClientProps {
  profesionales: ProfesionalItem[];
  loadError?: string | null;
}

export function ProfesionalesPageClient({
  profesionales,
  loadError = null,
}: ProfesionalesPageClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingProfesional, setEditingProfesional] = useState<ProfesionalItem | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ProfesionalItem | null>(null);
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(loadError);
  const [isPending, startTransition] = useTransition();

  const isEditing = editingProfesional !== null;

  const sorted = useMemo(
    () =>
      [...profesionales].sort(
        (a, b) => Number(b.activo) - Number(a.activo) || a.nombre.localeCompare(b.nombre)
      ),
    [profesionales]
  );

  const closeDialog = () => {
    setOpen(false);
    setEditingProfesional(null);
    setFormError(null);
  };

  const openCreateDialog = () => {
    setEditingProfesional(null);
    setFormError(null);
    setOpen(true);
  };

  const handleEdit = (prof: ProfesionalItem) => {
    setEditingProfesional(prof);
    setFormError(null);
    setOpen(true);
  };

  const handleSetInactive = (prof: ProfesionalItem) => {
    setConfirmTarget(prof);
    setConfirmType("inactive");
    setActionError(null);
  };

  const handleDelete = (prof: ProfesionalItem) => {
    setConfirmTarget(prof);
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
    const input: ProfesionalMutationInput = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      apellido: String(formData.get("apellido") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
    };

    startTransition(async () => {
      const result =
        isEditing && editingProfesional
          ? await updateProfesionalAction(editingProfesional.id, input)
          : await createProfesionalAction(input);

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
          ? await deleteProfesionalAction(confirmTarget.id)
          : await deactivateProfesionalAction(confirmTarget.id);

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
      title="Profesionales"
      description="Gestión del equipo de trabajo"
      actions={
        <>
          <Button onClick={openCreateDialog} disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo profesional
          </Button>
          <Dialog
            open={open}
            onOpenChange={(next) => {
              if (!next) closeDialog();
              else setOpen(true);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar profesional" : "Nuevo profesional"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Modificá los datos del profesional."
                    : "Completá los datos para registrar un nuevo profesional."}
                </DialogDescription>
              </DialogHeader>

              <form
                key={editingProfesional?.id ?? "new"}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium">
                      Nombre <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="Ej: Juan"
                      defaultValue={editingProfesional?.nombre ?? ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="apellido" className="text-sm font-medium">
                      Apellido
                    </label>
                    <Input
                      id="apellido"
                      name="apellido"
                      placeholder="Ej: Pérez"
                      defaultValue={editingProfesional?.apellido ?? ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ej: juan@ejemplo.com"
                    defaultValue={editingProfesional?.email ?? ""}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Ej: +54 11 1234-5678"
                    defaultValue={editingProfesional?.phone ?? ""}
                  />
                </div>

                {formError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isEditing ? "Actualizar profesional" : "Crear profesional"}
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

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">
                No hay profesionales cargados
              </p>
              <p className="text-sm text-muted-foreground">
                Creá tu primer profesional y se guardará directamente en Supabase.
              </p>
            </div>
            <Button onClick={openCreateDialog} disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo profesional
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((prof) => (
            <Card
              key={prof.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {[prof.nombre[0], prof.apellido?.[0]]
                        .filter(Boolean)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="truncate text-base">
                        {prof.nombre}{prof.apellido ? ` ${prof.apellido}` : ""}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge variant={prof.activo ? "success" : "secondary"}>
                          {prof.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        <EntityActionsMenu
                          onEdit={() => handleEdit(prof)}
                          onSetInactive={() => handleSetInactive(prof)}
                          onDelete={() => handleDelete(prof)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {prof.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{prof.email}</span>
                  </div>
                )}
                {prof.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{prof.phone}</span>
                  </div>
                )}
                {!prof.email && !prof.phone && (
                  <p className="text-xs text-muted-foreground/60">Sin datos de contacto</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmType === "delete" && confirmTarget !== null}
        onOpenChange={(v) => {
          if (!v) closeConfirm();
        }}
        title="Eliminar profesional"
        description={`¿Estás seguro de que querés eliminar a "${[confirmTarget?.nombre, confirmTarget?.apellido].filter(Boolean).join(" ")}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={handleConfirmAction}
      />

      <ConfirmDialog
        open={confirmType === "inactive" && confirmTarget !== null}
        onOpenChange={(v) => {
          if (!v) closeConfirm();
        }}
        title="Dar de baja profesional"
        description={`¿Querés marcar como inactivo/a a "${[confirmTarget?.nombre, confirmTarget?.apellido].filter(Boolean).join(" ")}"?`}
        confirmLabel="Dar de baja"
        variant="default"
        onConfirm={handleConfirmAction}
      />
    </DashboardShell>
  );
}
