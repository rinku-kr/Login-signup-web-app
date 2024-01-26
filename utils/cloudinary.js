import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file on cloudinary!
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully!
    console.log("File is uploaded on clodinary: ", response.url);
    return response;
  } catch (err) {
    // Remove the locally saved temporary file as the upload operation got failed!
    fs.unlinkSync(localFilePath);
    return null;
  }
};
export default uploadCloudinary;