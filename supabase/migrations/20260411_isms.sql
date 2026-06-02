-- ─────────────────────────────────────────────────────────────────────────────
-- ISO 27001:2022 BGYS (Information Security Management System) Schema
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Helper: updated_at trigger ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CONTROL STATUS
--    Tracks implementation status for each of the 93 Annex A controls
--    + Clauses 4-10 sub-requirements per organization/user
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE isms_control_status (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  control_id        TEXT        NOT NULL,                          -- e.g. 'A.5.1', 'A.8.15'
  annex             TEXT        NOT NULL,                          -- 'A5','A6','A7','A8','clause'
  status            TEXT        NOT NULL DEFAULT 'not_implemented'
                                CHECK (status IN (
                                  'implemented','partial','not_implemented','not_applicable'
                                )),
  owner             TEXT,
  notes             TEXT,
  evidence_note     TEXT,
  last_reviewed_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, control_id)
);

CREATE TRIGGER trg_isms_control_status_updated_at
  BEFORE UPDATE ON isms_control_status
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE isms_control_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_control_status" ON isms_control_status
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RISK REGISTRY
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE isms_risks (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT        NOT NULL,
  description       TEXT,
  asset             TEXT,
  threat            TEXT,
  vulnerability     TEXT,
  likelihood        INTEGER     NOT NULL DEFAULT 3
                                CHECK (likelihood BETWEEN 1 AND 5),
  impact            INTEGER     NOT NULL DEFAULT 3
                                CHECK (impact BETWEEN 1 AND 5),
  risk_score        INTEGER     GENERATED ALWAYS AS (likelihood * impact) STORED,
  risk_level        TEXT        GENERATED ALWAYS AS (
                                  CASE
                                    WHEN likelihood * impact >= 15 THEN 'critical'
                                    WHEN likelihood * impact >= 10 THEN 'high'
                                    WHEN likelihood * impact >= 5  THEN 'medium'
                                    ELSE 'low'
                                  END
                                ) STORED,
  treatment         TEXT        DEFAULT 'mitigate'
                                CHECK (treatment IN ('accept','mitigate','transfer','avoid')),
  treatment_plan    TEXT,
  owner             TEXT,
  status            TEXT        NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open','in_treatment','closed')),
  target_date       DATE,
  related_controls  TEXT[]      DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_isms_risks_updated_at
  BEFORE UPDATE ON isms_risks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE isms_risks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_risks" ON isms_risks
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_isms_risks_user   ON isms_risks(user_id);
CREATE INDEX idx_isms_risks_level  ON isms_risks(risk_level);
CREATE INDEX idx_isms_risks_status ON isms_risks(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DOCUMENTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE isms_documents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_code      TEXT        NOT NULL,   -- '00','01',…,'98'
  folder_name      TEXT        NOT NULL,   -- display label
  subfolder        TEXT,
  name             TEXT        NOT NULL,
  file_path        TEXT,                   -- Supabase Storage object path
  file_size        BIGINT,
  mime_type        TEXT,
  version          TEXT        NOT NULL DEFAULT '1.0',
  doc_status       TEXT        NOT NULL DEFAULT 'draft'
                               CHECK (doc_status IN ('draft','review','approved','obsolete')),
  owner            TEXT,
  related_controls TEXT[]      DEFAULT '{}',
  tags             TEXT[]      DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_isms_documents_updated_at
  BEFORE UPDATE ON isms_documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE isms_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_documents" ON isms_documents
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_isms_documents_user   ON isms_documents(user_id);
CREATE INDEX idx_isms_documents_folder ON isms_documents(folder_code);

-- Supabase Storage bucket (run via dashboard or CLI):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('isms-documents', 'isms-documents', false);
-- CREATE POLICY "users_own_files" ON storage.objects
--   FOR ALL USING (auth.uid()::text = (storage.foldername(name))[1]);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. AUDITS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE isms_audits (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  audit_type    TEXT        NOT NULL DEFAULT 'internal'
                            CHECK (audit_type IN (
                              'internal','external','surveillance','recertification'
                            )),
  scope         TEXT,
  auditor       TEXT,
  planned_date  DATE,
  actual_date   DATE,
  status        TEXT        NOT NULL DEFAULT 'planned'
                            CHECK (status IN (
                              'planned','in_progress','completed','cancelled'
                            )),
  summary       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_isms_audits_updated_at
  BEFORE UPDATE ON isms_audits
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE isms_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_audits" ON isms_audits
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_isms_audits_user   ON isms_audits(user_id);
CREATE INDEX idx_isms_audits_status ON isms_audits(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. AUDIT FINDINGS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE isms_audit_findings (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id        UUID        NOT NULL REFERENCES isms_audits(id) ON DELETE CASCADE,
  finding_type    TEXT        NOT NULL DEFAULT 'nonconformity'
                              CHECK (finding_type IN (
                                'nonconformity','observation','opportunity'
                              )),
  title           TEXT        NOT NULL,
  description     TEXT,
  related_control TEXT,
  severity        TEXT        CHECK (severity IN ('minor','major')),
  status          TEXT        NOT NULL DEFAULT 'open'
                              CHECK (status IN ('open','in_progress','closed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_isms_findings_updated_at
  BEFORE UPDATE ON isms_audit_findings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: inherit from parent audit (same user)
ALTER TABLE isms_audit_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_findings" ON isms_audit_findings
  USING (
    EXISTS (
      SELECT 1 FROM isms_audits a
      WHERE a.id = isms_audit_findings.audit_id
        AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM isms_audits a
      WHERE a.id = isms_audit_findings.audit_id
        AND a.user_id = auth.uid()
    )
  );

CREATE INDEX idx_isms_findings_audit  ON isms_audit_findings(audit_id);
CREATE INDEX idx_isms_findings_status ON isms_audit_findings(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CORRECTIVE ACTIONS (DÜZELTİCİ FAALİYETLER)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE isms_corrective_actions (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  finding_id           UUID        REFERENCES isms_audit_findings(id) ON DELETE SET NULL,
  risk_id              UUID        REFERENCES isms_risks(id) ON DELETE SET NULL,
  title                TEXT        NOT NULL,
  description          TEXT,
  root_cause           TEXT,
  action_taken         TEXT,
  owner                TEXT,
  target_date          DATE,
  completion_date      DATE,
  status               TEXT        NOT NULL DEFAULT 'open'
                                   CHECK (status IN (
                                     'open','in_progress','completed','verified'
                                   )),
  effectiveness_review TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_isms_cars_updated_at
  BEFORE UPDATE ON isms_corrective_actions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE isms_corrective_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_cars" ON isms_corrective_actions
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_isms_cars_user   ON isms_corrective_actions(user_id);
CREATE INDEX idx_isms_cars_status ON isms_corrective_actions(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. DASHBOARD STATS VIEW
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW isms_dashboard_stats AS
SELECT
  u.id AS user_id,

  -- Control compliance
  COUNT(DISTINCT cs.id)                                                        AS total_controls_tracked,
  COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'implemented')               AS controls_implemented,
  COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'partial')                   AS controls_partial,
  COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'not_implemented')           AS controls_not_implemented,
  ROUND(
    COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'implemented')::NUMERIC
    / NULLIF(COUNT(DISTINCT cs.id) FILTER (WHERE cs.status != 'not_applicable'), 0) * 100
  , 1)                                                                          AS compliance_pct,

  -- Risks
  COUNT(DISTINCT r.id)                                                          AS total_risks,
  COUNT(DISTINCT r.id) FILTER (WHERE r.risk_level = 'critical')                AS critical_risks,
  COUNT(DISTINCT r.id) FILTER (WHERE r.risk_level = 'high')                    AS high_risks,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'open')                        AS open_risks,

  -- Documents
  COUNT(DISTINCT d.id)                                                          AS total_documents,
  COUNT(DISTINCT d.id) FILTER (WHERE d.doc_status = 'approved')                AS approved_docs,
  COUNT(DISTINCT d.id) FILTER (WHERE d.doc_status = 'draft')                   AS draft_docs,

  -- Audits
  COUNT(DISTINCT a.id)                                                          AS total_audits,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed')                   AS completed_audits,
  COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'open')                        AS open_findings,

  -- CARs
  COUNT(DISTINCT ca.id) FILTER (WHERE ca.status IN ('open','in_progress'))     AS open_cars

FROM auth.users u
LEFT JOIN isms_control_status     cs ON cs.user_id = u.id
LEFT JOIN isms_risks               r  ON r.user_id  = u.id
LEFT JOIN isms_documents           d  ON d.user_id  = u.id
LEFT JOIN isms_audits              a  ON a.user_id  = u.id
LEFT JOIN isms_audit_findings      f  ON f.audit_id = a.id
LEFT JOIN isms_corrective_actions  ca ON ca.user_id = u.id
GROUP BY u.id;
