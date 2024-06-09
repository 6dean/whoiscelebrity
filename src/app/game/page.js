"use client";
import Cloudi from "@/app/api/cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficultyLvl = searchParams.get("difficulty");
  const folder = difficultyLvl === "EASY" ? "GuessWho/" : "HardGuess/";

  if (difficultyLvl !== "EASY" && difficultyLvl !== "HARD") {
    router.push("/");
    return null;
  }

  const [data, setData] = useState([]);
  const [celebrityName, setCelebrityName] = useState("");
  const [gamePoints, setGamePoints] = useState(0);
  const [difficultyBlur, setDifficultyBlur] = useState(3);
  const [isNotCorrect, setIsNotCorrect] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arrayGame, setArrayGame] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Cloudi(difficultyLvl);
        setData(result);
        if (result.length > 0) {
          setArrayGame(result[Math.floor(Math.random() * result.length)]);
        }
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateCelebrityName = () => {
    if (celebrityName && arrayGame) {
      const guessedName = celebrityName.toLowerCase();
      const actualName = arrayGame.public_id.split(folder)[1].toLowerCase();
      if (guessedName === actualName) {
        const newData = data.filter(
          (item) => item.public_id !== arrayGame.public_id
        );
        setData(newData);
        if (difficultyBlur === 3) {
          setGamePoints(gamePoints + 5);
        } else if (difficultyBlur === 2) {
          setGamePoints(gamePoints + 3);
        } else if (difficultyBlur === 1) {
          setGamePoints(gamePoints + 1);
        } else setGamePoints(gamePoints + 0);
        setDifficultyBlur(3);
        setCelebrityName("");
        if (newData.length > 0) {
          setArrayGame(newData[Math.floor(Math.random() * newData.length)]);
        } else {
          setArrayGame(null);
          setEndGame(true);
        }
      } else {
        setIsNotCorrect(true);
      }
    }
  };

  const PassCelebrityName = () => {
    const actualName = arrayGame.public_id.split(folder)[1].toLowerCase();
    if (actualName) {
      const newData = data.filter(
        (item) => item.public_id !== arrayGame.public_id
      );
      setData(newData);
      setGamePoints(gamePoints + 0);
      setDifficultyBlur(3);
      setCelebrityName("");
      if (newData.length > 0) {
        setArrayGame(newData[Math.floor(Math.random() * newData.length)]);
      } else {
        setArrayGame(null);
        setEndGame(true);
      }
    } else {
      difficultyBlur === 0 ? null : setDifficultyBlur(difficultyBlur - 1);
      setIsNotCorrect(true);
    }
  };

  useEffect(() => {
    if (gamePoints === 100 || gamePoints > 100) {
      setEndGame(true);
    }

    if (isNotCorrect) {
      const timer = setTimeout(() => {
        setIsNotCorrect(false);
      }, 1500); //
      return () => clearTimeout(timer);
    }
  }, [gamePoints, isNotCorrect]);

  const lessBlur = () => {
    difficultyBlur === 0 ? null : setDifficultyBlur(difficultyBlur - 1);
  };

  if (loading) {
    return (
      <main className="flex flex-col justify-center items-center h-screen">
        <div className="loader"></div>
        <span className="mt-3">Loading from Cloudinary...</span>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center mt-12">
      <div>
        {gamePoints >= 100 ? null : (
          <div className="flex justify-center items-center">
            <Link href={"/"}>
              <div className="abandon">Abandon</div>
            </Link>
          </div>
        )}
        {!endGame ? (
          <div className="p-4">
            <div className="img-cont">
              <img src={arrayGame.secure_url} alt="Random image" />
              <div
                className={`blur-overlay${
                  difficultyBlur === 3
                    ? "-lv3"
                    : difficultyBlur === 2
                    ? "-lv2"
                    : difficultyBlur === 1
                    ? "-lv1"
                    : "-lv0"
                }`}
              ></div>
            </div>
            {difficultyBlur === 3 ? (
              <div className="flex justify-between mt-2">
                <button onClick={lessBlur} className="helpme">
                  🔍 Hint
                </button>
                <div>+ 5 pts</div>
              </div>
            ) : difficultyBlur === 2 ? (
              <div class="flex justify-between mt-2">
                <button onClick={lessBlur} className="helpme">
                  🔍 Hint
                </button>
                <div>+ 3 pts</div>
              </div>
            ) : difficultyBlur === 1 ? (
              <div class="flex justify-between mt-2">
                <button onClick={lessBlur} className="helpme">
                  🔍 Hint
                </button>
                <div>+ 1 pts</div>
              </div>
            ) : (
              <div class="flex justify-between mt-2">
                <div className="">No more hint 😮‍💨</div>
                <div>0 pt</div>
              </div>
            )}
            <div className="flex justify-center items-center mt-8">
              <input
                className={`focus:outline-${
                  isNotCorrect ? "red" : "black"
                }-500 ${
                  isNotCorrect ? "shake" : ""
                } p-2 border border-gray-300 rounded`}
                type="text"
                value={celebrityName}
                placeholder="Guess The Picture"
                onChange={(e) => setCelebrityName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    validateCelebrityName();
                  }
                }}
              />
              <button className="custom-button" onClick={validateCelebrityName}>
                ✓
              </button>
            </div>

            <div className="flex justify-center">
              <button className="buttonpass" onClick={PassCelebrityName}>
                PASS
              </button>
            </div>
          </div>
        ) : (
          <>
            {arrayGame === null && gamePoints < 100 ? (
              <>
                <div className="mt-10">
                  <span
                    className="tryagain"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </span>
                  <span> and reach 100 points!</span>
                </div>
              </>
            ) : gamePoints >= 100 ? (
              <div>
                <div>Congratulations! You reached 100 points!</div>
                <div className="flex justify-center mt-10">
                  <Link href={"/"}>
                    <div className="returnbutton">Return</div>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-10">
                <span
                  className="tryagain"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </span>
                <span> and reach 100 points!</span>
              </div>
            )}
          </>
        )}

        <div className="flex justify-center points">{gamePoints}</div>
      </div>
    </main>
  );
}
