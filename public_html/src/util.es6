"use strict";

export const Direction = {
    get Up() { return -1; },
    get None() { return 0; }, //default
    get Down() { return 1; }
};

export function intersects(r1, r2) {
  return !(r1.x + r1.width < r2.x || r1.x > r2.x + r2.width || r1.y + r1.height < r2.y || r1.y > r2.y + r2.height);
}

export function remove(arr, element) {
  arr.splice(arr.indexOf(element), 1);
}

export function insertClip(name, container, options, destroyTime) {
  //name doesn't include the assets/ part, but does include extension
  //options is a set of k/v pairs to be set on the clip object
  //if destroyTime is -1, it won't be removed
  const loader = PIXI.loader;
  const texts = loader.resources["assets/" + name].textures;
  const arr = [];
  for (let res in texts) {
    arr.push(texts[res]);
  }

  const clip = new PIXI.extras.MovieClip(arr);

  for (let prop in options) {
    if (prop === "width") {
      const asp = clip.height / clip.width;
      clip.width = 600;
      clip.height = clip.width * asp;
    }
    clip[prop] = options[prop];
  }

  container.addChild(clip);
  clip.play();

  if (destroyTime >= 0) {
    setTimeout(()=>{
      clip.parent.removeChild(clip);
      clip.destroy();
    }, destroyTime);
  }
}
