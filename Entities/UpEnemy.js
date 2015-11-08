// ==========
// ENEMY STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function UpEnemy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = 0.4;
    this._isWarping = false;
    this._lastBullet = Date.now();
    this._bulletDifference = 1000;
    this._goingRight = true;
};

UpEnemy.prototype = new Entity();

UpEnemy.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
UpEnemy.prototype.rotation = Math.PI;
UpEnemy.prototype.velX = 0;
UpEnemy.prototype.velY = 0;
UpEnemy.prototype.launchVel = 2;
UpEnemy.prototype.numSubSteps = 1;

    
UpEnemy.prototype.update = function (du) {

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    
    spatialManager.unregister(this);
    if (this._isDeadNow) 
        return entityManager.KILL_ME_NOW;

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet();

};

UpEnemy.prototype.computeSubStep = function (du) {

    // this.cx += 5;
    if (this._goingRight) this.cx += 2;
    else this.cx -= 2;
    if (this.cx > g_canvas.width) this._goingRight = false;
    if (this.cx < 40) this._goingRight = true;
};

var NOMINAL_THRUST = +5;

var speedHorizontal = +5;


UpEnemy.prototype.maybeFireBullet = function () {
    if (Date.now() > this._lastBullet + this._bulletDifference) {
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation, true);
        this._lastBullet = Date.now();
    }      
};

UpEnemy.prototype.getRadius = function () {
    return (this.sprite.width / 5) * 0.9;
};

UpEnemy.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

UpEnemy.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};


UpEnemy.prototype.render = function (ctx) {
    drawUpEnemy(ctx, this.cx, this.cy);
};
