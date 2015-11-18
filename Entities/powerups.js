// ====
// Powerups
// ====

"use strict";

Powerups.prototype.PowerupsIsHit = false;

// A generic contructor which accepts an arbitrary descriptor object
function Powerups(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	// Default sprite and scale, if not otherwise specified
	this.scale  = this.scale  || 1;
}

Powerups.prototype = new Entity();
// HACKED-IN AUDIO (no preloading)
Powerups.prototype.powerupSound = new Audio('sounds/powerup.ogg');

// The time the Powerups enters the level
Powerups.prototype.timestamp = 0;
Powerups.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;
Powerups.prototype.radius = 10;
Powerups.prototype.velY = 3;
Powerups.prototype.flip = 0;
Powerups.prototype.startFlip = 0;
Powerups.prototype.flipVel = 0.5;
Powerups.prototype.color = '#fff';
Powerups.prototype.isPowerUp = true;

var g_bullet_powerupTimer = 0;

Powerups.prototype.update = function (du) {
	spatialManager.unregister(this);

	this.lifeSpan -= du;
	if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
	if (this.cy > g_canvas.height) {
		return entityManager.KILL_ME_NOW;
	}
	// Flip the circle
	var range = this.radius;
	if (this.flip >= this.startFlip + range) {
		this.flipVel -= 0.5;
		this.color = entityManager.getRandomColor();
	}
	if (this.flip < this.startFlip - range) {
		this.flipVel += 0.5;
		this.color = entityManager.getRandomColor();
	}
	this.flip += this.flipVel;
	this.cy += this.velY * du;

	var isHit = this.findHitEntity();
	if (isHit) {
		if (isHit.killPowerups) {
			var points = updateScore(100, isHit.timestamp);
			entityManager.makePointsAppear(this.cx, this.cy, points);
			util.playSound(this.powerupSound);
			if (Math.random() < 0.7) {
				gunType = 1 + Math.round(Math.random() * 2);
				g_bullet_powerupTimer = 5000 / NOMINAL_UPDATE_INTERVAL;
			}
			else {
				entityManager.makePointsAppear(this.cx, this.cy, points);
				isHit.makeEnlarged();
			}
			return entityManager.KILL_ME_NOW;
		}
	}
	spatialManager.register(this);
};

Powerups.prototype.getRadius = function () {
	return this.scale * (this.radius);
};

Powerups.prototype.render = function (ctx) {
	var fadeThresh = Powerups.prototype.lifeSpan / 3;

	if (this.lifeSpan < fadeThresh) {
		ctx.globalAlpha = this.lifeSpan / fadeThresh;
	}
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = this.color;
	// Make eclipse form
	ctx.translate(this.cx, this.cy);
	ctx.rotate(Math.PI);
	ctx.scale(this.radius, this.flip);
	ctx.arc(0, 0, 1, 0, Math.PI * 2);
	ctx.lineWidth = 0.5;
	ctx.stroke();
	ctx.restore();

	ctx.globalAlpha = 1;
};