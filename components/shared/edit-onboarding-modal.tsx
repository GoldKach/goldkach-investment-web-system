"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ClipboardEdit, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { updateIndividualOnboarding, updateCompanyOnboarding } from "@/actions/onboarding-admin";

type OBData = {
  type: "individual" | "company";
  data: Record<string, any>;
} | null;

interface EditOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onboardingData: OBData;
  displayName: string;
  onSuccess?: () => void;
}

function DocUploadRow({
  label, url, onUploaded,
}: {
  label: string; url: string; onUploaded: (url: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground mb-0.5">{label}</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 truncate"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{url.split("/").pop()}</span>
          </a>
        ) : (
          <p className="text-xs text-muted-foreground">No document uploaded</p>
        )}
      </div>
      <UploadButton
        endpoint="documentUploader"
        onClientUploadComplete={(res) => { if (res?.[0]?.url) onUploaded(res[0].url); }}
        onUploadError={(err) => console.error(err)}
        appearance={{
          button: "h-7 px-3 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 ut-uploading:opacity-60",
          allowedContent: "hidden",
        }}
        content={{ button: url ? "Replace" : "Upload" }}
      />
    </div>
  );
}

const INPUT_CLS = "bg-muted/50 border-border dark:bg-[#161b4a]/60 dark:border-[#2B2F77]/50 dark:text-white dark:placeholder:text-slate-500";

