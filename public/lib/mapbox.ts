import * as MapboxClient from "mapbox";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

export async function initMapMapbox(mapElement, lat, lng) {
   mapboxgl.accessToken = MAPBOX_TOKEN;
   return new mapboxgl.Map({
      container: mapElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 14,
   });
}

export async function initSearchFormMapbox(formElement, callback) {
   formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      mapboxClient.geocodeForward(
         e.target.geoloc.value,
         {
            country: "ar",
            autocomplete: true,
            language: "es",
         },
         function (err, data, res) {
            if (!err) callback(data.features);
         }
      );
   });
}
