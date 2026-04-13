"use server";

import { revalidatePath } from "next/cache";
import {
  createServicio,
  deactivateServicio,
  deleteServicio,
  type ServicioItem,
  type ServicioMutationInput,
  updateServicio,
} from "@/lib/services/servicios";

type ServicioActionResult =
  | { success: true; servicio?: ServicioItem }
  | { success: false; error: string };

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export async function createServicioAction(
  input: ServicioMutationInput
): Promise<ServicioActionResult> {
  try {
    const servicio = await createServicio(input);
    revalidatePath("/servicios");
    return { success: true, servicio };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function updateServicioAction(
  id: number,
  input: ServicioMutationInput
): Promise<ServicioActionResult> {
  try {
    const servicio = await updateServicio(id, input);
    revalidatePath("/servicios");
    return { success: true, servicio };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deactivateServicioAction(
  id: number
): Promise<ServicioActionResult> {
  try {
    await deactivateServicio(id);
    revalidatePath("/servicios");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

export async function deleteServicioAction(
  id: number
): Promise<ServicioActionResult> {
  try {
    await deleteServicio(id);
    revalidatePath("/servicios");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
