import type { Metadata } from "next";
import "./globals.css";
import NextUIProvider from "@/providers/nextui-provider";
import { Toaster } from "sonner";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import AutoSignOutProvider from "@/providers/auto-signout-provider";
import ErrorBoundaryProvider from "@/providers/error-boundary-provider";
import { GlobalContextProvider } from "@/context/store";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Mzansi Footwear Admin Dashboard",
  description: "Manage your South African footwear business with our comprehensive admin dashboard",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-poppins transition-all duration-300">
        <ErrorBoundaryProvider>
          <AuthProvider>
            <AutoSignOutProvider>
              <QueryProvider>
                <GlobalContextProvider>
                  <NextUIProvider>{children}</NextUIProvider>
                </GlobalContextProvider>
              </QueryProvider>
            </AutoSignOutProvider>
          </AuthProvider>
        </ErrorBoundaryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
