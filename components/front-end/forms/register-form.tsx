


// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { createUser as createUserAction } from "@/actions/auth";
// import { toast } from "sonner";
// import { Eye, EyeOff, FileText, CreditCard, UserCircle, Shield, FileCheck, X, Check, ChevronsUpDown } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";

// export function RegisterForm() {
//   const router = useRouter();

//   const [form, setForm] = React.useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [countryCode, setCountryCode] = React.useState("+256"); // Default to Uganda
//   const [countrySearchTerm, setCountrySearchTerm] = React.useState("");
//   const [openCountrySelect, setOpenCountrySelect] = React.useState(false);

//   // African countries with their codes
//   const africanCountries = [
//     { code: "+213", country: "Algeria", flag: "🇩🇿" },
//     { code: "+244", country: "Angola", flag: "🇦🇴" },
//     { code: "+229", country: "Benin", flag: "🇧🇯" },
//     { code: "+267", country: "Botswana", flag: "🇧🇼" },
//     { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
//     { code: "+257", country: "Burundi", flag: "🇧🇮" },
//     { code: "+237", country: "Cameroon", flag: "🇨🇲" },
//     { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
//     { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
//     { code: "+235", country: "Chad", flag: "🇹🇩" },
//     { code: "+269", country: "Comoros", flag: "🇰🇲" },
//     { code: "+243", country: "Congo (DRC)", flag: "🇨🇩" },
//     { code: "+242", country: "Congo (Republic)", flag: "🇨🇬" },
//     { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
//     { code: "+253", country: "Djibouti", flag: "🇩🇯" },
//     { code: "+20", country: "Egypt", flag: "🇪🇬" },
//     { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
//     { code: "+291", country: "Eritrea", flag: "🇪🇷" },
//     { code: "+268", country: "Eswatini", flag: "🇸🇿" },
//     { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
//     { code: "+241", country: "Gabon", flag: "🇬🇦" },
//     { code: "+220", country: "Gambia", flag: "🇬🇲" },
//     { code: "+233", country: "Ghana", flag: "🇬🇭" },
//     { code: "+224", country: "Guinea", flag: "🇬🇳" },
//     { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
//     { code: "+254", country: "Kenya", flag: "🇰🇪" },
//     { code: "+266", country: "Lesotho", flag: "🇱🇸" },
//     { code: "+231", country: "Liberia", flag: "🇱🇷" },
//     { code: "+218", country: "Libya", flag: "🇱🇾" },
//     { code: "+261", country: "Madagascar", flag: "🇲🇬" },
//     { code: "+265", country: "Malawi", flag: "🇲🇼" },
//     { code: "+223", country: "Mali", flag: "🇲🇱" },
//     { code: "+222", country: "Mauritania", flag: "🇲🇷" },
//     { code: "+230", country: "Mauritius", flag: "🇲🇺" },
//     { code: "+212", country: "Morocco", flag: "🇲🇦" },
//     { code: "+258", country: "Mozambique", flag: "🇲🇿" },
//     { code: "+264", country: "Namibia", flag: "🇳🇦" },
//     { code: "+227", country: "Niger", flag: "🇳🇪" },
//     { code: "+234", country: "Nigeria", flag: "🇳🇬" },
//     { code: "+250", country: "Rwanda", flag: "🇷🇼" },
//     { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
//     { code: "+221", country: "Senegal", flag: "🇸🇳" },
//     { code: "+248", country: "Seychelles", flag: "🇸🇨" },
//     { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
//     { code: "+252", country: "Somalia", flag: "🇸🇴" },
//     { code: "+27", country: "South Africa", flag: "🇿🇦" },
//     { code: "+211", country: "South Sudan", flag: "🇸🇸" },
//     { code: "+249", country: "Sudan", flag: "🇸🇩" },
//     { code: "+255", country: "Tanzania", flag: "🇹🇿" },
//     { code: "+228", country: "Togo", flag: "🇹🇬" },
//     { code: "+216", country: "Tunisia", flag: "🇹🇳" },
//     { code: "+256", country: "Uganda", flag: "🇺🇬" },
//     { code: "+260", country: "Zambia", flag: "🇿🇲" },
//     { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
//   ];

