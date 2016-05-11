"use strict";

import Projectile from './projectile.es6';
import {Direction, gameStorage} from '../util.es6';
import {constants} from '../data.es6';

const [HEALTH, DIRECTION, SHIELD, accelFactor, dragFactor]
  = [Symbol('HEALTH'), Symbol('DIRECTION'), Symbol('SHIELD'), 0.01, 0.9];

// const [UP, NONE, DOWN] =    <= we probably don't need this
//         [Symbol('up'), Symbol('none'), Symbol('down')];

function updateBar(bar, dt, time) {
  if (bar.width < bar.maxWidth) {
    bar.width += bar.maxWidth / time * dt;
    if (bar.width > bar.maxWidth) bar.width = bar.maxWidth;
  }
}

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
    this.maxShield = stats.maxShield || 0;
    for (let key in stats) {
      this[key] = stats[key];
    }
    this[SHIELD] = this.maxShield;
    this.velocity = 0;
    this.direction = Direction.None;
    this.zIndex = 1;
    this.sceneSize = sceneSize;
    this.firePosition = null;
    this.isEdgeAccelerating = false;
    this.initHealthBar();
  }

  initHealthBar() {
    const healthBar = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-container.png')),
          hbFill = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-fill.png')),
          charge = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/gauge-full.png'));
    this.fillText = new PIXI.Texture.fromFrame('assets/gauge-fill.png');
    this.fullText = charge.texture;
    healthBar.addChild(hbFill);
    hbFill.position.x = healthBar.width / 2 - hbFill.width / 2;
    hbFill.position.y = healthBar.height / 2 - hbFill.height / 2;
    charge.position.x = hbFill.position.x;
    charge.position.y = healthBar.height;
    charge.height /= 2;
    healthBar.addChild(charge);
    this.chargeBar = charge;
    this.chargeBar.maxWidth = this.chargeBar.width;
    this.addChild(healthBar);
    healthBar.position.x = this.width / 2 - healthBar.width / 2 - 10;
    healthBar.position.y = -10 - this.height / 2; //` - this.height / 2` because the ship's anchor.y = 0.5
    this.hbFill = hbFill;
    this.maxHbWidth = hbFill.texture.width;

    this.shieldBar = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/shield.png'));
    this.shieldBar.maxWidth = (this.maxShield > 0) ? this.shieldBar.width : 0;
    this.shieldBar.width = this.shieldBar.maxWidth;
    this.shieldBar.restCount = 0;
    this.shieldBar.alpha = 0.6;
    this.shieldBar.position.x = hbFill.position.x;
    this.shieldBar.position.y = hbFill.position.y;
    healthBar.addChild(this.shieldBar);
  }

  shoot() {
    if (constants.pacifism) {
      return false;
    }
    if (this.chargeBar.width >= this.chargeBar.maxWidth) {
      this.chargeBar.width = 0.1;
      return true;
    }
    return false;
  }

  takeDamage(damage) {
    if (this.maxShield > 0) {
      this[SHIELD] = this.maxShield * this.shieldBar.width / this.maxHbWidth; // this is pretty bad but ehh
    }

    if (this[SHIELD] < damage) {
      damage -= this[SHIELD];
      this[SHIELD] = 0;
    } else {
      this[SHIELD] -= damage;
      damage = 0;
    }

    this[HEALTH] -= damage;
    if (this[HEALTH] <= 0) {
      this[HEALTH] = 0;
      this.die();
    }
    this.hbFill.width = this.maxHbWidth * this[HEALTH] / this.maxHealth;
    this.shieldBar.width = this.maxHbWidth * this[SHIELD] / this.maxShield;
    this.shieldBar.restCount = 0;
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

    updateBar(this.chargeBar, dt, this.chargeRegenTime);
    if (this.shieldBar.restCount < constants.shieldDelay) {
      this.shieldBar.restCount += dt;
    }
    if (this.shieldBar.restCount >= constants.shieldDelay) {
      updateBar(this.shieldBar, dt, this.shieldRegenTime);
    }
  }
}
