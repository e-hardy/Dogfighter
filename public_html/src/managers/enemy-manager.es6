"use strict";

import {Direction, insertClip} from '../util.es6';
import Ship from '../display_objects/ship.es6';
import Projectile from '../display_objects/projectile.es6';
import {getStatsForShipType, getShipsForWaveNumber, ShipType} from '../data.es6';


export default class EnemyManager {
  constructor(shipManager) {
    this.shipManager = shipManager;
    this.wave = 0;
    this.numShips = 0;
    this.sendNextWave();
  }

  sendNextWave() {
    const ships = getShipsForWaveNumber(this.wave);
    for (let ship of ships) {
      this.addEnemyShip(getStatsForShipType(ship));
    }
    this.wave++;
  }

  addEnemyShip({damage, speed, health, texturePath}) {
    const st = {
      damage: damage, //5
      speed: speed, //1
      health: health //20
    };
    this.numShips++;
    const text = new PIXI.Texture.fromFrame(texturePath);
    const enemyShip = new Ship(text, st, this.shipManager.sceneSize);
    enemyShip.width *= -0.7;
    enemyShip.height *= 0.7;
    enemyShip.anchor = new PIXI.Point(0, 0.5);
    enemyShip.position = new PIXI.Point(this.shipManager.sceneSize.width - 50, enemyShip.height / -2);
    enemyShip.direction = Direction.Down;
    enemyShip.team = 1;
    enemyShip.die = () => {
      this.numShips--;
      this.shipManager.destroyShip(enemyShip);
      // this.shipManager.ships.splice(this.shipManager.ships.indexOf(enemyShip), 1);
      // insertClip("destruction.json", this.shipManager.container, {
      //   width: enemyShip.width * 2.2,
      //   zIndex: 5,
      //   animationSpeed: 0.6,
      //   loop: false,
      //   anchor: new PIXI.Point(0.5, 0.5),
      //   position: new PIXI.Point(enemyShip.position.x - enemyShip.width / 2 + 30, enemyShip.position.y - 30)
      // }, 2000);
      // setTimeout(() => {
      //   this.shipManager.container.removeChild(enemyShip);
      //   enemyShip.destroy();
      // }, 125);
    };

    this.shipManager.ships.push(enemyShip);
    this.shipManager.container.addChild(enemyShip);

    setTimeout(() => {
      this.setNextMove(enemyShip);
      this.setNextShot(enemyShip);
    }, Math.random() * this.shipManager.sceneSize.height / enemyShip.speed);
  }

  shotWillHit(angle, shooter, target, start) {
    const vx = Math.cos(angle) * shooter.missileSpeed,
          vy = Math.sin(angle) * shooter.missileSpeed;
    const time = Math.abs((start.x - target.position.x + target.width / 2) / vx);
    const heightChange = vy * time + 0.5 * Projectile.gravity() * time * time;
    return (Math.abs(start.y + heightChange - target.position.y - target.velocity * time) <= 2);
  }

  setNextShot(ship) {
    if (ship.parent === null) {
      return;
    }
    const playerShip = this.shipManager.playerManager.playerShip;
    const start = new PIXI.Point(ship.position.x - ship.width, ship.position.y);
    let angle, worked = false;
    for (let theta = Math.PI / -3; theta <= Math.PI / 3; theta += 0.001) {
      if (this.shotWillHit(theta, ship, playerShip, start)) {
        angle = theta;
        worked = true;
        break;
      }
    }
    if (ship.shoot() && worked) {
      //console.log(angle);
      this.shipManager.createMissile(start, Math.PI - angle, ship.team, ship.damage, ship.missileSpeed);
    }
    setTimeout(() => {
      this.setNextShot(ship);
    }, Math.random() * 1000 + 1000);
  }

  setNextMove(ship) {
    if (ship.parent === null) {
      if (this.numShips === 0) {
        this.sendNextWave();
      }
      return;
    }
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
      let minInterval = 1000 / ship.speed; //slower ships should move for longer
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
