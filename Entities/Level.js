// ===========
// Level
// ===========

"use strict";

function Level(descr) {
	for (var property in descr) {
		this[property] = descr[property];
	}
	this.compliment = Math.floor(Math.random() * 10);
}

Level.prototype.countdown = 3000 / NOMINAL_UPDATE_INTERVAL;

Level.prototype.caterpillarCount = 0;
Level.prototype.caterpillarInterval = 0;
Level.prototype.kamikazeCount = 0;
Level.prototype.kamikazeInterval = 0;
Level.prototype.currtime = 0;
Level.prototype.overtime = 0;
// Overkill much?
Level.prototype.speedMultiplier = 1;

Level.prototype.caterpillarTimer = 5000 / NOMINAL_UPDATE_INTERVAL;
Level.prototype.kamikazeTimer = 0;

Level.prototype.caterpillarId = 0;

Level.prototype.update = function(du) {
	if (this.countdown > 0) {
		this.countdown -= du;
	}
	if (this.countdown <= 0) {
		this.currtime += du;
		this.caterpillarTimer += du;
		this.kamikazeTimer += du;
		if (this.caterpillarCount > 0 && this.caterpillarTimer > this.caterpillarInterval) {
			entityManager.createCaterpillar(this.caterpillarId++);
			this.caterpillarTimer = 0;
			this.caterpillarCount -= 1;
		}
		if (this.kamikazeCount > 0 && this.kamikazeTimer > this.kamikazeInterval) {
			entityManager.sendKamikaze();
			this.kamikazeTimer = 0;
			this.kamikazeCount -= 1;
		}
	}
};

Level.prototype.allDone = function() {
	return this.caterpillarCount <= 0 && this.kamikazeCount <= 0;
};

Level.prototype.workOvertime = function() {
	this.overtime += 5;
	return this.overtime > 5 * g_canvas.height;
};

Level.prototype.compliment = function() {
	return this.compliment;
}