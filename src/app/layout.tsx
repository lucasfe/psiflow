import type { Metadata } from "next";
import { DM_Serif_Display, Raleway } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const raleway = Raleway({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Psiflow",
  description: "Psychology clinic management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
      afterSignOutUrl="/sign-in"
    >
      <html lang="en">
        <body className={`${dmSerifDisplay.variable} ${raleway.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
