"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const [difficulty, setDifficulty] = useState("EASY");

  const toggleDifficulty = () => {
    setDifficulty(difficulty === "EASY" ? "HARD" : "EASY");
  };

  return (
    <main>
      <Link href={{ pathname: "/game", query: { difficulty: difficulty } }}>
        <div>NOUVELLE PARTIE</div>
      </Link>
      <div className="mb-4 flex items-center">
        <span className="mr-2">EASY</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={difficulty === "HARD"}
            onChange={toggleDifficulty}
          />
          <span className="slider"></span>
        </label>
        <span className="ml-2">HARD</span>
      </div>
    </main>
  );
}
