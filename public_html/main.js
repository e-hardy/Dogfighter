/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _sceneryManager = __webpack_require__(1);

	var _sceneryManager2 = _interopRequireDefault(_sceneryManager);

	var _shipManager = __webpack_require__(2);

	var _shipManager2 = _interopRequireDefault(_shipManager);

	var _gameContainer = __webpack_require__(9);

	var _gameContainer2 = _interopRequireDefault(_gameContainer);

	var _data = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gravity = 0.3,
	    spawnPeriod = 700,
	    pushStrength = -20,
	    initialY = 200;

	var renderer = PIXI.autoDetectRenderer(1000, 600);
	document.body.appendChild(renderer.view);
	renderer.view.style.position = 'absolute';
	renderer.view.style.left = '50%';
	renderer.view.style.top = '50%';
	renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
	renderer.backgroundColor = 0xe6ffff;

	var container = new _gameContainer2.default();
	container.interactive = true;
	container.r = renderer;

	var loader = (0, _data.loadTextures)(startGame);

	var sceneryManager = void 0,
	    shipManager = void 0;

	document.body.appendChild(renderer.view);

	function startGame() {

	  sceneryManager = new _sceneryManager2.default(container, renderer.width, renderer.height);
	  shipManager = new _shipManager2.default(container, renderer.width, renderer.height);

	  sceneryManager.loadData(loader.resources["assets/clouds.json"].textures);

	  requestAnimationFrame(animate);
	}

	var lastTimestamp = 0;

	function animate(timestamp) {
	  requestAnimationFrame(animate);

	  var ret = false;
	  if (lastTimestamp === 0) ret = true;
	  var dt = Math.min(timestamp - lastTimestamp, 100);
	  lastTimestamp = timestamp;
	  if (ret) return;

	  sceneryManager.update(dt);
	  shipManager.update(dt);

	  renderer.render(container);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Layer = function () {
	  function Layer(texture, container, sceneSize, v, yOffset, zIndex) {
	    _classCallCheck(this, Layer);

	    this.velocity = v;
	    this.container = container;
	    this.sprites = [];
	    this.sceneSize = sceneSize;
	    this.initSprites(texture, yOffset, zIndex);
	  }

	  _createClass(Layer, [{
	    key: 'initSprites',
	    value: function initSprites(texture, yOffset, zIndex) {
	      var numCopies = Math.max(this.sceneSize.width / texture.width, 1) + 1;
	      var currX = 0;
	      for (var i = 0; i < numCopies; i++) {
	        var sprite = new PIXI.Sprite(texture);
	        sprite.position.y = this.sceneSize.height - sprite.height - yOffset;
	        sprite.position.x = currX;
	        sprite.zIndex = zIndex;
	        currX += texture.width;
	        this.sprites.push(sprite);
	        this.container.addChild(sprite);
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update(dt) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.sprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var sprite = _step.value;

	          sprite.x -= this.velocity * dt;
	          if (sprite.x + sprite.width <= 0) {
	            while (sprite.x < this.sceneSize.width) {
	              sprite.x += sprite.width;
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }]);

	  return Layer;
	}();

	var SceneryManager = function () {
	  function SceneryManager(container, w, h) {
	    _classCallCheck(this, SceneryManager);

	    this.container = container;
	    this.layers = [];
	    this.sceneSize = { width: w, height: h };
	  }

	  _createClass(SceneryManager, [{
	    key: 'loadData',
	    value: function loadData(resources) {
	      var v = 0.01,
	          y = 200,
	          i = 0;
	      for (var resource in resources) {
	        var layer = new Layer(resources[resource], this.container, this.sceneSize, v += 0.05, y -= 60, v);
	        this.layers.push(layer);
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update(dt) {
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.layers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var layer = _step2.value;

	          layer.update(dt);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }]);

	  return SceneryManager;
	}();

	exports.default = SceneryManager;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ship2 = __webpack_require__(3);

	var _ship3 = _interopRequireDefault(_ship2);

	var _projectile = __webpack_require__(4);

	var _projectile2 = _interopRequireDefault(_projectile);

	var _playerManager = __webpack_require__(6);

	var _playerManager2 = _interopRequireDefault(_playerManager);

	var _enemyManager = __webpack_require__(8);

	var _enemyManager2 = _interopRequireDefault(_enemyManager);

	var _util = __webpack_require__(5);

	var _data = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ShipManager = function () {
	  function ShipManager(container, w, h) {
	    _classCallCheck(this, ShipManager);

	    this.container = container;
	    this.sceneSize = { width: w, height: h };
	    this.missiles = [];
	    this.ships = [];
	    this.playerManager = new _playerManager2.default(this);
	    this.enemyManager = new _enemyManager2.default(this);
	  }

	  _createClass(ShipManager, [{
	    key: 'update',
	    value: function update(dt) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.ships[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _ship = _step.value;

	          _ship.update(dt);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      for (var i = 0; i < this.missiles.length; i++) {
	        var shipsHit = [];
	        var missile = this.missiles[i];
	        missile.update(dt);
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	          for (var _iterator2 = this.ships[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var ship = _step2.value;

	            if (ship.team !== missile.team && (0, _util.intersects)((0, _util.getBounds)(missile), (0, _util.getBounds)(ship))) {
	              //  if (ship.team !== 0) console.log(missile.getLocalBounds(), missile.position.x, missile.parent, ship.getLocalBounds(), ship.position.x, ship.parent);
	              ship.takeDamage(missile.damage);
	              shipsHit.push(ship);
	            }
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }

	        var sceneRect = {
	          x: 0, y: 0, width: this.sceneSize.width, height: this.sceneSize.height
	        };
	        if (shipsHit.length > 0) {
	          missile.explode(shipsHit);
	          this.destroyMissile(missile);
	        } else if (!(0, _util.intersects)((0, _util.getBounds)(missile), sceneRect)) {
	          this.container.removeChild(missile);
	          (0, _util.remove)(this.missiles, missile);
	          i--;
	        }
	      }
	    }
	  }, {
	    key: 'createShip',
	    value: function createShip(shipType, deathCB) {
	      var _this = this;

	      var stats = (0, _data.getStatsForShipType)(shipType);
	      var text = new PIXI.Texture.fromFrame(stats.texturePath);
	      var ship = new _ship3.default(text, stats, this.sceneSize);
	      var w = this.sceneSize.width;
	      var h = this.sceneSize.height;

	      if (shipType !== _data.ShipType.Boss) {
	        ship.width *= 0.7;
	        ship.height *= 0.7;
	      }
	      ship.anchor = new PIXI.Point(0, 0.5);
	      if (shipType === _data.ShipType.Player) {
	        ship.direction = _util.Direction.None;
	        ship.team = 0;
	        ship.position = new PIXI.Point(50, h / 2);
	      } else {
	        ship.direction = _util.Direction.Down;
	        ship.team = 1;
	        ship.position = new PIXI.Point(w - 50 - ship.width, ship.height / -2);
	      }
	      ship.die = function () {
	        _this.destroyShip(ship);
	        if (deathCB) {
	          deathCB();
	        }
	      };
	      this.ships.push(ship);
	      this.container.addChild(ship);

	      // ship.position.y = this.container.height / 2;
	      // console.log(getBounds(ship));

	      return ship;
	    }
	  }, {
	    key: 'destroyShip',
	    value: function destroyShip(ship) {
	      var _this2 = this;

	      (0, _util.remove)(this.ships, ship);
	      (0, _util.insertClip)("destruction.json", this.container, {
	        width: ship.width * 2.2,
	        zIndex: 5,
	        animationSpeed: 0.6,
	        loop: false,
	        anchor: new PIXI.Point(0.5, 0.5),
	        position: new PIXI.Point(ship.position.x + 100, ship.position.y - 30)
	      }, 2000);
	      setTimeout(function () {
	        _this2.container.removeChild(ship);
	        ship.destroy();
	      }, 125);
	    }
	  }, {
	    key: 'createMissile',
	    value: function createMissile(start, heading, team, damage) {
	      var speed = arguments.length <= 4 || arguments[4] === undefined ? 2 : arguments[4];

	      //heading can either be an endpoint (PIXI.Point) or an angle (Number)
	      var angle = heading.x === undefined ? heading : Math.atan((heading.y - start.y) / (heading.x - start.x));
	      var texture = PIXI.loader.resources["assets/missile.png"].texture;
	      var missile = new _projectile2.default(texture, angle, team, damage, speed);
	      if (angle > Math.PI / 2) {
	        missile.scale.x = -1;
	      }
	      missile.position = start;
	      var asp = missile.height / missile.width;
	      missile.width = 60;
	      missile.height = asp * missile.width;
	      this.missiles.push(missile);
	      this.container.addChild(missile);
	    }
	  }, {
	    key: 'destroyMissile',
	    value: function destroyMissile(missile) {
	      this.missiles.splice(this.missiles.indexOf(missile), 1);
	      this.container.removeChild(missile);
	      missile.destroy();
	    }
	  }]);

	  return ShipManager;
	}();

	exports.default = ShipManager;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _projectile = __webpack_require__(4);

	var _projectile2 = _interopRequireDefault(_projectile);

	var _util = __webpack_require__(5);

	var _data = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HEALTH = Symbol('HEALTH');
	var DIRECTION = Symbol('DIRECTION');
	var SHIELD = Symbol('SHIELD');
	var accelFactor = 0.01;
	var dragFactor = 0.9;

	// const [UP, NONE, DOWN] =    <= we probably don't need this
	//         [Symbol('up'), Symbol('none'), Symbol('down')];

	function updateBar(bar, dt, time) {
	  if (bar.width < bar.maxWidth) {
	    bar.width += bar.maxWidth / time * dt;
	    if (bar.width > bar.maxWidth) bar.width = bar.maxWidth;
	  }
	}

	var Ship = function (_PIXI$Sprite) {
	  _inherits(Ship, _PIXI$Sprite);

	  function Ship(texture, stats, sceneSize) {
	    _classCallCheck(this, Ship);

	    //stats contains {damage, speed, health}
	    //speed works like this: ships' accelerations are equal to half their speed,
	    //and they can accelerate until they hit that speed, at which point they'll
	    //remain at this speed until they change something

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Ship).call(this, texture));

	    _this.speed = stats.speed;
	    _this.damage = stats.damage;
	    _this[HEALTH] = stats.health;
	    _this.maxHealth = stats.health;
	    _this.maxShield = stats.maxShield || 0;
	    for (var key in stats) {
	      _this[key] = stats[key];
	    }
	    _this[SHIELD] = _this.maxShield;
	    _this.velocity = 0;
	    _this.direction = _util.Direction.None;
	    _this.zIndex = 1;
	    _this.sceneSize = sceneSize;
	    _this.firePosition = null;
	    _this.isEdgeAccelerating = false;
	    _this.initHealthBar();
	    return _this;
	  }

	  _createClass(Ship, [{
	    key: 'initHealthBar',
	    value: function initHealthBar() {
	      var healthBar = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-container.png')),
	          hbFill = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-fill.png')),
	          charge = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/gauge-full.png'));
	      this.fillText = new PIXI.Texture.fromFrame('assets/gauge-fill.png');
	      this.fullText = charge.texture;
	      healthBar.addChild(hbFill);
	      hbFill.position.x = healthBar.width / 2 - hbFill.width / 2;
	      hbFill.position.y = healthBar.height / 2 - hbFill.height / 2;
	      charge.position.x = hbFill.position.x;
	      charge.position.y = healthBar.height;
	      charge.height /= 2;
	      healthBar.addChild(charge);
	      this.chargeBar = charge;
	      this.chargeBar.maxWidth = this.chargeBar.width;
	      this.addChild(healthBar);
	      healthBar.position.x = this.width / 2 - healthBar.width / 2 - 10;
	      healthBar.position.y = -10 - this.height / 2; //` - this.height / 2` because the ship's anchor.y = 0.5
	      this.hbFill = hbFill;
	      this.maxHbWidth = hbFill.texture.width;

	      this.shieldBar = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/shield.png'));
	      this.shieldBar.maxWidth = this.maxShield > 0 ? this.shieldBar.width : 0;
	      this.shieldBar.width = this.shieldBar.maxWidth;
	      this.shieldBar.restCount = 0;
	      this.shieldBar.alpha = 0.6;
	      this.shieldBar.position.x = hbFill.position.x;
	      this.shieldBar.position.y = hbFill.position.y;
	      healthBar.addChild(this.shieldBar);
	    }
	  }, {
	    key: 'shoot',
	    value: function shoot() {
	      if (_data.constants.pacifism) {
	        return false;
	      }
	      if (this.chargeBar.width >= this.chargeBar.maxWidth) {
	        this.chargeBar.width = 0.1;
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'takeDamage',
	    value: function takeDamage(damage) {
	      if (this.maxShield > 0) {
	        this[SHIELD] = this.maxShield * this.shieldBar.width / this.maxHbWidth; // this is pretty bad but ehh
	      }

	      if (this[SHIELD] < damage) {
	        damage -= this[SHIELD];
	        this[SHIELD] = 0;
	      } else {
	        this[SHIELD] -= damage;
	        damage = 0;
	      }

	      this[HEALTH] -= damage;
	      if (this[HEALTH] <= 0) {
	        this[HEALTH] = 0;
	        this.die();
	      }
	      this.hbFill.width = this.maxHbWidth * this[HEALTH] / this.maxHealth;
	      this.shieldBar.width = this.maxHbWidth * this[SHIELD] / this.maxShield;
	      this.shieldBar.restCount = 0;
	    }
	  }, {
	    key: 'update',
	    value: function update(dt) {
	      var a = this.position.y;
	      this.velocity += this.speed * accelFactor * dt * this.direction;
	      this.velocity *= dragFactor;
	      if (Math.abs(this.velocity) >= this.speed) {
	        var factor = this.velocity > 0 ? 1 : -1;
	        this.velocity = this.speed * factor;
	      }

	      this.position.y += this.velocity * dt;
	      if (this.position.y < 0 && this.velocity < 0) this.position.y = 0;
	      if (this.position.y > this.sceneSize.height && this.velocity > 0) this.position.y = this.sceneSize.height;

	      updateBar(this.chargeBar, dt, this.chargeRegenTime);
	      if (this.shieldBar.restCount < _data.constants.shieldDelay) {
	        this.shieldBar.restCount += dt;
	      }
	      if (this.shieldBar.restCount >= _data.constants.shieldDelay) {
	        updateBar(this.shieldBar, dt, this.shieldRegenTime);
	      }
	    }
	  }]);

	  return Ship;
	}(PIXI.Sprite);

	exports.default = Ship;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _gravity = 0.002;

	var Projectile = function (_PIXI$Sprite) {
	  _inherits(Projectile, _PIXI$Sprite);

	  function Projectile(texture, angle, team, damage) {
	    var velocity = arguments.length <= 4 || arguments[4] === undefined ? 2 : arguments[4];

	    _classCallCheck(this, Projectile);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Projectile).call(this, texture));

	    _this.xVelocity = Math.cos(angle) * velocity;
	    _this.yVelocity = Math.sin(angle) * velocity;
	    _this.team = team;
	    _this.damage = damage;
	    _this.anchor = new PIXI.Point(0.5, 0.5);
	    _this.zIndex = 4;
	    return _this;
	  }

	  _createClass(Projectile, [{
	    key: "update",
	    value: function update(dt) {
	      this.position.x += this.xVelocity * dt;
	      this.position.y += this.yVelocity * dt;
	      this.yVelocity += _gravity * dt;
	      var angle = Math.atan(this.yVelocity / this.xVelocity);
	      this.rotation = angle;
	    }
	  }, {
	    key: "explode",
	    value: function explode(ships) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = ships[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var ship = _step.value;

	          var x = this.position.x + 30 - ship.position.x;
	          var y = this.position.y - ship.position.y;
	          (0, _util.insertClip)("hit.json", ship, {
	            zIndex: 5,
	            animationSpeed: 0.8,
	            loop: false,
	            anchor: new PIXI.Point(0.5, 0.5),
	            position: new PIXI.Point(x, y)
	          }, 2000);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }], [{
	    key: "gravity",
	    value: function gravity() {
	      return _gravity;
	    }
	  }]);

	  return Projectile;
	}(PIXI.Sprite);

	exports.default = Projectile;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.intersects = intersects;
	exports.remove = remove;
	exports.getBounds = getBounds;
	exports.insertClip = insertClip;
	var Direction = exports.Direction = {
	  get Up() {
	    return -1;
	  },
	  get None() {
	    return 0;
	  }, //default
	  get Down() {
	    return 1;
	  }
	};

	function intersects(r1, r2) {
	  var marginY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	  var marginX = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	  return !(r1.x + r1.width < r2.x - marginX || r1.x - marginX > r2.x + r2.width || r1.y + r1.height < r2.y - marginY || r1.y - marginY > r2.y + r2.height);
	}

	function remove(arr, element) {
	  arr.splice(arr.indexOf(element), 1);
	}

	function getBounds(obj) {
	  return new PIXI.Rectangle(obj.position.x - obj.width * obj.anchor.x, obj.position.y - obj.height * obj.anchor.y, obj.width, obj.height);
	}

	function insertClip(name, container, options, destroyTime) {
	  //name doesn't include the assets/ part, but does include extension
	  //options is a set of k/v pairs to be set on the clip object
	  //if destroyTime is -1, it won't be removed
	  var loader = PIXI.loader;
	  var texts = loader.resources["assets/" + name].textures;
	  var arr = [];
	  for (var res in texts) {
	    arr.push(texts[res]);
	  }

	  var clip = new PIXI.extras.MovieClip(arr);

	  for (var prop in options) {
	    if (prop === "width") {
	      var asp = clip.height / clip.width;
	      clip[prop] = options[prop];
	      clip.height = clip.width * asp;
	    } else if (prop === "height") {
	      var _asp = clip.width / clip.height;
	      clip[prop] = options[prop];
	      clip.width = clip.height * _asp;
	    } else {
	      clip[prop] = options[prop];
	    }
	  }

	  container.addChild(clip);
	  clip.play();

	  if (destroyTime >= 0) {
	    setTimeout(function () {
	      if (clip.parent) {
	        clip.parent.removeChild(clip);
	        clip.destroy();
	      }
	    }, destroyTime);
	  }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(5);

	var _ship = __webpack_require__(3);

	var _ship2 = _interopRequireDefault(_ship);

	var _data = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PlayerManager = function () {
	  function PlayerManager(shipManager) {
	    _classCallCheck(this, PlayerManager);

	    this.shipManager = shipManager;
	    this.initPlayerShip();
	    this.initKeyInputs();
	  }

	  _createClass(PlayerManager, [{
	    key: 'initPlayerShip',
	    value: function initPlayerShip() {
	      var _this = this;

	      this.playerShip = this.shipManager.createShip(_data.ShipType.Player, function () {
	        //TODO: some kind of "YOU LOSE" text / screen
	      });

	      this.shipManager.container.on('click', function (e) {
	        // console.log(e);
	        console.log(e.data.originalEvent.clientX - 266, e.data.originalEvent.clientY - 373);
	        if (e.data.originalEvent.offsetX < _this.shipManager.sceneSize.width / 2 || !_this.playerShip.shoot()) return;
	        var start = new PIXI.Point(_this.playerShip.position.x + _this.playerShip.width, _this.playerShip.position.y);
	        var end = new PIXI.Point(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
	        _this.shipManager.createMissile(start, end, _this.playerShip.team, _this.playerShip.damage, _this.playerShip.missileSpeed);
	      });
	    }
	  }, {
	    key: 'initKeyInputs',
	    value: function initKeyInputs() {
	      var _this2 = this;

	      this.keyInputStack = [_util.Direction.None];

	      window.addEventListener("keydown", function (e) {
	        if (e.code === "KeyQ") {
	          //move the ship up
	          if (_this2.keyInputStack.indexOf(_util.Direction.Up) === -1) {
	            _this2.keyInputStack.push(_util.Direction.Up);
	          }
	        } else if (e.code === "KeyE") {
	          //move the ship down
	          if (_this2.keyInputStack.indexOf(_util.Direction.Down) === -1) {
	            _this2.keyInputStack.push(_util.Direction.Down);
	          }
	        } else {
	          return;
	        }
	        _this2.playerShip.direction = _this2.keyInputStack[_this2.keyInputStack.length - 1];
	      });

	      window.addEventListener("keyup", function (e) {
	        var ind = 0;
	        if (e.code === "KeyQ") {
	          //move the ship up
	          ind = _this2.keyInputStack.indexOf(_util.Direction.Up);
	        } else if (e.code === "KeyE") {
	          //move the ship down
	          ind = _this2.keyInputStack.indexOf(_util.Direction.Down);
	        } else if (e.code === "KeyK") {
	          //kill all enemies (for debugging -- and feeling badass)
	          for (var i = 0; i < _this2.shipManager.ships.length; i++) {
	            var ship = _this2.shipManager.ships[i];
	            if (ship.team !== _this2.playerShip.team) {
	              ship.die();
	              i--;
	            }
	          }
	          return;
	        } else if (e.code === "KeyP") {
	          //toggle pacifism
	          _data.constants.pacifism = !_data.constants.pacifism;
	          return;
	        } else {
	          return;
	        }
	        _this2.keyInputStack.splice(ind, 1);
	        _this2.playerShip.direction = _this2.keyInputStack[_this2.keyInputStack.length - 1];
	      });
	    }
	  }]);

	  return PlayerManager;
	}();

	exports.default = PlayerManager;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getStatsForShipType = getStatsForShipType;
	exports.getShipsForWaveNumber = getShipsForWaveNumber;
	exports.loadTextures = loadTextures;
	var constants = exports.constants = {
	  shieldRegenRate: 2,
	  shieldDelay: 3000, //ms
	  pacifism: false
	};

	var ShipType = exports.ShipType = {
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

	var waveData = [[ShipType.Grunt], [ShipType.Grunt], [ShipType.Brute], [ShipType.Grunt], [ShipType.Grunt, ShipType.Grunt], [ShipType.Brute], [ShipType.Brute, ShipType.Grunt], [ShipType.Grunt], [ShipType.Elite], [ShipType.Brute, ShipType.Brute], [ShipType.Grunt, ShipType.Grunt, ShipType.Grunt], [ShipType.Grunt, ShipType.Grunt, ShipType.Brute], [ShipType.Elite, ShipType.Brute], [ShipType.Elite, ShipType.Elite], [ShipType.Boss]];

	function getStatsForShipType(shipType) {
	  var stats = void 0; // [health, speed, damage, texturePath, maxShield, aimRand, missileSpeed, shieldRegenTime, chargeRegenTime];
	  //aimRand is the range (up or down) around the target that the enemy may aim at
	  switch (shipType) {
	    case ShipType.Player:
	      stats = [70, 1.2, 9, 'player.png', 30, 0, 2, 1000, 1000];
	      break;
	    case ShipType.Grunt:
	      stats = [15, 1, 5, 'grunt.png', 0, 150, 2, 1, 1100];
	      break;
	    case ShipType.Brute:
	      stats = [25, 0.8, 14, 'brute.png', 0, 70, 1.5, 1, 1300];
	      break;
	    case ShipType.Elite:
	      stats = [30, 1.1, 14, 'elite.png', 15, 40, 2.5, 600, 1000];
	      break;
	    case ShipType.Boss:
	      stats = [200, 0.4, 32, 'boss.png', 40, 120, 1.8, 1300, 1800];
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

	function getShipsForWaveNumber(waveNumber) {
	  //if waveNumber is out of bounds, we loop around to the start and
	  //being doubling (or tripling, etc) the waves
	  var len = waveData.length;
	  var mult = Math.floor(waveNumber / len + 1);
	  var ind = waveNumber % len;
	  var arr = waveData[ind];
	  var ships = [];
	  for (var i = 0; i < mult; i++) {
	    ships = ships.concat(arr);
	  }
	  return ships;
	}

	function loadTextures(cb) {
	  var loader = PIXI.loader;
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(5);

	var _ship = __webpack_require__(3);

	var _ship2 = _interopRequireDefault(_ship);

	var _projectile = __webpack_require__(4);

	var _projectile2 = _interopRequireDefault(_projectile);

	var _data = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EnemyManager = function () {
	  function EnemyManager(shipManager) {
	    _classCallCheck(this, EnemyManager);

	    this.shipManager = shipManager;
	    this.wave = 0;
	    this.numShips = 0;
	    this.sendNextWave();
	  }

	  _createClass(EnemyManager, [{
	    key: 'sendNextWave',
	    value: function sendNextWave() {
	      var ships = (0, _data.getShipsForWaveNumber)(this.wave);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = ships[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var ship = _step.value;

	          this.addEnemyShip(ship);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      this.wave++;
	    }
	  }, {
	    key: 'addEnemyShip',
	    value: function addEnemyShip(shipType) {
	      var _this = this;

	      var enemyShip = this.shipManager.createShip(shipType, function () {
	        _this.numShips--;
	      });
	      this.numShips++;
	      setTimeout(function () {
	        _this.setNextMove(enemyShip);
	        _this.setNextShot(enemyShip);
	      }, Math.random() * this.shipManager.sceneSize.height / enemyShip.speed);
	    }
	  }, {
	    key: 'shotWillHit',
	    value: function shotWillHit(angle, shooter, target, start) {
	      var vx = Math.cos(angle) * shooter.missileSpeed,
	          vy = Math.sin(angle) * shooter.missileSpeed;
	      var time = Math.abs((start.x - target.position.x + target.width / 2) / vx);
	      var heightChange = vy * time + 0.5 * _projectile2.default.gravity() * time * time;
	      return Math.abs(start.y + heightChange - target.position.y - target.velocity * time * 0.7) <= 2;
	    }
	  }, {
	    key: 'setNextShot',
	    value: function setNextShot(ship) {
	      var _this2 = this;

	      if (ship.parent === null) {
	        return;
	      }
	      var playerShip = this.shipManager.playerManager.playerShip;
	      var start = new PIXI.Point(ship.position.x, ship.position.y);
	      var angle = void 0,
	          worked = false;
	      var rand = Math.random() * ship.aimRand * 2 - ship.aimRand;
	      var pos = new PIXI.Point(ship.position.x, ship.position.y + rand);
	      for (var theta = Math.PI / -3; theta <= Math.PI / 3; theta += 0.001) {
	        if (this.shotWillHit(theta, ship, playerShip, pos)) {
	          angle = theta;
	          worked = true;
	          break;
	        }
	      }
	      if (ship.shoot() && worked) {
	        this.shipManager.createMissile(start, Math.PI - angle, ship.team, ship.damage, ship.missileSpeed);
	      }
	      setTimeout(function () {
	        _this2.setNextShot(ship);
	      }, Math.random() * 1000 + 1000);
	    }
	  }, {
	    key: 'setNextMove',
	    value: function setNextMove(ship) {
	      var _this3 = this;

	      if (ship.parent === null) {
	        if (this.numShips === 0) {
	          this.sendNextWave();
	        }
	        return;
	      }
	      var rand = Math.random() * 10;
	      if (ship.direction === _util.Direction.Up) {
	        if (rand <= 3) ship.direction = _util.Direction.None;else ship.direction = _util.Direction.Down;
	      } else if (ship.direction === _util.Direction.Down) {
	        if (rand <= 3) ship.direction = _util.Direction.None;else ship.direction = _util.Direction.Up;
	      } else {
	        //None
	        if (rand <= 5) ship.direction = _util.Direction.Down;else ship.direction = _util.Direction.Up;
	      }
	      var maxInterval = void 0; //in ms; we need to configure this so that the enemy won't stay against a wall
	      var minInterval = 1000 / ship.speed; //slower ships should move for longer
	      if (ship.direction === _util.Direction.Up) {
	        maxInterval = ship.position.y / ship.speed;
	      } else if (ship.direction === _util.Direction.Down) {
	        maxInterval = (this.shipManager.sceneSize.height - ship.position.y) / ship.speed;
	      } else {
	        //None
	        maxInterval = 1000;
	        minInterval = 500;
	      }
	      setTimeout(function () {
	        _this3.setNextMove(ship);
	      }, Math.random() * maxInterval);
	    }
	  }]);

	  return EnemyManager;
	}();

	exports.default = EnemyManager;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var GameContainer = function (_PIXI$Container) {
	  _inherits(GameContainer, _PIXI$Container);

	  function GameContainer() {
	    _classCallCheck(this, GameContainer);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(GameContainer).apply(this, arguments));
	  }

	  _createClass(GameContainer, [{
	    key: 'addChild',
	    value: function addChild(child) {
	      _get(Object.getPrototypeOf(GameContainer.prototype), 'addChild', this).call(this, child);
	      this.children.sort(function (a, b) {
	        a.zIndex = a.zIndex || 0;
	        b.zIndex = b.zIndex || 0;
	        return a.zIndex - b.zIndex;
	      });
	    }
	  }]);

	  return GameContainer;
	}(PIXI.Container);

	exports.default = GameContainer;

/***/ }
/******/ ]);