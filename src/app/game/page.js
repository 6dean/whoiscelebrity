"use client";
import Cloudi from "@/app/api/cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Game() {
  const [data, setData] = useState([]);
  const [celebrityName, setCelebrityName] = useState("");
  const [gamePoints, setGamePoints] = useState(0);
  const [difficultyBlur, setDifficultyBlur] = useState(3);
  const [creditPlus, setCreditPlus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arrayGame, setArrayGame] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Cloudi();
        setData(result);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        if (result.length > 0) {
          setArrayGame(result[Math.floor(Math.random() * result.length)]);
        }
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
        setGamePoints(gamePoints + 1);
        setDifficultyBlur(3);
        setCelebrityName("");
        if (newData.length > 0) {
          setArrayGame(newData[Math.floor(Math.random() * newData.length)]);
        } else {
          setArrayGame(null);
          setCreditPlus(true);
        }
      } else {
        difficultyBlur === 0 ? null : setDifficultyBlur(difficultyBlur - 1);
      }
    }
  };

  useEffect(() => {
    if (gamePoints === 10) {
      setCreditPlus(true);
    }
  }, [gamePoints]);

  const continueCredit = () => {
    setCreditPlus(false);
    setGamePoints(0);
  };

  if (loading) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      {!creditPlus ? (
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
          <div>{arrayGame.public_id.split("GuessWho/")[1]}</div>
          <div>
            <input
              className="text-red-500"
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
        </div>
      ) : (
        <>
          <div>Congratulations, you win!</div>
          {arrayGame === null ? (
            <>
              <div>You completed EASY level</div>
              <Link href={"/"}>
                <div>Try another level !</div>
              </Link>
            </>
          ) : (
            <div onClick={continueCredit}>CONTINUE?</div>
          )}
        </>
      )}

      <div>{gamePoints}</div>
    </main>
  );
}
