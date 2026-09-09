import "./globals.css";
import { Providers } from "@/providers/Providers";

export const metadata = {
  title: "SocialGuard AI",
  description: "Social media fake-account and bot risk analysis",
  metadataBase: new URL("https://socialguard.ai"),
  applicationName: "SocialGuard AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SocialGuard",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
