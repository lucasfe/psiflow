import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isClinicRoute = createRouteMatcher(["/dashboard(.*)", "/patients(.*)", "/appointments(.*)", "/billing(.*)", "/staff(.*)"]);
const isPortalRoute = createRouteMatcher(["/portal(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return (await auth()).redirectToSignIn();
  }

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (isClinicRoute(req) && role !== "ADMIN" && role !== "CLINICIAN" && role !== "RECEPTIONIST") {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  if (isPortalRoute(req) && role !== "PATIENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
