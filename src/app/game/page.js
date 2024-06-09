"use client";
import Cloudi from "@/app/api/cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficultyLvl = searchParams.get("difficulty");

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
        }, 800);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateCelebrityName = () => {
    if (celebrityName && arrayGame) {
      const guessedName = celebrityName.toLowerCase();
      const actualName = arrayGame.public_id
        .split("GuessWho/")[1]
        .toLowerCase();
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
        difficultyBlur === 0 ? null : setDifficultyBlur(difficultyBlur - 1);
        setIsNotCorrect(true);
      }
    }
  };

  const PassCelebrityName = () => {
    const actualName = arrayGame.public_id.split("GuessWho/")[1].toLowerCase();
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
      }, 1000); //
      return () => clearTimeout(timer);
    }
  }, [gamePoints, isNotCorrect]);

  if (loading) {
    return <main>Loading...</main>;
  }

  return (
    <main>
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
            <div>5pts</div>
          ) : difficultyBlur === 2 ? (
            <div>3pts</div>
          ) : difficultyBlur === 1 ? (
            <div>1 pts</div>
          ) : (
            <div>0 pt</div>
          )}
          <div>{arrayGame.public_id.split("GuessWho/")[1]}</div>
          <div>
            <input
              className={`focus:outline-${isNotCorrect ? "red" : "black"}-500 ${
                isNotCorrect ? "shake" : ""
              }`}
              type="text"
              value={celebrityName}
              onChange={(e) => setCelebrityName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validateCelebrityName();
                }
              }}
            />
          </div>
          <button onClick={PassCelebrityName}>PASS</button>
        </div>
      ) : (
        <>
          {arrayGame === null && gamePoints < 100 ? (
            <>
              <Link href={"/"}>
                <div>Try again and reach 100 points!</div>
              </Link>
            </>
          ) : gamePoints >= 100 ? (
            <div>
              <div>Congratulations! You reached 100 points!</div>
              <div>
                <Link href={"/"}>
                  <div>RETOUR</div>
                </Link>
              </div>
            </div>
          ) : (
            <Link href={"/"}>
              <div>Try again and reach 100 points!</div>
            </Link>
          )}
        </>
      )}

      <div>{gamePoints}</div>
      <div>
        <Link href={"/"}>
          <div>RETOUR</div>
        </Link>
      </div>
    </main>
  );
}
