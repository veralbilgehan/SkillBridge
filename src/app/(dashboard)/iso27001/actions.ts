"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type {
  ActionResult,
  UpsertControlStatus,
  CreateRisk,
  UpdateRisk,
  CreateDocument,
  UpdateDocument,
  CreateAudit,
  UpdateAudit,
  CreateFinding,
  UpdateFinding,
  CreateCar,
  UpdateCar,
  IsmsControlStatus,
  IsmsRisk,
  IsmsDocument,
  IsmsAudit,
  IsmsAuditFinding,
  IsmsCorrectiveAction,
  IsmsDashboardStats,
} from "@/lib/types/isms";

const REVALIDATE = "/iso27001";

async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Oturum bulunamadı.");
  return user.id;
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<ActionResult<IsmsDashboardStats>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_dashboard_stats")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return { ok: true, data: data as IsmsDashboardStats };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTROL STATUS
// ─────────────────────────────────────────────────────────────────────────────

export async function getControlStatuses(): Promise<ActionResult<IsmsControlStatus[]>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_control_status")
      .select("*")
      .eq("user_id", userId)
      .order("control_id");
    if (error) throw error;
    return { ok: true, data: data as IsmsControlStatus[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function upsertControlStatus(
  payload: UpsertControlStatus
): Promise<ActionResult<IsmsControlStatus>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_control_status")
      .upsert(
        { ...payload, user_id: userId, last_reviewed_at: new Date().toISOString() },
        { onConflict: "user_id,control_id" }
      )
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsControlStatus };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RISKS
// ─────────────────────────────────────────────────────────────────────────────

export async function getRisks(): Promise<ActionResult<IsmsRisk[]>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_risks")
      .select("*")
      .eq("user_id", userId)
      .order("risk_score", { ascending: false });
    if (error) throw error;
    return { ok: true, data: data as IsmsRisk[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createRisk(payload: CreateRisk): Promise<ActionResult<IsmsRisk>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_risks")
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsRisk };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateRisk(id: string, payload: UpdateRisk): Promise<ActionResult<IsmsRisk>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_risks")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsRisk };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteRisk(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("isms_risks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getDocuments(): Promise<ActionResult<IsmsDocument[]>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_documents")
      .select("*")
      .eq("user_id", userId)
      .order("folder_code")
      .order("name");
    if (error) throw error;
    return { ok: true, data: data as IsmsDocument[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createDocument(payload: CreateDocument): Promise<ActionResult<IsmsDocument>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_documents")
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsDocument };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateDocument(id: string, payload: UpdateDocument): Promise<ActionResult<IsmsDocument>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_documents")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsDocument };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteDocument(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    // Remove from storage if file_path exists
    const { data: doc } = await supabase
      .from("isms_documents")
      .select("file_path")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (doc?.file_path) {
      await supabase.storage.from("isms-documents").remove([doc.file_path]);
    }
    const { error } = await supabase
      .from("isms_documents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function uploadDocumentFile(
  docId: string,
  formData: FormData
): Promise<ActionResult<{ file_path: string; file_size: number; mime_type: string }>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const file = formData.get("file") as File;
    if (!file) throw new Error("Dosya seçilmedi.");

    const ext = file.name.split(".").pop();
    const path = `${userId}/${docId}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("isms-documents")
      .upload(path, file, { upsert: true });
    if (upErr) throw upErr;

    const { error: upDocErr } = await supabase
      .from("isms_documents")
      .update({ file_path: path, file_size: file.size, mime_type: file.type })
      .eq("id", docId)
      .eq("user_id", userId);
    if (upDocErr) throw upDocErr;

    revalidatePath(REVALIDATE);
    return { ok: true, data: { file_path: path, file_size: file.size, mime_type: file.type } };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getDocumentDownloadUrl(filePath: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("isms-documents")
      .createSignedUrl(filePath, 60 * 60); // 1 hour
    if (error) throw error;
    return { ok: true, data: data.signedUrl };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDITS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAudits(): Promise<ActionResult<IsmsAudit[]>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audits")
      .select("*, findings:isms_audit_findings(*)")
      .eq("user_id", userId)
      .order("planned_date", { ascending: false });
    if (error) throw error;
    return { ok: true, data: data as IsmsAudit[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createAudit(payload: CreateAudit): Promise<ActionResult<IsmsAudit>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audits")
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsAudit };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateAudit(id: string, payload: UpdateAudit): Promise<ActionResult<IsmsAudit>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audits")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsAudit };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteAudit(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("isms_audits")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT FINDINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function getFindings(auditId: string): Promise<ActionResult<IsmsAuditFinding[]>> {
  try {
    await getUserId(); // auth check
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audit_findings")
      .select("*")
      .eq("audit_id", auditId)
      .order("created_at");
    if (error) throw error;
    return { ok: true, data: data as IsmsAuditFinding[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getAllFindings(): Promise<ActionResult<IsmsAuditFinding[]>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audit_findings")
      .select("*, audit:isms_audits!inner(user_id, title)")
      .eq("isms_audits.user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { ok: true, data: data as IsmsAuditFinding[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createFinding(payload: CreateFinding): Promise<ActionResult<IsmsAuditFinding>> {
  try {
    await getUserId(); // auth check
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audit_findings")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsAuditFinding };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateFinding(
  id: string,
  payload: UpdateFinding
): Promise<ActionResult<IsmsAuditFinding>> {
  try {
    await getUserId(); // auth check
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_audit_findings")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsAuditFinding };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteFinding(id: string): Promise<ActionResult> {
  try {
    await getUserId(); // auth check
    const supabase = await createClient();
    const { error } = await supabase.from("isms_audit_findings").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORRECTIVE ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getCars(): Promise<ActionResult<IsmsCorrectiveAction[]>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_corrective_actions")
      .select("*")
      .eq("user_id", userId)
      .order("target_date", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return { ok: true, data: data as IsmsCorrectiveAction[] };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createCar(payload: CreateCar): Promise<ActionResult<IsmsCorrectiveAction>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_corrective_actions")
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsCorrectiveAction };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateCar(
  id: string,
  payload: UpdateCar
): Promise<ActionResult<IsmsCorrectiveAction>> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("isms_corrective_actions")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: data as IsmsCorrectiveAction };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCar(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("isms_corrective_actions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
    revalidatePath(REVALIDATE);
    return { ok: true, data: undefined };
  } catch (e: unknown) {
    return { ok: false, error: (e as Error).message };
  }
}
