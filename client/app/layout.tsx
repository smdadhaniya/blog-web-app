"use client";
import "./globals.css";
import Navbar from "./components/utils/common/navbar";
import { NAV_ITEMS } from "./components/utils/constant";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <Navbar navItems={NAV_ITEMS} />
        <div className="p-2">{children}</div>
      </body>
    </html>
  );
};
export default RootLayout;
