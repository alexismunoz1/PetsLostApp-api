import { cloudinary } from "../lib/cloudinary";

export async function uploadImageCloudinary(image) {
   try {
      const resultImage = await cloudinary.uploader.upload(image, {
         resource_type: "auto",
         discard_original_filename: true,
         width: 1000,
      });
      console.log("resultImage !!!", resultImage);
      return resultImage.secure_url;
   } catch (error) {
      console.log("error !!!", error);
   }
}
