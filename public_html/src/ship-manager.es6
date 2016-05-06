"use strict";

import {Ship, Direction} from './ship.es6';
import Projectile from './projectile.es6';
import {intersects, insertClip} from './util.es6';

export default class ShipManager {
  constructor(container, w, h) {

    this.container = container;
    this.sceneSize = {width: w, height: h};
    this.missiles = [];
    this.ships = [];
    this.initShips();
    this.initKeyInputs();
  }

  update(dt) {
    this.playerShip.update(dt);
    this.enemyShip.update(dt);
    if (this.playerShip.firePosition !== null && this.playerShip.firePosition !== undefined) {
      this.createMissile(this.playerShip.position.x, this.playerShip.position.x, this.playerShip.team);
    }
    if (this.enemyShip.firePosition !== null && this.enemyShip.firePosition !== undefined) {
      this.createMissile(this.enemyShip.position.x, this.enemyShip.position.x, this.enemyShip.team);
    }
    for (let missile of this.missiles) {
      console.log(missile.team, this.playerShip.team);
      missile.update(dt);
      let exp = false;
      for (let ship of this.ships) {
        if (ship.team !== missile.team && intersects(missile.getBounds(), ship.getBounds())) {
          ship.takeDamage(missile.damage);
          exp = true;
        }
      }
      if (exp) {
        missile.explode();
        this.destroyMissile(missile);
      }
    }
  }

  createMissile(start, end, team) {
    const texture = PIXI.loader.resources["assets/icon.png"].texture;
    const angle = Math.atan((end.y - start.y) / (end.x - start.x));
    const missile = new Projectile(texture, angle, team, 7, 28);
    missile.position = start;
    this.missiles.push(missile);
    this.container.addChild(missile);
  }

  destroyMissile(missile) {
    this.missiles.splice(this.missiles.indexOf(missile), 1);
    this.container.removeChild(missile);
    missile.destroy();
  }

  initShips() {
    const st = {
      damage: 5,
      speed: 1,
      health: 20
    };
    const playerShip = new Ship(new PIXI.Texture.fromFrame("assets/ship.png"), st, this.sceneSize);
    this.playerShip = playerShip;
    playerShip.anchor = new PIXI.Point(0, 0.5);
    playerShip.position = new PIXI.Point(50, this.sceneSize.height / 2);
    this.container.addChild(this.playerShip);
    this.playerShip.initHealthBar();
    this.playerShip.team = 0;
    this.ships.push(this.playerShip);

    this.container.on('click', (e) => {
      if (e.data.originalEvent.offsetX < this.sceneSize.width / 2) return;
      const start = new PIXI.Point(this.playerShip.position.x + this.playerShip.width, this.playerShip.position.y);
      const end = new PIXI.Point(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
      this.createMissile(start, end, this.playerShip.team);
    });

    this.addEnemyShip();
  }

  addEnemyShip() {
    const st = {
      damage: 5,
      speed: 1,
      health: 20
    };

    const enemyShip = new Ship(new PIXI.Texture.fromFrame("assets/ship.png"), st, this.sceneSize);
    enemyShip.anchor = new PIXI.Point(0, 0.5);
    enemyShip.position = new PIXI.Point(this.sceneSize.width - 50, enemyShip.height / -2);
    enemyShip.scale.x = -1;
    enemyShip.direction = Direction.Down;
    enemyShip.team = 1;
    enemyShip.die = () => {
      this.ships.splice(this.ships.indexOf(enemyShip), 1);

      // // const asp = clip.height / clip.width;
      // // clip.width = 600;
      // // clip.height = clip.width * asp;
      // insertClip("destruction.json", this.container, {
      //
      // }, 2000);
    };

    this.ships.push(enemyShip);
    this.enemyShip = enemyShip;
    this.container.addChild(this.enemyShip);
    this.enemyShip.initHealthBar();

    setTimeout(() => {
      this.setNextEnemyMove();
    }, Math.random() * this.sceneSize.height / this.enemyShip.speed);
  }

  setNextEnemyShot() {

  }

  setNextEnemyMove() {
    if (this.enemyShip.health <= 0) {
      this.enemyShip.destroy();
      this.addEnemyShip();
    } else {
      const rand = Math.random() * 10;
      if (this.enemyShip.direction === Direction.Up) {
        if (rand <= 3) this.enemyShip.direction = Direction.None;
        else this.enemyShip.direction = Direction.Down;
      } else if (this.enemyShip.direction === Direction.Down) {
        if (rand <= 3) this.enemyShip.direction = Direction.None;
        else this.enemyShip.direction = Direction.Up;
      } else { //None
        if (rand <= 5) this.enemyShip.direction = Direction.Down;
        else this.enemyShip.direction = Direction.Up;
      }
      let maxInterval; //in ms; we need to configure this so that the enemy won't stay against a wall
      let minInterval = 1000;
      if (this.enemyShip.direction === Direction.Up) {
        maxInterval = this.enemyShip.position.y / this.enemyShip.speed;
      } else if (this.enemyShip.direction === Direction.Down) {
        maxInterval = (this.sceneSize.height - this.enemyShip.position.y) / this.enemyShip.speed;
      } else { //None
        maxInterval = 1000;
        minInterval = 500;
      }
      setTimeout(() => {
        this.setNextEnemyMove();
      }, Math.random() * maxInterval);
    }
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
        }      } else {
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
      } else {
        return;
      }
      this.keyInputStack.splice(ind, 1);
      this.playerShip.direction = this.keyInputStack[this.keyInputStack.length - 1];
    });
  }
}
