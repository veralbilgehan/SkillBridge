export interface KilavuzMadde {
  baslik: string;
  icerik: string;
  etiketler: string[];
}

export const KILAVUZ_MADDELER: KilavuzMadde[] = [
  // ── Genel ──────────────────────────────────────────────────────────
  {
    baslik: "SkillBridge Nedir?",
    icerik:
      "SkillBridge; şirketlerin adaylara ve çalışanlarına yetkinlik testleri oluşturmasını, uygulamasını ve sonuçları analiz etmesini sağlayan yapay zeka destekli bir İK platformudur. Sistem kontör tabanlı çalışır — her işlem belirli miktarda kontör harcar.",
    etiketler: ["skillbridge", "platform", "nedir", "hakkında", "genel"],
  },

  // ── Giriş / Kayıt ──────────────────────────────────────────────────
  {
    baslik: "Giriş Yap",
    icerik:
      "Kayıtlı kullanıcılar e-posta ve şifresiyle giriş yapar. Supabase Auth altyapısı kullanılır. 'Şifremi Unuttum' bağlantısı şifre sıfırlama akışını başlatır.",
    etiketler: ["giriş", "login", "e-posta", "şifre", "oturum"],
  },
  {
    baslik: "Kayıt Ol",
    icerik:
      "İki kullanıcı tipi vardır: Bireysel (serbest danışmanlar) ve Kurumsal (şirket adına; şirket adı, sektör ve çalışan sayısı girilir). Kayıt tamamlanınca hesaba 50 ücretsiz kontör tanımlanır.",
    etiketler: ["kayıt", "register", "bireysel", "kurumsal", "üyelik", "hoş geldiniz"],
  },
  {
    baslik: "Şifre Sıfırlama",
    icerik:
      "E-posta adresi girilir; sisteme kayıtlıysa sıfırlama bağlantısı e-posta ile iletilir.",
    etiketler: ["şifre", "sıfırla", "unutdum", "reset"],
  },

  // ── Dashboard ──────────────────────────────────────────────────────
  {
    baslik: "Ana Gösterge Paneli",
    icerik:
      "Giriş yapıldıktan sonra ilk açılan sayfadır. Toplam Test, Toplam Aday, Ortalama Puan ve Kontör Bakiyesi özet kartları üstte yer alır. Altında aktif testler, seviye dağılımı ve son aktiviteler listelenir.",
    etiketler: ["dashboard", "gösterge", "panel", "ana sayfa", "özet"],
  },
  {
    baslik: "Aktif Testler",
    icerik:
      "Çalışmaya devam eden testlerin listesidir. Her satırda sektör, aday sayısı ve ortalama puan gösterilir. Satıra tıklanarak test detayına gidilir.",
    etiketler: ["aktif", "testler", "çalışan", "devam eden"],
  },
  {
    baslik: "Seviye Dağılımı",
    icerik:
      "Tamamlanan testlerin sonuçları dört kategoride gösterilir: Çok Yetkin (yeşil), Yetkin (mor), Ortalama (sarı), Yetkin Olmayan (kırmızı). Bar grafik olarak görselleştirilir.",
    etiketler: ["seviye", "dağılım", "çok yetkin", "yetkin", "ortalama", "yetkin olmayan"],
  },
  {
    baslik: "Hızlı Erişim",
    icerik:
      "Dashboard'daki kısayol butonları: Test Oluştur → /tests/new, Aday Davet Et → /candidates, Sonuçları İncele → /results, Kontör Yükle → /settings.",
    etiketler: ["hızlı erişim", "kısayol", "buton"],
  },

  // ── Testler ────────────────────────────────────────────────────────
  {
    baslik: "Testler Listesi",
    icerik:
      "Oluşturulan tüm testlerin listelendiği sayfadır. Sütunlar: ID No (TST-001 formatı), Test başlığı, Konu, Sektör, Boyut (soru sayısı), Tarih ve İşlemler (Görüntüle / Düzenle / İndir / Sil). Oluşturulan yeni testler otomatik olarak bu listeye eklenir, sayfa yenilense de kaybolmaz.",
    etiketler: ["testler", "liste", "TST", "test listesi"],
  },
  {
    baslik: "Test Silme",
    icerik:
      "Sil butonuna basıldığında test listeden ve localStorage'dan kalıcı olarak silinir. Bu işlem geri alınamaz.",
    etiketler: ["sil", "delete", "kaldır", "test sil"],
  },
  {
    baslik: "Test İndirme",
    icerik:
      "İndir butonuna basıldığında 2 saniye geri bildirimli indirme simülasyonu gösterilir.",
    etiketler: ["indir", "download", "export"],
  },

  // ── Yeni Test ──────────────────────────────────────────────────────
  {
    baslik: "Yeni Test Oluştur — Genel",
    icerik:
      "Altı adımlı sihirbaz (wizard) arayüzüyle test hazırlanır: 0-Doküman Seçimi, 1-Parametreler, 2-Yetkinlik Seçimi, 3-AI Sohbet, 4-Taslak İnceleme, 5-Yayınlama.",
    etiketler: ["yeni test", "test oluştur", "wizard", "sihirbaz", "adım"],
  },
  {
    baslik: "Doküman Seçimi (Adım 0)",
    icerik:
      "Test için kaynak doküman seçilir. 'Dosya Yükle' ile bilgisayardan PDF/Word/HTML yüklenir. 'Kütüphaneden Seç' ile daha önce sisteme yüklenen dokümanlar arasından arama yapılarak seçim yapılır. Seçilen doküman AI'ya kaynak olarak iletilir.",
    etiketler: ["doküman", "dosya yükle", "kütüphaneden seç", "adım 0", "kaynak"],
  },
  {
    baslik: "Test Parametreleri (Adım 1)",
    icerik:
      "Sektör (13 sektör), Meslek (sektöre göre otomatik dolar), Birim/Departman (20 departman), Ünvan (35 ünvan, Stajyer'den CEO'ya), Zorluk (Başlangıç/Orta/İleri), Soru Sayısı (5-30 kaydırıcı), Soru Tipleri (Çoktan seçmeli, Çoklu doğru, Açık uçlu, Evet/Hayır, Sıralama) alanları doldurulur.",
    etiketler: ["parametre", "sektör", "meslek", "birim", "departman", "ünvan", "zorluk", "soru sayısı", "adım 1"],
  },
  {
    baslik: "Yetkinlik Seçimi (Adım 2)",
    icerik:
      "Dört kategoride 40 yetkinlik sunulur. En az 1 seçim zorunludur. Kategoriler: Bilişsel Yetkinlikler (analitik düşünme, problem çözme vb.), Teknik Yetkinlikler (veri okuryazarlığı, süreç odaklılık vb.), Temel Yetkinlikler (iletişim, takım çalışması vb.), Yönetsel Yetkinlikler (liderlik, delegasyon vb.).",
    etiketler: ["yetkinlik", "bilişsel", "teknik", "temel", "yönetsel", "adım 2", "seçim"],
  },
  {
    baslik: "AI Sohbet (Adım 3)",
    icerik:
      "Seçilen doküman ve parametreler AI'ya iletilir. Sohbet kutusu otomatik başlangıç mesajıyla açılır. Kullanıcı '5. soruyu daha zor yap' veya 'Liderlik soruları ekle' gibi istekler yazarak testi özelleştirebilir. 'Testle Oluştur' butonuna basılınca AI soruları üretir. Her AI sohbeti 50 kontör harcar.",
    etiketler: ["ai", "sohbet", "chat", "yapay zeka", "claude", "adım 3", "üret"],
  },
  {
    baslik: "Taslak İnceleme (Adım 4)",
    icerik:
      "Üretilen soruların her biri kart olarak listelenir. Her soruda soru metni, tipi, seçenekler, doğru cevap, açıklama ve ilgili yetkinlik gösterilir. Sorular üzerinde düzenleme, silme ve yeniden üretme yapılabilir.",
    etiketler: ["taslak", "inceleme", "soru", "düzenle", "adım 4"],
  },
  {
    baslik: "Yayınlama (Adım 5)",
    icerik:
      "Test başlığı, sektör ve meslek bilgisi onaylanır. 'Yayınla' butonuna basılınca test localStorage'a kaydedilir ve testler listesine otomatik eklenir.",
    etiketler: ["yayınla", "kaydet", "adım 5", "publish"],
  },

  // ── Dokümanlar ─────────────────────────────────────────────────────
  {
    baslik: "Dokümanlar Listesi",
    icerik:
      "Yüklenen ve AI ile oluşturulan tüm dokümanların kütüphanesidir. Sütunlar: ID No (DOC-001), Doküman başlığı, Konu, Sektör, Boyut, Tarih, İşlemler (Görüntüle/Düzenle/Test Oluştur/İndir/Sil). 'Test Oluştur' butonu dokümanı seçili hâlde /tests/new sayfasına yönlendirir.",
    etiketler: ["doküman", "liste", "DOC", "kütüphane", "belgeler"],
  },
  {
    baslik: "Yeni Doküman Oluştur",
    icerik:
      "İki mod vardır. Mod A — Dosya Yükle: Sürükle-bırak veya dosya seçiciyle PDF/Word/HTML yüklenir, ardından başlık/kategori/konu/sektör girilir. Mod B — AI ile Oluştur: Sohbet arayüzünde istek yazılır, AI dokümanı üretir. AI doküman oluşturma 50 kontör harcar.",
    etiketler: ["yeni doküman", "dosya yükle", "ai doküman", "sürükle bırak"],
  },

  // ── Adaylar ────────────────────────────────────────────────────────
  {
    baslik: "Aday Davet Et — E-posta",
    icerik:
      "Test seçilir, aday e-posta adresi girilir, isteğe bağlı son başvuru tarihi belirlenir. 'Daveti Gönder' butonuna basılınca davet gönderilir ve QR kodu modal otomatik açılır. Aday QR'ı okutarak testi bulur.",
    etiketler: ["e-posta", "davet", "email invite", "qr", "gönder"],
  },
  {
    baslik: "Aday Davet Et — WhatsApp",
    icerik:
      "Test seçilir, aday adı (opsiyonel) ve +90 ile başlayan 10 haneli telefon numarası girilir. 'WhatsApp ile Davet Gönder' butonuna basılır. Twilio yapılandırılmışsa gerçek mesaj gider; yapılandırılmamışsa geliştirme modunda simüle edilir.",
    etiketler: ["whatsapp", "davet", "telefon", "twilio", "mesaj"],
  },
  {
    baslik: "Toplu Davet (CSV)",
    icerik:
      "Manuel satır satır ad/soyad/e-posta girilebilir veya hazır CSV dosyası yüklenebilir (format: ad, soyad, e-posta). '+ Satır Ekle' ile yeni satır eklenir, çöp kutusuyla silinir.",
    etiketler: ["toplu", "csv", "bulk", "çoklu", "satır"],
  },
  {
    baslik: "Davet Bağlantısı & QR",
    icerik:
      "Test seçilir, geçerlilik (her zaman aktif veya belirli tarih) belirlenir. Sistem otomatik token üretip /test/[token] bağlantısını oluşturur. Bağlantı kopyalanabilir, QR kodu SVG olarak indirilebilir.",
    etiketler: ["bağlantı", "link", "qr kodu", "token", "davet bağlantısı"],
  },
  {
    baslik: "Aday Listesi & Porföy",
    icerik:
      "Şirkete ait adayların tüm test geçmişini gösteren porföy tablosudur. Departman filtresi ve serbest metin arama (ad/e-posta/pozisyon) ile filtrelenir. Tablo sütunları: Aday, Departman, 1. Test, Tarih, Sonuç, 2. Test, Tarih, Sonuç, Gelişim (▲/▼ delta). Puan renkleri: ≥80 yeşil, ≥60 sarı, <60 kırmızı.",
    etiketler: ["aday listesi", "porföy", "gelişim", "delta", "puan", "departman filtre"],
  },
  {
    baslik: "Testi Paylaş & QR (Alt Panel)",
    icerik:
      "Aday listesinin altındaki panelden bir test seçildiğinde QR kodu otomatik oluşur. E-posta ile Gönder, WhatsApp ile Gönder ve Bağlantıyı Aç butonlarıyla paylaşılabilir. QR kodu SVG olarak indirilebilir.",
    etiketler: ["paylaş", "qr", "alt panel", "testi paylaş", "whatsapp gönder"],
  },
  {
    baslik: "Bildirimler",
    icerik:
      "Test tamamlandı, davet açıldı, kontör uyarısı gibi sistem bildirimleri listelenir. Okunmamış bildirimler mavi nokta ile işaretlidir. 'Tümünü okundu işaretle' ile temizlenir.",
    etiketler: ["bildirim", "notification", "okundu", "uyarı"],
  },
  {
    baslik: "Entegrasyonlar",
    icerik:
      "Webhook: test tamamlanınca harici sisteme POST isteği gönderilir. CSV Dışa Aktarma: tüm sonuçları CSV olarak indir. Faz 2 yol haritasında SAP SuccessFactors, Workday, BambooHR, Greenhouse ATS entegrasyonları planlanmaktadır.",
    etiketler: ["webhook", "entegrasyon", "api", "csv export", "ats", "workday", "bamboohr"],
  },

  // ── Test Çözme ─────────────────────────────────────────────────────
  {
    baslik: "Test Çözme Sayfası",
    icerik:
      "Adayın QR kodu okutunca veya davet bağlantısına tıklayınca açtığı sayfadır. Önce ad giriş ekranı gösterilir (test süresi, soru sayısı ve güvenlik uyarısı). Ad girilip 'Teste Başla'ya basılınca sorular birer birer gelir. Tamamlanınca sistem sonuçları kaydeder.",
    etiketler: ["test çöz", "aday ekranı", "teste başla", "ad giriş", "token"],
  },

  // ── Sonuçlar ───────────────────────────────────────────────────────
  {
    baslik: "Sonuçlar Sayfası",
    icerik:
      "Test bazlı analiz: toplam katılımcı, ortalama puan, doğruluk oranı, tutarlılık skoru ve seviye dağılımı gösterilir. Soru analizi: her sorunun doğru yanıtlanma oranı bar grafik olarak gösterilir. Aday bazlı filtrelenebilir tablo ve CSV indirme mevcuttur.",
    etiketler: ["sonuç", "result", "analiz", "doğruluk", "tutarlılık", "soru analizi"],
  },
  {
    baslik: "Aday Detay Sonucu",
    icerik:
      "Tek adayın performansı derinlemesine gösterilir: yetkinlik bazlı radar grafiği, her soruya verilen yanıt ve doğru/yanlış analizi, AI yorumu ve gelişim önerileri.",
    etiketler: ["aday detay", "radar", "yorum", "gelişim önerisi", "ai yorum"],
  },

  // ── Değerlendirme ──────────────────────────────────────────────────
  {
    baslik: "360° Değerlendirme",
    icerik:
      "Çalışanlar için 360 derece geri bildirim sürecini yönetir. Çalışan adı/pozisyonu girilir, değerlendiriciler eklenir (Kendisi/Yönetici/İş Arkadaşı/Farklı Departman). Tüm paydaşların yanıtları toplandığında yetkinlik karşılaştırması, kör nokta analizi, güçlü yönler ve AI gelişim önerileri gösterilir.",
    etiketler: ["360", "değerlendirme", "geri bildirim", "kör nokta", "paydaş", "yönetici"],
  },
  {
    baslik: "CV Analizi",
    icerik:
      "CV dosyası yüklenir, AI çalışma geçmişi özeti, tespit edilen yetkinlikler, uygun pozisyon önerileri ve eksik yetkinlik alanlarını çıkarır.",
    etiketler: ["cv", "özgeçmiş", "analiz", "pozisyon önerisi", "yetkinlik tespiti"],
  },

  // ── Vaka Analizi ───────────────────────────────────────────────────
  {
    baslik: "Vaka Analizi",
    icerik:
      "Anlık seviye tespit sınavı oluşturur. Hazır vaka testleri listesinden seçim yapılır veya iş ilanından hızla test üretilir. Tamamlanınca yetkinlik bazlı sonuç raporu gösterilir. Her vaka testi 100 kontör harcar.",
    etiketler: ["vaka", "analiz", "seviye tespit", "anlık", "iş ilanı"],
  },

  // ── ISO 27001 ──────────────────────────────────────────────────────
  {
    baslik: "ISO 27001 Yönetim Sistemi",
    icerik:
      "Bilgi güvenliği yönetim sistemi (BGYS) süreçlerini takip etmek için geliştirilmiş modüldür. Alt modüller: Kontroller (Annex A listesi), Riskler (etki/olasılık/risk skoru), Denetimler (iç denetim takvimi), Belgeler (politika ve prosedürler).",
    etiketler: ["iso", "27001", "bgys", "güvenlik", "kontrol", "risk", "denetim"],
  },

  // ── Kontörler ──────────────────────────────────────────────────────
  {
    baslik: "Kontör Sistemi",
    icerik:
      "Platform kontör tabanlı çalışır. Fiyatlar: Yeni üyelik hediyesi +50 (otomatik), Hazır test çözümü 1/soru, AI test yorumlama 10, AI test/doküman oluşturma 50, Kendi dokümanından test 50, Seviye tespit sınavı 100.",
    etiketler: ["kontör", "kredi", "ücret", "fiyat", "bakiye"],
  },
  {
    baslik: "Kontör Paketleri",
    icerik:
      "Başlangıç: 100 kontör / ₺99 | Standart: 300 kontör / ₺249 | Profesyonel (önerilen): 750 kontör / ₺499 | Kurumsal: 2000 kontör / ₺999.",
    etiketler: ["paket", "başlangıç", "standart", "profesyonel", "kurumsal", "satın al"],
  },

  // ── Yetkinlik Seviyeleri ───────────────────────────────────────────
  {
    baslik: "Yetkinlik Seviyeleri (A-E)",
    icerik:
      "A — Çok Yetersiz: Beklenen davranış çoğunlukla görülmez, yoğun yönlendirme gerekir.\nB — Yetersiz: Kısmen yapar, tutarsızdır; şablon/rehberlik ister.\nC — Beklenen: Standart düzeyde yapar, kurallara uyar.\nD — Yeterli: Güçlü performans, proaktif iyileştirir, başkalarına mentorluk verir.\nE — Çok Yeterli: Örnek düzeyde yapar, yöntem/standart geliştirir, iyi uygulamayı kurum genelinde yaygınlaştırır.",
    etiketler: ["seviye", "a", "b", "c", "d", "e", "çok yetersiz", "yetersiz", "beklenen", "yeterli", "çok yeterli"],
  },
  {
    baslik: "Analitik Düşünme",
    icerik:
      "Veri/durum/problemi parçalara ayırarak neden–sonuç ilişkisini anlamlandırma, alternatif çözüm yolları üretme yetkinliğidir. Bilişsel Yetkinlikler kategorisindedir.",
    etiketler: ["analitik", "düşünme", "neden sonuç", "veri analizi"],
  },
  {
    baslik: "Problem Çözme",
    icerik:
      "Karmaşık durumlarda kök nedeni belirleyip uygulanabilir çözümler geliştirme yetkinliğidir. Bilişsel Yetkinlikler kategorisindedir.",
    etiketler: ["problem", "çözme", "kök neden", "çözüm"],
  },
  {
    baslik: "İletişim Yetkinliği",
    icerik:
      "Açık, net, saygılı ve etkin iletişim kurabilme yetkinliğidir. Temel Yetkinlikler kategorisindedir.",
    etiketler: ["iletişim", "communication", "net", "açık"],
  },
  {
    baslik: "Takım Çalışması",
    icerik:
      "Ortak amaç için işbirliği ve uyum içinde çalışabilme yetkinliğidir. Temel Yetkinlikler kategorisindedir.",
    etiketler: ["takım", "işbirliği", "ekip", "team"],
  },
  {
    baslik: "Stratejik Düşünme",
    icerik:
      "Büyük resmi görme, uzun vadeli hedefler belirleme ve strateji-plan dengesi kurma yetkinliğidir. Yönetsel Yetkinlikler kategorisindedir.",
    etiketler: ["stratejik", "strateji", "uzun vadeli", "büyük resim"],
  },
  {
    baslik: "Liderlik",
    icerik:
      "İnsanları ortak hedef etrafında toplama, ilham verme ve motivasyon yaratma yetkinliğidir (Vizyoner Liderlik). Yönetsel Yetkinlikler kategorisindedir.",
    etiketler: ["liderlik", "vizyon", "ilham", "motivasyon", "leader"],
  },
  {
    baslik: "Delegasyon",
    icerik:
      "Doğru kişiye doğru işi verme; güven esaslı yönetim ve kontrol mekanizması kurma yetkinliğidir. Yönetsel Yetkinlikler kategorisindedir.",
    etiketler: ["delegasyon", "yetki devri", "güven", "iş dağıtımı"],
  },
  {
    baslik: "Dijital Yetkinlik",
    icerik:
      "Teknolojik araçları ve dijital sistemleri etkin kullanma; dijital etik ve veri güvenliği yetkinliğidir. Teknik Yetkinlikler kategorisindedir.",
    etiketler: ["dijital", "teknoloji", "veri güvenliği", "araç"],
  },

  // ── Birimler ───────────────────────────────────────────────────────
  {
    baslik: "İnsan Kaynakları Birimi",
    icerik:
      "İşe alım ve yetenek kazanımı, organizasyonel gelişim, ücret & yan haklar (Comp & Ben), performans yönetimi, eğitim ve gelişim (L&D), çalışan ilişkileri ve İK operasyonları alt birimlerini kapsar.",
    etiketler: ["insan kaynakları", "ik", "işe alım", "performans", "eğitim"],
  },
  {
    baslik: "Finans ve Muhasebe Birimi",
    icerik:
      "Muhasebe (genel/maliyet), FP&A, bütçe ve raporlama, nakit yönetimi/treasury, vergi, bordro, alacak yönetimi, borç yönetimi ve iç kontrol alt birimlerini kapsar.",
    etiketler: ["finans", "muhasebe", "bütçe", "treasury", "bordro", "vergi"],
  },
  {
    baslik: "Teknoloji / Yazılım Birimi",
    icerik:
      "Backend, Frontend, Mobil, DevOps/SRE, Veri Mühendisliği, Yapay Zeka/ML, Bilgi Güvenliği, Yazılım Mimarisi alt birimlerini kapsar.",
    etiketler: ["yazılım", "mühendislik", "backend", "frontend", "devops", "ai", "ml"],
  },
  {
    baslik: "Tedarik Zinciri ve Lojistik",
    icerik:
      "Satın alma (procurement), tedarikçi yönetimi, talep planlama, üretim planlama, depo/antrepo, nakliye/sevkiyat, ithalat/ihracat ve stok yönetimi alt birimlerini kapsar.",
    etiketler: ["tedarik", "lojistik", "sevkiyat", "depo", "stok", "ihracat"],
  },

  // ── Sektörler ──────────────────────────────────────────────────────
  {
    baslik: "Ağaç / Ahşap / Mobilya Sektörü",
    icerik:
      "Ham orman ürünlerinin işlenmesinden son tüketiciye ulaşan mobilya tasarımına kadar uzanan döngüyü kapsar. Kereste üretimi, MDF/kontrplak/OSB levha imalatı, ahşap yapı elemanları, yüzey işlem ve mobilya mağazacılığı.",
    etiketler: ["ağaç", "ahşap", "mobilya", "kereste", "MDF", "kontrplak"],
  },
  {
    baslik: "Metal / Metalürji / Makine Sektörü",
    icerik:
      "Pik demir, çelik dökümü, haddeleme, CNC kesim (oksijen/plazma/lazer), bağlantı elemanları, takım tezgahları, hidrolik sistemler ve rulman üretimini kapsar.",
    etiketler: ["metal", "metalurji", "makine", "çelik", "CNC", "kaynak"],
  },
  {
    baslik: "Teknoloji / Bilişim / Elektronik Sektörü",
    icerik:
      "Yarı iletkenler, mikroçipler, PCB, optik cihazlar, yazılım geliştirme, siber güvenlik, veri merkezleri ve cloud hizmetlerini kapsar.",
    etiketler: ["teknoloji", "bilişim", "elektronik", "yazılım", "siber güvenlik", "cloud"],
  },
  {
    baslik: "Finans / Bankacılık / Sigortacılık Sektörü",
    icerik:
      "Mevduat, kredi, nakit yönetimi, menkul kıymetler, portföy yönetimi, borsa aracılığı, kasko/sağlık/hayat sigortası ve hasar ekspertiz hizmetlerini kapsar.",
    etiketler: ["finans", "bankacılık", "sigorta", "portföy", "kredi", "borsa"],
  },

  // ── Ünvanlar ───────────────────────────────────────────────────────
  {
    baslik: "C-Level Ünvanlar",
    icerik:
      "CEO (İcra Kurulu Başkanı), COO (Operasyondan Sorumlu), CFO (Finanstan Sorumlu), CTO (Teknolojiden Sorumlu), CMO (Pazarlamadan Sorumlu), CHRO (İK'dan Sorumlu), CSO (Strateji/Satıştan Sorumlu), CDO (Dijital/Veriden Sorumlu) üst düzey liderlik pozisyonlarıdır.",
    etiketler: ["CEO", "COO", "CFO", "CTO", "CMO", "CHRO", "c-level", "üst düzey"],
  },
  {
    baslik: "Orta Kademe Yönetim",
    icerik:
      "Müdür, Kıdemli Müdür, Direktör, Kıdemli Direktör, Genel Müdür Yardımcısı pozisyonları orta-üst kademe yönetimi oluşturur. Stratejik kararları uygulama ve ekip yönetiminden sorumludur.",
    etiketler: ["müdür", "direktör", "genel müdür", "kıdemli", "yönetim"],
  },
  {
    baslik: "Uzman Pozisyonları",
    icerik:
      "Uzman Yardımcısı, Uzman ve Kıdemli Uzman pozisyonları teknik/fonksiyonel derinlik gerektiren rolleri tanımlar. Proje Yöneticisi ve Takım Lideri de bu grupta değerlendirilir.",
    etiketler: ["uzman", "kıdemli uzman", "uzman yardımcısı", "proje yöneticisi", "takım lideri"],
  },
  {
    baslik: "Operasyonel Pozisyonlar",
    icerik:
      "Operatör, Teknisyen, Formen, İşçi, Vardiya Amiri, Grup Lideri pozisyonları üretim ve saha operasyonlarında yer alan roller için kullanılır.",
    etiketler: ["operatör", "teknisyen", "formen", "işçi", "vardiya", "saha"],
  },

  // ── Admin ──────────────────────────────────────────────────────────
  {
    baslik: "Admin Paneli",
    icerik:
      "Yalnızca admin rolündeki kullanıcılar erişebilir. Alt sayfalar: /admin (platform istatistikleri), /admin/companies (şirket listesi), /admin/users (kullanıcı yönetimi), /admin/taxonomy (sektör/meslek/yetkinlik veri tabanı), /admin/credits (kontör yönetimi).",
    etiketler: ["admin", "yönetici", "panel", "şirket yönetimi", "kullanıcı yönetimi"],
  },
];

export function kilavuzAra(sorgu: string): KilavuzMadde[] {
  const q = sorgu.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const kelimeler = q.split(/\s+/).filter((k) => k.length >= 2);

  const skorlar = KILAVUZ_MADDELER.map((madde) => {
    let skor = 0;
    const hedef = (madde.baslik + " " + madde.etiketler.join(" ") + " " + madde.icerik).toLowerCase();

    for (const kelime of kelimeler) {
      if (madde.etiketler.some((e) => e.toLowerCase() === kelime)) skor += 10;
      else if (madde.baslik.toLowerCase().includes(kelime)) skor += 6;
      else if (madde.etiketler.some((e) => e.toLowerCase().includes(kelime))) skor += 4;
      else if (hedef.includes(kelime)) skor += 1;
    }

    return { madde, skor };
  });

  return skorlar
    .filter((s) => s.skor > 0)
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 3)
    .map((s) => s.madde);
}
