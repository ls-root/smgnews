import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google"
import "./globals.css";
import SplitLayout from "@/layouts/Split";
import Widgets from "@/components/Widgets";
import NavBar from "@/components/NavBar";

const baloo = Baloo_2({
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
      <body className={baloo.className}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <div className="absolute inset-0 h-1/3 w-full -top-1/6 bg-blue-200 center-x blur-3xl"></div>
        </div>

        <NavBar />
        <SplitLayout Content={children} Widgets={<Widgets />} />
      </body>
    </html>
  );
}
