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
    this._bulletDifference = 5000;
    this._goingDown = true;
    this._nextStop = 4000 / NOMINAL_UPDATE_INTERVAL;
    this._stopTime = 0;
    this._hasFired = false;
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

};

SideEnemy.prototype.computeSubStep = function (du) {

    this._nextStop -= du;
    if (this._nextStop < 0) {
        if (this._stopTime < 2000 / NOMINAL_UPDATE_INTERVAL) {
            this._stopTime += du;
        } else {
            this._stopTime = 0;
            this._nextStop = 4000 / NOMINAL_UPDATE_INTERVAL;
            this._hasFired = false;
        }
    } else {
        if (this._goingDown) this.cy += 2;
        else this.cy -= 2;
        if (this.cy > g_canvas.height - 40) this._goingDown = false;
        if (this.cy < 20) this._goingDown = true;
    }
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

        entityManager.createLandMine(this.cx, this.cy);
        // entityManager.fireBullet(
        //    this.cx + dX * launchDist, this.cy + dY * launchDist,
        //    this.velX + relVelX, this.velY + relVelY,
        //    this.rotation, true);
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
    var width = 40;
    var height = 30;
    var y = this.cy - height / 4 - 1;
    ctx.save();
    if (this._stopTime > 500 / NOMINAL_UPDATE_INTERVAL && this._stopTime < 2000 / NOMINAL_UPDATE_INTERVAL) {
        if (!this._hasFired) {
            entityManager.createLandMine(this.cx + 30, this.cy);
            this._hasFired = true;
        }
    }
    util.fillBox(ctx, this.cx, y, 20, 2, 'Yellow');
    util.fillBox(ctx, this.cx, y + height / 2, 20, 2, 'Yellow');

    util.fillBox(ctx, this.cx + width * 0.3, y, 3, 6, 'Yellow');
    util.fillBox(ctx, this.cx + width * 0.3, y + height / 3, 3, 6, 'Yellow');

    util.fillBox(ctx, this.cx + width * 0.45, y + height * 0.125, 3, 10, 'Yellow');
    util.fillBox(ctx, this.cx + width * 0.45, y + height * 0.25 -1 , 12, 4, 'Yellow');
    ctx.restore();
};
