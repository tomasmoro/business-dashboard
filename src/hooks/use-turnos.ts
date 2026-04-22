import { useQuery } from "@tanstack/react-query";
import type { MetricasOverview, Turno } from "@/types";

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "No se pudo obtener la información.");
  }

  return (await response.json()) as T;
}

async function fetchTurnosHoy(negocioId?: string): Promise<Turno[]> {
  const params = new URLSearchParams();
  if (negocioId) params.set("negocioId", negocioId);
  return fetchJSON<Turno[]>(`/api/turnos/hoy?${params.toString()}`);
}

async function fetchMetricas(negocioId?: string): Promise<MetricasOverview> {
  const params = new URLSearchParams();
  if (negocioId) params.set("negocioId", negocioId);
  return fetchJSON<MetricasOverview>(`/api/turnos/metricas?${params.toString()}`);
}

async function fetchTurnosEnRango(
  start: Date,
  end: Date,
  negocioId?: string
): Promise<Turno[]> {
  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
  });
  if (negocioId) params.set("negocioId", negocioId);

  return fetchJSON<Turno[]>(`/api/turnos?${params.toString()}`);
}

export function useTurnosHoy(negocioId?: string) {
  return useQuery({
    queryKey: ["turnos", "hoy", negocioId],
    queryFn: () => fetchTurnosHoy(negocioId),
    enabled: negocioId !== "",
  });
}

export function useMetricas(negocioId?: string) {
  return useQuery({
    queryKey: ["metricas", negocioId],
    queryFn: () => fetchMetricas(negocioId),
    enabled: negocioId !== "",
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useTurnosEnRango(start: Date, end: Date, negocioId?: string) {
  return useQuery({
    queryKey: ["turnos", "rango", negocioId, start.toISOString(), end.toISOString()],
    queryFn: () => fetchTurnosEnRango(start, end, negocioId),
    enabled: !!start && !!end,
  });
}
