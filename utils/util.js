// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},

getStarColor: function() {	// Returns red, yellow or magenta
	var color = Math.floor(Math.random()*5);
	switch(color) {
		case 0:
			return 'Red';
		case 1:
			return 'Yellow';
		case 2:
			return 'Magenta';
		case 3:
			return 'Blue';
		case 4:
			return 'Orange';
	}
},

fragVel: function() {	// Returns a pseudo-gaussian random velocity for the exploding particle bits
	var rand = 0;
	for (var i = 0; i < 10; i++) {
		rand += Math.random();
	}
	return rand;
},

// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

borderedCenteredText: function (ctx, w, h, fillStyle, strokeStyle, font, borderWidth, text) {
    ctx.save();

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.lineWidth = borderWidth;
    ctx.fillText(text, w, h);
    ctx.strokeText(text, w, h);

    ctx.restore();
},

centeredText: function (ctx, w, h, fillStyle, font, text) {
    ctx.save();

    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.fillText(text, w, h);

    ctx.restore();
},

// PLAY SOUNDS
// ===========

playSound: function(audio) {
    if(!g_muted) {
        audio.play();
    }
}

};
