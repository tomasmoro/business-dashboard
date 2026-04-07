"use client";

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
import { formatCurrency } from "@/lib/utils";
import { mockServicios } from "@/lib/mock-data";

export default function ServiciosPage() {
  return (
    <DashboardShell
      title="Servicios"
      description="Gestión de servicios del negocio"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo servicio
        </Button>
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
                <Badge variant={servicio.activo ? "success" : "secondary"}>
                  {servicio.activo ? "Activo" : "Inactivo"}
                </Badge>
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
    </DashboardShell>
  );
}
