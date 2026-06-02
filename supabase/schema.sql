-- SkillBridge: Döküman & Test Tabloları
-- Supabase SQL Editor'de çalıştırın

-- ─── Documents ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS documents (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL DEFAULT '',
  category    TEXT,
  source      TEXT        NOT NULL DEFAULT 'upload' CHECK (source IN ('upload','ai')),
  status      TEXT        NOT NULL DEFAULT 'aktif'  CHECK (status  IN ('aktif','taslak')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi dokümanlarını görür"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi dokümanını ekler"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi dokümanını günceller"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi dokümanını siler"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Tests ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tests (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id  UUID        REFERENCES documents(id)  ON DELETE SET NULL,
  title        TEXT        NOT NULL,
  description  TEXT,
  status       TEXT        NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif','taslak','arsiv')),
  soru_sayisi  INT         NOT NULL DEFAULT 0,
  sure_dakika  INT         NOT NULL DEFAULT 30,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi testlerini görür"
  ON tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi testini ekler"
  ON tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi testini günceller"
  ON tests FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── Questions ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id      UUID    NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  sira         INT     NOT NULL DEFAULT 1,
  soru         TEXT    NOT NULL,
  secenekler   JSONB   NOT NULL,
  -- [{"label":"A","text":"..."},{"label":"B","text":"..."},{"label":"C","text":"..."},{"label":"D","text":"..."}]
  dogru_cevap  TEXT    NOT NULL CHECK (dogru_cevap IN ('A','B','C','D')),
  aciklama     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Test sahibi soruları görür"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tests t
      WHERE t.id = questions.test_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Test sahibi soru ekler"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tests t
      WHERE t.id = questions.test_id AND t.user_id = auth.uid()
    )
  );

-- ─── Test Attempts ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS test_attempts (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id         UUID        NOT NULL REFERENCES tests(id)       ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id)  ON DELETE CASCADE,
  cevaplar        JSONB       NOT NULL DEFAULT '{}',
  -- {"<question_id>": "A", ...}
  score           NUMERIC(5,2),
  dogru_sayisi    INT         NOT NULL DEFAULT 0,
  yanlis_sayisi   INT         NOT NULL DEFAULT 0,
  bos_sayisi      INT         NOT NULL DEFAULT 0,
  sure_saniye     INT,
  tamamlandi_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi denemelerini görür"
  ON test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcı kendi denemesini ekler"
  ON test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
