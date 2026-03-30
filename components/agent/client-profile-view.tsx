import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import type { AssignedClient } from "@/actions/staff";

interface ClientProfileViewProps {
  client: AssignedClient;
  individualOnboarding: any | null;
  companyOnboarding: any | null;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 dark:text-slate-200">{value || "—"}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-[#2B2F77]/20 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ClientProfileView({ client, individualOnboarding, companyOnboarding }: ClientProfileViewProps) {
  const displayName = `${client.firstName} ${client.lastName}`;

  return (
    <div className="space-y-5">
      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="First Name" value={client.firstName} />
          <Field label="Last Name" value={client.lastName} />
          <Field label="Email" value={client.email} />
          <Field label="Phone" value={client.phone} />
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Status</p>
            <Badge
              variant="outline"
              className={`text-xs ${
                client.status === "ACTIVE"
                  ? "border-green-300 text-green-700 dark:text-green-400"
                  : "border-slate-300 text-slate-500"
              }`}
            >
              {client.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Approved</p>
            <div className="flex items-center gap-1.5">
              {client.isApproved ? (
                <><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm text-green-600">Yes</span></>
              ) : (
                <><XCircle className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-500">No</span></>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Master Wallet */}
      {client.masterWallet && (
        <Section title="Master Wallet">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Account Number" value={client.masterWallet.accountNumber} />
            <Field
              label="Net Asset Value"
              value={
                client.masterWallet.netAssetValue != null
                  ? `$${Number(client.masterWallet.netAssetValue).toLocaleString()}`
                  : undefined
              }
            />
            <Field label="Status" value={client.masterWallet.status} />
          </div>
        </Section>
      )}

      {/* Individual Onboarding */}
      {individualOnboarding && (
        <Section title="Individual Onboarding">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Nationality" value={individualOnboarding.nationality} />
            <Field label="Date of Birth" value={individualOnboarding.dateOfBirth} />
            <Field label="TIN" value={individualOnboarding.tin} />
            <Field
              label="Residential Address"
              value={
                individualOnboarding.residentialAddress
                  ? typeof individualOnboarding.residentialAddress === "string"
                    ? individualOnboarding.residentialAddress
                    : [
                        individualOnboarding.residentialAddress.street,
                        individualOnboarding.residentialAddress.city,
                        individualOnboarding.residentialAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                  : null
              }
            />
            <Field label="Investment Objectives" value={individualOnboarding.investmentObjectives} />
          </div>
        </Section>
      )}

      {/* Company Onboarding */}
      {companyOnboarding && (
        <Section title="Company Onboarding">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Company Name" value={companyOnboarding.companyName} />
            <Field label="Registration Number" value={companyOnboarding.registrationNumber} />
            <Field label="TIN" value={companyOnboarding.tin} />
            <Field
              label="Registered Address"
              value={
                companyOnboarding.registeredAddress
                  ? typeof companyOnboarding.registeredAddress === "string"
                    ? companyOnboarding.registeredAddress
                    : [
                        companyOnboarding.registeredAddress.street,
                        companyOnboarding.registeredAddress.city,
                        companyOnboarding.registeredAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")
                  : null
              }
            />
          </div>

          {/* Directors */}
          {Array.isArray(companyOnboarding.directors) && companyOnboarding.directors.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Directors</p>
              <div className="space-y-2">
                {companyOnboarding.directors.map((d: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#2B2F77]/10 rounded-lg px-3 py-2"
                  >
                    <span className="font-medium">{d.name || `${d.firstName} ${d.lastName}`}</span>
                    {d.role && <span className="text-slate-400">· {d.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
