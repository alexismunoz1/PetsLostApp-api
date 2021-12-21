import { Dropzone } from "dropzone";

// Configuración de Dropzone
export async function dropzoneUpload(uploadImg: Element): Promise<Dropzone> {
   const dropzone = new Dropzone(uploadImg, {
      url: `/falsa`,
      autoProcessQueue: false,
      maxFiles: 1,
      clickeableElements: uploadImg,
   });

   return dropzone;
}
