import { cloudinary } from "../lib/cloudinary";

export async function uploadImageCloudinary(imageUpdate) {
   if (imageUpdate) {
      const resultImage = await cloudinary.uploader.upload(imageUpdate, {
         resource_type: "image",
         discard_original_filename: true,
         width: 1000,
      });
      return resultImage.secure_url;
   }
}
