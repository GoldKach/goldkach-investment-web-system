"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle, XCircle, User, Building2, FileText, ShieldCheck,
  Briefcase, Heart, AlertTriangle, Download, Eye, ExternalLink,
  Clock, Phone, Mail, MapPin, Calendar, CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateUserById } from "@/actions/auth";

type OBData = {
  type: "individual" | "company";
  data: Record<string, any>;
} | null;

function Field({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === null || value === undefined || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{display}</p>
    </div>
  );
}

function DocumentCard({ title, url }: { title: string; url?: string | null }) {
  if (!url) return null;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
      <FileText className="h-5 w-5 text-[#193388] dark:text-blue-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{title}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => window.open(url, "_blank")}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            const a = document.createElement("a");
            a.href = url;
            a.download = title;
            a.click();
          }}
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function OOClientOnboardingView({
  user,
  onboardingData,
}: {
  user: any;
  onboardingData: OBData;
}) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [localApproved, setLocalApproved] = useState<boolean | null>(null);

  const ob = onboardingData?.data ?? {};
  const obType = onboardingData?.type ?? "individual";
  const isCompany = obType === "company";

  const displayName =
    ob.fullName ||
    ob.companyName ||
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown Client";

  const currentlyApproved =
    localApproved !== null
      ? localApproved
      : user.isApproved === true || ob.isApproved === true;

  const statusBadge = currentlyApproved ? (
    <Badge className="gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 px-3 py-1">
      <CheckCircle className="h-3.5 w-3.5" /> Approved
    </Badge>
  ) : user.status === "DEACTIVATED" ? (
    <Badge className="gap-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0 px-3 py-1">
      <XCircle className="h-3.5 w-3.5" /> Rejected
    </Badge>
  ) : (
    <Badge className="gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0 px-3 py-1">
      <Clock className="h-3.5 w-3.5" /> Pending Review
    </Badge>
  );

  const confirmAction = async () => {
    if (!action) return;
    setProcessing(true);
    try {
      const res = await updateUserById(user.id, {
        status: action === "approve" ? "ACTIVE" : "DEACTIVATED",
        ...(action === "approve" && { isApproved: true }),
      });
      if (res?.error) throw new Error(res.error);
      setLocalApproved(action === "approve" ? true : false);
      toast.success(action === "approve" ? "Application approved." : "Application rejected.");
    } catch (e: any) {
      toast.error(e?.message || "Action failed. Please try again.");
    } finally {
      setProcessing(false);
      setAction(null);
    }
  };

  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {/* Header / Identity */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="h-20 w-20 rounded-xl border-2 border-[#193388]/20 shrink-0">
              <AvatarImage src={user.imageUrl || undefined} alt={displayName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-[#193388] text-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{displayName}</h2>
                {statusBadge}
                <Badge variant="outline" className="gap-1 capitalize">
                  {isCompany ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {isCompany ? "Company" : "Individual"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                {user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {user.phone}
                  </span>
                )}
                {ob.homeAddress && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {ob.homeAddress}
                  </span>
                )}
              </div>
              {ob.createdAt || ob.updatedAt ? (
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Submitted:{" "}
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
                    new Date(ob.createdAt ?? ob.updatedAt)
                  )}
                </p>
              ) : null}
            </div>

            {/* Approval Actions */}
            {!currentlyApproved && user.status !== "DEACTIVATED" && (
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  onClick={() => setAction("reject")}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setAction("approve")}
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        {!isCompany && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-[#193388]" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={ob.fullName} />
              <Field label="Date of Birth" value={ob.dateOfBirth} />
              <Field label="Nationality" value={ob.nationality} />
              <Field label="Country of Residence" value={ob.countryOfResidence} />
              <Field label="TIN" value={ob.tin} />
              <Field label="Home Address" value={ob.homeAddress} />
            </CardContent>
          </Card>
        )}

        {/* Company Information */}
        {isCompany && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-[#193388]" /> Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Company Name" value={ob.companyName} />
              <Field label="Registration Number" value={ob.registrationNumber} />
              <Field label="TIN" value={ob.tin} />
              <Field label="Business Type" value={ob.businessType} />
              <Field label="Incorporation Date" value={ob.incorporationDate} />
              <Field label="Company Address" value={ob.companyAddress} />
            </CardContent>
          </Card>
        )}

        {/* Employment & Financial */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-[#193388]" /> Employment & Financial Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {!isCompany && (
              <>
                <Field label="Employment Status" value={ob.employmentStatus} />
                <Field label="Occupation" value={ob.occupation} />
                <Field label="Company / Employer" value={ob.companyName} />
                <Field label="Has Own Business" value={ob.hasBusiness} />
              </>
            )}
            <Field label="Source of Income" value={ob.sourceOfIncome} />
            <Field label="Employment Income" value={ob.employmentIncome} />
            <Field label="Expected Investment" value={ob.expectedInvestment} />
            {!isCompany && <Field label="Business Ownership" value={ob.businessOwnership} />}
          </CardContent>
        </Card>

        {/* Risk Profile */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-[#193388]" /> Investment & Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary Goal" value={ob.primaryGoal} />
            <Field label="Time Horizon" value={ob.timeHorizon} />
            <Field label="Risk Tolerance" value={ob.riskTolerance} />
            <Field label="Investment Experience" value={ob.investmentExperience} />
            {ob.riskScore !== undefined && ob.riskScore !== null && (
              <Field label="Risk Score" value={ob.riskScore} />
            )}
            <Field label="Risk Profile" value={ob.riskProfile} />
            <Field label="Suggested Strategy" value={ob.suggestedStrategy} />
            {ob.advisorOverride && (
              <>
                <Field label="Advisor Override Profile" value={ob.advisorOverrideProfile} />
                <Field label="Override Reason" value={ob.advisorOverrideReason} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Next of Kin — individual only */}
        {!isCompany && user.nextOfKin && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-[#193388]" /> Next of Kin
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={user.nextOfKin.name} />
              <Field label="Relationship" value={user.nextOfKin.relationship} />
              <Field label="Phone" value={user.nextOfKin.phone} />
              <Field label="Email" value={user.nextOfKin.email} />
              <Field label="Address" value={user.nextOfKin.address} />
            </CardContent>
          </Card>
        )}

        {/* KYC & Compliance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-[#193388]" /> KYC & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Is PEP" value={ob.isPEP} />
            {ob.isPEP && (
              <>
                <Field label="Public Position" value={ob.publicPosition} />
                <Field label="Relationship to Country" value={ob.relationshipToCountry} />
                <Field label="Family Member Details" value={ob.familyMemberDetails} />
              </>
            )}
            <Field label="Sanctions / Legal Issues" value={ob.sanctionsOrLegal} />
            <Field label="Consent to Data Collection" value={ob.consentToDataCollection} />
            <Field label="Agreed to Terms" value={ob.agreeToTerms} />
            <Field label="Consent Confirmed" value={ob.consentConfirmed} />
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-[#193388]" /> Identity Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="National ID / Passport" url={ob.nationalIdUrl} />
          <DocumentCard title="Passport Photo" url={ob.passportPhotoUrl} />
          <DocumentCard title="TIN Certificate" url={ob.tinCertificateUrl} />
          <DocumentCard title="Proof of Address" url={ob.proofOfAddressUrl} />
          <DocumentCard title="Proof of Income" url={ob.proofOfIncomeUrl} />
          <DocumentCard title="Business Registration" url={ob.businessRegistrationUrl} />
          <DocumentCard title="Bank Statement" url={ob.bankStatementUrl} />
          <DocumentCard title="Certificate of Incorporation" url={ob.certificateOfIncorporationUrl} />
          <DocumentCard title="Memorandum & Articles" url={ob.memorandumAndArticlesUrl} />
          {!ob.nationalIdUrl && !ob.passportPhotoUrl && !ob.tinCertificateUrl &&
           !ob.proofOfAddressUrl && !ob.proofOfIncomeUrl && !ob.businessRegistrationUrl && (
            <p className="text-sm text-muted-foreground col-span-full py-4 text-center">
              No documents uploaded
            </p>
          )}
        </CardContent>
      </Card>

      {/* Signed Agreement */}
      {ob.signedAgreementUrl && (
        <Card className="mt-6 border-2 border-[#193388]/30 bg-[#dce6f1]/20 dark:bg-[#193388]/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-[#193388] dark:text-blue-300">
              <FileText className="h-4 w-4" /> Signed Investment Management Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden bg-white dark:bg-slate-900 mb-3">
              <iframe
                src={ob.signedAgreementUrl}
                className="w-full h-[480px]"
                title="Signed Investment Management Agreement"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 border-[#193388] text-[#193388] hover:bg-[#193388]/10"
                onClick={() => window.open(ob.signedAgreementUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" /> Open in New Tab
              </Button>
              <Button
                className="gap-2 bg-[#193388] hover:bg-[#142a80] text-white"
                onClick={() => window.open(ob.signedAgreementUrl, "_blank")}
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval confirmation dialog */}
      <AlertDialog open={action !== null} onOpenChange={() => setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "approve" ? "Approve Application" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "approve"
                ? `Approve ${displayName}'s onboarding application and activate their account?`
                : `Reject ${displayName}'s onboarding application? You can change this later if needed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={processing}
              className={
                action === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {processing
                ? "Processing…"
                : action === "approve"
                ? "Yes, Approve"
                : "Yes, Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
