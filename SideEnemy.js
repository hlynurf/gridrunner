// ==========
// ENEMY STUFF
// ==========

"use strict";

// A generic contructor which accepts an arbitrary descriptor object
function SideEnemy(descr) {

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
    this._goingDown = true;
};

SideEnemy.prototype = new Entity();

SideEnemy.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

// Initial, inheritable, default values
SideEnemy.prototype.rotation = Math.PI / 2;
SideEnemy.prototype.velX = 0;
SideEnemy.prototype.velY = 0;
SideEnemy.prototype.launchVel = 2;
SideEnemy.prototype.numSubSteps = 1;

    
SideEnemy.prototype.update = function (du) {

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

SideEnemy.prototype.computeSubStep = function (du) {

    // this.cx += 5;
    if (this._goingDown) this.cy += 2;
    else this.cy -= 2;
    if (this.cy > g_canvas.height - 40) this._goingDown = false;
    if (this.cy < 0) this._goingDown = true;
};

var NOMINAL_THRUST = +5;

var speedHorizontal = +5;


SideEnemy.prototype.maybeFireBullet = function () {
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
           this.rotation);
        this._lastBullet = Date.now();
    }      
};

SideEnemy.prototype.getRadius = function () {
    return (this.sprite.width / 5) * 0.9;
};

SideEnemy.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

SideEnemy.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};


SideEnemy.prototype.render = function (ctx) {
    drawSideEnemy(ctx, this.cx, this.cy);
};
