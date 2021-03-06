/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";


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
		if (!entity._isDeadNow) this._entities[spatialID] = { posX: pos.posX, posY: pos.posY, radius: entity.getRadius(), isLightning: entity.isLightning, entity: entity };
	},

	unregister: function(entity) {
		var spatialID = entity.getSpatialID();
		delete this._entities[spatialID];
	},

	resetEntities: function() {
		this._entities = [];
	},

	findEntityInRange: function(posX, posY, radius) {
		// like in the render function we go through the entites
		for (var ID in this._entities) {
			var e = this._entities[ID];
			// it's a collision!
			if (e.isLightning) {
				if (e.posX > posX - radius && e.posX < posX + radius) {
					return e.entity;
				}
			}
			if (util.wrappedDistSq(posX, posY, e.posX, e.posY, g_canvas.width, g_canvas.height) < util.square(e.radius + radius)) {
				if (!e.isPowerUp) return e.entity;
			}
		}
	},

	render: function(ctx) {
		var oldStyle = ctx.strokeStyle;
		ctx.strokeStyle = 'red';
		for (var ID in this._entities) {
			var e = this._entities[ID];
			util.strokeCircle(ctx, e.posX, e.posY, e.radius);
		}
		ctx.strokeStyle = oldStyle;
	}
};
