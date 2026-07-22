// components/onboarding/individual-onboarding-form.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  PenLine,
  Upload as UploadIcon,
  Type,
  RotateCcw,
  Info,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone, useUploadThing } from "@/lib/uploadthing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { submitIndividualOnboarding } from "@/actions/onboarding"
import { clearOnboardingSession } from "@/actions/auth"
import { AgentSelector } from "./agent-selector"
import { RiskQuestionnaireForm } from "@/components/onboarding/risk-questionnaire-form"
import {
  isQuestionnaireComplete,
  computeRiskProfile,
  deriveInvestmentProfileFields,
  type RiskAnswers,
} from "@/lib/risk-questionnaire"

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
  title: string
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

  // Investment profile (derived from questionnaire)
  primaryGoal: string
  timeHorizon: string
  riskTolerance: string
  investmentExperience: string
  riskQuestionnaire: RiskAnswers

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

  // Signature
  signatureMethod: "draw" | "upload" | "type"
  signatureImageUrl: string
  signatureTypedName: string
  signatureConfirmed: boolean

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
  title: "",
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
  riskQuestionnaire: {},
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
  signatureMethod: "draw",
  signatureImageUrl: "",
  signatureTypedName: "",
  signatureConfirmed: false,
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
    <div className="border-2 border-[#193388]/25 rounded-lg overflow-hidden">
      <div className="bg-[#193388]/10 border-b border-[#193388]/20 px-4 py-2.5 flex items-center justify-between">
        <h4 className="font-semibold text-sm text-[#193388] dark:text-blue-300">
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

      <div className="p-4 space-y-4">
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
            <div className="[&_.ut-button]:bg-[#193388] [&_.ut-button]:text-white [&_.ut-allowed-content]:text-foreground [&_.ut-label]:text-sm">
              <UploadDropzone
                endpoint={uploadEndpoint as any}
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.url
                  if (url) {
                    onUpdate(index, "documentUrl", url)
                    toast.success("Document uploaded!")
                  }
                }}
                onUploadError={(error) => {
                  // In dev mode, UploadThing's callback stream may fail even though the file IS uploaded.
                  // Run `pnpm build && pnpm start` locally to avoid this. Production is unaffected.
                  if (error.message?.includes("callback failed")) {
                    toast.warning("File uploaded but server confirmation failed (dev mode only). Try again or use production build.");
                  } else {
                    toast.error(`Upload failed: ${error.message}`);
                  }
                }}
                className="border-dashed border-[#193388]/40"
              />
            </div>
          )}
        </div>
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
    <div className="border-2 border-[#193388]/25 rounded-lg overflow-hidden">
      <div className="bg-[#193388]/10 border-b border-[#193388]/20 px-4 py-2.5 flex items-center justify-between">
        <Label className="text-sm font-semibold text-[#193388] dark:text-blue-300">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {value && <CheckCircle2 className="h-5 w-5 text-[#193388]" />}
      </div>
      <div className="p-4">
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
          <div className="[&_.ut-button]:bg-[#193388] [&_.ut-button]:text-white [&_.ut-label]:text-sm">
            <UploadDropzone
              endpoint={endpoint as any}
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url
                if (url) {
                  onUpload(url)
                  toast.success(`${label} uploaded!`)
                }
              }}
              onUploadError={(error) => {
                if (error.message?.includes("callback failed")) {
                  toast.warning("File uploaded but confirmation failed (dev mode only). Try again or use `pnpm start`.");
                } else {
                  toast.error(`Upload failed: ${error.message}`);
                }
              }}
              className="border-dashed border-[#193388]/40"
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

// ─── Signature ────────────────────────────────────────────────────────────────

const SIG_METHODS = [
  { id: "draw" as const,   icon: PenLine,     label: "Draw Signature",  desc: "Sign using mouse, touch, or stylus" },
  { id: "upload" as const, icon: UploadIcon,  label: "Upload Image",    desc: "PNG, JPG or JPEG, max 5 MB" },
  { id: "type" as const,   icon: Type,        label: "Type Your Name",  desc: "Full legal name as e-signature" },
]

function trimCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = src.getContext("2d")!
  const { width, height } = src
  const d = ctx.getImageData(0, 0, width, height).data
  let x0 = width, y0 = height, x1 = 0, y1 = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (d[i + 3] > 0 && (d[i] < 250 || d[i + 1] < 250 || d[i + 2] < 250)) {
        if (x < x0) x0 = x; if (y < y0) y0 = y
        if (x > x1) x1 = x; if (y > y1) y1 = y
      }
    }
  }
  if (x0 >= x1 || y0 >= y1) return src
  const pad = 12
  const sx = Math.max(0, x0 - pad), sy = Math.max(0, y0 - pad)
  const sw = Math.min(width, x1 + pad) - sx, sh = Math.min(height, y1 + pad) - sy
  const out = document.createElement("canvas")
  out.width = sw; out.height = sh
  const oc = out.getContext("2d")!
  oc.fillStyle = "#fff"; oc.fillRect(0, 0, sw, sh)
  oc.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh)
  return out
}

function SignaturePad({
  currentUrl,
  onApplied,
  onClear,
}: {
  currentUrl: string
  onApplied: (url: string) => void
  onClear: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const [isEmpty, setIsEmpty] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { startUpload } = useUploadThing("signatureImage")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  function getPos(e: { clientX: number; clientY: number }) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function startDraw(pos: { x: number; y: number }) {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    drawing.current = true
    lastPos.current = pos
    ctx.beginPath()
    ctx.fillStyle = "#000"
    ctx.arc(pos.x, pos.y, 1.2, 0, Math.PI * 2)
    ctx.fill()
    setIsEmpty(false)
  }

  function continueDraw(pos: { x: number; y: number }) {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  function stopDraw() { drawing.current = false }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    onClear()
  }

  async function applySignature() {
    const canvas = canvasRef.current
    if (!canvas || isEmpty) return
    setUploading(true)
    try {
      const trimmed = trimCanvas(canvas)
      const blob = await new Promise<Blob>((resolve, reject) =>
        trimmed.toBlob((b) => (b ? resolve(b) : reject(new Error("blob failed"))), "image/png")
      )
      const file = new File([blob], "signature.png", { type: "image/png" })
      const uploaded = await startUpload([file])
      const uploadedFile = uploaded?.[0]
      const url = uploadedFile?.ufsUrl ?? (uploadedFile as any)?.url
      if (url) {
        onApplied(url)
      } else {
        toast.error("Failed to get signature URL.")
      }
    } catch {
      toast.error("Failed to upload signature. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  // ── Applied state: show preview ──
  if (currentUrl) {
    return (
      <div className="space-y-3">
        <div className="border-2 border-green-300 rounded-lg bg-white p-4 flex items-center justify-center min-h-[110px]">
          <img src={currentUrl} alt="Your signature" className="max-h-24 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-sm text-green-700 font-medium">Signature applied</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => { setIsEmpty(true); onClear() }}
            className="ml-auto gap-1.5 border-[#193388] text-[#193388]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Redraw
          </Button>
        </div>
      </div>
    )
  }

  // ── Drawing state ──
  return (
    <div className="space-y-3">
      <div className="border-2 border-[#193388]/30 rounded-lg overflow-hidden bg-white">
        <div className="bg-[#193388]/5 border-b border-[#193388]/20 px-3 py-1.5 flex items-center justify-between">
          <p className="text-xs text-[#193388] dark:text-blue-300 font-medium">
            Draw your signature in the box below
          </p>
          <p className="text-[10px] text-muted-foreground">Mouse · Touch · Stylus</p>
        </div>
        <canvas
          ref={canvasRef}
          width={700}
          height={200}
          className="w-full h-44 touch-none cursor-crosshair block"
          style={{ background: "white" }}
          onMouseDown={(e) => startDraw(getPos(e))}
          onMouseMove={(e) => continueDraw(getPos(e))}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={(e) => { e.preventDefault(); startDraw(getPos(e.touches[0])) }}
          onTouchMove={(e) => { e.preventDefault(); continueDraw(getPos(e.touches[0])) }}
          onTouchEnd={(e) => { e.preventDefault(); stopDraw() }}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          disabled={isEmpty}
          className="gap-1.5 border-[#193388] text-[#193388]"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={applySignature}
          disabled={isEmpty || uploading}
          className="gap-1.5 bg-[#193388] hover:bg-[#142a80] text-white"
        >
          {uploading
            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
            : <><CheckCircle2 className="h-3.5 w-3.5" /> Apply Signature</>
          }
        </Button>
      </div>
    </div>
  )
}

function UploadSignaturePanel({
  currentUrl,
  onApplied,
  onClear,
}: {
  currentUrl: string
  onApplied: (url: string) => void
  onClear: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { startUpload } = useUploadThing("signatureImage")

  async function handleFile(file: File) {
    const allowed = ["image/png", "image/jpeg", "image/jpg"]
    if (!allowed.includes(file.type)) {
      toast.error("Only PNG, JPG, or JPEG images are accepted.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB.")
      return
    }
    setUploading(true)
    try {
      const uploaded = await startUpload([file])
      const uploadedFile = uploaded?.[0]
      const url = uploadedFile?.ufsUrl ?? (uploadedFile as any)?.url
      if (url) {
        onApplied(url)
      } else {
        toast.error("Failed to get signature URL.")
      }
    } catch {
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  if (currentUrl) {
    return (
      <div className="space-y-3">
        <div className="border-2 border-green-300 rounded-lg bg-white p-4 flex items-center justify-center min-h-[110px]">
          <img src={currentUrl} alt="Uploaded signature" className="max-h-24 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-sm text-green-700 font-medium">Signature uploaded</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            className="ml-auto gap-1.5 border-[#193388] text-[#193388]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Replace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files?.[0]
          if (file) handleFile(file)
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
          dragOver
            ? "border-[#193388] bg-[#193388]/10"
            : "border-[#193388]/30 hover:border-[#193388]/60 hover:bg-[#193388]/5"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-[#193388]" />
            <p className="text-sm text-muted-foreground">Uploading…</p>
          </>
        ) : (
          <>
            <UploadIcon className="h-8 w-8 text-[#193388]/60" />
            <div className="text-center">
              <p className="text-sm font-medium text-[#193388] dark:text-blue-300">
                Drop your signature image here
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG · Max 5 MB</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="border-[#193388] text-[#193388]">
              Browse File
            </Button>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
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
  const [lockedAgentId, setLockedAgentId] = useState<string | null>(null)
  const { startUpload: uploadAgreementPdf } = useUploadThing("signedAgreementPdf")

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

      // Apply referral agent lock if present
      const agentRef = typeof window !== "undefined" ? localStorage.getItem("onboardingAgentRef") : null
      if (agentRef) {
        setLockedAgentId(agentRef)
        setFormData((p) => ({ ...p, agentId: agentRef }))
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

  const validateStep2 = () => isQuestionnaireComplete(formData.riskQuestionnaire)

  const validateStep3 = () => !!formData.isPEP

  const validateStep4 = () =>
    !!formData.sourceOfIncome &&
    !!formData.employmentIncome &&
    !!formData.expectedInvestment &&
    !!formData.sanctionsOrLegal

  const validateStep5 = () => !!formData.nationalIdUrl && !!formData.bankStatementUrl && !!formData.passportPhotoUrl

  const validateSignature = () => {
    if (!formData.signatureConfirmed) return false
    const m = formData.signatureMethod
    if (m === "draw" || m === "upload") return !!formData.signatureImageUrl
    if (m === "type") return formData.signatureTypedName.trim().length >= 3
    return false
  }

  const validateStep6 = () =>
    validateStep0() &&
    validateStep1() &&
    validateStep2() &&
    validateStep3() &&
    validateStep4() &&
    validateStep5() &&
    agreementConfirmed &&
    validateSignature()

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

  // Coordinates calibrated from the actual PDF (Letter 612×792, origin bottom-left).
  // Signature row ≈ y=450, Name ≈ y=423, Date ≈ y=353.
  const PDF_SIG     = { x: 130, y: 443, maxW: 175, maxH: 24 }
  const PDF_NAME    = { x: 105, y: 421 }
  const PDF_TITLE   = { x: 105, y: 399 }
  const PDF_COMPANY = { x: 105, y: 377 }
  const PDF_DATE    = { x:  95, y: 353 }

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
    let signedAgreementUrl: string | undefined
    try {
      // ── Step 1: Generate signed PDF ──────────────────────────────────────────
      try {
        const templateRes = await fetch("/GoldKach Uganda Investment Management Agreement 2026.pdf")
        if (templateRes.ok) {
          const pdfDoc = await PDFDocument.load(await templateRes.arrayBuffer())
          const lastPage = pdfDoc.getPages().at(-1)!
          const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
          const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
          const ink = rgb(0.04, 0.04, 0.04)

          // Client name
          lastPage.drawText(formData.fullName, {
            x: PDF_NAME.x, y: PDF_NAME.y, size: 10,
            font: helveticaBold, color: ink,
          })

          // Title
          if (formData.title) {
            lastPage.drawText(formData.title, {
              x: PDF_TITLE.x, y: PDF_TITLE.y, size: 10,
              font: helvetica, color: ink,
            })
          }

          // Company (employer name, or "NONE" for individuals with no company)
          const companyText = formData.companyName?.trim() || "NONE"
          lastPage.drawText(companyText, {
            x: PDF_COMPANY.x, y: PDF_COMPANY.y, size: 10,
            font: helvetica, color: ink,
          })

          // Date signed
          const dateStr = new Date().toLocaleDateString("en-UG", {
            year: "numeric", month: "long", day: "numeric",
          })
          lastPage.drawText(dateStr, {
            x: PDF_DATE.x, y: PDF_DATE.y, size: 10,
            font: helvetica, color: ink,
          })

          // Signature
          if (formData.signatureMethod === "type") {
            const italic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
            lastPage.drawText(formData.signatureTypedName.trim() || formData.fullName, {
              x: PDF_SIG.x, y: PDF_SIG.y, size: 22,
              font: italic, color: rgb(0.05, 0.05, 0.35),
            })
          } else if (formData.signatureImageUrl) {
            const imgRes = await fetch(formData.signatureImageUrl)
            if (imgRes.ok) {
              const imgBytes = await imgRes.arrayBuffer()
              const isJpeg = /\.(jpe?g)(\?|$)/i.test(formData.signatureImageUrl)
              const embedded = isJpeg
                ? await pdfDoc.embedJpg(imgBytes)
                : await pdfDoc.embedPng(imgBytes)
              const dims = embedded.scale(1)
              const scale = Math.min(PDF_SIG.maxW / dims.width, PDF_SIG.maxH / dims.height)
              lastPage.drawImage(embedded, {
                x: PDF_SIG.x, y: PDF_SIG.y,
                width: dims.width * scale, height: dims.height * scale,
              })
            }
          }

          const pdfBytes = await pdfDoc.save()
          const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
          const pdfFile = new File([pdfBlob], `signed-agreement-${userId}.pdf`, { type: "application/pdf" })
          const uploaded = await uploadAgreementPdf([pdfFile])
          const f0 = uploaded?.[0]
          signedAgreementUrl = f0?.ufsUrl ?? (f0 as any)?.url ?? undefined
        }
      } catch (pdfErr) {
        console.error("PDF signing failed (non-blocking):", pdfErr)
      }

      // ── Step 2: Submit onboarding ─────────────────────────────────────────────
      const { score, profile, strategy } = computeRiskProfile(formData.riskQuestionnaire)
      const derived = deriveInvestmentProfileFields(formData.riskQuestionnaire)
      const sigMethod = formData.signatureMethod
      const res = await submitIndividualOnboarding(
        {
          ...formData,
          ...derived,
          riskScore: score,
          riskProfile: profile,
          suggestedStrategy: strategy,
          entityType: "individual",
          agentId: formData.agentId || null,
          signatureType: sigMethod === "draw" ? "DRAWN" : sigMethod === "upload" ? "UPLOADED" : "TYPED",
          signatureImageUrl: sigMethod !== "type" ? formData.signatureImageUrl : undefined,
          signatureTypedName: sigMethod === "type" ? formData.signatureTypedName.trim() : undefined,
          signedAgreementUrl,
        },
        userId
      )

      if (!res.success) {
        if (res.error === "No token provided" || res.error?.includes("token")) {
          toast.error("Your session expired. Please log in again to submit your application.")
          router.push("/login?alert=" + encodeURIComponent("Your session expired. Please log in to continue your onboarding."))
        } else {
          toast.error(res.error || "Submission failed.")
        }
        return
      }

      localStorage.removeItem("onboardingUser")
      localStorage.removeItem("individualOnboardingProgress")
      localStorage.removeItem("onboardingAgentRef")
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
    <div className="max-w-4xl mx-auto border-4 border-[#193388] rounded-xl shadow-xl overflow-hidden">
      {/* Brand header banner */}
      <div className="bg-[#193388] text-white px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Individual Account Onboarding</h1>
          <p className="text-blue-200 text-sm mt-0.5">Complete all steps to open your investment account</p>
        </div>
        <div className="text-right text-xs text-blue-200 opacity-80 hidden sm:block">
          <p className="font-semibold text-sm">GoldKach Investment</p>
          <p>Unlocking Global Investments</p>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-white dark:bg-[#0f1135]">
        {initDone && !userId && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Session not found. Please complete email verification first.
          </div>
        )}

        <Progress value={progress} className="w-full [&>div]:bg-[#193388]" />

        {/* Step indicators */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center min-w-fit">
              {completedSteps.includes(step.id) ? (
                <CheckCircle className="w-6 h-6 text-[#193388]" />
              ) : (
                <Circle
                  className={`w-6 h-6 ${currentStep === step.id ? "text-[#193388]" : "text-gray-300"}`}
                />
              )}
              <span className={`text-xs mt-1 text-center ${currentStep === step.id ? "font-semibold text-[#193388]" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <Card className="border-2 border-[#193388]/30 shadow-sm overflow-hidden">
          <CardHeader className="bg-[#193388] text-white rounded-none py-3 px-5">
            <CardTitle className="text-white text-lg">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-blue-200">{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

          {/* ── STEP 0: Personal Info ── */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select value={formData.title} onValueChange={(v) => update("title", v)}>
                  <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                  <SelectContent>
                    {["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Eng.", "Rev."].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                {lockedAgentId ? (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
                    <span className="text-muted-foreground font-medium">Agent:</span>
                    <span className="text-slate-800 dark:text-white font-semibold">Pre-assigned via referral link</span>
                    <span className="ml-auto text-xs text-primary border border-primary/30 rounded px-1.5 py-0.5">Locked</span>
                  </div>
                ) : (
                  <AgentSelector
                    value={formData.agentId}
                    onChange={(id) => update("agentId", id)}
                  />
                )}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Beneficiaries & Next of Kin ── */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Beneficiaries */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#193388] text-white px-4 py-2.5 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Beneficiaries *</h3>
                    <p className="text-sm text-blue-200">At least one beneficiary is required.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addBeneficiary} className="gap-1 bg-white/10 border-white/30 text-white hover:bg-white/20">
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
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between bg-[#193388] text-white px-4 py-2.5 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Next of Kin *</h3>
                    <p className="text-sm text-blue-200">At least one next of kin is required.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addNextOfKin} className="gap-1 bg-white/10 border-white/30 text-white hover:bg-white/20">
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
            <RiskQuestionnaireForm
              answers={formData.riskQuestionnaire}
              onAnswerChange={(qId, score) =>
                update("riskQuestionnaire", { ...formData.riskQuestionnaire, [qId]: score })
              }
              idPrefix="ind"
            />
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
              <div className="bg-[#193388] text-white rounded-lg p-4">
                <h4 className="font-semibold mb-1">Document Upload</h4>
                <p className="text-sm text-blue-200">
                  National ID or Passport, Bank Statement, and Passport Photo are required. TIN certificate is optional.
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
                  required
                  value={formData.bankStatementUrl}
                  onUpload={(url) => update("bankStatementUrl", url)}
                  onClear={() => update("bankStatementUrl", "")}
                  endpoint="statementUrl"
                />
                <DocumentUploadCard
                  label="Passport Photo"
                  required
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
              <div className="bg-[#193388] text-white rounded-lg p-4">
                <h4 className="font-semibold">Almost Done!</h4>
                <p className="text-sm text-blue-200">Read the Investment Management Agreement and confirm your acceptance.</p>
              </div>

              {/* Review summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-[#193388]/30 rounded-lg bg-[#dce6f1]/20 dark:bg-[#193388]/5">
                {formData.title && <ReviewField label="Title" value={formData.title} />}
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

              <div className="p-3 border-2 border-[#193388]/30 rounded-lg bg-[#dce6f1]/20 dark:bg-[#193388]/5">
                <p className="text-sm font-semibold text-[#193388] dark:text-blue-300 mb-1">Beneficiaries ({formData.beneficiaries.length})</p>
                {formData.beneficiaries.map((b, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{i + 1}. {b.fullName} — {b.phone}</p>
                ))}
              </div>

              <div className="p-3 border-2 border-[#193388]/30 rounded-lg bg-[#dce6f1]/20 dark:bg-[#193388]/5">
                <p className="text-sm font-semibold text-[#193388] dark:text-blue-300 mb-1">Next of Kin ({formData.nextOfKin.length})</p>
                {formData.nextOfKin.map((n, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{i + 1}. {n.fullName} — {n.phone}</p>
                ))}
              </div>

              {/* Agreement PDF */}
              <div className="border-2 border-[#193388]/30 rounded-lg overflow-hidden">
                <div className="bg-[#193388] px-4 py-3 border-b flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold">Investment Management Agreement</h3>
                </div>
                <iframe
                  src="/GoldKach Uganda Investment Management Agreement 2026.pdf"
                  className="w-full h-[500px]"
                  title="Investment Management Agreement"
                />
              </div>

              <div className="border-2 border-[#193388]/30 rounded-lg p-4 bg-[#dce6f1]/30 dark:bg-[#193388]/10">
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

              {/* ── Signature Section ── */}
              <div className="border-2 border-[#193388]/30 rounded-lg overflow-hidden">
                <div className="bg-[#193388] px-4 py-3 flex items-center gap-2 text-white">
                  <PenLine className="h-5 w-5" />
                  <h3 className="font-semibold">Your Official Signature</h3>
                </div>
                <div className="p-4 space-y-4 bg-[#dce6f1]/20 dark:bg-[#193388]/5">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Your signature will be securely stored and used to sign documents on the platform.
                      Choose your preferred method below.
                    </p>
                  </div>

                  {/* Method selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SIG_METHODS.map((m) => {
                      const Icon = m.icon
                      const active = formData.signatureMethod === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            update("signatureMethod", m.id)
                            update("signatureImageUrl", "")
                            update("signatureTypedName", "")
                            update("signatureConfirmed", false)
                          }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 text-left transition-all ${
                            active
                              ? "border-[#193388] bg-[#193388]/10 text-[#193388] dark:text-blue-300"
                              : "border-slate-200 dark:border-slate-700 text-muted-foreground hover:border-[#193388]/50"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-semibold">{m.label}</span>
                          <span className="text-xs text-center leading-snug">{m.desc}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Draw panel */}
                  {formData.signatureMethod === "draw" && (
                    <SignaturePad
                      currentUrl={formData.signatureImageUrl}
                      onApplied={(url) => update("signatureImageUrl", url)}
                      onClear={() => update("signatureImageUrl", "")}
                    />
                  )}

                  {/* Upload panel */}
                  {formData.signatureMethod === "upload" && (
                    <UploadSignaturePanel
                      currentUrl={formData.signatureImageUrl}
                      onApplied={(url) => update("signatureImageUrl", url)}
                      onClear={() => update("signatureImageUrl", "")}
                    />
                  )}

                  {/* Type panel */}
                  {formData.signatureMethod === "type" && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="sig-typed-name" className="text-sm font-medium">
                          Full Legal Name
                        </Label>
                        <Input
                          id="sig-typed-name"
                          value={formData.signatureTypedName}
                          onChange={(e) => update("signatureTypedName", e.target.value)}
                          placeholder="Type your full legal name"
                          className="mt-1 border-[#193388]/30 focus-visible:ring-[#193388]"
                        />
                        {formData.signatureTypedName.trim().length > 0 &&
                          formData.signatureTypedName.trim().length < 3 && (
                          <p className="text-xs text-red-500 mt-1">Minimum 3 characters required</p>
                        )}
                      </div>
                      {formData.signatureTypedName.trim().length >= 3 && (
                        <div className="border-2 border-[#193388]/30 rounded-lg bg-white dark:bg-slate-900 px-6 py-5 text-center min-h-[80px] flex items-center justify-center">
                          <p
                            className="text-[#193388] dark:text-blue-300 select-none"
                            style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: "2rem" }}
                          >
                            {formData.signatureTypedName.trim()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Signature confirmation checkbox */}
                  <div className="flex items-start space-x-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <Checkbox
                      id="sig-confirm"
                      checked={formData.signatureConfirmed}
                      onCheckedChange={(c) => update("signatureConfirmed", c as boolean)}
                      className="mt-0.5 h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div>
                      <Label htmlFor="sig-confirm" className="font-semibold text-slate-900 dark:text-white cursor-pointer">
                        I confirm that this is my official signature *
                      </Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        I authorize the platform to use this signature whenever my signature is required on documents within the system.
                      </p>
                    </div>
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
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || loading}
            className="border-[#193388] text-[#193388] hover:bg-[#193388]/10 dark:text-blue-300 dark:border-[#193388]/50"
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="bg-[#193388] hover:bg-[#142a80] text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(6) || formData.sanctionsOrLegal === "yes" || !userId}
              className="bg-[#193388] hover:bg-[#142a80] text-white"
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
    </div>
  )
}