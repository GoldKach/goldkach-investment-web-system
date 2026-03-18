





// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Progress } from "@/components/ui/progress"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { 
//   CheckCircle, 
//   Circle, 
//   Loader2, 
//   User, 
//   Eye, 
//   Edit,
//   FileText,
//   Upload,
//   X,
//   CheckCircle2
// } from "lucide-react"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Textarea } from "@/components/ui/textarea"
// import { UploadDropzone } from "@/lib/uploadthing"

// import { submitOnboarding } from "@/actions/onboarding"

// type Props = {
//   user?: {
//     id: string
//     email: string
//     emailVerified: boolean
//     firstName?: string
//     lastName?: string
//     phone?: string
//   } | null
// }

// type FormData = {
//   entityType: string
//   fullName: string
//   dateOfBirth: string
//   hasBusiness: "yes" | "no" | "" | null
//   tin: string
//   homeAddress: string
//   email: string
//   phoneNumber: string
//   employmentStatus: string
//   occupation: string
//   avatarUrl: string

//   // Company fields
//   companyName: string
//   registrationNumber: string
//   companyAddress: string
//   businessType: string
//   incorporationDate: string
//   authorizedRepName: string
//   authorizedRepEmail: string
//   authorizedRepPhone: string
//   authorizedRepPosition: string

//   // Investment objectives
//   primaryGoal: string
//   timeHorizon: string
//   riskTolerance: string
//   investmentExperience: string

//   // Regulatory
//   isPEP: string
//   consentToDataCollection: boolean
//   agreeToTerms: boolean

//   // EDD
//   sourceOfWealth: string
//   businessOwnership: string
//   employmentIncome: string
//   expectedInvestment: string
//   businessName: string
//   businessAddress: string
//   establishmentDate: string
//   ownershipPercentage: string
//   familyMemberDetails: string
//   publicPosition: string
//   relationshipToCountry: string
//   sanctionsOrLegal: string

//   // Required Documents
//   nationalIdUrl: string
//   bankStatementUrl: string
//   // Optional Documents
//   passportPhotoUrl: string
//   tinCertificateUrl: string
// }

// const initialFormData: FormData = {
//   entityType: "",
//   fullName: "",
//   dateOfBirth: "",
//   hasBusiness: "",
//   tin: "",
//   homeAddress: "",
//   email: "",
//   phoneNumber: "",
//   employmentStatus: "",
//   occupation: "",
//   avatarUrl: "",

//   companyName: "",
//   registrationNumber: "",
//   companyAddress: "",
//   businessType: "",
//   incorporationDate: "",
//   authorizedRepName: "",
//   authorizedRepEmail: "",
//   authorizedRepPhone: "",
//   authorizedRepPosition: "",

//   primaryGoal: "",
//   timeHorizon: "",
//   riskTolerance: "",
//   investmentExperience: "",

//   isPEP: "",
//   consentToDataCollection: true,
//   agreeToTerms: true,

//   sourceOfWealth: "",
//   businessOwnership: "",
//   employmentIncome: "",
//   expectedInvestment: "",
//   businessName: "",
//   businessAddress: "",
//   establishmentDate: "",
//   ownershipPercentage: "",
//   familyMemberDetails: "",
//   publicPosition: "",
//   relationshipToCountry: "",
//   sanctionsOrLegal: "",

//   nationalIdUrl: "",
//   bankStatementUrl: "",
//   passportPhotoUrl: "",
//   tinCertificateUrl: "",
// }

// export default function OnboardingForm({ user }: Props) {
//   const router = useRouter()

//   const [userId, setUserId] = useState<string | null>(null)
//   const [initDone, setInitDone] = useState(false)

//   const [currentStep, setCurrentStep] = useState(0)
//   const [formData, setFormData] = useState<FormData>(initialFormData)
//   const [completedSteps, setCompletedSteps] = useState<number[]>([])
//   const [loading, setLoading] = useState(false)
//   const [tinValidating, setTinValidating] = useState(false)

//   const [termsOpen, setTermsOpen] = useState(false)
//   const [privacyOpen, setPrivacyOpen] = useState(false)

//   useEffect(() => {
//     try {
//       const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null
//       if (raw) {
//         const parsed = JSON.parse(raw) as { id?: string; email?: string }
//         if (parsed?.id) setUserId(parsed.id)
//         setFormData((p) => ({
//           ...p,
//           email: parsed?.email ?? p.email,
//         }))
//       } else if (user?.id) {
//         setUserId(user.id)
//         setFormData((p) => ({
//           ...p,
//           email: user.email ?? p.email,
//           fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
//           phoneNumber: user.phone ?? p.phoneNumber,
//         }))
//       }
//     } catch {
//       // ignore
//     } finally {
//       setInitDone(true)
//     }
//   }, [user])

//   const steps = useMemo(
//     () => [
//       { 
//         id: 0, 
//         title: "Account Type", 
//         description: "Select your account type" 
//       },
//       {
//         id: 1,
//         title: "Basic Information",
//         description: formData.entityType === "company" 
//           ? "Your company details" 
//           : "Your personal details",
//       },
//       { 
//         id: 2, 
//         title: "Investment Profile", 
//         description: "Your investment goals" 
//       },
//       { 
//         id: 3, 
//         title: "Compliance", 
//         description: "Regulatory requirements" 
//       },
//       { 
//         id: 4, 
//         title: "Financial Information", 
//         description: "Source of funds" 
//       },
//       { 
//         id: 5, 
//         title: "Document Upload", 
//         description: "Required documents" 
//       },
//       { 
//         id: 6, 
//         title: "Review", 
//         description: "Confirm your details" 
//       },
//     ],
//     [formData.entityType]
//   )

//   const updateFormData = (field: keyof FormData, value: string | boolean) =>
//     setFormData((prev) => ({ ...prev, [field]: value as any }))

//   const validateTINClient = (tin: string) => /^[0-9]{10}$/.test(tin)

//   const validateTIN = async (tin: string) => {
//     if (!validateTINClient(tin)) {
//       toast.error("TIN must be exactly 10 digits.")
//       return false
//     }
//     return true
//   }

//   // Validation functions
//   const validateStep0 = () => formData.entityType !== ""
  
//   const validateStep1 = () => {
//     if (formData.entityType === "individual") {
//       return (
//         formData.fullName &&
//         formData.dateOfBirth &&
//         validateTINClient(formData.tin) &&
//         formData.homeAddress &&
//         formData.email &&
//         formData.phoneNumber &&
//         formData.employmentStatus &&
//         formData.occupation
//       )
//     }
//     if (formData.entityType === "company") {
//       return (
//         formData.companyName &&
//         formData.registrationNumber &&
//         formData.companyAddress &&
//         formData.businessType &&
//         formData.incorporationDate &&
//         formData.authorizedRepName &&
//         formData.authorizedRepEmail &&
//         formData.authorizedRepPhone &&
//         formData.authorizedRepPosition
//       )
//     }
//     return false
//   }
  
//   const validateStep2 = () =>
//     formData.primaryGoal && 
//     formData.timeHorizon && 
//     formData.riskTolerance && 
//     formData.investmentExperience
  
