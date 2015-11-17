var g_backgroundBrightness = .3;

function drawBackground(ctx) {	// Draws the grid
	// util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, 'Black');
	var boxSize = 20;
	var vertLines = g_canvas.width / boxSize;
	var horLines = g_canvas.height / boxSize;
	for (var i = 1; i < vertLines; i++) {
		ctx.save();
		
		ctx.lineWidth = 2;
		if (g_combo) {
			ctx.globalAlpha = .3 + .05 * g_combo;
			if (ctx.globalAlpha > 1) ctx.globalAlpha = 1;
			g_backgroundBrightness = ctx.globalAlpha;
		}
		else {
			if (g_backgroundBrightness > .3) g_backgroundBrightness -= .0002;
			ctx.globalAlpha = g_backgroundBrightness;
		}
		ctx.beginPath();
		ctx.moveTo(boxSize * i, boxSize);
		ctx.lineTo(boxSize * i, g_canvas.height - 2*boxSize);
		ctx.strokeStyle = util.gridColor(levelManager.getCurrentLevel());
		ctx.stroke();
		
		ctx.restore();
	}
	for (var i = 1; i < horLines - 1; i++) {
		ctx.save();
		
		ctx.lineWidth = 2;
		if (g_combo) {
			ctx.globalAlpha = .3 + .05 * g_combo;
			if (ctx.globalAlpha > 1) ctx.globalAlpha = 1;
			g_backgroundBrightness = ctx.globalAlpha;
		}
		else {
			if (g_backgroundBrightness > .3) g_backgroundBrightness -= .0002;
			ctx.globalAlpha = g_backgroundBrightness;
		}
		ctx.beginPath();
		ctx.moveTo(boxSize, boxSize * i);
		ctx.lineTo(g_canvas.width-boxSize, boxSize * i);
		ctx.strokeStyle = util.gridColor(levelManager.getCurrentLevel());
		ctx.stroke();
		
		ctx.restore();
	}
	
}

function drawCaterpillar(ctx, x, y, isHead, direction, lives) {
	ctx.save();
	// Radius of the entire circle.
    var radius = 10;
    // Radius of the white glow.
    var innerRadius = 1;
    var outerRadius = 12;
    // Making 3 different gradients
	var gradient = ctx.createRadialGradient(x-3, y-3, innerRadius, x, y, outerRadius);
	if (lives==3) {
		gradient.addColorStop(0, 'rgba(247,253,193,1.0)');
		gradient.addColorStop(0.20, 'rgba(235,249,52,1.0)');
		gradient.addColorStop(0.60, 'rgba(204,222,38,1.0)');
		gradient.addColorStop(0.80, 'rgba(57,62,10,1.0)');
	}
	else if (lives==2) {
		gradient.addColorStop(0, 'rgba(219,245,255,1.0)');
		gradient.addColorStop(0.20, 'rgba(145,224,255,1.0)');
		gradient.addColorStop(0.60, 'rgba(19,176,239,1.0)');
		gradient.addColorStop(0.80, 'rgba(10,10,62,1.0)');
	}
	else if (lives==1) {
		gradient.addColorStop(0, 'rgba(255,219,245,1.0)');
		gradient.addColorStop(0.20, 'rgba(255,145,224,1.0)');
		gradient.addColorStop(0.60, 'rgba(239,19,176,1.0)');
		gradient.addColorStop(0.80, 'rgba(62,10,10,1.0)');
	}
	gradient.addColorStop(1, 'rgba(0,0,0,0.0)');
	ctx.fillStyle = gradient;
	util.fillCircle(ctx,x, y , radius);
	// Creating the eye
	ctx.fillStyle = '#000';
	if(isHead && direction)
		util.fillCircle(ctx,x+2,y, 3);
	else if(isHead && !direction)
		util.fillCircle(ctx,x-2,y, 3);
	ctx.restore();
}

