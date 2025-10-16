// emails/ResetPasswordEmail.tsx
import * as React from "react";
import { Html, Body, Container, Text, Button, Hr, Section } from "@react-email/components";

export default function ResetPasswordEmail({
  name = "there",
  resetUrl,
}: { name?: string; resetUrl: string }) {
  return (
    <Html>
      <Body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <Container style={{ maxWidth: 560, margin: "24px auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Reset your password</Text>
          <Text style={{ color: "#555" }}>
            Hi {name}, click the button below to set a new password. This link expires in 30 minutes.
          </Text>
          <Section style={{ margin: "20px 0" }}>
            <Button href={resetUrl} style={{ background: "#111", color: "#fff", padding: "12px 16px", borderRadius: 8 }}>
              Reset password
            </Button>
          </Section>
          <Text style={{ color: "#777", fontSize: 12 }}>
            If you didn’t request this, you can ignore this email.
          </Text>
          <Hr />
          <Text style={{ color: "#aaa", fontSize: 12 }}>© {new Date().getFullYear()} Your App</Text>
        </Container>
      </Body>
    </Html>
  );
}