//   // Filter countries based on search term
//   const filteredCountries = africanCountries.filter((country) => {
//     const searchLower = countrySearchTerm.toLowerCase();
//     return (
//       country.country.toLowerCase().includes(searchLower) ||
//       country.code.includes(searchLower)
//     );
//   });

//   const [error, setError] = React.useState<string | null>(null);
//   const [loading, setLoading] = React.useState(false);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

//   // Dialog control
//   const [openTos, setOpenTos] = React.useState(false);
//   const [openPrivacy, setOpenPrivacy] = React.useState(false);

//   // Acceptance gates
//   const [acceptedTos, setAcceptedTos] = React.useState(false);
//   const [acceptedPrivacy, setAcceptedPrivacy] = React.useState(false);

//   // Inside-dialog checkboxes
//   const [tosConfirm, setTosConfirm] = React.useState(false);
//   const [privacyConfirm, setPrivacyConfirm] = React.useState(false);

//   // Pre-registration overlay states
//   const [showRequirementsOverlay, setShowRequirementsOverlay] = React.useState(true);
//   const [acceptedDataProtection, setAcceptedDataProtection] = React.useState(false);
//   const [acceptedPortfolioManagement, setAcceptedPortfolioManagement] = React.useState(false);
//   const [acknowledgedDocuments, setAcknowledgedDocuments] = React.useState(false);

//   const canSubmit = acceptedTos && acceptedPrivacy && !loading;
//   const canProceedFromOverlay = acceptedDataProtection && acceptedPortfolioManagement && acknowledgedDocuments;

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (form.password.length < 8) return setError("Password must be at least 8 characters.");
//     if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
//     if (!acceptedTos || !acceptedPrivacy) return setError("You must accept the Terms and the Privacy Policy.");

//     try {
//       setLoading(true);
//       await createUserAction({
//         firstName: form.firstName.trim(),
//         lastName: form.lastName.trim(),
//         email: form.email.trim().toLowerCase(),
//         phone: `${countryCode}${form.phone.trim()}`, // Combine country code with phone number
//         password: form.password,
//       });
//       toast.success("Account created! Check your email for the 6-digit verification code.");
//       router.replace(`/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
//     } catch (err: any) {
//       setError(err?.message || "Failed to create account. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTosConfirmChange = (checked: boolean) => {
//     setTosConfirm(checked);
//     if (checked) {
//       setAcceptedTos(true);
//       setOpenTos(false);
//     }
//   };

//   const handlePrivacyConfirmChange = (checked: boolean) => {
//     setPrivacyConfirm(checked);
//     if (checked) {
//       setAcceptedPrivacy(true);
//       setOpenPrivacy(false);
//     }
//   };

//   const handleProceedToRegistration = () => {
//     if (canProceedFromOverlay) {
//       setShowRequirementsOverlay(false);
//     }
//   };

//   return (
//     <>
//       {/* Requirements Overlay */}
//       {showRequirementsOverlay && (
//         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             {/* Header */}
//             <div className="border-b p-6 flex items-center justify-between flex-shrink-0">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
//                   <FileCheck className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold">Before You Begin</h2>
//                   <p className="text-sm text-muted-foreground">Required documents and agreements</p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => router.back()}
//                 className="hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             {/* Scrollable Content */}
//             <ScrollArea className="flex-1 overflow-auto">
//               <div className="p-6 space-y-6">
//                 {/* Required Documents Section */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-primary" />
//                     Required Documents
//                   </h3>
//                   <p className="text-sm text-muted-foreground">
//                     Please ensure you have the following documents ready for upload during the verification process:
//                   </p>
                  
