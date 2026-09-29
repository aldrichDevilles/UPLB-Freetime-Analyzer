import "./globals.css";
import Header from "../components/Header";
import React, { ReactNode } from "react";

export const metadata = {
  title: "UPLB Freetime Analyzer",
  description: "Find the best meeting times across different degree programs.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <Header />
        {React.createElement("main", { className: "container" }, children)}
      </body>
    </html>
  );
}
