"use client";

import {
  CalendarDays,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/shared/estado-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatTime } from "@/lib/utils";
import { mockTurnos, mockProfesionales } from "@/lib/mock-data";

function calcularMetricas() {
  const hoy = new Date();
  const turnosHoy = mockTurnos;
  const confirmados = turnosHoy.filter(
    (t) => t.estado === "confirmado" || t.estado === "completado"
  );
  const ingresos = turnosHoy
    .filter((t) => t.estado === "completado")
    .reduce((sum, t) => sum + (t.precio_cobrado ?? t.servicio?.precio ?? 0), 0);
  const proximas = turnosHoy.filter(
    (t) =>
      new Date(t.fecha_hora_inicio) > hoy &&
      (t.estado === "confirmado" || t.estado === "pendiente")
  );
  return { turnosHoy: turnosHoy.length, confirmados: confirmados.length, ingresos, proximas };
}

export default function DashboardPage() {
  const metricas = calcularMetricas();
  const hoy = new Date();
  const fechaFormateada = format(hoy, "EEEE d 'de' MMMM yyyy", { locale: es });

  const metricCards = [
    {
      title: "Turnos de hoy",
      value: metricas.turnosHoy.toString(),
      description: `${metricas.confirmados} confirmados`,
      icon: CalendarDays,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+12% vs ayer",
      trendUp: true,
    },
    {
      title: "Ingresos estimados",
      value: formatCurrency(metricas.ingresos),
      description: "Turnos completados hoy",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+8% vs ayer",
      trendUp: true,
    },
    {
      title: "Próximas citas",
      value: metricas.proximas.length.toString(),
      description: "En las siguientes horas",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "2 pendientes",
      trendUp: null as boolean | null,
    },
    {
      title: "Clientes del mes",
      value: "48",
      description: "+6 nuevos esta semana",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+15% vs mes anterior",
      trendUp: true,
    },
  ];

  return (
    <DashboardShell
      title="Dashboard"
      description={
        fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
      }
      actions={
        <Button asChild>
          <Link href="/turnos">
            Ver todos los turnos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {card.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
                {card.trend && (
                  <div className="mt-4 flex items-center gap-1">
                    {card.trendUp !== null && (
                      <TrendingUp
                        className={`h-3 w-3 ${card.trendUp ? "text-emerald-500" : "text-red-500"}`}
                      />
                    )}
                    <span
                      className={`text-xs ${
                        card.trendUp === true
                          ? "text-emerald-600"
                          : card.trendUp === false
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {card.trend}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Turnos de hoy</CardTitle>
              <CardDescription>
                {mockTurnos.length} turnos agendados
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/turnos">
                Ver todos
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTurnos.slice(0, 5).map((turno) => (
                <div
                  key={turno.id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 bg-accent/30 p-3"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {turno.cliente?.nombre[0]}
                      {turno.cliente?.apellido?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {turno.cliente?.nombre} {turno.cliente?.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {turno.servicio?.nombre} · {turno.profesional?.nombre}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-foreground">
                      {formatTime(turno.fecha_hora_inicio)}
                    </p>
                    <EstadoBadge estado={turno.estado} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team overview */}
        <Card>
          <CardHeader>
            <CardTitle>Equipo</CardTitle>
            <CardDescription>Profesionales activos hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProfesionales.map((prof) => {
                const turnosProf = mockTurnos.filter(
                  (t) => t.profesional_id === prof.id
                );
                const completados = turnosProf.filter(
                  (t) => t.estado === "completado"
                ).length;
                return (
                  <div key={prof.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs">
                        {prof.nombre[0]}
                        {prof.apellido[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {prof.nombre} {prof.apellido}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {prof.especialidad}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-sm font-medium text-foreground">
                        {completados}/{turnosProf.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
