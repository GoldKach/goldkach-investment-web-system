"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? null;
}

interface SendBulkEmailParams {
  recipients: string[];
  subject: string;
  message: string;
}

export async function getSentEmails(): Promise<{
  success: boolean;
  data?: {
    id: string;
    subject: string;
    message: string;
    recipients: string[];
    sentCount: number;
    failedCount: number;
    sentByName: string | null;
    sentAt: string;
  }[];
  error?: string;
}> {
  const token = await getToken();
  if (!token) return { success: false, error: "Not authenticated" };
  try {
    const res = await fetch(`${API_URL}/send-email/history`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    if (res.ok) return { success: true, data: data.data };
    return { success: false, error: data.error || "Failed to load history" };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function sendBulkEmail(params: SendBulkEmailParams) {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const response = await fetch(`${API_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipients: params.recipients,
        subject: params.subject,
        body: params.message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, sent: params.recipients.length, total: params.recipients.length };
    } else {
      return { success: false, error: data.error || "Failed to send emails" };
    }
  } catch (error) {
    console.error("Send email error:", error);
    return { success: false, error: "Network error" };
  }
}
