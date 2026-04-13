// components/onboarding/individual-onboarding-form.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Circle,
  Loader2,
  FileText,
  Eye,
  Edit,
  X,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/lib/uploadthing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { submitIndividualOnboarding } from "@/actions/onboarding"
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

type Beneficiary = {
  fullName: string
  dateOfBirth: string
  phone: string
  address: string
  relation: string
  tin: string
  documentUrl: string
}

type NextOfKin = {
  fullName: string
  dateOfBirth: string
  phone: string
  address: string
  relation: string
  tin: string
  documentUrl: string
}

type FormData = {
  fullName: string
  dateOfBirth: string
  tin: string
  homeAddress: string
  email: string
  phoneNumber: string
  employmentStatus: string
  occupation: string
  companyName: string
  hasBusiness: string
  avatarUrl: string

  // Investment profile
  primaryGoal: string
  timeHorizon: string
  riskTolerance: string
  investmentExperience: string

  // Compliance
  isPEP: string
  publicPosition: string
  relationshipToCountry: string
  familyMemberDetails: string
  consentToDataCollection: boolean
  agreeToTerms: boolean

  // Financial
  sourceOfIncome: string
  employmentIncome: string
  expectedInvestment: string
  businessOwnership: string
  sanctionsOrLegal: string

  // Documents
  nationalIdUrl: string
  passportPhotoUrl: string
  tinCertificateUrl: string
  bankStatementUrl: string

  // Agent
  agentId: string

  // Relations
  beneficiaries: Beneficiary[]
  nextOfKin: NextOfKin[]
}

const emptyBeneficiary = (): Beneficiary => ({
  fullName: "",
  dateOfBirth: "",
  phone: "",
  address: "",
  relation: "OTHER",
  tin: "",
  documentUrl: "",
})

const emptyNextOfKin = (): NextOfKin => ({
  fullName: "",
  dateOfBirth: "",
  phone: "",
  address: "",
  relation: "OTHER",
  tin: "",
  documentUrl: "",
})

const initialFormData: FormData = {
  fullName: "",
  dateOfBirth: "",
  tin: "",
  homeAddress: "",
  email: "",
  phoneNumber: "",
  employmentStatus: "",
  occupation: "",
  companyName: "",
  hasBusiness: "",
  avatarUrl: "",
  primaryGoal: "",
  timeHorizon: "",
  riskTolerance: "",
  investmentExperience: "",
  isPEP: "",
  publicPosition: "",
  relationshipToCountry: "",
  familyMemberDetails: "",
  consentToDataCollection: true,
  agreeToTerms: true,
  sourceOfIncome: "",
  employmentIncome: "",
  expectedInvestment: "",
  businessOwnership: "",
  sanctionsOrLegal: "",
  nationalIdUrl: "",
  passportPhotoUrl: "",
  tinCertificateUrl: "",
  bankStatementUrl: "",
  agentId: "",
  beneficiaries: [emptyBeneficiary()],
  nextOfKin: [emptyNextOfKin()],
}

