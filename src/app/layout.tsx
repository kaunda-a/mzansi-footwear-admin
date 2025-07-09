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
  title: "Quirkify dashboard",
  description: "Discover the Latest Gadgets: Your One-Stop Gadget Shop!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-gray-100 font-poppins dark:bg-[#020817]">
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
