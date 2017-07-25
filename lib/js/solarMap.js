var stars = new Array();
var planets = new Array();

$(window).load(function() {
	InitialLoadCanvas();
});

function CanvasCalcAngle(i) {
	var time = new Date();

	return i*0.67*Math.PI //Decalage
		 + (2*Math.PI)/(60/(14-2.5*i))*time.getMinutes()
		 + (2*Math.PI)/(60*60/(14-2.5*i))*time.getSeconds()
		 + (2*Math.PI)/(60*1000*60/(14-2.5*i))*time.getMilliseconds();
}

function InitialLoadCanvas() {
	picloaded = 0;

	//Planets & Orbits
	planetsTypes = new Array();
	planetsTypes[0] = 2;
	planetsTypes[1] = 1;
	planetsTypes[2] = 1;
	planetsTypes[3] = 3;

	//Star(s)
	starTypes = new Array();
	starTypes[0] = 1;

	for(var i=0; i<planetsTypes.length; i++) {
		var sun_dist = i*150;
		planets[i] = new Array();
		planets[i]["image"] = new Image();
		planets[i]["image"].src = "img/map/planets/"+planetsTypes[i]+'.png';
		planets[i]["image"].onload = PicLoaded();
		planets[i].i = i;
		planets[i].angle = CanvasCalcAngle(i);
		planets[i].x = 960 - 37.5 + (400+sun_dist)*Math.cos(planets[i].angle);
		planets[i].y = 350 - 37.5 + (400+sun_dist)/6 + (400+sun_dist)/2*Math.sin(planets[i].angle);
	}

	for(var i=0; i<starTypes.length; i++) {
		stars[i] = new Array();
		stars[i]["image"] = new Image();
		stars[i]["image"].src = "img/map/stars/"+starTypes[i]+'.png';
		stars[i]["image"].onload = PicLoaded();
	}
}

function PicLoaded() {
	picloaded++;
	if(picloaded>=(starTypes.length+planetsTypes.length)) { //Begin Animation ONLY when all pictures are loaded
		window.requestAnimationFrame(DrawAndAnimate);
	}
}

function DrawAndAnimate() {
	var ctx = document.getElementById("map").getContext("2d");

	ctx.clearRect(0,0,1920,940); //Vider le Canvas

	for(var i=0; i<planetsTypes.length; i++) {
		var sun_dist = planets[i].i*150;

		//Orbits
		CanvasOval(ctx,960-(400+sun_dist),350-(400+sun_dist)/3,2*(400+sun_dist),400+sun_dist);

		//Planet + Anim
		planets[i].oldx = planets[i].x;
		planets[i].oldy = planets[i].y;
		planets[i].angle = CanvasCalcAngle(i);
		planets[i].x = 960 - 37.5 + (400+sun_dist)*Math.cos(planets[i].angle);
		planets[i].y = 350 - 37.5 + (400+sun_dist)/6 + (400+sun_dist)/2*Math.sin(planets[i].angle);
		ctx.save();
		ctx.translate(planets[i].x-planets[i].oldx,planets[i].y-planets[i].oldy);
		ctx.drawImage(planets[i]["image"],planets[i].x,planets[i].y,75,75);
		ctx.restore();
	}

	for(var i=0; i<starTypes.length; i++) {
		ctx.drawImage(stars[i]["image"],810,200,300,300);
	}

  	window.requestAnimationFrame(DrawAndAnimate);
}


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