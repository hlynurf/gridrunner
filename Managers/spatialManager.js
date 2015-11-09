/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    return this._nextSpatialID++;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    this._entities[spatialID] = { posX: pos.posX, posY: pos.posY, radius: entity.getRadius(), isLightning: entity.isLightning, entity: entity };
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID];
},

findEntityInRange: function(posX, posY, radius, isLightning) {
    // like in the render function we go through the entites
    for (var ID in this._entities) {
        var e = this._entities[ID];
        // it's a collision!
        if (e.isLightning) {
            if (e.posX > posX - radius && e.posX < posX + radius) {
                return e.entity;
            }
        } else {
            if(util.wrappedDistSq(posX, posY, e.posX, e.posY, g_canvas.width, g_canvas.height) < util.square(e.radius + radius)) {
                return e.entity;
            }
        }
        
        // else it is no collision and nothing happens
    }
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