//   const validateStep3 = () =>
//     formData.isPEP && 
//     formData.consentToDataCollection && 
//     formData.agreeToTerms
  
//   const validateStep4 = () =>
//     formData.sourceOfWealth && 
//     formData.employmentIncome && 
//     formData.expectedInvestment
  
//   const validateStep5 = () =>
//     formData.nationalIdUrl && 
//     formData.bankStatementUrl
  
//   const validateStep6 = () =>
//     validateStep0() && 
//     validateStep1() && 
//     validateStep2() && 
//     validateStep3() && 
//     validateStep4() &&
//     validateStep5()

//   const isStepValid = (step: number) => {
//     switch (step) {
//       case 0: return validateStep0()
//       case 1: return validateStep1()
//       case 2: return validateStep2()
//       case 3: return validateStep3()
//       case 4: return validateStep4()
//       case 5: return validateStep5()
//       case 6: return validateStep6()
//       default: return false
//     }
//   }

//   const handleNext = async () => {
//     if (!isStepValid(currentStep)) {
//       toast.error("Please complete all required fields")
//       return
//     }

//     if (currentStep === 1 && formData.entityType === "individual" && formData.tin) {
//       const ok = await validateTIN(formData.tin)
//       if (!ok) return
//     }

//     if (!completedSteps.includes(currentStep)) {
//       setCompletedSteps((prev) => [...prev, currentStep])
//     }
//     if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
//   }

//   const handlePrevious = () => {
//     if (currentStep > 0) setCurrentStep((s) => s - 1)
//   }

//   const handleEditStep = (step: number) => {
//     setCurrentStep(step)
//   }

//   const handleSubmit = async () => {
//     if (!isStepValid(6)) {
//       toast.error("Please complete all required steps")
//       return
//     }
    
//     if (formData.sanctionsOrLegal === "yes") {
//       toast.error("Unfortunately, you cannot open an account due to sanctions/legal history.")
//       return
//     }
    
//     if (!userId) {
//       toast.error("Session expired. Please verify your email again.")
//       return
//     }

//     setLoading(true)
//     try {
//       const payload = {
//         ...formData,
//         entityType: formData.entityType || "individual",
//       }
      
//       const res = await submitOnboarding(payload, userId)
      
//       if (!res.success) {
//         toast.error(res.error || "Submission failed.")
//         return
//       }

//       localStorage.removeItem("onboardingUser")
      
//       toast.success("Application submitted successfully!")
      
//       if (formData.isPEP === "yes") {
//         toast.info("Your application will undergo enhanced review as a PEP.")
//       }
      
//       router.push("/confirmation")
//     } catch (error) {
//       toast.error("An error occurred. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const progress = ((completedSteps.length + 1) / steps.length) * 100

//   const DocumentUploadCard = ({ 
//     label, 
//     required = false,
//     value,
//     field,
//     endpoint = "documentUploader"
//   }: { 
//     label: string
//     required?: boolean
//     value: string
//     field: keyof FormData
//     endpoint?: string
//   }) => (
//     <div className="border rounded-lg p-4 space-y-3">
//       <div className="flex items-center justify-between">
//         <Label className="text-sm font-medium">
//           {label} {required && <span className="text-red-500">*</span>}
//         </Label>
//         {value && <CheckCircle2 className="h-5 w-5 text-green-500" />}
//       </div>
      
//       {value ? (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
//             <FileText className="h-4 w-4 text-green-600" />
//             <span className="text-sm text-green-700 flex-1">Document uploaded</span>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => updateFormData(field, "")}
//               className="h-6 w-6 p-0"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//           <a
//             href={value}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-xs text-blue-600 hover:underline flex items-center gap-1"
//           >
//             <Eye className="h-3 w-3" />
//             View document
//           </a>
//         </div>
//       ) : (
//     //     <UploadDropzone
//     //       endpoint={endpoint as any}
//     //       onClientUploadComplete={(res) => {
//     //         const url = res?.[0]?.url
//     //         if (url) {
//     //           updateFormData(field, url)
//     //           toast.success(`${label} uploaded successfully!`)
//     //         }
//     //       }}
//     //       onUploadError={(error: Error) => {
//     //         toast.error(`Upload failed: ${error.message}`)
//     //       }}
//     //       className="border-dashed ut-label:text-foreground ut-allowed-content:text-muted-foreground ut-button:bg-primary ut-button:text-primary-foreground hover:ut-button:bg-primary/90"

//     //      />
//     //   )}
//     // </div>
//         <div className="[&_.ut-button]:bg-primary [&_.ut-button]:text-primary-foreground [&_.ut-allowed-content]:text-foreground [&_.ut-label]:text-lg [&_.ut-label]:font-semibold [&_.ut-label]:text-foreground">
//         <UploadDropzone
//           endpoint={endpoint as any}
//           onClientUploadComplete={(res) => {
//             const url = res?.[0]?.url
//             if (url) {
//               updateFormData(field, url)
//               toast.success(`${label} uploaded successfully!`)
//             }
//           }}
//           onUploadError={(error: Error) => {
//             toast.error(`Upload failed: ${error.message}`)
//           }}
//           className="border-dashed"
//         />
//       </div>
//     )}
//   </div>
//   )

