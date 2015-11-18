// =========
// GridRunner
// =========

var g_canvas = document.getElementById('myCanvas');
var g_ctx = g_canvas.getContext('2d');

var g_score = 0;// ideally it would be wise to not make this global
var g_combo = 0;
var g_highest_combo = 0;
var g_last_combo_hit_timestamp = 0;
var g_combo_timer = 0;

// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {
	entityManager.generateShip();
}

function createNextLevelShip(lives) {
	entityManager.generateNewShip(lives);
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
var id = 0;
function updateSimulation(du) {
	processDiagnostics();
	entityManager.update(du);
	levelManager.update(du);

	if (!g_isUpdatePaused && !main._mainMenu && !main._highScore && !main._rules) {
		g_combo_timer -= du;
		if (g_combo_timer <= 0) {
			loseCombo();
		}

		if (levelManager.levelOver() && levelManager.moreLevels()) {
			main.nextLevel();
		} else if (levelManager.levelOver()) {
			main.gameOver();
		}
	}
	particleManager.update(du);
}

function updateScore(points) {
	// Minus points don't have combo
	if (points >= 0) {
		increaseCombo();
		score = points * g_combo;
	} else
		score = points;

	g_score += score;

	return score;
}

function increaseCombo() {
	g_combo += 1;
	g_highest_combo = Math.max(g_highest_combo, g_combo);
	g_combo_timer = 500 / NOMINAL_UPDATE_INTERVAL;
}

function loseCombo() {
	g_combo = 0;
}

function resetScore() {
	g_score = 0;
	g_combo = 0;
	g_highest_combo = 0;
}

function removePowerups() {
	g_bullet_powerupTimer = 0;
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var g_muted = false; //false;

var KEY_SPATIAL = keyCode('X');
var KEY_MUTE = keyCode('N');


function processDiagnostics() {
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
	if (levelManager.levelCountDown() > 0) {
		drawLevelCountdown(ctx);
	} else {
		drawLevelNum(ctx);
	}
	if (levelManager.levelOvertime() > 2 * g_canvas.height) {
		drawRewardMessages(ctx, 1 + Math.floor((levelManager.levelOvertime() - 2 * g_canvas.height) / g_canvas.height));
	}
	entityManager.render(ctx);
	particleManager.render(ctx);

	if (g_renderSpatialDebug) spatialManager.render(ctx);
}

function renderGameOverScreen(ctx) {
	drawBackground(ctx);
	drawGameOverScreen(ctx);
}
function renderVictoryScreen(ctx) {
	drawBackground(ctx);
	drawVictoryScreen(ctx);
}
function renderGamePaused(ctx) {
	drawGamePaused(ctx);
}

var g_sprites = {};

function preloadDone() {
	createInitialStars();
	main.init();
}

// Kick it off
preloadDone();