function drawRocket(ctx) {

	function drawFin(ctx) {
		ctx.beginPath();
		ctx.moveTo(150,150);
		ctx.bezierCurveTo(250,150,250,250,250,250);
		ctx.bezierCurveTo(200,200,150,200,150,200);
		ctx.closePath();
		ctx.fillStyle='Red';
		ctx.fill();
		ctx.stroke();
	}

	function drawFinAt(ctx, cx, cy, scaleX, scaleY, angle) {
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(angle);
		ctx.scale(scaleX/150, scaleY/150);
		ctx.translate(-200, -200);
		drawFin(ctx);
		ctx.restore();
	}

	function drawHull(ctx) {
		ctx.beginPath();
		ctx.moveTo(150,300);
		ctx.bezierCurveTo(100,150,150,100,200,50);
		ctx.bezierCurveTo(250,100,300,150,250,300);
		ctx.closePath();
		
		var grd = ctx.createLinearGradient(200,50,200,300);
		grd.addColorStop(.2,'Red');
		grd.addColorStop(.3,'White');
		ctx.fillStyle=grd;
		ctx.fill();
		ctx.stroke();
	}

	function drawHullAt(ctx, cx, cy, scaleX, scaleY, angle) {
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(angle);
		ctx.scale(scaleX/150, scaleY/150);
		ctx.translate(-200, -200);
		drawHull(ctx);
		ctx.restore();
	}

	function drawFlame(ctx, style) {
		ctx.beginPath();
		ctx.moveTo(175,200);
		ctx.bezierCurveTo(100,150,200,100,200,50);
		ctx.bezierCurveTo(200,100,300,150,225,200);
		ctx.fillStyle=style;
		ctx.fill();
		ctx.stroke();
	}

	function drawFlameAt(ctx, cx, cy, scaleX, scaleY, angle, style) {
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(angle);
		ctx.scale(scaleX/150, scaleY/150);
		ctx.translate(-200, -200);
		drawFlame(ctx,style);
		ctx.restore();
	}

	drawFinAt(ctx,275,150,100,-100,0);
	drawFinAt(ctx,125,150,-100,-100,0);
	drawHullAt(ctx,200,240,150,-150,0);
	
	var grd = ctx.createRadialGradient(200,200,0,200,140,75);
	grd.addColorStop(0,'Yellow');
	grd.addColorStop(1,'Red');
	drawFlameAt(ctx,200,140,150,150,0,grd);
	ctx.fillStyle = 'Cyan';
	util.fillCircle(ctx,200,250,25);
	ctx.stroke();
}

function drawRocketAt(ctx, x, y, angle, scale) {
	ctx.save();
	
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale/10, scale/10);
    ctx.translate(-200, -200);
    drawRocket(ctx);
	
    ctx.restore();
}

function drawShip(ctx) {
	var shipArray = [[0,0,0,2],
                 [0,0,4],
                 [0,2,0,0,0,2],
                 [0,0,0,2],
                 [0,6],
                 [8],
                 [3,0,0,0,0,3],
                 [2,0,0,0,0,0,2]
                ];

	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			if (shipArray[j][i]) {
				util.fillBox(ctx,50*i,50*j,50*shipArray[j][i],25,'Green');
				util.fillBox(ctx,50*i,50*j+25,50*shipArray[j][i],25,'DarkGreen');
			}
		}
	}
}

function drawShipAt(ctx, x, y, scale) {
	ctx.save();
	
	var relScale = 200*.4/15;
	
    ctx.translate(x, y);
    ctx.scale(scale/relScale, scale/relScale);
    ctx.translate(-200, -200);
	
	drawShip(ctx);
	
	ctx.restore();
}

function drawMineAt(ctx, x, y, radius, innerColor) {
	ctx.save();
	
	var grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(.2, innerColor);
    grd.addColorStop(.8,'Gray');
	
    ctx.fillStyle = grd;
    util.fillCircle(ctx, x, y, radius);
	
    ctx.restore();
}

function drawPowerupAt(ctx, x, y, radius) {
	ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = entityManager.getRandomColor();
    // Make eclipse form
    ctx.translate(x, y);
    ctx.rotate(Math.PI);
    ctx.scale(radius, radius);
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
}

function drawGameOverScreen(ctx) {
	util.borderedCenteredText(ctx, g_canvas.width/2, 6*g_canvas.height/15, 'Yellow', 'Red', '80px Impact', 2, 'GAME OVER');

	util.borderedCenteredText(ctx, g_canvas.width/2, 7.5*g_canvas.height/15, 'Yellow', 'Red', '40px Impact', 1.2, 'Final score:');
	util.borderedCenteredText(ctx, g_canvas.width/2, 9*g_canvas.height/15, 'Yellow', 'Red', '60px Impact', 1.6, g_score.toLocaleString());

	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height*0.7, 'Yellow', 'Red', '30px Impact', 1, 'Level reached: ' + levelManager.getCurrentLevel());
	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height*0.75, 'Yellow', 'Red', '30px Impact', 1, 'Highest combo: ' + g_highest_combo);

	util.borderedCenteredText(ctx, g_canvas.width/2, 6*g_canvas.height/7, 'Yellow', 'Red', '30px Impact', 1, 'Press SPACE to play again!');
}

function drawGamePaused(ctx) {
	util.borderedCenteredText(ctx, g_canvas.width/2, 3*g_canvas.height/7, 'Yellow', 'Red', '80px Impact', 2, 'PAUSED');
}

