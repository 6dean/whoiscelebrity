"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [difficulty, setDifficulty] = useState("EASY");

  const toggleDifficulty = () => {
    setDifficulty(difficulty === "EASY" ? "HARD" : "EASY");
  };

  return (
    <main className="flex justify-center items-center mt-12">
      <div>
        <div className="img-game">
          <img
            src="https://res.cloudinary.com/dlfp2xvis/image/upload/PLUTO_aeggfe.gif"
            alt="img-game"
          />
        </div>
        <div className="flex justify-center p-5">
          <Link href={{ pathname: "/game", query: { difficulty: difficulty } }}>
            <span className="newgame">START</span>
          </Link>
        </div>

        <div className="mb-4 flex justify-center items-center">
          <span className={difficulty === "EASY" ? "lvlchoice" : "lvl"}>
            EASY
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={difficulty === "HARD"}
              onChange={toggleDifficulty}
            />
            <span className="slider"></span>
          </label>
          <span className={difficulty === "HARD" ? "lvlchoice" : "lvl"}>
            HARD
          </span>
        </div>
      </div>
    </main>
  );
}
