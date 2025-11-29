

// // // components/onboarding/on-boarding-form.tsx
// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { toast } from "sonner";

// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Progress } from "@/components/ui/progress";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { CheckCircle, Circle, Loader2, User, Eye, UserCheck } from "lucide-react";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // import { Textarea } from "@/components/ui/textarea";
// // import { UploadDropzone } from "@/lib/uploadthing";

// // // ✅ your server action to persist onboarding
// // import { submitOnboarding } from "@/actions/onboarding";
// // // (Optional) If you later add a server TIN check:
// // // import { validateTin } from "@/actions/onboarding";

// // type Props = {
// //   user?: {
// //     id: string;
// //     email: string;
// //     emailVerified: boolean;
// //     firstName?: string;
// //     lastName?: string;
// //     phone?: string;
// //   } | null;
// // };

// // type FormData = {
// //   // Entity selection
// //   entityType: string; // "individual" | "company"

// //   // Individual
// //   fullName: string;
// //   dateOfBirth: string;
// //   hasBusiness: "yes" | "no" | "" | null;
// //   tin: string;
// //   homeAddress: string;
// //   email: string;
// //   phoneNumber: string;
// //   employmentStatus: string;
// //   occupation: string;
// //   avatarUrl: string;
// //   idUrl: string;

// //   // Company
// //   companyName: string;
// //   registrationNumber: string;
// //   companyAddress: string;
// //   businessType: string;
// //   incorporationDate: string;
// //   authorizedRepName: string;
// //   authorizedRepEmail: string;
// //   authorizedRepPhone: string;
// //   authorizedRepPosition: string;

// //   // Investment objectives
// //   primaryGoal: string;
// //   timeHorizon: string;
// //   riskTolerance: string;
// //   investmentExperience: string;

// //   // Regulatory
// //   isPEP: string;
// //   consentToDataCollection: boolean;
// //   agreeToTerms: boolean;

// //   // EDD
// //   sourceOfWealth: string;
// //   businessOwnership: string;
// //   employmentIncome: string;
// //   expectedInvestment: string;
// //   businessName: string;
// //   businessAddress: string;
// //   establishmentDate: string;
// //   ownershipPercentage: string;
// //   familyMemberDetails: string;
// //   publicPosition: string;
// //   relationshipToCountry: string;
// //   sanctionsOrLegal: string;
// // };

// // const initialFormData: FormData = {
// //   entityType: "",
// //   fullName: "",
// //   dateOfBirth: "",
// //   hasBusiness: "",
// //   tin: "",
// //   homeAddress: "",
// //   email: "",
// //   phoneNumber: "",
// //   employmentStatus: "",
// //   occupation: "",
// //   avatarUrl: "",
// //   idUrl: "",

// //   companyName: "",
// //   registrationNumber: "",
// //   companyAddress: "",
// //   businessType: "",
// //   incorporationDate: "",
// //   authorizedRepName: "",
// //   authorizedRepEmail: "",
// //   authorizedRepPhone: "",
// //   authorizedRepPosition: "",

// //   primaryGoal: "",
// //   timeHorizon: "",
// //   riskTolerance: "",
// //   investmentExperience: "",

// //   isPEP: "",
// //   consentToDataCollection: false,
// //   agreeToTerms: false,

// //   sourceOfWealth: "",
// //   businessOwnership: "",
// //   employmentIncome: "",
// //   expectedInvestment: "",
// //   businessName: "",
// //   businessAddress: "",
// //   establishmentDate: "",
// //   ownershipPercentage: "",
// //   familyMemberDetails: "",
// //   publicPosition: "",
// //   relationshipToCountry: "",
// //   sanctionsOrLegal: "",
// // };

// // export default function OnboardingForm({ user }: Props) {
// //   const router = useRouter();

// //   const [userId, setUserId] = useState<string | null>(null);
// //   const [initDone, setInitDone] = useState(false);

// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [formData, setFormData] = useState<FormData>(initialFormData);
// //   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [tinValidating, setTinValidating] = useState(false);

// //   // Dialogs
// //   const [termsOpen, setTermsOpen] = useState(false);
// //   const [privacyOpen, setPrivacyOpen] = useState(false);

// //   // Prefill from localStorage or fallback to optional prop
// //   useEffect(() => {
// //     try {
// //       const raw = typeof window !== "undefined" ? localStorage.getItem("onboardingUser") : null;
// //       if (raw) {
// //         const parsed = JSON.parse(raw) as { id?: string; email?: string };
// //         if (parsed?.id) setUserId(parsed.id);
// //         setFormData((p) => ({
// //           ...p,
// //           email: parsed?.email ?? p.email,
// //         }));
// //       } else if (user?.id) {
// //         setUserId(user.id);
// //         setFormData((p) => ({
// //           ...p,
// //           email: user.email ?? p.email,
// //           fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
// //           phoneNumber: user.phone ?? p.phoneNumber,
// //         }));
// //       }
// //     } catch {
// //       // ignore
// //     } finally {
// //       setInitDone(true);
// //     }
// //   }, [user]);

// //   const steps = useMemo(
// //     () => [
// //       { id: 0, title: "Entity Type", description: "Choose registration type" },
// //       {
// //         id: 1,
// //         title: formData.entityType === "company" ? "Company Details" : "Personal Details",
// //         description:
// //           formData.entityType === "company"
// //             ? "Information about your company"
// //             : "Basic information about you",
// //       },
// //       { id: 2, title: "Investment Objectives", description: "Your investment goals and preferences" },
// //       { id: 3, title: "Regulatory Information", description: "Compliance and regulatory requirements" },
// //       { id: 4, title: "Enhanced Due Diligence", description: "Additional verification information" },
// //     ],
// //     [formData.entityType]
// //   );

// //   const updateFormData = (field: keyof FormData, value: string | boolean) =>
// //     setFormData((prev) => ({ ...prev, [field]: value as any }));

// //   // TIN validators
// //   const validateTINClient = (tin: string) => /^[0-9]{10}$/.test(tin);

// //   const validateTIN = async (tin: string) => {
// //     // client check only (add server check later if needed)
// //     if (!validateTINClient(tin)) {
// //       toast.error("TIN must be exactly 10 digits.");
// //       return false;
// //     }

// //     // Example server-side uniqueness check if you add it:
// //     /*
// //     setTinValidating(true);
// //     try {
// //       const { isUnique } = await validateTin(tin);
// //       if (!isUnique) {
// //         toast.error("TIN already exists. Use a different TIN.");
// //         return false;
// //       }
// //     } finally {
// //       setTinValidating(false);
// //     }
// //     */
// //     return true;
// //   };

// //   // Per-step validations
// //   const validateStep0 = () => formData.entityType !== "";
// //   const validateStep1 = () => {
// //     if (formData.entityType === "individual") {
// //       return (
// //         formData.fullName &&
// //         formData.dateOfBirth &&
// //         validateTINClient(formData.tin) &&
// //         formData.homeAddress &&
// //         formData.email &&
// //         formData.phoneNumber &&
// //         formData.employmentStatus &&
// //         formData.occupation
// //       );
// //     }
// //     if (formData.entityType === "company") {
// //       return (
// //         formData.companyName &&
// //         formData.registrationNumber &&
// //         formData.companyAddress &&
// //         formData.businessType &&
// //         formData.incorporationDate &&
// //         formData.authorizedRepName &&
// //         formData.authorizedRepEmail &&
// //         formData.authorizedRepPhone &&
// //         formData.authorizedRepPosition
// //       );
// //     }
// //     return false;
// //   };
// //   const validateStep2 = () =>
// //     formData.primaryGoal && formData.timeHorizon && formData.riskTolerance && formData.investmentExperience;
// //   const validateStep3 = () =>
// //     formData.isPEP && formData.consentToDataCollection && formData.agreeToTerms;
// //   const validateStep4 = () =>
// //     formData.sourceOfWealth && formData.businessOwnership && formData.employmentIncome && formData.expectedInvestment;

// //   const isStepValid = (step: number) => {
// //     switch (step) {
// //       case 0: return validateStep0();
// //       case 1: return validateStep1();
// //       case 2: return validateStep2();
// //       case 3: return validateStep3();
// //       case 4: return validateStep4();
// //       default: return false;
// //     }
// //   };

// //   const handleNext = async () => {
// //     if (!isStepValid(currentStep)) return;

// //     if (currentStep === 1 && formData.entityType === "individual" && formData.tin) {
// //       const ok = await validateTIN(formData.tin);
// //       if (!ok) return;
// //     }

// //     if (!completedSteps.includes(currentStep)) {
// //       setCompletedSteps((prev) => [...prev, currentStep]);
// //     }
// //     if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
// //   };

