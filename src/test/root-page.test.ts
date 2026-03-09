import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import { auth } from "@clerk/nextjs/server";
import RootPage from "@/app/page";

function mockAuth(opts: { userId?: string; role?: string } = {}) {
  vi.mocked(auth).mockResolvedValue({
    userId: opts.userId ?? null,
    sessionClaims: opts.role ? { metadata: { role: opts.role } } : null,
  } as never);
}

beforeEach(() => {
  vi.clearAllMocks();
});

/**
 * RootPage is the role-based router that all sign-ins land on first
 * (ClerkProvider.signInForceRedirectUrl="/"). It must redirect every
 * possible auth state to the right destination so no user ever gets stuck.
 */
describe("RootPage redirect logic", () => {
  it("redirects unauthenticated users to /sign-in", async () => {
    mockAuth({ userId: undefined });
    await expect(RootPage()).rejects.toThrow("REDIRECT:/sign-in");
  });

  it("redirects authenticated users with no role to /no-role", async () => {
    mockAuth({ userId: "user_1" });
    await expect(RootPage()).rejects.toThrow("REDIRECT:/no-role");
  });

  it("redirects PATIENT to /portal", async () => {
    mockAuth({ userId: "user_1", role: "PATIENT" });
    await expect(RootPage()).rejects.toThrow("REDIRECT:/portal");
  });

  it("redirects ADMIN to /dashboard", async () => {
    mockAuth({ userId: "user_1", role: "ADMIN" });
    await expect(RootPage()).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("redirects CLINICIAN to /dashboard", async () => {
    mockAuth({ userId: "user_1", role: "CLINICIAN" });
    await expect(RootPage()).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("redirects RECEPTIONIST to /dashboard", async () => {
    mockAuth({ userId: "user_1", role: "RECEPTIONIST" });
    await expect(RootPage()).rejects.toThrow("REDIRECT:/dashboard");
  });
});
