'use strict';

import GameContainer from './game-container.es6';
import {fontForSize, constants} from '../data.es6';

class HudOverlay extends GameContainer {
  constructor(size) {
    super();
    this.sceneSize = size;
    this.zIndex = 20;
    this.initElements();
  }

  set waveNumber(w) {
    this._waveNumber = w;
    this.waveLabel.text = "Wave " + w;
  }

  get waveNumber() { return this._waveNumber; }

  initElements() {
    const waveLabel = new PIXI.Text("Wave 1", fontForSize(24));
    waveLabel.anchor.set(1, 1);
    waveLabel.position.set(this.sceneSize.width - 20, this.sceneSize.height - 15);
    this.addChild(waveLabel);
    this.waveLabel = waveLabel;
    this._waveNumber = 1;

    const boostLabel = new PIXI.Text("Boost", fontForSize(22));
    boostLabel.anchor.set(0, 1);
    boostLabel.position.set(20, this.sceneSize.height - 28);
    this.addChild(boostLabel);
    this.boostLabel = boostLabel;
    const boostBar = new PIXI.Sprite.fromFrame('assets/gauge-container.png');
    boostBar.anchor.set(0, 1);
    boostBar.position.set(30 + boostLabel.width, this.sceneSize.height - 30);
    const boostFill = new PIXI.Sprite.fromFrame('assets/gauge-full.png');
    boostFill.anchor.set(0, 1);
    boostFill.position.set((boostBar.width - boostFill.width) / 2, (boostBar.height - boostFill.height) / -2);
    boostFill.maxWidth = boostFill.width;
    boostBar.addChild(boostFill);
    this.addChild(boostBar);
    this.boostFill = boostFill;
    boostBar.alpha = 0.7;
  }

  get playerBoostCharge() {
    return Math.round(constants.maxPlayerBoostCharge * this.boostFill.width / this.boostFill.maxWidth);
  }

  set playerBoostCharge(b) {
    this.boostFill.width = b / constants.maxPlayerBoostCharge * this.boostFill.maxWidth;
  }

  youDied() {
    const youDied = new PIXI.Sprite.fromFrame('assets/you-died.png');
    //youDied.width = this.sceneSize.width;
    youDied.anchor.set(0.5, 0.5);
    youDied.position.set(this.sceneSize.width / 2, this.sceneSize.height / 2);
    youDied.maxHeight = youDied.height;
    youDied.height *= 0.5;
    youDied.alpha = 0;

    const restartText = new PIXI.Text('Click anywhere to play again', fontForSize(32));
    restartText.anchor = new PIXI.Point(0.5, 1);
    restartText.position.set(this.sceneSize.width / 2, this.sceneSize.height + 200);
    this.addChild(restartText);

    setTimeout(() => {
      this.animations.push((dt, i, stopCb) => {
        if (youDied.alpha < 1) {
          youDied.height += youDied.maxHeight * 0.02;
          youDied.alpha += 0.04;
        }
        restartText.position.y -= 0.3 * dt;
        if (restartText.position.y <= this.sceneSize.height - 40) {
          restartText.position.y = this.sceneSize.height - 40;
          this.parent.on('click', (e) => {
            this.restart();
          });
          stopCb(i);
        }
      });
    }, 800);
    this.addChild(youDied);
    this.removeChild(this.boostLabel);
    this.removeChild(this.boostFill.parent);
  }

  update(dt) {
    super.update(dt);
    this.boostFill.width += this.boostFill.maxWidth * 0.0004 * dt;
    if (this.boostFill.width > this.boostFill.maxWidth) {
      this.boostFill.width = this.boostFill.maxWidth;
    }
  }
}

let hudOverlay;

export default function getDefaultOverlay(g, replace) {
  if (!hudOverlay || replace) {
    hudOverlay = new HudOverlay(g.sceneSize);
    g.addChild(hudOverlay);
  }
  return hudOverlay;
}
