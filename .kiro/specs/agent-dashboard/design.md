# Design Document: Agent Dashboard

## Overview

The Agent Dashboard is a read-only portal for staff members with the `AGENT` role. It lives under a new route group `(agent)` at `/agent`, completely separate from the existing `(back)/dashboard` which is SUPER_ADMIN-only. Agents can view their assigned clients' profiles, onboarding details, portfolio summaries, and performance history — but cannot create, edit, or delete any data.

The feature reuses all existing server actions (`staff.ts`, `portfolio-summary.ts`, `portfolioPerformanceReports.ts`, `onboarding.ts`, `auth.ts`) and follows the same Next.js App Router patterns already established in the codebase: server components for data fetching, `getSession()` for auth, and `redirect()` for access control.

---

## Architecture

```mermaid
graph TD
    A[Browser] -->|GET /agent/*| B[Next.js App Router]
    B --> C["(agent) Route Group Layout\napp/(agent)/layout.tsx"]
    C -->|getSession()| D[HTTP-only Cookie]
    C -->|role !== AGENT| E[redirect /unauthorized]
    C -->|no session| F[redirect /login]
    C -->|AGENT session| G[AgentShell Component]
    G --> H[AgentSidebar]
    G --> I[Page Content]
    I --> J["/agent — Client List Page"]
    I --> K["/agent/clients/[clientId] — Client Profile Page"]
    I --> L["/agent/clients/[clientId]/portfolios/[userPortfolioId] — Performance Page"]
    J -->|getAgentClientsAction| M[Backend API /staff/:id/clients]
    K -->|getStaffByIdAction + getUserById + fetchMyIndividualOnboarding + fetchMyCompanyOnboarding + getPortfolioSummary| M
    L -->|listPerformanceReports + getLatestPerformanceReport| M
```

The auth guard lives entirely in the layout server component — no middleware changes needed. The existing `middleware.ts` only sets the `x-pathname` header and is not modified.

---

## Components and Interfaces

### Route Group Structure

```
app/
  (agent)/
    layout.tsx                          ← auth guard + AgentShell wrapper
    agent/
      page.tsx                          ← client list (server component)
      clients/
        [clientId]/
          page.tsx                      ← client profile (server component)
          portfolios/
            [userPortfolioId]/
              page.tsx                  ← performance detail (server component)

components/
  agent/
    agent-shell.tsx                     ← layout shell (sidebar + nav)
    agent-sidebar.tsx                   ← sidebar with agent-specific nav links
    agent-profile-card.tsx              ← agent's own profile summary
    client-list.tsx                     ← client table with client-side search
    client-profile-view.tsx             ← read-only client profile display
    portfolio-list.tsx                  ← portfolio cards for a client
    portfolio-performance-view.tsx      ← performance detail with period filter
    period-filter.tsx                   ← daily/weekly/monthly toggle (client component)
    error-section.tsx                   ← reusable error display
    empty-state.tsx                     ← reusable empty state display
```

### Component Interfaces

```typescript
// AgentShell — mirrors DashboardShell but for agents
interface AgentShellProps {
  user: StaffMember;
  children: React.ReactNode;
}

// ClientList — receives pre-fetched data, handles client-side search
interface ClientListProps {
  assignments: AgentClientAssignment[];
}

// ClientProfileView — pure display, no actions
interface ClientProfileViewProps {
  client: AssignedClient;
  individualOnboarding: any | null;
  companyOnboarding: any | null;
  portfolioSummary: PortfolioSummary | null;
  portfolioError: string | null;
}

// PortfolioPerformanceView — receives latest report + history
interface PortfolioPerformanceViewProps {
  userPortfolioId: string;
  clientId: string;
  latestReport: PortfolioPerformanceReport | null;
  userPortfolio: UserPortfolioDTO;
  initialReports: PortfolioPerformanceReport[];
  initialPeriod: "daily" | "weekly" | "monthly";
}
```

---

## Data Models

The feature consumes existing data models without modification. Key types reused from existing actions:

```typescript
// From actions/staff.ts
StaffMember          // agent's own user record
StaffProfile         // employeeId, department, position
AgentClientAssignment // agentId, clientId, isActive, client: AssignedClient
AssignedClient       // full client record with onboarding + wallet relations

// From actions/portfolio-summary.ts
PortfolioSummary     // aggregate + portfolios[] + masterWallet
PortfolioSummaryItem // per-portfolio: wallet, assets, subPortfolios, topupHistory, latestReport

// From actions/portfolioPerformanceReports.ts
PortfolioPerformanceReport  // reportDate, totalCloseValue, netAssetValue, totalLossGain, totalFees
                             // assetBreakdown[], subPortfolioSnapshots[]

// From actions/onboarding.ts
IndividualOnboarding // nationality, dob, address, TIN, investmentObjectives
CompanyOnboarding    // companyName, regNumber, TIN, address, directors[]
```

No new Prisma schema changes are required. The `AgentClientAssignment` model and `StaffProfile` model already exist and are used by `actions/staff.ts`.

