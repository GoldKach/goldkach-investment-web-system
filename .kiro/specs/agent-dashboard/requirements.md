# Requirements Document

## Introduction

The Agent Dashboard is a read-only view within the Goldkach Investment Web System that allows staff members with the `AGENT` role to view their assigned clients' personal information, onboarding details, and portfolio performance data. Agents cannot create, edit, or delete any data — the dashboard is strictly observational. The feature lives under a new route group `/agent` (separate from the existing `/dashboard` which is SUPER_ADMIN only) and reuses existing server actions for data fetching.

## Glossary

- **Agent**: A staff member with the `AGENT` role, identified by a `StaffMember` record with `role: "AGENT"`.
- **Agent_Dashboard**: The read-only web interface accessible to authenticated Agents.
- **Assigned_Client**: A user (role `USER`) linked to an Agent via an `AgentClientAssignment` record where `isActive: true`.
- **Client_Profile**: The personal and onboarding information of an Assigned_Client, including `individualOnboarding` or `companyOnboarding` data.
- **Portfolio**: A `UserPortfolioDTO` record belonging to an Assigned_Client, including wallet balances, asset positions, and sub-portfolio history.
- **Portfolio_Performance**: Time-series data from `PortfolioPerformanceReport` records, including `totalCloseValue`, `totalLossGain`, `totalPercentage`, `netAssetValue`, and `totalFees`.
- **Portfolio_Summary**: The aggregated financial snapshot returned by `GET /portfolio-summary/:userId`, covering all portfolios for a single client.
- **Session**: The authenticated server-side session stored in HTTP-only cookies, containing the logged-in user's `id` and `role`.
- **Staff_Profile**: The `StaffProfile` record linked to a `StaffMember`, containing `employeeId`, `department`, and `position`.

---

## Requirements

### Requirement 1: Agent Authentication and Route Access

**User Story:** As an agent, I want to access a dedicated dashboard route, so that I can view my client data without being redirected to the admin dashboard.

#### Acceptance Criteria

1. WHEN an unauthenticated user navigates to `/agent`, THE Agent_Dashboard SHALL redirect the user to `/login`.
2. WHEN an authenticated user with a role other than `AGENT` navigates to `/agent`, THE Agent_Dashboard SHALL redirect the user to `/unauthorized`.
3. WHEN an authenticated user with role `AGENT` navigates to `/agent`, THE Agent_Dashboard SHALL render the agent layout and display the agent's assigned client list.
4. THE Agent_Dashboard SHALL read the authenticated user's `id` and `role` exclusively from the server-side Session cookie, without exposing tokens to the client.

---

### Requirement 2: Assigned Client List

**User Story:** As an agent, I want to see a list of all my assigned clients, so that I can quickly find and navigate to a specific client's information.

#### Acceptance Criteria

1. WHEN an Agent navigates to `/agent`, THE Agent_Dashboard SHALL fetch all `AgentClientAssignment` records where `agentId` matches the Agent's `staffProfile.id` and `isActive` is `true`.
2. THE Agent_Dashboard SHALL display each Assigned_Client's full name, email address, phone number, account status, and approval status.
3. WHEN an Agent has zero active Assigned_Clients, THE Agent_Dashboard SHALL display an empty-state message indicating no clients are currently assigned.
4. THE Agent_Dashboard SHALL provide a search input that filters the displayed client list by client name or email address on the client side without triggering a new server request.
5. IF the data fetch for assigned clients fails, THEN THE Agent_Dashboard SHALL display an error message describing the failure and SHALL NOT render a partial client list.

---

### Requirement 3: Client Profile View

**User Story:** As an agent, I want to view a specific client's personal and onboarding information, so that I can understand their background and investment profile.

#### Acceptance Criteria

