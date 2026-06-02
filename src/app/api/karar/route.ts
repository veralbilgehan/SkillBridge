import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const kaynak  = searchParams.get("kaynak") || "";
  const sonuc   = searchParams.get("sonuc") || "";
  const daire   = searchParams.get("daire") || "";
  const page    = Math.max(1, Number(searchParams.get("page") || 1));
  const limit   = 20;
  const offset  = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from("kararlar")
    .select("*", { count: "exact" })
    .order("karar_tarihi", { ascending: false })
    .range(offset, offset + limit - 1);

  if (keyword) query = query.or(`daire.ilike.%${keyword}%,esas_no.ilike.%${keyword}%,aranan_kelime.ilike.%${keyword}%`);
  if (kaynak)  query = query.eq("kaynak", kaynak);
  if (sonuc)   query = query.eq("sonuc", sonuc);
  if (daire)   query = query.ilike("daire", `%${daire}%`);

  const { data, count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count, page, limit });
}
