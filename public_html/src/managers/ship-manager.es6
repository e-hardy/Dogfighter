"use strict";

import Ship from '../display_objects/ship.es6';
import Projectile from '../display_objects/projectile.es6';
import PlayerManager from './player-manager.es6';
import EnemyManager from './enemy-manager.es6';
import {intersects, insertClip, Direction, remove, getBounds} from '../util.es6';
import {getStatsForShipType, ShipType} from '../data.es6';

export default class ShipManager {
  constructor(container, w, h) {

    this.container = container;
    this.sceneSize = {width: w, height: h};
    this.missiles = [];
    this.ships = [];
    this.playerManager = new PlayerManager(this);
    this.enemyManager = new EnemyManager(this);
  }

  update(dt) {
    for (let ship of this.ships) {
      ship.update(dt);
    }
    for (let i = 0; i < this.missiles.length; i++) {
      const shipsHit = [];
      const missile = this.missiles[i];
      missile.update(dt);
      for (let ship of this.ships) {
        if (!ship.shrunk && ship.team !== missile.team && intersects(getBounds(missile), getBounds(ship))) {
          ship.takeDamage(missile.damage);
          shipsHit.push(ship);
        }
      }
      const sceneRect = {
        x: 0, y: 0, width: this.sceneSize.width, height: this.sceneSize.height
      };
      if (shipsHit.length > 0) {
        missile.explode(shipsHit);
        this.destroyMissile(missile);
      } else if (!intersects(getBounds(missile), sceneRect)) {
        this.container.removeChild(missile);
        remove(this.missiles, missile);
        i--;
      }
    }
  }

  createShip(shipType, deathCB) {
    const stats = getStatsForShipType(shipType);
    const text = new PIXI.Texture.fromFrame(stats.texturePath);
    const ship = new Ship(text, stats, this.sceneSize);
    const [w, h] = [this.sceneSize.width, this.sceneSize.height];
   if (shipType !== ShipType.Boss) {
      ship.width *= 0.8;
      ship.height *= 0.8;
   } else {
     this.playerManager.refreshPlayer();
   }
    ship.anchor = new PIXI.Point(0, 0.5);
    if (shipType === ShipType.Player) {
      ship.direction = Direction.None;
      ship.team = 0;
      ship.position = new PIXI.Point(50, h / 2);
    } else {
       ship.direction = Direction.Down;
      //ship.direction = Direction.None;
      ship.team = 1;
      ship.position = new PIXI.Point(w - 50 - ship.width, ship.height / -2);
    }
    ship.die = () => {
      this.destroyShip(ship);
      if (deathCB) {
        deathCB();
      }
    };
    this.ships.push(ship);
    this.container.addChild(ship);

    // ship.position.y = this.container.height / 2;

    return ship;
  }

  destroyShip(ship) {
    remove(this.ships, ship);
    insertClip("destruction.json", this.container, {
      width: ship.width * 2.2,
      zIndex: 5,
      animationSpeed: 0.6,
      loop: false,
      anchor: new PIXI.Point(0.5, 0.5),
      position: new PIXI.Point(ship.position.x + 100, ship.position.y - 30)
    }, 2000);
    setTimeout(() => {
      this.container.removeChild(ship);
      ship.destroy();
    }, 125);
  }

  createMissile(start, heading, ship, speed = 2) {
    //heading can either be an endpoint (PIXI.Point) or an angle (Number)
    const angle = (heading.x === undefined) ?
        heading : Math.atan((heading.y - start.y) / (heading.x - start.x));
    const texture = PIXI.loader.resources["assets/missile.png"].texture;
    const missile = new Projectile(texture, angle, ship.team, ship.damage, speed);
    // if (ship.team === 0) {
    //   missile.yVelocity += ship.velocity * 0.3;
    // }
    if (angle > Math.PI / 2) {
      missile.scale.x = -1;
    }
    missile.position = start;
    const asp = missile.height / missile.width;
    missile.width = 60;
    missile.height = asp * missile.width;
    this.missiles.push(missile);
    this.container.addChild(missile);
  }

  destroyMissile(missile) {
    this.missiles.splice(this.missiles.indexOf(missile), 1);
    this.container.removeChild(missile);
    missile.destroy();
  }
}
