// ====
// BOMB
// ====

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Bomb(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	// Default sprite and scale, if not otherwise specified
	this.scale  = this.scale  || 1;
	this.killShip = true;
	this.velY = 5;
}

Bomb.prototype = new Entity();
// The time the Bomb enters the level
Bomb.prototype.timestamp = 0;
Bomb.prototype.radius = 15;
Bomb.prototype.angle = 0;
Bomb.prototype.scaleX = 15;
Bomb.prototype.scaleY = 15;

Bomb.prototype.update = function (du) {

	spatialManager.unregister(this);

	this.cy += this.velY * du;
	if (this.cy > g_canvas.height) return entityManager.KILL_ME_NOW;
	var isHit = this.findHitEntity();
	if (isHit) {
		if (!isHit.killShip || (isHit instanceof Ship && isHit.enlargedDuration > 0)) {
			if (Math.random() < 0.1) entityManager.createPowerups(this.cx,this.cy);
			// Kill the bullet!
			if (!isHit.killShip) isHit.kill();
			return entityManager.KILL_ME_NOW;
		}
	} else spatialManager.register(this);
};

Bomb.prototype.getRadius = function () {
	return this.scale * (this.radius);
};

Bomb.prototype.render = function (ctx) {
	ctx.save();
	ctx.translate(this.cx, this.cy);
	ctx.rotate(this.angle);
	ctx.scale(this.scaleX / 150, this.scaleY / 150);
	ctx.translate(-200, -200);
	drawRocket(ctx);
	ctx.restore();
};