// //   const handlePrevious = () => {
// //     if (currentStep > 0) setCurrentStep((s) => s - 1);
// //   };

// //   const handleSubmit = async () => {
// //     if (!isStepValid(4)) return;
// //     if (formData.sanctionsOrLegal === "yes") {
// //       toast.error("You cannot open an account due to past sanctions/legal activities.");
// //       return;
// //     }
// //     if (!userId) {
// //       toast.error("Missing user reference. Please verify your email again.");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const payload = {
// //         ...formData,
// //         entityType: formData.entityType || "individual",
// //         userId, // 🔑 include this for the backend to tie onboarding to the user
// //       };
// //       const res = await submitOnboarding(payload);
// //       if (!res.success) {
// //         toast.error(res.error || "Submission failed.");
// //         return;
// //       }

// //       // Clear temp state and go on
// //       localStorage.removeItem("onboardingUser");
// //       if (formData.isPEP === "yes") {
// //         toast.success("You are flagged as a PEP. Your onboarding will be reviewed.");
// //       } else {
// //         toast.success("Your account will proceed to Review.");
// //       }
// //       toast.success("Submitted for approval.");
// //       router.push("/confirmation");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const progress = (completedSteps.length / steps.length) * 100;

// //   return (
// //     <div className="max-w-4xl mx-auto p-6 space-y-6">
// //       {/* Informational hint if we couldn't find context */}
// //       {initDone && !userId && (
// //         <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
// //           We couldn’t find your verification context. Please complete registration & email verification first.
// //         </div>
// //       )}

// //       {/* Header / progress */}
// //       <div className="text-center space-y-2">
// //         <h1 className="text-3xl font-bold">Account Onboarding</h1>
// //         <p className="text-muted-foreground">
// //           Complete all steps to set up your investment account
// //         </p>
// //       </div>
// //       <Progress value={progress} className="w-full" />

// //       {/* Steps tracker */}
// //       <div className="flex justify-center space-x-4 mb-8">
// //         {steps.map((step) => (
// //           <div key={step.id} className="flex items-center space-x-2">
// //             {completedSteps.includes(step.id) ? (
// //               <CheckCircle className="w-6 h-6 text-green-500" />
// //             ) : (
// //               <Circle
// //                 className={`w-6 h-6 ${
// //                   currentStep === step.id ? "text-blue-500" : "text-gray-300"
// //                 }`}
// //               />
// //             )}
// //             <span
// //               className={`text-sm ${
// //                 currentStep === step.id ? "font-semibold" : "text-muted-foreground"
// //               }`}
// //             >
// //               {step.title}
// //             </span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Card + content */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>{steps[currentStep].title}</CardTitle>
// //           <CardDescription>{steps[currentStep].description}</CardDescription>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           {/* STEP 0 — ENTITY TYPE */}
// //           {currentStep === 0 && (
// //             <div className="space-y-6 text-center">
// //               <div className="space-y-4">
// //                 <h3 className="text-lg font-semibold">How would you like to register?</h3>
// //                 <RadioGroup
// //                   value={formData.entityType}
// //                   onValueChange={(v) => updateFormData("entityType", v)}
// //                   className="flex flex-col space-y-4"
// //                 >
// //                   <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900">
// //                     <RadioGroupItem value="individual" id="individual" />
// //                     <div className="flex-1 text-left">
// //                       <Label htmlFor="individual" className="text-base font-medium cursor-pointer">
// //                         Individual Account
// //                       </Label>
// //                       <p className="text-sm text-muted-foreground">Register as an individual investor</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900">
// //                     <RadioGroupItem value="company" id="company" />
// //                     <div className="flex-1 text-left">
// //                       <Label htmlFor="company" className="text-base font-medium cursor-pointer">
// //                         Company Account
// //                       </Label>
// //                       <p className="text-sm text-muted-foreground">Register as a company or corporate entity</p>
// //                     </div>
// //                   </div>
// //                 </RadioGroup>
// //               </div>
// //             </div>
// //           )}

// //           {/* STEP 1 — INDIVIDUAL DETAILS */}
// //           {currentStep === 1 && formData.entityType === "individual" && (
// //             <div className="space-y-6">
// //               {/* Core fields */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="fullName">Full Name (start with first name) *</Label>
// //                   <Input
// //                     id="fullName"
// //                     value={formData.fullName}
// //                     onChange={(e) => updateFormData("fullName", e.target.value)}
// //                     placeholder="Enter your full name"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="dateOfBirth">Date of Birth *</Label>
// //                   <Input
// //                     id="dateOfBirth"
// //                     type="date"
// //                     value={formData.dateOfBirth}
// //                     onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="tin">TIN (10 digits) *</Label>
// //                   <div className="relative">
// //                     <Input
// //                       id="tin"
// //                       type="text"
// //                       inputMode="numeric"
// //                       value={formData.tin}
// //                       onChange={(e) =>
// //                         updateFormData(
// //                           "tin",
// //                           e.target.value.replace(/\D/g, "").slice(0, 10)
// //                         )
// //                       }
// //                       placeholder="Tax Identification Number"
// //                     />
// //                     {tinValidating && (
// //                       <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
// //                     )}
// //                   </div>
// //                   <p className="text-xs text-muted-foreground">
// //                     {formData.tin.length}/10 digits
// //                   </p>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="homeAddress">Home Address *</Label>
// //                   <Input
// //                     id="homeAddress"
// //                     value={formData.homeAddress}
// //                     onChange={(e) => updateFormData("homeAddress", e.target.value)}
// //                     placeholder="Enter your home address"
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="email">Email *</Label>
// //                   <Input
// //                     id="email"
// //                     type="email"
// //                     value={formData.email}
// //                     onChange={(e) => updateFormData("email", e.target.value)}
// //                     placeholder="you@example.com"
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="phoneNumber">Phone Number *</Label>
// //                   <Input
// //                     id="phoneNumber"
// //                     value={formData.phoneNumber}
// //                     onChange={(e) => updateFormData("phoneNumber", e.target.value)}
// //                     placeholder="+2567…"
// //                   />
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label>Employment Status *</Label>
// //                   <RadioGroup
// //                     value={formData.employmentStatus}
// //                     onValueChange={(v) => updateFormData("employmentStatus", v)}
// //                   >
// //                     <div className="flex items-center space-x-2">
// //                       <RadioGroupItem value="employed" id="employed" />
// //                       <Label htmlFor="employed">Employed</Label>
// //                     </div>
// //                     <div className="flex items-center space-x-2">
// //                       <RadioGroupItem value="self-employed" id="self-employed" />
// //                       <Label htmlFor="self-employed">Self Employed</Label>
// //                     </div>
// //                     <div className="flex items-center space-x-2">
// //                       <RadioGroupItem value="retired" id="retired" />
// //                       <Label htmlFor="retired">Retired</Label>
// //                     </div>
// //                     <div className="flex items-center space-x-2">
// //                       <RadioGroupItem value="student" id="student" />
// //                       <Label htmlFor="student">Student</Label>
// //                     </div>
// //                   </RadioGroup>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label htmlFor="occupation">Occupation *</Label>
// //                   <Input
// //                     id="occupation"
// //                     value={formData.occupation}
// //                     onChange={(e) => updateFormData("occupation", e.target.value)}
// //                     placeholder="Enter your occupation"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Uploads */}
// //               <div className="flex flex-col md:flex-row gap-6 justify-between">
// //                 {/* Avatar */}
// //                 <div className="flex flex-col items-center space-y-3">
// //                   <div className="relative">
// //                     {formData.avatarUrl ? (
// //                       <img
// //                         src={formData.avatarUrl}
// //                         alt="Avatar"
// //                         className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
// //                       />
// //                     ) : (
// //                       <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
// //                         <User className="w-12 h-12 text-gray-400" />
// //                       </div>
// //                     )}
// //                   </div>
// //                   <Label className="text-sm font-medium">Profile Picture</Label>
// //                   <UploadDropzone
// //                     endpoint="imageUploader"
// //                     onClientUploadComplete={(res) => {
// //                       const url = res?.[0]?.url;
// //                       if (url) {
// //                         updateFormData("avatarUrl", url);
// //                         toast.success("Avatar uploaded successfully!");
// //                       }
// //                     }}
// //                     onUploadError={(error: Error) => {
// //                       toast.error(`Upload failed: ${error.message}`);
// //                     }}
// //                     className="mt-2"
// //                   />
// //                 </div>

