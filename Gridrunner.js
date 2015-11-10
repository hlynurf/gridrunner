// =========
// GridRunner
// =========
/*

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_score = 0;// ideally it would be wise to not make this global
/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip(true);
    console.log(entityManager._ships);
    
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
var lastCaterpillar = Date.now();

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    var caterpillerGap = 3000;
    if(Date.now() > lastCaterpillar + caterpillerGap){
        if(!g_isUpdatePaused){
        //Randoms X pos of catapillar insider the box
        var posX = (g_canvas.width / 10)+Math.random() * (g_canvas.width-g_canvas.width / 5);  
        var posY=0;
        for(var i=0; i<5; i++){
            entityManager.createCaterpillar(posX,posY);
            posY+=25;
            posX+=5;
        }
        lastCaterpillar = Date.now();
        }
    }
	particleManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
var g_muted = false;

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

    entityManager.init();
    createInitialShips();
	createInitialStars();

    main.init();
}

// Kick it off
requestPreloads();