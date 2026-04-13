import { getSession, getUserById } from '@/actions/auth';
import { DashboardContent } from '@/components/user/dashbaord-content'
import React from 'react'

export default async function Page() {
  const session = await getSession();
  const loggedIn = session?.user;

  if (!loggedIn?.id) return null;

  let raw: any = null;
  try {
    const response = await getUserById(loggedIn.id);
    raw = response?.data ?? response;
  } catch {
    // Fall back to session data if API call fails
    raw = loggedIn;
  }

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
