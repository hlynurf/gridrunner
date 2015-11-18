// ====
// Kamikaze
// ====

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function Kamikaze(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	// Default sprite and scale, if not otherwise specified
	this.scale  = this.scale  || 1;
	this.killShip = true;
	this.velY = this.targetY / 180; // Go to target in 180 frames (3 seconds)
}

Kamikaze.prototype = new Entity();
Kamikaze.prototype.explodeSound = new Audio('sounds/kamikaze.ogg');
Kamikaze.prototype.timestamp = 0;
Kamikaze.prototype.radius = 15;
Kamikaze.prototype.angle = 0;
Kamikaze.prototype.scaleX = 15;
Kamikaze.prototype.scaleY = 15;
Kamikaze.prototype.cy = 0;

Kamikaze.prototype.update = function (du) {
	spatialManager.unregister(this);
	if (this._isDeadNow) return entityManager.KILL_ME_NOW;
	// Kamikaze movement
	this.cy += this.velY * du;
	if (this.cy > g_canvas.height) {
		return entityManager.KILL_ME_NOW;
	}
	var isHit = this.findHitEntity();
	if (isHit) {
		if (!isHit.killShip || (isHit instanceof Ship && isHit.enlargedDuration > 0)) {
			var points = updateScore(50);
			entityManager.makePointsAppear(this.cx, this.cy, points);
			if (Math.random() < 0.1)
				entityManager.createPowerups(this.cx,this.cy);
			// Kill the bullet!
			if (!isHit.killShip) {
				isHit.kill();
			}
			this.explode();
			return entityManager.KILL_ME_NOW;
		}
	} else if (this.cy > this.targetY) {
		this.explode();
		return entityManager.KILL_ME_NOW;
	} else spatialManager.register(this);
};

Kamikaze.prototype.getRadius = function () {
	return this.scale * (this.radius);
};

Kamikaze.prototype.render = function (ctx) {
	ctx.save();
	ctx.translate(this.cx, this.cy);
	ctx.rotate(this.angle);
	ctx.scale(this.scaleX / 150, this.scaleY / 150);
	ctx.translate(-200, -200);
	drawRocket(ctx);
	ctx.restore();
};

Kamikaze.prototype.explode = function() {
	for (var i = 2; i < 15; i++) {
		var angle = i * Math.PI / 8;
		var dX = +Math.sin(angle);
		var dY = -Math.cos(angle);
		var relVelX = dX * .5;
		var relVelY = dY * .5;
		entityManager.fireball(
			this.cx, this.cy,
			relVelX, .5 + relVelY);
	}
	util.playSound(this.explodeSound);
	particleManager.triggerExplosion(this.cx, this.cy);
};