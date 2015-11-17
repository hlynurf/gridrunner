// GENERIC RENDERING
var g_doClear = true;
var g_undoBox = false;
var g_doFlipFlop = false;
var g_doMouse = false;
var g_menuChoose = 0;
var g_lastMenuKeyPress = 0;

var g_frameCounter = 1;

var TOGGLE_CLEAR = 'C'.charCodeAt(0);
var GO_BACK = 'B'.charCodeAt(0);
var TOGGLE_UNDO_BOX = 'U'.charCodeAt(0);
var TOGGLE_FLIPFLOP = 'F'.charCodeAt(0);
var TOGGLE_MOUSE = 'M'.charCodeAt(0);
var MOVE_UP = 'W'.charCodeAt(0);
var MOVE_DOWN = 'S'.charCodeAt(0);


function render(ctx, gameOver, victory, mainMenu, highScore, rules) {
	// Process various option toggles
	//
	if (eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;
	if (eatKey(TOGGLE_UNDO_BOX)) g_undoBox = !g_undoBox;
	if (eatKey(TOGGLE_FLIPFLOP)) g_doFlipFlop = !g_doFlipFlop;
	if (eatKey(TOGGLE_MOUSE)) g_doMouse = !g_doMouse;
	// I've pulled the clear out of `renderSimulation()` and into
	// here, so that it becomes part of our "diagnostic" wrappers
	//
	if (g_doClear) util.clearCanvas(ctx);
	if (mainMenu) {
		var menuSound = new Audio('sounds/menusound.ogg'); 
		if (eatKey(MOVE_UP)) {
			moveUp(main.getCurrTime());
			util.playSound(menuSound);
		}
		if (eatKey(MOVE_DOWN)) { 
			moveDown(main.getCurrTime());
			util.playSound(menuSound);
		}
	}

	if (highScore || rules) {
		if (eatKey(GO_BACK)) main.mainMenu();
	}
	// The main purpose of the box is to demonstrate that it is
	// always deleted by the subsequent 'undo" before you get to
	// see it...
	//
	// i.e. double-buffering prevents flicker!
	//
	// The core rendering of the actual game / simulation
	//
	if (gameOver && victory) renderVictoryScreen(ctx);
    else if (gameOver) renderGameOverScreen(ctx);
	else if (mainMenu) drawMainMenu(ctx);
	else if (highScore) drawHighScores(ctx, main.highScores);
	else if (rules) drawRules(ctx);
	else renderSimulation(ctx);
	if (g_isUpdatePaused && !gameOver && !mainMenu)
		renderGamePaused(ctx);

	if (g_muted) {
		drawSoundMutedLogo(ctx);
	} else {
		drawSoundLogo(ctx);
	}
	// This flip-flip mechanism illustrates the pattern of alternation
	// between frames, which provides a crude illustration of whether
	// we are running "in sync" with the display refresh rate.
	//
	// e.g. in pathological cases, we might only see the "even" frames.
	//
	if (g_doFlipFlop) {
		var boxX = 250;
		var boxY = g_isUpdateOdd ? 100 : 200;
		// Draw flip-flop box
		util.fillBox(ctx, boxX, boxY, 50, 50, 'green');
		// Display the current frame-counter in the box...
		ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
		// ..and its odd/even status too
		var text = g_frameCounter % 2 ? 'odd' : 'even';
		ctx.fillText(text, boxX + 10, boxY + 40);
	}
	// Optional erasure of diagnostic "box",
	// to illustrate flicker-proof double-buffering
	//
	if (g_undoBox) ctx.clearRect(200, 200, 50, 50);
	++g_frameCounter;
}

function moveDown(timestamp) {
	if (g_menuChoose < 2 && timestamp > g_lastMenuKeyPress + 100 / NOMINAL_UPDATE_INTERVAL) {
		g_menuChoose++;
		g_lastMenuKeyPress = main.getCurrTime();
	}
}

function moveUp(timestamp) {
	if (g_menuChoose > 0 && timestamp > g_lastMenuKeyPress + 100 / NOMINAL_UPDATE_INTERVAL) {
		g_menuChoose--;
		g_lastMenuKeyPress = main.getCurrTime();
	}
}
