// ==============
// MOUSE HANDLING
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var g_mouseX = 0,
    g_mouseY = 0;

function handleMouse(evt) {
	if(g_doMouse && !g_isUpdatePaused ){
		if(evt.clientX >g_canvas.width / 10 && evt.clientX <g_canvas.width-g_canvas.width / 20)
   			g_mouseX = evt.clientX - g_canvas.offsetLeft;
		if(evt.clientY >g_canvas.height / 15 && evt.clientY < g_canvas.height-g_canvas.height / 15)
    		g_mouseY = evt.clientY - g_canvas.offsetTop;
    	entityManager.yoinkNearestShip(g_mouseX, g_mouseY);
	}
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousemove", handleMouse);
