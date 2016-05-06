"use strict";

import SceneryManager from './managers/scenery-manager.es6';
import ShipManager from './managers/ship-manager.es6';
import GameContainer from './display_objects/game-container.es6';

const gravity = 0.3, spawnPeriod = 700, pushStrength = -20,
      initialY = 200;

const renderer = PIXI.autoDetectRenderer(1000, 600);
document.body.appendChild(renderer.view);
renderer.view.style.position = 'absolute';
renderer.view.style.left = '50%';
renderer.view.style.top = '50%';
renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
renderer.backgroundColor = 0xe6ffff;

const container = new GameContainer();
container.interactive = true;

const loader = PIXI.loader;
loader.add("assets/clouds.json");
loader.add("assets/ship.png");
loader.add("assets/hp-container.png");
loader.add("assets/hp-fill.png");
loader.add("assets/destruction.json");
loader.add("assets/icon.png");
loader.add("assets/hit.json");
loader.once('complete', startGame);
loader.load();

let sceneryManager, shipManager;

document.body.appendChild(renderer.view);

function startGame() {

  sceneryManager = new SceneryManager(container, renderer.width, renderer.height);
  shipManager = new ShipManager(container, renderer.width, renderer.height);

 sceneryManager.loadData(loader.resources["assets/clouds.json"].textures);
  requestAnimationFrame(animate);
}

let lastTimestamp = 0;

function animate(timestamp) {
    requestAnimationFrame(animate);

    let ret = false;
    if (lastTimestamp === 0) ret = true;
    const dt = Math.min(timestamp - lastTimestamp, 100);
    lastTimestamp = timestamp;
    if (ret) return;

   sceneryManager.update(dt);
   shipManager.update(dt);

   renderer.render(container);
}
