'use strict';

import GameContainer from './display_objects/game-container.es6';
import getDefaultOverlay from './display_objects/hud-overlay.es6';
import SceneryManager from './managers/scenery-manager.es6';
import ShipManager from './managers/ship-manager.es6';

export function restartGame() {
  let container = window.container;
  let renderer = window.renderer;
  container.destroy();
  container = new GameContainer();
  container.sceneSize = {width: renderer.width, height: renderer.height};
  container.interactive = true;
  let o = getDefaultOverlay();
  o = null;

  window.sceneryManager = new SceneryManager(container, renderer.width, renderer.height);
  window.shipManager = new ShipManager(container, renderer.width, renderer.height);

  window.sceneryManager.loadData(PIXI.loader.resources["assets/clouds.json"].textures);

}