function drawScrollingBackground(ctx) {	// Draws the stars
	util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, 'Black');
	particleManager.renderStars(ctx);
}

function drawScore(ctx) {
	ctx.save();
	ctx.font = '20px Impact';
	ctx.fillStyle = 'Orange';
	ctx.fillText('Score: ' + g_score, 20, g_canvas.height - 15);
	ctx.restore();
}

function drawCombo(ctx) {
	var comboTime = Math.ceil(g_combo_timer * 100 / SECS_TO_NOMINALS) / 100;
	util.centeredText(ctx, g_canvas.width/2, g_canvas.height - 15, 'Orange', '20px Impact', 'combo x' + g_combo + " (" + comboTime + "s)");
}

function drawMainMenu(ctx) {
	ctx.save();
	drawScrollingBackground(ctx);
	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height * 0.2, 'Yellow', 'Red', '60px Impact', 2, 'GRIDRUNNER');
	util.borderedCenteredText(ctx, g_canvas.width/2 , g_canvas.height * 0.5, 'Yellow', 'Red', '40px Impact', 2, 'PLAY');
	util.borderedCenteredText(ctx, g_canvas.width/2 , g_canvas.height * 0.6, 'Yellow', 'Red', '40px Impact', 2, 'HIGH SCORES');
	util.borderedCenteredText(ctx, g_canvas.width/2 , g_canvas.height * 0.7, 'Yellow', 'Red', '40px Impact', 2, 'INSTRUCTIONS');
	ctx.fillStyle = ['Turquise', 'Yellow', 'Blue', 'Green', 'Purple', 'Magenta'][Math.floor(Math.random() * 6)];
	ctx.beginPath();
	if (g_menuChoose === 0) {
    ctx.moveTo(120, 285);
    ctx.lineTo(100, 295);
    ctx.lineTo(100, 275);
	} else if (g_menuChoose === 1) {
    ctx.moveTo(80, 345);
    ctx.lineTo(60, 355);
    ctx.lineTo(60, 335);
	} else {
	ctx.moveTo(65, 405);
    ctx.lineTo(45, 415);
    ctx.lineTo(45, 395);
	}
	ctx.fill();
	ctx.restore();
}

function drawHighScores(ctx, highScores) {
	drawScrollingBackground(ctx);
	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height * 0.2, 'Yellow', 'Red', '60px Impact', 2, 'HIGHSCORE');
	if (highScores.length) {
		for (var i = 0; i < highScores.length; i++) {
			var text = (i + 1) + '. ' + highScores[i];
			util.borderedCenteredText(ctx, g_canvas.width/2, 200 + i * 50, 'Yellow', 'Red', '40px Impact', 2, text);
		}
	} else {
		util.borderedCenteredText(ctx, g_canvas.width / 2, g_canvas.height * 0.5, 'Yellow', 'Red', '40px Impact', 2, 'No scores yet');
	}
	util.borderedCenteredText(ctx, g_canvas.width / 2, g_canvas.height * 0.9, 'Yellow', 'Red', '30px Impact', 1.5, 'PRESS B TO GO BACK');

}

function drawRules(ctx) {
	drawScrollingBackground(ctx);
	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height * 0.2, 'Yellow', 'Red', '60px Impact', 2, 'INSTRUCTIONS');

	drawShipAt(ctx, 40, 165, 0.5);
	util.borderedRightAlignedText(ctx, 75, 180, 'Yellow', 'Red', '25px Impact', 1, 'Move your ship with WASD');
	drawPowerupAt(ctx, 40, 210, 10);
	util.borderedRightAlignedText(ctx, 75, 220, 'Yellow', 'Red', '25px Impact', 1, 'Catch powerups for boost!');
	util.centeredText(ctx, 40, 270, 'Orange', '30px Impact', 'x17');
	util.borderedRightAlignedText(ctx, 75, 260, 'Yellow', 'Red', '25px Impact', 1, 'Killing another enemy within');
	util.borderedRightAlignedText(ctx, 75, 285, 'Yellow', 'Red', '25px Impact', 1, '0.5s starts a COMBO');

	drawCaterpillar(ctx, 30, 340, false, Math.PI, 3);
	drawCaterpillar(ctx, 50, 340, true, Math.PI, 3);
	util.borderedRightAlignedText(ctx, 75, 350, 'Yellow', 'Red', '25px Impact', 1, 'Caterpillars give 30 points');
	drawRocketAt(ctx, 40, 370, -Math.PI/2, 1);
	util.borderedRightAlignedText(ctx, 75, 380, 'Yellow', 'Red', '25px Impact', 1, 'Rockets give 50 points');
	drawMineAt(ctx, 40, 400, 7, 'Red');
	util.borderedRightAlignedText(ctx, 75, 410, 'Yellow', 'Red', '25px Impact', 1, 'Watch out for mines!');

	util.borderedRightAlignedText(ctx, 75, 455, 'Yellow', 'Red', '20px Impact', 1, 'Pause with P');
	util.borderedRightAlignedText(ctx, 75, 475, 'Yellow', 'Red', '20px Impact', 1, 'Toggle mouse control with M');
	util.borderedRightAlignedText(ctx, 75, 495, 'Yellow', 'Red', '20px Impact', 1, 'Toggle sound with N');

	util.borderedCenteredText(ctx, g_canvas.width / 2, g_canvas.height * 0.9, 'Yellow', 'Red', '30px Impact', 1.5, 'PRESS B TO GO BACK');
}

