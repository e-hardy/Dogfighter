"use strict";

import Ship from '../display_objects/ship.es6';
import Projectile from '../display_objects/projectile.es6';
import PlayerManager from './player-manager.es6';
import EnemyManager from './enemy-manager.es6';
import {intersects, insertClip, Direction, remove} from '../util.es6';

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
      const missile = this.missiles[i];
      missile.update(dt);
      let exp = false;
      for (let ship of this.ships) {
        if (ship.team !== missile.team && intersects(missile.getBounds(), ship.getBounds(), 30)) {
          ship.takeDamage(missile.damage);
          exp = true;
        }
      }
      const sceneRect = {
        x: 0, y: 0, width: this.sceneSize.width, height: this.sceneSize.height
      };
      if (exp) {
        missile.explode();
        this.destroyMissile(missile);
      } else if (!intersects(missile.getBounds(), sceneRect)) {
        this.container.removeChild(missile);
        remove(this.missiles, missile);
        i--;
      }
    }
  }

  createMissile(start, heading, team, speed = 2) {
    //heading can either be an endpoint (PIXI.Point) or an angle (Number)
    const angle = (heading.x === undefined) ?
        heading : Math.atan((heading.y - start.y) / (heading.x - start.x));
    const texture = PIXI.loader.resources["assets/missile.png"].texture;
    const missile = new Projectile(texture, angle, team, 7, speed);
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
