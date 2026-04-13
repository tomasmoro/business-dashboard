import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Turno, MetricasOverview } from "@/types";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  isAfter,
} from "date-fns";

async function fetchTurnosHoy(negocioId: string): Promise<Turno[]> {
  const supabase = createClient();
  const hoy = new Date();
  const { data, error } = await supabase
    .from("turnos")
    .select(
      `
      *,
      cliente:clientes(*),
      profesional:profesionales(*),
      servicio:servicios(*)
    `
    )
    .eq("negocio_id", negocioId)
    .gte("fecha_hora_inicio", startOfDay(hoy).toISOString())
    .lte("fecha_hora_inicio", endOfDay(hoy).toISOString())
    .order("fecha_hora_inicio");

  if (error) throw error;
  return data as Turno[];
}

async function fetchMetricas(negocioId: string): Promise<MetricasOverview> {
  const supabase = createClient();
  const hoy = new Date();
  const turnosHoy = await fetchTurnosHoy(negocioId);

  const turnosConfirmadosHoy = turnosHoy.filter(
    (t) => t.estado === "confirmado" || t.estado === "completado"
  );

  const ingresosEstimadosHoy = turnosConfirmadosHoy.reduce(
    (sum, t) => sum + (t.precio_cobrado ?? t.servicio?.precio ?? 0),
    0
  );

  const proximasCitas = turnosHoy.filter(
    (t) =>
      isAfter(new Date(t.fecha_hora_inicio), hoy) &&
      (t.estado === "confirmado" || t.estado === "pendiente")
  );

  const { data: turnosMesData, error: turnosMesError } = await supabase
    .from("turnos")
    .select("precio_cobrado, servicio:servicios(precio)")
    .eq("negocio_id", negocioId)
    .gte("fecha_hora_inicio", startOfMonth(hoy).toISOString())
    .lte("fecha_hora_inicio", endOfMonth(hoy).toISOString())
    .in("estado", ["completado"]);

  if (turnosMesError) throw turnosMesError;

  // Supabase returns joined rows as arrays; cast through unknown to our local type
  type TurnoMesRow = { precio_cobrado: number | null; servicio: { precio: number }[] | null };

  const ingresosMes = ((turnosMesData ?? []) as unknown as TurnoMesRow[]).reduce(
    (sum: number, t: TurnoMesRow) =>
      sum + (t.precio_cobrado ?? t.servicio?.[0]?.precio ?? 0),
    0
  );

  return {
    turnosHoy: turnosHoy.length,
    turnosHoyConfirmados: turnosConfirmadosHoy.length,
    ingresosEstimadosHoy,
    proximasCitas: proximasCitas.slice(0, 5),
    turnosMes: turnosMesData?.length ?? 0,
    ingresosMes,
  };
}

export function useTurnosHoy(negocioId: string) {
  return useQuery({
    queryKey: ["turnos", "hoy", negocioId],
    queryFn: () => fetchTurnosHoy(negocioId),
    enabled: !!negocioId,
  });
}

export function useMetricas(negocioId: string) {
  return useQuery({
    queryKey: ["metricas", negocioId],
    queryFn: () => fetchMetricas(negocioId),
    enabled: !!negocioId,
    refetchInterval: 1000 * 60 * 5,
  });
}
