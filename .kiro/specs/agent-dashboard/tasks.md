# Implementation Plan: Agent Dashboard

## Overview

Build a read-only agent portal under `app/(agent)/` that mirrors the existing `(back)` route group patterns. All data fetching uses existing server actions. Auth is enforced at the layout level via `getSession()` + role check, consistent with `app/(back)/layout.tsx`. UI components live in `components/agent/`.

## Tasks

- [x] 1. Install fast-check and configure the test runner
  - Add `fast-check`, `vitest`, `@vitejs/plugin-react`, and `@testing-library/react` as dev dependencies
  - Create `vitest.config.ts` at the project root configured for Next.js/React (jsdom environment)
  - Add a `"test"` script to `package.json`: `"vitest --run"`
  - _Requirements: Testing Strategy (design.md)_

- [x] 2. Create shared agent UI components
  - [x] 2.1 Create `components/agent/error-section.tsx`
    - Props: `{ message: string; className?: string }`
    - Renders a styled error card with the message — no interactive controls
    - _Requirements: 2.5, 3.7, 4.6, 5.8_

  - [x] 2.2 Create `components/agent/empty-state.tsx`
    - Props: `{ message: string; className?: string }`
    - Renders a centered empty-state illustration placeholder and message
    - _Requirements: 2.3, 4.4_

  - [ ]* 2.3 Write unit tests for `ErrorSection` and `EmptyState`
    - Test that `ErrorSection` renders the provided message
    - Test that `EmptyState` renders the provided message
    - Test that neither component renders `<form>`, `<input>`, or mutation buttons
    - _Requirements: 3.6, 4.5, 5.7_

- [ ] 3. Create `AgentSidebar` and `AgentShell` layout components
  - [ ] 3.1 Create `components/agent/agent-sidebar.tsx`
    - Mirror `components/back/app-sidebar.tsx` structure using `SidebarProvider` / `SidebarInset` from `@/components/ui/sidebar`
    - Nav links: "Overview" → `/agent`, "My Clients" → `/agent`
    - Accept `staff: StaffMember` and `activeClientCount: number` props
    - Render `AgentProfileCard` in the sidebar footer
    - _Requirements: 6.1, 6.2_

  - [x] 3.2 Create `components/agent/agent-profile-card.tsx`
    - Props: `{ staff: StaffMember; activeClientCount: number }`
    - Display: full name, email, role badge (`AGENT`), department, position, active client count
    - Read-only — no edit controls
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 3.3 Create `components/agent/agent-shell.tsx`
    - Client component mirroring `components/back/dashboard-shell.tsx`
    - Props: `{ staff: StaffMember; activeClientCount: number; children: React.ReactNode }`
    - Wraps `AgentSidebar` + `SidebarInset` with a top nav showing the agent's name
    - _Requirements: 6.1_

  - [ ]* 3.4 Write property test for agent profile summary rendering (Property 12)
    - **Property 12: Agent profile summary renders all required fields**
    - Generate arbitrary `StaffMember` objects and `activeClientCount` values with fast-check
    - Assert rendered `AgentProfileCard` contains full name, email, role, department, position, and client count
    - **Validates: Requirements 6.1, 6.2**

  - [ ]* 3.5 Write property test for active client count display (Property 13)
    - **Property 13: Active client count matches displayed list length**
    - Generate a list of `AgentClientAssignment` objects (all `isActive: true`) and assert the count shown in `AgentProfileCard` equals the list length
    - **Validates: Requirements 6.2, 2.1**

