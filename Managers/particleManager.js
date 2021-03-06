"use strict";

var particleManager = {

	// "PRIVATE" DATA

	_stars : [],
	_fragments   : [],

	// "PRIVATE" METHODS

	_forEachOf: function(aCategory, fn) {
		for (var i = 0; i < aCategory.length; ++i) {
			fn.call(aCategory[i]);
		}
	},

	// PUBLIC METHODS

	// A special return value, used by other objects,
	// to request the blessed release of death!
	//
	KILL_ME_NOW : -1,

	// Some things must be deferred until after initial construction
	// i.e. thing which need `this` to be defined.
	//
	deferredSetup : function () {
		this._categories = [this._fragments];
	},

	makeStar: function() {
		this._stars.push(new Star({
			cx   : Math.floor(Math.random() * g_canvas.width),
			cy   : Math.floor(Math.random() * g_canvas.height),
			velX : 0,
			velY : .5,
			colorTimer : Math.floor(Math.random() * 60)
		}));
	},

	triggerExplosion: function(x, y) {
		var fragColor = entityManager.getRandomColor();
		for (var i = 0; i < 20; i++) {
			this._fragments.push(new Fragment({
				cx: x,
				cy: y,
				color: fragColor
			}));
		}
	},

	update: function(du) {
		for (var c = 0; c < this._categories.length; ++c) {
			var aCategory = this._categories[c];
			var i = 0;

			while (i < aCategory.length) {
				var status = aCategory[i].update(du);

				if (status === this.KILL_ME_NOW) {
					// remove the dead guy, and shuffle the others down to
					// prevent a confusing gap from appearing in the array
					aCategory.splice(i,1);
				}
				else {
					++i;
				}
			}
		}
		for (i = 0; i < this._stars.length; i++) {
			this._stars[i].update(du);
		}
	},

	render: function(ctx) {
		var debugY = 100;
		for (var c = 0; c < this._categories.length; ++c) {
			var aCategory = this._categories[c];
			for (var i = 0; i < aCategory.length; ++i) {
				aCategory[i].render(ctx);
			}
			debugY += 10;
		}
	},

	renderStars: function(ctx) {
		var debugY = 100;

		for (var i = 0; i < this._stars.length; ++i) {
			this._stars[i].render(ctx);
		}
		debugY += 10;
	}
};

// Some deferred setup which needs the object to have been created first
particleManager.deferredSetup();

