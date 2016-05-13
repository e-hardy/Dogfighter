'use strict';

import {remove, zIndexSort} from '../util.es6';

export default class GameContainer extends PIXI.Container {

  constructor() {
    super();
    this.anims = [];
    this.animations = []; //this is so bad..
  }

  addChild(child) {
    super.addChild(child);
    this.children.sort(zIndexSort);
  }

  animateToPoint(obj, pt, completion, speed = 2) {
    const dx = pt.x - obj.position.x;
    const dy = pt.y - obj.position.y;
    const theta = Math.atan2(dy, dx);

    this.anims.push({
      obj: obj,
      velocity: {x: speed * Math.cos(theta), y: speed * Math.sin(theta)},
      dest: pt,
      neutralY: (dy === 0),
      neutralX: (dx === 0),
      completion: completion
    });
  }

  animate(cb) {
    this.anims.push(cb);
  }

  remCb(i) {
    remove(this.animations, this.animations[i]);
    i--;
  }

  update(dt) {
    for (let i = 0; i < this.anims.length; i++) {
      const a = this.anims[i];
      a.obj.position.x += a.velocity.x * dt;
      a.obj.position.y += a.velocity.y * dt;
      const xSatisfied = ((a.dest.x - a.obj.position.x) * a.velocity.x <= 0) || a.neutralX;
      const ySatisfied = ((a.dest.y - a.obj.position.y) * a.velocity.y <= 0) || a.neutralY;
      if (xSatisfied && ySatisfied) {
        a.obj.position = a.dest;
        if (a.completion) { a.completion(); }
        remove(this.anims, a);
        i--;
      }
    }
    for (let i = 0; i < this.animations.length; i++) {
      this.animations[i](dt, i, this.remCb.bind(this));
    }
    for (let child of this.children) {
      if (child.animateToPoint) {
        child.update(dt);
      }
    }
  }
}
