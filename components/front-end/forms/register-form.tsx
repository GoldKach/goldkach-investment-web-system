


"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createUser as createUserAction } from "@/actions/auth";
import { toast } from "sonner";
import {
  Eye, EyeOff, FileText, CreditCard, UserCircle, Shield,
  FileCheck, X, Check, ChevronsUpDown, User, Building2,
  ArrowLeft, ChevronRight, Briefcase, Users,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ────────────────────────────────────────────────────────
type EntityType = "individual" | "company" | null;
type Step = "requirements" | "entity-select" | "register";

// ─── Entity Type Card ─────────────────────────────────────────────
function EntityCard({
  type,
  selected,
  onSelect,
}: {
  type: "individual" | "company";
  selected: boolean;
  onSelect: () => void;
}) {
  const isIndividual = type === "individual";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full text-left rounded-xl border-2 p-5 transition-all duration-200 group",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      )}
    >
      {/* Selected indicator */}
      {selected && (
        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Check className="h-3 w-3 text-white" />
        </span>
      )}

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
            selected ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          {isIndividual ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-base">
            {isIndividual ? "Individual" : "Company / Organisation"}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isIndividual
              ? "For personal investors managing their own portfolio and wealth."
              : "For businesses, SACCOs, NGOs, partnerships, and other corporate entities."}
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            {isIndividual
              ? ["Personal", "Retirement", "Education fund"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))
              : ["Limited Co.", "SACCO", "NGO", "Partnership", "Microfinance"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Document list per entity type ───────────────────────────────
const INDIVIDUAL_DOCS = [
  {
    icon: CreditCard,
    title: "Valid National ID or Passport",
    desc: "Both front and back sides (clear, readable copy)",
    required: true,
  },
  {
    icon: FileText,
    title: "Bank Statement",
    desc: "Last 6 months from your primary bank (optional but recommended)",
    required: false,
  },
  {
    icon: UserCircle,
    title: "Passport Photo",
    desc: "Recent passport-size photograph (white background)",
    required: false,
  },
  {
    icon: FileCheck,
    title: "TIN Certificate",
    desc: "Tax Identification Number certificate from Uganda Revenue Authority (optional)",
    required: false,
  },
];

const COMPANY_DOCS = [
  {
    icon: FileCheck,
    title: "Certificate of Incorporation / Registration",
    desc: "Official registration document from URSB or relevant authority",
    required: true,
  },
  {
    icon: FileText,
    title: "Bank Statement",
    desc: "Last 6 months of company bank statements",
    required: true,
  },
  {
    icon: CreditCard,
    title: "National ID / Passport for each Director & UBO",
    desc: "Identity documents for all directors and ultimate beneficial owners",
    required: true,
  },
  {
    icon: FileText,
    title: "Trading License",
    desc: "Current valid trading license (where applicable)",
    required: false,
  },
  {
    icon: Briefcase,
    title: "Memorandum & Articles of Association",
    desc: "Company constitution / governing documents",
    required: false,
  },
  {
    icon: Users,
    title: "SACCO Constitution",
    desc: "Required for SACCOs, savings groups, and microfinance institutions",
    required: false,
  },
  {
    icon: FileCheck,
    title: "TIN Certificate",
    desc: "Company Tax Identification Number certificate",
    required: false,
  },
  {
    icon: FileText,
    title: "Form A1, S18, Form 18, Form 20, Beneficial Ownership Form",
    desc: "Relevant statutory forms as applicable to your entity type",
    required: false,
  },
];

// ─── African countries (unchanged from original) ─────────────────
const AFRICAN_COUNTRIES = [
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+243", country: "Congo (DRC)", flag: "🇨🇩" },
  { code: "+242", country: "Congo (Republic)", flag: "🇨🇬" },
  { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
];

// ─── Step indicator ───────────────────────────────────────────────
function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ["requirements", "entity-select", "register"];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div
          key={s}
          className={cn(
            "rounded-full transition-all duration-300",
            i < idx ? "h-2 w-2 bg-primary" :
            i === idx ? "h-2 w-5 bg-primary" :
            "h-2 w-2 bg-muted"
          )}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function RegisterForm() {
  const router = useRouter();
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  // ── Step state ──
  const [step, setStep] = React.useState<Step>("requirements");
  const [entityType, setEntityType] = React.useState<EntityType>(null);

  // ── Form state ──
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    website: "", // honeypot
  });

  const [countryCode, setCountryCode] = React.useState("+256");
  const [countrySearchTerm, setCountrySearchTerm] = React.useState("");
  const [openCountrySelect, setOpenCountrySelect] = React.useState(false);
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // ── Overlay state ──
  const [acceptedDataProtection, setAcceptedDataProtection] = React.useState(false);
  const [acknowledgedDocuments, setAcknowledgedDocuments] = React.useState(false);

  // ── Dialog state ──
  const [openTos, setOpenTos] = React.useState(false);
  const [openPrivacy, setOpenPrivacy] = React.useState(false);
  const [acceptedTos, setAcceptedTos] = React.useState(true);
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState(true);
  const [tosConfirm, setTosConfirm] = React.useState(false);
  const [privacyConfirm, setPrivacyConfirm] = React.useState(false);

  const canProceedFromOverlay = acceptedDataProtection && acknowledgedDocuments;
  const canSubmit = acceptedTos && acceptedPrivacy && !loading && recaptchaToken !== null;

  const filteredCountries = AFRICAN_COUNTRIES.filter((c) => {
    const s = countrySearchTerm.toLowerCase();
    return c.country.toLowerCase().includes(s) || c.code.includes(s);
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!recaptchaToken) return setError("Please complete the reCAPTCHA verification.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (!acceptedTos || !acceptedPrivacy) return setError("You must accept the Terms and Privacy Policy.");

    try {
      setLoading(true);
      await createUserAction({
        firstName: form.firstName.trim(),
        lastName: entityType === "company" ? "" : form.lastName.trim(), // ← blank for company
        email: form.email.trim().toLowerCase(),
        phone: `${countryCode}${form.phone.trim()}`,
        password: form.password,
        entityType, // ← passed to backend so it knows individual vs company
        recaptchaToken,
        website: form.website,
      });
      toast.success("Account created! Check your email for the 6-digit verification code.");
      router.replace(`/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}&entityType=${entityType}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTosConfirmChange = (checked: boolean) => {
    setTosConfirm(checked);
    if (checked) { setAcceptedTos(true); setOpenTos(false); }
  };
  const handlePrivacyConfirmChange = (checked: boolean) => {
    setPrivacyConfirm(checked);
    if (checked) { setAcceptedPrivacy(true); setOpenPrivacy(false); }
  };

  const docs = entityType === "company" ? COMPANY_DOCS : INDIVIDUAL_DOCS;

  // ══════════════════════════════════════════════════════════════
  // STEP: Requirements overlay
  // ══════════════════════════════════════════════════════════════
  if (step === "requirements") {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="border-b p-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Before You Begin</h2>
                <p className="text-sm text-muted-foreground">Required documents and agreements</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Documents section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Required Documents
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ensure you have the following documents ready for upload during the verification process.
                  The exact list depends on whether you're registering as an individual or a company — you'll choose that next.
                </p>

                <div className="grid gap-3">
                  {[
                    { icon: CreditCard, text: "Valid National ID or Passport (individuals & directors)" },
                    { icon: FileText, text: "Bank statement — last 6 months" },
                    { icon: UserCircle, text: "Passport photo (individuals)" },
                    { icon: FileCheck, text: "TIN Certificate (optional for individuals, recommended for companies)" },
                    { icon: Briefcase, text: "Company registration & statutory documents (companies only)" },
                    { icon: Users, text: "Director & UBO identity documents (companies only)" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    All documents are securely stored and used only for verification in compliance with data protection regulations.
                  </p>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Required Agreements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Checkbox
                      id="acknowledgeDocuments"
                      checked={acknowledgedDocuments}
                      onCheckedChange={(c) => setAcknowledgedDocuments(c as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="acknowledgeDocuments" className="text-sm leading-relaxed cursor-pointer">
                      <span className="font-medium">I acknowledge that I have the required documents</span>
                      <span className="block text-muted-foreground mt-1">
                        I confirm I have the documents listed above and am ready to upload them during verification.
                      </span>
                    </label>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <Checkbox
                      id="dataProtection"
                      checked={acceptedDataProtection}
                      onCheckedChange={(c) => setAcceptedDataProtection(c as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="dataProtection" className="text-sm leading-relaxed cursor-pointer">
                      <span className="font-medium">Data Protection Agreement</span>
                      <span className="block text-muted-foreground mt-1">
                        I agree to the processing of my personal data in accordance with applicable data protection laws and GoldKach's privacy policy.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-6 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button
                onClick={() => canProceedFromOverlay && setStep("entity-select")}
                disabled={!canProceedFromOverlay}
                size="lg"
                className="min-w-[200px] gap-2"
              >
                {canProceedFromOverlay ? (
                  <><span>Continue</span><ChevronRight className="h-4 w-4" /></>
                ) : "Accept All to Continue"}
              </Button>
            </div>
            {!canProceedFromOverlay && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                Please accept all requirements to continue
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STEP: Entity type selection
  // ══════════════════════════════════════════════════════════════
  if (step === "entity-select") {
    return (
      <div className="space-y-6">
        <Image
          src="/logos/GoldKach-Logo-New-3.png"
          className="justify-center items-center ml-[calc(50%-40px)]"
          width={80}
          height={80}
          alt="logo"
        />

        <StepDots step="entity-select" />

        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Who are you registering as?</h1>
          <p className="text-muted-foreground text-sm">
            This determines the documents you'll need and your onboarding process.
          </p>
        </div>

        <div className="space-y-3">
          <EntityCard
            type="individual"
            selected={entityType === "individual"}
            onSelect={() => setEntityType("individual")}
          />
          <EntityCard
            type="company"
            selected={entityType === "company"}
            onSelect={() => setEntityType("company")}
          />
        </div>

        {/* Documents preview for selected type */}
        {entityType && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Documents you'll need ({entityType === "individual" ? "Individual" : "Company"})
            </p>
            <div className="space-y-2">
              {docs.map(({ icon: Icon, title, required }) => (
                <div key={title} className="flex items-center gap-2 text-sm">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-muted-foreground">{title}</span>
                  {required && (
                    <span className="text-[10px] font-medium text-primary border border-primary/30 rounded px-1.5 py-0.5">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setStep("requirements")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1 gap-2"
            disabled={!entityType}
            onClick={() => entityType && setStep("register")}
          >
            Continue as {entityType === "individual" ? "Individual" : entityType === "company" ? "Company" : "…"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">Sign in</a>
        </p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // STEP: Registration form
  // ══════════════════════════════════════════════════════════════
  return (
    <>
      <div className="space-y-4">
        <Image
          src="/logos/GoldKach-Logo-New-3.png"
          className="justify-center items-center ml-[calc(50%-40px)]"
          width={80}
          height={80}
          alt="logo"
        />

        <StepDots step="register" />

        {/* Header with entity badge */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
              entityType === "individual"
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
            )}>
              {entityType === "individual" ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
              {entityType === "individual" ? "Individual account" : "Company account"}
            </span>
            <button
              type="button"
              onClick={() => setStep("entity-select")}
              className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
            >
              Change
            </button>
          </div>
          <p className="text-muted-foreground text-sm">Get started with your investment journey today</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2 w-full">
              {/* Name fields — conditional on entity type */}
{entityType === "company" ? (
  <div className="space-y-2">
    <Label htmlFor="firstName">Company name</Label>
    <Input
      id="firstName"
      name="firstName"
      placeholder="Acme Uganda Ltd"
      value={form.firstName}
      onChange={onChange}
      required
    />
  </div>
) : (
  <div className="grid grid-cols-2 w-full gap-4">
    <div className="space-y-2 ">
      <Label htmlFor="firstName">First name</Label>
      <Input
        id="firstName"
        name="firstName"
        placeholder="John"
        value={form.firstName}
        onChange={onChange}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="lastName">Last name</Label>
      <Input
        id="lastName"
        name="lastName"
        placeholder="Doe"
        value={form.lastName}
        onChange={onChange}
        required
      />
            </div>
          </div>
        )}
            </div>
          </div>

         <div className="grid grid-cols-1 gap-4">
           <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openCountrySelect} className="w-[140px] justify-between">
                      <span className="truncate">
                        {AFRICAN_COUNTRIES.find((c) => c.code === countryCode)?.flag}{" "}{countryCode}
                      </span>
                      <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." value={countrySearchTerm} onValueChange={setCountrySearchTerm} />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCountries.map((c) => (
                            <CommandItem
                              key={c.code}
                              value={`${c.country} ${c.code}`}
                              onSelect={() => { setCountryCode(c.code); setOpenCountrySelect(false); setCountrySearchTerm(""); }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", countryCode === c.code ? "opacity-100" : "opacity-0")} />
                              <span className="mr-2">{c.flag}</span>
                              <span className="flex-1">{c.country}</span>
                              <span className="text-muted-foreground">{c.code}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input id="phone" name="phone" type="tel" placeholder="712345678" value={form.phone} onChange={onChange} required className="flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password" name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" value={form.password} onChange={onChange} required minLength={8} className="pr-10"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword" name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••" value={form.confirmPassword} onChange={onChange} required minLength={8} className="pr-10"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setShowConfirmPassword((v) => !v)}>
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Honeypot */}
          <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
            <Label htmlFor="website">Website (leave blank)</Label>
            <Input id="website" name="website" type="text" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" />
          </div>


         </div>
          {/* reCAPTCHA */}
          <div className="flex justify-center py-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
              onErrored={() => setRecaptchaToken(null)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="gap-2" onClick={() => setStep("entity-select")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button type="submit" className="flex-1" size="lg" disabled={!canSubmit}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">Sign in</a>
        </p>
      </div>

      {/* Terms Dialog */}
      <Dialog open={openTos} onOpenChange={(o) => { setOpenTos(o); if (!o) setTosConfirm(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Terms of Service</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-80 pr-2">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong>Welcome to Goldkach.</strong> These Terms govern your use of our platform…</p>
              <p>… (full legal copy here) …</p>
            </div>
          </ScrollArea>
          <div className="mt-3 flex items-center gap-2">
            <input id="tosConfirm" type="checkbox" className="h-4 w-4" checked={tosConfirm} onChange={(e) => handleTosConfirmChange(e.target.checked)} />
            <label htmlFor="tosConfirm" className="text-sm">I have read and agree to the Terms of Service.</label>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOpenTos(false)}>Close</Button>
            <Button onClick={() => { setAcceptedTos(true); setOpenTos(false); }} disabled={!tosConfirm}>Accept Terms</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={openPrivacy} onOpenChange={(o) => { setOpenPrivacy(o); if (!o) setPrivacyConfirm(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Privacy Policy</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-80 pr-2">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong>Your privacy matters.</strong> This Policy explains how we collect, use, and protect your data…</p>
              <p>… (full legal copy here) …</p>
            </div>
          </ScrollArea>
          <div className="mt-3 flex items-center gap-2">
            <input id="privacyConfirm" type="checkbox" className="h-4 w-4" checked={privacyConfirm} onChange={(e) => handlePrivacyConfirmChange(e.target.checked)} />
            <label htmlFor="privacyConfirm" className="text-sm">I have read and agree to the Privacy Policy.</label>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOpenPrivacy(false)}>Close</Button>
            <Button onClick={() => { setAcceptedPrivacy(true); setOpenPrivacy(false); }} disabled={!privacyConfirm}>Accept Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RegisterForm;