1. WHEN an Agent selects an Assigned_Client from the client list, THE Agent_Dashboard SHALL navigate to `/agent/clients/[clientId]` and display that client's Client_Profile.
2. THE Agent_Dashboard SHALL display the client's first name, last name, email, phone number, account status, and `isApproved` flag.
3. WHERE the client has completed `individualOnboarding`, THE Agent_Dashboard SHALL display the individual onboarding details including nationality, date of birth, residential address, TIN, and investment objectives.
4. WHERE the client has completed `companyOnboarding`, THE Agent_Dashboard SHALL display the company onboarding details including company name, registration number, TIN, registered address, and directors list.
5. THE Agent_Dashboard SHALL display the client's master wallet account number and net asset value in read-only format.
6. THE Agent_Dashboard SHALL NOT render any form inputs, edit buttons, or action controls on the Client_Profile view.
7. IF the client profile fetch fails, THEN THE Agent_Dashboard SHALL display an error message and SHALL NOT render a partially loaded profile.

---

### Requirement 4: Client Portfolio List

**User Story:** As an agent, I want to see all portfolios belonging to a client, so that I can get an overview of their investment positions.

#### Acceptance Criteria

1. WHEN an Agent views a client's profile page, THE Agent_Dashboard SHALL fetch the Portfolio_Summary for that client using `GET /portfolio-summary/:userId`.
2. THE Agent_Dashboard SHALL display each portfolio's custom name, linked portfolio template name, risk tolerance, time horizon, total invested amount, current portfolio value, total gain/loss, and return percentage.
3. THE Agent_Dashboard SHALL display the portfolio wallet's net asset value, total fees, and account number for each portfolio.
4. WHEN a client has no active portfolios, THE Agent_Dashboard SHALL display an empty-state message within the portfolio section.
5. THE Agent_Dashboard SHALL NOT render any buttons or controls to create, edit, or delete portfolios.
6. IF the Portfolio_Summary fetch fails, THEN THE Agent_Dashboard SHALL display an error message in the portfolio section and SHALL NOT affect the display of the Client_Profile data.

---

### Requirement 5: Portfolio Performance Detail View

**User Story:** As an agent, I want to view the performance history of a specific client portfolio, so that I can assess how the portfolio is performing over time.

#### Acceptance Criteria

1. WHEN an Agent selects a portfolio from the client portfolio list, THE Agent_Dashboard SHALL navigate to `/agent/clients/[clientId]/portfolios/[userPortfolioId]` and display the Portfolio_Performance detail view.
2. THE Agent_Dashboard SHALL display the portfolio's current `netAssetValue`, `totalCloseValue`, `totalCostPrice`, `totalLossGain`, `totalPercentage`, and `totalFees` from the latest `PortfolioPerformanceReport`.
3. THE Agent_Dashboard SHALL display a list of the portfolio's asset positions, including asset symbol, description, asset class, allocation percentage, cost per share, number of shares (stock), close value, and gain/loss per asset.
4. THE Agent_Dashboard SHALL display the sub-portfolio history (generation slices), showing each sub-portfolio's label, amount invested, total cost price, total close value, total loss/gain, total fees, and cash at bank.
5. THE Agent_Dashboard SHALL fetch historical performance reports for the selected portfolio and display them in a time-ordered list showing report date, close value, NAV, loss/gain, and percentage for each report.
6. WHERE a period filter (daily, weekly, monthly) is selected by the Agent, THE Agent_Dashboard SHALL re-fetch performance reports filtered by that period and update the displayed list.
7. THE Agent_Dashboard SHALL NOT render any controls to generate, delete, or modify performance reports.
8. IF the performance report fetch fails, THEN THE Agent_Dashboard SHALL display an error message and SHALL NOT render a partially loaded performance view.

---

### Requirement 6: Agent Profile Summary

**User Story:** As an agent, I want to see a summary of my own profile and client count, so that I can confirm I am viewing the correct account.

#### Acceptance Criteria

1. WHEN an Agent accesses the Agent_Dashboard, THE Agent_Dashboard SHALL display the Agent's full name, email, role, department, and position from the Agent's `StaffMember` and `Staff_Profile` records.
2. THE Agent_Dashboard SHALL display the total count of the Agent's active Assigned_Clients.
3. THE Agent_Dashboard SHALL NOT render any controls to edit the Agent's own profile or staff settings.
