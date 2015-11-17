"use strict";

var levelManager = {

	// "PRIVATE" DATA

	_levels : [],
	_currentLevelIdx : 0,
	_currentLevel : {},

	// PRIVATE METHODS


	// PUBLIC METHODS

	init : function() {
		// call when starting a new game

		// TODO add levels
		for (var i=0; i<20; i++) {
			var catCount = 2*(i+1);
			var catInterval = (1000 + 2000/Math.max(1, i-4)) / NOMINAL_UPDATE_INTERVAL;
			var kamiCount = Math.max(0, i-3);
			var kamiInterval = catInterval*2;
			this._levels.push(new Level({
				caterpillarCount: catCount,
				caterpillarInterval: catInterval,
				kamikazeCount: kamiCount,
				kamikazeInterval: kamiInterval
			}));
		}

		// start at first level
		this._currentLevelIdx = 0;
		this._currentLevel = this._levels[this._currentLevelIdx];
	},

	makeEmpty : function() {
		while (this._levels && this._levels.length > 0) {
			this._levels.pop();
		}
	},

	update : function(du) {
		if (this._currentLevel instanceof Level) {
			this._currentLevel.update(du);
		}
	},

	nextLevel : function() {
		this._currentLevelIdx++;
		this._currentLevel = this._levels[this._currentLevelIdx];
		return this._currentLevel;
	},

	levelOver : function() {
		return this._currentLevel.allDone() && entityManager.noMoreEnemies();
	},

	moreLevels : function() {
		return this._currentLevelIdx + 1 < this._levels.length;
	},

	getCurrentLevel : function() {
		return this._currentLevelIdx + 1;
	},

	levelCountDown : function() {
		return this._currentLevel.countdown;
	}
};