function drawLevelCountdown(ctx) {
	util.borderedCenteredText(ctx, g_canvas.width/2, 3*g_canvas.height/7, 'Yellow', 'Red', '80px Impact', 2, 'LEVEL ' + levelManager.getCurrentLevel());
	var countdown = Math.ceil(levelManager.levelCountDown() / SECS_TO_NOMINALS);
	util.borderedCenteredText(ctx, g_canvas.width/2, 4*g_canvas.height/7, 'Yellow', 'Red', '80px Impact', 2, countdown);
}

function drawMenuButton(ctx, text) {
	
}

function drawBullet(ctx) {
	ctx.save();
	
	var grd = ctx.createRadialGradient(200,180,0,200,200,100);
	grd.addColorStop(0,'White');
	grd.addColorStop(.4,'rgb(113, 201, 55)');
	grd.addColorStop(1,'Green');

	ctx.beginPath();
	ctx.moveTo(180,200);
	ctx.arc(200,200,20,Math.PI, 0);
	ctx.lineTo(200,350);
	ctx.fillStyle = grd;
	ctx.fill();
	
	ctx.restore();
}

function drawSoundLogo(ctx) {
	ctx.save();

	var grd = ctx.createRadialGradient(g_canvas.width-20, 20,0,g_canvas.width-20, 20,10);
	grd.addColorStop(0,'Gray');
	grd.addColorStop(1, 'White');

	ctx.beginPath();
	ctx.moveTo(g_canvas.width-20, 30);
	ctx.lineTo(g_canvas.width-25, 25);
	ctx.lineTo(g_canvas.width-30, 25);
	ctx.lineTo(g_canvas.width-30, 15);
	ctx.lineTo(g_canvas.width-25, 15);
	ctx.lineTo(g_canvas.width-20, 10);
	ctx.arc(g_canvas.width-30, 20, Math.sqrt(2*10*10), -Math.PI/4, Math.PI/4);
	//ctx.lineTo(g_canvas.width-20, 30);
	ctx.fillStyle = grd;
	ctx.fill();
	ctx.strokeStyle = 'Black';
	ctx.stroke();

	ctx.strokeStyle = 'White';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(g_canvas.width-30, 20, Math.sqrt(2*12*12), -Math.PI/4 +0.10, Math.PI/4 -0.10);
	ctx.stroke();
	/*ctx.beginPath();
	ctx.arc(g_canvas.width-30, 20, Math.sqrt(2*15*15), -Math.PI/4, Math.PI/4);
	ctx.stroke();*/


	ctx.restore();
}

function drawSoundMutedLogo(ctx) {
	ctx.save();

	var grd = ctx.createRadialGradient(g_canvas.width-20, 20,0,g_canvas.width-20, 20,10);
	grd.addColorStop(0,'Gray');
	grd.addColorStop(1, 'White');

	ctx.beginPath();
	ctx.moveTo(g_canvas.width-20, 30);
	ctx.lineTo(g_canvas.width-25, 25);
	ctx.lineTo(g_canvas.width-30, 25);
	ctx.lineTo(g_canvas.width-30, 15);
	ctx.lineTo(g_canvas.width-25, 15);
	ctx.lineTo(g_canvas.width-20, 10);
	ctx.arc(g_canvas.width-30, 20, Math.sqrt(2*10*10), -Math.PI/4, Math.PI/4);
	ctx.fillStyle = grd;
	ctx.fill();
	ctx.strokeStyle = 'Black';
	ctx.stroke();

	ctx.strokeStyle = 'White';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(g_canvas.width-12, 12);
	ctx.lineTo(g_canvas.width-28, 28);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(g_canvas.width-28, 12);
	ctx.lineTo(g_canvas.width-12, 28);
	ctx.stroke();

	ctx.restore();
}