// //                 {/* ID doc */}
// //                 <div className="flex flex-col items-center space-y-3">
// //                   <div className="relative">
// //                     {formData.idUrl ? (
// //                       <iframe
// //                         src={formData.idUrl}
// //                         className="w-44 h-32 border-4 border-gray-200"
// //                         title="ID Preview"
// //                       />
// //                     ) : (
// //                       <div className="w-44 h-32 bg-gray-200 flex items-center justify-center">
// //                         <UserCheck className="w-12 h-12 text-gray-400" />
// //                       </div>
// //                     )}
// //                   </div>
// //                   <Label className="text-sm font-medium">
// //                     Identity Card/Passport/Driving License
// //                   </Label>
// //                   <UploadDropzone
// //                     endpoint="idImage"
// //                     onClientUploadComplete={(res) => {
// //                       const url = res?.[0]?.url;
// //                       if (url) {
// //                         updateFormData("idUrl", url);
// //                         toast.success("Identity document uploaded successfully!");
// //                       }
// //                     }}
// //                     onUploadError={(error: Error) => {
// //                       toast.error(`Upload failed: ${error.message}`);
// //                     }}
// //                     className="mt-2"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* STEP 1 — COMPANY DETAILS */}
// //           {currentStep === 1 && formData.entityType === "company" && (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="companyName">Company Name *</Label>
// //                 <Input
// //                   id="companyName"
// //                   value={formData.companyName}
// //                   onChange={(e) => updateFormData("companyName", e.target.value)}
// //                   placeholder="Enter company name"
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="registrationNumber">Registration Number *</Label>
// //                 <Input
// //                   id="registrationNumber"
// //                   value={formData.registrationNumber}
// //                   onChange={(e) => updateFormData("registrationNumber", e.target.value)}
// //                   placeholder="Enter registration number"
// //                 />
// //               </div>
// //               <div className="space-y-2 md:col-span-2">
// //                 <Label htmlFor="companyAddress">Company Address *</Label>
// //                 <Input
// //                   id="companyAddress"
// //                   value={formData.companyAddress}
// //                   onChange={(e) => updateFormData("companyAddress", e.target.value)}
// //                   placeholder="Enter company address"
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="businessType">Business Type *</Label>
// //                 <Input
// //                   id="businessType"
// //                   value={formData.businessType}
// //                   onChange={(e) => updateFormData("businessType", e.target.value)}
// //                   placeholder="e.g., LLC, Corporation, Partnership"
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="incorporationDate">Date of Incorporation *</Label>
// //                 <Input
// //                   id="incorporationDate"
// //                   type="date"
// //                   value={formData.incorporationDate}
// //                   onChange={(e) => updateFormData("incorporationDate", e.target.value)}
// //                 />
// //               </div>
// //               <div className="md:col-span-2">
// //                 <h4 className="text-lg font-semibold mb-4">Authorized Representative</h4>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <Label htmlFor="authorizedRepName">Full Name *</Label>
// //                     <Input
// //                       id="authorizedRepName"
// //                       value={formData.authorizedRepName}
// //                       onChange={(e) => updateFormData("authorizedRepName", e.target.value)}
// //                       placeholder="Enter representative's name"
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="authorizedRepPosition">Position *</Label>
// //                     <Input
// //                       id="authorizedRepPosition"
// //                       value={formData.authorizedRepPosition}
// //                       onChange={(e) => updateFormData("authorizedRepPosition", e.target.value)}
// //                       placeholder="e.g., CEO, CFO, Director"
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="authorizedRepEmail">Email *</Label>
// //                     <Input
// //                       id="authorizedRepEmail"
// //                       type="email"
// //                       value={formData.authorizedRepEmail}
// //                       onChange={(e) => updateFormData("authorizedRepEmail", e.target.value)}
// //                       placeholder="Enter representative's email"
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="authorizedRepPhone">Phone Number *</Label>
// //                     <Input
// //                       id="authorizedRepPhone"
// //                       value={formData.authorizedRepPhone}
// //                       onChange={(e) => updateFormData("authorizedRepPhone", e.target.value)}
// //                       placeholder="Enter representative's phone"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* STEP 2 — INVESTMENT OBJECTIVES */}
// //           {currentStep === 2 && (
// //             <div className="space-y-6">
// //               <div className="space-y-2">
// //                 <Label>Primary Investment Goal *</Label>
// //                 <RadioGroup
// //                   value={formData.primaryGoal}
// //                   onValueChange={(v) => updateFormData("primaryGoal", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="growth" id="growth" />
// //                     <Label htmlFor="growth">Growth</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="income" id="income" />
// //                     <Label htmlFor="income">Income</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="capital-preservation" id="capital-preservation" />
// //                     <Label htmlFor="capital-preservation">Capital Preservation</Label>
// //                   </div>
// //                 </RadioGroup>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label>Investment Time Horizon *</Label>
// //                 <RadioGroup
// //                   value={formData.timeHorizon}
// //                   onValueChange={(v) => updateFormData("timeHorizon", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="1-3-years" id="1-3-years" />
// //                     <Label htmlFor="1-3-years">1–3 years</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="3-5-years" id="3-5-years" />
// //                     <Label htmlFor="3-5-years">3–5 years</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="5-10-years" id="5-10-years" />
// //                     <Label htmlFor="5-10-years">5–10 years</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="over-10-years" id="over-10-years" />
// //                     <Label htmlFor="over-10-years">Over 10 years</Label>
// //                   </div>
// //                 </RadioGroup>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label>Risk Tolerance *</Label>
// //                 <RadioGroup
// //                   value={formData.riskTolerance}
// //                   onValueChange={(v) => updateFormData("riskTolerance", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="aggressive" id="aggressive" />
// //                     <Label htmlFor="aggressive">Aggressive</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="high-risk" id="high-risk" />
// //                     <Label htmlFor="high-risk">High Risk</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="moderate-risk" id="moderate-risk" />
// //                     <Label htmlFor="moderate-risk">Moderate Risk</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="low-risk" id="low-risk" />
// //                     <Label htmlFor="low-risk">Low Risk</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="conservative" id="conservative" />
// //                     <Label htmlFor="conservative">Conservative</Label>
// //                   </div>
// //                 </RadioGroup>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label>Investment Experience *</Label>
// //                 <RadioGroup
// //                   value={formData.investmentExperience}
// //                   onValueChange={(v) => updateFormData("investmentExperience", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="none" id="none" />
// //                     <Label htmlFor="none">None</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="limited" id="limited" />
// //                     <Label htmlFor="limited">Limited</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="moderate" id="moderate" />
// //                     <Label htmlFor="moderate">Moderate</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="extensive" id="extensive" />
// //                     <Label htmlFor="extensive">Extensive</Label>
// //                   </div>
// //                 </RadioGroup>
// //               </div>
// //             </div>
// //           )}

// //           {/* STEP 3 — REGULATORY */}
// //           {currentStep === 3 && (
// //             <div className="space-y-6">
// //               <div className="space-y-2">
// //                 <Label>Are you a Politically Exposed Person (PEP)? *</Label>
// //                 <p className="text-sm text-muted-foreground">
// //                   Note: A PEP is a person who holds (or is closely related to someone who holds) a prominent public position.
// //                 </p>
// //                 <RadioGroup
// //                   value={formData.isPEP}
// //                   onValueChange={(v) => updateFormData("isPEP", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="yes" id="pep-yes" />
// //                     <Label htmlFor="pep-yes">Yes</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="no" id="pep-no" />
// //                     <Label htmlFor="pep-no">No</Label>
// //                   </div>
// //                 </RadioGroup>
// //                 {formData.isPEP === "yes" && (
// //                   <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
// //                     If you are a PEP, your account will proceed to approval; otherwise, it may go through EDD.
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Privacy dialog + acceptance */}
// //               <div className="flex items-center space-x-2">
// //                 <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
// //                   <DialogTrigger asChild>
// //                     <Button variant="link" size="sm" className="text-red-500 flex items-center space-x-1 p-0 h-auto">
// //                       <Eye className="h-5 w-5" />
// //                       <span className="text-sm font-bold">Read and accept our Privacy Policy</span>
// //                     </Button>
// //                   </DialogTrigger>
// //                   <DialogContent className="max-w-2xl max-h-[90vh]">
// //                     <DialogHeader>
// //                       <DialogTitle>Privacy Policy</DialogTitle>
// //                       <DialogDescription>
// //                         Please read our privacy policy carefully
// //                       </DialogDescription>
// //                     </DialogHeader>
// //                     <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
// //                       <div className="space-y-4 text-sm">
// //                         <h3 className="font-semibold">1. Information We Collect</h3>
// //                         <p>… your privacy copy …</p>
// //                         <h3 className="font-semibold">2. How We Use Information</h3>
// //                         <p>…</p>
// //                         <h3 className="font-semibold">3. Sharing & Disclosures</h3>
// //                         <p>…</p>
// //                         <h3 className="font-semibold">4. Security</h3>
// //                         <p>…</p>
// //                         <h3 className="font-semibold">5. Your Rights</h3>
// //                         <p>…</p>
// //                       </div>
// //                     </ScrollArea>
// //                     <div className="flex items-center space-x-2">
// //                       <Checkbox
// //                         id="consent-in-modal"
// //                         checked={formData.consentToDataCollection}
// //                         onCheckedChange={(checked) =>
// //                           updateFormData("consentToDataCollection", checked as boolean)
// //                         }
// //                       />
// //                       <Label htmlFor="consent-in-modal" className="text-sm">
// //                         I accept the Privacy Policy
// //                       </Label>
// //                     </div>
// //                   </DialogContent>
// //                 </Dialog>
// //               </div>

