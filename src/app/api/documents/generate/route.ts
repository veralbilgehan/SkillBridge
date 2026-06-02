import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, kategori } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt gerekli." }, { status: 400 });
    }

    const systemPrompt = `Sen bir profesyonel içerik uzmanısın. Kullanıcının isteğine göre kapsamlı, eğitim amaçlı Türkçe dökümanlar hazırlarsın.

Dökümanlar:
- Net başlıklar ve alt başlıklar içerir
- Markdown formatında yazılır
- Konuyu derinlemesine ele alır (en az 500 kelime)
- Sektöre uygun teknik terimler kullanır
- Pratik bilgi ve örnekler içerir

Yanıt olarak SADECE şu JSON formatını döndür (başka hiçbir şey ekleme):
{
  "title": "Döküman başlığı",
  "content": "Markdown formatında döküman içeriği"
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Kategori: ${kategori || "Genel"}\n\nKonu ve Amaç: ${prompt}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI geçersiz yanıt döndürdü." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ title: parsed.title, content: parsed.content });
  } catch (err) {
    console.error("Document generate error:", err);
    return NextResponse.json(
      { error: "Döküman oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