//                   <div className="space-y-3">
//                     <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
//                       <CreditCard className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-medium text-sm">Valid National ID or Passport</p>
//                         <p className="text-xs text-muted-foreground">Both front and back sides (clear, readable copy)</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
//                       <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-medium text-sm">Bank Statements</p>
//                         <p className="text-xs text-muted-foreground">Last 6 months of statements from your primary bank</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
//                       <UserCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-medium text-sm">Passport Photo</p>
//                         <p className="text-xs text-muted-foreground">Recent passport-size photograph (white background)</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
//                       <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-medium text-sm">Valid and Active TIN Certificate</p>
//                         <p className="text-xs text-muted-foreground">Tax Identification Number certificate issued by Uganda Revenue Authority</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
//                     <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
//                     <p className="text-xs text-amber-900 dark:text-amber-200">
//                       All documents will be securely stored and used only for verification purposes in compliance with data protection regulations.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Agreements Section */}
//                 <div className="space-y-4 pt-4 border-t">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <FileCheck className="h-5 w-5 text-primary" />
//                     Required Agreements
//                   </h3>

//                   <div className="space-y-4">
//                     {/* Document Acknowledgment */}
//                     <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
//                       <Checkbox
//                         id="acknowledgeDocuments"
//                         checked={acknowledgedDocuments}
//                         onCheckedChange={(checked) => setAcknowledgedDocuments(checked as boolean)}
//                         className="mt-1"
//                       />
//                       <label
//                         htmlFor="acknowledgeDocuments"
//                         className="text-sm leading-relaxed cursor-pointer"
//                       >
//                         <span className="font-medium">I acknowledge that I have the required documents</span>
//                         <span className="block text-muted-foreground mt-1">
//                           I confirm that I have all the required documents listed above and am ready to upload them during verification.
//                         </span>
//                       </label>
//                     </div>

//                     {/* Data Protection Agreement */}
//                     <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
//                       <Checkbox
//                         id="dataProtection"
//                         checked={acceptedDataProtection}
//                         onCheckedChange={(checked) => setAcceptedDataProtection(checked as boolean)}
//                         className="mt-1"
//                       />
//                       <label
//                         htmlFor="dataProtection"
//                         className="text-sm leading-relaxed cursor-pointer"
//                       >
//                         <span className="font-medium">Data Protection Agreement</span>
//                         <span className="block text-muted-foreground mt-1">
//                           I agree to the processing of my personal data in accordance with applicable data protection laws and Goldkach's privacy policy. I understand my rights regarding data access, correction, and deletion.
//                         </span>
//                       </label>
//                     </div>

//                     {/* Portfolio Management Agreement */}
//                     <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
//                       <Checkbox
//                         id="portfolioManagement"
//                         checked={acceptedPortfolioManagement}
//                         onCheckedChange={(checked) => setAcceptedPortfolioManagement(checked as boolean)}
//                         className="mt-1"
//                       />
//                       <label
//                         htmlFor="portfolioManagement"
//                         className="text-sm leading-relaxed cursor-pointer"
//                       >
//                         <span className="font-medium">Portfolio Management Agreement</span>
//                         <span className="block text-muted-foreground mt-1">
//                           I understand and accept the terms of Goldkach's portfolio management services, including investment risks, fees, and the fiduciary responsibilities of the platform.
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollArea>

//             {/* Footer */}
//             <div className="border-t p-6 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
//               <div className="flex items-center justify-between gap-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => router.back()}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleProceedToRegistration}
//                   disabled={!canProceedFromOverlay}
//                   size="lg"
//                   className="min-w-[200px]"
//                 >
//                   {canProceedFromOverlay ? "Proceed to Registration" : "Accept All to Continue"}
//                 </Button>
//               </div>
//               {!canProceedFromOverlay && (
//                 <p className="text-xs text-center text-muted-foreground mt-3">
//                   Please accept all requirements to continue
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Registration Form */}
//       <div className="space-y-3">
//         <Image
//           src="/logos/GoldKach-Logo-New-3.png"
//           className="justify-center items-center ml-[calc(50%-40px)]"
//           width={80}
//           height={80}
//           alt="logo"
//         />

