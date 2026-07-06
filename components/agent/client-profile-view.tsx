"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, FileText, Download, Pencil, Loader2, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { AssignedClient } from "@/actions/staff";
import { updateIndividualOnboarding, updateCompanyOnboarding } from "@/actions/onboarding-admin";
import { RiskQuestionnaireForm } from "@/components/onboarding/risk-questionnaire-form";
import {
  RISK_QUESTIONS,
  computeRiskProfile,
  isQuestionnaireComplete,
  deriveInvestmentProfileFields,
  type RiskAnswers,
} from "@/lib/risk-questionnaire";
import { generateRiskQuestionnairePdf } from "@/lib/generate-risk-questionnaire-pdf";

const RISK_PROFILES = [
  "Conservative (Income)",
  "Balanced (Income and Growth)",
  "Growth",
];

interface ClientProfileViewProps {
  client: AssignedClient;
  individualOnboarding: any | null;
  companyOnboarding: any | null;
  advisorName?: string;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 dark:text-slate-200">{value || "—"}</p>
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2B2F77]/20 pb-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function profileBadgeColor(profile?: string | null) {
  if (!profile) return "border-slate-300 text-slate-500";
  if (profile.includes("Conservative")) return "border-blue-300 text-blue-700 dark:text-blue-400";
  if (profile.includes("Balanced")) return "border-amber-300 text-amber-700 dark:text-amber-400";
  if (profile.includes("Growth")) return "border-green-300 text-green-700 dark:text-green-400";
  return "border-slate-300 text-slate-500";
}

