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

	var _scenery = __webpack_require__(1);

	var _scenery2 = _interopRequireDefault(_scenery);

	var _shipManager = __webpack_require__(2);

	var _shipManager2 = _interopRequireDefault(_shipManager);

	var _gameContainer = __webpack_require__(6);

	var _gameContainer2 = _interopRequireDefault(_gameContainer);

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

	var loader = PIXI.loader;
	loader.add("assets/clouds.json");
	loader.add("assets/ship.png");
	loader.add("assets/hp-container.png");
	loader.add("assets/hp-fill.png");
	loader.add("assets/destruction.json");
	loader.add("assets/icon.png");
	loader.add("assets/hit.json");
	loader.once('complete', startGame);
	loader.load();

	var sceneryManager = void 0,
	    shipManager = void 0;

	document.body.appendChild(renderer.view);

	function startGame() {

	  sceneryManager = new _scenery2.default(container, renderer.width, renderer.height);
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

	var _ship = __webpack_require__(3);

	var _projectile = __webpack_require__(4);

	var _projectile2 = _interopRequireDefault(_projectile);

	var _util = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ShipManager = function () {
	  function ShipManager(container, w, h) {
	    _classCallCheck(this, ShipManager);

	    this.container = container;
	    this.sceneSize = { width: w, height: h };
	    this.missiles = [];
	    this.ships = [];
	    this.initShips();
	    this.initKeyInputs();
	  }

	  _createClass(ShipManager, [{
	    key: 'update',
	    value: function update(dt) {
	      this.playerShip.update(dt);
	      this.enemyShip.update(dt);
	      if (this.playerShip.firePosition !== null && this.playerShip.firePosition !== undefined) {
	        this.createMissile(this.playerShip.position.x, this.playerShip.position.x, this.playerShip.team);
	      }
	      if (this.enemyShip.firePosition !== null && this.enemyShip.firePosition !== undefined) {
	        this.createMissile(this.enemyShip.position.x, this.enemyShip.position.x, this.enemyShip.team);
	      }
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.missiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var missile = _step.value;

	          console.log(missile.team, this.playerShip.team);
	          missile.update(dt);
	          var exp = false;
	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;

	          try {
	            for (var _iterator2 = this.ships[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              var ship = _step2.value;

	              if (ship.team !== missile.team && (0, _util.intersects)(missile.getBounds(), ship.getBounds())) {
	                ship.takeDamage(missile.damage);
	                exp = true;
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

	          if (exp) {
	            missile.explode();
	            this.destroyMissile(missile);
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
	  }, {
	    key: 'createMissile',
	    value: function createMissile(start, end, team) {
	      var texture = PIXI.loader.resources["assets/icon.png"].texture;
	      var angle = Math.atan((end.y - start.y) / (end.x - start.x));
	      var missile = new _projectile2.default(texture, angle, team, 7, 28);
	      missile.position = start;
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
	  }, {
	    key: 'initShips',
	    value: function initShips() {
	      var _this = this;

	      var st = {
	        damage: 5,
	        speed: 1,
	        health: 20
	      };
	      var playerShip = new _ship.Ship(new PIXI.Texture.fromFrame("assets/ship.png"), st, this.sceneSize);
	      this.playerShip = playerShip;
	      playerShip.anchor = new PIXI.Point(0, 0.5);
	      playerShip.position = new PIXI.Point(50, this.sceneSize.height / 2);
	      this.container.addChild(this.playerShip);
	      this.playerShip.initHealthBar();
	      this.playerShip.team = 0;
	      this.ships.push(this.playerShip);

	      this.container.on('click', function (e) {
	        if (e.data.originalEvent.offsetX < _this.sceneSize.width / 2) return;
	        var start = new PIXI.Point(_this.playerShip.position.x + _this.playerShip.width, _this.playerShip.position.y);
	        var end = new PIXI.Point(e.data.originalEvent.offsetX, e.data.originalEvent.offsetY);
	        _this.createMissile(start, end, _this.playerShip.team);
	      });

	      this.addEnemyShip();
	    }
	  }, {
	    key: 'addEnemyShip',
	    value: function addEnemyShip() {
	      var _this2 = this;

	      var st = {
	        damage: 5,
	        speed: 1,
	        health: 20
	      };

	      var enemyShip = new _ship.Ship(new PIXI.Texture.fromFrame("assets/ship.png"), st, this.sceneSize);
	      enemyShip.anchor = new PIXI.Point(0, 0.5);
	      enemyShip.position = new PIXI.Point(this.sceneSize.width - 50, enemyShip.height / -2);
	      enemyShip.scale.x = -1;
	      enemyShip.direction = _ship.Direction.Down;
	      enemyShip.team = 1;
	      enemyShip.die = function () {
	        _this2.ships.splice(_this2.ships.indexOf(enemyShip), 1);

	        // // const asp = clip.height / clip.width;
	        // // clip.width = 600;
	        // // clip.height = clip.width * asp;
	        // insertClip("destruction.json", this.container, {
	        //
	        // }, 2000);
	      };

	      this.ships.push(enemyShip);
	      this.enemyShip = enemyShip;
	      this.container.addChild(this.enemyShip);
	      this.enemyShip.initHealthBar();

	      setTimeout(function () {
	        _this2.setNextEnemyMove();
	      }, Math.random() * this.sceneSize.height / this.enemyShip.speed);
	    }
	  }, {
	    key: 'setNextEnemyShot',
	    value: function setNextEnemyShot() {}
	  }, {
	    key: 'setNextEnemyMove',
	    value: function setNextEnemyMove() {
	      var _this3 = this;

	      if (this.enemyShip.health <= 0) {
	        this.enemyShip.destroy();
	        this.addEnemyShip();
	      } else {
	        var rand = Math.random() * 10;
	        if (this.enemyShip.direction === _ship.Direction.Up) {
	          if (rand <= 3) this.enemyShip.direction = _ship.Direction.None;else this.enemyShip.direction = _ship.Direction.Down;
	        } else if (this.enemyShip.direction === _ship.Direction.Down) {
	          if (rand <= 3) this.enemyShip.direction = _ship.Direction.None;else this.enemyShip.direction = _ship.Direction.Up;
	        } else {
	          //None
	          if (rand <= 5) this.enemyShip.direction = _ship.Direction.Down;else this.enemyShip.direction = _ship.Direction.Up;
	        }
	        var maxInterval = void 0; //in ms; we need to configure this so that the enemy won't stay against a wall
	        var minInterval = 1000;
	        if (this.enemyShip.direction === _ship.Direction.Up) {
	          maxInterval = this.enemyShip.position.y / this.enemyShip.speed;
	        } else if (this.enemyShip.direction === _ship.Direction.Down) {
	          maxInterval = (this.sceneSize.height - this.enemyShip.position.y) / this.enemyShip.speed;
	        } else {
	          //None
	          maxInterval = 1000;
	          minInterval = 500;
	        }
	        setTimeout(function () {
	          _this3.setNextEnemyMove();
	        }, Math.random() * maxInterval);
	      }
	    }
	  }, {
	    key: 'initKeyInputs',
	    value: function initKeyInputs() {
	      var _this4 = this;

	      this.keyInputStack = [_ship.Direction.None];

	      window.addEventListener("keydown", function (e) {
	        if (e.code === "KeyQ") {
	          //move the ship up
	          if (_this4.keyInputStack.indexOf(_ship.Direction.Up) === -1) {
	            _this4.keyInputStack.push(_ship.Direction.Up);
	          }
	        } else if (e.code === "KeyE") {
	          //move the ship down
	          if (_this4.keyInputStack.indexOf(_ship.Direction.Down) === -1) {
	            _this4.keyInputStack.push(_ship.Direction.Down);
	          }
	        } else {
	          return;
	        }
	        _this4.playerShip.direction = _this4.keyInputStack[_this4.keyInputStack.length - 1];
	      });

	      window.addEventListener("keyup", function (e) {
	        var ind = 0;
	        if (e.code === "KeyQ") {
	          //move the ship up
	          ind = _this4.keyInputStack.indexOf(_ship.Direction.Up);
	        } else if (e.code === "KeyE") {
	          //move the ship down
	          ind = _this4.keyInputStack.indexOf(_ship.Direction.Down);
	        } else {
	          return;
	        }
	        _this4.keyInputStack.splice(ind, 1);
	        _this4.playerShip.direction = _this4.keyInputStack[_this4.keyInputStack.length - 1];
	      });
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
	exports.Ship = exports.Direction = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _projectile = __webpack_require__(4);

	var _projectile2 = _interopRequireDefault(_projectile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HEALTH = Symbol('HEALTH');
	var DIRECTION = Symbol('DIRECTION');
	var accelFactor = 0.01;
	var dragFactor = 0.9;

	// const [UP, NONE, DOWN] =    <= we probably don't need this
	//         [Symbol('up'), Symbol('none'), Symbol('down')];

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

	var Ship = exports.Ship = function (_PIXI$Sprite) {
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
	    _this.velocity = 0;
	    _this.direction = Direction.None;
	    _this.zIndex = 1;
	    _this.sceneSize = sceneSize;
	    _this.firePosition = null;
	    _this.isEdgeAccelerating = false;
	    //this.initHealthBar();
	    return _this;
	  }

	  _createClass(Ship, [{
	    key: 'initHealthBar',
	    value: function initHealthBar() {
	      var healthBar = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-container.png')),
	          hbFill = new PIXI.Sprite(new PIXI.Texture.fromFrame('assets/hp-fill.png'));
	      healthBar.addChild(hbFill);
	      hbFill.position.x = healthBar.width / 2 - hbFill.width / 2;
	      hbFill.position.y = healthBar.height / 2 - hbFill.height / 2;
	      this.addChild(healthBar);
	      healthBar.position.x = this.width / 2 - healthBar.width / 2 - 10;
	      healthBar.position.y = 10 - this.height / 2; //` - this.height / 2` because the ship's anchor.y = 0.5
	      this.hbFill = hbFill;
	      this.maxHbWidth = hbFill.texture.width;
	      this.takeDamage(5);
	    }
	  }, {
	    key: 'takeDamage',
	    value: function takeDamage(damage) {
	      this[HEALTH] -= damage;
	      if (this[HEALTH] <= 0) {
	        this[HEALTH] = 0;
	        this.die();
	      }
	      this.hbFill.width = this.maxHbWidth * this[HEALTH] / this.maxHealth;
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
	    }
	  }]);

	  return Ship;
	}(PIXI.Sprite);

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

	var gravity = 0.045;

	var Projectile = function (_PIXI$Sprite) {
	  _inherits(Projectile, _PIXI$Sprite);

	  function Projectile(texture, angle, team) {
	    var damage = arguments.length <= 3 || arguments[3] === undefined ? 7 : arguments[3];
	    var velocity = arguments.length <= 4 || arguments[4] === undefined ? 27 : arguments[4];

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
	      this.position.x += this.xVelocity;
	      this.position.y += this.yVelocity;
	      this.yVelocity += gravity * dt;
	    }
	  }, {
	    key: "explode",
	    value: function explode() {

	      //TODO: does an explosion follow the ship? or stay in air?

	      (0, _util.insertClip)("hit.json", this.parent, {
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
	exports.insertClip = insertClip;
	function intersects(r1, r2) {
	  return !(r1.x + r1.width < r2.x || r1.x > r2.x + r2.width || r1.y + r1.height < r2.y || r1.y > r2.y + r2.height);
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
	      clip.width = 600;
	      clip.height = clip.width * asp;
	    }
	    clip[prop] = options[prop];
	  }

	  container.addChild(clip);
	  clip.play();

	  if (destroyTime >= 0) {
	    setTimeout(function () {
	      clip.parent.removeChild(clip);
	      clip.destroy();
	    }, destroyTime);
	  }
	}

/***/ },
/* 6 */
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