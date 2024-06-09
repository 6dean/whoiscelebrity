"use server";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

const fetchImages = async (url, cloudFolder, accumulatedData = []) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allData = [...accumulatedData, ...data.resources];

    if (data.next_cursor) {
      const nextUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${cloudFolder}&next_cursor=${data.next_cursor}`;
      return fetchImages(nextUrl, cloudFolder, allData);
    }

    return allData;
  } catch (error) {
    console.log("Error:", error.message);
    return accumulatedData;
  }
};

export default async function cloudinaryApi(difficultyLvl) {
  const folder = difficultyLvl === "EASY" ? "GuessWho" : "HardGuess";
  const cloudFolder =
    folder === "GuessWho"
      ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_FOLDER
      : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_FOLDER_HARD;

  const initialUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${folder}`;
  return await fetchImages(initialUrl, cloudFolder);
}
