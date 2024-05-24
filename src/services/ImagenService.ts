import IImagen from "../types/IImagen";
import BackendClient from "./BackendClient";

export default class ImagenService extends BackendClient<IImagen> {
  async uploadImages(url: string, formData: FormData): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir las imágenes. Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al subir las imágenes:', error);
      throw error;
    }
  }
}
