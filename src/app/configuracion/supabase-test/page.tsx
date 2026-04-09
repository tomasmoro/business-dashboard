import Link from "next/link";
import { CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function runSupabaseServerCheck() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasPublishableKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const testKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasUrl || !testKey) {
    return {
      ok: false,
      message: "Faltan variables de entorno para Supabase.",
      details: [
        `NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? "OK" : "MISSING"}`,
        `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: ${hasPublishableKey ? "OK" : "MISSING"}`,
        `SUPABASE_SERVICE_ROLE_KEY: ${hasServiceRoleKey ? "OK" : "MISSING"}`,
      ],
    };
  }

  try {
    const restResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        method: "GET",
        headers: {
          apikey: testKey,
          Authorization: `Bearer ${testKey}`,
        },
        cache: "no-store",
      }
    );

    if (restResponse.status === 401 || restResponse.status === 403) {
      return {
        ok: false,
        message: "Token inválido para Supabase.",
        details: [
          "Supabase respondió que falta o es inválido el Bearer token.",
          `HTTP ${restResponse.status}`,
        ],
      };
    }

    if (hasServiceRoleKey) {
      const { error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });

      if (error) {
        return {
          ok: false,
          message: "Conexión REST OK, pero la validación admin falló.",
          details: [error.message],
        };
      }
    }

    return {
      ok: true,
      message: hasServiceRoleKey
        ? "Conexión de servidor con Supabase establecida correctamente (REST + Admin)."
        : "Conexión de servidor con Supabase establecida correctamente (REST).",
      details: [
        `REST auth: OK (HTTP ${restResponse.status})`,
        hasServiceRoleKey
          ? "Admin auth: OK (service_role)."
          : "Admin auth: omitida (no se detectó SUPABASE_SERVICE_ROLE_KEY).",
      ],
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo contactar Supabase desde el servidor.",
      details: [error instanceof Error ? error.message : "Error desconocido"],
    };
  }
}

export default async function SupabaseTestPage() {
  const result = await runSupabaseServerCheck();

  return (
    <DashboardShell
      title="Prueba de Supabase"
      description="Validación de conexión del servidor a Supabase"
      actions={
        <Button asChild variant="outline">
          <Link href="/configuracion">
            Volver a configuración
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {result.ok ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            Estado de conexión
          </CardTitle>
          <CardDescription>{result.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-border bg-card p-3">
            <ul className="space-y-1 text-sm text-muted-foreground">
              {result.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <Button asChild variant="secondary">
            <Link href="/configuracion/supabase-test">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reintentar prueba
            </Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
