function drawBackground(ctx) {
	util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, 'Black');
	var boxSize = 20;
	var vertLines = g_canvas.width / boxSize;
	var horLines = g_canvas.height / boxSize;
	for (var i = 2; i < vertLines - 1; i++) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(boxSize * i, 40);
		ctx.lineTo(boxSize * i, g_canvas.height);
		ctx.strokeStyle = 'Red';
		ctx.stroke();
		
		ctx.restore();
	}
	for (var i = 2; i < horLines; i++) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(40, boxSize * i);
		ctx.lineTo(g_canvas.width - 40, boxSize * i);
		ctx.strokeStyle = 'Red';
		ctx.stroke();
		
		ctx.restore();
	}
	
}

function drawSideEnemy(ctx, x, y) {
	var width = 40;
	var height = 30;
	y = y - height / 4 - 1;
	// height 30
	util.fillBox(ctx, x, y, 20, 2, 'Purple');
	util.fillBox(ctx, x, y + height / 2, 20, 2, 'Purple');

	util.fillBox(ctx, x + width * 0.3, y, 3, 6, 'Purple');
	util.fillBox(ctx, x + width * 0.3, y + height / 3, 3, 6, 'Purple');

	util.fillBox(ctx, x + width * 0.45, y + height * 0.125, 3, 10, 'Purple');
	util.fillBox(ctx, x + width * 0.45, y + height * 0.25 , 12, 3, 'Purple');
}