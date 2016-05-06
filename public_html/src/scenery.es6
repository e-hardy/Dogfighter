'use strict';

class Layer {
  constructor(texture, container, sceneSize, v, yOffset, zIndex) {
    this.velocity = v;
    this.container = container;
    this.sprites = [];
    this.sceneSize = sceneSize;
    this.initSprites(texture, yOffset, zIndex);
  }
  initSprites(texture, yOffset, zIndex) {
    const numCopies = Math.max(this.sceneSize.width / texture.width, 1) + 1;
    let currX = 0;
    for (let i = 0; i < numCopies; i++) {
      const sprite = new PIXI.Sprite(texture);
      sprite.position.y = this.sceneSize.height - sprite.height - yOffset;
      sprite.position.x = currX;
      sprite.zIndex = zIndex;
      currX += texture.width;
      this.sprites.push(sprite);
      this.container.addChild(sprite);
    }
  }
  update(dt) {
    for (const sprite of this.sprites) {
      sprite.x -= this.velocity * dt;
      if (sprite.x + sprite.width <= 0) {
        while (sprite.x < this.sceneSize.width) {
          sprite.x += sprite.width;
        }
      }
    }
  }
}

export default class SceneryManager {
  constructor(container, w, h) {
    this.container = container;
    this.layers = [];
    this.sceneSize = {width: w, height: h};
  }
  loadData(resources) {
    let v = 0.01, y = 200, i = 0;
    for (const resource in resources) {
      const layer = new Layer(resources[resource], this.container, this.sceneSize, v += 0.05, y -= 60, v);
      this.layers.push(layer);
    }
  }
  update(dt) {
    for (const layer of this.layers) {
      layer.update(dt);
    }
  }
}
