// =========
// GridRunner
// =========
/*

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var g_score = 0;// ideally it would be wise to not make this global
var g_combo = 0;
var g_highest_combo = 0;
var g_last_combo_hit_timestamp = 0;
var g_nextCaterPillar = 3000 / NOMINAL_UPDATE_INTERVAL;
var g_nextKamiKaze = 10000 / NOMINAL_UPDATE_INTERVAL;
/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip(true);
 
}

function createInitialStars() {
	for (var i = 0; i < 50; i++) { 
		particleManager.makeStar();
	}
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);
    if (!g_isUpdatePaused && !main._mainMenu){
        g_nextCaterPillar -= du;
        g_nextKamiKaze -= du;
        if (g_nextCaterPillar < 0){
            entityManager.createCaterpillar();
            g_nextCaterPillar = 4000 / NOMINAL_UPDATE_INTERVAL;
        }
        if (g_nextKamiKaze < 0) {
            entityManager.sendKamikaze();
            g_nextKamiKaze = 10000 / NOMINAL_UPDATE_INTERVAL;
        }
    }
	
	particleManager.update(du);
}

function updateScore(points, timestamp) {
    increaseCombo(timestamp);
    score = points*g_combo;
    g_score += score;
    return score;
}

function increaseCombo(timestamp) {
    g_combo += 1;
    g_highest_combo = Math.max(g_highest_combo, g_combo);
    g_last_combo_hit_timestamp = timestamp;
}

function loseCombo(timestamp) {
    if(timestamp >= g_last_combo_hit_timestamp) {
        g_combo = 0;
    }
}

function resetScore() {
    g_score = 0;
    g_combo = 0;
    g_highest_combo = 0;
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
var g_muted = true; //false;

var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');
var KEY_MUTE = keyCode('N');


function processDiagnostics() {

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_MUTE)) g_muted = !g_muted;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

	drawScrollingBackground(ctx);
	drawBackground(ctx);
	drawScore(ctx);
    if (g_combo > 1) drawCombo(ctx);
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}

function renderGameOverScreen(ctx) {
    drawBackground(ctx);
    drawGameOverScreen(ctx);

}
function renderGamePaused(ctx){
    drawGamePaused(ctx); 
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "images/ship.png",
        bullet  : "images/kenneyImg/PNG/Lasers/laserGreen05.png",
		life : "images/kenneyImg/PNG/UI/playerLife1_orange.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.bullet.scale = 0.5;
	g_sprites.life = new Sprite(g_images.life);

    main.init();
}

// Kick it off
requestPreloads();