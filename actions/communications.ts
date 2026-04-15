"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SendBulkEmailParams {
  recipients: string[];
  subject: string;
  message: string;
}

export async function sendBulkEmail(params: SendBulkEmailParams) {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  
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
