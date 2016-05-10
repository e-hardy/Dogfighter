"use strict";

import {insertClip} from '../util.es6';

const gravity = 0.002;

export default class Projectile extends PIXI.Sprite {
  constructor(texture, angle, team, damage, velocity = 2) {
    super(texture);
    this.xVelocity = Math.cos(angle) * velocity;
    this.yVelocity = Math.sin(angle) * velocity;
    this.team = team;
    this.damage = damage;
    this.anchor = new PIXI.Point(0.5, 0.5);
    this.zIndex = 4;
  }

  static gravity() {
    return gravity;
  }

  update(dt) {
    this.position.x += this.xVelocity * dt;
    this.position.y += this.yVelocity * dt;
    this.yVelocity += gravity * dt;
    const angle = Math.atan(this.yVelocity / this.xVelocity);
    this.rotation = angle;
  }

  explode() {

    //TODO: does an explosion follow the ship? or stay in air?


    insertClip("hit.json", this.parent, {
      zIndex: 5,
      animationSpeed: 0.8,
      loop: false,
      anchor: new PIXI.Point(0.5, 0.5),
      position: new PIXI.Point(this.position.x + 30, this.position.y)
    }, 2000);
  }
}
