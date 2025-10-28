import type { Metadata } from "next";
import { Roboto } from "next/font/google"
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "SMGNews",
  description: "Die Schülerzeitung des Stadt. Meerbusch Gymnasium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
