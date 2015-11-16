// ========
// MAINLOOP
// ========
/*

The mainloop is one big object with a fairly small public interface
(e.g. init, iter, gameOver), and a bunch of private internal helper methods.

The "private" members are identified as such purely by the naming convention
of having them begin with a leading underscore. A more robust form of privacy,
with genuine name-hiding *is* possible in JavaScript (via closures), but I 
haven't adopted it here.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


var main = {
    
    // "Frame Time" is a (potentially high-precision) frame-clock for animations
    _frameTime_ms : null,
    _frameTimeDelta_ms : null,

    _currTime_ms : 0
};

main.getCurrTime = function() {
    return this._currTime_ms;
}

// Perform one iteration of the mainloop
main.iter = function (frameTime) {
    
    // Use the given frameTime to update all of our game-clocks
    this._updateClocks(frameTime);
    
    // Perform the iteration core to do all the "real" work
    this._iterCore(this._frameTimeDelta_ms);
    
    // Diagnostics, such as showing current timer values etc.
    this._debugRender(g_ctx);
    
    // Request the next iteration if needed
    /*if (!this._isGameOver)*/ this._requestNextIteration();
};

main._updateClocks = function (frameTime) {
    
    // First-time initialisation
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;
    
    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
    this._currTime_ms += frameTime;
};

main._iterCore = function (dt) {
    
    // Handle QUIT
    if (!this._isGameOver && requestedQuit()) {
        this.gameOver();
    }
    // Handle NEW GAME
    if (this._isGameOver && requestedNewGame()) {
        this.newGame();
    }
    if (this._mainMenu && requestedNewGame()) {
        if (g_menuChoose === 0) this.newGame();
        else this.highScore();
    }


    if (!this._isGameOver) {
        update(dt);
    }
    render(g_ctx, this._isGameOver, this._mainMenu, this._highScore);
};

main._isGameOver = false;
main._mainMenu = true;
main._highScore = false;
main.highScores = [];
main.gameOver = function () {
    this._isGameOver = true;
    // Play game over sound?
    this.highScores.push(g_score);
    if (this.highScores.length) {
        this.highScores.sort(function (a, b) {
            return b - a;
        });
        this.highScores = this.highScores.slice(0, 5);
    }
    localStorage.setItem('highScore', JSON.stringify(this.highScores))
    entityManager.resetCategories();
    spatialManager.resetEntities();
};

main.mainMenu = function () {
    this._mainMenu = true;
    this._highScore = false;
}


main.newGame = function () {
    entityManager.init();
    createInitialShips();
    resetScore();
    this._mainMenu = false;
    this._isGameOver = false;
}

main.highScore= function () {
    this._mainMenu = false;
    this._highScore = true;
}

// Simple voluntary quit mechanism
//
var KEY_QUIT = 'Q'.charCodeAt(0);
function requestedQuit() {
    return keys[KEY_QUIT];
}

var KEY_NEW_GAME = ' '.charCodeAt(0);
function requestedNewGame() {
    return keys[KEY_NEW_GAME];
}

// Annoying shim for Firefox and Safari
window.requestAnimationFrame = 
    window.requestAnimationFrame ||        // Chrome
    window.mozRequestAnimationFrame ||     // Firefox
    window.webkitRequestAnimationFrame;    // Safari

// This needs to be a "global" function, for the "window" APIs to callback to
function mainIterFrame(frameTime) {
    main.iter(frameTime);
}

main._requestNextIteration = function () {
    window.requestAnimationFrame(mainIterFrame);
};

// Mainloop-level debug-rendering

var TOGGLE_TIMER_SHOW = 'T'.charCodeAt(0);

main._doTimerShow = false;

main._debugRender = function (ctx) {
    
    if (eatKey(TOGGLE_TIMER_SHOW)) this._doTimerShow = !this._doTimerShow;
    
    if (!this._doTimerShow) return;
    
    var y = 350;
    ctx.fillText('FT ' + this._frameTime_ms, 50, y+10);
    ctx.fillText('FD ' + this._frameTimeDelta_ms, 50, y+20);
    ctx.fillText('UU ' + g_prevUpdateDu, 50, y+30); 
    ctx.fillText('FrameSync ON', 50, y+40);
};

main.init = function () {
    
    // Grabbing focus is good, but it sometimes screws up jsfiddle,
    // so it's a risky option during "development"
    //
    //window.focus(true);

    // We'll be working on a black background here,
    // so let's use a fillStyle which works against that...
    //

    g_ctx.fillStyle = "white";
    var high = localStorage.getItem('highScore');
    if (high) this.highScores = JSON.parse(high);
    this._requestNextIteration();
};