// //               {/* Terms dialog + acceptance */}
// //               <div className="flex items-center space-x-2">
// //                 <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
// //                   <DialogTrigger asChild>
// //                     <Button variant="link" size="sm" className="text-red-500 flex items-center space-x-1 p-0 h-auto">
// //                       <Eye className="h-5 w-5" />
// //                       <span className="text-sm font-bold">
// //                         Read and accept the Terms & Conditions
// //                       </span>
// //                     </Button>
// //                   </DialogTrigger>
// //                   <DialogContent className="max-w-2xl max-h-[90vh]">
// //                     <DialogHeader>
// //                       <DialogTitle>Terms & Conditions</DialogTitle>
// //                       <DialogDescription>
// //                         Please read our terms carefully
// //                       </DialogDescription>
// //                     </DialogHeader>
// //                     <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
// //                       <div className="space-y-4 text-sm">
// //                         <h3 className="font-semibold">1. Account Opening</h3>
// //                         <p>… your terms copy …</p>
// //                         <h3 className="font-semibold">2. Investment Risks</h3>
// //                         <p>…</p>
// //                         <h3 className="font-semibold">3. Fees & Charges</h3>
// //                         <p>…</p>
// //                         <h3 className="font-semibold">4. Responsibilities</h3>
// //                         <p>…</p>
// //                       </div>
// //                     </ScrollArea>
// //                     <div className="mt-2 flex items-center space-x-2">
// //                       <Checkbox
// //                         id="terms-in-modal"
// //                         checked={formData.agreeToTerms}
// //                         onCheckedChange={(checked) =>
// //                           updateFormData("agreeToTerms", checked as boolean)
// //                         }
// //                       />
// //                       <Label htmlFor="terms-in-modal" className="text-sm">
// //                         I agree to the Terms & Conditions
// //                       </Label>
// //                     </div>
// //                   </DialogContent>
// //                 </Dialog>
// //               </div>
// //             </div>
// //           )}

// //           {/* STEP 4 — EDD */}
// //           {currentStep === 4 && (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {/* Core EDD fields */}
// //               <div className="space-y-2">
// //                 <Label htmlFor="sourceOfWealth">
// //                   What is the source of wealth/inheritance? *
// //                 </Label>
// //                 <Textarea
// //                   id="sourceOfWealth"
// //                   value={formData.sourceOfWealth}
// //                   onChange={(e) => updateFormData("sourceOfWealth", e.target.value)}
// //                   placeholder="Describe the source of your wealth"
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="businessOwnership">Business ownership/investments *</Label>
// //                 <Textarea
// //                   id="businessOwnership"
// //                   value={formData.businessOwnership}
// //                   onChange={(e) => updateFormData("businessOwnership", e.target.value)}
// //                   placeholder="Describe your business ownership"
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="employmentIncome">Employment income *</Label>
// //                 <Input
// //                   id="employmentIncome"
// //                   value={formData.employmentIncome}
// //                   onChange={(e) => updateFormData("employmentIncome", e.target.value)}
// //                   placeholder="Enter your employment income"
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="expectedInvestment">Expected investment amount *</Label>
// //                 <Input
// //                   id="expectedInvestment"
// //                   value={formData.expectedInvestment}
// //                   onChange={(e) => updateFormData("expectedInvestment", e.target.value)}
// //                   placeholder="Enter expected investment amount"
// //                 />
// //               </div>

// //               {/* Own a business? */}
// //               <div className="space-y-2 md:col-span-2">
// //                 <Label>Do you own a business? *</Label>
// //                 <RadioGroup
// //                   value={formData.hasBusiness || ""}
// //                   onValueChange={(v) => updateFormData("hasBusiness", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="yes" id="business-yes" />
// //                     <Label htmlFor="business-yes">Yes</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="no" id="business-no" />
// //                     <Label htmlFor="business-no">No</Label>
// //                   </div>
// //                 </RadioGroup>
// //               </div>

// //               {formData.hasBusiness === "yes" && (
// //                 <>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="businessName">Business name</Label>
// //                     <Input
// //                       id="businessName"
// //                       value={formData.businessName}
// //                       onChange={(e) => updateFormData("businessName", e.target.value)}
// //                       placeholder="Enter business name"
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label htmlFor="businessAddress">Business address</Label>
// //                     <Input
// //                       id="businessAddress"
// //                       value={formData.businessAddress}
// //                       onChange={(e) => updateFormData("businessAddress", e.target.value)}
// //                       placeholder="Enter business address"
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label htmlFor="establishmentDate">Date of establishment</Label>
// //                     <Input
// //                       id="establishmentDate"
// //                       type="date"
// //                       value={formData.establishmentDate}
// //                       onChange={(e) => updateFormData("establishmentDate", e.target.value)}
// //                     />
// //                   </div>

// //                   <div className="space-y-2">
// //                     <Label htmlFor="ownershipPercentage">Ownership percentage</Label>
// //                     <Input
// //                       id="ownershipPercentage"
// //                       value={formData.ownershipPercentage}
// //                       onChange={(e) => updateFormData("ownershipPercentage", e.target.value)}
// //                       placeholder="Enter ownership percentage"
// //                     />
// //                   </div>

// //                   <div className="space-y-2 md:col-span-2">
// //                     <Label htmlFor="businessType">Type of business</Label>
// //                     <Input
// //                       id="businessType"
// //                       value={formData.businessType}
// //                       onChange={(e) => updateFormData("businessType", e.target.value)}
// //                       placeholder="Enter type of business"
// //                     />
// //                   </div>
// //                 </>
// //               )}

// //               {/* PEP details & sanctions */}
// //               <div className="space-y-2 md:col-span-2">
// //                 <Label htmlFor="familyMemberDetails">
// //                   Please provide details of family members who hold public positions (PEP) *{" "}
// //                   <span className="text-red-500">
// //                     (only if you are a PEP; otherwise enter N/A)
// //                   </span>
// //                 </Label>
// //                 <Textarea
// //                   id="familyMemberDetails"
// //                   value={formData.familyMemberDetails}
// //                   onChange={(e) => updateFormData("familyMemberDetails", e.target.value)}
// //                   placeholder="Provide family member details"
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="publicPosition">Name of public position or Office</Label>
// //                 <Input
// //                   id="publicPosition"
// //                   value={formData.publicPosition}
// //                   onChange={(e) => updateFormData("publicPosition", e.target.value)}
// //                   placeholder="Enter public position"
// //                 />
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="relationshipToCountry">Nationality</Label>
// //                 <Input
// //                   id="relationshipToCountry"
// //                   value={formData.relationshipToCountry}
// //                   onChange={(e) => updateFormData("relationshipToCountry", e.target.value)}
// //                   placeholder="Enter Nationality"
// //                 />
// //               </div>

// //               <div className="space-y-2 md:col-span-2">
// //                 <Label htmlFor="sanctionsOrLegal">
// //                   Have you ever been sanctioned or charged with illegal financial activities?
// //                 </Label>
// //                 <RadioGroup
// //                   value={formData.sanctionsOrLegal}
// //                   onValueChange={(v) => updateFormData("sanctionsOrLegal", v)}
// //                 >
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="yes" id="sanctions-yes" />
// //                     <Label htmlFor="sanctions-yes">Yes</Label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <RadioGroupItem value="no" id="sanctions-no" />
// //                     <Label htmlFor="sanctions-no">No</Label>
// //                   </div>
// //                 </RadioGroup>
// //                 {formData.sanctionsOrLegal === "yes" && (
// //                   <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
// //                     If yes to the above, you cannot open an account.
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>

// //       {/* Navigation buttons */}
// //       <div className="flex justify-between">
// //         <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
// //           Previous
// //         </Button>

