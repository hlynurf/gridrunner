// ====
// LandMine
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function LandMine(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.posX = util.randRange(100, g_canvas.width - 40);
      
    // Default sprite and scale, if not otherwise specified
    this.scale  = this.scale  || 1;
    this.killShip = true;

};


LandMine.prototype = new Entity();

LandMine.prototype.velX = 2;
LandMine.prototype.radius = 7;
LandMine.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) 
        return entityManager.KILL_ME_NOW;

    if (this.cx < this.posX) this.cx += this.velX * du;

    this.wrapPosition();
    var isHit = this.findHitEntity();
    if (isHit) {
        if(!isHit.killShip) {
            // No points for landmines
            if (this.scale < 0.7) {
                if(Math.random()<0.1)
                    entityManager.createPowerups(this.cx,this.cy);
                // Kill the bullet!
                isHit.kill();
                return entityManager.KILL_ME_NOW;
            } else {
                // Kill the bullet!
                isHit.kill();
                this.scale *= 0.7;
            }
        }
    } else spatialManager.register(this);

};

LandMine.prototype.getRadius = function () {
    return this.scale * (this.radius) ;
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
    ctx.fillStyle = 'Gray';
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius());
    ctx.fillStyle = 'Red';
    util.fillCircle(ctx, this.cx, this.cy, this.getRadius()/2);
    ctx.restore();
};