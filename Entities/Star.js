// ======
// Star
// ======

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Star(descr) {
	// Common inherited setup logic from Particle
	this.setup(descr);
}

Star.prototype = new Particle();
// Initial, inheritable, default values
Star.prototype.cx = 200;
Star.prototype.cy = 200;
Star.prototype.velX = 110;
Star.prototype.velY = 100;
Star.prototype.color = 'Yellow';
Star.prototype.colorTimer = 0;

Star.prototype.update = function (du) {
	this.cx += this.velX * du * 4;
	this.cy += this.velY * du * 4;
	if (!this.colorTimer--) {
		this.color = util.getStarColor();
		this.colorTimer = 60;
	}
	this.wrapPosition();
};

Star.prototype.getRadius = function () {
	return 4;
};

Star.prototype.render = function (ctx) {
	ctx.save();
	ctx.globalAlpha = this.colorTimer / 60;
	ctx.beginPath();
	ctx.moveTo(this.cx, this.cy);
	ctx.lineTo(this.cx, this.cy + this.getRadius());
	ctx.strokeStyle = this.color;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.restore();
};
