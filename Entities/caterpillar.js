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
Caterpillar.prototype.radius = 10;; 
Caterpillar.prototype.velY = 0.5;
// If true he is going right, if false he is going left
Caterpillar.prototype.lives = 3; 

Caterpillar.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (this._isDeadNow) 
        return entityManager.KILL_ME_NOW;

    if(this.cy > g_canvas.height - g_canvas.height/10){
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
        this.cy += 4;
        // After moving down, reverse direction
        if (this.cy >= this.startY + this.downRange && this.direction) {
            this.startY += this.downRange;
            this.velX =- 4;
            this.direction = false;
        }
        if (this.cy >= this.startY + this.downRange && !this.direction) {
            this.startY += this.downRange;
            this.velX = 4;
            this.direction = true;
        }
    }
    this.cy += this.velY;
    this.cx += this.velX;
    // Collusion
    var isHit = this.findHitEntity();
    if (isHit) {
        if(!isHit.killShip) {
            this.lives-=1;
            if ( this.lives==0 ){
            var points = updateScore(30, isHit.timestamp);
            entityManager.makePointsAppear(this.cx, this.cy, points);
            if(Math.random()<0.1)
                entityManager.createPowerups(this.cx,this.cy);
            // Kill the bullet!
            isHit.kill();
            return entityManager.KILL_ME_NOW;
            }
        }
    } else spatialManager.register(this);

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