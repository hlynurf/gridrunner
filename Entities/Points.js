// ======
// Points
// ======

"use strict";

function Points(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	// Decide which way the points goes, depending on where the ship is
	if (entityManager.getShipCoords() > this.cx) {
		this.velX = (entityManager.getShipCoords() - this.cx) / 100;
	}
	else if (entityManager.getShipCoords() <= this.cx) {
		this.velX = -(this.cx - entityManager.getShipCoords()) / 100;
	}
	if (this.amount < 100)
		this.velY =  2;
	if (this.amount >= 100 || this.amount < 0)
		this.velY = -2;
}

Points.prototype = new Entity();

Points.prototype.amount = 0;
Points.prototype.velX = 0,
Points.prototype.velY = 0,
Points.prototype.lifespan = 1500 / NOMINAL_UPDATE_INTERVAL;

Points.prototype.update = function(du) {
	this.cx += this.velX;
	this.cy += this.velY;

	this.lifespan -= du;
	if (this.lifespan < 0) return entityManager.KILL_ME_NOW;
};
var Points_isMinus = false;
Points.prototype.render = function(ctx) {
	var updates = this.lifespan * NOMINAL_UPDATE_INTERVAL;
	var fontSize = 20 - Math.abs(updates - 750) * 5 / 750;
	if (!g_isUpdatePaused)
		var color = entityManager.getRandomColor();
	// Give + or - text
	var addOrRemove;
	if (this.amount >= 0) {
		addOrRemove = '+ ';
		Points_isMinus = false;
	}
	else {
		addOrRemove = ' ';
		Points_isMinus = true;
	}
	util.centeredText(ctx, this.cx, this.cy, color, fontSize + 'px Impact', addOrRemove + this.amount);
};