//   const ReviewField = ({ label, value }: { label: string; value: string | boolean }) => (
//     <div className="space-y-1">
//       <p className="text-sm font-medium text-muted-foreground">{label}</p>
//       <p className="text-base">{typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"}</p>
//     </div>
//   )

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       {initDone && !userId && (
//         <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
//           Session not found. Please complete email verification first.
//         </div>
//       )}

//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold">Account Registration</h1>
//         <p className="text-muted-foreground">Complete all steps to open your investment account</p>
//       </div>
      
//       <Progress value={progress} className="w-full" />

//       <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
//         {steps.map((step) => (
//           <div key={step.id} className="flex flex-col items-center min-w-fit">
//             <div className="flex items-center gap-2">
//               {completedSteps.includes(step.id) ? (
//                 <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
//               ) : (
//                 <Circle
//                   className={`w-6 h-6 flex-shrink-0 ${
//                     currentStep === step.id ? "text-blue-500" : "text-gray-300"
//                   }`}
//                 />
//               )}
//             </div>
//             <span className={`text-xs mt-1 text-center ${
//               currentStep === step.id ? "font-semibold" : "text-muted-foreground"
//             }`}>
//               {step.title}
//             </span>
//           </div>
//         ))}
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>{steps[currentStep].title}</CardTitle>
//           <CardDescription>{steps[currentStep].description}</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* STEP 0 — ACCOUNT TYPE */}
//           {currentStep === 0 && (
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-center">Choose your account type</h3>
//                 <RadioGroup
//                   value={formData.entityType}
//                   onValueChange={(v) => updateFormData("entityType", v)}
//                   className="grid gap-4"
//                 >
//                   <Label
//                     htmlFor="individual"
//                     className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
//                       formData.entityType === "individual" 
//                         ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <RadioGroupItem value="individual" id="individual" className="mt-1" />
//                     <div className="flex-1">
//                       <div className="font-medium">Individual Account</div>
//                       <p className="text-sm text-muted-foreground">
//                         For personal investments
//                       </p>
//                     </div>
//                   </Label>
                  
//                   <Label
//                     htmlFor="company"
//                     className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
//                       formData.entityType === "company" 
//                         ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <RadioGroupItem value="company" id="company" className="mt-1" />
//                     <div className="flex-1">
//                       <div className="font-medium">Company Account</div>
//                       <p className="text-sm text-muted-foreground">
//                         For corporate investments
//                       </p>
//                     </div>
//                   </Label>
//                 </RadioGroup>
//               </div>
//             </div>
//           )}

//           {/* STEP 1 — BASIC INFORMATION (Individual) */}
//           {currentStep === 1 && formData.entityType === "individual" && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="fullName">Full Name *</Label>
//                   <Input
//                     id="fullName"
//                     value={formData.fullName}
//                     onChange={(e) => updateFormData("fullName", e.target.value)}
//                     placeholder="First name and last name"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="dateOfBirth">Date of Birth *</Label>
//                   <Input
//                     id="dateOfBirth"
//                     type="date"
//                     value={formData.dateOfBirth}
//                     onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="tin">Tax ID Number (TIN) *</Label>
//                   <div className="relative">
//                     <Input
//                       id="tin"
//                       type="text"
//                       inputMode="numeric"
//                       value={formData.tin}
//                       onChange={(e) => updateFormData("tin", e.target.value.replace(/\D/g, "").slice(0, 10))}
//                       placeholder="10-digit TIN"
//                     />
//                     {tinValidating && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
//                   </div>
//                   <p className="text-xs text-muted-foreground">{formData.tin.length}/10 digits</p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phoneNumber">Phone Number *</Label>
//                   <Input
//                     id="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={(e) => updateFormData("phoneNumber", e.target.value)}
//                     placeholder="+256..."
//                   />
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <Label htmlFor="homeAddress">Home Address *</Label>
//                   <Input
//                     id="homeAddress"
//                     value={formData.homeAddress}
//                     onChange={(e) => updateFormData("homeAddress", e.target.value)}
//                     placeholder="Street, City, Country"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => updateFormData("email", e.target.value)}
//                     placeholder="you@example.com"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Employment Status *</Label>
//                   <RadioGroup
//                     value={formData.employmentStatus}
//                     onValueChange={(v) => updateFormData("employmentStatus", v)}
//                   >
//                     {["employed", "self-employed", "retired", "student"].map((status) => (
//                       <div key={status} className="flex items-center space-x-2">
//                         <RadioGroupItem value={status} id={status} />
//                         <Label htmlFor={status} className="capitalize">{status.replace("-", " ")}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="occupation">Occupation *</Label>
//                   <Input
//                     id="occupation"
//                     value={formData.occupation}
//                     onChange={(e) => updateFormData("occupation", e.target.value)}
//                     placeholder="Your profession"
//                   />
//                 </div>
//               </div>

//               {/* Profile Photo */}
//               {/* <div className="flex flex-col items-center space-y-3 pt-4 border-t">
//                 <div className="relative">
//                   {formData.avatarUrl ? (
//                     <img
//                       src={formData.avatarUrl}
//                       alt="Profile"
//                       className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
//                     />
//                   ) : (
//                     <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                       <User className="w-12 h-12 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//               </div> */}
//             </div>
//           )}

//           {/* STEP 1 — BASIC INFORMATION (Company) */}
//           {currentStep === 1 && formData.entityType === "company" && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="companyName">Company Name *</Label>
//                   <Input
//                     id="companyName"
//                     value={formData.companyName}
//                     onChange={(e) => updateFormData("companyName", e.target.value)}
//                     placeholder="Registered company name"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="registrationNumber">Registration Number *</Label>
//                   <Input
//                     id="registrationNumber"
//                     value={formData.registrationNumber}
//                     onChange={(e) => updateFormData("registrationNumber", e.target.value)}
//                     placeholder="Company registration number"
//                   />
//                 </div>
                
//                 <div className="space-y-2 md:col-span-2">
//                   <Label htmlFor="companyAddress">Company Address *</Label>
//                   <Input
//                     id="companyAddress"
//                     value={formData.companyAddress}
//                     onChange={(e) => updateFormData("companyAddress", e.target.value)}
//                     placeholder="Registered business address"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="businessType">Business Type *</Label>
//                   <Input
//                     id="businessType"
//                     value={formData.businessType}
//                     onChange={(e) => updateFormData("businessType", e.target.value)}
//                     placeholder="e.g., LLC, Corporation"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="incorporationDate">Incorporation Date *</Label>
//                   <Input
//                     id="incorporationDate"
//                     type="date"
//                     value={formData.incorporationDate}
//                     onChange={(e) => updateFormData("incorporationDate", e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="border-t pt-6">
//                 <h4 className="text-lg font-semibold mb-4">Authorized Representative</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepName">Full Name *</Label>
//                     <Input
//                       id="authorizedRepName"
//                       value={formData.authorizedRepName}
//                       onChange={(e) => updateFormData("authorizedRepName", e.target.value)}
//                       placeholder="Representative's full name"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepPosition">Position *</Label>
//                     <Input
//                       id="authorizedRepPosition"
//                       value={formData.authorizedRepPosition}
//                       onChange={(e) => updateFormData("authorizedRepPosition", e.target.value)}
//                       placeholder="e.g., CEO, Director"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepEmail">Email *</Label>
//                     <Input
//                       id="authorizedRepEmail"
//                       type="email"
//                       value={formData.authorizedRepEmail}
//                       onChange={(e) => updateFormData("authorizedRepEmail", e.target.value)}
//                       placeholder="representative@company.com"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepPhone">Phone *</Label>
//                     <Input
//                       id="authorizedRepPhone"
//                       value={formData.authorizedRepPhone}
//                       onChange={(e) => updateFormData("authorizedRepPhone", e.target.value)}
//                       placeholder="+256..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 2 — INVESTMENT PROFILE */}
//           {currentStep === 2 && (
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>What is your primary investment goal? *</Label>
//                   <RadioGroup
//                     value={formData.primaryGoal}
//                     onValueChange={(v) => updateFormData("primaryGoal", v)}
//                   >
//                     {[
//                       { value: "growth", label: "Growth - Maximize returns" },
//                       { value: "income", label: "Income - Regular returns" },
//                       { value: "capital-preservation", label: "Capital Preservation - Protect principal" }
//                     ].map((goal) => (
//                       <div key={goal.value} className="flex items-center space-x-2">
//                         <RadioGroupItem value={goal.value} id={goal.value} />
//                         <Label htmlFor={goal.value}>{goal.label}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>How long do you plan to invest? *</Label>
//                   <RadioGroup
//                     value={formData.timeHorizon}
//                     onValueChange={(v) => updateFormData("timeHorizon", v)}
//                   >
//                     {[
//                       { value: "1-3-years", label: "1-3 years" },
//                       { value: "3-5-years", label: "3-5 years" },
//                       { value: "5-10-years", label: "5-10 years" },
//                       { value: "over-10-years", label: "Over 10 years" }
//                     ].map((horizon) => (
//                       <div key={horizon.value} className="flex items-center space-x-2">
//                         <RadioGroupItem value={horizon.value} id={horizon.value} />
//                         <Label htmlFor={horizon.value}>{horizon.label}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>What is your risk tolerance? *</Label>
//                   <RadioGroup
//                     value={formData.riskTolerance}
//                     onValueChange={(v) => updateFormData("riskTolerance", v)}
//                   >
//                     {[
//                       { value: "aggressive", label: "Aggressive - High risk, high return" },
//                       { value: "moderate-risk", label: "Moderate - Balanced approach" },
//                       { value: "conservative", label: "Conservative - Low risk" }
//                     ].map((risk) => (
//                       <div key={risk.value} className="flex items-center space-x-2">
//                         <RadioGroupItem value={risk.value} id={risk.value} />
//                         <Label htmlFor={risk.value}>{risk.label}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>What is your investment experience? *</Label>
//                   <RadioGroup
//                     value={formData.investmentExperience}
//                     onValueChange={(v) => updateFormData("investmentExperience", v)}
//                   >
//                     {[
//                       { value: "none", label: "None - First time investor" },
//                       { value: "limited", label: "Limited - Some experience" },
//                       { value: "moderate", label: "Moderate - Regular investor" },
//                       { value: "extensive", label: "Extensive - Experienced investor" }
//                     ].map((exp) => (
//                       <div key={exp.value} className="flex items-center space-x-2">
//                         <RadioGroupItem value={exp.value} id={exp.value} />
//                         <Label htmlFor={exp.value}>{exp.label}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 3 — COMPLIANCE */}
//           {currentStep === 3 && (
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Are you a Politically Exposed Person (PEP)? *</Label>
//                   <p className="text-sm text-muted-foreground">
//                     A PEP is someone who holds or has held a prominent public position or is closely related to such a person.
//                   </p>
//                   <RadioGroup
//                     value={formData.isPEP}
//                     onValueChange={(v) => updateFormData("isPEP", v)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="yes" id="pep-yes" />
//                       <Label htmlFor="pep-yes">Yes</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="no" id="pep-no" />
//                       <Label htmlFor="pep-no">No</Label>
//                     </div>
//                   </RadioGroup>
//                   {formData.isPEP === "yes" && (
//                     <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
//                       Your application will undergo enhanced due diligence review.
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4 hidden pt-4 border-t">
//                   <div className="space-y-2">
//                     <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
//                       <DialogTrigger asChild>
//                         <Button variant="outline" className="w-full justify-start">
//                           <Eye className="h-4 w-4 mr-2" />
//                           View Privacy Policy
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="max-w-2xl max-h-[90vh]">
//                         <DialogHeader>
//                           <DialogTitle>Privacy Policy</DialogTitle>
//                           <DialogDescription>How we handle your personal information</DialogDescription>
//                         </DialogHeader>
//                         <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
//                           <div className="space-y-4 text-sm">
//                             <h3 className="font-semibold">1. Information Collection</h3>
//                             <p>We collect personal information that you provide during registration...</p>
//                             <h3 className="font-semibold">2. Data Usage</h3>
//                             <p>Your information is used to provide investment services...</p>
//                             <h3 className="font-semibold">3. Data Protection</h3>
//                             <p>We implement industry-standard security measures...</p>
//                             <h3 className="font-semibold">4. Your Rights</h3>
//                             <p>You have the right to access, update, or delete your data...</p>
//                           </div>
//                         </ScrollArea>
//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                            defaultChecked={formData.consentToDataCollection}
//                             id="consent-in-modal"
//                             checked={formData.consentToDataCollection}
//                             onCheckedChange={(checked) => updateFormData("consentToDataCollection", checked as boolean)}
//                             className="checked"
//                           />
//                           <Label htmlFor="consent-in-modal" className="text-sm">
//                             I accept the Privacy Policy
//                           </Label>
//                         </div>
//                       </DialogContent>
//                     </Dialog>
//                   </div>

//                   <div className="space-y-2">
//                     <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
//                       <DialogTrigger asChild>
//                         <Button variant="outline" className="w-full justify-start">
//                           <Eye className="h-4 w-4 mr-2" />
//                           View Terms & Conditions
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="max-w-2xl max-h-[90vh]">
//                         <DialogHeader>
//                           <DialogTitle>Terms & Conditions</DialogTitle>
//                           <DialogDescription>Terms of service for your investment account</DialogDescription>
//                         </DialogHeader>
//                         <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
//                           <div className="space-y-4 text-sm">
//                             <h3 className="font-semibold">1. Account Terms</h3>
//                             <p>By opening an account, you agree to comply with our policies...</p>
//                             <h3 className="font-semibold">2. Investment Risks</h3>
//                             <p>All investments carry risk. Past performance does not guarantee future results...</p>
//                             <h3 className="font-semibold">3. Fees and Charges</h3>
//                             <p>Management fees and transaction costs may apply...</p>
//                             <h3 className="font-semibold">4. Account Responsibilities</h3>
//                             <p>You are responsible for maintaining account security...</p>
//                           </div>
//                         </ScrollArea>
//                         <div className="mt-2 flex items-center space-x-2">
//                           <Checkbox
//                            defaultChecked={formData.agreeToTerms}
//                             id="terms-in-modal"
//                             className="checked"
//                             checked={formData.agreeToTerms}
//                             onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
//                           />
//                           <Label htmlFor="terms-in-modal" className="text-sm">
//                             I agree to the Terms & Conditions
//                           </Label>
//                         </div>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 4 — FINANCIAL INFORMATION */}
//           {currentStep === 4 && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="sourceOfWealth">Source of Wealth *</Label>
//                   <Textarea
//                     id="sourceOfWealth"
//                     value={formData.sourceOfWealth}
//                     onChange={(e) => updateFormData("sourceOfWealth", e.target.value)}
//                     placeholder="Describe the primary source of your wealth (e.g., salary, business, inheritance)"
//                     rows={3}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="employmentIncome">Annual Employment Income in USD*</Label>
//                   <Input
//                     id="employmentIncome"
//                     value={formData.employmentIncome}
//                     onChange={(e) => updateFormData("employmentIncome", e.target.value)}
//                     placeholder="Enter your annual income"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="expectedInvestment">Expected Investment Amount IN USD *</Label>
//                   <Input
//                     id="expectedInvestment"
//                     value={formData.expectedInvestment}
//                     onChange={(e) => updateFormData("expectedInvestment", e.target.value)}
//                     placeholder="Initial investment amount"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="businessOwnership">Business Ownership/Investments (Optional)</Label>
//                   <Textarea
//                     id="businessOwnership"
//                     value={formData.businessOwnership}
//                     onChange={(e) => updateFormData("businessOwnership", e.target.value)}
//                     placeholder="Describe any business ownership or other investments"
//                     rows={3}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="sanctionsOrLegal">
//                     Have you ever been subject to financial sanctions or legal proceedings? *
//                   </Label>
//                   <RadioGroup
//                     value={formData.sanctionsOrLegal}
//                     onValueChange={(v) => updateFormData("sanctionsOrLegal", v)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="yes" id="sanctions-yes" />
//                       <Label htmlFor="sanctions-yes">Yes</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="no" id="sanctions-no" />
//                       <Label htmlFor="sanctions-no">No</Label>
//                     </div>
//                   </RadioGroup>
//                   {formData.sanctionsOrLegal === "yes" && (
//                     <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
//                       Unfortunately, we cannot process your application due to sanctions/legal history.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 5 — DOCUMENT UPLOAD */}
//           {currentStep === 5 && (
//             <div className="space-y-6">
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                 <h4 className="font-semibold text-blue-900 mb-2">Required Documents</h4>
//                 <p className="text-sm text-blue-800">
//                   Please upload clear, legible copies of the following documents. All required documents must be uploaded to proceed.
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-6">
//                 <DocumentUploadCard
//                   label="National ID or Passport"
//                   required
//                   value={formData.nationalIdUrl}
//                   field="nationalIdUrl"
//                   endpoint="idUrl"
//                 />

//                 <DocumentUploadCard
//                   label="Bank Statement (Last 3 months)"
//                   required
//                   value={formData.bankStatementUrl}
//                   field="bankStatementUrl"
//                   endpoint="statementUrl"
//                 />

//                 <div className="border-t pt-6 mt-6">

//                   <div className="grid grid-cols-1 gap-6">
//                     <DocumentUploadCard
//                       label="Passport Photo"
//                       value={formData.passportPhotoUrl}
//                       field="passportPhotoUrl"
//                       endpoint="passportUrl"
//                     />

//                     <DocumentUploadCard
//                       label="TIN Certificate"
//                       value={formData.tinCertificateUrl}
//                       field="tinCertificateUrl"
//                       endpoint="tinUrl"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 6 — REVIEW */}
//           {currentStep === 6 && (
//             <div className="space-y-8">
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                 <h4 className="font-semibold text-green-900 mb-2">Almost Done!</h4>
//                 <p className="text-sm text-green-800">
//                   Please review your information before submitting. You can edit any section by clicking the Edit button.
//                 </p>
//               </div>

//               {/* Account Type */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Account Type</h3>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditStep(0)}>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//                 <ReviewField
//                   label="Registration Type"
//                   value={formData.entityType === "individual" ? "Individual Account" : "Company Account"}
//                 />
//               </div>

//               {/* Basic Information */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Basic Information</h3>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditStep(1)}>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {formData.entityType === "individual" ? (
//                     <>
//                       <ReviewField label="Full Name" value={formData.fullName} />
//                       <ReviewField label="Date of Birth" value={formData.dateOfBirth} />
//                       <ReviewField label="TIN" value={formData.tin} />
//                       <ReviewField label="Phone" value={formData.phoneNumber} />
//                       <ReviewField label="Email" value={formData.email} />
//                       <ReviewField label="Address" value={formData.homeAddress} />
//                       <ReviewField label="Employment" value={formData.employmentStatus} />
//                       <ReviewField label="Occupation" value={formData.occupation} />
//                     </>
//                   ) : (
//                     <>
//                       <ReviewField label="Company Name" value={formData.companyName} />
//                       <ReviewField label="Registration #" value={formData.registrationNumber} />
//                       <ReviewField label="Business Type" value={formData.businessType} />
//                       <ReviewField label="Incorporation Date" value={formData.incorporationDate} />
//                       <ReviewField label="Company Address" value={formData.companyAddress} />
//                       <ReviewField label="Representative" value={formData.authorizedRepName} />
//                       <ReviewField label="Rep. Position" value={formData.authorizedRepPosition} />
//                       <ReviewField label="Rep. Email" value={formData.authorizedRepEmail} />
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Investment Profile */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Investment Profile</h3>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditStep(2)}>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField label="Investment Goal" value={formData.primaryGoal} />
//                   <ReviewField label="Time Horizon" value={formData.timeHorizon} />
//                   <ReviewField label="Risk Tolerance" value={formData.riskTolerance} />
//                   <ReviewField label="Experience Level" value={formData.investmentExperience} />
//                 </div>
//               </div>

//               {/* Compliance */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Compliance</h3>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditStep(3)}>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField label="PEP Status" value={formData.isPEP} />
//                   <ReviewField label="Privacy Policy" value={formData.consentToDataCollection} />
//                   <ReviewField label="Terms Accepted" value={formData.agreeToTerms} />
//                 </div>
//               </div>

//               {/* Financial Information */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Financial Information</h3>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditStep(4)}>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField label="Source of Wealth" value={formData.sourceOfWealth} />
//                   <ReviewField label="Annual Income" value={formData.employmentIncome} />
//                   <ReviewField label="Expected Investment" value={formData.expectedInvestment} />
//                   <ReviewField label="Sanctions/Legal" value={formData.sanctionsOrLegal} />
//                 </div>
//               </div>

//               {/* Documents */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Uploaded Documents</h3>
//                   <Button variant="ghost" size="sm" onClick={() => handleEditStep(5)}>
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center gap-2">
//                     {formData.nationalIdUrl ? (
//                       <>
//                         <CheckCircle2 className="h-5 w-5 text-green-500" />
//                         <span className="text-sm">National ID/Passport</span>
//                       </>
//                     ) : (
//                       <>
//                         <X className="h-5 w-5 text-red-500" />
//                         <span className="text-sm">National ID/Passport (Missing)</span>
//                       </>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {formData.bankStatementUrl ? (
//                       <>
//                         <CheckCircle2 className="h-5 w-5 text-green-500" />
//                         <span className="text-sm">Bank Statement</span>
//                       </>
//                     ) : (
//                       <>
//                         <X className="h-5 w-5 text-red-500" />
//                         <span className="text-sm">Bank Statement (Missing)</span>
//                       </>
//                     )}
//                   </div>
//                   {formData.passportPhotoUrl && (
//                     <div className="flex items-center gap-2">
//                       <CheckCircle2 className="h-5 w-5 text-green-500" />
//                       <span className="text-sm">Passport Photo</span>
//                     </div>
//                   )}
//                   {formData.tinCertificateUrl && (
//                     <div className="flex items-center gap-2">
//                       <CheckCircle2 className="h-5 w-5 text-green-500" />
//                       <span className="text-sm">TIN Certificate</span>
//                     </div>
//                   )}
//                 </div>
//               </div>


//               {formData.sanctionsOrLegal === "yes" && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                   <p className="text-sm text-red-800 font-semibold">
//                     ⚠️ Your application cannot be processed due to sanctions/legal history.
//                   </p>
//                 </div>
//               )}

//               {formData.isPEP === "yes" && (
//                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//                   <p className="text-sm text-yellow-800">
//                     ℹ️ Your application will undergo enhanced due diligence as a PEP.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Navigation */}
//       <div className="flex justify-between">
//         <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || loading}>
//           Previous
//         </Button>

//         {currentStep < steps.length - 1 ? (
//           <Button onClick={handleNext} disabled={!isStepValid(currentStep) || tinValidating}>
//             {tinValidating ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Validating...
//               </span>
//             ) : (
//               "Next"
//             )}
//           </Button>
//         ) : (
//           <Button
//             onClick={handleSubmit}
//             disabled={loading || !isStepValid(6) || formData.sanctionsOrLegal === "yes" || !userId}
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Submitting...
//               </span>
//             ) : (
//               "Submit Application"
//             )}
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }






























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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle, 
  Circle, 
  Loader2, 
  User, 
  Eye, 
  Edit,
  FileText,
  Upload,
  X,
  CheckCircle2
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/lib/uploadthing"

