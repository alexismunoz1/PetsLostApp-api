import { Dropzone } from "dropzone";

// Configuración de Dropzone
export async function dropzoneUpload(uploadImg: Element, uploadButton: Element): Promise<Dropzone> {
   return new Dropzone(uploadButton, {
      url: `/falsa`,
      autoProcessQueue: false,
      maxFiles: 1,
      clickable: true,
      clickeableElements: uploadImg,
   });
}