//         <div className="space-y-2 text-center lg:text-left">
//           <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
//           <p className="text-muted-foreground">Get started with your investment journey today</p>
//         </div>

//         <form onSubmit={onSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="firstName">First name</Label>
//               <Input
//                 id="firstName"
//                 name="firstName"
//                 type="text"
//                 placeholder="John"
//                 value={form.firstName}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="lastName">Last name</Label>
//               <Input
//                 id="lastName"
//                 name="lastName"
//                 type="text"
//                 placeholder="Doe"
//                 value={form.lastName}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email address</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={form.email}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone number</Label>
//               <div className="flex gap-2">
//                 <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={openCountrySelect}
//                       className="w-[160px] justify-between"
//                     >
//                       <span className="truncate">
//                         {africanCountries.find((c) => c.code === countryCode)?.flag}{" "}
//                         {countryCode}
//                       </span>
//                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-[280px] p-0" align="start">
//                     <Command>
//                       <CommandInput 
//                         placeholder="Search country..." 
//                         value={countrySearchTerm}
//                         onValueChange={setCountrySearchTerm}
//                       />
//                       <CommandList>
//                         <CommandEmpty>No country found.</CommandEmpty>
//                         <CommandGroup>
//                           {filteredCountries.map((country) => (
//                             <CommandItem
//                               key={country.code}
//                               value={`${country.country} ${country.code}`}
//                               onSelect={() => {
//                                 setCountryCode(country.code);
//                                 setOpenCountrySelect(false);
//                                 setCountrySearchTerm("");
//                               }}
//                             >
//                               <Check
//                                 className={cn(
//                                   "mr-2 h-4 w-4",
//                                   countryCode === country.code ? "opacity-100" : "opacity-0"
//                                 )}
//                               />
//                               <span className="mr-2">{country.flag}</span>
//                               <span className="flex-1">{country.country}</span>
//                               <span className="text-muted-foreground">{country.code}</span>
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   placeholder="712345678"
//                   value={form.phone}
//                   onChange={onChange}
//                   required
//                   className="flex-1"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Password field */}
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={form.password}
//                 onChange={onChange}
//                 required
//                 minLength={8}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
//                 onClick={() => setShowPassword((v) => !v)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//             <p className="text-xs text-muted-foreground">At least 8 characters.</p>
//           </div>

//           {/* Confirm Password field */}
//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword">Confirm password</Label>
//             <div className="relative">
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={form.confirmPassword}
//                 onChange={onChange}
//                 required
//                 minLength={8}
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
//                 onClick={() => setShowConfirmPassword((v) => !v)}
//                 aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//               >
//                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Consent row */}
//           <div className="rounded-md border p-3 space-y-2">
//             <p className="text-sm leading-relaxed">
//               You must accept the{" "}
//               <button
//                 type="button"
//                 className="text-primary underline underline-offset-2"
//                 onClick={() => setOpenTos(true)}
//               >
//                 Terms of Service
//               </button>{" "}
//               and the{" "}
//               <button
//                 type="button"
//                 className="text-primary underline underline-offset-2"
//                 onClick={() => setOpenPrivacy(true)}
//               >
//                 Privacy Policy
//               </button>{" "}
//               to create your account.
//             </p>

//             <div className="text-xs text-muted-foreground">
//               Status:{" "}
//               <span className={acceptedTos ? "text-green-600" : "text-amber-600"}>
//                 Terms {acceptedTos ? "accepted" : "pending"}
//               </span>{" "}
//               •{" "}
//               <span className={acceptedPrivacy ? "text-green-600" : "text-amber-600"}>
//                 Privacy {acceptedPrivacy ? "accepted" : "pending"}
//               </span>
//             </div>
//           </div>

