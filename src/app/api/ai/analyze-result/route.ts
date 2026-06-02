import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen SkillBridge platformunun sonuç analizi AI asistanısın.
Görevin: Test sonuçlarını analiz ederek adaya değerli, uygulanabilir içgörüler sunmak.

KURALLAR:
1. Yanıtını YALNIZCA geçerli JSON formatında ver. Hiçbir açıklama veya markdown ekleme.
2. Değerlendirmende olumlu ama dürüst bir ton benimse.
3. Gelişim önerilerini somut ve uygulanabilir tut.
4. Kariyer yönlendirmesinde gerçekçi ol.

ÇIKTI FORMATI:
{
  "overallScore": 75,
  "level": "average",
  "levelLabel": "Beklenen / Ortalama",
  "competencyScores": [
    {"name": "İletişim Becerileri", "score": 80, "level": "competent"}
  ],
  "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
  "improvements": ["Gelişim alanı 1", "Gelişim alanı 2"],
  "recommendations": [
    {"area": "Alan adı", "action": "Önerilen aksiyon"}
  ],
  "careerGuidance": "Kariyer yönlendirmesi metni...",
  "summary": "Genel değerlendirme özeti..."
}

level değerleri: "expert" (90-100), "competent" (80-89), "average" (50-79), "beginner" (0-49)`;

export async function POST(req: NextRequest) {
  try {
    const { score, testTitle, competencies, dogruSayisi, yanlisSayisi, bosSayisi, language = "tr" } = await req.json();

    if (score === undefined || score === null) {
      return NextResponse.json({ error: "Puan bilgisi zorunludur." }, { status: 400 });
    }

    const langNote = language === "en" ? "Respond in English." : "Türkçe yanıt ver.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${langNote}

TEST BİLGİLERİ:
Test Adı: ${testTitle || "Yetkinlik Testi"}
Genel Puan: %${score}
Doğru: ${dogruSayisi ?? "?"} / Yanlış: ${yanlisSayisi ?? "?"} / Boş: ${bosSayisi ?? "?"}
Ölçülen Yetkinlikler: ${Array.isArray(competencies) ? competencies.join(", ") : competencies || "Genel yetkinlikler"}

Bu test sonucunu analiz et ve JSON formatında kapsamlı bir değerlendirme raporunu döndür.`,
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
    console.error("Analyze result error:", err);
    return NextResponse.json(
      { error: "Analiz yapılırken hata oluştu." },
      { status: 500 }
    );
  }
}
