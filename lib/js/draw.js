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
$(window).load(function() {
	InitialLoadCanvas();
})

function InitialLoadCanvas() {
	//Planets
	var planetsTypes = new Array();
	planetsTypes[0] = 1;
	LoadPlanets(planetsTypes);

	//Star(s)
	var starTypes = new Array();
	starTypes[0] = 1;
	LoadStars(starTypes);
}

function LoadPlanets(types) {
	var canvas = document.getElementById("map");
	var ctx = canvas.getContext("2d");
	//Planets

	//Orbits
	CanvasOval(ctx,560,340,800,400);
	CanvasOval(ctx,410,290,1100,550);
}

function LoadStars(types) {
	console.log("stars");
	var canvas = document.getElementById("map");
	ctx = canvas.getContext("2d");
	//Stars
	for(var i=0; i<types.length; i++) {
		CanvasDrawStar(ctx,i,types[i],[810,390],[300,300]);
	}
	
}