-- Supabase Migration: Karar Arama Tabloları
-- Çalıştırma: Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS kararlar (
  id              BIGSERIAL PRIMARY KEY,
  karar_id        TEXT NOT NULL,
  kaynak          TEXT NOT NULL CHECK (kaynak IN ('emsal', 'yargitay')),
  daire           TEXT,
  esas_no         TEXT,
  karar_no        TEXT,
  karar_tarihi    TEXT,
  durum           TEXT,
  aranan_kelime   TEXT,
  sonuc           TEXT CHECK (sonuc IN ('Bozma', 'Onama', 'Red', 'Belirsiz', '')),
  text_len        INTEGER DEFAULT 0,
  scraped_at      TIMESTAMPTZ,
  UNIQUE (karar_id, kaynak)
);

CREATE TABLE IF NOT EXISTS karar_metinler (
  karar_id    TEXT NOT NULL,
  kaynak      TEXT NOT NULL,
  anon_text   TEXT,
  PRIMARY KEY (karar_id, kaynak)
);

-- Arama için indeksler
CREATE INDEX IF NOT EXISTS idx_kararlar_kaynak   ON kararlar(kaynak);
CREATE INDEX IF NOT EXISTS idx_kararlar_sonuc    ON kararlar(sonuc);
CREATE INDEX IF NOT EXISTS idx_kararlar_daire    ON kararlar(daire);
CREATE INDEX IF NOT EXISTS idx_kararlar_tarih    ON kararlar(karar_tarihi);
CREATE INDEX IF NOT EXISTS idx_kararlar_kelime   ON kararlar(aranan_kelime);

-- Tam metin arama (Türkçe)
CREATE INDEX IF NOT EXISTS idx_kararlar_daire_fts
  ON kararlar USING gin(to_tsvector('simple', COALESCE(daire, '')));

-- RLS: Giriş yapmış kullanıcılar okuyabilir
ALTER TABLE kararlar      ENABLE ROW LEVEL SECURITY;
ALTER TABLE karar_metinler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read kararlar"
  ON kararlar FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read karar_metinler"
  ON karar_metinler FOR SELECT TO authenticated USING (true);
