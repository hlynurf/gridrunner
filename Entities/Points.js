// ======
// Points
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Points(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    if (entityManager.getShipCoords() > this.cx) {
    	this.velX = (entityManager.getShipCoords() - this.cx)/100;
    }
    else if (entityManager.getShipCoords() <= this.cx) {
    	this.velX = -(this.cx - entityManager.getShipCoords())/100;
    }
    if (this.amount < 100)
    	this.velY =  2;
	else if (this.amount >= 100)
		this.velY = -2;
}

Points.prototype = new Entity();

Points.prototype.amount = 0;
Points.prototype.lifespan = 1500 / NOMINAL_UPDATE_INTERVAL;

Points.prototype.update = function(du) {
	this.cx += this.velX;
	this.cy += this.velY;

	this.lifespan -= du;
    if (this.lifespan < 0) return entityManager.KILL_ME_NOW;

}

Points.prototype.render = function(ctx) {
	var updates = this.lifespan * NOMINAL_UPDATE_INTERVAL;
	var fontSize = 20 - Math.abs(updates-750)*5/750;
	if(!g_isUpdatePaused)
		var color = entityManager.getRandomColor();
    util.centeredText(ctx, this.cx, this.cy, color, fontSize + 'px Impact', '+ ' + this.amount);
};