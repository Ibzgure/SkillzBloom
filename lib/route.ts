import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { adminDb } from "./firebase-admin"; // <-- updated import

// Svix verification needs Node crypto (NOT Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      return new NextResponse("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
    }

    // 1) Read RAW body (required for Svix)
    const rawBody = await req.text();

    // 2) Pull Svix headers
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Missing svix headers", { status: 400 });
    }

    // 3) Verify signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;
    try {
      evt = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (e) {
      console.error("[clerk-webhook] invalid signature:", e);
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // 4) Parse payload AFTER verification
    const payload = JSON.parse(rawBody);

    // 5) Handle events
    switch (evt.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = payload.data;
        const email = email_addresses?.[0]?.email_address ?? null;

        await adminDb.collection("users").doc(id).set(
          {
            clerkId: id,
            email,
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            onboardingComplete: false,
            provider: "clerk",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { merge: true }
        );
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = payload.data;
        const email = email_addresses?.[0]?.email_address ?? null;

        await adminDb.collection("users").doc(id).set(
          {
            email,
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            updatedAt: new Date(),
          },
          { merge: true }
        );
        break;
      }

      case "user.deleted": {
        const { id } = payload.data;
        // Soft delete; switch to delete() if you want hard delete
        await adminDb.collection("users").doc(id).set(
          { deletedAt: new Date(), updatedAt: new Date() },
          { merge: true }
        );
        break;
      }

      default: {
        console.log("[clerk-webhook] unhandled event:", evt.type);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[clerk-webhook] error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
