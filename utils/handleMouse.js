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
		var oneGridHeight = g_canvas.height / 30;
    	var oneGridWidth = g_canvas.width / 20;
        var shipRadius = entityManager.getShipRadius();
		if(evt.clientX > oneGridWidth + shipRadius && evt.clientX < g_canvas.width - oneGridWidth - shipRadius)
   			g_mouseX = evt.clientX;
		if(evt.clientY > oneGridHeight + shipRadius && evt.clientY < g_canvas.height - (2*oneGridHeight) - shipRadius)
    		g_mouseY = evt.clientY;
    	entityManager.setShip(g_mouseX, g_mouseY);
	}
}

// Handle "down" and "move" events the same way.
window.addEventListener("mousemove", handleMouse);