---

## Data Fetching Strategy

All data fetching happens in server components using existing actions. No new API endpoints are needed.

### `/agent` — Client List Page

```typescript
// Parallel fetch: agent's own staff record + assigned clients
const [staffRes, clientsRes] = await Promise.all([
  getStaffByIdAction(session.user.id),          // agent profile for sidebar
  getAgentClientsAction(staffProfile.id),        // active assignments
]);
```

### `/agent/clients/[clientId]` — Client Profile Page

```typescript
// Parallel fetch: client user record + onboarding + portfolio summary
const [clientRes, individualRes, companyRes, summaryRes] = await Promise.all([
  getUserById(clientId),
  fetchMyIndividualOnboarding(clientId),
  fetchMyCompanyOnboarding(clientId),
  getPortfolioSummary(clientId),                 // from portfolio-summary.ts
]);
// Portfolio failure is isolated — profile still renders if summary fails
```

### `/agent/clients/[clientId]/portfolios/[userPortfolioId]` — Performance Page

```typescript
// Parallel fetch: latest report + initial history (default: monthly)
const [latestRes, historyRes] = await Promise.all([
  getLatestPerformanceReport(userPortfolioId),
  listPerformanceReports({ userPortfolioId, period: "monthly" }),
]);
// Period filter re-fetches via a client component calling a server action
```

### Period Filter Re-fetch

The period filter (`daily` / `weekly` / `monthly`) is a client component that calls `listPerformanceReports` as a server action on change. This avoids a full page navigation while keeping data fetching server-side.

---

## Auth Guard Approach

The `(agent)/layout.tsx` server component performs all auth and authorization:

```typescript
export default async function AgentLayout({ children }) {
  const session = await getSession();                    // reads HTTP-only cookie
  if (!session?.user) redirect("/login");
  if (session.user.role !== "AGENT") redirect("/unauthorized");

  // Fetch agent's staff profile to get staffProfile.id for client queries
  const staffRes = await getStaffByIdAction(session.user.id);
  if (!staffRes.success || !staffRes.data) redirect("/unauthorized");

  return <AgentShell staff={staffRes.data}>{children}</AgentShell>;
}
```

Key points:
- No middleware changes — auth is enforced at the layout level, consistent with how `(back)/layout.tsx` works
- `getSession()` reads only from HTTP-only cookies — tokens never reach the client
- The `staffProfile.id` (not `user.id`) is what the backend uses as `agentId` in assignments; the layout resolves this once and passes it down via the shell

### Read-Only Enforcement Strategy

Read-only is enforced by omission: agent-facing components simply never render `<Button>`, `<form>`, `<input>`, or any mutation-triggering UI. No server action wrappers for mutations are imported in the `(agent)` route group. There is no client-side state for edit modes. This is a structural guarantee — there is nothing to click.

---

## UI Layout and Navigation

The agent layout mirrors the admin `DashboardShell` pattern but with a simplified sidebar:

```
┌─────────────────────────────────────────────────────┐
│  GOLDKACH  │  Agent Portal                           │
│  Sidebar   │  ─────────────────────────────────────  │
│            │  Page content                           │
│  • Overview│                                         │
│  • Clients │                                         │
│            │                                         │
│  ──────────│                                         │
│  [Agent    │                                         │
│   Profile] │                                         │
└─────────────────────────────────────────────────────┘
```

Agent sidebar links:
- Overview → `/agent`
- My Clients → `/agent` (same page, alias)

The agent profile card in the sidebar footer shows: full name, email, role badge (`AGENT`), department, position, and active client count.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Non-AGENT roles are always redirected

*For any* authenticated session where `role !== "AGENT"`, navigating to any route under `/agent` should result in a redirect to `/unauthorized`.

**Validates: Requirements 1.2**

### Property 2: Client list only shows active assignments

*For any* agent, every client displayed in the client list should correspond to an `AgentClientAssignment` record where `agentId` matches the agent's `staffProfile.id` and `isActive` is `true`. No inactive assignments should appear.

**Validates: Requirements 2.1**

### Property 3: Client list search filters correctly

*For any* search query string and list of assigned clients, every client displayed after filtering should have a name or email that contains the query string (case-insensitive), and no client whose name and email both do not contain the query should be displayed.

**Validates: Requirements 2.4**

### Property 4: Client profile renders all required fields

*For any* assigned client, the rendered client profile should contain the client's first name, last name, email, phone number, account status, and `isApproved` flag.

**Validates: Requirements 3.2**

### Property 5: Individual onboarding fields are all present

*For any* client with `individualOnboarding` data, the rendered profile should contain nationality, date of birth, residential address, TIN, and investment objectives.

**Validates: Requirements 3.3**

### Property 6: Company onboarding fields are all present

*For any* client with `companyOnboarding` data, the rendered profile should contain company name, registration number, TIN, registered address, and at least one director entry.

**Validates: Requirements 3.4**

### Property 7: Portfolio cards render all required fields

