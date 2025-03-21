import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

interface CloudinaryResponse {
  url: string;
  publicId: string;
}

const uploadToCloudinary = (buffer: Buffer): Promise<CloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "avatars" },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({ url: result.secure_url, publicId: result.public_id });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

interface CloudinaryDeleteResponse {
  result: string;
}

const deleteFromCloudinary = (
  publicId: string
): Promise<CloudinaryDeleteResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else if (result) {
        resolve({ result: "success" });
      } else {
        reject(new Error("Deletion failed"));
      }
    });
  });
};

export { uploadToCloudinary, deleteFromCloudinary };
