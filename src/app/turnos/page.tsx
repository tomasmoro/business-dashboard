"use client";

import { useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";

import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/shared/estado-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatTime } from "@/lib/utils";
import { mockTurnos } from "@/lib/mock-data";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00

export default function TurnosPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [view, setView] = useState<"week" | "day">("day");

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const turnosDia = mockTurnos.filter((t) =>
    isSameDay(new Date(t.fecha_hora_inicio), selectedDay)
  );

  const getHourTurnos = (hour: number) =>
    turnosDia.filter(
      (t) => new Date(t.fecha_hora_inicio).getHours() === hour
    );

  return (
    <DashboardShell
      title="Turnos"
      description="Gestión del calendario de citas"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo turno
        </Button>
      }
    >
      {/* Week navigator */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-foreground capitalize">
                {format(weekStart, "d MMM", { locale: es })} –{" "}
                {format(weekEnd, "d MMM yyyy", { locale: es })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
              >
                Día
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Semana
              </Button>
            </div>
          </div>

          {/* Day selector */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const turnosDayCount = mockTurnos.filter((t) =>
                isSameDay(new Date(t.fecha_hora_inicio), day)
              ).length;
              const isSelected = isSameDay(day, selectedDay);
              const isCurrentDay = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex flex-col items-center rounded-xl py-2 px-1 transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isCurrentDay
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-muted-foreground"
                  )}
                >
                  <span className="text-xs font-medium capitalize">
                    {format(day, "EEE", { locale: es })}
                  </span>
                  <span
                    className={cn(
                      "mt-1 text-base font-bold",
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {turnosDayCount > 0 && (
                    <span
                      className={cn(
                        "mt-1 h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground" : "bg-primary"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day view */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Time grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="capitalize">
                {format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
              </span>
              {isToday(selectedDay) && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Hoy
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {HOURS.map((hour) => {
                const hourTurnos = getHourTurnos(hour);
                return (
                  <div key={hour} className="flex min-h-[64px]">
                    {/* Hour label */}
                    <div className="w-16 shrink-0 px-4 py-3 text-xs text-muted-foreground">
                      {hour}:00
                    </div>
                    {/* Turnos slot */}
                    <div className="flex-1 px-3 py-2 space-y-1">
                      {hourTurnos.map((turno) => (
                        <div
                          key={turno.id}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 border-l-4 transition-all hover:opacity-90 cursor-pointer",
                            turno.estado === "completado"
                              ? "bg-emerald-50 border-emerald-400"
                              : turno.estado === "confirmado"
                                ? "bg-indigo-50 border-indigo-400"
                                : turno.estado === "cancelado"
                                  ? "bg-red-50 border-red-400"
                                  : "bg-amber-50 border-amber-400"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {turno.cliente?.nombre} {turno.cliente?.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {turno.servicio?.nombre} ·{" "}
                              {formatTime(turno.fecha_hora_inicio)} –{" "}
                              {formatTime(turno.fecha_hora_fin)}
                            </p>
                          </div>
                          <EstadoBadge estado={turno.estado} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Turnos list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Citas del día
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {turnosDia.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {turnosDia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No hay turnos para este día
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {turnosDia.map((turno) => (
                  <div
                    key={turno.id}
                    className="flex gap-3 rounded-lg border border-border/50 p-3 hover:bg-accent/30 cursor-pointer transition-colors"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {turno.cliente?.nombre[0]}
                        {turno.cliente?.apellido?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {turno.cliente?.nombre} {turno.cliente?.apellido}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(turno.fecha_hora_inicio)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {turno.servicio?.nombre}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {turno.profesional?.nombre}{" "}
                          {turno.profesional?.apellido}
                        </p>
                        <EstadoBadge estado={turno.estado} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