import { submitOnboarding } from "@/actions/onboarding"

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

type FormData = {
  entityType: string
  fullName: string
  dateOfBirth: string
  hasBusiness: "yes" | "no" | "" | null
  tin: string
  homeAddress: string
  email: string
  phoneNumber: string
  employmentStatus: string
  occupation: string
  avatarUrl: string

  // Company fields
  companyName: string
  registrationNumber: string
  companyAddress: string
  businessType: string
  incorporationDate: string
  authorizedRepName: string
  authorizedRepEmail: string
  authorizedRepPhone: string
  authorizedRepPosition: string

  // Investment objectives
  primaryGoal: string
  timeHorizon: string
  riskTolerance: string
  investmentExperience: string

  // Regulatory
  isPEP: string
  consentToDataCollection: boolean
  agreeToTerms: boolean

  // EDD
  sourceOfWealth: string
  businessOwnership: string
  employmentIncome: string
  expectedInvestment: string
  businessName: string
  businessAddress: string
  establishmentDate: string
  ownershipPercentage: string
  familyMemberDetails: string
  publicPosition: string
  relationshipToCountry: string
  sanctionsOrLegal: string

  // Required Documents
  nationalIdUrl: string
  bankStatementUrl: string
  // Optional Documents
  passportPhotoUrl: string
  tinCertificateUrl: string
}