// //         {currentStep < steps.length - 1 ? (
// //           <Button onClick={handleNext} disabled={!isStepValid(currentStep) || tinValidating}>
// //             {tinValidating ? (
// //               <span className="flex items-center gap-2">
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Validating TIN...
// //               </span>
// //             ) : (
// //               "Next"
// //             )}
// //           </Button>
// //         ) : (
// //           <Button
// //             onClick={handleSubmit}
// //             disabled={
// //               loading ||
// //               !isStepValid(4) ||
// //               formData.sanctionsOrLegal === "yes" ||
// //               !userId
// //             }
// //           >
// //             {loading ? (
// //               <span className="flex items-center gap-2">
// //                 <Loader2 className="h-4 w-4 animate-spin" />
// //                 Submitting...
// //               </span>
// //             ) : (
// //               "Complete Onboarding"
// //             )}
// //           </Button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




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
// import { CheckCircle, Circle, Loader2, User, Eye, UserCheck, Edit } from "lucide-react"
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
//   idUrl: string

//   companyName: string
//   registrationNumber: string
//   companyAddress: string
//   businessType: string
//   incorporationDate: string
//   authorizedRepName: string
//   authorizedRepEmail: string
//   authorizedRepPhone: string
//   authorizedRepPosition: string

//   primaryGoal: string
//   timeHorizon: string
//   riskTolerance: string
//   investmentExperience: string

//   isPEP: string
//   consentToDataCollection: boolean
//   agreeToTerms: boolean

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
//   idUrl: "",

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
//   consentToDataCollection: false,
//   agreeToTerms: false,

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
//       { id: 0, title: "Entity Type", description: "Choose registration type" },
//       {
//         id: 1,
//         title: formData.entityType === "company" ? "Company Details" : "Personal Details",
//         description:
//           formData.entityType === "company" ? "Information about your company" : "Basic information about you",
//       },
//       { id: 2, title: "Investment Objectives", description: "Your investment goals and preferences" },
//       { id: 3, title: "Regulatory Information", description: "Compliance and regulatory requirements" },
//       { id: 4, title: "Enhanced Due Diligence", description: "Additional verification information" },
//       { id: 5, title: "Review & Submit", description: "Review your information before submitting" },
//     ],
//     [formData.entityType],
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
//     formData.primaryGoal && formData.timeHorizon && formData.riskTolerance && formData.investmentExperience
//   const validateStep3 = () => formData.isPEP && formData.consentToDataCollection && formData.agreeToTerms
//   const validateStep4 = () =>
//     formData.sourceOfWealth && formData.businessOwnership && formData.employmentIncome && formData.expectedInvestment
//   const validateStep5 = () =>
//     validateStep0() && validateStep1() && validateStep2() && validateStep3() && validateStep4()

//   const isStepValid = (step: number) => {
//     switch (step) {
//       case 0:
//         return validateStep0()
//       case 1:
//         return validateStep1()
//       case 2:
//         return validateStep2()
//       case 3:
//         return validateStep3()
//       case 4:
//         return validateStep4()
//       case 5:
//         return validateStep5()
//       default:
//         return false
//     }
//   }

//   const handleNext = async () => {
//     if (!isStepValid(currentStep)) return

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
//     if (!isStepValid(5)) return
//     if (formData.sanctionsOrLegal === "yes") {
//       toast.error("You cannot open an account due to past sanctions/legal activities.")
//       return
//     }
//     if (!userId) {
//       toast.error("Missing user reference. Please verify your email again.")
//       return
//     }

//     setLoading(true)
//     try {
//       const payload = {
//         ...formData,
//         entityType: formData.entityType || "individual",
//       }
//       const res = await submitOnboarding(payload,userId)
//       if (!res.success) {
//         toast.error(res.error || "Submission failed.")
//         return
//       }

//       localStorage.removeItem("onboardingUser")
//       if (formData.isPEP === "yes") {
//         toast.success("You are flagged as a PEP. Your onboarding will be reviewed.")
//       } else {
//         toast.success("Your account will proceed to Review.")
//       }
//       toast.success("Submitted for approval.")
//       router.push("/confirmation")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const progress = (completedSteps.length / steps.length) * 100

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
//           We couldn't find your verification context. Please complete registration & email verification first.
//         </div>
//       )}

//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold">Account Onboarding</h1>
//         <p className="text-muted-foreground">Complete all steps to set up your investment account</p>
//       </div>
//       <Progress value={progress} className="w-full" />

//       <div className="flex justify-center space-x-4 mb-8 overflow-x-auto">
//         {steps.map((step) => (
//           <div key={step.id} className="flex items-center space-x-2 min-w-fit">
//             {completedSteps.includes(step.id) ? (
//               <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
//             ) : (
//               <Circle
//                 className={`w-6 h-6 flex-shrink-0 ${currentStep === step.id ? "text-blue-500" : "text-gray-300"}`}
//               />
//             )}
//             <span className={`text-sm ${currentStep === step.id ? "font-semibold" : "text-muted-foreground"}`}>
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
//           {/* STEP 0 — ENTITY TYPE */}
//           {currentStep === 0 && (
//             <div className="space-y-6 text-center">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">How would you like to register?</h3>
//                 <RadioGroup
//                   value={formData.entityType}
//                   onValueChange={(v) => updateFormData("entityType", v)}
//                   className="flex flex-col space-y-4"
//                 >
//                   <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900">
//                     <RadioGroupItem value="individual" id="individual" />
//                     <div className="flex-1 text-left">
//                       <Label htmlFor="individual" className="text-base font-medium cursor-pointer">
//                         Individual Account
//                       </Label>
//                       <p className="text-sm text-muted-foreground">Register as an individual investor</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900">
//                     <RadioGroupItem value="company" id="company" />
//                     <div className="flex-1 text-left">
//                       <Label htmlFor="company" className="text-base font-medium cursor-pointer">
//                         Company Account
//                       </Label>
//                       <p className="text-sm text-muted-foreground">Register as a company or corporate entity</p>
//                     </div>
//                   </div>
//                 </RadioGroup>
//               </div>
//             </div>
//           )}

//           {/* STEP 1 — INDIVIDUAL DETAILS */}
//           {currentStep === 1 && formData.entityType === "individual" && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="fullName">Full Name (start with first name) *</Label>
//                   <Input
//                     id="fullName"
//                     value={formData.fullName}
//                     onChange={(e) => updateFormData("fullName", e.target.value)}
//                     placeholder="Enter your full name"
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
//                   <Label htmlFor="tin">TIN (10 digits) *</Label>
//                   <div className="relative">
//                     <Input
//                       id="tin"
//                       type="text"
//                       inputMode="numeric"
//                       value={formData.tin}
//                       onChange={(e) => updateFormData("tin", e.target.value.replace(/\D/g, "").slice(0, 10))}
//                       placeholder="Tax Identification Number"
//                     />
//                     {tinValidating && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
//                   </div>
//                   <p className="text-xs text-muted-foreground">{formData.tin.length}/10 digits</p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="homeAddress">Home Address *</Label>
//                   <Input
//                     id="homeAddress"
//                     value={formData.homeAddress}
//                     onChange={(e) => updateFormData("homeAddress", e.target.value)}
//                     placeholder="Enter your home address"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => updateFormData("email", e.target.value)}
//                     placeholder="you@example.com"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phoneNumber">Phone Number *</Label>
//                   <Input
//                     id="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={(e) => updateFormData("phoneNumber", e.target.value)}
//                     placeholder="+2567…"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Employment Status *</Label>
//                   <RadioGroup
//                     value={formData.employmentStatus}
//                     onValueChange={(v) => updateFormData("employmentStatus", v)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="employed" id="employed" />
//                       <Label htmlFor="employed">Employed</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="self-employed" id="self-employed" />
//                       <Label htmlFor="self-employed">Self Employed</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="retired" id="retired" />
//                       <Label htmlFor="retired">Retired</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="student" id="student" />
//                       <Label htmlFor="student">Student</Label>
//                     </div>
//                   </RadioGroup>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="occupation">Occupation *</Label>
//                   <Input
//                     id="occupation"
//                     value={formData.occupation}
//                     onChange={(e) => updateFormData("occupation", e.target.value)}
//                     placeholder="Enter your occupation"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col md:flex-row gap-6 justify-between">
//                 <div className="flex flex-col items-center space-y-3">
//                   <div className="relative">
//                     {formData.avatarUrl ? (
//                       <img
//                         src={formData.avatarUrl || "/placeholder.svg"}
//                         alt="Avatar"
//                         className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
//                       />
//                     ) : (
//                       <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                         <User className="w-12 h-12 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                   <Label className="text-sm font-medium">Profile Picture</Label>
//                   <UploadDropzone
//                     endpoint="imageUploader"
//                     onClientUploadComplete={(res) => {
//                       const url = res?.[0]?.url
//                       if (url) {
//                         updateFormData("avatarUrl", url)
//                         toast.success("Avatar uploaded successfully!")
//                       }
//                     }}
//                     onUploadError={(error: Error) => {
//                       toast.error(`Upload failed: ${error.message}`)
//                     }}
//                     className="mt-2"
//                   />
//                 </div>

