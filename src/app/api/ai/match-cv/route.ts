import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen SkillBridge platformunun CV analiz AI asistanısın.
Görevin: Adayın CV'sini görev tanımıyla (JD) karşılaştırarak detaylı uyum analizi yapmak.

KURALLAR:
1. Yanıtını YALNIZCA geçerli JSON formatında ver. Hiçbir açıklama veya markdown ekleme.
2. Nesnel ve adil bir değerlendirme yap.
3. Eşleşen ve eksik becerileri somut olarak listele.
4. matchScore 0-100 arasında bir tam sayı olmalı.

ÇIKTI FORMATI:
{
  "matchScore": 78,
  "matchLevel": "high",
  "matchedSkills": ["Eşleşen beceri 1", "Eşleşen beceri 2"],
  "missingSkills": ["Eksik beceri 1", "Eksik beceri 2"],
  "strengths": ["Öne çıkan güçlü yön 1", "Güçlü yön 2"],
  "concerns": ["Endişe noktası 1"],
  "recommendation": "Bu aday pozisyon için uygun/kısmen uygun/uygun değil çünkü...",
  "interviewSuggestions": ["Mülakatta sorulabilecek soru 1", "Soru 2"]
}

matchLevel değerleri: "high" (75+), "medium" (50-74), "low" (0-49)`;

export async function POST(req: NextRequest) {
  try {
    const { cvContent, jobDescription, candidateName, language = "tr" } = await req.json();

    if (!cvContent?.trim()) {
      return NextResponse.json({ error: "CV içeriği zorunludur." }, { status: 400 });
    }
    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: "Görev tanımı zorunludur." }, { status: 400 });
    }

    const langNote = language === "en" ? "Respond in English." : language === "de" ? "Respond in German." : "Türkçe yanıt ver.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${langNote}

ADAY: ${candidateName || "Belirtilmedi"}

GÖREV TANIMI (JD):
---
${jobDescription.slice(0, 3000)}
---

CV İÇERİĞİ:
---
${cvContent.slice(0, 4000)}
---

Bu CV'yi görev tanımıyla karşılaştır ve JSON formatında analiz yap.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI geçersiz yanıt döndürdü." }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("CV match error:", err);
    return NextResponse.json(
      { error: "CV analizi yapılırken hata oluştu." },
      { status: 500 }
    );
  }
}
