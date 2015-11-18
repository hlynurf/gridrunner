function Fragment(descr) {
	for (var property in descr) {
		this[property] = descr[property];
	}
	this.vel = util.fragVel();
	this.angle = util.randRange(0, 2 * Math.PI);
	this.alpha = 1;
	this.startX = this.cx;
	this.startY = this.cy;
}

Fragment.prototype.update = function(du) {
	this.cx += this.vel * Math.cos(this.angle) * du;
	this.cy += this.vel * Math.sin(this.angle) * du;
	this.alpha = 1 - util.distSq(this.cx, this.cy, this.startX, this.startY) / 1e5;
	if (this.alpha < 0) return particleManager.KILL_ME_NOW;
	var canvasPadding = 0;
	if (this.cy < canvasPadding
						|| this.cy > g_canvas.height - canvasPadding
						|| this.cx < canvasPadding
						|| this.cx > g_canvas.width - canvasPadding) {
		return particleManager.KILL_ME_NOW;
	}
};

Fragment.prototype.render = function(ctx) {
	ctx.save();
	ctx.globalAlpha = this.alpha;
	ctx.fillStyle = this.color;
	util.fillCircle(ctx, this.cx, this.cy, 2);
	ctx.restore();
};