/**** Class ****/
import { Gmap } from "./class/gmap.js"; // Google Maps wrapper class

/**** Data ****/
import { spots } from "./data/spots.js"; // Spot
import { elems } from "./data/elems.js"; // DOM Elements

/**** Functions ****/
import { guide } from "./guide.js"; // Guide functions

// Google Maps APIの読み込み
Gmap.loadScript().then(() => {
  const gmap = new Gmap('京都府京都市中京区二条城町');

// ボタンにイベントを付与
  const addMapEvents = spot => {
    // [MAP]
    elems.button.map.addEventListener('click', () => {
      gmap.setMarkerOnMap(spot.name);
    }, false);

    // [ACCESS]
    elems.button.access.addEventListener('click', () => {
      gmap.routing(spot.station.name, spot.name);
    }, false);
  };

  window.onload = async () => {
    // Spot
    let spot = spots[0];

    guide.updateSpotInfo(spot);
    await gmap.initMap();
    addMapEvents(spot);
  };
});

