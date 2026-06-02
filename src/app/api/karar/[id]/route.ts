import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [karar_id, kaynak] = id.split("__");

  const supabase = await createClient();

  const [{ data: karar }, { data: metin }] = await Promise.all([
    supabase.from("kararlar").select("*").eq("karar_id", karar_id).eq("kaynak", kaynak).single(),
    supabase.from("karar_metinler").select("anon_text").eq("karar_id", karar_id).eq("kaynak", kaynak).single(),
  ]);

  if (!karar) return NextResponse.json({ error: "Karar bulunamadı" }, { status: 404 });

  return NextResponse.json({ ...karar, anon_text: metin?.anon_text || null });
}
