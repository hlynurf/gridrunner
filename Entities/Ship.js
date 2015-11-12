// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
    // Set normal drawing scale, and warp state off
    this._scale = .4;
    this._isWarping = false;
    this._lastBullet = Date.now();
    this._bulletDifference = 100;
	this._lives = 3;
	this._gunType = 1; //Default, simple gun
    this.killShip = true;
};

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_UP = 'W'.charCodeAt(0);
Ship.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;

// BOOST!
Ship.prototype.enlargedDuration = 0;

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");

Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -0.4;
    util.playSound(this.warpSound);
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.08) {
    
        this._moveToASafePlace();
        this.halt();
        this._scaleDirn = 0.4;
        
    } else if (this._scale > 0.4) {
    
        this._scale = 0.4;
        this._isWarping = false;
        
        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
        
    }
};

Ship.prototype._moveToASafePlace = function () {
    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {
    
        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);
        
        this.wrapPosition();
        
        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;
        
    }
};
    
Ship.prototype.update = function (du) {
    // Handle powerups
    if (this.enlargedDuration > 0) {
        this.enlargedDuration -= du;
		this._scale = 1.2;
    }
	else if (!this._isWarping) {
		this._scale = .4;
	}

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    spatialManager.unregister(this);
    

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet();
    var isHit = this.findHitEntity();
    if (isHit) {
        if (isHit.killShip && this.enlargedDuration<=0) {
            this.warp();
            this._lives--;
            if (this._lives < 0) {
                this.kill();
                main.gameOver();
            }
        }
        if (this.enlargedDuration>0 && isHit.killShip && !isHit.isLightning) {
            if(isHit instanceof Caterpillar) {
                var points = updateScore(100, main.getCurrTime());
                entityManager.makePointsAppear(isHit.cx, isHit.cy, points);
            } else if (isHit instanceof LandMine) {
                var points = updateScore(50, main.getCurrTime());
                entityManager.makePointsAppear(isHit.cx, isHit.cy, points);
            }
            isHit.kill();
        }
    }
    spatialManager.register(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
};

Ship.prototype.computeSubStep = function (du) {
    
    var speedY = this.computeSpeedVertical();
    var speedX = this.computeSpeedHorizontal();
    this.cx += speedX;
    this.cy += speedY;
  
};

var NOMINAL_THRUST = +5;

Ship.prototype.computeSpeedVertical = function () {
    
    var speed = 0;
    var oneGridY=g_canvas.height / 30;
    var shipHeight=this.sprite.height*0.4/2;
    if (keys[this.KEY_UP] && this.cy >oneGridY + shipHeight ) {
        speed -= NOMINAL_THRUST;
    }
    if (keys[this.KEY_DOWN] && this.cy < g_canvas.height-(2*oneGridY)- shipHeight) {
        speed += NOMINAL_THRUST;
    }
    
    return speed;
};

var speedHorizontal = +5;

Ship.prototype.computeSpeedHorizontal = function () {
    
    var speed = 0;
    var oneGridX=g_canvas.width / 20;
    //0.4 er scale, eh sem þarf að laga
    var shipWidth=this.sprite.width*0.4/2;
    if (keys[this.KEY_LEFT] && this.cx > oneGridX+shipWidth) {
        speed -= speedHorizontal;
    }
    if (keys[this.KEY_RIGHT] && this.cx <g_canvas.width-oneGridX-shipWidth) {
        speed += speedHorizontal;
    }
    
    return speed;
};
var gunType=0;

Ship.prototype.maybeFireBullet = function () {
    this._gunType = gunType;
	if (Date.now() > this._lastBullet + this._bulletDifference) {
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() + 10; // 10 is default bullet halfheight
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist , this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation, false);
		switch (this._gunType) {
			case 0:
				break;
			case 1:
				for (var i = 1; i <= 3; i++) {
					var angle = this.rotation + i * Math.PI/2;
					dX = +Math.sin(angle);
					dY = -Math.cos(angle);
					relVelX = dX * relVel;
					relVelY = dY * relVel;
					entityManager.fireBullet(
						this.cx + dX * launchDist, this.cy + dY * launchDist,
						this.velX + relVelX, this.velY + relVelY,
						angle);
				}
				break;
			case 2:
				for (var i = 1; i <= 20; i++) {
					var angle = this.rotation + i * Math.PI/10;
					dX = +Math.sin(angle);
					dY = -Math.cos(angle);
					relVelX = dX * relVel;
					relVelY = dY * relVel;
					entityManager.fireBullet(
						this.cx + dX * launchDist, this.cy + dY * launchDist,
						this.velX + relVelX, this.velY + relVelY,
						angle);
				}
				break;
			case 3:
				for (var i = -1; i <= 1; i+=2) {
					var angle = this.rotation + i * Math.PI/10;
					dX = +Math.sin(angle);
					dY = -Math.cos(angle);
					relVelX = dX * relVel;
					relVelY = dY * relVel;
					entityManager.fireBullet(
						this.cx + dX * launchDist, this.cy + dY * launchDist,
						this.velX + relVelX, this.velY + relVelY,
						angle);
				}
				break;
			default:
				break;
		}
        this._lastBullet = Date.now();
    }
};

Ship.prototype.getRadius = function () {
    return 15*this._scale/.4;
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};


Ship.prototype.render = function (ctx) {
    
	drawShipAt(ctx, this.cx, this.cy, this._scale);
	
	this.renderLives(ctx);
    this.renderEnlargedCountdown(ctx);
};

Ship.prototype.renderLives = function(ctx) {
	var lifeSprite = g_sprites.life;
	// var origScale = lifeSprite.scale;
    // lifeSprite.scale = .2;
	var w = 15 * 2.2;	//15 is original radius
	for (var i = 0; i < this._lives; i++) {
		drawShipAt(ctx, g_canvas.width - w / 2- w * i, g_canvas.height - w / 2, .4);
	}
    //lifeSprite.scale = origScale;
};

Ship.prototype.makeEnlarged = function() {
    this.enlargedDuration = 5000 / NOMINAL_UPDATE_INTERVAL;
}

Ship.prototype.renderEnlargedCountdown = function(ctx) {
    var enlargedSecs = Math.ceil(this.enlargedDuration / SECS_TO_NOMINALS)
    if(enlargedSecs > 0) {
        var boxSize = 20;
        util.borderedCenteredText(ctx, g_canvas.width-boxSize-30, g_canvas.height-boxSize-30, 'Yellow', 'Red', '60px Impact', 1.2, enlargedSecs);
    }
}