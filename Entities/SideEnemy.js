// ==========
// SideEnemy
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function SideEnemy(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);

	this.rememberResets();
	this._bulletDifference = 5000;
	this._goingDown = true;
	this._nextStop = 4000 / NOMINAL_UPDATE_INTERVAL;
	this._stopTime = 0;
	this._hasFired = false;
}

SideEnemy.prototype = new Entity();
// HACKED-IN AUDIO (no preloading)
SideEnemy.prototype.fireSound = new Audio('sounds/landmine.ogg');

SideEnemy.prototype.rememberResets = function () {
	// Remember my reset positions
	this.reset_cx = this.cx;
	this.reset_cy = this.cy;
};

// Initial, inheritable, default values
SideEnemy.prototype.numSubSteps = 1;

SideEnemy.prototype.update = function (du) {
	spatialManager.unregister(this);

	// Perform movement substeps
	var steps = this.numSubSteps;
	var dStep = du / steps;
	for (var i = 0; i < steps; ++i) {
		this.computeSubStep(dStep);
	}
};

SideEnemy.prototype.computeSubStep = function (du) {
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
		if (this._goingDown) this.cy += 2;
		else this.cy -= 2;
		if (this.cy > g_canvas.height - 40) this._goingDown = false;
		if (this.cy < 20) this._goingDown = true;
	}
};

SideEnemy.prototype.render = function (ctx) {
	var width = 40;
	var height = 30;
	var y = this.cy - height / 4 - 1;
	ctx.save();
	if (this._stopTime > 500 / NOMINAL_UPDATE_INTERVAL && this._stopTime < 2000 / NOMINAL_UPDATE_INTERVAL) {
		if (!this._hasFired) {
			util.playSound(this.fireSound);
			entityManager.createLandMine(this.cx + 30, this.cy);
			this._hasFired = true;
		}
	}
	util.fillBox(ctx, this.cx, y, 20, 2, 'Yellow');
	util.fillBox(ctx, this.cx, y + height / 2, 20, 2, 'Yellow');

	util.fillBox(ctx, this.cx + width * 0.3, y, 3, 6, 'Yellow');
	util.fillBox(ctx, this.cx + width * 0.3, y + height / 3, 3, 6, 'Yellow');

	util.fillBox(ctx, this.cx + width * 0.45, y + height * 0.125, 3, 10, 'Yellow');
	util.fillBox(ctx, this.cx + width * 0.45, y + height * 0.25 - 1 , 12, 4, 'Yellow');
	ctx.restore();
};
