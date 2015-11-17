// ==========
// ENEMY STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function UpEnemy(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);

	this.rememberResets();
	// Default sprite, if not otherwise specified
	this.sprite = this.sprite || g_sprites.ship;
	// Set normal drawing scale, and warp state off
	this._scale = 0.4;
	this._isWarping = false;
	this._nextStop = 4000 / NOMINAL_UPDATE_INTERVAL;
	this._stopTime = 0;
	this._goingRight = true;
	this._hasFired = false;
};

UpEnemy.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
UpEnemy.prototype.fireSound = new Audio(
	"sounds/laser.ogg");

UpEnemy.prototype.rememberResets = function () {
	// Remember my reset positions
	this.reset_cx = this.cx;
	this.reset_cy = this.cy;
	this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
UpEnemy.prototype.rotation = Math.PI;
UpEnemy.prototype.velX = 0;
UpEnemy.prototype.velY = 0;
UpEnemy.prototype.launchVel = 2;
UpEnemy.prototype.numSubSteps = 1;

UpEnemy.prototype.update = function (du) {
	spatialManager.unregister(this);

	// Perform movement substeps
	var steps = this.numSubSteps;
	var dStep = du / steps;
	for (var i = 0; i < steps; ++i) {
		this.computeSubStep(dStep);
	}
};

UpEnemy.prototype.computeSubStep = function (du) {
	// this.cx += 5;
	this._nextStop -= du;
	if (this._nextStop < 0) {
		if (this._stopTime < 2000 / NOMINAL_UPDATE_INTERVAL) {
			this._stopTime += du;
		} else {
			this._stopTime = 0;
			this._nextStop = 4000 / NOMINAL_UPDATE_INTERVAL;
			this._hasFired = false;
		}
	} else {
		if (this._goingRight) this.cx += 2;
		else this.cx -= 2;
		if (this.cx > g_canvas.width - 20) this._goingRight = false;
		if (this.cx < 20) this._goingRight = true;
	}
};

UpEnemy.prototype.getRadius = function () {
	return (this.sprite.width / 5) * 0.9;
};

UpEnemy.prototype.reset = function () {
	this.setPos(this.reset_cx, this.reset_cy);
	this.rotation = this.reset_rotation;
	this.halt();
};

UpEnemy.prototype.halt = function () {
	this.velX = 0;
	this.velY = 0;
};


UpEnemy.prototype.render = function (ctx) {
	var width = 30;
	var height = 40;
	var x = this.cx - width / 4 - 1;
	var dX = +Math.sin(this.rotation);
	var dY = -Math.cos(this.rotation);
	ctx.save();
	if (this._stopTime !== 0 && this._stopTime < 1000 / NOMINAL_UPDATE_INTERVAL) {
		util.playSound(this.fireSound);
		var grd = ctx.createRadialGradient(this.cx, this.cy + 40, 0, this.cx, this.cy + 40, this._stopTime / 5);
		grd.addColorStop(.5,'White');
		grd.addColorStop(.7,'Cyan');
		ctx.fillStyle = grd;
		util.fillCircle(ctx, this.cx, this.cy + 40, this._stopTime / 5);
	} else if (this._stopTime > 1000 / NOMINAL_UPDATE_INTERVAL) {
		if (!this._hasFired) {
			entityManager.fireLightning(this.cx + dX, this.cy + dY);
			this._hasFired = true;
		}
	}
	util.fillBox(ctx, x, this.cy, 2, 20, 'Yellow');
	util.fillBox(ctx, x + width / 2, this.cy, 2, 20, 'Yellow');

	util.fillBox(ctx, x, this.cy + height * 0.3, 6, 3, 'Yellow');
	util.fillBox(ctx, x + width / 3, this.cy + height * 0.3, 6, 3, 'Yellow');

	util.fillBox(ctx, x + width * 0.125, this.cy + height * 0.45, 10, 3, 'Yellow');
	util.fillBox(ctx, x + width * 0.25 - 1, this.cy + height * 0.45 , 4, 12, 'Yellow');
	ctx.restore();
};