const RELATION_OPTIONS = [
  { value: "SPOUSE", label: "Spouse" },
  { value: "CHILD", label: "Child" },
  { value: "PARENT", label: "Parent" },
  { value: "BROTHER", label: "Brother" },
  { value: "SISTER", label: "Sister" },
  { value: "SIBLING", label: "Sibling" },
  { value: "OTHER", label: "Other" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function PersonCard({
  title,
  person,
  index,
  onUpdate,
  onRemove,
  canRemove,
  uploadEndpoint,
}: {
  title: string
  person: Beneficiary | NextOfKin
  index: number
  onUpdate: (index: number, field: string, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
  uploadEndpoint: string
}) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">
          {title} #{index + 1}
        </h4>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Full Name *</Label>
          <Input
            placeholder="Full name"
            value={person.fullName}
            onChange={(e) => onUpdate(index, "fullName", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Phone *</Label>
          <Input
            placeholder="+256..."
            value={person.phone}
            onChange={(e) => onUpdate(index, "phone", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Date of Birth</Label>
          <Input
            type="date"
            value={person.dateOfBirth}
            onChange={(e) => onUpdate(index, "dateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Relationship</Label>
          <Select
            value={person.relation}
            onValueChange={(v) => onUpdate(index, "relation", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              {RELATION_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">Address</Label>
          <Input
            placeholder="Physical address"
            value={person.address}
            onChange={(e) => onUpdate(index, "address", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">TIN (Optional)</Label>
          <Input
            placeholder="10-digit TIN"
            value={person.tin}
            onChange={(e) =>
              onUpdate(index, "tin", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />
        </div>
      </div>

      {/* ID Document Upload */}
      <div className="space-y-1">
        <Label className="text-xs">National ID / Passport</Label>
        {person.documentUrl ? (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 flex-1">Document uploaded</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onUpdate(index, "documentUrl", "")}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="[&_.ut-button]:bg-primary [&_.ut-button]:text-primary-foreground [&_.ut-allowed-content]:text-foreground [&_.ut-label]:text-sm">
            <UploadDropzone
              endpoint={uploadEndpoint as any}
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url
                if (url) {
                  onUpdate(index, "documentUrl", url)
                  toast.success("Document uploaded!")
                }
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="[&_.ut-button]:bg-primary [&_.ut-button]:text-primary-foreground [&_.ut-label]:text-sm">
          <UploadDropzone
            endpoint={endpoint as any}
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.url
              if (url) {
                onUpload(url)
                toast.success(`${label} uploaded!`)
              }
            }}
            onUploadError={(error) => { toast.error(`Upload failed: ${error.message}`) }}
            className="border-dashed"
          />
        </div>
      )}
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

export default function IndividualOnboardingForm({ user }: Props) {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [initDone, setInitDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [tinValidating, setTinValidating] = useState(false)
  const [agreementConfirmed, setAgreementConfirmed] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null
      const savedProgress = typeof window !== "undefined" ? localStorage.getItem("individualOnboardingProgress") : null

      if (savedProgress) {
        const progress = JSON.parse(savedProgress)
        if (progress.userId === user?.id || progress.userId) {
          setCurrentStep(progress.currentStep ?? 0)
          setCompletedSteps(progress.completedSteps ?? [])
          setFormData((p) => ({ ...p, ...progress.formData }))
        }
      }

      if (raw) {
        const parsed = JSON.parse(raw) as { id?: string; email?: string; phone?: string; firstName?: string; lastName?: string }
        if (parsed?.id) setUserId(parsed.id)
        setFormData((p) => ({
          ...p,
          email: parsed?.email ?? p.email,
          phoneNumber: parsed?.phone ?? p.phoneNumber,
          fullName: parsed?.firstName
            ? `${parsed.firstName} ${parsed.lastName ?? ""}`.trim()
            : p.fullName,
        }))
      } else if (user?.id) {
        setUserId(user.id)
        setFormData((p) => ({
          ...p,
          email: user.email ?? p.email,
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          phoneNumber: user.phone ?? p.phoneNumber,
        }))
      }
    } catch {
      // ignore
    } finally {
      setInitDone(true)
    }
  }, [user])

  useEffect(() => {
    if (initDone && userId) {
      localStorage.setItem(
        "individualOnboardingProgress",
        JSON.stringify({ userId, currentStep, completedSteps, formData })
      )
    }
  }, [currentStep, completedSteps, formData, userId, initDone])

  const steps = [
    { id: 0, title: "Personal Info", description: "Your personal details" },
    { id: 1, title: "Beneficiaries", description: "Beneficiaries & next of kin" },
    { id: 2, title: "Investment Profile", description: "Your investment goals" },
    { id: 3, title: "Compliance", description: "Regulatory requirements" },
    { id: 4, title: "Financial Info", description: "Source of income & funds" },
    { id: 5, title: "Documents", description: "Upload required documents" },
    { id: 6, title: "Review & Sign", description: "Confirm details and sign" },
  ]

  const update = (field: keyof FormData, value: any) =>
    setFormData((p) => ({ ...p, [field]: value }))

  // Beneficiary helpers
  const updateBeneficiary = (index: number, field: string, value: string) => {
    setFormData((p) => {
      const updated = [...p.beneficiaries]
      updated[index] = { ...updated[index], [field]: value }
      return { ...p, beneficiaries: updated }
    })
  }
  const addBeneficiary = () =>
    setFormData((p) => ({ ...p, beneficiaries: [...p.beneficiaries, emptyBeneficiary()] }))
  const removeBeneficiary = (index: number) =>
    setFormData((p) => ({ ...p, beneficiaries: p.beneficiaries.filter((_, i) => i !== index) }))

  // Next of kin helpers
  const updateNextOfKin = (index: number, field: string, value: string) => {
    setFormData((p) => {
      const updated = [...p.nextOfKin]
      updated[index] = { ...updated[index], [field]: value }
      return { ...p, nextOfKin: updated }
    })
  }
  const addNextOfKin = () =>
    setFormData((p) => ({ ...p, nextOfKin: [...p.nextOfKin, emptyNextOfKin()] }))
  const removeNextOfKin = (index: number) =>
    setFormData((p) => ({ ...p, nextOfKin: p.nextOfKin.filter((_, i) => i !== index) }))

  // ── Validation ──
  const validateStep0 = () =>
    !!formData.fullName &&
    !!formData.dateOfBirth &&
    !!formData.homeAddress &&
    !!formData.email &&
    !!formData.phoneNumber &&
    !!formData.employmentStatus &&
    !!formData.occupation

  const validateStep1 = () => {
    const bValid = formData.beneficiaries.every((b) => b.fullName && b.phone)
    const nValid = formData.nextOfKin.every((n) => n.fullName && n.phone)
    return formData.beneficiaries.length > 0 && formData.nextOfKin.length > 0 && bValid && nValid
  }

  const validateStep2 = () =>
    !!formData.primaryGoal &&
    !!formData.timeHorizon &&
    !!formData.riskTolerance &&
    !!formData.investmentExperience

  const validateStep3 = () => !!formData.isPEP

  const validateStep4 = () =>
    !!formData.sourceOfIncome &&
    !!formData.employmentIncome &&
    !!formData.expectedInvestment &&
    !!formData.sanctionsOrLegal

  const validateStep5 = () => !!formData.nationalIdUrl

  const validateStep6 = () =>
    validateStep0() &&
    validateStep1() &&
    validateStep2() &&
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

  const handleNext = async () => {
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
      const res = await submitIndividualOnboarding(
        {
          ...formData,
          entityType: "individual",
          agentId: formData.agentId || null,
        },
        userId
      )

      if (!res.success) {
        toast.error(res.error || "Submission failed.")
        return
      }

      localStorage.removeItem("onboardingUser")
      localStorage.removeItem("individualOnboardingProgress")
      await clearOnboardingSession()
      if (formData.isPEP === "yes") {
        toast.info("Your application will undergo enhanced review as a PEP.")
      }
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
        <h1 className="text-3xl font-bold">Individual Account Onboarding</h1>
        <p className="text-muted-foreground">Complete all steps to open your investment account</p>
      </div>

      <Progress value={progress} className="w-full" />

      {/* Step indicators */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center min-w-fit">
            {completedSteps.includes(step.id) ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle
                className={`w-6 h-6 ${currentStep === step.id ? "text-blue-500" : "text-gray-300"}`}
              />
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

          {/* ── STEP 0: Personal Info ── */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input placeholder="First and last name" value={formData.fullName} onChange={(e) => update("fullName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>TIN (Optional)</Label>
                <Input
                  placeholder="10-digit TIN"
                  inputMode="numeric"
                  value={formData.tin}
                  onChange={(e) => update("tin", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
                <p className="text-xs text-muted-foreground">{formData.tin.length}/10 digits</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input placeholder="+256..." value={formData.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Home Address *</Label>
                <Input placeholder="Street, City, Country" value={formData.homeAddress} onChange={(e) => update("homeAddress", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Occupation *</Label>
                <Input placeholder="Your profession" value={formData.occupation} onChange={(e) => update("occupation", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Employment Status *</Label>
                <RadioGroup value={formData.employmentStatus} onValueChange={(v) => update("employmentStatus", v)} className="flex flex-wrap gap-4">
                  {["employed", "self-employed", "retired", "student"].map((s) => (
                    <div key={s} className="flex items-center space-x-2">
                      <RadioGroupItem value={s} id={`emp-${s}`} />
                      <Label htmlFor={`emp-${s}`} className="capitalize">{s.replace("-", " ")}</Label>
                    </div>
                  ))}
                </RadioGroup>
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
          )}

          {/* ── STEP 1: Beneficiaries & Next of Kin ── */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Beneficiaries */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Beneficiaries *</h3>
                    <p className="text-sm text-muted-foreground">At least one beneficiary is required.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addBeneficiary} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                {formData.beneficiaries.map((b, i) => (
                  <PersonCard
                    key={i}
                    title="Beneficiary"
                    person={b}
                    index={i}
                    onUpdate={updateBeneficiary}
                    onRemove={removeBeneficiary}
                    canRemove={formData.beneficiaries.length > 1}
                    uploadEndpoint="idUrl"
                  />
                ))}
              </div>

              {/* Next of Kin */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Next of Kin *</h3>
                    <p className="text-sm text-muted-foreground">At least one next of kin is required.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addNextOfKin} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                {formData.nextOfKin.map((n, i) => (
                  <PersonCard
                    key={i}
                    title="Next of Kin"
                    person={n}
                    index={i}
                    onUpdate={updateNextOfKin}
                    onRemove={removeNextOfKin}
                    canRemove={formData.nextOfKin.length > 1}
                    uploadEndpoint="idUrl"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Investment Profile ── */}
          {currentStep === 2 && (
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
                      <RadioGroupItem value={o.value} id={o.value} />
                      <Label htmlFor={o.value}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Investment Time Horizon *</Label>
                <RadioGroup value={formData.timeHorizon} onValueChange={(v) => update("timeHorizon", v)}>
                  {[
                    { value: "1-3-years", label: "1-3 years" },
                    { value: "3-5-years", label: "3-5 years" },
                    { value: "5-10-years", label: "5-10 years" },
                    { value: "over-10-years", label: "Over 10 years" },
                  ].map((o) => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={o.value} />
                      <Label htmlFor={o.value}>{o.label}</Label>
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
                      <RadioGroupItem value={o.value} id={o.value} />
                      <Label htmlFor={o.value}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Investment Experience *</Label>
                <RadioGroup value={formData.investmentExperience} onValueChange={(v) => update("investmentExperience", v)}>
                  {[
                    { value: "none", label: "None — First time investor" },
                    { value: "limited", label: "Limited — Some experience" },
                    { value: "moderate", label: "Moderate — Regular investor" },
                    { value: "extensive", label: "Extensive — Experienced investor" },
                  ].map((o) => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={o.value} />
                      <Label htmlFor={o.value}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* ── STEP 3: Compliance ── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Are you a Politically Exposed Person (PEP)? *</Label>
                <p className="text-sm text-muted-foreground">
                  A PEP is someone who holds or has held a prominent public position or is closely related to such a person.
                </p>
                <RadioGroup value={formData.isPEP} onValueChange={(v) => update("isPEP", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="pep-yes" />
                    <Label htmlFor="pep-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="pep-no" />
                    <Label htmlFor="pep-no">No</Label>
                  </div>
                </RadioGroup>
                {formData.isPEP === "yes" && (
                  <div className="mt-3 space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">Your application will undergo enhanced due diligence.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Public Position Held</Label>
                        <Input placeholder="e.g. Minister, MP" value={formData.publicPosition} onChange={(e) => update("publicPosition", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Country of Position</Label>
                        <Input placeholder="Country" value={formData.relationshipToCountry} onChange={(e) => update("relationshipToCountry", e.target.value)} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-xs">Family Member Details (if applicable)</Label>
                        <Textarea placeholder="Describe family member's position" value={formData.familyMemberDetails} onChange={(e) => update("familyMemberDetails", e.target.value)} rows={2} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: Financial Info ── */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Source of Income *</Label>
                <Textarea
                  placeholder="Describe your primary source of income (e.g., salary, business, investments)"
                  value={formData.sourceOfIncome}
                  onChange={(e) => update("sourceOfIncome", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Annual Income (USD) *</Label>
                  <Input placeholder="e.g. 25000" value={formData.employmentIncome} onChange={(e) => update("employmentIncome", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Expected Investment Amount (USD) *</Label>
                  <Input placeholder="Initial investment amount" value={formData.expectedInvestment} onChange={(e) => update("expectedInvestment", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Ownership / Other Investments (Optional)</Label>
                <Textarea
                  placeholder="Describe any business ownership or other investments"
                  value={formData.businessOwnership}
                  onChange={(e) => update("businessOwnership", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Have you ever been subject to financial sanctions or legal proceedings? *</Label>
                <RadioGroup value={formData.sanctionsOrLegal} onValueChange={(v) => update("sanctionsOrLegal", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="sanctions-yes" />
                    <Label htmlFor="sanctions-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="sanctions-no" />
                    <Label htmlFor="sanctions-no">No</Label>
                  </div>
                </RadioGroup>
                {formData.sanctionsOrLegal === "yes" && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    Unfortunately, we cannot process your application due to sanctions/legal history.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 5: Documents ── */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">Document Upload</h4>
                <p className="text-sm text-blue-800">
                  National ID or Passport is required. Bank statement, passport photo, and TIN certificate are optional.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <DocumentUploadCard
                  label="National ID or Passport"
                  required
                  value={formData.nationalIdUrl}
                  onUpload={(url) => update("nationalIdUrl", url)}
                  onClear={() => update("nationalIdUrl", "")}
                  endpoint="idUrl"
                />
                <DocumentUploadCard
                  label="Bank Statement (last 6 months)"
                  value={formData.bankStatementUrl}
                  onUpload={(url) => update("bankStatementUrl", url)}
                  onClear={() => update("bankStatementUrl", "")}
                  endpoint="statementUrl"
                />
                <DocumentUploadCard
                  label="Passport Photo"
                  value={formData.passportPhotoUrl}
                  onUpload={(url) => update("passportPhotoUrl", url)}
                  onClear={() => update("passportPhotoUrl", "")}
                  endpoint="passportUrl"
                />
                <DocumentUploadCard
                  label="TIN Certificate"
                  value={formData.tinCertificateUrl}
                  onUpload={(url) => update("tinCertificateUrl", url)}
                  onClear={() => update("tinCertificateUrl", "")}
                  endpoint="tinUrl"
                />
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

              {/* Review summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <ReviewField label="Full Name" value={formData.fullName} />
                <ReviewField label="Date of Birth" value={formData.dateOfBirth} />
                <ReviewField label="Phone" value={formData.phoneNumber} />
                <ReviewField label="Email" value={formData.email} />
                <ReviewField label="Employment" value={formData.employmentStatus} />
                <ReviewField label="Occupation" value={formData.occupation} />
                <ReviewField label="Investment Goal" value={formData.primaryGoal} />
                <ReviewField label="Risk Tolerance" value={formData.riskTolerance} />
                <ReviewField label="Source of Income" value={formData.sourceOfIncome} />
                <ReviewField label="Expected Investment" value={formData.expectedInvestment} />
                <ReviewField label="PEP Status" value={formData.isPEP} />
                <ReviewField label="Sanctions/Legal" value={formData.sanctionsOrLegal} />
              </div>

              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium mb-1">Beneficiaries ({formData.beneficiaries.length})</p>
                {formData.beneficiaries.map((b, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{i + 1}. {b.fullName} — {b.phone}</p>
                ))}
              </div>

              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium mb-1">Next of Kin ({formData.nextOfKin.length})</p>
                {formData.nextOfKin.map((n, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{i + 1}. {n.fullName} — {n.phone}</p>
                ))}
              </div>

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
                <div className="flex items-start space-x-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Checkbox
                    id="agreement-confirm"
                    checked={agreementConfirmed}
                    onCheckedChange={(c) => setAgreementConfirmed(c as boolean)}
                    className="mt-0.5 h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div>
                    <Label htmlFor="agreement-confirm" className="font-semibold text-slate-900 dark:text-white cursor-pointer">
                      I have read and agree to the Investment Management Agreement *
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      By checking this box, you confirm that you have read, understood, and agree to all terms in the agreement above. This is required to submit your application.
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
              {formData.isPEP === "yes" && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ℹ️ Your application will undergo enhanced due diligence as a PEP.
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