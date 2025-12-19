import type { Metadata } from "next";
import { Roboto } from "next/font/google"
import "./globals.css";
import SplitLayout from "@/layouts/Split";
import Widgets from "@/components/Widgets";
import NavBar from "@/components/NavBar";

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
        <NavBar />
        <SplitLayout Content={children} Widgets={<Widgets />} />
      </body>
    </html>
  );
}
