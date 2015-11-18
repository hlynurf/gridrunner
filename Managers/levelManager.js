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
	for (var i=0; i<20; i++) {
		var catCount = 4 + 2*i;
		var catInterval = (3000 - Math.min(1000, Math.max(0, (i-4)*100))) / NOMINAL_UPDATE_INTERVAL;
		var kamiCount = 1 + Math.max(0, (i-3)/2);
		var kamiInterval = catInterval*3;
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
	while(this._levels && this._levels.length>0) {
		this._levels.pop();
	}
},

update : function(du) {
	if(this._currentLevel instanceof Level) {
		this._currentLevel.update(du);
	}
},

nextLevel : function() {
	this._currentLevelIdx++;
	this._currentLevel = this._levels[this._currentLevelIdx];
	return this._currentLevel;
},

levelOver : function() {
	if (this._currentLevel.allDone() && entityManager.noMoreEnemies()) {
		spatialManager.resetEntities();
		removePowerups();
		return this._currentLevel.workOvertime();
	}
},

moreLevels : function() {
	return this._currentLevelIdx+1<this._levels.length;
},

getCurrentLevel : function() {
	return this._currentLevelIdx+1;
},

levelCountDown : function() {
	return this._currentLevel.countdown;
},

levelOvertime : function() {
	return this._currentLevel.overtime;

},

compliment : function() {
	return this._currentLevel.compliment;
},

}