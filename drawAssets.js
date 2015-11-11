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

function drawCaterpillarHead(ctx, x, y) {
	ctx.save();
	var radius = 10;
	ctx.fillStyle = 'Orange';
	util.fillCircle(ctx,x,y, radius);
	ctx.fillStyle = '#000';
	util.fillCircle(ctx,x-2,y+2, 3);
	ctx.restore();
}
function drawCaterpillar(ctx, x, y) {
	ctx.save();
	var radius = 10;
	ctx.fillStyle = 'Orange';
	util.fillCircle(ctx,x,y, radius);
	 ctx.strokeStyle = '#000';
    ctx.stroke();
	ctx.restore();
}
function drawBulletPowerup(ctx, x, y){
	ctx.save();
	var radius = 5;
	ctx.fillStyle = 'Purple';
	util.fillCircle(ctx,x,y, radius);
	ctx.strokeStyle = '#fff';
    ctx.stroke();
	ctx.restore();
}
function drawShipPowerup(ctx, x, y){
	ctx.save();
	var radius = 5;
	ctx.fillStyle = 'Yellow';
	util.fillCircle(ctx,x,y, radius);
	ctx.strokeStyle = '#fff';
    ctx.stroke();
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
	util.borderedCenteredText(ctx, g_canvas.width/2, g_canvas.height * 0.45, 'Yellow', 'Red', '60px Impact', 2, 'GRIDRUNNER');
	util.borderedCenteredText(ctx, g_canvas.width/2 , g_canvas.height * 0.6, 'Yellow', 'Red', '30px Impact', 2, 'Click SPACE to PLAY');
}

function drawMenuButton(ctx, text) {
	
}