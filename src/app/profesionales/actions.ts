"use server";

import { revalidatePath } from "next/cache";
import {
  createProfesional,
  deactivateProfesional,
  deleteProfesional,
  type ProfesionalItem,
  type ProfesionalMutationInput,
  updateProfesional,
} from "@/lib/services/profesionales";

type ProfesionalActionResult =
  | { success: true; profesional?: ProfesionalItem }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export async function createProfesionalAction(
  input: ProfesionalMutationInput
): Promise<ProfesionalActionResult> {
  try {
    const profesional = await createProfesional(input);
    revalidatePath("/profesionales");
    return { success: true, profesional };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateProfesionalAction(
  id: number,
  input: ProfesionalMutationInput
): Promise<ProfesionalActionResult> {
  try {
    const profesional = await updateProfesional(id, input);
    revalidatePath("/profesionales");
    return { success: true, profesional };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deactivateProfesionalAction(
  id: number
): Promise<ProfesionalActionResult> {
  try {
    await deactivateProfesional(id);
    revalidatePath("/profesionales");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteProfesionalAction(
  id: number
): Promise<ProfesionalActionResult> {
  try {
    await deleteProfesional(id);
    revalidatePath("/profesionales");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
