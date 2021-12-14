import { indexPets } from "../lib/algolia";

export const algoliaController = {
   // Crea una nueva mascota en Algolia.
   // _geoloc de Algolia solo toma valores de tipo number,
   // por ende se parsea lat y lng a number.
   async addPetInAlgolia(newPetData) {
      const parseLat = parseFloat(newPetData.get("lat"));
      const parseLng = parseFloat(newPetData.get("lng"));

      return await indexPets.saveObject({
         objectID: newPetData.get("id"),
         petname: newPetData.get("petname"),
         petstate: newPetData.get("petstate"),
         _geoloc: {
            lat: parseLat,
            lng: parseLng,
         },
      });
   },

   // Actualiza una mascota en Algolia.
   async updatePetInAlgolia(updatePetData) {
      const parseLat = parseFloat(updatePetData.get("lat"));
      const parseLng = parseFloat(updatePetData.get("lng"));

      return await indexPets.partialUpdateObject({
         objectID: updatePetData.get("id"),
         petname: updatePetData.get("petname"),
         petstate: updatePetData.get("petstate"),
         _geoloc: {
            lat: parseLat,
            lng: parseLng,
         },
      });
   },

   // Elimina una mascota de Algolia.
   // Se usa el id de la mascota en la base de datos.
   async deletePetInAlgolia(deletePetData) {
      return await indexPets.deleteObject(deletePetData.get("id"));
   },

   // Obtiene las mascotas de un usuario de Algolia por ubicación geográfica, distancia y estado.
   // El estado de la mascota, puede ser "lost" o "found".
   async searchPetsInAlgoliaByLocation(reqQuery) {
      const { lat, lng } = reqQuery;
      const distance = reqQuery.distance || 100000;
      const petState = reqQuery.petstate || "lost";

      const { hits } = await indexPets.search(`${petState}`, {
         aroundLatLng: `${lat},${lng}`,
         aroundRadius: distance,
      });

      return hits;
   },
};
