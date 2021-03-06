// ======
// Bullet
// ======

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	// Make a noise when I am created (i.e. fired)
	util.playSound(this.fireSound);
}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio('sounds/bullets.ogg');
// Initial, inheritable, default values
Bullet.prototype.velX = 110;
Bullet.prototype.velY = 100;
Bullet.prototype.radius = 4;

Bullet.prototype.update = function (du) {
	spatialManager.unregister(this);
	this.cx += this.velX * du * 4;
	this.cy += this.velY * du * 4;
	var canvasPadding = 5;

	if (this._isDeadNow) return entityManager.KILL_ME_NOW;

	if (this.cy < canvasPadding
			|| this.cy > g_canvas.height - canvasPadding
			|| this.cx < canvasPadding
			|| this.cx > g_canvas.width - canvasPadding) {
		return entityManager.KILL_ME_NOW;
	}
	spatialManager.register(this);
};

Bullet.prototype.getRadius = function () {
	return this.radius;
};

Bullet.prototype.render = function (ctx) {
	ctx.save();
	ctx.translate(this.cx, this.cy);
	ctx.rotate(this.rotation);
	ctx.scale(.2,.2);
	ctx.translate(-200, -200);
	drawBullet(ctx);
	ctx.restore();
};
