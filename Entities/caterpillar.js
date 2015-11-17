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
    this.scale  = this.scale || 1;
    this.killShip = true;
};

Caterpillar.prototype = new Entity();
// HACKED-IN AUDIO (no preloading)
Caterpillar.prototype.popSound = new Audio(
    "sounds/caterpillar.ogg");

// The time the caterpillar enters the level
Caterpillar.prototype.timestamp = 0;
Caterpillar.prototype.radius = 10;; 
Caterpillar.prototype.velY = 0.5;
// If true he is going right, if false he is going left
Caterpillar.prototype.lives = 3; 
Caterpillar.prototype.moreSpeed = 1; 

Caterpillar.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (this._isDeadNow) {
        util.playSound(this.popSound);
        return entityManager.KILL_ME_NOW;
    }

    if (this.cy > g_canvas.height - g_canvas.height / 10) {
        var points = updateScore(-30);
        entityManager.makePointsAppear(this.cx, this.cy, points);
        return entityManager.KILL_ME_NOW;
    }

    /* Caterpillar movement */

    // Makes the bounching effect
    var range = 3;
    if (this.cy >= this.startY + range ){
        this.velY = -0.5;
    }
    if (this.cy < this.startY - range ){
        this.velY = 0.5;
    }
    // Moving it down when it hits its barrier
    if ( this.cx > this.randomRight && this.direction || this.cx < this.randomLeft && !this.direction ) {
        this.velX = 0;
        this.cy += 4*this.moreSpeed;
        // After moving down, reverse direction
        if (this.cy >= this.startY + this.downRange && this.direction) {
            this.startY += this.downRange;
            this.velX =- 4*this.moreSpeed;
            this.direction = false;
        }
        if (this.cy >= this.startY + this.downRange && !this.direction) {
            this.startY += this.downRange;
            this.velX = 4*this.moreSpeed;
            this.direction = true;
        }
    }
    this.cy += this.velY;
    this.cx += this.velX;
    // Collusion
    var isHit = this.findHitEntity();
    if (isHit) {
        if(!isHit.killShip || (isHit instanceof Ship && isHit.enlargedDuration > 0)) {
            this.lives-=1;
            util.playSound(this.popSound);
            // Kill the bullet!
            if (!isHit.killShip) {
                isHit.kill();
            }
            if (!this.lives) {
                var points = updateScore(30);
                entityManager.makePointsAppear(this.cx, this.cy, points);
                if (Math.random() < 0.1)
                    entityManager.createPowerups(this.cx,this.cy);
                return entityManager.KILL_ME_NOW;
            }
        }
    }
    spatialManager.register(this);

};

Caterpillar.prototype.getRadius = function () {
    return this.scale * (this.radius) ;
};

Caterpillar.prototype.render = function (ctx) {
    if (this.position === 0)
    drawCaterpillar(ctx, this.cx, this.cy, true, this.direction, this.lives);
    else
    drawCaterpillar(ctx, this.cx, this.cy, false, this.direction, this.lives);
};