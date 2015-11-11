// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    util.playSound(this.fireSound);
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.timestamp = 0;
Bullet.prototype.velX = 110;
Bullet.prototype.velY = 100;
Bullet.prototype.radius = 4;

// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du, ctx) {

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

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.getRadius = function () {
   return this.radius;
};

Bullet.prototype.render = function (ctx) {
    ctx.save();
	
	var rot = this.rotation + Math.PI/2;
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(this.cx + 10 * Math.cos(rot), this.cy + 10 * Math.sin(rot));
    ctx.lineTo(this.cx - 10 * Math.cos(rot), this.cy - 10 * Math.sin(rot));
    ctx.strokeStyle = 'rgb(113, 201, 55)';
    ctx.stroke();
	
    ctx.restore();
};
