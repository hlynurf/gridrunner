// ======
// ENTITY
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

}

Entity.prototype.setup = function (descr) {
	// Apply all setup properies from the (optional) descriptor
	for (var property in descr) {
		this[property] = descr[property];
	}
	// Get my (unique) spatial ID
	this._spatialID = spatialManager.getNewSpatialID();
	// I am not dead yet!
	this._isDeadNow = false;
};

Entity.prototype.setPos = function (cx, cy) {
	this.cx = cx;
	this.cy = cy;
};

Entity.prototype.getPos = function () {
	return {posX : this.cx, posY : this.cy};
};

Entity.prototype.getRadius = function () {
	return 0;
};

Entity.prototype.getSpatialID = function () {
	return this._spatialID;
};

Entity.prototype.kill = function () {
	this._isDeadNow = true;
	this.explode();
};

Entity.prototype.findHitEntity = function () {
	var pos = this.getPos();
	return spatialManager.findEntityInRange(
		pos.posX, pos.posY, this.getRadius(), this.isLightning
	);
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
	return this.findHitEntity();
};

Entity.prototype.wrapPosition = function () {
	this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
	this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Entity.prototype.explode = function () {
	particleManager.triggerExplosion(this.cx, this.cy);
};