//                 <div className="flex flex-col items-center space-y-3">
//                   <div className="relative">
//                     {formData.idUrl ? (
//                       <iframe src={formData.idUrl} className="w-44 h-32 border-4 border-gray-200" title="ID Preview" />
//                     ) : (
//                       <div className="w-44 h-32 bg-gray-200 flex items-center justify-center">
//                         <UserCheck className="w-12 h-12 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                   <Label className="text-sm font-medium">Identity Card/Passport/Driving License</Label>
//                   <UploadDropzone
//                     endpoint="idImage"
//                     onClientUploadComplete={(res) => {
//                       const url = res?.[0]?.url
//                       if (url) {
//                         updateFormData("idUrl", url)
//                         toast.success("Identity document uploaded successfully!")
//                       }
//                     }}
//                     onUploadError={(error: Error) => {
//                       toast.error(`Upload failed: ${error.message}`)
//                     }}
//                     className="mt-2"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 1 — COMPANY DETAILS */}
//           {currentStep === 1 && formData.entityType === "company" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="companyName">Company Name *</Label>
//                 <Input
//                   id="companyName"
//                   value={formData.companyName}
//                   onChange={(e) => updateFormData("companyName", e.target.value)}
//                   placeholder="Enter company name"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="registrationNumber">Registration Number *</Label>
//                 <Input
//                   id="registrationNumber"
//                   value={formData.registrationNumber}
//                   onChange={(e) => updateFormData("registrationNumber", e.target.value)}
//                   placeholder="Enter registration number"
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <Label htmlFor="companyAddress">Company Address *</Label>
//                 <Input
//                   id="companyAddress"
//                   value={formData.companyAddress}
//                   onChange={(e) => updateFormData("companyAddress", e.target.value)}
//                   placeholder="Enter company address"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="businessType">Business Type *</Label>
//                 <Input
//                   id="businessType"
//                   value={formData.businessType}
//                   onChange={(e) => updateFormData("businessType", e.target.value)}
//                   placeholder="e.g., LLC, Corporation, Partnership"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="incorporationDate">Date of Incorporation *</Label>
//                 <Input
//                   id="incorporationDate"
//                   type="date"
//                   value={formData.incorporationDate}
//                   onChange={(e) => updateFormData("incorporationDate", e.target.value)}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <h4 className="text-lg font-semibold mb-4">Authorized Representative</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepName">Full Name *</Label>
//                     <Input
//                       id="authorizedRepName"
//                       value={formData.authorizedRepName}
//                       onChange={(e) => updateFormData("authorizedRepName", e.target.value)}
//                       placeholder="Enter representative's name"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepPosition">Position *</Label>
//                     <Input
//                       id="authorizedRepPosition"
//                       value={formData.authorizedRepPosition}
//                       onChange={(e) => updateFormData("authorizedRepPosition", e.target.value)}
//                       placeholder="e.g., CEO, CFO, Director"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepEmail">Email *</Label>
//                     <Input
//                       id="authorizedRepEmail"
//                       type="email"
//                       value={formData.authorizedRepEmail}
//                       onChange={(e) => updateFormData("authorizedRepEmail", e.target.value)}
//                       placeholder="Enter representative's email"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="authorizedRepPhone">Phone Number *</Label>
//                     <Input
//                       id="authorizedRepPhone"
//                       value={formData.authorizedRepPhone}
//                       onChange={(e) => updateFormData("authorizedRepPhone", e.target.value)}
//                       placeholder="Enter representative's phone"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* STEP 2 — INVESTMENT OBJECTIVES */}
//           {currentStep === 2 && (
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <Label>Primary Investment Goal *</Label>
//                 <RadioGroup value={formData.primaryGoal} onValueChange={(v) => updateFormData("primaryGoal", v)}>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="growth" id="growth" />
//                     <Label htmlFor="growth">Growth</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="income" id="income" />
//                     <Label htmlFor="income">Income</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="capital-preservation" id="capital-preservation" />
//                     <Label htmlFor="capital-preservation">Capital Preservation</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               <div className="space-y-2">
//                 <Label>Investment Time Horizon *</Label>
//                 <RadioGroup value={formData.timeHorizon} onValueChange={(v) => updateFormData("timeHorizon", v)}>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="1-3-years" id="1-3-years" />
//                     <Label htmlFor="1-3-years">1–3 years</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="3-5-years" id="3-5-years" />
//                     <Label htmlFor="3-5-years">3–5 years</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="5-10-years" id="5-10-years" />
//                     <Label htmlFor="5-10-years">5–10 years</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="over-10-years" id="over-10-years" />
//                     <Label htmlFor="over-10-years">Over 10 years</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               <div className="space-y-2">
//                 <Label>Risk Tolerance *</Label>
//                 <RadioGroup value={formData.riskTolerance} onValueChange={(v) => updateFormData("riskTolerance", v)}>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="aggressive" id="aggressive" />
//                     <Label htmlFor="aggressive">Aggressive</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="high-risk" id="high-risk" />
//                     <Label htmlFor="high-risk">High Risk</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="moderate-risk" id="moderate-risk" />
//                     <Label htmlFor="moderate-risk">Moderate Risk</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="low-risk" id="low-risk" />
//                     <Label htmlFor="low-risk">Low Risk</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="conservative" id="conservative" />
//                     <Label htmlFor="conservative">Conservative</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               <div className="space-y-2">
//                 <Label>Investment Experience *</Label>
//                 <RadioGroup
//                   value={formData.investmentExperience}
//                   onValueChange={(v) => updateFormData("investmentExperience", v)}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="none" id="none" />
//                     <Label htmlFor="none">None</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="limited" id="limited" />
//                     <Label htmlFor="limited">Limited</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="moderate" id="moderate" />
//                     <Label htmlFor="moderate">Moderate</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="extensive" id="extensive" />
//                     <Label htmlFor="extensive">Extensive</Label>
//                   </div>
//                 </RadioGroup>
//               </div>
//             </div>
//           )}

//           {/* STEP 3 — REGULATORY */}
//           {currentStep === 3 && (
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <Label>Are you a Politically Exposed Person (PEP)? *</Label>
//                 <p className="text-sm text-muted-foreground">
//                   Note: A PEP is a person who holds (or is closely related to someone who holds) a prominent public
//                   position.
//                 </p>
//                 <RadioGroup value={formData.isPEP} onValueChange={(v) => updateFormData("isPEP", v)}>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="yes" id="pep-yes" />
//                     <Label htmlFor="pep-yes">Yes</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="no" id="pep-no" />
//                     <Label htmlFor="pep-no">No</Label>
//                   </div>
//                 </RadioGroup>
//                 {formData.isPEP === "yes" && (
//                   <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
//                     If you are a PEP, your account will proceed to approval; otherwise, it may go through EDD.
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="link" size="sm" className="text-red-500 flex items-center space-x-1 p-0 h-auto">
//                       <Eye className="h-5 w-5" />
//                       <span className="text-sm font-bold">Read and accept our Privacy Policy</span>
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-2xl max-h-[90vh]">
//                     <DialogHeader>
//                       <DialogTitle>Privacy Policy</DialogTitle>
//                       <DialogDescription>Please read our privacy policy carefully</DialogDescription>
//                     </DialogHeader>
//                     <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
//                       <div className="space-y-4 text-sm">
//                         <h3 className="font-semibold">1. Information We Collect</h3>
//                         <p>We collect personal information that you provide to us...</p>
//                         <h3 className="font-semibold">2. How We Use Information</h3>
//                         <p>We use your information to provide and improve our services...</p>
//                         <h3 className="font-semibold">3. Sharing & Disclosures</h3>
//                         <p>We may share your information with trusted partners...</p>
//                         <h3 className="font-semibold">4. Security</h3>
//                         <p>We implement appropriate security measures...</p>
//                         <h3 className="font-semibold">5. Your Rights</h3>
//                         <p>You have the right to access, correct, or delete your data...</p>
//                       </div>
//                     </ScrollArea>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="consent-in-modal"
//                         checked={formData.consentToDataCollection}
//                         onCheckedChange={(checked) => updateFormData("consentToDataCollection", checked as boolean)}
//                       />
//                       <Label htmlFor="consent-in-modal" className="text-sm">
//                         I accept the Privacy Policy
//                       </Label>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="link" size="sm" className="text-red-500 flex items-center space-x-1 p-0 h-auto">
//                       <Eye className="h-5 w-5" />
//                       <span className="text-sm font-bold">Read and accept the Terms & Conditions</span>
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-2xl max-h-[90vh]">
//                     <DialogHeader>
//                       <DialogTitle>Terms & Conditions</DialogTitle>
//                       <DialogDescription>Please read our terms carefully</DialogDescription>
//                     </DialogHeader>
//                     <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
//                       <div className="space-y-4 text-sm">
//                         <h3 className="font-semibold">1. Account Opening</h3>
//                         <p>By opening an account, you agree to our terms...</p>
//                         <h3 className="font-semibold">2. Investment Risks</h3>
//                         <p>All investments carry risk...</p>
//                         <h3 className="font-semibold">3. Fees & Charges</h3>
//                         <p>We may charge fees for certain services...</p>
//                         <h3 className="font-semibold">4. Responsibilities</h3>
//                         <p>You are responsible for maintaining account security...</p>
//                       </div>
//                     </ScrollArea>
//                     <div className="mt-2 flex items-center space-x-2">
//                       <Checkbox
//                         id="terms-in-modal"
//                         checked={formData.agreeToTerms}
//                         onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
//                       />
//                       <Label htmlFor="terms-in-modal" className="text-sm">
//                         I agree to the Terms & Conditions
//                       </Label>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>
//           )}

