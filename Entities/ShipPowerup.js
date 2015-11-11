// ====
// ShipPowerup
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
ShipPowerup.prototype.BulletPowerupIsHit=false;

// A generic contructor which accepts an arbitrary descriptor object
function ShipPowerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite and scale, if not otherwise specified
    this.scale  = this.scale  || 1;

};

ShipPowerup.prototype = new Entity();
// The time the ShipPowerup enters the level
ShipPowerup.prototype.timestamp = 0;
ShipPowerup.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;
ShipPowerup.prototype.radius = 5;

ShipPowerup.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
        
    var isHit = this.findHitEntity();
    if(isHit){       
        if(isHit.killBulletPowerup) {
            //TODO
            isHit.makeEnlarged();
        }
    } 

    spatialManager.register(this);
};

ShipPowerup.prototype.getRadius = function () {
    return this.scale * (this.radius) ;
};

ShipPowerup.prototype.render = function (ctx) {

    var fadeThresh = ShipPowerup.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    drawShipPowerup(ctx, this.cx, this.cy);

    ctx.globalAlpha = 1;
};