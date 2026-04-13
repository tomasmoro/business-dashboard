import { ServiciosPageClient } from "@/components/servicios/servicios-page-client";
import { listServicios } from "@/lib/services/servicios";

export const dynamic = "force-dynamic";

export default async function ServiciosPage() {
  try {
    const servicios = await listServicios();
    return <ServiciosPageClient servicios={servicios} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar los servicios desde Supabase.";

    return <ServiciosPageClient servicios={[]} loadError={message} />;
  }
}
