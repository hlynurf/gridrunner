"use strict";

var entityManager = {

	// "PRIVATE" DATA

	_bullets : [],
	_ships   : [],
	_enemies : [],
	_caterpillars: [],
	_kamikazes: [],
	_powerups: [],
	_landMines: [],
	_lightnings: [],
	_points: [],
	_bombs: [],

	// "PRIVATE" METHODS
	_nextCaterpillar: 0,
	_creatingCaterpillars: false,
	_caterPillarStuff: {},

	_forEachOf: function(aCategory, fn) {
		for (var i = 0; i < aCategory.length; ++i) {
			fn.call(aCategory[i]);
		}
	},

	// PUBLIC METHODS

	// A special return value, used by other objects,
	// to request the blessed release of death!
	//
	KILL_ME_NOW : -1,

	// Some things must be deferred until after initial construction
	// i.e. thing which need `this` to be defined.
	//
	deferredSetup : function () {
		this._categories = [this._bullets, this._ships, this._enemies, this._caterpillars, this._kamikazes, this._landMines, this._powerups, this._lightnings, this._points, this._bombs];
	},

	init: function() {
		this._enemies.push(new SideEnemy({cx: 0, cy: 200}));
		this._enemies.push(new UpEnemy({cx: 200, cy: 0}));
	},

	resetCategories: function() {
		for (var c = 0; c < this._categories.length; ++c) {
			var cat = this._categories[c];
			while (cat.length) {
				var entity = cat.pop();
			}
		}
	},

	sendKamikaze: function() {
		this._kamikazes.push(new Kamikaze({
			cx: (g_canvas.width / 10) + Math.random() * (g_canvas.width - g_canvas.width / 5),
			targetY: (g_canvas.height / 10) + Math.random() * (g_canvas.height / 2 - g_canvas.height / 5)
		}));
	},

	createPowerups: function(cx,cy) {
		this._powerups.push(new Powerups({
			cx: cx,
			cy: cy
		}));
	},

	fireBullet: function(cx, cy, velX, velY, rotation, killShip) {
		this._bullets.push(new Bullet({
			cx   : cx,
			cy   : cy,
			velX : velX,
			velY : velY,
			killShip: killShip,
			rotation : rotation,
			timestamp : main.getCurrTime()
		}));
	},

	fireball: function(cx, cy, velX, velY) {
		this._enemies.push(new Fireball({
			cx   : cx,
			cy   : cy,
			velX : velX,
			velY : velY
		}));
	},

	generateShip : function() {
		this._ships.push(new Ship({
		}));
	},

	generateNewShip : function(lives) {
		this._ships.push(new Ship({
		}));
		this._ships[0]._lives = lives;
	},

	getShipCoords: function() {
		return this._ships[0].cx;
	},

	getShipRadius: function() {
		return this._ships[0].getRadius();
	},

	setShip : function(xPos, yPos) {
		var thisShip = this._ships[0];
		thisShip.setPos(xPos, yPos);
	},

	getShipLives : function() {
		return this._ships[0]._lives;
	},

	hasShip : function() {
		return this._ships.length > 0;
	},

	fireLightning : function(cx, cy) {
		this._lightnings.push(new Lightning({
			cx: cx,
			cy: cy
		}));
	},

	createLandMine : function(cx, cy) {
		this._landMines.push(new LandMine({
			cx: cx,
			cy: cy
		}));
	},

	makePointsAppear : function(cx, cy, amount) {
		this._points.push(new Points({
			cx: cx,
			cy: cy,
			amount: amount
		}));
	},

	getRandomColor : function() {
		var color = '#';
		var letters = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	},

	resetShips: function() {
		this._forEachOf(this._ships, Ship.prototype.reset);
	},

	dropBomb: function(cx, cy) {
		this._bombs.push(new Bomb({
			cx: cx,
			cy: cy
		}));
	},

	createCaterpillar: function() {
		this._creatingCaterpillars = true;
		// Randoms which way it comes from
		if (Math.random() < 0.5) {
			this._caterPillarStuff.velX = 4;
			this._caterPillarStuff.direction = true;
			this._caterPillarStuff.cx = 0;
		}
		else {
			this._caterPillarStuff.velX = -4;
			this._caterPillarStuff.direction = false;
			this._caterPillarStuff.cx = g_canvas.width;
		}
		var oneGridHeight = g_canvas.height / 30;
		var oneGridWidth = g_canvas.width / 20;
		// Randoms starting Y position of catapillar in the upper 1-6 grid
		this._caterPillarStuff.posY = Math.round((oneGridHeight) + Math.random() * (oneGridHeight * 5));
		// Random how long right and left the caterpillar goes
		this._caterPillarStuff.randomRight = oneGridWidth * 10 + Math.random() * (oneGridWidth * 10);
		this._caterPillarStuff.randomLeft = oneGridWidth + Math.random() * (oneGridWidth * 10);
		// Randoms how long down it goes in each turn around
		this._caterPillarStuff.downRange = Math.round(20 + Math.random() * 20);
		this._caterPillarStuff.positionNum = 0;
		this._caterPillarStuff.wormLength = 3 + Math.round(Math.random() * 7);
	},

	checkForCaterPillars: function(du) {
		if (this._nextCaterpillar <= 0 && this._creatingCaterpillars) {
			this._caterpillars.push(new Caterpillar({
				velX: this._caterPillarStuff.velX,
				direction: this._caterPillarStuff.direction,
				cx: this._caterPillarStuff.cx,
				cy: this._caterPillarStuff.posY,
				startY: this._caterPillarStuff.posY,
				wormLength: this._caterPillarStuff.wormLength,
				randomRight: this._caterPillarStuff.randomRight, // What distance it goes right
				randomLeft: this._caterPillarStuff.randomLeft,   // What distance it goes left
				downRange: this._caterPillarStuff.downRange,
				position: this._caterPillarStuff.positionNum // Number of caterpillar peace
			}));
			this._caterPillarStuff.positionNum++;
			this._nextCaterpillar -= du;
			if (this._caterPillarStuff.positionNum === this._caterPillarStuff.wormLength) {
				this._creatingCaterpillars = false;
				this._nextCaterpillar = 0;
			} else {
				this._nextCaterpillar = 65 / NOMINAL_UPDATE_INTERVAL;
			}
		} else if (this._creatingCaterpillars) {
			this._nextCaterpillar -= du;
		}
	},

	update: function(du) {
		if (!main._highScore && !main._mainMenu && !main._rules) this.checkForCaterPillars(du);
		for (var c = 0; c < this._categories.length; ++c) {
			var aCategory = this._categories[c];
			var i = 0;

			while (i < aCategory.length) {
				var status = aCategory[i].update(du);

				if (status === this.KILL_ME_NOW) {
					// remove the dead guy, and shuffle the others down to
					// prevent a confusing gap from appearing in the array
					aCategory.splice(i, 1);
				}
				else {
					++i;
				}
			}
		}
	},

	noMoreEnemies: function() {
		return (this._caterpillars.length === 0 && !this._creatingCaterpillars && this._kamikazes.length === 0);
	},

	render: function(ctx) {
		var debugY = 100;

		for (var c = 0; c < this._categories.length; ++c) {
			var aCategory = this._categories[c];
			for (var i = 0; i < aCategory.length; ++i) {
				aCategory[i].render(ctx);
				//debug.text(".", debugX + i * 10, debugY);
			}
			debugY += 10;
		}
	}
};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

