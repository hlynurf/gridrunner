// ====
// LandMine
// ====

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function LandMine(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	this.posX = util.randRange(100, g_canvas.width - 40);
	// Default sprite and scale, if not otherwise specified
	this.scale  = this.scale  || 1;
	this.killShip = true;
	this.lifetime = 6000 / NOMINAL_UPDATE_INTERVAL;
	this._canExplode = true;
	this._innerColor = 'Red';
}


LandMine.prototype = new Entity();
LandMine.prototype.tickSound = new Audio('sounds/minetick.ogg');
LandMine.prototype.mineFallSound = new Audio('sounds/minefall.ogg');
LandMine.prototype.mineHitSound = new Audio('sounds/minehit.ogg');
LandMine.prototype.velX = 2;
LandMine.prototype.radius = 7;
LandMine.prototype.update = function (du) {
	spatialManager.unregister(this);
	this.lifetime -= du;
	if (this._isDeadNow) return entityManager.KILL_ME_NOW;

	if (this.cx < this.posX) this.cx += this.velX * du;

	if (this.lifetime < 2000 / NOMINAL_UPDATE_INTERVAL){
		util.playSound(this.tickSound);
		this._innerColor = ['Red', 'Yellow'][Math.floor(Math.random() * 2)];
	}
	this.wrapPosition();
	var isHit = this.findHitEntity();
	if (this.lifetime < 0) {
		entityManager.dropBomb(this.cx, this.cy);
		util.playSound(this.mineFallSound);
		return entityManager.KILL_ME_NOW;
	}
	if (isHit) {
		if (!isHit.killShip || (isHit instanceof Ship && isHit.enlargedDuration > 0)) {
			util.playSound(this.mineHitSound);
			// No points for landmines
			if (this.scale < 0.7) {
				if (Math.random() < 0.1)
					entityManager.createPowerups(this.cx,this.cy);
				// Kill the bullet!
				if (!isHit.killShip) {
					isHit.kill();
				}
				return entityManager.KILL_ME_NOW;
			} else {
				// Kill the bullet!
				if(!isHit.killShip) {
					isHit.kill();
				}
				this.scale *= 0.7;
			}
		}
	}
	spatialManager.register(this);
};

LandMine.prototype.getRadius = function () {
	return this.scale * (this.radius);
};


LandMine.prototype.takeBulletHit = function () {
	this.kill();
	if (this.scale > 0.25) {
		this._spawnFragment();
		this._spawnFragment();
	}
};

LandMine.prototype.render = function (ctx) {
	ctx.save();
	var grd = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.getRadius());
	grd.addColorStop(.2, this._innerColor);
	grd.addColorStop(.8,'Gray');
	ctx.fillStyle = grd;
	util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
	ctx.restore();
};