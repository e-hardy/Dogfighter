"use strict";

import SceneryManager from './managers/scenery-manager.es6';
import ShipManager from './managers/ship-manager.es6';
import GameContainer from './display_objects/game-container.es6';
import getDefaultOverlay from './display_objects/hud-overlay.es6';
import {loadTextures} from './data.es6';
import {restartGame} from './game-cycle.es6';

const gravity = 0.3, spawnPeriod = 700, pushStrength = -20,
      initialY = 200;

const renderer = PIXI.autoDetectRenderer(1200, 700);
document.body.appendChild(renderer.view);
renderer.view.style.position = 'absolute';
renderer.view.style.left = '50%';
renderer.view.style.top = '50%';
renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
renderer.backgroundColor = 0xe6ffff;
// renderer.width += 200;
window.renderer = renderer;

let container = new GameContainer();
container.sceneSize = {width: renderer.width, height: renderer.height};
container.interactive = true;
container.r = renderer;
window.container = container;

const loader = loadTextures(startGame);

let sceneryManager, shipManager;
window.sceneryManager = sceneryManager;
window.shipManager = shipManager;

document.body.appendChild(renderer.view);

function restart() {
  container.destroy();
  container = new GameContainer();
  container.sceneSize = {width: renderer.width, height: renderer.height};
  container.interactive = true;
  getDefaultOverlay(container, true).restart = restart;

  sceneryManager = new SceneryManager(container, renderer.width, renderer.height);
  shipManager = new ShipManager(container, renderer.width, renderer.height);

  sceneryManager.loadData(loader.resources["assets/clouds.json"].textures);
}

function startGame() {

  getDefaultOverlay(container).restart = restart;

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
   container.update(dt);

   renderer.render(container);
}
