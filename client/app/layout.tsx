import "./globals.css";
import { Providers } from "@/providers/Providers";

export const metadata = {
  title: "SocialGuard AI",
  description: "Social media fake-account and bot risk analysis",
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
