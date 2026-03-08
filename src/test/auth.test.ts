import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import { auth } from "@clerk/nextjs/server";
import { getRole, requireRole, requireStaff, requirePatient, requireAdmin } from "@/lib/auth";

function mockAuth(role?: string) {
  vi.mocked(auth).mockResolvedValue({
    sessionClaims: role ? { metadata: { role } } : null,
  } as never);
}

describe("getRole", () => {
  it("returns the role from session claims", async () => {
    mockAuth("ADMIN");
    expect(await getRole()).toBe("ADMIN");
  });

  it("returns null when no session", async () => {
    mockAuth();
    expect(await getRole()).toBeNull();
  });

  it("returns null when no role in metadata", async () => {
    vi.mocked(auth).mockResolvedValue({ sessionClaims: { metadata: {} } } as never);
    expect(await getRole()).toBeNull();
  });
});

describe("requireRole", () => {
  it("does not redirect when role matches", async () => {
    mockAuth("ADMIN");
    await expect(requireRole("ADMIN")).resolves.toBe("ADMIN");
  });

  it("redirects when role does not match", async () => {
    mockAuth("PATIENT");
    await expect(requireRole("ADMIN")).rejects.toThrow("REDIRECT:/");
  });

  it("redirects when no role", async () => {
    mockAuth();
    await expect(requireRole("ADMIN")).rejects.toThrow("REDIRECT:/");
  });
});

describe("requireStaff", () => {
  it.each(["ADMIN", "CLINICIAN", "RECEPTIONIST"])("allows %s", async (role) => {
    mockAuth(role);
    await expect(requireStaff()).resolves.toBeDefined();
  });

  it("blocks PATIENT", async () => {
    mockAuth("PATIENT");
    await expect(requireStaff()).rejects.toThrow("REDIRECT:/");
  });
});

describe("requirePatient", () => {
  it("allows PATIENT", async () => {
    mockAuth("PATIENT");
    await expect(requirePatient()).resolves.toBe("PATIENT");
  });

  it.each(["ADMIN", "CLINICIAN", "RECEPTIONIST"])("blocks %s", async (role) => {
    mockAuth(role);
    await expect(requirePatient()).rejects.toThrow("REDIRECT:/");
  });
});

describe("requireAdmin", () => {
  it("allows ADMIN", async () => {
    mockAuth("ADMIN");
    await expect(requireAdmin()).resolves.toBe("ADMIN");
  });

  it.each(["CLINICIAN", "RECEPTIONIST", "PATIENT"])("blocks %s", async (role) => {
    mockAuth(role);
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/");
  });
});