- [ ] 4. Create the `(agent)` route group auth guard layout
  - Create `app/(agent)/layout.tsx` as a server component
  - Call `getSession()` — redirect to `/login` if no session
  - Redirect to `/unauthorized` if `session.user.role !== "AGENT"`
  - Call `getStaffByIdAction(session.user.id)` — redirect to `/unauthorized` if it fails or returns no data
  - Fetch `getAgentClientsAction(staffRes.data.staffProfile.id)` to get `activeClientCount`
  - Render `<AgentShell staff={staffRes.data} activeClientCount={...}>{children}</AgentShell>`
  - Export `dynamic = "force-dynamic"`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 4.1 Write unit tests for `AgentLayout` auth guard
    - Mock `getSession` returning `null` → assert redirect to `/login`
    - Mock `getSession` returning a non-AGENT role → assert redirect to `/unauthorized`
    - Mock `getSession` returning `AGENT` role with valid staff → assert children render
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 4.2 Write property test for non-AGENT role redirect (Property 1)
    - **Property 1: Non-AGENT roles are always redirected**
    - Generate arbitrary role strings (excluding `"AGENT"`) with fast-check
    - Assert the layout redirects to `/unauthorized` for every generated role
    - **Validates: Requirements 1.2**

- [ ] 5. Create `ClientList` component and the `/agent` client list page
  - [ ] 5.1 Create `components/agent/client-list.tsx`
    - Client component; props: `{ assignments: AgentClientAssignment[] }`
    - Render a `<input type="search">` for client-side filtering by name or email (case-insensitive)
    - Render a table/card list showing: full name, email, phone, status, `isApproved` badge, and a link to `/agent/clients/[clientId]`
    - When `assignments` is empty, render `<EmptyState message="No clients assigned." />`
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ] 5.2 Create `app/(agent)/agent/page.tsx` as a server component
    - Call `getStaffByIdAction(session.user.id)` to resolve `staffProfile.id`
    - Call `getAgentClientsAction(staffProfile.id)` — on failure render `<ErrorSection />`
    - Pass `assignments` to `<ClientList />`
    - Export `dynamic = "force-dynamic"`
    - _Requirements: 2.1, 2.5_

  - [ ]* 5.3 Write unit tests for `ClientList`
    - Test empty state renders when `assignments = []`
    - Test all required fields (name, email, phone, status, isApproved) are rendered for each client
    - Test that the link to `/agent/clients/[clientId]` uses the correct `clientId`
    - _Requirements: 2.2, 2.3_

  - [ ]* 5.4 Write property test for client list search filtering (Property 3)
    - **Property 3: Client list search filters correctly**
    - Generate arbitrary arrays of `AgentClientAssignment` objects and arbitrary query strings with fast-check
    - Assert every displayed client's name or email contains the query (case-insensitive)
    - Assert no client whose name and email both exclude the query is displayed
    - **Validates: Requirements 2.4**

  - [ ]* 5.5 Write property test for active assignments only (Property 2)
    - **Property 2: Client list only shows active assignments**
    - Generate mixed arrays of active and inactive assignments with fast-check
    - Assert only assignments where `isActive === true` are rendered
    - **Validates: Requirements 2.1**

