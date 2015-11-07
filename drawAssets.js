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

function drawSideEnemy(ctx, x, y) {
	var width = 40;
	var height = 30;
	y = y - height / 4 - 1;

	util.fillBox(ctx, x, y, 20, 2, 'Yellow');
	util.fillBox(ctx, x, y + height / 2, 20, 2, 'Yellow');

	util.fillBox(ctx, x + width * 0.3, y, 3, 6, 'Yellow');
	util.fillBox(ctx, x + width * 0.3, y + height / 3, 3, 6, 'Yellow');

	util.fillBox(ctx, x + width * 0.45, y + height * 0.125, 3, 10, 'Yellow');
	util.fillBox(ctx, x + width * 0.45, y + height * 0.25 -1 , 12, 4, 'Yellow');
}

function drawUpEnemy(ctx, x, y) {
	var width = 30;
	var height = 40;
	x = x - width / 4 - 1;

	util.fillBox(ctx, x, y, 2, 20, 'Yellow');
	util.fillBox(ctx, x + width / 2, y, 2, 20, 'Yellow');

	util.fillBox(ctx, x, y + height * 0.3, 6, 3, 'Yellow');
	util.fillBox(ctx, x + width / 3, y + height * 0.3, 6, 3, 'Yellow');

	util.fillBox(ctx, x + width * 0.125, y + height * 0.45, 10, 3, 'Yellow');
	util.fillBox(ctx, x + width * 0.25 - 1, y + height * 0.45 , 4, 12, 'Yellow');
}

function drawCircleEnemy(ctx, x, y) {
	var radius = 10;
	// height 30
	ctx.fillStyle = 'Orange';
	util.fillCircle(ctx,x,y, radius);
}

function drawGameOverScreen(ctx) {
	util.borderedCenteredText(ctx, g_canvas.width/2, 3*g_canvas.height/7, 'Yellow', 'Red', '80px Impact', 2, 'GAME OVER');
	util.borderedCenteredText(ctx, g_canvas.width/2, 8.5*g_canvas.height/15, 'Yellow', 'Red', '40px Impact', 1.2, 'Final score:');
	// TODO insert score?
	util.borderedCenteredText(ctx, g_canvas.width/2, 10*g_canvas.height/15, 'Yellow', 'Red', '60px Impact', 1.6, '1.000.000.000');
}

function drawScrollingBackground(ctx) {	// Draws the stars
	util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, 'Black');
	particleManager.renderStars(ctx);
}

function drawMenuBackground(ctx) {
	
}

function drawMenuButton(ctx, text) {
	
}