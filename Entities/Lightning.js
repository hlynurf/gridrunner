// ======
// Lightning
// ======

"use strict";


// A generic contructor which accepts an arbitrary descriptor object
function Lightning(descr) {
	// Common inherited setup logic from Entity
	this.setup(descr);
	this.killShip = true;
	this.isLightning = true;
}

Lightning.prototype = new Entity();

// Initial, inheritable, default values
Lightning.prototype.velX = 110;
Lightning.prototype.velY = 100;
Lightning.prototype.width = 10;
Lightning.prototype.height = g_canvas.height;

// Convert times from milliseconds to "nominal" time units.
Lightning.prototype.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;

Lightning.prototype.update = function (du) {
	spatialManager.unregister(this);
	this.lifeSpan -= du;
	if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
	spatialManager.register(this);
};

Lightning.prototype.render = function (ctx) {
	ctx.save();
	
	ctx.beginPath();
	ctx.lineWidth = this.width;
	ctx.globalAlpha = Math.min(1, (this.lifeSpan * NOMINAL_UPDATE_INTERVAL / 1000));
	ctx.moveTo(this.cx, this.cy + 28);
	ctx.lineTo(this.cx, this.cy + this.height - 40);
	var grd = ctx.createLinearGradient(this.cx - this.width, this.cy, this.cx + this.width, this.cy);
	grd.addColorStop(.1,'Cyan');
	grd.addColorStop(.5,'White');
	grd.addColorStop(.9,'Cyan');
	ctx.strokeStyle = grd;
	ctx.stroke();
	
	ctx.restore();
};
