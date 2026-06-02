// ─────────────────────────────────────────────────────────────────────────────
// ISO 27001:2022 BGYS — TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

// ─── Control Status ───────────────────────────────────────────────────────────

export type ControlStatusValue =
  | "implemented"
  | "partial"
  | "not_implemented"
  | "not_applicable";

export type ControlAnnex = "A5" | "A6" | "A7" | "A8" | "clause";

export interface IsmsControlStatus {
  id: string;
  user_id: string;
  control_id: string;
  annex: ControlAnnex;
  status: ControlStatusValue;
  owner: string | null;
  notes: string | null;
  evidence_note: string | null;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type UpsertControlStatus = Pick<
  IsmsControlStatus,
  "control_id" | "annex" | "status" | "owner" | "notes" | "evidence_note"
>;

// ─── Risk Registry ────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RiskTreatment = "accept" | "mitigate" | "transfer" | "avoid";
export type RiskStatus = "open" | "in_treatment" | "closed";

export interface IsmsRisk {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  asset: string | null;
  threat: string | null;
  vulnerability: string | null;
  likelihood: number;   // 1–5
  impact: number;       // 1–5
  risk_score: number;   // generated: likelihood × impact
  risk_level: RiskLevel; // generated
  treatment: RiskTreatment;
  treatment_plan: string | null;
  owner: string | null;
  status: RiskStatus;
  target_date: string | null;
  related_controls: string[];
  created_at: string;
  updated_at: string;
}

export type CreateRisk = Omit<
  IsmsRisk,
  "id" | "user_id" | "risk_score" | "risk_level" | "created_at" | "updated_at"
>;

export type UpdateRisk = Partial<CreateRisk>;

// ─── Documents ────────────────────────────────────────────────────────────────

export type DocStatus = "draft" | "review" | "approved" | "obsolete";

export interface IsmsDocument {
  id: string;
  user_id: string;
  folder_code: string;
  folder_name: string;
  subfolder: string | null;
  name: string;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  version: string;
  doc_status: DocStatus;
  owner: string | null;
  related_controls: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type CreateDocument = Omit<
  IsmsDocument,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateDocument = Partial<CreateDocument>;

// ─── Audits ───────────────────────────────────────────────────────────────────

export type AuditType =
  | "internal"
  | "external"
  | "surveillance"
  | "recertification";

export type AuditStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IsmsAudit {
  id: string;
  user_id: string;
  title: string;
  audit_type: AuditType;
  scope: string | null;
  auditor: string | null;
  planned_date: string | null;
  actual_date: string | null;
  status: AuditStatus;
  summary: string | null;
  created_at: string;
  updated_at: string;
  // joined
  findings?: IsmsAuditFinding[];
}

export type CreateAudit = Omit<
  IsmsAudit,
  "id" | "user_id" | "created_at" | "updated_at" | "findings"
>;

export type UpdateAudit = Partial<CreateAudit>;

// ─── Audit Findings ───────────────────────────────────────────────────────────

export type FindingType = "nonconformity" | "observation" | "opportunity";
export type FindingSeverity = "minor" | "major";
export type FindingStatus = "open" | "in_progress" | "closed";

export interface IsmsAuditFinding {
  id: string;
  audit_id: string;
  finding_type: FindingType;
  title: string;
  description: string | null;
  related_control: string | null;
  severity: FindingSeverity | null;
  status: FindingStatus;
  created_at: string;
  updated_at: string;
}

export type CreateFinding = Omit<
  IsmsAuditFinding,
  "id" | "created_at" | "updated_at"
>;

export type UpdateFinding = Partial<Omit<CreateFinding, "audit_id">>;

// ─── Corrective Actions ───────────────────────────────────────────────────────

export type CarStatus = "open" | "in_progress" | "completed" | "verified";

export interface IsmsCorrectiveAction {
  id: string;
  user_id: string;
  finding_id: string | null;
  risk_id: string | null;
  title: string;
  description: string | null;
  root_cause: string | null;
  action_taken: string | null;
  owner: string | null;
  target_date: string | null;
  completion_date: string | null;
  status: CarStatus;
  effectiveness_review: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateCar = Omit<
  IsmsCorrectiveAction,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateCar = Partial<CreateCar>;

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface IsmsDashboardStats {
  user_id: string;
  // Controls
  total_controls_tracked: number;
  controls_implemented: number;
  controls_partial: number;
  controls_not_implemented: number;
  compliance_pct: number | null;
  // Risks
  total_risks: number;
  critical_risks: number;
  high_risks: number;
  open_risks: number;
  // Documents
  total_documents: number;
  approved_docs: number;
  draft_docs: number;
  // Audits
  total_audits: number;
  completed_audits: number;
  open_findings: number;
  // CARs
  open_cars: number;
}

// ─── Server Action Result ─────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
