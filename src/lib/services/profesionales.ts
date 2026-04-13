import "server-only";

import { supabaseAdmin } from "@/lib/supabase/server";

const PROFESIONALES_SELECT = `
  id,
  negocio_id,
  nombre,
  apellido,
  email,
  phone,
  activo
`;

type ProfesionalRow = {
  id: number;
  negocio_id: number | null;
  nombre: string;
  apellido: string | null;
  email: string | null;
  phone: string | null;
  activo: boolean | null;
};

export type ProfesionalItem = {
  id: number;
  negocioId: number | null;
  nombre: string;
  apellido: string | null;
  email: string | null;
  phone: string | null;
  activo: boolean;
};

export type ProfesionalMutationInput = {
  nombre: string;
  apellido?: string;
  email?: string;
  phone?: string;
};

function mapProfesional(row: ProfesionalRow): ProfesionalItem {
  return {
    id: row.id,
    negocioId: row.negocio_id,
    nombre: row.nombre,
    apellido: row.apellido ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    activo: row.activo ?? true,
  };
}

function validateInput(input: ProfesionalMutationInput) {
  if (!input.nombre.trim()) {
    throw new Error("El nombre es obligatorio.");
  }
}

export async function listProfesionales(): Promise<ProfesionalItem[]> {
  const { data, error } = await supabaseAdmin
    .from("profesionales")
    .select(PROFESIONALES_SELECT)
    .order("activo", { ascending: false })
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => mapProfesional(row as ProfesionalRow));
}

export async function createProfesional(
  input: ProfesionalMutationInput
): Promise<ProfesionalItem> {
  validateInput(input);

  const { data, error } = await supabaseAdmin
    .from("profesionales")
    .insert({
      nombre: input.nombre.trim(),
      apellido: input.apellido?.trim() || null,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      activo: true,
      negocio_id: null,
    })
    .select(PROFESIONALES_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return mapProfesional(data as ProfesionalRow);
}

export async function updateProfesional(
  id: number,
  input: ProfesionalMutationInput
): Promise<ProfesionalItem> {
  validateInput(input);

  const { data, error } = await supabaseAdmin
    .from("profesionales")
    .update({
      nombre: input.nombre.trim(),
      apellido: input.apellido?.trim() || null,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
    })
    .eq("id", id)
    .select(PROFESIONALES_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return mapProfesional(data as ProfesionalRow);
}

export async function deactivateProfesional(id: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("profesionales")
    .update({ activo: false })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteProfesional(id: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("profesionales")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
