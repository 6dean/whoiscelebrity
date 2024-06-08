"use client";
import Cloudi from "@/app/api/cloudinary";
import { useEffect, useState } from "react";

export default function Game() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  let ArrayGame = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await Cloudi();
        setData(result);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!loading) {
    return <main>Chargement...</main>;
  }

  console.log(data);

  if (data) {
    function getRandomElement(array) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return (ArrayGame = array[randomIndex]);
    }
    getRandomElement(data);
  }

  return (
    <main>
      <h1>PAGE DE JEU</h1>
      <div>Data:</div>
      <img src={ArrayGame ? ArrayGame.secure_url : null} alt="Random image" />
      <div>{ArrayGame ? ArrayGame.public_id.split("GuessWho/") : null}</div>
    </main>
  );
}
