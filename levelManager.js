/*

levelManager.js

A module which handles level contents and updates.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var levelManager = {

// "PRIVATE" DATA

_levels = [],
_currentLevelIdx,
_currentLevel,

// PRIVATE METHODS


// PUBLIC METHODS

reset : function() {
    // call when starting a new game

    // TODO add levels
    var l1 = new Level();
    l1.caterpillars.push(new Caterpillar());
    this._levels.push(l1);

    // start at first level
    this._currentLevelIdx = 0;
    this._currentLevel = _levels[0];
},

update : function(du) {
    if(this._currentLevel) {
        this._currentLevel.update(du);
    }
},

nextLevel : function() {
    this._currentLevelIdx++;
    this._currentLevel = this._levels[this._currentLevelIdx];
    return _currentLevel;
},


}