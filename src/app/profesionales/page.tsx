import { ProfesionalesPageClient } from "@/components/profesionales/profesionales-page-client";
import { listProfesionales } from "@/lib/services/profesionales";

export const dynamic = "force-dynamic";

export default async function ProfesionalesPage() {
  try {
    const profesionales = await listProfesionales();
    return <ProfesionalesPageClient profesionales={profesionales} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar los profesionales.";
    return <ProfesionalesPageClient profesionales={[]} loadError={message} />;
  }
}