export function ClientProfileView({
  client,
  individualOnboarding,
  companyOnboarding,
  advisorName = "",
}: ClientProfileViewProps) {
  const displayName = `${client.firstName} ${client.lastName}`;

  const onboarding = individualOnboarding ?? companyOnboarding;
  const onboardingType: "individual" | "company" | null = individualOnboarding
    ? "individual"
    : companyOnboarding
    ? "company"
    : null;

  const existingAnswers: RiskAnswers =
    (onboarding?.riskQuestionnaire as RiskAnswers | null) ?? {};

  // ── Edit dialog state ──────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [editAnswers, setEditAnswers] = useState<RiskAnswers>(existingAnswers);
  // "no_change" = advisor accepts computed profile
  // "change"    = advisor overrides with a different profile
  const [overrideMode, setOverrideMode] = useState<"no_change" | "change">(
    onboarding?.advisorOverride === true ? "change" : "no_change"
  );
  const [overrideProfile, setOverrideProfile] = useState<string>(
    onboarding?.advisorOverrideProfile ?? RISK_PROFILES[0]
  );
  const [overrideReason, setOverrideReason] = useState<string>(
    onboarding?.advisorOverrideReason ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const editResult = isQuestionnaireComplete(editAnswers)
    ? computeRiskProfile(editAnswers)
    : null;

  const savedProfile: string | null = onboarding?.riskProfile ?? null;
  const savedStrategy: string | null = onboarding?.suggestedStrategy ?? null;
  const savedAdvisorOverride: boolean | null = onboarding?.advisorOverride ?? null;
  const savedAdvisorOverrideProfile: string | null = onboarding?.advisorOverrideProfile ?? null;
  const savedAdvisorOverrideReason: string | null = onboarding?.advisorOverrideReason ?? null;
  const consentConfirmed: boolean = onboarding?.consentConfirmed ?? false;
  const hasQuestionnaire = isQuestionnaireComplete(existingAnswers);

  function openEditDialog() {
    setEditAnswers(existingAnswers);
    setOverrideMode(onboarding?.advisorOverride === true ? "change" : "no_change");
    setOverrideProfile(onboarding?.advisorOverrideProfile ?? RISK_PROFILES[0]);
    setOverrideReason(onboarding?.advisorOverrideReason ?? "");
    setEditOpen(true);
  }

  async function handleSaveAnswers() {
    if (!onboarding?.id) return;
    if (!isQuestionnaireComplete(editAnswers)) {
      toast.error("Please answer all 10 questions before saving.");
      return;
    }
    if (overrideMode === "change" && !overrideReason.trim()) {
      toast.error("Please provide a reason for the profile change.");
      return;
    }

    setSaving(true);
    try {
      const { score, profile, strategy } = computeRiskProfile(editAnswers);
      const derived = deriveInvestmentProfileFields(editAnswers);

      const effectiveProfile = overrideMode === "change" ? overrideProfile : profile;
      const effectiveStrategy =
        overrideMode === "change"
          ? overrideProfile.includes("Conservative")
            ? "70% Income ETFs / 30% Growth ETFs"
            : overrideProfile.includes("Balanced")
            ? "50% Income ETFs / 50% Growth ETFs"
            : "100% Growth ETFs"
          : strategy;

      const payload = {
        riskQuestionnaire: editAnswers,
        riskScore: score,
        riskProfile: effectiveProfile,
        suggestedStrategy: effectiveStrategy,
        advisorOverride: overrideMode === "change",
        advisorOverrideProfile: overrideMode === "change" ? overrideProfile : null,
        advisorOverrideReason: overrideMode === "change" ? overrideReason.trim() : null,
        ...derived,
      };

      const res =
        onboardingType === "individual"
          ? await updateIndividualOnboarding(onboarding.id, payload)
          : await updateCompanyOnboarding(onboarding.id, payload);

      if (!res.success) {
        toast.error(res.error ?? "Failed to save questionnaire.");
      } else {
        toast.success("Questionnaire updated successfully.");
        setEditOpen(false);
        window.location.reload();
      }
    } catch {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadPdf() {
    if (!hasQuestionnaire) return;
    setPdfLoading(true);
    try {
      await generateRiskQuestionnairePdf({
        clientName: displayName,
        accountNumber: client.masterWallet?.accountNumber ?? null,
        advisorName,
        answers: existingAnswers,
        riskProfile: savedProfile,
        suggestedStrategy: savedStrategy,
        advisorOverride: savedAdvisorOverride,
        advisorOverrideProfile: savedAdvisorOverrideProfile,
        advisorOverrideReason: savedAdvisorOverrideReason,
        consentConfirmed,
      });
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="First Name" value={client.firstName} />
          <Field label="Last Name" value={client.lastName} />
          <Field label="Email" value={client.email} />
          <Field label="Phone" value={client.phone} />
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Status</p>
            <Badge
              variant="outline"
              className={`text-xs ${
                client.status === "ACTIVE"
                  ? "border-green-300 text-green-700 dark:text-green-400"
                  : "border-slate-300 text-slate-500"
              }`}
            >
              {client.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Approved</p>
            <div className="flex items-center gap-1.5">
              {client.isApproved ? (
                <><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm text-green-600">Yes</span></>
              ) : (
                <><XCircle className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-500">No</span></>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Master Wallet */}
      {client.masterWallet && (
        <Section title="Master Wallet">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Account Number" value={client.masterWallet.accountNumber} />
            <Field
              label="Total Portfolio Value"
              value={
                client.masterWallet.netAssetValue != null
                  ? `$${Number(client.masterWallet.netAssetValue).toLocaleString()}`
                  : undefined
              }
            />
            <Field label="Status" value={client.masterWallet.status} />
          </div>
        </Section>
      )}

      {/* Individual Onboarding */}
      {individualOnboarding && (
        <Section title="Individual Onboarding">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Nationality" value={individualOnboarding.nationality} />
            <Field label="Date of Birth" value={individualOnboarding.dateOfBirth} />
            <Field label="TIN" value={individualOnboarding.tin} />
            <Field
              label="Residential Address"
              value={
                individualOnboarding.residentialAddress
                  ? typeof individualOnboarding.residentialAddress === "string"
                    ? individualOnboarding.residentialAddress
                    : [
                        individualOnboarding.residentialAddress.street,
                        individualOnboarding.residentialAddress.city,
                        individualOnboarding.residentialAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                  : null
              }
            />
            <Field label="Investment Objectives" value={individualOnboarding.investmentObjectives} />
          </div>
        </Section>
      )}

      {/* Company Onboarding */}
      {companyOnboarding && (
        <Section title="Company Onboarding">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Company Name" value={companyOnboarding.companyName} />
            <Field label="Registration Number" value={companyOnboarding.registrationNumber} />
            <Field label="TIN" value={companyOnboarding.tin} />
            <Field
              label="Registered Address"
              value={
                companyOnboarding.registeredAddress
                  ? typeof companyOnboarding.registeredAddress === "string"
                    ? companyOnboarding.registeredAddress
                    : [
                        companyOnboarding.registeredAddress.street,
                        companyOnboarding.registeredAddress.city,
                        companyOnboarding.registeredAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                  : null
              }
            />
          </div>

          {Array.isArray(companyOnboarding.directors) && companyOnboarding.directors.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Directors</p>
              <div className="space-y-2">
                {companyOnboarding.directors.map((d: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#2B2F77]/10 rounded-lg px-3 py-2"
                  >
                    <span className="font-medium">{d.name || `${d.firstName} ${d.lastName}`}</span>
                    {d.role && <span className="text-slate-400">· {d.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Risk Questionnaire */}
      {onboarding && (
        <Section
          title="Investor Risk Questionnaire"
          action={
            <div className="flex items-center gap-2">
              {hasQuestionnaire && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1.5"
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading}
                >
                  {pdfLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  Download PDF
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5"
                onClick={openEditDialog}
              >
                <Pencil className="h-3 w-3" />
                {hasQuestionnaire ? "Edit Answers" : "Fill Questionnaire"}
              </Button>
            </div>
          }
        >
          {hasQuestionnaire ? (
            <div className="space-y-4">
              {/* Profile summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 dark:bg-[#2B2F77]/10 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                    Risk Profile
                  </p>
                  <Badge variant="outline" className={`text-xs ${profileBadgeColor(savedProfile)}`}>
                    {savedProfile ?? "—"}
                  </Badge>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-[#2B2F77]/10 px-4 py-3 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">
                    Suggested Strategy
                  </p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {savedStrategy ?? "—"}
                  </p>
                </div>
              </div>

              {/* Advisor override badge */}
              {savedAdvisorOverride === true && (
                <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 px-4 py-3">
                  <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-amber-700 dark:text-amber-400">Advisor Override Applied</p>
                    <p className="text-amber-600 dark:text-amber-500">
                      Profile changed to <strong>{savedAdvisorOverrideProfile}</strong>
                    </p>
                    {savedAdvisorOverrideReason && (
                      <p className="text-amber-600 dark:text-amber-500">Reason: {savedAdvisorOverrideReason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Selected answers */}
              <div className="space-y-2">
                {RISK_QUESTIONS.map((q, idx) => {
                  const selectedScore = existingAnswers[q.id];
                  const selectedOption = q.options.find((o) => o.score === selectedScore);
                  return (
                    <div key={q.id} className="flex gap-3 text-sm">
                      <span className="text-slate-400 dark:text-slate-500 min-w-[20px] text-right font-mono text-xs pt-0.5">
                        {idx + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#193388]/60 dark:text-blue-400/60">
                          {q.title}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          {selectedOption?.label ?? <span className="text-slate-400">Not answered</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-4 text-slate-400">
              <FileText className="h-5 w-5" />
              <p className="text-sm">
                Risk questionnaire not yet completed. Click <strong>Fill Questionnaire</strong> to add answers for this client.
              </p>
            </div>
          )}
        </Section>
      )}

      {/* Edit Questionnaire Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-slate-200 dark:border-[#2B2F77]/30">
            <DialogTitle>Edit Investor Risk Questionnaire</DialogTitle>
            <DialogDescription>
              Update the client&apos;s risk questionnaire answers after advising them on investment.
              {editResult && (
                <span className="block mt-1 font-medium text-slate-700 dark:text-slate-300">
                  Computed score: <span className="text-[#193388] dark:text-blue-400">{editResult.score}/50</span> —{" "}
                  <Badge variant="outline" className={`text-xs ${profileBadgeColor(editResult.profile)}`}>
                    {editResult.profile}
                  </Badge>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
            <RiskQuestionnaireForm
              answers={editAnswers}
              onAnswerChange={(qId, score) =>
                setEditAnswers((prev) => ({ ...prev, [qId]: score }))
              }
              idPrefix="agent-edit"
            />

            {/* ── Advisor Override Section ── */}
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#193388] dark:text-blue-400" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Advisor Override</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                If you believe a different risk profile is more suitable than the computed one, select &ldquo;Change applied&rdquo; and provide a reason. This will be recorded on the official questionnaire PDF.
              </p>

              {/* Radio options */}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className={`flex items-center gap-2.5 cursor-pointer rounded-lg border px-4 py-3 flex-1 transition-colors ${
                  overrideMode === "no_change"
                    ? "border-[#193388] bg-[#193388]/5 dark:bg-[#193388]/10"
                    : "border-slate-200 dark:border-[#2B2F77]/30 hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="overrideMode"
                    value="no_change"
                    checked={overrideMode === "no_change"}
                    onChange={() => setOverrideMode("no_change")}
                    className="accent-[#193388]"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No change</p>
                    <p className="text-xs text-slate-500">Use the computed profile from the answers</p>
                  </div>
                </label>

                <label className={`flex items-center gap-2.5 cursor-pointer rounded-lg border px-4 py-3 flex-1 transition-colors ${
                  overrideMode === "change"
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    : "border-slate-200 dark:border-[#2B2F77]/30 hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="overrideMode"
                    value="change"
                    checked={overrideMode === "change"}
                    onChange={() => setOverrideMode("change")}
                    className="accent-amber-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Change applied</p>
                    <p className="text-xs text-slate-500">Override with a different risk profile</p>
                  </div>
                </label>
              </div>

              {/* Override fields — shown only when "change" */}
              {overrideMode === "change" && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Adjusted Risk Profile <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={overrideProfile}
                      onChange={(e) => setOverrideProfile(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#1a1f4e] text-sm text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#193388]/40"
                    >
                      {RISK_PROFILES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Reason for the change <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Explain why a different profile is more appropriate for this client..."
                      className="text-sm min-h-[80px] resize-none"
                    />
                    {overrideReason.trim().length === 0 && (
                      <p className="text-xs text-red-500">A reason is required when overriding the profile.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-200 dark:border-[#2B2F77]/30">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAnswers}
              disabled={
                saving ||
                !isQuestionnaireComplete(editAnswers) ||
                (overrideMode === "change" && !overrideReason.trim())
              }
              className="bg-[#193388] hover:bg-[#142a6e] text-white"
            >
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Answers"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
