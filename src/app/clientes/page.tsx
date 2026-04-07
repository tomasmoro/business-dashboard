"use client";

import { Users, Plus, Phone, Mail, CalendarDays } from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockClientes, mockTurnos } from "@/lib/mock-data";

export default function ClientesPage() {
  return (
    <DashboardShell
      title="Clientes"
      description="Base de datos de clientes"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Todos los clientes
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {mockClientes.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {mockClientes.map((cliente) => {
              const turnosCliente = mockTurnos.filter(
                (t) => t.cliente_id === cliente.id
              ).length;
              return (
                <div
                  key={cliente.id}
                  className="flex items-center gap-4 py-4 hover:bg-accent/30 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                      {cliente.nombre[0]}
                      {cliente.apellido?.[0] ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {cliente.nombre} {cliente.apellido}
                    </p>
                    <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {cliente.telefono}
                      </span>
                      {cliente.email && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {cliente.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{turnosCliente} turnos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
