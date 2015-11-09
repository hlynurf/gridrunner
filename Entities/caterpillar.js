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
/*
    // Diagnostics to check inheritance stuff
    this._CaterpillarProperty = true;
    console.dir(this);
*/

};

var moveRight=100;
var moveLeft=-1;
Caterpillar.prototype = new Entity();
// The time the caterpillar enters the level
Caterpillar.prototype.timestamp = 0;

Caterpillar.prototype.radius = 10;
Caterpillar.prototype.velX = 1;
Caterpillar.prototype.velY = 1;
Caterpillar.prototype.update = function (du) {



    spatialManager.unregister(this);
    if (this._isDeadNow) 
        return entityManager.KILL_ME_NOW;

    this.cy += this.velY * du;
    if(this.cy>g_canvas.height){
        return entityManager.KILL_ME_NOW;
    }
    if(moveRight<=100 && moveRight>=0){
    this.cx += 0.5;
    moveRight-=1;
    if(moveRight==0)
        moveLeft=100;
    }
    if(moveLeft<=100 && moveLeft>=0){
        this.cx -= 0.5;
        moveLeft-=1;
        if(moveLeft==0)
            moveRight=100;
    }


    var isHit = this.findHitEntity();
    if (isHit) {
        if(!isHit.killShip) {
            g_score += 100;
            if(Math.random()<0.1)
            entityManager.createBulletPowerup(this.cx,this.cy);
            return entityManager.KILL_ME_NOW;
        }
    } else spatialManager.register(this);

};

Caterpillar.prototype.getRadius = function () {
    return this.scale * (this.radius) ;
};


Caterpillar.prototype.takeBulletHit = function () {
    this.kill();
    
    if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();
        
    }
};

Caterpillar.prototype._spawnFragment = function () {
    entityManager.generateCaterpillar({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /2
    });
};

Caterpillar.prototype.render = function (ctx) {
    drawCaterpillar(ctx, this.cx, this.cy);
};