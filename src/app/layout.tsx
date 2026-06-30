import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPwaPrompt from "@/components/InstallPwaPrompt";
import NeneAvatarWidget from "@/components/NeneAvatarWidget";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "LOVE | つながる、創る、叶える。",
  description: "LOVE PLATFORM - AI秘書ねねと共に、つながる・創る・叶えるプラットフォーム",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LOVE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1c2340",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full bg-love-bg text-love-navy">
        {children}
        <ServiceWorkerRegister />
        <InstallPwaPrompt />
        <NeneAvatarWidget />
      </body>
    </html>
  );
}
