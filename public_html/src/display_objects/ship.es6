"use strict";

import Projectile from './projectile.es6';
import {Direction} from '../util.es6';

const [HEALTH, DIRECTION, accelFactor, dragFactor]
  = [Symbol('HEALTH'), Symbol('DIRECTION'), 0.01, 0.9];

// const [UP, NONE, DOWN] =    <= we probably don't need this
//         [Symbol('up'), Symbol('none'), Symbol('down')];

export default class Ship extends PIXI.Sprite {
  constructor(texture, stats, sceneSize) {
    super(texture);
    //stats contains {damage, speed, health}
    //speed works like this: ships' accelerations are equal to half their speed,
    //and they can accelerate until they hit that speed, at which point they'll
    //remain at this speed until they change something
    this.speed = stats.speed;
    this.damage = stats.damage;
    this[HEALTH] = stats.health;
    this.maxHealth = stats.health;
    this.velocity = 0;
    this.direction = Direction.None;
    this.zIndex = 1;
    this.sceneSize = sceneSize;
    this.firePosition = null;
    this.isEdgeAccelerating = false;
    //this.initHealthBar();
  }

  initHealthBar() {
    const healthBar = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-container.png')),
          hbFill = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-fill.png'));
    healthBar.addChild(hbFill);
    hbFill.position.x = healthBar.width / 2 - hbFill.width / 2;
    hbFill.position.y = healthBar.height / 2 - hbFill.height / 2;
    this.addChild(healthBar);
    healthBar.position.x = this.width / 2 - healthBar.width / 2 - 10;
    healthBar.position.y = 10  - this.height / 2; //` - this.height / 2` because the ship's anchor.y = 0.5
    this.hbFill = hbFill;
    this.maxHbWidth = hbFill.texture.width;
    this.takeDamage(5);
  }

  takeDamage(damage) {
    this[HEALTH] -= damage;
    if (this[HEALTH] <= 0) {
      this[HEALTH] = 0;
      this.die();
    }
    this.hbFill.width = this.maxHbWidth * this[HEALTH] / this.maxHealth;
  }

  update(dt) {
    const a = this.position.y;
    this.velocity += this.speed * accelFactor * dt * this.direction;
    this.velocity *= dragFactor;
    if (Math.abs(this.velocity) >= this.speed) {
      const factor = (this.velocity > 0) ? 1 : -1;
      this.velocity = this.speed * factor;
    }

    this.position.y += this.velocity * dt;
    if (this.position.y < 0 && this.velocity < 0) this.position.y = 0;
    if (this.position.y > this.sceneSize.height && this.velocity > 0) this.position.y = this.sceneSize.height;
  }

}
