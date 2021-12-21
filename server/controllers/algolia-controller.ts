import { indexPets } from "../lib/algolia";

export const algoliaController = {
   async addPetInAlgolia(newPetData): Promise<object> {
      // Crea una nueva mascota en Algolia.

      // _geoloc de Algolia solo toma valores de tipo number,
      // por ende se parsea lat y lng a number.
      const parseLat = parseFloat(newPetData.get("lat"));
      const parseLng = parseFloat(newPetData.get("lng"));

      try {
         return await indexPets.saveObject({
            objectID: newPetData.get("id"),
            petname: newPetData.get("petname"),
            petstate: newPetData.get("petstate"),
            _geoloc: {
               lat: parseLat,
               lng: parseLng,
            },
         });
      } catch (error) {
         return error;
      }
   },

   async updatePetInAlgolia(updatePetData): Promise<object> {
      // Actualiza una mascota en Algolia.
      const parseLat = parseFloat(updatePetData.get("lat"));
      const parseLng = parseFloat(updatePetData.get("lng"));

      try {
         return await indexPets.partialUpdateObject({
            objectID: updatePetData.get("id"),
            petname: updatePetData.get("petname"),
            petstate: updatePetData.get("petstate"),
            _geoloc: {
               lat: parseLat,
               lng: parseLng,
            },
         });
      } catch (error) {
         return error;
      }
   },

   async searchPetInAlgoliaByname(petname): Promise<object> {
      // Busca una mascota en Algolia por su nombre.
      try {
         const { hits } = await indexPets.search(`${petname}`);
         return hits;
      } catch (error) {
         return null;
      }
   },

   async searchPetsInAlgoliaByLocation(lat: any, lng: any, distance: number, petstate: string): Promise<object> {
      // Obtiene las mascotas de un usuario de Algolia por ubicación geográfica, distancia y estado.
      // El estado de la mascota, puede ser "lost" o "found".
      if (!distance) {
         distance = 100000;
      }
      if (!petstate) {
         petstate = "lost";
      }
      try {
         const { hits } = await indexPets.search(`${petstate}`, {
            aroundLatLng: `${lat},${lng}`,
            aroundRadius: distance,
         });
         return hits;
      } catch (error) {
         return null;
      }
   },

   async deletePetInAlgolia(deletePetData: any): Promise<object> {
      // Elimina una mascota de Algolia.
      // Se usa el id de la mascota en la base de datos.
      try {
         return await indexPets.deleteObject(deletePetData.get("id"));
      } catch (error) {
         return error;
      }
   },
};
