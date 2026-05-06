import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AskRepo | Chat with any GitHub repository",
  description:
    "Connect a repository, ask plain-English code questions, and get answers grounded in exact files and functions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
