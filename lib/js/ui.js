/**********************************
			   GENERAL
***********************************/
function drawMessage(message) {
	$("#messagePanel").text(message);
	$("#messagePanel").fadeIn(1000);
	setTimeout(function() { $("#messagePanel").fadeOut(1000); }, 300*message.length);	
}

var ui = {
	menu: false,
	buildPanel: -1,
	renaming: false,
	map: false,
	research: false,
	moves: false,
	chat: true
}

$(document).ready( function() { //Multiple windows
	$("#hud-settings").click(function () {
		if(ui.menu) {
			HideMenu();
		} else {
			ShowMenu();
		}
	});
	$("#close-settings-tabs").click(function () {
		$("#settings-menu").css('display','none');
			HideMenu();
	});
});

$(document).keydown(function(e){
	// Echap
	if(e.which === 27){
		if(ui.menu) { // Priorité
			HideMenu();
		} else if(ui.buildPanel!=-1) {
			HideBuildPanel(); // Ferme la vue du batiment
		}
	}
});

/**********************************
			  PLANET VIEW
***********************************/
function OpenBuildingPanel(id) {
	var maxLevels = [
		20,  // Carriere
		25,  // Metallurgie
		25,  // Habitations
		25,  // Serres
		30,  // Centrales Solaires
		25,  // Entrepôts
		25,  // Reservoir
		35,  // Centre de lancement
		30   // Centre de recherches
	];

	ui.buildPanel = id;

	if(planetData.nextBuilding==id && planetData.nextBuildingTime < Date.now()) {
		var cost = planet.getBuildCost(id,planetData.groundBuilding[id] + 2); //Next level cost
	} else {
		var cost = planet.getBuildCost(id,planetData.groundBuilding[id] + 1); //Next level cost
	}

	var max = planetData.groundBuilding[id]+1 > maxLevels[id];

	/* Planet Construction Tab */
	$("#building-name").text(planetBuilding[id].name + ' ( '+planetData.groundBuilding[id]+' )');
	$("#building-desc").text(planetBuilding[id].desc);
	$("#building-area").css("display","block");
	$("#building-img").attr("src","img/building/"+planetBuilding[id].id+".jpg");
	$("#building-area input").id=id;

	if(cost.iron==0 || max) {
		$("#building-cost-iron").css("display","none");
	} else {
		$("#building-cost-iron").css("display","block");
		$("#building-cost-iron-val").text(cost.iron);
	}
	if(cost.aluminium==0 || max) {
		$("#building-cost-aluminium").css("display","none");
	} else {
		$("#building-cost-aluminium").css("display","block");
		$("#building-cost-aluminium-val").text(cost.aluminium);
	}
	if(cost.copper==0 || max) {
		$("#building-cost-copper").css("display","none");
	} else {
		$("#building-cost-copper").css("display","block");
		$("#building-cost-copper-val").text(cost.copper);
	}
	if(cost.titanium==0 || max) {
		$("#building-cost-titanium").css("display","none");
	} else {
		$("#building-cost-titanium").css("display","block");
		$("#building-cost-titanium-val").text(cost.titanium);
	}
	if(cost.energy==0 || max) {
		$("#building-cost-energy").css("display","none");
	} else {
		$("#building-cost-energy").css("display","block");
		$("#building-cost-energy-val").text(GetBetterUnit(cost.energy)+"Wh (+"+GetBetterUnit(cost.energy_difference)+"Wh)");
	}
	if(max) {
		$("#building-cost-time").css("display","none");
	} else {
		$("#building-cost-time").css("display","block");
		$("#building-cost-time-val").text(getStringTime(cost.time));
	}

	if(max) {
		$('#building-upgrade').prop('disabled', true);
	} else {
		$('#building-upgrade').prop('disabled', false);
		$("#building-upgrade").attr("onclick","planet.build("+id+")");
	}
}

function HideBuildPanel() {
	ui.buildPanel = -1;
	$("#building-area").css("display","none");
	var closeUISound = new Audio('snd/ui/wclose.mp3');
	closeUISound.play();
}

function ShowMenu() {
	$("#settings-menu").css('display','block'); //Ferme le menu
	ui.menu = true;
}

function HideMenu() {
	$("#settings-menu").css('display','none'); //Ferme le menu
	ui.menu = false;
	var closeUISound = new Audio('snd/ui/wclose.mp3');
	closeUISound.play();
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

	    ui.renaming = true;
	};
	var switchToSpan = function () {
		var elt = $(".planet-name-text");
	    var $span = $("<span>", {
	        text: elt.val()
	    });
	    $span.addClass("planet-name-text");
	    elt.replaceWith($span);
	    $span.on("click", switchToInput);
	    socket.emit('planet-new-name', { planet: userData.pid, username: userData.username, id: userData.id, name: elt.val() });

	    ui.renaming = false;
	}

	$(document).keydown(function(e){
		if(e.which === 13 && ui.renaming==true){
			switchToSpan();
		}
	});

	$(".planet-name-text").on("click", switchToInput);
});

/* Buttons */
$(document).ready( function() {
	$("#chat-button").click(function() {
		if(ui.chat) {
			$("#hud-chat").css('display','none');
			ui.chat = false;
		} else {
			$("#hud-chat").css('display','block');
			ui.chat = true;
		}
	});
	$("#map-button").click(function() {
		if(ui.map) {
			$("#hud-map").css('display','none');
			$("#research-button").css('display','block');
			ui.map = false;
		} else {
			$("#hud-map").css('display','block');
			$("#research-button").css('display','none');
			$("#hud-research").css('display','none'); /* A no-bug fix */
			ui.map = true;
		}
	});
	$("#research-button").click(function() {
		if(ui.research) {
			$("#hud-research").css('display','none');
			ui.research = false;
		} else {
			$("#hud-research").css('display','block');
			ui.research = true;
		}
	});
	$("#moves-button").click(function() {
		if(ui.moves) {
			$("#hud-moves").css('display','none');
			ui.moves = false;
		} else {
			$("#hud-moves").css('display','block');
			ui.moves = true;
		}
	});
});