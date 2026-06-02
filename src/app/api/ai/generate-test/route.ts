import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen SkillBridge platformunun test oluşturma AI asistanısın.
Görevin: Verilen parametre ve doküman içeriğine göre yüksek kaliteli test soruları üretmek.

KURALLAR:
1. Yanıtını YALNIZCA geçerli JSON formatında ver. Hiçbir açıklama veya markdown ekleme.
2. Her soru, doküman içeriğiyle veya seçilen yetkinliklerle doğrudan ilişkili olmalı.
3. Zorluk seviyesine uygun dil ve kavramlar kullan.
4. Çoktan seçmeli sorularda yanlış seçenekler (distractors) mantıklı ve yanıltıcı olmalı.
5. Açık uçlu sorularda beklenen yanıt kriterlerini belirt.
6. Tüm sorular Türkçe olmalı (dil belirtilmedikçe).

ÇIKTI FORMATI (kesinlikle bu JSON yapısını kullan):
{
  "questions": [
    {
      "type": "multiple_choice",
      "content": "Soru metni buraya",
      "options": [
        {"id": "a", "text": "Seçenek A", "isCorrect": false},
        {"id": "b", "text": "Seçenek B", "isCorrect": true},
        {"id": "c", "text": "Seçenek C", "isCorrect": false},
        {"id": "d", "text": "Seçenek D", "isCorrect": false}
      ],
      "correctAnswer": "b",
      "explanation": "Doğru yanıt B'dir çünkü...",
      "competency": "İlgili yetkinlik adı",
      "difficulty": "intermediate"
    }
  ],
  "metadata": {
    "totalQuestions": 10,
    "estimatedDuration": 15,
    "difficultyDistribution": {"beginner": 3, "intermediate": 5, "advanced": 2}
  }
}

Soru tiplerine göre format:
- multiple_choice: 4 seçenek, 1 doğru
- multi_correct: 4 seçenek, birden fazla doğru (options dizisinde birden fazla isCorrect:true)
- open_ended: options boş dizi [], correctAnswer açıklayıcı beklenti metni
- yes_no: options=[{id:"a",text:"Evet",isCorrect:true/false},{id:"b",text:"Hayır",isCorrect:true/false}]
- ordering: options sıranın karışık hali, correctAnswer doğru sıra (ör: "b,d,a,c")`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      documentContent,
      competencies = [],
      questionCount = 10,
      difficulty = "intermediate",
      questionTypes = ["multiple_choice"],
      sector,
      occupation,
      language = "tr",
    } = body;

    if (questionCount < 1 || questionCount > 50) {
      return NextResponse.json({ error: "Soru sayısı 1-50 arasında olmalı." }, { status: 400 });
    }

    const userPrompt = `
Lütfen aşağıdaki parametrelere göre ${questionCount} adet test sorusu üret:

SEKTÖR: ${sector || "Belirtilmedi"}
MESLEK/POZİSYON: ${occupation || "Belirtilmedi"}
YETKİNLİKLER: ${competencies.join(", ") || "Genel yetkinlikler"}
ZORLUK SEVİYESİ: ${difficulty === "beginner" ? "Başlangıç" : difficulty === "advanced" ? "İleri" : "Orta"}
SORU TİPLERİ: ${questionTypes.join(", ")}
DİL: ${language === "tr" ? "Türkçe" : language === "en" ? "İngilizce" : "Almanca"}

${documentContent ? `DOKÜMAN İÇERİĞİ (soruları buradan türet):
---
${documentContent.slice(0, 6000)}
---` : "Seçilen yetkinlikler ve sektör bilgisine göre genel sorular üret."}

Toplam ${questionCount} soru üret. Soru tiplerini dengeli dağıt: ${questionTypes.join(", ")}.
`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // JSON'u bul — kesilmiş olabilir, en uzun geçerli parse'ı dene
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI geçersiz yanıt döndürdü." }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // Kesilmiş JSON — questions dizisini manuel kurtarmaya çalış
      const questionsMatch = text.match(/"questions"\s*:\s*(\[[\s\S]*)/);
      if (!questionsMatch) {
        return NextResponse.json({ error: "AI yanıtı işlenemedi. Daha az soru seçin." }, { status: 500 });
      }
      // Dizi kapanana kadar al, son geçersiz elemanı kes
      let arr = questionsMatch[1];
      // Son tam nesneyi bul
      const lastBrace = arr.lastIndexOf("},");
      if (lastBrace !== -1) arr = arr.slice(0, lastBrace + 1) + "]";
      else arr = arr.slice(0, arr.lastIndexOf("}") + 1) + "]";
      try {
        const questions = JSON.parse(arr);
        parsed = { questions, metadata: { totalQuestions: questions.length, estimatedDuration: questions.length * 2 } };
      } catch {
        return NextResponse.json({ error: "AI yanıtı işlenemedi. Daha az soru seçin." }, { status: 500 });
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Test generation error:", err);
    return NextResponse.json(
      { error: "Test üretilirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
