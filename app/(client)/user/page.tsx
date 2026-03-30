import { getSession, getUserById } from '@/actions/auth';
import { DashboardContent } from '@/components/user/dashbaord-content'
import React from 'react'

export default async function Page() {
  const session = await getSession();
  const loggedIn = session?.user;

  if (!loggedIn?.id) return null;

  const response = await getUserById(loggedIn.id);
  const raw = response?.data ?? response;

  // Map individualOnboarding / companyOnboarding → entityOnboarding expected by DashboardContent
  const individual = raw?.individualOnboarding;
  const company = raw?.companyOnboarding;
  const entityOnboarding =
    raw?.entityOnboarding ??
    (individual ? { ...individual, entityType: "individual", sourceOfWealth: individual.sourceOfIncome } : null) ??
    (company    ? { ...company,    entityType: "company",    sourceOfWealth: company.sourceOfIncome    } : null) ??
    null;

  const user = { ...raw, entityOnboarding };

  return (
    <div>
      <DashboardContent user={user} />
    </div>
  )
}
