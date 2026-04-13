import "server-only";

import { supabaseAdmin } from "@/lib/supabase/server";

const SERVICIOS_SELECT = `
  id,
  negocio_id,
  nombre,
  precio,
  duracion_minutos,
  activo
`;

type ServicioRow = {
  id: number;
  negocio_id: number | null;
  nombre: string;
  precio: number | string;
  duracion_minutos: number;

  activo: boolean | null;
};

export type ServicioItem = {
  id: number;
  negocioId: number | null;
  nombre: string;
  precio: number;
  duracionMinutos: number;
  activo: boolean;
};

export type ServicioMutationInput = {
  nombre: string;
  precio: number;
  duracionMinutos: number;
};

function mapServicio(row: ServicioRow): ServicioItem {
  return {
    id: row.id,
    negocioId: row.negocio_id,
    nombre: row.nombre,
    precio: Number(row.precio ?? 0),
    duracionMinutos: row.duracion_minutos,
    activo: row.activo ?? true,
  };
}

function normalizeInput(input: ServicioMutationInput) {
  return {
    nombre: input.nombre.trim(),
    precio: Number(input.precio),
    duracion_minutos: Number(input.duracionMinutos)
  };
}

function validateInput(input: ServicioMutationInput) {
  const nombre = input.nombre.trim();

  if (!nombre) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!Number.isFinite(input.precio) || input.precio < 0) {
    throw new Error("El precio debe ser un número válido.");
  }

  if (!Number.isFinite(input.duracionMinutos) || input.duracionMinutos <= 0) {
    throw new Error("La duración debe ser mayor a 0 minutos.");
  }
}

export async function listServicios(): Promise<ServicioItem[]> {
  const { data, error } = await supabaseAdmin
    .from("servicios")
    .select(SERVICIOS_SELECT)
    .order("activo", { ascending: false })
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapServicio(row as ServicioRow));
}

export async function createServicio(
  input: ServicioMutationInput
): Promise<ServicioItem> {
  validateInput(input);

  const payload = {
    ...normalizeInput(input),
    activo: true,
    negocio_id: null,
  };

  const { data, error } = await supabaseAdmin
    .from("servicios")
    .insert(payload)
    .select(SERVICIOS_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapServicio(data as ServicioRow);
}

export async function updateServicio(
  id: number,
  input: ServicioMutationInput
): Promise<ServicioItem> {
  validateInput(input);

  const { data, error } = await supabaseAdmin
    .from("servicios")
    .update(normalizeInput(input))
    .eq("id", id)
    .select(SERVICIOS_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapServicio(data as ServicioRow);
}

export async function deactivateServicio(id: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("servicios")
    .update({ activo: false })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteServicio(id: number): Promise<void> {
  const { error } = await supabaseAdmin.from("servicios").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
