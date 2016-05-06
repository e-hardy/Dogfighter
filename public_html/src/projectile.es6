"use strict";

import {insertClip} from './util.es6';

const gravity = 0.045;

export default class Projectile extends PIXI.Sprite {
  constructor(texture, angle, team, damage = 7, velocity = 27) {
    super(texture);
    this.xVelocity = Math.cos(angle) * velocity;
    this.yVelocity = Math.sin(angle) * velocity;
    this.team = team;
    this.damage = damage;
    this.anchor = new PIXI.Point(0.5, 0.5);
    this.zIndex = 4;
  }

  update(dt) {
    this.position.x += this.xVelocity;
    this.position.y += this.yVelocity;
    this.yVelocity += gravity * dt;
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

    // const loader = PIXI.loader;
    //
    // console.log(loader.resources["assets/hit.json"]);
    // const arr = [];
    // for (let res in loader.resources["assets/hit.json"].textures) {
    //   arr.push(loader.resources["assets/hit.json"].textures[res]);
    // }
    //
    // const clip = new PIXI.extras.MovieClip(arr);
    // clip.zIndex = 5;
    // // const asp = clip.height / clip.width;
    // // clip.width = 600;
    // // clip.height = clip.width * asp;
    // clip.animationSpeed = 0.8;
    // clip.loop = false;
    // clip.anchor = new PIXI.Point(0.5, 0.5);
    // clip.position = this.position;
    // clip.position.x += 30;
    // this.parent.addChild(clip);
    // clip.play();
    // setTimeout(()=>{
    //   clip.parent.removeChild(clip);
    //   clip.destroy();
    // }, 2000);
  }
}
