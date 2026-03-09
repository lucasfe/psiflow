"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const { isLoaded, userId, sessionClaims } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.replace("/sign-in");
      return;
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!role) {
      router.replace("/no-role");
      return;
    }

    if (role === "PATIENT") {
      router.replace("/portal");
      return;
    }

    router.replace("/dashboard");
  }, [isLoaded, userId, sessionClaims, router]);

  return null;
}
