"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

async function getAuthHeaders() {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

function msg(e: any, fallback = "Request failed"): string {
  return (
    e?.response?.data?.error ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClientUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  status: string;
  isApproved: boolean;
  individualOnboarding?: Record<string, any> | null;
  companyOnboarding?: Record<string, any> | null;
  masterWallet?: Record<string, any> | null;
  deposits?: Record<string, any>[];
  withdrawals?: Record<string, any>[];
  userPortfolios?: Record<string, any>[];
}

export type StaffRole =
  | "AGENT"
  | "CLIENT_RELATIONS"
  | "ACCOUNT_MANAGER"
  | "STAFF"
  | "ADMIN"
  | "MANAGER"
  | "SUPER_ADMIN";

export interface StaffProfile {
  id: string;
  employeeId: string | null;
  department: string | null;
  position: string | null;
  bio: string | null;
  isActive: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { assignedClients: number };
  assignedClients?: AgentClientAssignment[];
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: StaffRole;
  status: string;
  isApproved: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  staffProfile: StaffProfile | null;
}

export interface AssignedClient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: string;
  status: string;
  isApproved: boolean;
  individualOnboarding: Record<string, any> | null;
  companyOnboarding: Record<string, any> | null;
  masterWallet: Record<string, any> | null;
  deposits: Record<string, any>[];
  withdrawals: Record<string, any>[];
  userPortfolios: Record<string, any>[];
}

export interface AgentClientAssignment {
  id: string;
  agentId: string;
  clientId: string;
  assignedById: string | null;
  assignedAt: string;
  isActive: boolean;
  unassignedAt: string | null;
  client: AssignedClient;
}

export interface AgentForClientResponse {
  id: string;
  assignedAt: string;
  isActive: boolean;
  agent: {
    id: string;
    userId: string;
    position: string | null;
    department: string | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      name: string;
      email: string;
      phone: string;
      imageUrl: string;
      role: StaffRole;
    };
  };
}

export interface ActionResponse<T = null> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

// ─── CREATE STAFF MEMBER ──────────────────────────────────────────────────────

export interface CreateStaffInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: StaffRole;
  imageUrl?: string;
  department?: string;
  position?: string;
  bio?: string;
  employeeId?: string;
  createdById?: string;
}

export async function createStaffAction(
  input: CreateStaffInput
): Promise<ActionResponse<StaffMember>> {
  try {
    const { data } = await api.post("/staff", input, {
      headers: await getAuthHeaders(),
    });
    revalidatePath("/dashboard/staff");
    return { success: true, data: data.data, message: data.message };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to create staff member."),
      errors: e?.response?.data?.errors,
    };
  }
}

// ─── GET ALL STAFF ────────────────────────────────────────────────────────────

export interface GetAllStaffFilters {
  role?: StaffRole;
  department?: string;
  isActive?: boolean;
}

export async function getAllStaffAction(
  filters?: GetAllStaffFilters
): Promise<ActionResponse<StaffMember[]>> {
  try {
    const params = new URLSearchParams();
    if (filters?.role) params.set("role", filters.role);
    if (filters?.department) params.set("department", filters.department);
    if (filters?.isActive !== undefined)
      params.set("isActive", String(filters.isActive));

    const query = params.toString() ? `?${params.toString()}` : "";
    const { data } = await api.get(`/staff${query}`, {
      headers: await getAuthHeaders(),
    });
    return { success: true, data: data.data };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to fetch staff members."),
    };
  }
}

// ─── GET STAFF BY ID ──────────────────────────────────────────────────────────

export async function getStaffByIdAction(
  id: string
): Promise<ActionResponse<StaffMember>> {
  try {
    const { data } = await api.get(`/staff/${id}`, {
      headers: await getAuthHeaders(),
    });
    return { success: true, data: data.data };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to fetch staff member."),
    };
  }
}

// ─── UPDATE STAFF MEMBER ──────────────────────────────────────────────────────

export interface UpdateStaffInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: StaffRole;
  status?: string;
  imageUrl?: string;
  department?: string;
  position?: string;
  bio?: string;
  employeeId?: string;
  isActive?: boolean;
}

export async function updateStaffAction(
  id: string,
  input: UpdateStaffInput
): Promise<ActionResponse<StaffMember>> {
  try {
    const { data } = await api.put(`/staff/${id}`, input, {
      headers: await getAuthHeaders(),
    });
    revalidatePath("/dashboard/staff");
    revalidatePath(`/dashboard/staff/${id}`);
    revalidatePath("/agent");
    revalidatePath("/agent/settings");
    return { success: true, data: data.data, message: data.message };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to update staff member."),
      errors: e?.response?.data?.errors,
    };
  }
}

