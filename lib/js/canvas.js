var stars = new Array();
var planets = new Array();

function CanvasOval(ctx, x, y, w, h) {
	ctx.lineWidth="1";
	ctx.strokeStyle="#CCCCCC";
	var kappa = .5522848,
		ox = (w / 2) * kappa, // control point offset horizontal
		oy = (h / 2) * kappa, // control point offset vertical
		xe = x + w,           // x-end
		ye = y + h,           // y-end
		xm = x + w / 2,       // x-middle
		ym = y + h / 2;       // y-middle
	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	//ctx.closePath(); // not used correctly, see comments (use to close off open path)
	ctx.stroke();
}

function CanvasDrawStar(ctx,i,type,pos,size) {
	stars[i] = new Array;
	stars[i] = new Image();
	stars[i].src = "img/stars/"+type+'.png';

	stars[i].onload = function() {
		ctx.drawImage(stars[i],pos[0],pos[1],size[0],size[1]);
	}
}