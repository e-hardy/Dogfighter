'use strict';

import {remove} from '../util.es6';

export default class GameContainer extends PIXI.Container {

  constructor() {
    super();
    this.anims = [];
  }

  addChild(child) {
    super.addChild(child);
    this.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return a.zIndex - b.zIndex;
    });
  }

  animateToPoint(obj, pt, speed = 2) {
    const dx = pt.x - obj.position.x;
    const dy = pt.y - obj.position.y;
    const theta = Math.atan2(dy, dx);

    this.anims.push({
      obj: obj,
      velocity: {x: speed * Math.cos(theta), y: speed * Math.sin(theta)},
      dest: pt
    });
  }

  update(dt) {
    for (let i = 0; i < this.anims.length; i++) {
      const a = this.anims[i];
      a.obj.position.x += a.velocity.x * dt;
      a.obj.position.y += a.velocity.y * dt;
      if ((a.dest.x - a.obj.position.x) * a.velocity.x <= 0) {
        a.obj.position = a.dest;
        remove(this.anims, a);
        i--;
      }
    }
  }
}
