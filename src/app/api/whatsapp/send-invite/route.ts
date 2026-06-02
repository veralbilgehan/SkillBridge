import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // "whatsapp:+14155238886"

export async function POST(req: NextRequest) {
  try {
    const { phone, candidateName, testName, testUrl } = await req.json();

    if (!phone || !testUrl) {
      return NextResponse.json({ error: "Telefon numarası ve test URL'si zorunludur." }, { status: 400 });
    }

    // Normalize phone: strip spaces/dashes, ensure starts with +
    const normalized = phone.replace(/[\s\-()]/g, "");
    const to = normalized.startsWith("+") ? normalized : `+90${normalized}`;

    const credentialsConfigured =
      accountSid?.startsWith("AC") &&
      authToken &&
      authToken !== "your-twilio-auth-token" &&
      fromNumber?.startsWith("whatsapp:+");

    if (!credentialsConfigured) {
      // Dev mode: Twilio credentials not configured, simulate success
      console.log(`[WhatsApp DEV] To: ${to} | Test: ${testName} | URL: ${testUrl}`);
      return NextResponse.json({ success: true, dev: true, to });
    }

    const client = twilio(accountSid, authToken);

    const body = `Merhaba${candidateName ? ` ${candidateName}` : ""}! 👋\n\nSkillBridge platformu üzerinden sizi *${testName || "Yetkinlik Değerlendirme Testi"}* için davet ediyoruz.\n\n📋 *Teste başlamak için:*\nAşağıdaki bağlantıya tıklayın veya QR kodu okutun:\n${testUrl}\n\n⏱ Testin süresi 20 dakikadır.\n🔒 Test sırasında sekme değişikliği kayıt altına alınır.\n\nBaşarılar! 🍀`;

    const message = await client.messages.create({
      from: fromNumber,
      to: `whatsapp:${to}`,
      body,
    });

    return NextResponse.json({ success: true, sid: message.sid, to });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "WhatsApp gönderilemedi.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
