"use client";

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
import { mockProfesionales, mockTurnos } from "@/lib/mock-data";

export default function ProfesionalesPage() {
  return (
    <DashboardShell
      title="Profesionales"
      description="Gestión del equipo de trabajo"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo profesional
        </Button>
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
                      <Badge variant={prof.activo ? "success" : "secondary"}>
                        {prof.activo ? "Activo" : "Inactivo"}
                      </Badge>
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
                    <span>{turnosTotal} turnos hoy</span>
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
    </DashboardShell>
  );
}
