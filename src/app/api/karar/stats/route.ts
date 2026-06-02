import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const [
    { count: total },
    { data: byKaynak },
    { data: bySonuc },
    { data: topDaire },
  ] = await Promise.all([
    supabase.from("kararlar").select("*", { count: "exact", head: true }),
    supabase.from("kararlar").select("kaynak").then(async ({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach(r => { counts[r.kaynak] = (counts[r.kaynak] || 0) + 1; });
      return { data: counts };
    }),
    supabase.from("kararlar").select("sonuc").not("sonuc", "eq", "").then(async ({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach(r => { if (r.sonuc) counts[r.sonuc] = (counts[r.sonuc] || 0) + 1; });
      return { data: counts };
    }),
    supabase.from("kararlar").select("daire").then(async ({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach(r => { if (r.daire) counts[r.daire] = (counts[r.daire] || 0) + 1; });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
      return { data: sorted.map(([daire, sayi]) => ({ daire, sayi })) };
    }),
  ]);

  return NextResponse.json({ total, byKaynak, bySonuc, topDaire });
}
