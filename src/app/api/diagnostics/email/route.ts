import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env");

export async function GET(request: NextRequest) {
  try {
    console.log("[diagnostics] Starting email diagnostics...");

    // Read .env file
    let envContent = "";
    try {
      envContent = fs.readFileSync(envPath, "utf-8");
    } catch (err) {
      console.error("[diagnostics] Failed to read .env file:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to read .env file",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }

    // Parse .env manually
    const envVars: Record<string, string> = {};
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...valueParts] = trimmed.split("=");
      if (key) {
        let value = valueParts.join("=").trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        envVars[key.trim()] = value;
      }
    });

    const resendApiKey = envVars.RESEND_API_KEY;
    const emailFrom = envVars.EMAIL_FROM;
    const adminEmail = envVars.ADMIN_EMAIL;

    console.log("[diagnostics] Environment variables loaded");

    if (!resendApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY not configured",
          details: "Please set RESEND_API_KEY in your .env file",
        },
        { status: 400 },
      );
    }

    // Test Resend API with diagnostic request
    console.log("[diagnostics] Testing Resend API with test email...");
    const testEmail = "test-diag@example.com";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom || "onboarding@resend.dev",
        to: [testEmail],
        subject: "[Diagnostics] Resend API Test",
        html: "<p>This is a test email from Resend diagnostics.</p>",
        text: "This is a test email from Resend diagnostics.",
      }),
    });

    const responseData = await response.json();
    console.log("[diagnostics] Resend API response status:", response.status);
    console.log("[diagnostics] Resend API response data:", JSON.stringify(responseData));

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      diagnostics: {
        resendApiKeyPresent: !!resendApiKey,
        resendApiKeyLength: resendApiKey?.length ?? 0,
        emailFromConfigured: emailFrom || "using default (onboarding@resend.dev)",
        adminEmailConfigured: adminEmail || "not configured",
        testEmailRecipient: testEmail,
      },
      resendResponse: responseData,
      headers: {
        authorization: `Bearer ${resendApiKey?.slice(0, 10)}...`,
        contentType: "application/json",
      },
      recommendation:
        response.status === 403
          ? "403 error typically means: (1) API key is invalid/revoked, (2) sender email is not verified in Resend dashboard, (3) recipient email is not verified (in sandbox mode). Check your Resend dashboard settings."
          : response.ok
            ? "✅ Resend API is working correctly!"
            : `Check Resend API documentation for status code ${response.status}`,
    });
  } catch (err) {
    console.error("[diagnostics] Error during diagnostics:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Diagnostics failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