//           {/* STEP 4 — EDD */}
//           {currentStep === 4 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="sourceOfWealth">What is the source of wealth/inheritance? *</Label>
//                 <Textarea
//                   id="sourceOfWealth"
//                   value={formData.sourceOfWealth}
//                   onChange={(e) => updateFormData("sourceOfWealth", e.target.value)}
//                   placeholder="Describe the source of your wealth"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="businessOwnership">Business ownership/investments *</Label>
//                 <Textarea
//                   id="businessOwnership"
//                   value={formData.businessOwnership}
//                   onChange={(e) => updateFormData("businessOwnership", e.target.value)}
//                   placeholder="Describe your business ownership"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="employmentIncome">Employment income *</Label>
//                 <Input
//                   id="employmentIncome"
//                   value={formData.employmentIncome}
//                   onChange={(e) => updateFormData("employmentIncome", e.target.value)}
//                   placeholder="Enter your employment income"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="expectedInvestment">Expected investment amount *</Label>
//                 <Input
//                   id="expectedInvestment"
//                   value={formData.expectedInvestment}
//                   onChange={(e) => updateFormData("expectedInvestment", e.target.value)}
//                   placeholder="Enter expected investment amount"
//                 />
//               </div>

//               <div className="space-y-2 md:col-span-2">
//                 <Label>Do you own a business? *</Label>
//                 <RadioGroup value={formData.hasBusiness || ""} onValueChange={(v) => updateFormData("hasBusiness", v)}>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="yes" id="business-yes" />
//                     <Label htmlFor="business-yes">Yes</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="no" id="business-no" />
//                     <Label htmlFor="business-no">No</Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {formData.hasBusiness === "yes" && (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName">Business name</Label>
//                     <Input
//                       id="businessName"
//                       value={formData.businessName}
//                       onChange={(e) => updateFormData("businessName", e.target.value)}
//                       placeholder="Enter business name"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessAddress">Business address</Label>
//                     <Input
//                       id="businessAddress"
//                       value={formData.businessAddress}
//                       onChange={(e) => updateFormData("businessAddress", e.target.value)}
//                       placeholder="Enter business address"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="establishmentDate">Date of establishment</Label>
//                     <Input
//                       id="establishmentDate"
//                       type="date"
//                       value={formData.establishmentDate}
//                       onChange={(e) => updateFormData("establishmentDate", e.target.value)}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="ownershipPercentage">Ownership percentage</Label>
//                     <Input
//                       id="ownershipPercentage"
//                       value={formData.ownershipPercentage}
//                       onChange={(e) => updateFormData("ownershipPercentage", e.target.value)}
//                       placeholder="Enter ownership percentage"
//                     />
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <Label htmlFor="businessType">Type of business</Label>
//                     <Input
//                       id="businessType"
//                       value={formData.businessType}
//                       onChange={(e) => updateFormData("businessType", e.target.value)}
//                       placeholder="Enter type of business"
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="space-y-2 md:col-span-2">
//                 <Label htmlFor="familyMemberDetails">
//                   Please provide details of family members who hold public positions (PEP) *{" "}
//                   <span className="text-red-500">(only if you are a PEP; otherwise enter N/A)</span>
//                 </Label>
//                 <Textarea
//                   id="familyMemberDetails"
//                   value={formData.familyMemberDetails}
//                   onChange={(e) => updateFormData("familyMemberDetails", e.target.value)}
//                   placeholder="Provide family member details"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="publicPosition">Name of public position or Office</Label>
//                 <Input
//                   id="publicPosition"
//                   value={formData.publicPosition}
//                   onChange={(e) => updateFormData("publicPosition", e.target.value)}
//                   placeholder="Enter public position"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="relationshipToCountry">Nationality</Label>
//                 <Input
//                   id="relationshipToCountry"
//                   value={formData.relationshipToCountry}
//                   onChange={(e) => updateFormData("relationshipToCountry", e.target.value)}
//                   placeholder="Enter Nationality"
//                 />
//               </div>

