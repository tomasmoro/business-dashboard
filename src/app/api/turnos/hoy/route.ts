import { NextResponse } from "next/server";

import { listTurnosHoy } from "@/lib/services/turnos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const negocioId = searchParams.get("negocioId") ?? undefined;
    const turnos = await listTurnosHoy(negocioId);
    return NextResponse.json(turnos);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener turnos de hoy.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
