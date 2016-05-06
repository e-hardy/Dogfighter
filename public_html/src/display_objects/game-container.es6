'use strict';

export default class GameContainer extends PIXI.Container {

  addChild(child) {
    super.addChild(child);
    this.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return a.zIndex - b.zIndex;
    });
  }
}
