"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitOnboarding } from "@/actions/onboarding";
import { toast } from "sonner";

type Props = {
  user?: { emailVerified?: boolean; email?: string; id?: string };
};

export default function OnboardingForm({ user }: Props) {
  const router = useRouter();

  // Guard: only after email verified
  React.useEffect(() => {
    if (user && user.emailVerified === false) {
      toast.error("Please verify your email first.");
      router.replace(`/verify-email?email=${encodeURIComponent(user.email || "")}`);
    }
  }, [user, router]);

  const [entityType, setEntityType] = React.useState<"individual" | "company">("individual");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<any>({
    // Shared
    entityType: "individual",
    fullName: "",
    dateOfBirth: "",
    tin: "",
    avatarUrl: "",
    idUrl: "",
    homeAddress: "",
    email: user?.email ?? "",
    phoneNumber: "",
    employmentStatus: "",
    occupation: "",

    // Company (optional unless entityType === company)
    companyName: "",
    hasBusiness: "no",
    registrationNumber: "",
    companyAddress: "",
    businessType: "",
    incorporationDate: "",

    authorizedRepName: "",
    authorizedRepEmail: "",
    authorizedRepPhone: "",
    authorizedRepPosition: "",

    // Investor profile
    primaryGoal: "",
    timeHorizon: "",
    riskTolerance: "",
    investmentExperience: "",
    isPEP: "no", // your model uses string; can be "yes"/"no"
    sanctionsOrLegal: "no",

    consentToDataCollection: false,
    agreeToTerms: false,

    // Financial details (strings in your model)
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
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((p: any) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // minimal client-side checks
    if (!form.fullName || !form.tin || !form.email || !form.phoneNumber) {
      return setError("Please fill all required fields.");
    }
    if (!form.agreeToTerms || !form.consentToDataCollection) {
      return setError("You must accept the Terms and the data consent.");
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        entityType,
      };
      const res = await submitOnboarding(payload,user?.id || "");
      if (!res.success) {
        setError(res.error || "Failed to submit onboarding.");
        return;
      }
      toast.success("Onboarding submitted!");
      router.replace("/dashboard"); // or /kyc, /review, etc.
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Onboarding</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself to finish account setup.</p>
      </div>

      {/* Entity type */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={entityType === "individual" ? "default" : "outline"}
          onClick={() => setEntityType("individual")}
        >
          Individual
        </Button>
        <Button
          type="button"
          variant={entityType === "company" ? "default" : "outline"}
          onClick={() => setEntityType("company")}
        >
          Company
        </Button>
      </div>

      {/* Core info */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="font-medium">Personal details</h3>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" value={form.fullName} onChange={onChange} required />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tin">TIN</Label>
            <Input id="tin" name="tin" value={form.tin} onChange={onChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone</Label>
            <Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="homeAddress">Home address</Label>
          <Input id="homeAddress" name="homeAddress" value={form.homeAddress} onChange={onChange} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employmentStatus">Employment status</Label>
            <Input id="employmentStatus" name="employmentStatus" value={form.employmentStatus} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" name="occupation" value={form.occupation} onChange={onChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
            <Input id="avatarUrl" name="avatarUrl" value={form.avatarUrl} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idUrl">ID Document URL (optional)</Label>
            <Input id="idUrl" name="idUrl" value={form.idUrl} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Company section */}
      {entityType === "company" && (
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="font-medium">Company details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" name="companyName" value={form.companyName} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration number</Label>
              <Input id="registrationNumber" name="registrationNumber" value={form.registrationNumber} onChange={onChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company address</Label>
              <Input id="companyAddress" name="companyAddress" value={form.companyAddress} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business type</Label>
              <Input id="businessType" name="businessType" value={form.businessType} onChange={onChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incorporationDate">Incorporation date</Label>
              <Input id="incorporationDate" name="incorporationDate" type="date" value={form.incorporationDate} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hasBusiness">Has other business?</Label>
              <Input id="hasBusiness" name="hasBusiness" placeholder="yes/no" value={form.hasBusiness} onChange={onChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorizedRepName">Authorized rep name</Label>
              <Input id="authorizedRepName" name="authorizedRepName" value={form.authorizedRepName} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizedRepPosition">Authorized rep position</Label>
              <Input id="authorizedRepPosition" name="authorizedRepPosition" value={form.authorizedRepPosition} onChange={onChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorizedRepEmail">Authorized rep email</Label>
              <Input id="authorizedRepEmail" name="authorizedRepEmail" type="email" value={form.authorizedRepEmail} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizedRepPhone">Authorized rep phone</Label>
              <Input id="authorizedRepPhone" name="authorizedRepPhone" value={form.authorizedRepPhone} onChange={onChange} />
            </div>
          </div>
        </div>
      )}

      {/* Investment profile */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="font-medium">Investment profile</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryGoal">Primary goal</Label>
            <Input id="primaryGoal" name="primaryGoal" value={form.primaryGoal} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Time horizon</Label>
            <Input id="timeHorizon" name="timeHorizon" value={form.timeHorizon} onChange={onChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Risk tolerance</Label>
            <Input id="riskTolerance" name="riskTolerance" value={form.riskTolerance} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="investmentExperience">Experience</Label>
            <Input id="investmentExperience" name="investmentExperience" value={form.investmentExperience} onChange={onChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="isPEP">Politically Exposed Person (yes/no)</Label>
            <Input id="isPEP" name="isPEP" value={form.isPEP} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sanctionsOrLegal">Sanctions/Legal issues (yes/no)</Label>
            <Input id="sanctionsOrLegal" name="sanctionsOrLegal" value={form.sanctionsOrLegal} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Financial details */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="font-medium">Financial details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sourceOfWealth">Source of wealth</Label>
            <Input id="sourceOfWealth" name="sourceOfWealth" value={form.sourceOfWealth} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessOwnership">Business ownership</Label>
            <Input id="businessOwnership" name="businessOwnership" value={form.businessOwnership} onChange={onChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employmentIncome">Employment income</Label>
            <Input id="employmentIncome" name="employmentIncome" value={form.employmentIncome} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedInvestment">Expected investment</Label>
            <Input id="expectedInvestment" name="expectedInvestment" value={form.expectedInvestment} onChange={onChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input id="businessName" name="businessName" value={form.businessName} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business address</Label>
            <Input id="businessAddress" name="businessAddress" value={form.businessAddress} onChange={onChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="establishmentDate">Establishment date</Label>
            <Input id="establishmentDate" name="establishmentDate" type="date" value={form.establishmentDate} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownershipPercentage">Ownership %</Label>
            <Input id="ownershipPercentage" name="ownershipPercentage" value={form.ownershipPercentage} onChange={onChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyMemberDetails">Family member details</Label>
          <Input id="familyMemberDetails" name="familyMemberDetails" value={form.familyMemberDetails} onChange={onChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publicPosition">Public position</Label>
          <Input id="publicPosition" name="publicPosition" value={form.publicPosition} onChange={onChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationshipToCountry">Relationship to country</Label>
          <Input id="relationshipToCountry" name="relationshipToCountry" value={form.relationshipToCountry} onChange={onChange} />
        </div>
      </div>

      {/* Consents */}
      <div className="rounded-md border p-4 space-y-2">
        <div className="flex items-center gap-2">
          <input
            id="consentToDataCollection"
            name="consentToDataCollection"
            type="checkbox"
            checked={form.consentToDataCollection}
            onChange={onChange}
          />
          <Label htmlFor="consentToDataCollection">I consent to data collection.</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={form.agreeToTerms}
            onChange={onChange}
          />
          <Label htmlFor="agreeToTerms">I agree to the Terms of Service.</Label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Submit onboarding"}
      </Button>
    </form>
  );
}