//           {error && <p className="text-sm text-red-600">{error}</p>}

//           <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
//             {loading ? "Creating…" : "Create account"}
//           </Button>
//         </form>

//         <p className="text-center text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <a href="/login" className="font-medium text-primary hover:underline">
//             Sign in
//           </a>
//         </p>

//         {/* Terms Dialog */}
//         <Dialog open={openTos} onOpenChange={(o: any) => { setOpenTos(o); if (!o) setTosConfirm(false); }}>
//           <DialogContent className="sm:max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Terms of Service</DialogTitle>
//             </DialogHeader>

//             <ScrollArea className="max-h-80 pr-2">
//               <div className="space-y-3 text-sm text-muted-foreground">
//                 <p><strong>Welcome to Goldkach.</strong> These Terms govern your use of our platform...</p>
//                 <p>1. Eligibility...</p>
//                 <p>2. Accounts & Security...</p>
//                 <p>3. Investments & Risks...</p>
//                 <p>4. Fees...</p>
//                 <p>5. Limitation of liability...</p>
//                 <p>6. Governing law...</p>
//                 <p>… (full legal copy here) …</p>
//               </div>
//             </ScrollArea>

//             <div className="mt-3 flex items-center gap-2">
//               <input
//                 id="tosConfirm"
//                 type="checkbox"
//                 className="h-4 w-4"
//                 checked={tosConfirm}
//                 onChange={(e) => handleTosConfirmChange(e.target.checked)}
//               />
//               <label htmlFor="tosConfirm" className="text-sm">
//                 I have read and agree to the Terms of Service.
//               </label>
//             </div>

//             <DialogFooter className="mt-2">
//               <Button variant="outline" onClick={() => setOpenTos(false)}>Close</Button>
//               <Button
//                 onClick={() => {
//                   setAcceptedTos(true);
//                   setOpenTos(false);
//                 }}
//                 disabled={!tosConfirm}
//               >
//                 Accept Terms
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Privacy Dialog */}
//         <Dialog open={openPrivacy} onOpenChange={(o: any) => { setOpenPrivacy(o); if (!o) setPrivacyConfirm(false); }}>
//           <DialogContent className="sm:max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Privacy Policy</DialogTitle>
//             </DialogHeader>

//             <ScrollArea className="max-h-80 pr-2">
//               <div className="space-y-3 text-sm text-muted-foreground">
//                 <p><strong>Your privacy matters.</strong> This Policy explains how we collect, use, and protect your data…</p>
//                 <p>1. Information we collect...</p>
//                 <p>2. How we use information...</p>
//                 <p>3. Sharing & disclosures...</p>
//                 <p>4. Security...</p>
//                 <p>5. Data retention...</p>
//                 <p>6. Your rights...</p>
//                 <p>… (full legal copy here) …</p>
//               </div>
//             </ScrollArea>

//             <div className="mt-3 flex items-center gap-2">
//               <input
//                 id="privacyConfirm"
//                 type="checkbox"
//                 className="h-4 w-4"
//                 checked={privacyConfirm}
//                 onChange={(e) => handlePrivacyConfirmChange(e.target.checked)}
//               />
//               <label htmlFor="privacyConfirm" className="text-sm">
//                 I have read and agree to the Privacy Policy.
//               </label>
//             </div>

//             <DialogFooter className="mt-2">
//               <Button variant="outline" onClick={() => setOpenPrivacy(false)}>Close</Button>
//               <Button
//                 onClick={() => {
//                   setAcceptedPrivacy(true);
//                   setOpenPrivacy(false);
//                 }}
//                 disabled={!privacyConfirm}
//               >
//                 Accept Policy
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// }

// export default RegisterForm;





