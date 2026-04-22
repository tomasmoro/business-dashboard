import { NextResponse } from "next/server";

import { listTurnos } from "@/lib/services/turnos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") ?? undefined;
    const end = searchParams.get("end") ?? undefined;
    const negocioId = searchParams.get("negocioId") ?? undefined;

    if (start && Number.isNaN(Date.parse(start))) {
      return NextResponse.json({ error: "El parámetro start es inválido." }, { status: 400 });
    }

    if (end && Number.isNaN(Date.parse(end))) {
      return NextResponse.json({ error: "El parámetro end es inválido." }, { status: 400 });
    }

    const turnos = await listTurnos({ start, end, negocioId });
    return NextResponse.json(turnos);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener turnos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
