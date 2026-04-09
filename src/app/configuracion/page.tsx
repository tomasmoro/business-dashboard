"use client";

import Link from "next/link";
import {
  Settings,
  Building2,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    icon: Building2,
    title: "Información del negocio",
    description: "Nombre, dirección, logo y datos de contacto",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Configurar alertas de turnos y recordatorios",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Contraseña, autenticación y sesiones",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: CreditCard,
    title: "Facturación y plan",
    description: "Gestionar suscripción y métodos de pago",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function ConfiguracionPage() {
  return (
    <DashboardShell
      title="Configuración"
      description="Gestión del negocio y preferencias"
      actions={
        <Button asChild variant="outline">
          <Link href="/configuracion/supabase-test">Probar Supabase</Link>
        </Button>
      }
    >
      {/* Plan banner */}
      <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">Plan actual</p>
            <p className="text-2xl font-bold mt-1">TurnosPro</p>
            <p className="text-sm text-indigo-200 mt-1">
              Renovación el 1 de mayo, 2026
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Administrar plan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Ajustes generales
          </CardTitle>
          <CardDescription>
            Personaliza tu experiencia en TurnosPro
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx}>
                  <button className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-accent/30 transition-colors">
                    <div className={`rounded-xl p-2.5 ${section.bg}`}>
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                  {idx < sections.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
