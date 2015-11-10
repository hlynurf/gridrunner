// ====
// Caterpillar
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Caterpillar(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    // Default sprite and scale, if not otherwise specified
    this.scale  = this.scale  || 1;
    this.killShip = true;
};

Caterpillar.prototype = new Entity();
// The time the caterpillar enters the level
Caterpillar.prototype.timestamp = 0;
Caterpillar.prototype.radius = 10;
Caterpillar.prototype.velY = 1;
var goRightLeft=true;
Caterpillar.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (this._isDeadNow) 
        return entityManager.KILL_ME_NOW;
    // Caterpillar movement
    var range = 15;
    for(var i = 0; i < 5; i++) {
        if (this.position === i) {
            if (this.cx === this.startX + range)
                this.velX =- 1;
            if (this.cx === this.startX - range)
                this.velX = 1;
            this.cx += this.velX;
        }
    }

    this.cy += this.velY * du;
    if(this.cy > g_canvas.height){
        return entityManager.KILL_ME_NOW;
    }
    var isHit = this.findHitEntity();
    if (isHit) {
        if(!isHit.killShip) {
            g_score += 100;
            if(Math.random()<0.1)
            entityManager.createBulletPowerup(this.cx,this.cy,false);
            return entityManager.KILL_ME_NOW;
        }
    } else spatialManager.register(this);

};

Caterpillar.prototype.getRadius = function () {
    return this.scale * (this.radius) ;
};

Caterpillar.prototype.render = function (ctx) {
    drawCaterpillar(ctx, this.cx, this.cy);
};