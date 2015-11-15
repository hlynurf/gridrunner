function drawBackground(ctx) {	// Draws the grid
	// util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, 'Black');
	var boxSize = 20;
	var vertLines = g_canvas.width / boxSize;
	var horLines = g_canvas.height / boxSize;
	for (var i = 1; i < vertLines; i++) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(boxSize * i, boxSize);
		ctx.lineTo(boxSize * i, g_canvas.height - 2*boxSize);
		ctx.strokeStyle = 'Red';
		ctx.stroke();
		
		ctx.restore();
	}
	for (var i = 1; i < horLines - 1; i++) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(boxSize, boxSize * i);
		ctx.lineTo(g_canvas.width-boxSize, boxSize * i);
		ctx.strokeStyle = 'Red';
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

function drawGameOverScreen(ctx) {
	util.borderedCenteredText(ctx, g_canvas.width/2, 6*g_canvas.height/15, 'Yellow', 'Red', '80px Impact', 2, 'GAME OVER');

	util.borderedCenteredText(ctx, g_canvas.width/2, 7.5*g_canvas.height/15, 'Yellow', 'Red', '40px Impact', 1.2, 'Final score:');
	util.borderedCenteredText(ctx, g_canvas.width/2, 9*g_canvas.height/15, 'Yellow', 'Red', '60px Impact', 1.6, g_score.toLocaleString());

	util.borderedCenteredText(ctx, g_canvas.width/2, 11*g_canvas.height/15, 'Yellow', 'Red', '30px Impact', 1, 'Highest combo: ' + g_highest_combo);

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
	util.centeredText(ctx, g_canvas.width/2, g_canvas.height - 15, 'Orange', '20px Impact', 'combo x' + g_combo);
}

function drawMainMenu(ctx) {
	ctx.save();
	drawScrollingBackground(ctx);
	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height * 0.2, 'Yellow', 'Red', '60px Impact', 2, 'GRIDRUNNER');
	util.borderedCenteredText(ctx, g_canvas.width/2 , g_canvas.height * 0.5, 'Yellow', 'Red', '40px Impact', 2, 'PLAY');
	util.borderedCenteredText(ctx, g_canvas.width/2 , g_canvas.height * 0.6, 'Yellow', 'Red', '40px Impact', 2, 'HIGH SCORES');
	ctx.fillStyle = ['Turquise', 'Yellow', 'Blue', 'Green', 'Purple', 'Magenta'][Math.floor(Math.random() * 6)];
	ctx.beginPath();
	if (g_menuChoose === 0) {
    ctx.moveTo(120, 285);
    ctx.lineTo(100, 295);
    ctx.lineTo(100, 275);
	} else {
    ctx.moveTo(80, 345);
    ctx.lineTo(60, 355);
    ctx.lineTo(60, 335);
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
	util.borderedCenteredText(ctx, g_canvas.width / 2, g_canvas.height * 0.9, 'Yellow', 'Red', '30px Impact', 2, 'PRESS B TO GO BACK');

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