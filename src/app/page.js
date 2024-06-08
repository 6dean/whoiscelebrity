"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href={"/game"}>
        <div>NOUVELLE PARTIE</div>
      </Link>
      <div>OPTIONS</div>
    </main>
  );
}
