// ===========
// LEVEL STUFF
// ===========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Level(descr) {
    for(var poperty in descr) {
        this[property] = descr[property];
    }
};

Level.prototype.caterpillars = [];
Level.prototype.currtime = 0;
// Overkill much?
Level.prototype.speedMultiplier = 1;

Level.prototype.update = function(du) {
    this.currtime += du;
    for (var cat in this.caterpillars) {
        if(cat.timestamp < this.currtime) {
            // Add caterpillar to entity manager
        }
    }
};
