import { v2 as cloudinary } from "cloudinary";

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
  console.warn("CLOUDINARY_URL is not set. Image uploads may fail.");
}

cloudinary.config({
  secure: true,
  cloudinary_url: cloudinaryUrl,
});

export default cloudinary;
