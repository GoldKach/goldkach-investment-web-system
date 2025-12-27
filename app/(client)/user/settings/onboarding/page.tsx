"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building,
  Briefcase,
  Target,
  FileText,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Clock,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { 
    getOnboardingInfo,
  updateOnboardingInfo,
  updateKycDocuments,
  EntityOnboarding,
  UpdateOnboardingInput,

 } from "@/actions/acccountSettings";

export default function OnboardingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState<EntityOnboarding | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);

  // Form states for different sections
  const [personalForm, setPersonalForm] = useState({
    homeAddress: "",
    phoneNumber: "",
  });

  const [employmentForm, setEmploymentForm] = useState({
    employmentStatus: "",
    occupation: "",
    employmentIncome: "",
    sourceOfWealth: "",
  });

  const [businessForm, setBusinessForm] = useState({
    businessName: "",
    businessAddress: "",
    businessType: "",
    businessOwnership: "",
    companyName: "",
    companyAddress: "",
  });

  const [investmentForm, setInvestmentForm] = useState({
    primaryGoal: "",
    timeHorizon: "",
    riskTolerance: "",
    expectedInvestment: "",
  });

  const [repForm, setRepForm] = useState({
    authorizedRepName: "",
    authorizedRepEmail: "",
    authorizedRepPhone: "",
    authorizedRepPosition: "",
  });

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const fetchOnboarding = async () => {
    setLoading(true);
    const result = await getOnboardingInfo();
    if (result.success && result.data) {
      setOnboarding(result.data);
      
      // Populate forms
      setPersonalForm({
        homeAddress: result.data.homeAddress || "",
        phoneNumber: result.data.phoneNumber || "",
      });

      setEmploymentForm({
        employmentStatus: result.data.employmentStatus || "",
        occupation: result.data.occupation || "",
        employmentIncome: result.data.employmentIncome || "",
        sourceOfWealth: result.data.sourceOfWealth || "",
      });

      setBusinessForm({
        businessName: result.data.businessName || "",
        businessAddress: result.data.businessAddress || "",
        businessType: result.data.businessType || "",
        businessOwnership: result.data.businessOwnership || "",
        companyName: result.data.companyName || "",
        companyAddress: result.data.companyAddress || "",
      });

      setInvestmentForm({
        primaryGoal: result.data.primaryGoal || "",
        timeHorizon: result.data.timeHorizon || "",
        riskTolerance: result.data.riskTolerance || "",
        expectedInvestment: result.data.expectedInvestment || "",
      });

      setRepForm({
        authorizedRepName: result.data.authorizedRepName || "",
        authorizedRepEmail: result.data.authorizedRepEmail || "",
        authorizedRepPhone: result.data.authorizedRepPhone || "",
        authorizedRepPosition: result.data.authorizedRepPosition || "",
      });
    } else {
      toast.error(result.error || "Failed to load onboarding information");
    }
    setLoading(false);
  };

  const handleSave = async (data: UpdateOnboardingInput) => {
    setSaving(true);
    const result = await updateOnboardingInfo(data);
    if (result.success) {
      toast.success(result.message || "Information updated successfully");
      fetchOnboarding();
    } else {
      toast.error(result.error || "Failed to update information");
    }
    setSaving(false);
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(personalForm);
  };

  const handleEmploymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(employmentForm);
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(businessForm);
  };

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(investmentForm);
  };

  const handleRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(repForm);
  };

  if (loading) {
    return <OnboardingSkeleton />;
  }

  if (!onboarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Onboarding Information Not Found</h2>
        <p className="text-muted-foreground">Please complete your onboarding first</p>
        <Button onClick={fetchOnboarding}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Onboarding Information
          </h1>
          <p className="text-muted-foreground">
            Update your KYC and onboarding details
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onboarding.isApproved ? (
            <Badge variant="default" className="text-green-600 bg-green-100">
              <CheckCircle className="h-3 w-3 mr-1" />
              KYC Approved
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
              <Clock className="h-3 w-3 mr-1" />
              Pending Verification
            </Badge>
          )}
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{onboarding.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entity Type</p>
              <p className="font-medium capitalize">{onboarding.entityType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TIN</p>
              <p className="font-medium">{onboarding.tin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(onboarding.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="employment" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Employment</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="investment" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Investment</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your contact and address details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePersonalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Home Address</Label>
                  <Input
                    id="homeAddress"
                    value={personalForm.homeAddress}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, homeAddress: e.target.value })
                    }
                    placeholder="Enter your home address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={personalForm.phoneNumber}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, phoneNumber: e.target.value })
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment">
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
              <CardDescription>
                Update your employment and income details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmploymentSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select
                      value={employmentForm.employmentStatus}
                      onValueChange={(value) =>
                        setEmploymentForm({ ...employmentForm, employmentStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={employmentForm.occupation}
                      onChange={(e) =>
                        setEmploymentForm({ ...employmentForm, occupation: e.target.value })
                      }
                      placeholder="Enter your occupation"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employmentIncome">Employment Income Range</Label>
                    <Select
                      value={employmentForm.employmentIncome}
                      onValueChange={(value) =>
                        setEmploymentForm({ ...employmentForm, employmentIncome: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="below-1m">Below 1,000,000 UGX</SelectItem>
                        <SelectItem value="1m-5m">1,000,000 - 5,000,000 UGX</SelectItem>
                        <SelectItem value="5m-10m">5,000,000 - 10,000,000 UGX</SelectItem>
                        <SelectItem value="10m-50m">10,000,000 - 50,000,000 UGX</SelectItem>
                        <SelectItem value="above-50m">Above 50,000,000 UGX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceOfWealth">Source of Wealth</Label>
                    <Select
                      value={employmentForm.sourceOfWealth}
                      onValueChange={(value) =>
                        setEmploymentForm({ ...employmentForm, sourceOfWealth: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary">Salary/Employment</SelectItem>
                        <SelectItem value="business">Business Income</SelectItem>
                        <SelectItem value="investments">Investments</SelectItem>
                        <SelectItem value="inheritance">Inheritance</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business and company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessForm.businessName}
                      onChange={(e) =>
                        setBusinessForm({ ...businessForm, businessName: e.target.value })
                      }
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={businessForm.businessType}
                      onValueChange={(value) =>
                        setBusinessForm({ ...businessForm, businessType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="limited-company">Limited Company</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    value={businessForm.businessAddress}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, businessAddress: e.target.value })
                    }
                    placeholder="Enter business address"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessOwnership">Ownership Percentage</Label>
                    <Input
                      id="businessOwnership"
                      value={businessForm.businessOwnership}
                      onChange={(e) =>
                        setBusinessForm({ ...businessForm, businessOwnership: e.target.value })
                      }
                      placeholder="e.g., 100%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name (if employed)</Label>
                    <Input
                      id="companyName"
                      value={businessForm.companyName}
                      onChange={(e) =>
                        setBusinessForm({ ...businessForm, companyName: e.target.value })
                      }
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input
                    id="companyAddress"
                    value={businessForm.companyAddress}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, companyAddress: e.target.value })
                    }
                    placeholder="Enter company address"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Authorized Representative */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Authorized Representative</CardTitle>
              <CardDescription>
                Update authorized representative details (for companies)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRepSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepName">Representative Name</Label>
                    <Input
                      id="authorizedRepName"
                      value={repForm.authorizedRepName}
                      onChange={(e) =>
                        setRepForm({ ...repForm, authorizedRepName: e.target.value })
                      }
                      placeholder="Enter representative name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepPosition">Position</Label>
                    <Input
                      id="authorizedRepPosition"
                      value={repForm.authorizedRepPosition}
                      onChange={(e) =>
                        setRepForm({ ...repForm, authorizedRepPosition: e.target.value })
                      }
                      placeholder="e.g., Director, CEO"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepEmail">Representative Email</Label>
                    <Input
                      id="authorizedRepEmail"
                      type="email"
                      value={repForm.authorizedRepEmail}
                      onChange={(e) =>
                        setRepForm({ ...repForm, authorizedRepEmail: e.target.value })
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorizedRepPhone">Representative Phone</Label>
                    <Input
                      id="authorizedRepPhone"
                      value={repForm.authorizedRepPhone}
                      onChange={(e) =>
                        setRepForm({ ...repForm, authorizedRepPhone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Tab */}
        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <CardTitle>Investment Profile</CardTitle>
              <CardDescription>
                Update your investment goals and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvestmentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryGoal">Primary Investment Goal</Label>
                  <Select
                    value={investmentForm.primaryGoal}
                    onValueChange={(value) =>
                      setInvestmentForm({ ...investmentForm, primaryGoal: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wealth-growth">Wealth Growth</SelectItem>
                      <SelectItem value="retirement">Retirement Planning</SelectItem>
                      <SelectItem value="income">Regular Income</SelectItem>
                      <SelectItem value="education">Education Funding</SelectItem>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timeHorizon">Investment Time Horizon</Label>
                    <Select
                      value={investmentForm.timeHorizon}
                      onValueChange={(value) =>
                        setInvestmentForm({ ...investmentForm, timeHorizon: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select horizon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                        <SelectItem value="medium">Medium-term (3-7 years)</SelectItem>
                        <SelectItem value="long">Long-term (7+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Select
                      value={investmentForm.riskTolerance}
                      onValueChange={(value) =>
                        setInvestmentForm({ ...investmentForm, riskTolerance: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedInvestment">Expected Investment Amount</Label>
                  <Select
                    value={investmentForm.expectedInvestment}
                    onValueChange={(value) =>
                      setInvestmentForm({ ...investmentForm, expectedInvestment: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-5m">Below 5,000,000 UGX</SelectItem>
                      <SelectItem value="5m-20m">5,000,000 - 20,000,000 UGX</SelectItem>
                      <SelectItem value="20m-50m">20,000,000 - 50,000,000 UGX</SelectItem>
                      <SelectItem value="50m-100m">50,000,000 - 100,000,000 UGX</SelectItem>
                      <SelectItem value="above-100m">Above 100,000,000 UGX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
              <CardDescription>
                View and update your identity documents. Updating documents will require re-verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar/Photo */}
              <div className="space-y-4">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  {onboarding.avatarUrl ? (
                    <img
                      src={onboarding.avatarUrl}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a clear photo of yourself
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>

              {/* ID Document */}
              <div className="space-y-4">
                <Label>Identity Document</Label>
                <div className="flex items-start gap-4">
                  {onboarding.idUrl ? (
                    <img
                      src={onboarding.idUrl}
                      alt="ID Document"
                      className="h-32 w-48 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="h-32 w-48 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a clear copy of your National ID, Passport, or Driving License
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Important Notice</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Updating your KYC documents will set your verification status to pending. 
                      Your documents will need to be re-verified by an administrator before you can 
                      access all features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Read-only Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Verified Information</CardTitle>
              <CardDescription>
                These details cannot be changed directly. Contact support to update.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{onboarding.fullName}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(onboarding.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">TIN Number</p>
                  <p className="font-medium">{onboarding.tin}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Entity Type</p>
                  <p className="font-medium capitalize">{onboarding.entityType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OnboardingSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>
      <Skeleton className="h-[100px]" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[400px]" />
    </div>
  );
}