*For any* portfolio in a client's portfolio summary, the rendered portfolio card should contain the custom name, portfolio template name, risk tolerance, time horizon, total invested, portfolio value, total gain/loss, return percentage, wallet NAV, total fees, and wallet account number.

**Validates: Requirements 4.2, 4.3**

### Property 8: Performance detail renders all required metric fields

*For any* portfolio performance detail view with a latest report, the rendered page should contain `netAssetValue`, `totalCloseValue`, `totalCostPrice`, `totalLossGain`, `totalPercentage`, and `totalFees`.

**Validates: Requirements 5.2**

### Property 9: Asset positions render all required fields

*For any* asset position in a portfolio, the rendered row should contain asset symbol, description, asset class, allocation percentage, cost per share, stock (shares), close value, and gain/loss.

**Validates: Requirements 5.3**

### Property 10: Sub-portfolio history renders all required fields

*For any* sub-portfolio slice in a portfolio, the rendered row should contain label, amount invested, total cost price, total close value, total loss/gain, total fees, and cash at bank.

**Validates: Requirements 5.4**

### Property 11: Performance reports are displayed in time order

*For any* list of performance reports fetched for a portfolio, the reports displayed should be ordered by `reportDate` descending (most recent first).

**Validates: Requirements 5.5**

### Property 12: Agent profile summary renders all required fields

*For any* agent session, the rendered agent profile summary should contain the agent's full name, email, role, department, position, and the count of active assigned clients.

**Validates: Requirements 6.1, 6.2**

### Property 13: Active client count matches displayed list length

*For any* agent, the active client count displayed in the agent profile summary should equal the number of clients shown in the client list (before any search filtering is applied).

**Validates: Requirements 6.2, 2.1**

### Property 14: No mutation controls anywhere in the agent dashboard

*For any* page rendered within the `(agent)` route group, the rendered HTML should contain no `<form>` elements, no buttons with edit/delete/create semantics, and no `<input>` elements outside of the client-side search field.

**Validates: Requirements 3.6, 4.5, 5.7, 6.3**

---

## Error Handling

Each data fetch is isolated so that one failure does not cascade:

| Failure | Behavior |
|---|---|
| `getAgentClientsAction` fails | Show error card in client list area; no partial list rendered |
| `getUserById` fails | Show full-page error; do not render partial profile |
| `getPortfolioSummary` fails | Show error card in portfolio section only; client profile section still renders |
| `listPerformanceReports` fails | Show error card in performance section; do not render partial report list |
| `getLatestPerformanceReport` fails | Show "No report available" in the metrics section |
| Period filter re-fetch fails | Show inline error in the history list; keep last successful data visible |

All error states use a shared `<ErrorSection message={...} />` component for consistency.

---

## Testing Strategy

### Unit Tests

- `AgentLayout` redirects unauthenticated users to `/login`
- `AgentLayout` redirects non-AGENT roles to `/unauthorized`
- `AgentLayout` renders children for valid AGENT sessions
- `ClientList` renders empty state when `assignments` is empty
- `ClientProfileView` renders error state when profile fetch fails
- `ClientProfileView` renders portfolio error section independently of profile data
- Period filter triggers re-fetch with correct period parameter
- Navigation from client list to `/agent/clients/[clientId]` uses correct URL

### Property-Based Tests

Property-based tests use **fast-check** (already available in the JS ecosystem, compatible with the existing TypeScript/Next.js stack). Each test runs a minimum of 100 iterations.

```
// Feature: agent-dashboard, Property 1: Non-AGENT roles are always redirected
// Feature: agent-dashboard, Property 2: Client list only shows active assignments
// Feature: agent-dashboard, Property 3: Client list search filters correctly
// Feature: agent-dashboard, Property 4: Client profile renders all required fields
// Feature: agent-dashboard, Property 5: Individual onboarding fields are all present
// Feature: agent-dashboard, Property 6: Company onboarding fields are all present
// Feature: agent-dashboard, Property 7: Portfolio cards render all required fields
// Feature: agent-dashboard, Property 8: Performance detail renders all required metric fields
// Feature: agent-dashboard, Property 9: Asset positions render all required fields
// Feature: agent-dashboard, Property 10: Sub-portfolio history renders all required fields
// Feature: agent-dashboard, Property 11: Performance reports are displayed in time order
// Feature: agent-dashboard, Property 12: Agent profile summary renders all required fields
// Feature: agent-dashboard, Property 13: Active client count matches displayed list length
// Feature: agent-dashboard, Property 14: No mutation controls anywhere in the agent dashboard
```

**Property test approach:**
- Properties 3, 11, 13, 14 are pure functions (filter logic, sort order, count equality, DOM structure) — test the component render functions directly with generated inputs
- Properties 2, 4–10, 12 test rendering completeness — generate random data objects and assert rendered output contains all required fields
- Property 1 tests the auth guard function — generate random role strings and assert redirect behavior
- Each property test references its design document property via the tag comment above the test
