
// components/onboarding/company-onboarding-form.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle,
  Circle,
  Loader2,
  FileText,
  X,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react"
import { UploadDropzone } from "@/lib/uploadthing"

import { submitCompanyOnboarding } from "@/actions/onboarding"
import { clearOnboardingSession } from "@/actions/auth"
import { AgentSelector } from "./agent-selector"

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  user?: {
    id: string
    email: string
    emailVerified: boolean
    firstName?: string
    lastName?: string
    phone?: string
  } | null
}

type Director = {
  fullName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  ninOrPassportNumber: string
  documentUrl: string
}

type UBO = {
  fullName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  ninOrPassportNumber: string
  ownershipType: string
  ownershipTypeOther: string
  documentUrl: string
}

type FormData = {
  companyName: string
  email: string
  logoUrl: string
  companyType: string
  phoneNumbers: string[]

  registrationNumber: string
  tin: string
  incorporationDate: string
  companyAddress: string
  businessType: string

  primaryGoal: string
  timeHorizon: string
  riskTolerance: string
  investmentExperience: string
  sourceOfIncome: string
  expectedInvestment: string

  isPEP: string
  sanctionsOrLegal: string
  consentToDataCollection: boolean
  agreeToTerms: boolean

  // Documents
  constitutionUrl: string
  tradingLicenseUrl: string
  bankStatementUrl: string
  tinCertificateUrl: string
  logoDocUrl: string
  formA1Url: string
  formS18Url: string
  form18Url: string
  form20Url: string
  beneficialOwnershipFormUrl: string
  memorandumArticlesUrl: string
  officialAccountUrl: string

  agentId: string

  directors: Director[]
  ubos: UBO[]
}

const emptyDirector = (): Director => ({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  ninOrPassportNumber: "",
  documentUrl: "",
})

const emptyUBO = (): UBO => ({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  ninOrPassportNumber: "",
  ownershipType: "OTHER",
  ownershipTypeOther: "",
  documentUrl: "",
})

const initialFormData: FormData = {
  companyName: "",
  email: "",
  logoUrl: "",
  companyType: "",
  phoneNumbers: [""],
  registrationNumber: "",
  tin: "",
  incorporationDate: "",
  companyAddress: "",
  businessType: "",
  primaryGoal: "",
  timeHorizon: "",
  riskTolerance: "",
  investmentExperience: "",
  sourceOfIncome: "",
  expectedInvestment: "",
  isPEP: "",
  sanctionsOrLegal: "",
  consentToDataCollection: true,
  agreeToTerms: true,
  constitutionUrl: "",
  tradingLicenseUrl: "",
  bankStatementUrl: "",
  tinCertificateUrl: "",
  logoDocUrl: "",
  formA1Url: "",
  formS18Url: "",
  form18Url: "",
  form20Url: "",
  beneficialOwnershipFormUrl: "",
  memorandumArticlesUrl: "",
  officialAccountUrl: "",
  agentId: "",
  directors: [emptyDirector()],
  ubos: [],
}

const COMPANY_TYPES = [
  { value: "LIMITED", label: "Limited Company" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "NGO", label: "NGO" },
  { value: "COOPERATIVE", label: "Cooperative" },
  { value: "SAVINGS_GROUP", label: "SACCO / Savings Group" },
  { value: "MICROFINANCE", label: "Microfinance" },
]

