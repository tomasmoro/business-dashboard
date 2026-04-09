"use client";

import { FormEvent, useState } from "react";
import { UserCheck, Plus, Mail, Phone, CalendarDays } from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profesional } from "@/types";
import { mockProfesionales, mockTurnos } from "@/lib/mock-data";
import { EntityActionsMenu } from "@/components/shared/entity-actions-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function ProfesionalesPage() {
  const [open, setOpen] = useState(false);
  const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Profesional | null>(null);
  const [confirmType, setConfirmType] = useState<"delete" | "inactive" | null>(null);

  const isEditing = editingProfesional !== null;

  const closeDialog = () => {
    setOpen(false);
    setEditingProfesional(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeDialog();
  };

  const handleEditProfesional = (prof: Profesional) => {
    setEditingProfesional(prof);
    setOpen(true);
  };

  const handleSetInactiveProfesional = (prof: Profesional) => {
    setConfirmTarget(prof);
    setConfirmType("inactive");
  };

  const handleDeleteProfesional = (prof: Profesional) => {
    setConfirmTarget(prof);
    setConfirmType("delete");
  };

  const closeConfirm = () => {
    setConfirmTarget(null);
    setConfirmType(null);
  };

  const handleConfirmAction = () => {
    if (!confirmTarget || !confirmType) return;
    if (confirmType === "delete") {
      console.log("Deleted profesional", confirmTarget.id);
    } else {
      console.log("Set inactive profesional", confirmTarget.id);
    }
    closeConfirm();
  };

  return (
    <DashboardShell
      title="Profesionales"
      description="Gestión del equipo de trabajo"
      actions={
        <>
          <Button onClick={() => { setEditingProfesional(null); setOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo profesional
          </Button>
          <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog(); else setOpen(true); }}>
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

              <form key={editingProfesional?.id ?? "new"} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium">
                    Nombre
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contacto" className="text-sm font-medium">
                    Información de contacto
                  </label>
                  <Input
                    id="contacto"
                    name="contacto"
                    placeholder="Ej: +54 11 1234-5678 o email@dominio.com"
                    defaultValue={editingProfesional?.email ?? editingProfesional?.telefono ?? ""}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Actualizar profesional" : "Crear profesional"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProfesionales.map((prof) => {
          const turnosTotal = mockTurnos.filter(
            (t) => t.profesional_id === prof.id
          ).length;
          const completados = mockTurnos.filter(
            (t) => t.profesional_id === prof.id && t.estado === "completado"
          ).length;

          return (
            <Card
              key={prof.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                      {prof.nombre[0]}
                      {prof.apellido[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base truncate">
                        {prof.nombre} {prof.apellido}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge variant={prof.activo ? "success" : "secondary"}>
                          {prof.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        <EntityActionsMenu
                          onEdit={() => handleEditProfesional(prof)}
                          onSetInactive={() => handleSetInactiveProfesional(prof)}
                          onDelete={() => handleDeleteProfesional(prof)}
                        />
                      </div>
                    </div>
                    {prof.especialidad && (
                      <CardDescription className="mt-0.5">
                        {prof.especialidad}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {prof.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{prof.email}</span>
                  </div>
                )}
                {prof.telefono && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{prof.telefono}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{turnosTotal} turnos en demo</span>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">
                    {completados} completados
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={confirmType === "delete" && confirmTarget !== null}
        onOpenChange={(v) => { if (!v) closeConfirm(); }}
        title="Eliminar profesional"
        description={`¿Estás seguro de que querés eliminar a ${confirmTarget?.nombre} ${confirmTarget?.apellido}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={handleConfirmAction}
      />

      <ConfirmDialog
        open={confirmType === "inactive" && confirmTarget !== null}
        onOpenChange={(v) => { if (!v) closeConfirm(); }}
        title="Dar de baja profesional"
        description={`¿Querés marcar como inactivo/a a ${confirmTarget?.nombre} ${confirmTarget?.apellido}?`}
        confirmLabel="Dar de baja"
        variant="default"
        onConfirm={handleConfirmAction}
      />
    </DashboardShell>
  );
}
