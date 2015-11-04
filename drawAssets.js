function drawBackground(ctx) {
	util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, 'Black');
	var boxSize = 20;
	var vertLines = g_canvas.width / boxSize;
	var horLines = g_canvas.height / boxSize;
	for (var i = 0; i < vertLines; i++) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(boxSize * i, 0);
		ctx.lineTo(boxSize * i, g_canvas.height);
		ctx.strokeStyle = 'Red';
		ctx.stroke();
		
		ctx.restore();
	}
	for (var i = 0; i < horLines; i++) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(0, boxSize * i);
		ctx.lineTo(g_canvas.width, boxSize * i);
		ctx.strokeStyle = 'Red';
		ctx.stroke();
		
		ctx.restore();
	}
	
}