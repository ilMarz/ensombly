import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement, type JSXElementConstructor } from "react";
import { CertificatePDF } from "./certificate-pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: project }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("projects")
      .select("id, title, tagline, description, created_at, founder_id, profiles(full_name, username)")
      .eq("id", id)
      .single(),
  ]);

  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  if (!user || user.id !== project.founder_id) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const element = createElement(CertificatePDF, {
    project: {
      ...project,
      profiles: project.profiles as { full_name: string | null; username: string } | null,
    },
  }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>;

  const buffer = await renderToBuffer(element);
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificato-${slug}.pdf"`,
    },
  });
}
