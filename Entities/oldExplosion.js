function Explosion(descr) {
	for (var property in descr) {
		this[property] = descr[property];
	}
	this.radius = 0;
	this._maxRadius = 60;
	this._deltaRadius = 10 + this._maxRadius / 10;
}

Explosion.prototype.update = function() {
	this.radius += this._maxRadius / this._deltaRadius;
	if (this.radius > this._maxRadius) return particleManager.KILL_ME_NOW;
};

Explosion.prototype.render = function(ctx) {
	ctx.save();
	for (var r = this.radius - this._deltaRadius; r < this.radius; r++) {
		if (r > this._maxRadius - this._deltaRadius) break;
		if (r >= 0) {
			var grd = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this._maxRadius);
			grd.addColorStop(0,'Yellow');
			grd.addColorStop(.9, 'Red');
			ctx.lineWidth = 1.5;
			ctx.strokeStyle = grd;
			ctx.beginPath();
			ctx.arc(this.cx, this.cy, r, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}
	ctx.restore();
};