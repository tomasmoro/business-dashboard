import { NextResponse } from "next/server";

import { getMetricasOverview } from "@/lib/services/turnos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get("negocioId") ?? undefined;
    const metricas = await getMetricasOverview(negocioId);
    return NextResponse.json(metricas);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener métricas de turnos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