"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Eye, EyeOff, FileText, CreditCard, UserCircle, Shield, FileCheck, X, Check, ChevronsUpDown, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [countryCode, setCountryCode] = React.useState("+256"); // Default to Uganda
  const [countrySearchTerm, setCountrySearchTerm] = React.useState("");
  const [openCountrySelect, setOpenCountrySelect] = React.useState(false);

  // African countries with their codes
  const africanCountries = [
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

  // Filter countries based on search term
  const filteredCountries = africanCountries.filter((country) => {
    const searchLower = countrySearchTerm.toLowerCase();
    return (
      country.country.toLowerCase().includes(searchLower) ||
      country.code.includes(searchLower)
    );
  });

  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
    phone?: string;
  }>({});
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Dialog control
  const [openTos, setOpenTos] = React.useState(false);
  const [openPrivacy, setOpenPrivacy] = React.useState(false);

  // Acceptance gates
  const [acceptedTos, setAcceptedTos] = React.useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState(false);

  // Inside-dialog checkboxes
  const [tosConfirm, setTosConfirm] = React.useState(false);
  const [privacyConfirm, setPrivacyConfirm] = React.useState(false);

  // Pre-registration overlay states
  const [showRequirementsOverlay, setShowRequirementsOverlay] = React.useState(true);
  const [acceptedDataProtection, setAcceptedDataProtection] = React.useState(false);
  const [acceptedPortfolioManagement, setAcceptedPortfolioManagement] = React.useState(false);
  const [acknowledgedDocuments, setAcknowledgedDocuments] = React.useState(false);

  const canSubmit = acceptedTos && acceptedPrivacy && !loading;
  const canProceedFromOverlay = acceptedDataProtection && acceptedPortfolioManagement && acknowledgedDocuments;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    
    // Clear field-specific errors when user types
    if (name === "email" && fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (name === "phone" && fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (!acceptedTos || !acceptedPrivacy) return setError("You must accept the Terms and the Privacy Policy.");

    try {
      setLoading(true);
      await createUserAction({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: `${countryCode}${form.phone.trim()}`,
        password: form.password,
      });
      toast.success("Account created successfully!", {
        description: "Check your email for the 6-digit verification code."
      });
      router.replace(`/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
    } catch (err: any) {
      // Try to parse the error message as JSON
      try {
        const errorData = JSON.parse(err?.message || "{}");
        
        if (errorData.errors) {
          setFieldErrors(errorData.errors);
          
          // Check if both email and phone are duplicates
          if (errorData.errors.email && errorData.errors.phone) {
            setError("Account already exists. Please try creating a different account or login with your existing credentials.");
            toast.error("Account Already Exists", {
              description: "An account with this email and phone number already exists. Please login instead."
            });
          } else if (errorData.errors.email) {
            setError("Email address is already registered. Please use a different email or login.");
            toast.error("Email Already Registered", {
              description: "This email address is already in use. Please use a different email or login."
            });
          } else if (errorData.errors.phone) {
            setError("Phone number is already registered. Please use a different phone number or login.");
            toast.error("Phone Number Already Registered", {
              description: "This phone number is already in use. Please use a different number or login."
            });
          } else {
            setError(errorData.message || "Failed to create account. Please try again.");
            toast.error("Registration Failed", {
              description: errorData.message || "Please try again."
            });
          }
        } else {
          setError(errorData.message || "Failed to create account. Please try again.");
          toast.error("Registration Failed", {
            description: errorData.message || "Please try again."
          });
        }
      } catch {
        // If parsing fails, use the original error message
        setError(err?.message || "Failed to create account. Please try again.");
        toast.error("Registration Failed", {
          description: err?.message || "Please try again."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTosConfirmChange = (checked: boolean) => {
    setTosConfirm(checked);
    if (checked) {
      setAcceptedTos(true);
      setOpenTos(false);
    }
  };

  const handlePrivacyConfirmChange = (checked: boolean) => {
    setPrivacyConfirm(checked);
    if (checked) {
      setAcceptedPrivacy(true);
      setOpenPrivacy(false);
    }
  };

  const handleProceedToRegistration = () => {
    if (canProceedFromOverlay) {
      setShowRequirementsOverlay(false);
    }
  };

  return (
    <>
      {/* Requirements Overlay */}
      {showRequirementsOverlay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-6 space-y-6">
                {/* Required Documents Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Required Documents
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please ensure you have the following documents ready for upload during the verification process:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <CreditCard className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Valid National ID or Passport</p>
                        <p className="text-xs text-muted-foreground">Both front and back sides (clear, readable copy)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Bank Statements</p>
                        <p className="text-xs text-muted-foreground">Last 6 months of statements from your primary bank</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <UserCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Passport Photo</p>
                        <p className="text-xs text-muted-foreground">Recent passport-size photograph (white background)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Valid and Active TIN Certificate</p>
                        <p className="text-xs text-muted-foreground">Tax Identification Number certificate issued by Uganda Revenue Authority</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                    <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                      All documents will be securely stored and used only for verification purposes in compliance with data protection regulations.
                    </p>
                  </div>
                </div>

                {/* Agreements Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Required Agreements
                  </h3>

                  <div className="space-y-4">
                    {/* Document Acknowledgment */}
                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                      <Checkbox
                        id="acknowledgeDocuments"
                        checked={acknowledgedDocuments}
                        onCheckedChange={(checked) => setAcknowledgedDocuments(checked as boolean)}
                        className="mt-1"
                      />
                      <label
                        htmlFor="acknowledgeDocuments"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        <span className="font-medium">I acknowledge that I have the required documents</span>
                        <span className="block text-muted-foreground mt-1">
                          I confirm that I have all the required documents listed above and am ready to upload them during verification.
                        </span>
                      </label>
                    </div>

                    {/* Data Protection Agreement */}
                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                      <Checkbox
                        id="dataProtection"
                        checked={acceptedDataProtection}
                        onCheckedChange={(checked) => setAcceptedDataProtection(checked as boolean)}
                        className="mt-1"
                      />
                      <label
                        htmlFor="dataProtection"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        <span className="font-medium">Data Protection Agreement</span>
                        <span className="block text-muted-foreground mt-1">
                          I agree to the processing of my personal data in accordance with applicable data protection laws and Goldkach's privacy policy. I understand my rights regarding data access, correction, and deletion.
                        </span>
                      </label>
                    </div>

                    {/* Portfolio Management Agreement */}
                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                      <Checkbox
                        id="portfolioManagement"
                        checked={acceptedPortfolioManagement}
                        onCheckedChange={(checked) => setAcceptedPortfolioManagement(checked as boolean)}
                        className="mt-1"
                      />
                      <label
                        htmlFor="portfolioManagement"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        <span className="font-medium">Portfolio Management Agreement</span>
                        <span className="block text-muted-foreground mt-1">
                          I understand and accept the terms of Goldkach's portfolio management services, including investment risks, fees, and the fiduciary responsibilities of the platform.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t p-6 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToRegistration}
                  disabled={!canProceedFromOverlay}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {canProceedFromOverlay ? "Proceed to Registration" : "Accept All to Continue"}
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
      )}

      {/* Main Registration Form */}
      <div className="space-y-3">
        <Image
          src="/logos/GoldKach-Logo-New-3.png"
          className="justify-center items-center ml-[calc(50%-40px)]"
          width={80}
          height={80}
          alt="logo"
        />

        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground">Get started with your investment journey today</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
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
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                required
                className={cn(
                  fieldErrors.email && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountrySelect}
                      className="w-[160px] justify-between"
                    >
                      <span className="truncate">
                        {africanCountries.find((c) => c.code === countryCode)?.flag}{" "}
                        {countryCode}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search country..." 
                        value={countrySearchTerm}
                        onValueChange={setCountrySearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCountries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={`${country.country} ${country.code}`}
                              onSelect={() => {
                                setCountryCode(country.code);
                                setOpenCountrySelect(false);
                                setCountrySearchTerm("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  countryCode === country.code ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="mr-2">{country.flag}</span>
                              <span className="flex-1">{country.country}</span>
                              <span className="text-muted-foreground">{country.code}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="712345678"
                  value={form.phone}
                  onChange={onChange}
                  required
                  className={cn(
                    "flex-1",
                    fieldErrors.phone && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
              {fieldErrors.phone && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={onChange}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Consent row */}
          <div className="rounded-md border p-3 space-y-2">
            <p className="text-sm leading-relaxed">
              You must accept the{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-2"
                onClick={() => setOpenTos(true)}
              >
                Terms of Service
              </button>{" "}
              and the{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-2"
                onClick={() => setOpenPrivacy(true)}
              >
                Privacy Policy
              </button>{" "}
              to create your account.
            </p>

            <div className="text-xs text-muted-foreground">
              Status:{" "}
              <span className={acceptedTos ? "text-green-600" : "text-amber-600"}>
                Terms {acceptedTos ? "accepted" : "pending"}
              </span>{" "}
              •{" "}
              <span className={acceptedPrivacy ? "text-green-600" : "text-amber-600"}>
                Privacy {acceptedPrivacy ? "accepted" : "pending"}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </p>

        {/* Terms Dialog */}
        <Dialog open={openTos} onOpenChange={(o: any) => { setOpenTos(o); if (!o) setTosConfirm(false); }}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-80 pr-2">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Welcome to Goldkach.</strong> These Terms govern your use of our platform...</p>
                <p>1. Eligibility...</p>
                <p>2. Accounts & Security...</p>
                <p>3. Investments & Risks...</p>
                <p>4. Fees...</p>
                <p>5. Limitation of liability...</p>
                <p>6. Governing law...</p>
                <p>… (full legal copy here) …</p>
              </div>
            </ScrollArea>

            <div className="mt-3 flex items-center gap-2">
              <input
                id="tosConfirm"
                type="checkbox"
                className="h-4 w-4"
                checked={tosConfirm}
                onChange={(e) => handleTosConfirmChange(e.target.checked)}
              />
              <label htmlFor="tosConfirm" className="text-sm">
                I have read and agree to the Terms of Service.
              </label>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setOpenTos(false)}>Close</Button>
              <Button
                onClick={() => {
                  setAcceptedTos(true);
                  setOpenTos(false);
                }}
                disabled={!tosConfirm}
              >
                Accept Terms
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Privacy Dialog */}
        <Dialog open={openPrivacy} onOpenChange={(o: any) => { setOpenPrivacy(o); if (!o) setPrivacyConfirm(false); }}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Privacy Policy</DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-80 pr-2">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Your privacy matters.</strong> This Policy explains how we collect, use, and protect your data…</p>
                <p>1. Information we collect...</p>
                <p>2. How we use information...</p>
                <p>3. Sharing & disclosures...</p>
                <p>4. Security...</p>
                <p>5. Data retention...</p>
                <p>6. Your rights...</p>
                <p>… (full legal copy here) …</p>
              </div>
            </ScrollArea>

            <div className="mt-3 flex items-center gap-2">
              <input
                id="privacyConfirm"
                type="checkbox"
                className="h-4 w-4"
                checked={privacyConfirm}
                onChange={(e) => handlePrivacyConfirmChange(e.target.checked)}
              />
              <label htmlFor="privacyConfirm" className="text-sm">
                I have read and agree to the Privacy Policy.
              </label>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setOpenPrivacy(false)}>Close</Button>
              <Button
                onClick={() => {
                  setAcceptedPrivacy(true);
                  setOpenPrivacy(false);
                }}
                disabled={!privacyConfirm}
              >
                Accept Policy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default RegisterForm;