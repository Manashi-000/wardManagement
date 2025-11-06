import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath, folderPath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: folderPath,
            resource_type: "auto",
        });
        if (!response) {
            throw new Error("Unable to upload file on cloudinary");
        }
		console.log("thisis localfile path", localFilePath)
        fs.unlinkSync(localFilePath);
        return {
            filename: response.original_filename,
            url: response.url,
            format: response.format,
            publicId: response.public_id,
        };
    } catch (error) {
		console.log("localfile path", localFilePath)
        fs.unlinkSync(localFilePath);
        throw new Error(
            error.message || "somethign went wrong while uploading file to cloudinary"
        );
    }
};

export { uploadOnCloudinary, cloudinary };