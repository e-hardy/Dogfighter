'use strict';

import {constants} from '../data.es6';
import {Direction} from '../util.es6';

export default function initKeyInputs(playerManager) {
    playerManager.keyInputStack = [Direction.None];

    window.addEventListener("keydown", (e) => {
      let dir;
      if (e.code === "KeyQ") {
        //move the ship up
        dir = Direction.Up;
      } else if (e.code === "KeyE") {
        //move the ship down
        dir = Direction.Down;
      } else if (e.code === "KeyA" || e.code === "KeyD") {
        const dir = (e.code === "KeyA") ? Direction.Up : Direction.Down;
        playerManager.boostPlayer(dir);
        return;
      } else {
        return;
      }
      if (playerManager.keyInputStack.indexOf(dir) === -1) {
        playerManager.keyInputStack.push(dir);
      }
      playerManager.playerShip.direction = playerManager.keyInputStack[playerManager.keyInputStack.length - 1];
    });

    window.addEventListener("keyup", (e) => {
      let ind = 0;
      switch (e.code) {
        case "KeyQ":
          //move the ship up
          ind = playerManager.keyInputStack.indexOf(Direction.Up);
          break;
        case "KeyE":
          //move the ship down
          ind = playerManager.keyInputStack.indexOf(Direction.Down);
          break;
        case "KeyK":
          //kill all enemies (for debugging -- and feeling badass)
          for (let i = 0; i < playerManager.shipManager.ships.length; i++) {
            const ship = playerManager.shipManager.ships[i];
            if (ship.team !== playerManager.playerShip.team) {
              ship.die();
              i--;
            }
          }
          return;
        case "KeyP":
          //toggle pacifism
          constants.pacifism = !constants.pacifism;
          return;
        case "KeyS":
          //suicide
          playerManager.playerShip.die();
          return;
        default:
          return;
      }
      playerManager.keyInputStack.splice(ind, 1);
      playerManager.playerShip.direction = playerManager.keyInputStack[playerManager.keyInputStack.length - 1];
    });
  }