const OWNERSHIP_TYPES = [
  { value: "OWNERSHIP_BY_SENIOR", label: "Ownership by Senior Official" },
  { value: "MANAGEMENT_OFFICIAL", label: "Management Official" },
  { value: "OTHER", label: "Other (please explain)" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function DocumentUploadCard({
  label,
  required = false,
  value,
  onUpload,
  onClear,
  endpoint,
}: {
  label: string
  required?: boolean
  value: string
  onUpload: (url: string) => void
  onClear: () => void
  endpoint: string
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {value && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      </div>
      {value ? (
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 flex-1">Document uploaded</span>
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="[&_.ut-button]:bg-primary [&_.ut-button]:text-primary-foreground [&_.ut-label]:text-sm">
          <UploadDropzone
            endpoint={endpoint as any}
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.url
              if (url) { onUpload(url); toast.success(`${label} uploaded!`) }
            }}
            onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`) }}
            className="border-dashed"
          />
        </div>
      )}
    </div>
  )
}

function PersonCard({
  title,
  person,
  index,
  onUpdate,
  onRemove,
  canRemove,
  showOwnership = false,
}: {
  title: string
  person: Director | UBO
  index: number
  onUpdate: (index: number, field: string, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
  showOwnership?: boolean
}) {
  const ubo = person as UBO
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{title} #{index + 1}</h4>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)} className="h-8 w-8 p-0 text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Full Name *</Label>
          <Input placeholder="Full name" value={person.fullName} onChange={(e) => onUpdate(index, "fullName", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Email</Label>
          <Input type="email" placeholder="email@company.com" value={person.email} onChange={(e) => onUpdate(index, "email", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Phone</Label>
          <Input placeholder="+256..." value={person.phone} onChange={(e) => onUpdate(index, "phone", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Date of Birth</Label>
          <Input type="date" value={person.dateOfBirth} onChange={(e) => onUpdate(index, "dateOfBirth", e.target.value)} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">Address</Label>
          <Input placeholder="Physical address" value={person.address} onChange={(e) => onUpdate(index, "address", e.target.value)} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">NIN / Passport Number</Label>
          <Input placeholder="National ID or Passport number" value={person.ninOrPassportNumber} onChange={(e) => onUpdate(index, "ninOrPassportNumber", e.target.value)} />
        </div>

        {showOwnership && (
          <>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Ownership Type</Label>
              <Select value={ubo.ownershipType} onValueChange={(v) => onUpdate(index, "ownershipType", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {OWNERSHIP_TYPES.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {ubo.ownershipType === "OTHER" && (
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Please explain *</Label>
                <Input placeholder="Explain ownership type" value={ubo.ownershipTypeOther} onChange={(e) => onUpdate(index, "ownershipTypeOther", e.target.value)} />
              </div>
            )}
          </>
        )}
      </div>

      {/* ID Document */}
      <div className="space-y-1">
        <Label className="text-xs">National ID / Passport Upload</Label>
        {person.documentUrl ? (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 flex-1">Document uploaded</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => onUpdate(index, "documentUrl", "")} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="[&_.ut-button]:bg-primary [&_.ut-button]:text-primary-foreground [&_.ut-label]:text-sm">
            <UploadDropzone
              endpoint={"idUrl" as any}
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url
                if (url) { onUpdate(index, "documentUrl", url); toast.success("Document uploaded!") }
              }}
              onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`) }}
              className="border-dashed"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewField({ label, value }: { label: string; value: string | boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm">{typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"}</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompanyOnboardingForm({ user }: Props) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [initDone, setInitDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [agreementConfirmed, setAgreementConfirmed] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null
      if (raw) {
        const parsed = JSON.parse(raw) as { id?: string; email?: string; firstName?: string }
        if (parsed?.id) setUserId(parsed.id)
        setFormData((p) => ({
          ...p,
          email: parsed?.email ?? p.email,
          companyName: parsed?.firstName ?? p.companyName, // firstName holds company name for company registrations
        }))
      } else if (user?.id) {
        setUserId(user.id)
        setFormData((p) => ({
          ...p,
          email: user.email ?? p.email,
          companyName: user.firstName ?? p.companyName,
        }))
      }
    } catch {
      // ignore
    } finally {
      setInitDone(true)
    }
  }, [user])

  const steps = [
    { id: 0, title: "Company Details", description: "Basic company information" },
    { id: 1, title: "Directors", description: "Company directors" },
    { id: 2, title: "UBOs", description: "Ultimate beneficial owners" },
    { id: 3, title: "Investment Profile", description: "Investment goals" },
    { id: 4, title: "Compliance", description: "Regulatory requirements" },
    { id: 5, title: "Documents", description: "Upload required documents" },
    { id: 6, title: "Review & Sign", description: "Confirm and sign" },
  ]

  const update = (field: keyof FormData, value: any) =>
    setFormData((p) => ({ ...p, [field]: value }))

  // Phone numbers
  const updatePhone = (index: number, value: string) => {
    setFormData((p) => {
      const phones = [...p.phoneNumbers]
      phones[index] = value
      return { ...p, phoneNumbers: phones }
    })
  }
  const addPhone = () => setFormData((p) => ({ ...p, phoneNumbers: [...p.phoneNumbers, ""] }))
  const removePhone = (index: number) =>
    setFormData((p) => ({ ...p, phoneNumbers: p.phoneNumbers.filter((_, i) => i !== index) }))

  // Directors
  const updateDirector = (index: number, field: string, value: string) => {
    setFormData((p) => {
      const updated = [...p.directors]
      updated[index] = { ...updated[index], [field]: value }
      return { ...p, directors: updated }
    })
  }
  const addDirector = () => setFormData((p) => ({ ...p, directors: [...p.directors, emptyDirector()] }))
  const removeDirector = (index: number) =>
    setFormData((p) => ({ ...p, directors: p.directors.filter((_, i) => i !== index) }))

  // UBOs
  const updateUBO = (index: number, field: string, value: string) => {
    setFormData((p) => {
      const updated = [...p.ubos]
      updated[index] = { ...updated[index], [field]: value }
      return { ...p, ubos: updated }
    })
  }
  const addUBO = () => setFormData((p) => ({ ...p, ubos: [...p.ubos, emptyUBO()] }))
  const removeUBO = (index: number) =>
    setFormData((p) => ({ ...p, ubos: p.ubos.filter((_, i) => i !== index) }))

  const isSacco = formData.companyType === "SAVINGS_GROUP" || formData.companyType === "MICROFINANCE"

  // ── Validation ──
  const validateStep0 = () =>
    !!formData.companyName &&
    !!formData.email &&
    !!formData.companyType &&
    formData.phoneNumbers.some((p) => p.trim() !== "")

  const validateStep1 = () =>
    formData.directors.length > 0 && formData.directors.every((d) => d.fullName)

  const validateStep2 = () => true // UBOs optional

  const validateStep3 = () =>
    !!formData.primaryGoal &&
    !!formData.timeHorizon &&
    !!formData.riskTolerance &&
    !!formData.investmentExperience

  const validateStep4 = () => !!formData.isPEP && !!formData.sanctionsOrLegal

  const validateStep5 = () => {
    if (!formData.bankStatementUrl) return false
    if (isSacco && !formData.constitutionUrl) return false
    return true
  }

  const validateStep6 = () =>
    validateStep0() &&
    validateStep1() &&
    validateStep3() &&
    validateStep4() &&
    validateStep5() &&
    agreementConfirmed

  const isStepValid = (step: number) => {
    switch (step) {
      case 0: return validateStep0()
      case 1: return validateStep1()
      case 2: return validateStep2()
      case 3: return validateStep3()
      case 4: return validateStep4()
      case 5: return validateStep5()
      case 6: return validateStep6()
      default: return false
    }
  }

  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      toast.error("Please complete all required fields")
      return
    }
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((p) => [...p, currentStep])
    }
    setCurrentStep((s) => s + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    if (!isStepValid(6)) {
      toast.error("Please complete all required steps and confirm the agreement")
      return
    }
    if (formData.sanctionsOrLegal === "yes") {
      toast.error("Cannot open account due to sanctions/legal history.")
      return
    }
    if (!userId) {
      toast.error("Session expired. Please verify your email again.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter((p) => p.trim() !== ""),
      }

      const res = await submitCompanyOnboarding(payload, userId)

      if (!res.success) {
        toast.error(res.error || "Submission failed.")
        return
      }

      localStorage.removeItem("onboardingUser")
      await clearOnboardingSession()
      router.push("/confirmation")
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const progress = ((completedSteps.length + 1) / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {initDone && !userId && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Session not found. Please complete email verification first.
        </div>
      )}

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Company Account Onboarding</h1>
        <p className="text-muted-foreground">Complete all steps to open your company investment account</p>
      </div>

      <Progress value={progress} />

      <div className="flex justify-center gap-2 overflow-x-auto pb-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center min-w-fit">
            {completedSteps.includes(step.id) ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className={`w-6 h-6 ${currentStep === step.id ? "text-blue-500" : "text-gray-300"}`} />
            )}
            <span className={`text-xs mt-1 text-center ${currentStep === step.id ? "font-semibold" : "text-muted-foreground"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* ── STEP 0: Company Details ── */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input placeholder="Registered company name" value={formData.companyName} onChange={(e) => update("companyName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Company Email *</Label>
                  <Input type="email" placeholder="info@company.com" value={formData.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Company Type *</Label>
                  <Select value={formData.companyType} onValueChange={(v) => update("companyType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select company type" /></SelectTrigger>
                    <SelectContent>
                      {COMPANY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input placeholder="Company registration number" value={formData.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>TIN</Label>
                  <Input placeholder="10-digit TIN" inputMode="numeric" value={formData.tin} onChange={(e) => update("tin", e.target.value.replace(/\D/g, "").slice(0, 10))} />
                </div>
                <div className="space-y-2">
                  <Label>Incorporation Date</Label>
                  <Input type="date" value={formData.incorporationDate} onChange={(e) => update("incorporationDate", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Company Address</Label>
                  <Input placeholder="Registered business address" value={formData.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                                <div className="md:col-span-2">
                <AgentSelector
                  value={formData.agentId}
                  onChange={(id) => update("agentId", id)}
                />
</div>
                </div>
              </div>

              {/* Phone numbers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Official Phone Numbers *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addPhone} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                {formData.phoneNumbers.map((phone, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="+256..."
                      value={phone}
                      onChange={(e) => updatePhone(i, e.target.value)}
                    />
                    {formData.phoneNumbers.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removePhone(i)} className="h-10 w-10 p-0 text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Directors ── */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Company Directors *</h3>
                  <p className="text-sm text-muted-foreground">At least one director is required.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addDirector} className="gap-1">
                  <Plus className="h-4 w-4" /> Add Director
                </Button>
              </div>
              {formData.directors.map((d, i) => (
                <PersonCard
                  key={i}
                  title="Director"
                  person={d}
                  index={i}
                  onUpdate={updateDirector}
                  onRemove={removeDirector}
                  canRemove={formData.directors.length > 1}
                />
              ))}
            </div>
          )}

          {/* ── STEP 2: UBOs ── */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Ultimate Beneficial Owners (UBOs)</h3>
                  <p className="text-sm text-muted-foreground">
                    Add UBOs if they differ from the directors above. Optional.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addUBO} className="gap-1">
                  <Plus className="h-4 w-4" /> Add UBO
                </Button>
              </div>
              {formData.ubos.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No UBOs added. Click "Add UBO" if your beneficial owners differ from the directors.
                </div>
              )}
              {formData.ubos.map((u, i) => (
                <PersonCard
                  key={i}
                  title="UBO"
                  person={u}
                  index={i}
                  onUpdate={updateUBO}
                  onRemove={removeUBO}
                  canRemove
                  showOwnership
                />
              ))}
            </div>
          )}

          {/* ── STEP 3: Investment Profile ── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Primary Investment Goal *</Label>
                <RadioGroup value={formData.primaryGoal} onValueChange={(v) => update("primaryGoal", v)}>
                  {[
                    { value: "growth", label: "Growth — Maximize returns" },
                    { value: "income", label: "Income — Regular returns" },
                    { value: "capital-preservation", label: "Capital Preservation — Protect principal" },
                  ].map((o) => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`cg-${o.value}`} />
                      <Label htmlFor={`cg-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Investment Time Horizon *</Label>
                <RadioGroup value={formData.timeHorizon} onValueChange={(v) => update("timeHorizon", v)}>
                  {["1-3-years", "3-5-years", "5-10-years", "over-10-years"].map((v) => (
                    <div key={v} className="flex items-center space-x-2">
                      <RadioGroupItem value={v} id={`ct-${v}`} />
                      <Label htmlFor={`ct-${v}`}>{v.replace(/-/g, " ")}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Risk Tolerance *</Label>
                <RadioGroup value={formData.riskTolerance} onValueChange={(v) => update("riskTolerance", v)}>
                  {[
                    { value: "aggressive", label: "Aggressive — High risk, high return" },
                    { value: "moderate-risk", label: "Moderate — Balanced approach" },
                    { value: "conservative", label: "Conservative — Low risk" },
                  ].map((o) => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`cr-${o.value}`} />
                      <Label htmlFor={`cr-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Investment Experience *</Label>
                <RadioGroup value={formData.investmentExperience} onValueChange={(v) => update("investmentExperience", v)}>
                  {[
                    { value: "none", label: "None" },
                    { value: "limited", label: "Limited" },
                    { value: "moderate", label: "Moderate" },
                    { value: "extensive", label: "Extensive" },
                  ].map((o) => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`ce-${o.value}`} />
                      <Label htmlFor={`ce-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source of Income</Label>
                  <Textarea placeholder="Primary source of company income" value={formData.sourceOfIncome} onChange={(e) => update("sourceOfIncome", e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Expected Investment Amount (USD)</Label>
                  <Input placeholder="e.g. 100000" value={formData.expectedInvestment} onChange={(e) => update("expectedInvestment", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Compliance ── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Is the company or any of its directors a PEP? *</Label>
                <RadioGroup value={formData.isPEP} onValueChange={(v) => update("isPEP", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="cpep-yes" />
                    <Label htmlFor="cpep-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cpep-no" />
                    <Label htmlFor="cpep-no">No</Label>
                  </div>
                </RadioGroup>
                {formData.isPEP === "yes" && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                    Your application will undergo enhanced due diligence review.
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Has the company been subject to financial sanctions or legal proceedings? *</Label>
                <RadioGroup value={formData.sanctionsOrLegal} onValueChange={(v) => update("sanctionsOrLegal", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="cs-yes" />
                    <Label htmlFor="cs-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cs-no" />
                    <Label htmlFor="cs-no">No</Label>
                  </div>
                </RadioGroup>
                {formData.sanctionsOrLegal === "yes" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    Unfortunately, we cannot process your application due to sanctions/legal history.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 5: Documents ── */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">Document Upload</h4>
                <p className="text-sm text-blue-800">
                  Bank statement is required. Constitution is required for SACCOs/Microfinance.
                  All other documents are optional but recommended.
                </p>
              </div>

              {/* Required */}
              <DocumentUploadCard label="Bank Statement (last 6 months)" required value={formData.bankStatementUrl} onUpload={(u) => update("bankStatementUrl", u)} onClear={() => update("bankStatementUrl", "")} endpoint="statementUrl" />

              {isSacco && (
                <DocumentUploadCard label="SACCO / Savings Group Constitution" required value={formData.constitutionUrl} onUpload={(u) => update("constitutionUrl", u)} onClear={() => update("constitutionUrl", "")} endpoint="documentUploader" />
              )}

              {/* Optional */}
              <div className="border-t pt-4 space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Optional Documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Trading License", field: "tradingLicenseUrl" },
                    { label: "TIN Certificate", field: "tinCertificateUrl" },
                    { label: "Form A1", field: "formA1Url" },
                    { label: "Form S18", field: "formS18Url" },
                    { label: "Form 18", field: "form18Url" },
                    { label: "Form 20", field: "form20Url" },
                    { label: "Beneficial Ownership Form", field: "beneficialOwnershipFormUrl" },
                    { label: "Memorandum & Articles of Association", field: "memorandumArticlesUrl" },
                    { label: "Official Account Document", field: "officialAccountUrl" },
                    { label: "Constitution (Non-SACCO)", field: "constitutionUrl" },
                  ].map(({ label, field }) => (
                    <DocumentUploadCard
                      key={field}
                      label={label}
                      value={(formData as any)[field]}
                      onUpload={(u) => update(field as keyof FormData, u)}
                      onClear={() => update(field as keyof FormData, "")}
                      endpoint="documentUploader"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 6: Review & Sign ── */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900">Almost Done!</h4>
                <p className="text-sm text-green-800">Read the Investment Management Agreement and confirm your acceptance.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <ReviewField label="Company Name" value={formData.companyName} />
                <ReviewField label="Email" value={formData.email} />
                <ReviewField label="Company Type" value={formData.companyType} />
                <ReviewField label="Registration No." value={formData.registrationNumber} />
                <ReviewField label="Investment Goal" value={formData.primaryGoal} />
                <ReviewField label="Risk Tolerance" value={formData.riskTolerance} />
                <ReviewField label="PEP Status" value={formData.isPEP} />
                <ReviewField label="Sanctions/Legal" value={formData.sanctionsOrLegal} />
              </div>

              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium mb-1">Directors ({formData.directors.length})</p>
                {formData.directors.map((d, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{i + 1}. {d.fullName}</p>
                ))}
              </div>

              {formData.ubos.length > 0 && (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium mb-1">UBOs ({formData.ubos.length})</p>
                  {formData.ubos.map((u, i) => (
                    <p key={i} className="text-sm text-muted-foreground">{i + 1}. {u.fullName}</p>
                  ))}
                </div>
              )}

              {/* Agreement PDF */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold">Investment Management Agreement</h3>
                </div>
                <iframe
                  src="/GoldKach UG Investment Management Agreement - New Version.pdf"
                  className="w-full h-[500px]"
                  title="Investment Management Agreement"
                />
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="co-agreement-confirm"
                    checked={agreementConfirmed}
                    onCheckedChange={(c) => setAgreementConfirmed(c as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="co-agreement-confirm" className="font-medium cursor-pointer">
                      I have read and agree to the Investment Management Agreement on behalf of the company *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      By checking this box, you confirm that you are duly authorised to sign on behalf of the company and agree to all terms in the agreement above.
                    </p>
                  </div>
                </div>
              </div>

              {formData.sanctionsOrLegal === "yes" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800 font-semibold">
                    ⚠️ Your application cannot be processed due to sanctions/legal history.
                  </p>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || loading}>
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading || !isStepValid(6) || formData.sanctionsOrLegal === "yes" || !userId}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}