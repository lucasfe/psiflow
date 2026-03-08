import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    public_metadata: { role?: string };
  };
};

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = event;
  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  )?.email_address;

  if (!primaryEmail) {
    return new Response("No primary email found", { status: 400 });
  }

  const role = data.public_metadata?.role;

  if (type === "user.created" || type === "user.updated") {
    if (role === "PATIENT") {
      await db.patient.upsert({
        where: { clerkId: data.id },
        update: {
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: primaryEmail,
        },
        create: {
          clerkId: data.id,
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: primaryEmail,
        },
      });
    } else if (role === "ADMIN" || role === "CLINICIAN" || role === "RECEPTIONIST") {
      await db.staffMember.upsert({
        where: { clerkId: data.id },
        update: {
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: primaryEmail,
          role,
        },
        create: {
          clerkId: data.id,
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: primaryEmail,
          role,
        },
      });
    }
  }

  if (type === "user.deleted") {
    await Promise.allSettled([
      db.patient.updateMany({ where: { clerkId: data.id }, data: { active: false } }),
      db.staffMember.updateMany({ where: { clerkId: data.id }, data: { active: false } }),
    ]);
  }

  return new Response("OK", { status: 200 });
}
