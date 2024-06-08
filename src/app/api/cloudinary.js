"use server";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_FOLDER;

const fetchImages = async (url, accumulatedData = []) => {
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
      const nextUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${CLOUDINARY_CLOUD_FOLDER}&next_cursor=${data.next_cursor}`;
      return fetchImages(nextUrl, allData);
    }

    return allData;
  } catch (error) {
    console.log("Error:", error.message);
    return accumulatedData;
  }
};

export default async function cloudinaryApi() {
  const initialUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${CLOUDINARY_CLOUD_FOLDER}`;
  return await fetchImages(initialUrl);
}
