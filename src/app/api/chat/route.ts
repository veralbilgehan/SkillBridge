import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Sen SkillBridge platformunun AI asistanısın.

SkillBridge, şirketlerin ve bireylerin yapay zeka destekli, doküman tabanlı, kişiselleştirilmiş testler ve
performans değerlendirme süreçleri yürütebildiği bir SaaS platformudur.

Kullanıcılara şu konularda yardımcı olursun:
- Test oluşturma ve yönetme
- Doküman yükleme ve kütüphane yönetimi
- Aday davet ve değerlendirme süreçleri
- Test sonuçlarını ve AI raporlarını yorumlama
- 360° performans değerlendirme
- CV ve görev tanımı eşleştirme
- Kontör (kredi) yönetimi
- Platform kullanımı hakkında genel sorular

Samimi, bilgili ve yardımsever bir üslupla konuşursun.
Türkçe konuşuyorsan Türkçe, İngilizce konuşuyorsan İngilizce cevap verirsin.
Cevapların net, pratik ve anlaşılır olur.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const filtered = messages.filter(
      (m: { role: string }) => m.role === "user" || m.role === "assistant"
    );

    const apiMessages =
      filtered.length === 0 || filtered[0].role !== "user"
        ? [{ role: "user", content: "Merhaba" }]
        : filtered;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ content: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