//               <div className="space-y-2 md:col-span-2">
//                 <Label htmlFor="sanctionsOrLegal">
//                   Have you ever been sanctioned or charged with illegal financial activities?
//                 </Label>
//                 <RadioGroup
//                   value={formData.sanctionsOrLegal}
//                   onValueChange={(v) => updateFormData("sanctionsOrLegal", v)}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="yes" id="sanctions-yes" />
//                     <Label htmlFor="sanctions-yes">Yes</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="no" id="sanctions-no" />
//                     <Label htmlFor="sanctions-no">No</Label>
//                   </div>
//                 </RadioGroup>
//                 {formData.sanctionsOrLegal === "yes" && (
//                   <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
//                     If yes to the above, you cannot open an account.
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {currentStep === 5 && (
//             <div className="space-y-8">
//               {/* Entity Type Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Entity Type</h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleEditStep(0)}
//                     className="flex items-center gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField
//                     label="Registration Type"
//                     value={formData.entityType === "individual" ? "Individual Account" : "Company Account"}
//                   />
//                 </div>
//               </div>

//               {/* Personal/Company Details Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">
//                     {formData.entityType === "company" ? "Company Details" : "Personal Details"}
//                   </h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleEditStep(1)}
//                     className="flex items-center gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {formData.entityType === "individual" ? (
//                     <>
//                       <ReviewField label="Full Name" value={formData.fullName} />
//                       <ReviewField label="Date of Birth" value={formData.dateOfBirth} />
//                       <ReviewField label="TIN" value={formData.tin} />
//                       <ReviewField label="Home Address" value={formData.homeAddress} />
//                       <ReviewField label="Email" value={formData.email} />
//                       <ReviewField label="Phone Number" value={formData.phoneNumber} />
//                       <ReviewField label="Employment Status" value={formData.employmentStatus} />
//                       <ReviewField label="Occupation" value={formData.occupation} />
//                       {formData.avatarUrl && (
//                         <div className="space-y-1">
//                           <p className="text-sm font-medium text-muted-foreground">Profile Picture</p>
//                           <img
//                             src={formData.avatarUrl || "/placeholder.svg"}
//                             alt="Avatar"
//                             className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
//                           />
//                         </div>
//                       )}
//                       {formData.idUrl && (
//                         <div className="space-y-1">
//                           <p className="text-sm font-medium text-muted-foreground">ID Document</p>
//                           <a
//                             href={formData.idUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500 hover:underline text-sm"
//                           >
//                             View Document
//                           </a>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       <ReviewField label="Company Name" value={formData.companyName} />
//                       <ReviewField label="Registration Number" value={formData.registrationNumber} />
//                       <ReviewField label="Company Address" value={formData.companyAddress} />
//                       <ReviewField label="Business Type" value={formData.businessType} />
//                       <ReviewField label="Incorporation Date" value={formData.incorporationDate} />
//                       <div className="md:col-span-2 mt-4">
//                         <h4 className="font-semibold mb-2">Authorized Representative</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <ReviewField label="Name" value={formData.authorizedRepName} />
//                           <ReviewField label="Position" value={formData.authorizedRepPosition} />
//                           <ReviewField label="Email" value={formData.authorizedRepEmail} />
//                           <ReviewField label="Phone" value={formData.authorizedRepPhone} />
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Investment Objectives Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Investment Objectives</h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleEditStep(2)}
//                     className="flex items-center gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField label="Primary Goal" value={formData.primaryGoal} />
//                   <ReviewField label="Time Horizon" value={formData.timeHorizon} />
//                   <ReviewField label="Risk Tolerance" value={formData.riskTolerance} />
//                   <ReviewField label="Investment Experience" value={formData.investmentExperience} />
//                 </div>
//               </div>

//               {/* Regulatory Information Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Regulatory Information</h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleEditStep(3)}
//                     className="flex items-center gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField label="Politically Exposed Person (PEP)" value={formData.isPEP} />
//                   <ReviewField label="Privacy Policy Accepted" value={formData.consentToDataCollection} />
//                   <ReviewField label="Terms & Conditions Accepted" value={formData.agreeToTerms} />
//                 </div>
//               </div>

//               {/* Enhanced Due Diligence Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between border-b pb-2">
//                   <h3 className="text-lg font-semibold">Enhanced Due Diligence</h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleEditStep(4)}
//                     className="flex items-center gap-2"
//                   >
//                     <Edit className="h-4 w-4" />
//                     Edit
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <ReviewField label="Source of Wealth" value={formData.sourceOfWealth} />
//                   <ReviewField label="Business Ownership" value={formData.businessOwnership} />
//                   <ReviewField label="Employment Income" value={formData.employmentIncome} />
//                   <ReviewField label="Expected Investment" value={formData.expectedInvestment} />
//                   <ReviewField label="Own a Business" value={formData.hasBusiness || "N/A"} />

//                   {formData.hasBusiness === "yes" && (
//                     <>
//                       <ReviewField label="Business Name" value={formData.businessName} />
//                       <ReviewField label="Business Address" value={formData.businessAddress} />
//                       <ReviewField label="Establishment Date" value={formData.establishmentDate} />
//                       <ReviewField label="Ownership Percentage" value={formData.ownershipPercentage} />
//                     </>
//                   )}

//                   <ReviewField label="Family Member Details (PEP)" value={formData.familyMemberDetails} />
//                   <ReviewField label="Public Position" value={formData.publicPosition} />
//                   <ReviewField label="Nationality" value={formData.relationshipToCountry} />
//                   <ReviewField label="Sanctions/Legal Issues" value={formData.sanctionsOrLegal} />
//                 </div>
//               </div>

//               {/* Warning if sanctions */}
//               {formData.sanctionsOrLegal === "yes" && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                   <p className="text-sm text-red-800 font-semibold">
//                     ⚠️ You have indicated past sanctions or legal activities. You cannot proceed with account opening.
//                   </p>
//                 </div>
//               )}

//               {/* PEP Notice */}
//               {formData.isPEP === "yes" && (
//                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//                   <p className="text-sm text-yellow-800">
//                     ℹ️ As a Politically Exposed Person, your application will undergo additional review.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="flex justify-between">
//         <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
//           Previous
//         </Button>

//         {currentStep < steps.length - 1 ? (
//           <Button onClick={handleNext} disabled={!isStepValid(currentStep) || tinValidating}>
//             {tinValidating ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Validating TIN...
//               </span>
//             ) : (
//               "Next"
//             )}
//           </Button>
//         ) : (
//           <Button
//             onClick={handleSubmit}
//             disabled={loading || !isStepValid(5) || formData.sanctionsOrLegal === "yes" || !userId}
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Submitting...
//               </span>
//             ) : (
//               "Complete Onboarding"
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
  consentToDataCollection: false,
  agreeToTerms: false,

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
        title: "Review", 
        description: "Confirm your details" 
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
    validateStep5()

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
      toast.error("Please complete all required steps")
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
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View document
          </a>
        </div>
      ) : (
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

              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-3 pt-4 border-t">
                <div className="relative">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <Label className="text-sm font-medium">Profile Picture (Optional)</Label>
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url
                    if (url) {
                      updateFormData("avatarUrl", url)
                      toast.success("Profile picture uploaded!")
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`)
                  }}
                  className="mt-2"
                />
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

                <div className="space-y-4 pt-4 border-t">
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
                            id="consent-in-modal"
                            checked={formData.consentToDataCollection}
                            onCheckedChange={(checked) => updateFormData("consentToDataCollection", checked as boolean)}
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
                            id="terms-in-modal"
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
                  <Label htmlFor="employmentIncome">Annual Employment Income *</Label>
                  <Input
                    id="employmentIncome"
                    value={formData.employmentIncome}
                    onChange={(e) => updateFormData("employmentIncome", e.target.value)}
                    placeholder="Enter your annual income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedInvestment">Expected Investment Amount *</Label>
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
                  endpoint="documentUploader"
                />

                <DocumentUploadCard
                  label="Bank Statement (Last 3 months)"
                  required
                  value={formData.bankStatementUrl}
                  field="bankStatementUrl"
                  endpoint="documentUploader"
                />

                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-4">Optional Documents</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    These documents can help speed up your application review.
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    <DocumentUploadCard
                      label="Passport Photo"
                      value={formData.passportPhotoUrl}
                      field="passportPhotoUrl"
                      endpoint="imageUploader"
                    />

                    <DocumentUploadCard
                      label="TIN Certificate"
                      value={formData.tinCertificateUrl}
                      field="tinCertificateUrl"
                      endpoint="documentUploader"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 — REVIEW */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Almost Done!</h4>
                <p className="text-sm text-green-800">
                  Please review your information before submitting. You can edit any section by clicking the Edit button.
                </p>
              </div>

              {/* Account Type */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">Account Type</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(0)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <ReviewField
                  label="Registration Type"
                  value={formData.entityType === "individual" ? "Individual Account" : "Company Account"}
                />
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(1)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.entityType === "individual" ? (
                    <>
                      <ReviewField label="Full Name" value={formData.fullName} />
                      <ReviewField label="Date of Birth" value={formData.dateOfBirth} />
                      <ReviewField label="TIN" value={formData.tin} />
                      <ReviewField label="Phone" value={formData.phoneNumber} />
                      <ReviewField label="Email" value={formData.email} />
                      <ReviewField label="Address" value={formData.homeAddress} />
                      <ReviewField label="Employment" value={formData.employmentStatus} />
                      <ReviewField label="Occupation" value={formData.occupation} />
                    </>
                  ) : (
                    <>
                      <ReviewField label="Company Name" value={formData.companyName} />
                      <ReviewField label="Registration #" value={formData.registrationNumber} />
                      <ReviewField label="Business Type" value={formData.businessType} />
                      <ReviewField label="Incorporation Date" value={formData.incorporationDate} />
                      <ReviewField label="Company Address" value={formData.companyAddress} />
                      <ReviewField label="Representative" value={formData.authorizedRepName} />
                      <ReviewField label="Rep. Position" value={formData.authorizedRepPosition} />
                      <ReviewField label="Rep. Email" value={formData.authorizedRepEmail} />
                    </>
                  )}
                </div>
              </div>

              {/* Investment Profile */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">Investment Profile</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(2)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewField label="Investment Goal" value={formData.primaryGoal} />
                  <ReviewField label="Time Horizon" value={formData.timeHorizon} />
                  <ReviewField label="Risk Tolerance" value={formData.riskTolerance} />
                  <ReviewField label="Experience Level" value={formData.investmentExperience} />
                </div>
              </div>

              {/* Compliance */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">Compliance</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(3)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewField label="PEP Status" value={formData.isPEP} />
                  <ReviewField label="Privacy Policy" value={formData.consentToDataCollection} />
                  <ReviewField label="Terms Accepted" value={formData.agreeToTerms} />
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">Financial Information</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(4)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewField label="Source of Wealth" value={formData.sourceOfWealth} />
                  <ReviewField label="Annual Income" value={formData.employmentIncome} />
                  <ReviewField label="Expected Investment" value={formData.expectedInvestment} />
                  <ReviewField label="Sanctions/Legal" value={formData.sanctionsOrLegal} />
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStep(5)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {formData.nationalIdUrl ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm">National ID/Passport</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="text-sm">National ID/Passport (Missing)</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.bankStatementUrl ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Bank Statement</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="text-sm">Bank Statement (Missing)</span>
                      </>
                    )}
                  </div>
                  {formData.passportPhotoUrl && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Passport Photo</span>
                    </div>
                  )}
                  {formData.tinCertificateUrl && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm">TIN Certificate</span>
                    </div>
                  )}
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