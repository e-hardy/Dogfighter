"use strict";

import {Direction} from '../util.es6';
import Ship from '../display_objects/ship.es6';
import getDefaultOverlay from '../display_objects/hud-overlay.es6';
import {getStatsForShipType, ShipType, constants} from '../data.es6';
import initKeyInputs from './mouse-manager.es6';

export default class PlayerManager {
  constructor(shipManager) {
    this.shipManager = shipManager;
    this.initPlayerShip();
    initKeyInputs(this);
  }

  initPlayerShip() {

    this.playerShip = this.shipManager.createShip(ShipType.Player, () => {
      getDefaultOverlay().youDied();
    });

    this.shipManager.container.on('click', (e) => {
      if (e.data.originalEvent.offsetX < this.shipManager.sceneSize.width / 2 || !this.playerShip.shoot() || !this.playerShip.parent) return;
      const start = new PIXI.Point(this.playerShip.position.x + this.playerShip.width, this.playerShip.position.y);
      const end = new PIXI.Point(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
      this.shipManager.createMissile(start, end, this.playerShip, this.playerShip.missileSpeed);
    });
  }

  boostPlayer(direction) {
    const hud = getDefaultOverlay();
    if (hud.playerBoostCharge < constants.maxPlayerBoostCharge) { return; }
    const s = this.playerShip;
    const y = (direction === Direction.Up) ?
      Math.max(s.position.y - constants.boostDist, 0)
      : Math.min(s.position.y + constants.boostDist, this.shipManager.sceneSize.height);
    const v = this.playerShip.velocity;
    this.playerShip.velocity = 0;
    this.playerShip.shrunk = true;
    this.shipManager.container.animateToPoint(
      s,
      new PIXI.Point(s.position.x, y),
      () => {
        this.playerShip.shrunk = false;
      },
      constants.playerBoostSpeed //speed
    );
    hud.playerBoostCharge = 0;
  }

  refreshPlayer() {
    this.playerShip.health = this.playerShip.maxHealth;
    this.playerShip.shield = this.playerShip.maxShield;
  }
}
