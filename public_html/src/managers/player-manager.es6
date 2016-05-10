"use strict";

import {Direction} from '../util.es6';
import Ship from '../display_objects/ship.es6';
import {getStatsForShipType, ShipType} from '../data.es6';

export default class PlayerManager {
  constructor(shipManager) {
    this.shipManager = shipManager;
    this.initPlayerShip();
    this.initKeyInputs();
  }

  initPlayerShip() {
    const st = getStatsForShipType(ShipType.Player);
    const playerShip = new Ship(new PIXI.Texture.fromFrame(st.texturePath), st, this.shipManager.sceneSize);
    playerShip.anchor = new PIXI.Point(0, 0.5);
    playerShip.position = new PIXI.Point(50, this.shipManager.sceneSize.height / 2);
    playerShip.width *= 0.7;
    playerShip.height *= 0.7;
    this.playerShip = playerShip;
    this.shipManager.container.addChild(this.playerShip);
    playerShip.team = 0;
    playerShip.die = () => {
      this.shipManager.destroyShip(playerShip);
    };
    this.shipManager.ships.push(playerShip);

    this.shipManager.container.on('click', (e) => {
      if (e.data.originalEvent.offsetX < this.shipManager.sceneSize.width / 2 || !this.playerShip.shoot()) return;
      const start = new PIXI.Point(this.playerShip.position.x + this.playerShip.width, this.playerShip.position.y);
      const end = new PIXI.Point(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
      this.shipManager.createMissile(start, end, this.playerShip.team, this.playerShip.damage, this.playerShip.missileSpeed);
    });
  }

  initKeyInputs() {
    this.keyInputStack = [Direction.None];

    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyQ") {
        //move the ship up
        if (this.keyInputStack.indexOf(Direction.Up) === -1) {
          this.keyInputStack.push(Direction.Up);
        }
      } else if (e.code === "KeyE") {
        //move the ship down
        if (this.keyInputStack.indexOf(Direction.Down) === -1) {
          this.keyInputStack.push(Direction.Down);
        }
      } else {
        return;
      }
      this.playerShip.direction = this.keyInputStack[this.keyInputStack.length - 1];
    });

    window.addEventListener("keyup", (e) => {
      let ind = 0;
      if (e.code === "KeyQ") {
        //move the ship up
        ind = this.keyInputStack.indexOf(Direction.Up);
      } else if (e.code === "KeyE") {
        //move the ship down
        ind = this.keyInputStack.indexOf(Direction.Down);
      } else if (e.code === "KeyK") {
        //kill all enemies (for debugging -- and feeling badass)
        for (let i = 0; i < this.shipManager.ships.length; i++) {
          const ship = this.shipManager.ships[i];
          if (ship.team !== this.playerShip.team) {
            ship.die();
            i--;
          }
        }
        return;
      } else {
        return;
      }
      this.keyInputStack.splice(ind, 1);
      this.playerShip.direction = this.keyInputStack[this.keyInputStack.length - 1];
    });
  }
}