// ─── DEACTIVATE STAFF MEMBER ──────────────────────────────────────────────────

export async function deactivateStaffAction(
  id: string
): Promise<ActionResponse> {
  try {
    const { data } = await api.delete(`/staff/${id}`, {
      headers: await getAuthHeaders(),
    });
    revalidatePath("/dashboard/staff");
    return { success: true, data: null, message: data.message };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to deactivate staff member."),
    };
  }
}

// ─── DELETE STAFF MEMBER (hard delete) ───────────────────────────────────────

export async function deleteStaffAction(
  id: string
): Promise<ActionResponse> {
  try {
    const { data } = await api.delete(`/staff/${id}/delete`, {
      headers: await getAuthHeaders(),
    });
    revalidatePath("/dashboard/staff");
    return { success: true, data: null, message: data.message ?? "Staff member deleted." };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to delete staff member."),
    };
  }
}

// ─── GET AGENT'S CLIENTS ──────────────────────────────────────────────────────

export async function getAgentClientsAction(
  staffId: string,
  includeInactive = false
): Promise<ActionResponse<AgentClientAssignment[]>> {
  try {
    const query = includeInactive ? "?includeInactive=true" : "";
    const { data } = await api.get(`/staff/${staffId}/clients${query}`, {
      headers: await getAuthHeaders(),
    });
    return { success: true, data: data.data };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to fetch agent clients."),
    };
  }
}

// ─── ASSIGN CLIENT TO AGENT ───────────────────────────────────────────────────

export async function assignClientToAgentAction(
  staffId: string,
  clientId: string,
  assignedById?: string
): Promise<ActionResponse<AgentClientAssignment>> {
  try {
    const { data } = await api.post(`/staff/${staffId}/clients`, {
      clientId,
      assignedById,
    }, {
      headers: await getAuthHeaders(),
    });
    revalidatePath(`/dashboard/staff/${staffId}`);
    revalidatePath(`/dashboard/users/${clientId}`);
    return { success: true, data: data.data, message: data.message };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to assign client to agent."),
    };
  }
}

// ─── UNASSIGN CLIENT FROM AGENT ───────────────────────────────────────────────

export async function unassignClientFromAgentAction(
  staffId: string,
  clientId: string
): Promise<ActionResponse> {
  try {
    const { data } = await api.delete(`/staff/${staffId}/clients/${clientId}`, {
      headers: await getAuthHeaders(),
    });
    revalidatePath(`/dashboard/staff/${staffId}`);
    revalidatePath(`/dashboard/users/${clientId}`);
    return { success: true, data: null, message: data.message };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to unassign client."),
    };
  }
}

// ─── GET AGENT FOR CLIENT ─────────────────────────────────────────────────────

export async function getAgentForClientAction(
  clientId: string
): Promise<ActionResponse<AgentForClientResponse>> {
  try {
    const { data } = await api.get(`/staff/agent-for-client/${clientId}`, {
      headers: await getAuthHeaders(),
    });
    return { success: true, data: data.data };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to fetch agent for client."),
    };
  }
}

// ─── GET ACTIVE AGENTS (for onboarding dropdowns) ────────────────────────────

export async function getActiveAgentsAction(): Promise<
  ActionResponse<StaffMember[]>
> {
  return getAllStaffAction({ role: "AGENT", isActive: true });
}

// ─── GET STAFF + CLIENTS IN PARALLEL ─────────────────────────────────────────

export async function getStaffWithClientsAction(staffId: string): Promise<{
  staff: ActionResponse<StaffMember>;
  clients: ActionResponse<AgentClientAssignment[]>;
}> {
  const [staff, clients] = await Promise.all([
    getStaffByIdAction(staffId),
    getAgentClientsAction(staffId),
  ]);
  return { staff, clients };
}

// ─── GET CLIENTS FOR ASSIGNMENT SELECT ───────────────────────────────────────

export async function getClientsForAssignmentAction(): Promise<
  ActionResponse<ClientUser[]>
> {
  try {
    const { data } = await api.get("/users?role=USER", {
      headers: await getAuthHeaders(),
    });
    const users: ClientUser[] = Array.isArray(data.data)
      ? data.data
      : (data.data?.users ?? data.data?.data ?? []);
    return { success: true, data: users };
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: msg(e, "Failed to fetch clients."),
    };
  }
}