- [ ] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Create `ClientProfileView` and `PortfolioList` components
  - [ ] 7.1 Create `components/agent/client-profile-view.tsx`
    - Props: `{ client: AssignedClient; individualOnboarding: any | null; companyOnboarding: any | null }`
    - Display client fields: first name, last name, email, phone, status, `isApproved`
    - Conditionally render individual onboarding section: nationality, DOB, address, TIN, investment objectives
    - Conditionally render company onboarding section: company name, reg number, TIN, address, directors list
    - No `<form>`, `<input>` (except read-only display), or mutation buttons
    - _Requirements: 3.2, 3.3, 3.4, 3.6_

  - [ ] 7.2 Create `components/agent/portfolio-list.tsx`
    - Props: `{ portfolios: PortfolioSummaryItem[]; clientId: string }`
    - Render a card per portfolio: custom name, template name, risk tolerance, time horizon, total invested, portfolio value, gain/loss, return %, wallet NAV, total fees, account number
    - Each card links to `/agent/clients/[clientId]/portfolios/[portfolio.id]`
    - When `portfolios` is empty, render `<EmptyState message="No portfolios found." />`
    - No create/edit/delete controls
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [ ] 7.3 Create `app/(agent)/agent/clients/[clientId]/page.tsx` as a server component
    - Parallel fetch: `getUserById(clientId)`, `fetchMyIndividualOnboarding(clientId)`, `fetchMyCompanyOnboarding(clientId)`, `getPortfolioSummary(clientId)`
    - If `getUserById` fails, render full-page `<ErrorSection />`
    - If `getPortfolioSummary` fails, render `<ErrorSection />` only in the portfolio section; profile still renders
    - Pass data to `<ClientProfileView />` and `<PortfolioList />`
    - Export `dynamic = "force-dynamic"`
    - _Requirements: 3.1, 3.2, 3.5, 3.7, 4.1, 4.6_

  - [ ]* 7.4 Write property test for client profile required fields (Property 4)
    - **Property 4: Client profile renders all required fields**
    - Generate arbitrary `AssignedClient` objects with fast-check
    - Assert rendered `ClientProfileView` contains first name, last name, email, phone, status, and `isApproved`
    - **Validates: Requirements 3.2**

  - [ ]* 7.5 Write property test for individual onboarding fields (Property 5)
    - **Property 5: Individual onboarding fields are all present**
    - Generate arbitrary individual onboarding objects with fast-check
    - Assert rendered output contains nationality, DOB, address, TIN, and investment objectives
    - **Validates: Requirements 3.3**

  - [ ]* 7.6 Write property test for company onboarding fields (Property 6)
    - **Property 6: Company onboarding fields are all present**
    - Generate arbitrary company onboarding objects (with at least one director) with fast-check
    - Assert rendered output contains company name, reg number, TIN, address, and at least one director entry
    - **Validates: Requirements 3.4**

  - [ ]* 7.7 Write property test for portfolio card required fields (Property 7)
    - **Property 7: Portfolio cards render all required fields**
    - Generate arbitrary `PortfolioSummaryItem` arrays with fast-check
    - Assert each rendered card contains custom name, template name, risk tolerance, time horizon, total invested, portfolio value, gain/loss, return %, wallet NAV, total fees, and account number
    - **Validates: Requirements 4.2, 4.3**

  - [ ]* 7.8 Write unit tests for `ClientProfileView` error and portfolio-error isolation
    - Test that a failed profile fetch renders full-page `ErrorSection`
    - Test that a failed portfolio fetch renders `ErrorSection` only in the portfolio section while the profile section still renders
    - _Requirements: 3.7, 4.6_

