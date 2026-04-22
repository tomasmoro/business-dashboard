import "server-only";

import { endOfDay, endOfMonth, isAfter, startOfDay, startOfMonth } from "date-fns";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { MetricasOverview, Turno } from "@/types";

const TURNOS_SELECT = `
  *,
  cliente:clientes(*),
  profesional:profesionales(*),
  servicio:servicios(*)
`;

type TurnoMesRow = {
  precio_cobrado: number | null;
  servicio: unknown;
};

function getServicioPrecio(servicio: unknown): number {
  if (Array.isArray(servicio)) {
    const item = servicio[0] as { precio?: number } | undefined;
    return Number(item?.precio ?? 0);
  }

  const item = servicio as { precio?: number } | null;
  return Number(item?.precio ?? 0);
}

export type ListTurnosParams = {
  start?: string;
  end?: string;
  negocioId?: string;
};

export async function listTurnos({
  start,
  end,
  negocioId,
}: ListTurnosParams = {}): Promise<Turno[]> {
  let query = supabaseAdmin.from("turnos").select(TURNOS_SELECT).order("fecha_hora_inicio");

  if (negocioId) {
    query = query.eq("negocio_id", negocioId);
  }

  if (start) {
    query = query.gte("fecha_hora_inicio", start);
  }

  if (end) {
    query = query.lte("fecha_hora_inicio", end);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Turno[];
}

export async function listTurnosHoy(negocioId?: string): Promise<Turno[]> {
  const now = new Date();
  return listTurnos({
    negocioId,
    start: startOfDay(now).toISOString(),
    end: endOfDay(now).toISOString(),
  });
}

export async function getMetricasOverview(
  negocioId?: string
): Promise<MetricasOverview> {
  const hoy = new Date();
  const turnosHoy = await listTurnosHoy(negocioId);
  const turnosConfirmadosHoy = turnosHoy.filter(
    (t) => t.estado === "confirmado" || t.estado === "completado"
  );
  const ingresosEstimadosHoy = turnosConfirmadosHoy.reduce(
    (sum, t) => sum + Number(t.precio_cobrado ?? getServicioPrecio(t.servicio)),
    0
  );
  const proximasCitas = turnosHoy
    .filter(
      (t) =>
        isAfter(new Date(t.fecha_hora_inicio), hoy) &&
        (t.estado === "confirmado" || t.estado === "pendiente")
    )
    .slice(0, 5);

  let query = supabaseAdmin
    .from("turnos")
    .select("precio_cobrado, servicio:servicios(precio)")
    .gte("fecha_hora_inicio", startOfMonth(hoy).toISOString())
    .lte("fecha_hora_inicio", endOfMonth(hoy).toISOString())
    .in("estado", ["completado"]);

  if (negocioId) {
    query = query.eq("negocio_id", negocioId);
  }

  const { data: turnosMesData, error: turnosMesError } = await query;

  if (turnosMesError) {
    throw new Error(turnosMesError.message);
  }

  const ingresosMes = ((turnosMesData ?? []) as TurnoMesRow[]).reduce(
    (sum, t) => sum + Number(t.precio_cobrado ?? getServicioPrecio(t.servicio)),
    0
  );

  return {
    turnosHoy: turnosHoy.length,
    turnosHoyConfirmados: turnosConfirmadosHoy.length,
    ingresosEstimadosHoy,
    proximasCitas,
    turnosMes: turnosMesData?.length ?? 0,
    ingresosMes,
  };
}
