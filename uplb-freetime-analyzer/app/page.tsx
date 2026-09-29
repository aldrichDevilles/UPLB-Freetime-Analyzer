import Link from "next/link";
import React from "react";

/**
 * Landing page describing the tool to the user.
 */
export default function LandingPage(): React.JSX.Element {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Struggling to find a common meeting time?</h2>
      <p style={{ margin: "20px 0", lineHeight: "1.6" }}>
        This tool helps UPLB students from different degree programs synchronize
        their schedules. Just upload your schedule templates (where 30-min
        blocks are marked as triangles, and free time is light green), and the
        AI will analyze the best overlapping vacant times.
      </p>
      <Link href="/analyzer">
        <button className="btn">Go to Freetime Analyzer</button>
      </Link>
    </div>
  );
}
