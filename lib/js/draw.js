/**********************************
			   GENERAL
***********************************/
function drawMessage(message) {
	$("#messagePanel").text(message);
	$("#messagePanel").fadeIn(1500);
	setTimeout(function() { $("#messagePanel").fadeOut(1500); }, 3000);	
}

$(document).ready( function() { //Multiple windows
	$("#hud-solar-system").click(function () {
		$("#planet-content").css('display','none');
		$("#system-map").css('display','block');
	});

	$("#hud-system-back").click(function () {
		$("#planet-content").css('display','block');
		$("#system-map").css('display','none');
	});
});

/**********************************
				CHAT
***********************************/
$(document).ready(function(){	//Lorsque la page est chargée ...
	$("a.chatTab").click(function () {	//Lorsqu'un lien est cliqué ...
		$(".chatActive").removeClass("chatActive"); //Retirer les classes actives
		$(this).addClass("chatActive"); // Activer l'onglet cliqué
		$(".chatContent").hide(); // Cacher les boîtes de contenu
		chatChannel = $(this).attr("title");
		$("#" + chatChannel).show(); // Afficher la boite actuelle
	});
});

/**********************************
			   LOADING
***********************************/
function CloseLoadingOverlay() {
	$('#loading-overlay').remove(); //Remove the overlay
}

/**********************************
			  PLANET VIEW
***********************************/
function UpgradePlanetBuilding(id) {
	socket.emit('ask-build-ground', { planet: planetContent._id,user: userData.id, RandomToken: userData.RandomToken, building: id });
}

function refreshPlanetInfos(resourcesEnable,miscEnable) {

	$('#loading-overlay-desc').text('Building interface ...');

	if(miscEnable) {
		$('#hud-username').text(userData.name);

		//Planet name
		$('#hud-planet-name span').text(planetContent.name);

		//Page Title
		document.title = userData.name + " - " + planetContent.name;

		//Set background
		$('#planet-content').css('backgroundImage','url(../../img/planets/'+planetContent.planetType+'.jpg)');

		//Set Build Tabs Background
		$('.build-tab-background').attr("src",'../../img/building-tabs/'+planetContent.planetType+'.png');
	}

	if(resourcesEnable) {
		var ratio = GetMineralsRatio(planetContent.planetType);

		//Top left
		$('#population_nmb').text(GetBetterUnit(Math.round(3242*Math.exp(0.3608*planetContent.groundBuilding[4]))));
		$('#research_nmb').text(GetBetterUnit(Math.round(1.96*Math.exp(0.2295*planetContent.groundBuilding[8]))));
		$('#moral_nmb').text(50+'%');
		$('#electricity_nmb').text(GetBetterUnit(Math.round(1053*Math.exp(0.4056*planetContent.groundBuilding[6])))+'Wh');

		//Top right
		$('#minerals_nmb').text(GetBetterUnit(planetContent.resources[0]-(((planetContent.groundBuilding[0]*300)+100)/360))+'t');
		$('#petrol_nmb').text(GetBetterUnit(planetContent.resources[1]-(((planetContent.groundBuilding[1]*300)+100)/360))+'L');
		$('#gas_nmb').text(GetBetterUnit(planetContent.resources[2]-(((planetContent.groundBuilding[2]*300)+100)/360))+'L');
		$('#iron_nmb').text(GetBetterUnit(planetContent.resources[3]-(((planetContent.groundBuilding[3]*300)+100)/360)*eval(ratio.ironRatio))+'t');
		$('#aluminium_nmb').text(GetBetterUnit(planetContent.resources[4]-(((planetContent.groundBuilding[3]*300)+100)/360)*eval(ratio.aluRatio))+'t');
		$('#copper_nmb').text(GetBetterUnit(planetContent.resources[5]-(((planetContent.groundBuilding[3]*300)+100)/360)*eval(ratio.copperRatio))+'t');
		$('#titanium_nmb').text(GetBetterUnit(planetContent.resources[6]-(((planetContent.groundBuilding[3]*300)+100)/360)*eval(ratio.titanRatio))+'t');
	}
}

