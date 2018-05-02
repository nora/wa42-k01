import {elems} from "./data/elems.js";

export const guide = {
  // サイドの情報を更新する
  updateSpotInfo: spot => {
    let img = document.createElement("img");
    img.src = spot.image;
    img.alt = spot.name;
    elems.text.image.innerHTML = "";

    elems.text.name.innerText = spot.name;
    elems.text.image.appendChild(img);
    elems.text.description.innerHTML = spot.description;
  }
}