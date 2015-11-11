// ====
// BulletPowerup
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
BulletPowerup.prototype.BulletPowerupIsHit=false;

// A generic contructor which accepts an arbitrary descriptor object
function BulletPowerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite and scale, if not otherwise specified
    this.scale  = this.scale  || 1;

};

BulletPowerup.prototype = new Entity();
// The time the BulletPowerup enters the level
BulletPowerup.prototype.timestamp = 0;
BulletPowerup.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;
BulletPowerup.prototype.radius = 5;
BulletPowerup.prototype.velY = 3;

BulletPowerup.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
    
    if(this.cy > g_canvas.height){
        return entityManager.KILL_ME_NOW;
    }

    this.cy += this.velY * du;

    var isHit = this.findHitEntity();
    if(isHit){       
        if(isHit.killBulletPowerup) {
            gunType = 1+ Math.round(Math.random()*2)
            // Tímabundið
            setTimeout(function(){ gunType = 0; }, 10000);
            return entityManager.KILL_ME_NOW;
        }
    } 

    spatialManager.register(this);
};

BulletPowerup.prototype.getRadius = function () {
    return this.scale * (this.radius) ;
};

BulletPowerup.prototype.render = function (ctx) {

    var fadeThresh = BulletPowerup.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    ctx.save();
    ctx.fillStyle = 'White';
    util.fillCircle(ctx, this.cx, this.cy, this.radius);
    ctx.fillStyle = 'Purple';
    util.fillCircle(ctx, this.cx, this.cy, this.radius/1.5);
    ctx.restore();

    ctx.globalAlpha = 1;
};