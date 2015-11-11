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
}

Points.prototype = new Entity();

Points.prototype.amount = 0;
Points.prototype.lifespan = 400 / NOMINAL_UPDATE_INTERVAL;

Points.prototype.update = function(du) {
	this.lifespan -= du;
    if (this.lifespan < 0) return entityManager.KILL_ME_NOW;
}

Points.prototype.render = function(ctx) {
	var updates = this.lifespan * NOMINAL_UPDATE_INTERVAL;
	var fontSize = 20 - Math.abs(updates-200)*5/200;
    util.centeredText(ctx, this.cx, this.cy, 'Orange', fontSize + 'px Impact', '+ ' + this.amount);
};