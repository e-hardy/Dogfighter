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
  let stats;// [health, speed, damage, texturePath, maxShield, aimRand];
  //aimRand is the range (up or down) around the target that the enemy may aim at
  switch (shipType) {
    case ShipType.Player:
      stats  = [50, 1, 9, 'player.png', 12];
      break;
    case ShipType.Grunt:
      stats  = [15, 1.2, 5, 'grunt.png', 0, 150];
      break;
    case ShipType.Brute:
      stats  = [25, 0.8, 12, 'brute.png', 0, 70];
      break;
    case ShipType.Elite:
      stats  = [45, 1.4, 15, 'elite.png', 0, 40];
      break;
    case ShipType.Boss:
      stats  = [200, 0.6, 25, 'boss.png', 40, 120];
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
    aimRand: stats[5]
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