- [ ] 8. Create `PeriodFilter` and `PortfolioPerformanceView` components
  - [ ] 8.1 Create `components/agent/period-filter.tsx`
    - Client component; props: `{ value: "daily" | "weekly" | "monthly"; onChange: (p: "daily" | "weekly" | "monthly") => void }`
    - Render three toggle buttons for daily / weekly / monthly
    - No server mutations — only calls `onChange`
    - _Requirements: 5.6_

  - [ ] 8.2 Create `components/agent/portfolio-performance-view.tsx`
    - Client component; props match `PortfolioPerformanceViewProps` from design.md
    - Display latest report metrics: `netAssetValue`, `totalCloseValue`, `totalCostPrice`, `totalLossGain`, `totalPercentage`, `totalFees`
    - Display asset positions table: symbol, description, asset class, allocation %, cost/share, stock, close value, gain/loss
    - Display sub-portfolio history table: label, amount invested, cost price, close value, loss/gain, fees, cash at bank
    - Display historical reports list sorted by `reportDate` descending
    - Render `<PeriodFilter />` and on change call `listPerformanceReports` server action, update history list; on error show inline `<ErrorSection />`
    - No generate/delete/modify controls
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ] 8.3 Create `app/(agent)/agent/clients/[clientId]/portfolios/[userPortfolioId]/page.tsx` as a server component
    - Parallel fetch: `getLatestPerformanceReport(userPortfolioId)`, `listPerformanceReports({ userPortfolioId, period: "monthly" })`
    - If history fetch fails, render `<ErrorSection />`
    - Pass data to `<PortfolioPerformanceView />`
    - Export `dynamic = "force-dynamic"`
    - _Requirements: 5.1, 5.8_

  - [ ]* 8.4 Write property test for performance detail required metric fields (Property 8)
    - **Property 8: Performance detail renders all required metric fields**
    - Generate arbitrary `PortfolioPerformanceReport` objects with fast-check
    - Assert rendered `PortfolioPerformanceView` contains `netAssetValue`, `totalCloseValue`, `totalCostPrice`, `totalLossGain`, `totalPercentage`, and `totalFees`
    - **Validates: Requirements 5.2**

  - [ ]* 8.5 Write property test for asset position required fields (Property 9)
    - **Property 9: Asset positions render all required fields**
    - Generate arbitrary `UserPortfolioAsset` arrays with fast-check
    - Assert each rendered row contains symbol, description, asset class, allocation %, cost/share, stock, close value, and gain/loss
    - **Validates: Requirements 5.3**

  - [ ]* 8.6 Write property test for sub-portfolio history required fields (Property 10)
    - **Property 10: Sub-portfolio history renders all required fields**
    - Generate arbitrary `SubPortfolioSnapshot` arrays with fast-check
    - Assert each rendered row contains label, amount invested, cost price, close value, loss/gain, fees, and cash at bank
    - **Validates: Requirements 5.4**

  - [ ]* 8.7 Write property test for performance reports time ordering (Property 11)
    - **Property 11: Performance reports are displayed in time order**
    - Generate arbitrary arrays of `PortfolioPerformanceReport` objects with unordered `reportDate` values using fast-check
    - Assert the rendered list displays reports in descending `reportDate` order (most recent first)
    - **Validates: Requirements 5.5**

  - [ ]* 8.8 Write unit test for period filter re-fetch
    - Test that selecting a period calls `listPerformanceReports` with the correct `period` parameter
    - Test that a failed re-fetch shows inline `ErrorSection` without clearing the previous list
    - _Requirements: 5.6_

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Write property test for no mutation controls (Property 14)
  - [ ]* 10.1 Write property test for no mutation controls in agent dashboard (Property 14)
    - **Property 14: No mutation controls anywhere in the agent dashboard**
    - Render each agent component (`ClientList`, `ClientProfileView`, `PortfolioList`, `PortfolioPerformanceView`, `AgentProfileCard`) with generated data using fast-check
    - Assert rendered HTML contains no `<form>` elements, no buttons with edit/delete/create semantics, and no `<input>` elements outside the search field in `ClientList`
    - **Validates: Requirements 3.6, 4.5, 5.7, 6.3**

- [ ] 11. Wire everything together and verify navigation
  - [ ] 11.1 Verify `app/(agent)/layout.tsx` correctly passes `staffProfile.id` context to child pages via the shell
    - Confirm the client list page resolves `staffProfile.id` from the session (not `user.id`) when calling `getAgentClientsAction`
    - _Requirements: 2.1_

  - [ ] 11.2 Verify all navigation links are correct
    - Client list → `/agent/clients/[clientId]` uses `assignment.client.id`
    - Portfolio card → `/agent/clients/[clientId]/portfolios/[portfolio.id]` uses `portfolio.id` (the `userPortfolioId`)
    - _Requirements: 3.1, 5.1_

  - [ ] 11.3 Add `unauthorized` page if it does not already exist
    - Create `app/unauthorized/page.tsx` with a simple message and a link back to `/login` if the route is missing
    - _Requirements: 1.2_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- fast-check is not yet in the project — Task 1 installs it along with vitest
- All data fetching uses existing server actions; no new API endpoints are needed
- The `staffProfile.id` (not `user.id`) is the `agentId` used by `getAgentClientsAction`
- Read-only enforcement is structural: agent components never import mutation actions
- Property tests reference their design document property number in the task title
