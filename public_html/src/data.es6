'use strict';

export const constants = {
  shieldRegenRate: 2,
  shieldDelay: 3000, //ms
  pacifism: false
};

export const ShipType = {
    get Player() {
      return 0;
    },
    get Grunt() {
      return 1;
    },
    get Brute() {
      return 2;
    },
    get Elite() {
      return 3;
    },
    get Boss() {
      return 4;
    }
};

const waveData = [
  [ShipType.Grunt], [ShipType.Grunt], [ShipType.Brute], [ShipType.Grunt],
  [ShipType.Grunt, ShipType.Grunt], [ShipType.Brute], [ShipType.Brute, ShipType.Grunt],
  [ShipType.Grunt], [ShipType.Elite], [ShipType.Brute, ShipType.Brute],
  [ShipType.Grunt, ShipType.Grunt, ShipType.Grunt], [ShipType.Grunt, ShipType.Grunt, ShipType.Brute],
  [ShipType.Elite, ShipType.Brute], [ShipType.Elite, ShipType.Elite], [ShipType.Boss]
];

export function getStatsForShipType(shipType) {
  let stats;// [health, speed, damage, texturePath, maxShield, aimRand, missileSpeed, shieldRegenTime, chargeRegenTime];
  //aimRand is the range (up or down) around the target that the enemy may aim at
  switch (shipType) {
    case ShipType.Player:
      stats  = [70, 1.2, 9, 'player.png', 30, 0, 2, 1000, 1000];
      break;
    case ShipType.Grunt:
      stats  = [15, 1, 5, 'grunt.png', 0, 150, 2, 1, 1100];
      break;
    case ShipType.Brute:
      stats  = [25, 0.8, 14, 'brute.png', 0, 70, 1.5, 1, 1300];
      break;
    case ShipType.Elite:
      stats  = [30, 1.1, 14, 'elite.png', 15, 40, 2.5, 600, 1000];
      break;
    case ShipType.Boss:
      stats  = [200, 0.4, 32, 'boss.png', 40, 120, 1.8, 1300, 1800];
      break;
    default:
      throw new Error('Invalid ship type!', 'data.es6');
  }
  return {
    health: stats[0],
    speed: stats[1],
    damage: stats[2],
    texturePath: 'assets/ships/' + stats[3],
    maxShield: stats[4],
    aimRand: stats[5],
    missileSpeed: stats[6],
    shieldRegenTime: stats[7],
    chargeRegenTime: stats[8]
  };
}

export function getShipsForWaveNumber(waveNumber) {
  //if waveNumber is out of bounds, we loop around to the start and
  //being doubling (or tripling, etc) the waves
  const len = waveData.length;
  const mult = Math.floor(waveNumber / len + 1);
  const ind = waveNumber % len;
  const arr = waveData[ind];
  let ships = [];
  for (let i = 0; i < mult; i++) {
    ships = ships.concat(arr);
  }
  return ships;
}

export function loadTextures(cb) {
  const loader = PIXI.loader;
  loader.add("assets/clouds.json");
  loader.add("assets/ships/player.png");
  loader.add("assets/ships/grunt.png");
  loader.add("assets/ships/brute.png");
  loader.add("assets/ships/elite.png");
  loader.add("assets/ships/boss.png");
  loader.add("assets/hp-container.png");
  loader.add("assets/hp-fill.png");
  loader.add("assets/destruction.json");
  loader.add("assets/missile.png");
  loader.add("assets/hit.json");
  loader.add("assets/gauge-fill.png");
  loader.add("assets/gauge-full.png");
  loader.add("assets/shield.png");
  loader.once('complete', cb);
  loader.load();
  return loader;
}