const initialFormData: FormData = {
  entityType: "",
  fullName: "",
  dateOfBirth: "",
  hasBusiness: "",
  tin: "",
  homeAddress: "",
  email: "",
  phoneNumber: "",
  employmentStatus: "",
  occupation: "",
  avatarUrl: "",

  companyName: "",
  registrationNumber: "",
  companyAddress: "",
  businessType: "",
  incorporationDate: "",
  authorizedRepName: "",
  authorizedRepEmail: "",
  authorizedRepPhone: "",
  authorizedRepPosition: "",

  primaryGoal: "",
  timeHorizon: "",
  riskTolerance: "",
  investmentExperience: "",

  isPEP: "",
  consentToDataCollection: true,
  agreeToTerms: true,

  sourceOfWealth: "",
  businessOwnership: "",
  employmentIncome: "",
  expectedInvestment: "",
  businessName: "",
  businessAddress: "",
  establishmentDate: "",
  ownershipPercentage: "",
  familyMemberDetails: "",
  publicPosition: "",
  relationshipToCountry: "",
  sanctionsOrLegal: "",

  nationalIdUrl: "",
  bankStatementUrl: "",
  passportPhotoUrl: "",
  tinCertificateUrl: "",
}

export default function OnboardingForm({ user }: Props) {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [initDone, setInitDone] = useState(false)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [tinValidating, setTinValidating] = useState(false)
  const [agreementConfirmed, setAgreementConfirmed] = useState(false)

  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null
      if (raw) {
        const parsed = JSON.parse(raw) as { id?: string; email?: string }
        if (parsed?.id) setUserId(parsed.id)
        setFormData((p) => ({
          ...p,
          email: parsed?.email ?? p.email,
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

  const steps = useMemo(
    () => [
      { 
        id: 0, 
        title: "Account Type", 
        description: "Select your account type" 
      },
      {
        id: 1,
        title: "Basic Information",
        description: formData.entityType === "company" 
          ? "Your company details" 
          : "Your personal details",
      },
      { 
        id: 2, 
        title: "Investment Profile", 
        description: "Your investment goals" 
      },
      { 
        id: 3, 
        title: "Compliance", 
        description: "Regulatory requirements" 
      },
      { 
        id: 4, 
        title: "Financial Information", 
        description: "Source of funds" 
      },
      { 
        id: 5, 
        title: "Document Upload", 
        description: "Required documents" 
      },
      { 
        id: 6, 
        title: "Review & Agreement", 
        description: "Confirm your details and agreement" 
      },
    ],
    [formData.entityType]
  )

  const updateFormData = (field: keyof FormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value as any }))

  const validateTINClient = (tin: string) => /^[0-9]{10}$/.test(tin)

  const validateTIN = async (tin: string) => {
    if (!validateTINClient(tin)) {
      toast.error("TIN must be exactly 10 digits.")
      return false
    }
    return true
  }

  // Validation functions
  const validateStep0 = () => formData.entityType !== ""
  
  const validateStep1 = () => {
    if (formData.entityType === "individual") {
      return (
        formData.fullName &&
        formData.dateOfBirth &&
        validateTINClient(formData.tin) &&
        formData.homeAddress &&
        formData.email &&
        formData.phoneNumber &&
        formData.employmentStatus &&
        formData.occupation
      )
    }
    if (formData.entityType === "company") {
      return (
        formData.companyName &&
        formData.registrationNumber &&
        formData.companyAddress &&
        formData.businessType &&
        formData.incorporationDate &&
        formData.authorizedRepName &&
        formData.authorizedRepEmail &&
        formData.authorizedRepPhone &&
        formData.authorizedRepPosition
      )
    }
    return false
  }
  
  const validateStep2 = () =>
    formData.primaryGoal && 
    formData.timeHorizon && 
    formData.riskTolerance && 
    formData.investmentExperience
  
  const validateStep3 = () =>
    formData.isPEP && 
    formData.consentToDataCollection && 
    formData.agreeToTerms
  
  const validateStep4 = () =>
    formData.sourceOfWealth && 
    formData.employmentIncome && 
    formData.expectedInvestment
  
  const validateStep5 = () =>
    formData.nationalIdUrl && 
    formData.bankStatementUrl
  
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

    if (currentStep === 1 && formData.entityType === "individual" && formData.tin) {
      const ok = await validateTIN(formData.tin)
      if (!ok) return
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleSubmit = async () => {
    if (!isStepValid(6)) {
      toast.error("Please complete all required steps and confirm the agreement")
      return
    }
    
    if (formData.sanctionsOrLegal === "yes") {
      toast.error("Unfortunately, you cannot open an account due to sanctions/legal history.")
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
        entityType: formData.entityType || "individual",
      }
      
      const res = await submitOnboarding(payload, userId)
      
      if (!res.success) {
        toast.error(res.error || "Submission failed.")
        return
      }

      localStorage.removeItem("onboardingUser")
      
      toast.success("Application submitted successfully!")
      
      if (formData.isPEP === "yes") {
        toast.info("Your application will undergo enhanced review as a PEP.")
      }
      
      router.push("/confirmation")
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const progress = ((completedSteps.length + 1) / steps.length) * 100

  const DocumentUploadCard = ({ 
    label, 
    required = false,
    value,
    field,
    endpoint = "documentUploader"
  }: { 
    label: string
    required?: boolean
    value: string
    field: keyof FormData
    endpoint?: string
  }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {value && <CheckCircle2 className="h-5 w-5 text-green-500" />}
      </div>
      
      {value ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 flex-1">Document uploaded</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFormData(field, "")}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
{/*           
          <a>
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          
            <Eye className="h-3 w-3" />
            View document
          </a> */}
        </div>
      ) : (
        <div className="[&_.ut-button]:bg-primary [&_.ut-button]:text-primary-foreground [&_.ut-allowed-content]:text-foreground [&_.ut-label]:text-lg [&_.ut-label]:font-semibold [&_.ut-label]:text-foreground">
          <UploadDropzone
            endpoint={endpoint as any}
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.url
              if (url) {
                updateFormData(field, url)
                toast.success(`${label} uploaded successfully!`)
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`)
            }}
            className="border-dashed"
          />
        </div>
      )}
    </div>
  )

  const ReviewField = ({ label, value }: { label: string; value: string | boolean }) => (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"}</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {initDone && !userId && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Session not found. Please complete email verification first.
        </div>
      )}

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Account Registration</h1>
        <p className="text-muted-foreground">Complete all steps to open your investment account</p>
      </div>
      
      <Progress value={progress} className="w-full" />

      <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center min-w-fit">
            <div className="flex items-center gap-2">
              {completedSteps.includes(step.id) ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <Circle
                  className={`w-6 h-6 flex-shrink-0 ${
                    currentStep === step.id ? "text-blue-500" : "text-gray-300"
                  }`}
                />
              )}
            </div>
            <span className={`text-xs mt-1 text-center ${
              currentStep === step.id ? "font-semibold" : "text-muted-foreground"
            }`}>
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
          {/* STEP 0 — ACCOUNT TYPE */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Choose your account type</h3>
                <RadioGroup
                  value={formData.entityType}
                  onValueChange={(v) => updateFormData("entityType", v)}
                  className="grid gap-4"
                >
                  <Label
                    htmlFor="individual"
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.entityType === "individual" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="individual" id="individual" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">Individual Account</div>
                      <p className="text-sm text-muted-foreground">
                        For personal investments
                      </p>
                    </div>
                  </Label>
                  
                  <Label
                    htmlFor="company"
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.entityType === "company" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="company" id="company" className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">Company Account</div>
                      <p className="text-sm text-muted-foreground">
                        For corporate investments
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* STEP 1 — BASIC INFORMATION (Individual) */}
          {currentStep === 1 && formData.entityType === "individual" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="First name and last name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tin">Tax ID Number (TIN) *</Label>
                  <div className="relative">
                    <Input
                      id="tin"
                      type="text"
                      inputMode="numeric"
                      value={formData.tin}
                      onChange={(e) => updateFormData("tin", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit TIN"
                    />
                    {tinValidating && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{formData.tin.length}/10 digits</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                    placeholder="+256..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="homeAddress">Home Address *</Label>
                  <Input
                    id="homeAddress"
                    value={formData.homeAddress}
                    onChange={(e) => updateFormData("homeAddress", e.target.value)}
                    placeholder="Street, City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Employment Status *</Label>
                  <RadioGroup
                    value={formData.employmentStatus}
                    onValueChange={(v) => updateFormData("employmentStatus", v)}
                  >
                    {["employed", "self-employed", "retired", "student"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem value={status} id={status} />
                        <Label htmlFor={status} className="capitalize">{status.replace("-", " ")}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => updateFormData("occupation", e.target.value)}
                    placeholder="Your profession"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — BASIC INFORMATION (Company) */}
          {currentStep === 1 && formData.entityType === "company" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    placeholder="Registered company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => updateFormData("registrationNumber", e.target.value)}
                    placeholder="Company registration number"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyAddress">Company Address *</Label>
                  <Input
                    id="companyAddress"
                    value={formData.companyAddress}
                    onChange={(e) => updateFormData("companyAddress", e.target.value)}
                    placeholder="Registered business address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Input
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => updateFormData("businessType", e.target.value)}
                    placeholder="e.g., LLC, Corporation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incorporationDate">Incorporation Date *</Label>
                  <Input
                    id="incorporationDate"
                    type="date"
                    value={formData.incorporationDate}
                    onChange={(e) => updateFormData("incorporationDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Authorized Representative</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepName">Full Name *</Label>
                    <Input
                      id="authorizedRepName"
                      value={formData.authorizedRepName}
                      onChange={(e) => updateFormData("authorizedRepName", e.target.value)}
                      placeholder="Representative's full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepPosition">Position *</Label>
                    <Input
                      id="authorizedRepPosition"
                      value={formData.authorizedRepPosition}
                      onChange={(e) => updateFormData("authorizedRepPosition", e.target.value)}
                      placeholder="e.g., CEO, Director"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepEmail">Email *</Label>
                    <Input
                      id="authorizedRepEmail"
                      type="email"
                      value={formData.authorizedRepEmail}
                      onChange={(e) => updateFormData("authorizedRepEmail", e.target.value)}
                      placeholder="representative@company.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepPhone">Phone *</Label>
                    <Input
                      id="authorizedRepPhone"
                      value={formData.authorizedRepPhone}
                      onChange={(e) => updateFormData("authorizedRepPhone", e.target.value)}
                      placeholder="+256..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — INVESTMENT PROFILE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What is your primary investment goal? *</Label>
                  <RadioGroup
                    value={formData.primaryGoal}
                    onValueChange={(v) => updateFormData("primaryGoal", v)}
                  >
                    {[
                      { value: "growth", label: "Growth - Maximize returns" },
                      { value: "income", label: "Income - Regular returns" },
                      { value: "capital-preservation", label: "Capital Preservation - Protect principal" }
                    ].map((goal) => (
                      <div key={goal.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={goal.value} id={goal.value} />
                        <Label htmlFor={goal.value}>{goal.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>How long do you plan to invest? *</Label>
                  <RadioGroup
                    value={formData.timeHorizon}
                    onValueChange={(v) => updateFormData("timeHorizon", v)}
                  >
                    {[
                      { value: "1-3-years", label: "1-3 years" },
                      { value: "3-5-years", label: "3-5 years" },
                      { value: "5-10-years", label: "5-10 years" },
                      { value: "over-10-years", label: "Over 10 years" }
                    ].map((horizon) => (
                      <div key={horizon.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={horizon.value} id={horizon.value} />
                        <Label htmlFor={horizon.value}>{horizon.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>What is your risk tolerance? *</Label>
                  <RadioGroup
                    value={formData.riskTolerance}
                    onValueChange={(v) => updateFormData("riskTolerance", v)}
                  >
                    {[
                      { value: "aggressive", label: "Aggressive - High risk, high return" },
                      { value: "moderate-risk", label: "Moderate - Balanced approach" },
                      { value: "conservative", label: "Conservative - Low risk" }
                    ].map((risk) => (
                      <div key={risk.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={risk.value} id={risk.value} />
                        <Label htmlFor={risk.value}>{risk.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>What is your investment experience? *</Label>
                  <RadioGroup
                    value={formData.investmentExperience}
                    onValueChange={(v) => updateFormData("investmentExperience", v)}
                  >
                    {[
                      { value: "none", label: "None - First time investor" },
                      { value: "limited", label: "Limited - Some experience" },
                      { value: "moderate", label: "Moderate - Regular investor" },
                      { value: "extensive", label: "Extensive - Experienced investor" }
                    ].map((exp) => (
                      <div key={exp.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={exp.value} id={exp.value} />
                        <Label htmlFor={exp.value}>{exp.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — COMPLIANCE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Are you a Politically Exposed Person (PEP)? *</Label>
                  <p className="text-sm text-muted-foreground">
                    A PEP is someone who holds or has held a prominent public position or is closely related to such a person.
                  </p>
                  <RadioGroup
                    value={formData.isPEP}
                    onValueChange={(v) => updateFormData("isPEP", v)}
                  >
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
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                      Your application will undergo enhanced due diligence review.
                    </div>
                  )}
                </div>

                <div className="space-y-4 hidden pt-4 border-t">
                  <div className="space-y-2">
                    <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          View Privacy Policy
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Privacy Policy</DialogTitle>
                          <DialogDescription>How we handle your personal information</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                          <div className="space-y-4 text-sm">
                            <h3 className="font-semibold">1. Information Collection</h3>
                            <p>We collect personal information that you provide during registration...</p>
                            <h3 className="font-semibold">2. Data Usage</h3>
                            <p>Your information is used to provide investment services...</p>
                            <h3 className="font-semibold">3. Data Protection</h3>
                            <p>We implement industry-standard security measures...</p>
                            <h3 className="font-semibold">4. Your Rights</h3>
                            <p>You have the right to access, update, or delete your data...</p>
                          </div>
                        </ScrollArea>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            defaultChecked={formData.consentToDataCollection}
                            id="consent-in-modal"
                            checked={formData.consentToDataCollection}
                            onCheckedChange={(checked) => updateFormData("consentToDataCollection", checked as boolean)}
                            className="checked"
                          />
                          <Label htmlFor="consent-in-modal" className="text-sm">
                            I accept the Privacy Policy
                          </Label>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          View Terms & Conditions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Terms & Conditions</DialogTitle>
                          <DialogDescription>Terms of service for your investment account</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                          <div className="space-y-4 text-sm">
                            <h3 className="font-semibold">1. Account Terms</h3>
                            <p>By opening an account, you agree to comply with our policies...</p>
                            <h3 className="font-semibold">2. Investment Risks</h3>
                            <p>All investments carry risk. Past performance does not guarantee future results...</p>
                            <h3 className="font-semibold">3. Fees and Charges</h3>
                            <p>Management fees and transaction costs may apply...</p>
                            <h3 className="font-semibold">4. Account Responsibilities</h3>
                            <p>You are responsible for maintaining account security...</p>
                          </div>
                        </ScrollArea>
                        <div className="mt-2 flex items-center space-x-2">
                          <Checkbox
                            defaultChecked={formData.agreeToTerms}
                            id="terms-in-modal"
                            className="checked"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                          />
                          <Label htmlFor="terms-in-modal" className="text-sm">
                            I agree to the Terms & Conditions
                          </Label>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — FINANCIAL INFORMATION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceOfWealth">Source of Wealth *</Label>
                  <Textarea
                    id="sourceOfWealth"
                    value={formData.sourceOfWealth}
                    onChange={(e) => updateFormData("sourceOfWealth", e.target.value)}
                    placeholder="Describe the primary source of your wealth (e.g., salary, business, inheritance)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentIncome">Annual Employment Income in USD*</Label>
                  <Input
                    id="employmentIncome"
                    value={formData.employmentIncome}
                    onChange={(e) => updateFormData("employmentIncome", e.target.value)}
                    placeholder="Enter your annual income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedInvestment">Expected Investment Amount IN USD *</Label>
                  <Input
                    id="expectedInvestment"
                    value={formData.expectedInvestment}
                    onChange={(e) => updateFormData("expectedInvestment", e.target.value)}
                    placeholder="Initial investment amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessOwnership">Business Ownership/Investments (Optional)</Label>
                  <Textarea
                    id="businessOwnership"
                    value={formData.businessOwnership}
                    onChange={(e) => updateFormData("businessOwnership", e.target.value)}
                    placeholder="Describe any business ownership or other investments"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sanctionsOrLegal">
                    Have you ever been subject to financial sanctions or legal proceedings? *
                  </Label>
                  <RadioGroup
                    value={formData.sanctionsOrLegal}
                    onValueChange={(v) => updateFormData("sanctionsOrLegal", v)}
                  >
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
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                      Unfortunately, we cannot process your application due to sanctions/legal history.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — DOCUMENT UPLOAD */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Required Documents</h4>
                <p className="text-sm text-blue-800">
                  Please upload clear, legible copies of the following documents. All required documents must be uploaded to proceed.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <DocumentUploadCard
                  label="National ID or Passport"
                  required
                  value={formData.nationalIdUrl}
                  field="nationalIdUrl"
                  endpoint="idUrl"
                />

                <DocumentUploadCard
                  label="Bank Statement (Last 3 months)"
                  required
                  value={formData.bankStatementUrl}
                  field="bankStatementUrl"
                  endpoint="statementUrl"
                />

                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <DocumentUploadCard
                      label="Passport Photo"
                      value={formData.passportPhotoUrl}
                      field="passportPhotoUrl"
                      endpoint="passportUrl"
                    />

                    <DocumentUploadCard
                      label="TIN Certificate"
                      value={formData.tinCertificateUrl}
                      field="tinCertificateUrl"
                      endpoint="tinUrl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 — REVIEW & AGREEMENT */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Final Step!</h4>
                <p className="text-sm text-green-800">
                  Please read the Investment Management Agreement below and confirm your acceptance before submitting.
                </p>
              </div>

              {/* PDF Viewer */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Investment Management Agreement
                  </h3>
                </div>
                <div className="bg-white">
                  <iframe
                    src="/GoldKach UG Investment Management Agreement - New Version.pdf"
                    className="w-full h-[600px]"
                    title="Investment Management Agreement"
                  />
                </div>
              </div>

              {/* Agreement Confirmation */}
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreement-confirm"
                    checked={agreementConfirmed}
                    onCheckedChange={(checked) => setAgreementConfirmed(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="agreement-confirm" className="font-medium cursor-pointer">
                      I have read and agree to the Investment Management Agreement *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      By checking this box, you confirm that you have read, understood, and agree to all terms and 
                      conditions outlined in the Investment Management Agreement above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warnings */}
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
          <Button onClick={handleNext} disabled={!isStepValid(currentStep) || tinValidating}>
            {tinValidating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </span>
            ) : (
              "Next"
            )}
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