// ======
// Lightning
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Lightning(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.killShip = true;
    this.isLightning = true;
}

Lightning.prototype = new Entity();

// Initial, inheritable, default values
Lightning.prototype.velX = 110;
Lightning.prototype.velY = 100;
Lightning.prototype.width = 4;
Lightning.prototype.height = g_canvas.height;

// Convert times from milliseconds to "nominal" time units.
Lightning.prototype.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;

Lightning.prototype.update = function (du, ctx) {

    spatialManager.unregister(this);
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
    spatialManager.register(this);

};

Lightning.prototype.render = function (ctx) {

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.globalAlpha = Math.min(1, (this.lifeSpan * NOMINAL_UPDATE_INTERVAL / 1000));
    ctx.moveTo(this.cx, this.cy + 20);
    ctx.lineTo(this.cx, this.cy + this.height - 40);
    ctx.strokeStyle = 'rgb(113, 201, 55)';
    ctx.stroke();
    ctx.restore();
    
};
