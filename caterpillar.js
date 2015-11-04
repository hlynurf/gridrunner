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

    this.randomisePosition();
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.Caterpillar;
    this.scale  = this.scale  || 1;
    this.killShip = true;
/*
    // Diagnostics to check inheritance stuff
    this._CaterpillarProperty = true;
    console.dir(this);
*/

};


Caterpillar.prototype = new Entity();

Caterpillar.prototype.randomisePosition = function () {
    // Caterpillar randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = 5;
};
Caterpillar.prototype.radius = 10;
Caterpillar.prototype.velY = 2;
Caterpillar.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) 
        return entityManager.KILL_ME_NOW;

    this.cy += this.velY * du;

    this.wrapPosition();

    spatialManager.register(this);

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
    drawCircleEnemy(ctx, this.cx, this.cy);
};