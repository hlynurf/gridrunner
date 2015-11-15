// ======
// Fireball
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Fireball(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    util.playSound(this.fireSound);
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/
	this.killShip = true;
}

Fireball.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Fireball.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Fireball.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Fireball.prototype.timestamp = 0;
Fireball.prototype.velX = 110;
Fireball.prototype.velY = 100;
Fireball.prototype.radius = 4;

// Convert times from milliseconds to "nominal" time units.
Fireball.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Fireball.prototype.update = function (du, ctx) {

    spatialManager.unregister(this);

    this.cx += this.velX * du * 4;
    this.cy += this.velY * du * 4;
    var canvasPadding = 5;

    if(this._isDeadNow) return entityManager.KILL_ME_NOW;

    if (this.cy<canvasPadding
            || this.cy>g_canvas.height-canvasPadding
            || this.cx<canvasPadding
            || this.cx>g_canvas.width - canvasPadding) {
        loseCombo(this.timestamp);
        return entityManager.KILL_ME_NOW;
    }
    
    spatialManager.register(this);

};

Fireball.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another Fireball
    this.zappedSound.play();
};

Fireball.prototype.getRadius = function () {
   return this.radius;
};

Fireball.prototype.render = function (ctx) {
    ctx.save();
	
	ctx.fillStyle = 'Red';
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
	
    ctx.restore();
};

Fireball.prototype.kill = function () {
	this._isDeadNow = true;
}