export function EditOnboardingModal({
  open,
  onOpenChange,
  onboardingData,
  displayName,
  onSuccess,
}: EditOnboardingModalProps) {
  const ob = onboardingData?.data ?? {};
  const obType = onboardingData?.type ?? "individual";
  const isCompany = obType === "company";
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<Record<string, any>>(() => ({
    fullName:                     ob.fullName                     ?? "",
    dateOfBirth:                  ob.dateOfBirth ? ob.dateOfBirth.split("T")[0] : "",
    tin:                          ob.tin                          ?? "",
    homeAddress:                  ob.homeAddress                  ?? "",
    nationality:                  ob.nationality                  ?? "",
    countryOfResidence:           ob.countryOfResidence           ?? "",
    employmentStatus:             ob.employmentStatus             ?? "",
    occupation:                   ob.occupation                   ?? "",
    companyName:                  ob.companyName                  ?? "",
    primaryGoal:                  ob.primaryGoal                  ?? "",
    timeHorizon:                  ob.timeHorizon                  ?? "",
    riskTolerance:                ob.riskTolerance                ?? "",
    investmentExperience:         ob.investmentExperience         ?? "",
    sourceOfIncome:               ob.sourceOfIncome ?? ob.sourceOfWealth ?? "",
    expectedInvestment:           ob.expectedInvestment           ?? "",
    // company-only text
    registrationNumber:           ob.registrationNumber           ?? "",
    companyAddress:               ob.companyAddress               ?? "",
    businessType:                 ob.businessType                 ?? "",
    incorporationDate:            ob.incorporationDate ? ob.incorporationDate.split("T")[0] : "",
    // documents — individual
    nationalIdUrl:                ob.nationalIdUrl                ?? "",
    passportPhotoUrl:             ob.passportPhotoUrl             ?? "",
    tinCertificateUrl:            ob.tinCertificateUrl            ?? "",
    bankStatementUrl:             ob.bankStatementUrl             ?? "",
    proofOfAddressUrl:            ob.proofOfAddressUrl            ?? "",
    signatureUrl:                 ob.signatureUrl                 ?? "",
    additionalDocumentUrl:        ob.additionalDocumentUrl        ?? "",
    // documents — company
    certificateOfIncorporationUrl: ob.certificateOfIncorporationUrl ?? "",
    memorandumUrl:                ob.memorandumUrl                ?? "",
    articlesUrl:                  ob.articlesUrl                  ?? "",
    logoDocUrl:                   ob.logoDocUrl                   ?? "",
    constitutionUrl:              ob.constitutionUrl              ?? "",
    tradingLicenseUrl:            ob.tradingLicenseUrl            ?? "",
  }));

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!ob.id) {
      toast.error("No onboarding record found to update.");
      return;
    }
    startTransition(async () => {
      try {
        const raw = { ...form };

        let patch: Record<string, any>;
        if (isCompany) {
          const {
            fullName, dateOfBirth, nationality, countryOfResidence,
            homeAddress, employmentStatus, occupation,
            nationalIdUrl, passportPhotoUrl,
            ...companyFields
          } = raw;
          patch = companyFields;
        } else {
          const {
            registrationNumber, companyAddress, businessType, incorporationDate,
            certificateOfIncorporationUrl, memorandumUrl, articlesUrl,
            logoDocUrl, constitutionUrl, tradingLicenseUrl,
            ...individualFields
          } = raw;
          patch = individualFields;
        }

        // Strip blank strings and nulls — only send fields with actual values
        Object.keys(patch).forEach((k) => {
          if (patch[k] === "" || patch[k] === null || patch[k] === undefined) {
            delete patch[k];
          }
        });

        const result = isCompany
          ? await updateCompanyOnboarding(ob.id, patch)
          : await updateIndividualOnboarding(ob.id, patch);

        if (!result.success) {
          toast.error((result as any).error ?? "Failed to update onboarding.");
          return;
        }
        toast.success("Onboarding information updated successfully.");
        onOpenChange(false);
        onSuccess?.();
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to update onboarding information.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-[#0f1135] dark:border-[#2B2F77]/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardEdit className="h-5 w-5 text-primary" />
            Edit Onboarding Information
          </DialogTitle>
          <DialogDescription>
            Update {displayName}&apos;s onboarding details. Changes are saved immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">

          {/* Personal / Company identity */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {isCompany ? "Company Identity" : "Personal Information"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {isCompany ? (
                <>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Company Name</Label>
                    <Input value={form.companyName ?? ""} onChange={e => set("companyName", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Registration Number</Label>
                    <Input value={form.registrationNumber ?? ""} onChange={e => set("registrationNumber", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>TIN</Label>
                    <Input value={form.tin ?? ""} onChange={e => set("tin", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Business Type</Label>
                    <Input value={form.businessType ?? ""} onChange={e => set("businessType", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Incorporation Date</Label>
                    <Input type="date" value={form.incorporationDate ?? ""} onChange={e => set("incorporationDate", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Company Address</Label>
                    <Input value={form.companyAddress ?? ""} onChange={e => set("companyAddress", e.target.value)} className={INPUT_CLS} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input value={form.fullName ?? ""} onChange={e => set("fullName", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={form.dateOfBirth ?? ""} onChange={e => set("dateOfBirth", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>TIN</Label>
                    <Input value={form.tin ?? ""} onChange={e => set("tin", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nationality</Label>
                    <Input value={form.nationality ?? ""} onChange={e => set("nationality", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Country of Residence</Label>
                    <Input value={form.countryOfResidence ?? ""} onChange={e => set("countryOfResidence", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Home Address</Label>
                    <Input value={form.homeAddress ?? ""} onChange={e => set("homeAddress", e.target.value)} className={INPUT_CLS} />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Employment — individual only */}
          {!isCompany && (
            <section className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employment</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Employment Status</Label>
                  <Input value={form.employmentStatus ?? ""} onChange={e => set("employmentStatus", e.target.value)} className={INPUT_CLS} />
                </div>
                <div className="space-y-1.5">
                  <Label>Occupation</Label>
                  <Input value={form.occupation ?? ""} onChange={e => set("occupation", e.target.value)} className={INPUT_CLS} />
                </div>
                <div className="space-y-1.5">
                  <Label>Company / Employer</Label>
                  <Input value={form.companyName ?? ""} onChange={e => set("companyName", e.target.value)} className={INPUT_CLS} />
                </div>
              </div>
            </section>
          )}

          {/* Investment profile */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Investment Profile</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Primary Goal</Label>
                <Input value={form.primaryGoal ?? ""} onChange={e => set("primaryGoal", e.target.value)} className={INPUT_CLS} />
              </div>
              <div className="space-y-1.5">
                <Label>Time Horizon</Label>
                <Input value={form.timeHorizon ?? ""} onChange={e => set("timeHorizon", e.target.value)} className={INPUT_CLS} />
              </div>
              <div className="space-y-1.5">
                <Label>Risk Tolerance</Label>
                <Select value={form.riskTolerance ?? ""} onValueChange={v => set("riskTolerance", v)}>
                  <SelectTrigger className={INPUT_CLS}><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent className="bg-card border-border dark:bg-[#0f1135] dark:border-[#2B2F77]/50">
                    {["Conservative", "Moderate", "Aggressive"].map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Investment Experience</Label>
                <Input value={form.investmentExperience ?? ""} onChange={e => set("investmentExperience", e.target.value)} className={INPUT_CLS} />
              </div>
              <div className="space-y-1.5">
                <Label>Source of Income</Label>
                <Input value={form.sourceOfIncome ?? ""} onChange={e => set("sourceOfIncome", e.target.value)} className={INPUT_CLS} />
              </div>
              <div className="space-y-1.5">
                <Label>Expected Investment</Label>
                <Input value={form.expectedInvestment ?? ""} onChange={e => set("expectedInvestment", e.target.value)} className={INPUT_CLS} />
              </div>
            </div>
          </section>

          {/* Identity & shared documents */}
          <section className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Identity &amp; Financial Documents
            </p>
            <div className="grid grid-cols-1 gap-3">
              {(isCompany
                ? [
                    { field: "bankStatementUrl",   label: "Bank Statement" },
                    { field: "tinCertificateUrl",  label: "Company TIN Certificate" },
                    { field: "proofOfAddressUrl",  label: "Proof of Address" },
                    { field: "signatureUrl",        label: "Authorised Signature" },
                    { field: "additionalDocumentUrl", label: "Additional Document" },
                  ]
                : [
                    { field: "nationalIdUrl",       label: "National ID / Passport" },
                    { field: "passportPhotoUrl",    label: "Passport Photo" },
                    { field: "tinCertificateUrl",   label: "TIN Certificate" },
                    { field: "bankStatementUrl",    label: "Bank Statement" },
                    { field: "proofOfAddressUrl",   label: "Proof of Address" },
                    { field: "signatureUrl",        label: "Signature Specimen" },
                    { field: "additionalDocumentUrl", label: "Additional Document" },
                  ]
              ).map(({ field, label }) => (
                <DocUploadRow
                  key={field}
                  label={label}
                  url={form[field] ?? ""}
                  onUploaded={url => set(field, url)}
                />
              ))}
            </div>
          </section>

          {/* Company-only documents */}
          {isCompany && (
            <section className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company Documents</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { field: "certificateOfIncorporationUrl", label: "Certificate of Incorporation" },
                  { field: "memorandumUrl",                label: "Memorandum of Association" },
                  { field: "articlesUrl",                  label: "Articles of Association" },
                  { field: "constitutionUrl",              label: "Constitution" },
                  { field: "tradingLicenseUrl",            label: "Trading Licence" },
                  { field: "logoDocUrl",                   label: "Company Logo / Letterhead" },
                ].map(({ field, label }) => (
                  <DocUploadRow
                    key={field}
                    label={label}
                    url={form[field] ?? ""}
                    onUploaded={url => set(field, url)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
