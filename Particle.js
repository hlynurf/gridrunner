function Particle() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Particle.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // I am not dead yet!
    this._isDeadNow = false;
};

Particle.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Particle.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

Particle.prototype.kill = function () {
    this._isDeadNow = true;
};

Particle.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};