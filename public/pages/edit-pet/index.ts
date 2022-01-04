import { state } from "../../state";
import { Router } from "@vaadin/router";
import * as mapboxgl from "mapbox-gl";
import { initMapMapbox, initSearchFormMapbox } from "../../lib/mapbox";
import { dropzoneUpload } from "../../lib/dropzone";

class InitEditPetPage extends HTMLElement {
   connectedCallback() {
      const currentState = state.getState();
      state.getPetById(currentState.user.currentPetId).then((pet) => {
         state.setState({
            ...currentState,
            editPet: {
               id: pet.id,
               lat: pet.lat,
               lng: pet.lng,
               petimage: pet.petimage,
               petname: pet.petname,
               petstate: pet.petstate,
               ubication: pet.ubication,
            },
         });
         this.render();
      });
   }
   render(): void {
      const currentEditPet = state.getState().editPet;

      this.innerHTML = `
            <h1 class="editpets__title">Editar mascota perdida</h1>

            <input-comp class="editpets__input-petname" label="nombre de la mascota" value="${currentEditPet.petname}"></input-comp>

            <img class="editpets__dropzone-img" src="${currentEditPet.petimage}" crossorigin="anonymous">
            <button-comp class="editpets__dropzone-button" fondo="tipo-verde">Agregar/modifiar imagen</button-comp>
            
            <div class="editpets__content-mapbox" style="width: 335px; height: 335px"></div>
            <input-comp class="editpets__input-mapbox" type="text" name="geoloc" value="${currentEditPet.ubication}" label="Ciudad/Barrio/Localidad"></input-comp>
            <button-comp class="editpets__button-mapbox" fondo="tipo-verde">Buscar</button-comp>
            
            <p class="editpets__text">Buscá un punto de referencia para reportar a tu mascota. 
            Puede ser una dirección, un barrio o una ciudad.</p>

            <button-comp class="editpets__save-button" fondo="tipo-rosa">Guardar</button-comp>
            <button-comp class="editpets__found-button" fondo="tipo-verde">Reportar como encontradx</button-comp>
            <button-comp class="editpets__cancel-button" fondo="tipo-gris">Cancelar</button-comp>
            
            <p class="editpets__text-despublcar">Despublicar</p>`;

      this.classList.add("editpets__page");

      const petNameInput: HTMLInputElement = this.querySelector(".editpets__input-petname");

      const dropzoneImage: any = this.querySelector(".editpets__dropzone-img");
      const dropzoneButton = this.querySelector(".editpets__dropzone-button");

      const mapElement = this.querySelector(".editpets__content-mapbox");
      const mapboxInputEl = this.querySelector(".editpets__input-mapbox");
      const mapboxButtonEl = this.querySelector(".editpets__button-mapbox");

      // Inicializar Dropzone para subir imagen
      let pictureImage;
      const dropzoneInit = dropzoneUpload(dropzoneImage, dropzoneButton);

      dropzoneInit.then((dropzone) => {
         dropzone.on("thumbnail", (file) => {
            dropzoneImage.src = file.dataURL;
            pictureImage = file.dataURL;

            // Si la imagen es muy grande, la reduzco
            if (file.width > 300) {
               dropzone.options.resizeWidth = 300;
            }
         });
         dropzone.processQueue();
      });

      let currentLat = currentEditPet.lat;
      let currentLng = currentEditPet.lng;

      // Inicializar mapa con Mapbox
      initMapMapbox(mapElement, currentLat, currentLng).then((map) => {
         // Inicializar marker con opciones de arrastre "drag"
         const markerMap = new mapboxgl.Marker({ draggable: true });

         // inicializar el marker en la ubicación actual del usuario
         markerMap.setLngLat([currentLng, currentLat]).addTo(map);

         const { lng, lat } = markerMap.getLngLat();
         state.currentMarkerPosition(lat, lng);

         // Inicializar el formulario de busqueda de direcciones

         mapboxButtonEl.addEventListener("click", () => {
            // Obtener la direccion ingresada por el usuario
            const mapboxInputValue = mapboxInputEl.shadowRoot.querySelector("input").value;

            if (mapboxInputValue === null || mapboxInputValue === "") {
               alert("Ingrese una dirección válida");
            } else {
               initSearchFormMapbox(mapboxInputValue, function (results) {
                  // Obtener las cordenadas del primer resultado de la busqueda
                  const firstResult = results[0];
                  const [lng, lat] = firstResult.geometry.coordinates;

                  markerMap.setLngLat([lng, lat]).addTo(map);
                  map.setCenter([lng, lat]);
                  map.setZoom(14);
                  state.currentMarkerPosition(lat, lng);
               });
            }
         });

         // Evento de arrastre del marker para actualizar la ubicación
         markerMap.on("dragend", () => {
            const { lng, lat } = markerMap.getLngLat();
            // Se guarda la ubicación actual del marker en el state
            state.currentMarkerPosition(lat, lng);
         });
      });

      // Evento de click en el boton de actualizar los datos de la mascota perdida
      const buttonReportEl = this.querySelector(".editpets__save-button");
      buttonReportEl.addEventListener("click", () => {
         const user = state.getState().user;
         let petname = petNameInput.shadowRoot.querySelector("input").value;
         let lat = user.currentMarkerLat;
         let lng = user.currentMarkerLng;
         const mapboxInputValue = mapboxInputEl.shadowRoot.querySelector("input").value;

         if (!petname || petname === "") {
            alert("Ingrese un nombre para la mascota");
         } else if (!mapboxInputValue || mapboxInputValue === "") {
            alert("Ingrese una Ciudad/Barrio/Localidad");
         } else if (!pictureImage) {
            alert("Seleccione una ubicación para la mascota");
         } else if (!lat || !lng) {
            alert("Seleccione una imagen para la mascota");
         } else {
            state.editPet(user.currentPetId, petname, lat, lng, mapboxInputValue, pictureImage);

            alert("Los datos de la mascota han sido actualizados correctamente");
            Router.go("/home");
         }
      });

      // Evento de actulizar el estado de una mascota
      // En el caso de la que la misma sea encontarda
      const reportFoundPetEl = this.querySelector(".editpets__found-button");
      reportFoundPetEl.addEventListener("click", () => {
         const user = state.getState().user;
         const petstate = "found";
         state.updateStatePet(user.currentPetId, petstate);
         alert("Se ha actualizado el estado de la mascota a 'encontradx'");
         Router.go("/my-pets");
      });

      // Evento de cancelar la actializacion de los datos de la masrcota
      const cancelButtonEl = this.querySelector(".editpets__cancel-button");
      cancelButtonEl.addEventListener("click", () => {
         Router.go("/home");
         state.setState({
            user: {
               ...state.getState().user,
               currentMarkerLat: "",
               currentMarkerLng: "",
            },
         });
      });

      // Evento para eliminar la publicacion y los datos de una mascota
      const despublicarMascotaEl = this.querySelector(".editpets__text-despublcar");
      despublicarMascotaEl.addEventListener("click", () => {
         const user = state.getState().user;
         const result = window.confirm("Desea eleminar la publicacion de esta mascota?");
         if (result === true) {
            state.deletePet(user.currentPetId);
            Router.go("/home");
         }
      });
   }
}

customElements.define("edit-pet-page", InitEditPetPage);