function OpenBuildingPanel(id) {
	var cost = GetBuildCost(id,planetContent.groundBuilding[id]+1); //Next level cost

	/* Planet Construction Tab */
	$("#building-name").text(planetBuilding[id].name);
	$("#building-desc").text(planetBuilding[id].desc);
	$("#building-area").css("display","block");
	$("#building-img").attr("src","../../img/building/"+planetBuilding[id].id+".jpg");
	$("#building-area input").id=id;
	$("#building-cost-iron").text(cost.iron);
	$("#building-cost-aluminium").text(cost.aluminium);
	$("#building-cost-copper").text(cost.copper);
	$("#building-cost-titanium").text(cost.titanium);
	$("#building-cost-energy").text(cost.energy+" (+"+cost.energy_difference+")");
	$("#building-cost-time").text(cost.time);
	$("#building-upgrade").attr("onclick","UpgradePlanetBuilding("+id+")")
}

//Editable Title
$(document).ready( function() {
	var switchToInput = function () {
	    var $input = $("<input>", {
	        val: $(this).text(),
	        type: "text"
	    });
	    $input.addClass("planet-name-text");
	    $(this).replaceWith($input);
	    $input.on("blur", switchToSpan);
	    $input.select();
	};
	var switchToSpan = function () {
	    var $span = $("<span>", {
	        text: $(this).val()
	    });
	    $span.addClass("planet-name-text");
	    $(this).replaceWith($span);
	    $span.on("click", switchToInput);
	}
	$(".planet-name-text").on("click", switchToInput);
});

function HideBuildPanel() {
	$("#building-area").css("display","none");
}

/**********************************
				MAP
***********************************/
var stars = new Array();
var planets = new Array();

$(window).load(function() {
	InitialLoadCanvas();
});

function InitialLoadCanvas() {
	picloaded = 0;

	//Planets & Orbits
	planetsTypes = new Array();
	planetsTypes[0] = 1;
	planetsTypes[1] = 1;

	//Star(s)
	starTypes = new Array();
	starTypes[0] = 1;

	for(var i=0; i<planetsTypes.length; i++) {
		var sun_dist = i*150;
		planets[i] = new Array();
		planets[i]["image"] = new Image();
		planets[i]["image"].src = "img/stars/"+planetsTypes[i]+'.png';
		planets[i].i = i;
		planets[i].angle = i*Math.PI*0.57556554455;
		planets[i].x = 960 - 37.5 + (400+sun_dist)*Math.cos(planets[i].angle);
		planets[i].y = 350 - 37.5 + (400+sun_dist)/6 + (400+sun_dist)/2*Math.sin(planets[i].angle);
		planets[i]["image"].onload = PicLoaded();
	}

	for(var i=0; i<starTypes.length; i++) {
		stars[i] = new Array();
		stars[i]["image"] = new Image();
		stars[i]["image"].src = "img/stars/"+starTypes[i]+'.png';
		stars[i]["image"].onload = PicLoaded();
	}
}

function PicLoaded() {
	picloaded++;
	if(picloaded>=(starTypes.length+planetsTypes.length)) {
		window.requestAnimationFrame(DrawAndAnimate);
	}
}

function DrawAndAnimate() {
	var ctx = document.getElementById("map").getContext("2d");

	ctx.clearRect(0,0,1920,940); // effacer le canvas

	for(var i=0; i<planetsTypes.length; i++) {
		var sun_dist = planets[i].i*150;

		//Orbits
		CanvasOval(ctx,960-(400+sun_dist),350-(400+sun_dist)/3,2*(400+sun_dist),400+sun_dist);

		//Planet + Anim
		var time = new Date();
		planets[i].oldx = planets[i].x;
		planets[i].oldy = planets[i].y;
		planets[i].angle = ((2*Math.PI)/(10*(i+1)))*time.getMinutes()*10 + ((2*Math.PI)/(10*60*(i+1)))*time.getSeconds()*10+ ((2*Math.PI)/(10*1000*60*(i+1)))*time.getMilliseconds()*10;
		planets[i].x = 960 - 37.5 + (400+sun_dist)*Math.cos(planets[i].angle);
		planets[i].y = 350 - 37.5 + (400+sun_dist)/6 + (400+sun_dist)/2*Math.sin(planets[i].angle);
		ctx.save();
		ctx.translate(planets[i].x-planets[i].oldx,planets[i].y-planets[i].oldy);
		ctx.drawImage(planets[i]["image"],planets[i].x,planets[i].y,75,75);
		ctx.restore();
		var sun_dist = i*150;
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