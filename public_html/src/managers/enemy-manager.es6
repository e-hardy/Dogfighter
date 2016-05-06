"use strict";

import {Direction} from '../util.es6';
import Ship from '../display_objects/ship.es6';

export default class EnemyManager {
  constructor(shipManager) {
    this.shipManager = shipManager;
    this.addEnemyShip();
  }

  addEnemyShip() {
    const st = {
      damage: 5,
      speed: 1,
      health: 20
    };

    const enemyShip = new Ship(new PIXI.Texture.fromFrame("assets/ship.png"), st, this.shipManager.sceneSize);
    enemyShip.anchor = new PIXI.Point(0, 0.5);
    enemyShip.position = new PIXI.Point(this.shipManager.sceneSize.width - 50, enemyShip.height / -2);
    enemyShip.scale.x = -1;
    enemyShip.direction = Direction.Down;
    enemyShip.team = 1;
    enemyShip.die = () => {
      this.shipManager.ships.splice(this.shipManager.ships.indexOf(enemyShip), 1);

      // // const asp = clip.height / clip.width;
      // // clip.width = 600;
      // // clip.height = clip.width * asp;
      // insertClip("destruction.json", this.shipManager.container, {
      //
      // }, 2000);
    };

    this.shipManager.ships.push(enemyShip);
    this.shipManager.container.addChild(enemyShip);
    enemyShip.initHealthBar();

    setTimeout(() => {
      this.setNextMove(enemyShip);
    }, Math.random() * this.shipManager.sceneSize.height / enemyShip.speed);
  }

  setNextShot() {

  }

  setNextMove(ship) {
    if (ship.health <= 0) {
      ship.destroy();
      this.addEnemyShip();
    } else {
      const rand = Math.random() * 10;
      if (ship.direction === Direction.Up) {
        if (rand <= 3) ship.direction = Direction.None;
        else ship.direction = Direction.Down;
      } else if (ship.direction === Direction.Down) {
        if (rand <= 3) ship.direction = Direction.None;
        else ship.direction = Direction.Up;
      } else { //None
        if (rand <= 5) ship.direction = Direction.Down;
        else ship.direction = Direction.Up;
      }
      let maxInterval; //in ms; we need to configure this so that the enemy won't stay against a wall
      let minInterval = 1000;
      if (ship.direction === Direction.Up) {
        maxInterval = ship.position.y / ship.speed;
      } else if (ship.direction === Direction.Down) {
        maxInterval = (this.shipManager.sceneSize.height - ship.position.y) / ship.speed;
      } else { //None
        maxInterval = 1000;
        minInterval = 500;
      }
      setTimeout(() => {
        this.setNextMove(ship);
      }, Math.random() * maxInterval);
    }
  }
}
