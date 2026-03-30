# Requirements Document

## Introduction

This feature adds a delete button to the Actions column of the client listing table in the admin dashboard. Administrators need the ability to permanently remove client accounts directly from the listing view, with a confirmation step to prevent accidental deletions. The delete action calls the existing `deleteUser` server action and removes the client from the local UI state on success.

## Glossary

- **Client_Listing**: The `ClientsListing` component rendered at `/dashboard/users/clients`, displaying a paginated, filterable table of all users with role `USER`.
- **Actions_Column**: The rightmost column in the client table, currently containing a dropdown menu with "View Details" and "Approve" options.
- **Delete_Dialog**: A modal confirmation dialog presented to the administrator before a client account is permanently deleted.
- **Delete_Action**: The `deleteUser(userId)` server action defined in `actions/auth.ts` that calls `DELETE /users/:id` on the backend API.
- **Administrator**: An authenticated user with an admin role who has access to the dashboard.

---

## Requirements

### Requirement 1: Delete Button in Actions Column

**User Story:** As an administrator, I want a delete button in the actions column of the client listing table, so that I can remove client accounts without navigating away from the listing page.

#### Acceptance Criteria

1. THE Client_Listing SHALL render a delete option inside the existing Actions_Column dropdown menu for every client row.
2. WHEN the Administrator clicks the delete option for a client row, THE Client_Listing SHALL open the Delete_Dialog for that specific client.
3. THE Delete_Dialog SHALL display the full name and email of the client selected for deletion.
4. WHILE the Delete_Dialog is open, THE Client_Listing SHALL prevent the row click from opening the client detail dialog.

---

### Requirement 2: Delete Confirmation Dialog

**User Story:** As an administrator, I want a confirmation dialog before a client is deleted, so that I do not accidentally remove an account.

#### Acceptance Criteria

1. THE Delete_Dialog SHALL require the Administrator to explicitly confirm the deletion before calling the Delete_Action.
2. THE Delete_Dialog SHALL provide a cancel option that closes the dialog without performing any deletion.
3. WHEN the Administrator confirms deletion, THE Delete_Dialog SHALL call the Delete_Action with the selected client's `id`.
4. WHILE the Delete_Action is in progress, THE Delete_Dialog SHALL display a loading indicator and disable both the confirm and cancel buttons.
5. IF the Delete_Action returns an error, THEN THE Delete_Dialog SHALL display a toast error message and remain open.

---

### Requirement 3: Post-Deletion UI Update

**User Story:** As an administrator, I want the client list to update immediately after a successful deletion, so that I can see an accurate list without refreshing the page.

#### Acceptance Criteria

1. WHEN the Delete_Action completes successfully, THE Client_Listing SHALL remove the deleted client from the local client state.
2. WHEN the Delete_Action completes successfully, THE Delete_Dialog SHALL close automatically.
3. WHEN the Delete_Action completes successfully, THE Client_Listing SHALL display a toast success message confirming the deletion.
4. WHEN a client is removed from state, THE Client_Listing SHALL recalculate and update the stats counters (Total Clients, Approved, Pending Approval, Onboarded).

---

### Requirement 4: Access Control and Safety

**User Story:** As a system, I want delete operations to be safe and authorized, so that client data is not accidentally or maliciously removed.

#### Acceptance Criteria

1. THE Delete_Action SHALL include the administrator's access token from cookies in the `Authorization` header of the API request.
2. IF the Delete_Action receives an unauthorized response, THEN THE Delete_Dialog SHALL display a toast error message indicating the operation failed.
3. THE Delete_Dialog SHALL clearly communicate that the deletion is permanent and cannot be undone.
