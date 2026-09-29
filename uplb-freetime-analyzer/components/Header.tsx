import Link from "next/link";
import React from "react";

/**
 * Reusable navigation header for the application.
 */
export default function Header(): React.JSX.Element {
  return (
    <header className="header">
      <h1>UPLB Freetime Analyzer</h1>
      <nav>
        <Link href="/">Home</Link>
        <span style={{ margin: "0 10px" }}>|</span>
        <Link href="/analyzer">Analyzer</Link>
      </nav>
    </header>
  );
}
