/**
 * Keyboard keys constants
 */
var KEYBOARD = {};
KEYBOARD.LMOUSE = 1;
KEYBOARD.MMOUSE = 2;
KEYBOARD.RMOUSE = 3;
KEYBOARD.ENTER = 13;
KEYBOARD.ESC = 27;
KEYBOARD.LARROW = 37;
KEYBOARD.UARROW = 38;
KEYBOARD.RARROW = 39;
KEYBOARD.DARROW = 40;
KEYBOARD.C = 67;
KEYBOARD.F12 = 123;


/**
 * UI Class
 */
class ui {
	/**
	 * Draws a message at the top of the screen
	 *
	 * @param      {string}  msg     The message to display
	 */
	static drawMessage(msg) {
		// Translation
		if((messageList[msg] !=undefined) && (messageList[msg] !="")) { msg = messageList[msg]; }
		// Draw the message
		$("#messagePanel").text(msg);
		$("#messagePanel-div").fadeIn(1000);
		setTimeout(function() { $("#messagePanel-div").fadeOut(1000); }, 1000 + 100*msg.length);	
	}
	/**
	 * Tout les événements à creer au lancement
	 */
	static load() {
		ui.buildPanel = -1; // Current opened building
		ui.buildPanelInterval = -1; // Time before next client auto update
		ui.enoughResources = -1; // Time before enought ressources

		// Panels
		ui.renaming = false;
		ui.menu = false;
		ui.map = false;
		ui.research = false;
		ui.researchChat = true;
		ui.fleet = false;
		ui.chat = true;
		ui.ranks = false;

		ui.mouseStatus = [0,0,0,0];

		$('body').on('mousedown', function(event) {
			ui.mouseStatus[event.which] = 1;
		});
		$('body').on('mouseup', function(event) {
			ui.mouseStatus[event.which] = 0;
		});

		// Chat tampon
		ui.lastMessage = "";

		// Actions au clavier
		$(document).keydown(function(e){
			ui.keydown(e);
		});

		// Settings panel
		settings.loadUI();

		//Rename planet
		$(".planet-name-text").click(function() {
			ui.planetNameSwitchToInput()
		});
		//HUD Buttons
		ui.buttonsDefine();

		// Load Research UI
		research.loadUI();

		// Load Fleet UI
		units.loadUI();

		// Load Chat UI
		chat.loadUI();

		$("#hud-ranks-close").click(function() {
			ui.closeTab("#hud-ranks");
			ui.ranks = false;
		});

		//Bonus Quotidien
		$("#day-bonus-confirm").click(function() {
			var choice = 1;
			if($("#day-bonus-2").hasClass("day-bonus-active")) {
				choice = 2;
			}
			socket.emit('daily-bonus',{user: userData, choice: choice});
			ui.closeTab("#day-bonus");
		});
		$("#day-bonus-later").click(function() {
			ui.closeTab("#day-bonus");
		});

		// Sécurité
		/*//Block Inspect Element when 
		//right click
		$(document).on("contextmenu",function(){
			return false;
		}); 
		$(document).keydown(function(e){
		//F12 => Firefox, Chrome, Edge
			if(e.which === KEYBOARD.F12){
				return false;
			}
			//CTRL + SHIFT + C => Opera
			if(e.which === KEYBOARD.C && e.ctrlKey && e.shiftKey){
				return false;
			}
		});*/
	}
	/**
	 * Tout les événements lorsqu'une touche est appuyée
	 */
	static keydown(e) {
		// Fermer une fenêtre
		if(e.which === KEYBOARD.ESC){ // Echap
			if(ui.menu) { // Priorité
				ui.closeTab("#settings-menu");
				ui.menu = false;
			} else if(ui.research==true) {
				research.closeUI();
			} else if(ui.fleet==true) {
				ui.closeTab("#hud-fleet");
				ui.fleet=false;
			} else if(ui.buildPanel!=-1) {
				ui.buildPanelHide(); // Ferme la vue du batiment
			}
		}

		// Save nom planete
		if(e.which === KEYBOARD.ENTER && ui.renaming==true){
			ui.planetNameSwitchToSpan();
		}

		// Historique chat
		if(e.which === KEYBOARD.UARROW && $("#chat_message").is(":focus")) { // Haut
			$("#chat_message").val(ui.lastMessage);
		}
		if(e.which === KEYBOARD.DARROW && $("#chat_message").is(":focus") && $("#chat_message").val()!="") { // Bas
			ui.lastMessage = $("#chat_message").val();
			$("#chat_message").val("");
		}

		// Planetes suivantes/precedente
		if(e.which === KEYBOARD.LARROW && !($("#chat_message").is(":focus"))) { // Gauche
			planet.prev()
		}
		if(e.which === KEYBOARD.RARROW && !($("#chat_message").is(":focus"))) { // Droite
			planet.next()
		}
	}
	/**
	 * Closes a tab.
	 *
	 * @param      {<type>}  tab     The tab to be closed
	 */
	static closeTab(tab,sound=true) {
		$(tab).css('display','none');
		if(sound) {
			var closeUISound = new Audio('snd/ui/wclose.mp3');
			closeUISound.volume = 0.5;
			closeUISound.play();
		}
	}
	/**
	 * Open the buildpanel.
	 *
	 * @param      {string}  id      Building ID
	 */
	static buildPanelOpen(id) {
		ui.buildPanel = id;

		if(ui.buildPanelInterval!=-1) {
			clearTimeout(ui.buildPanelInterval);
			ui.buildPanelInterval = -1;
			ui.enoughResources = -1;
		}

		 //Next level cost
		if(planetData.nextBuilding==id) { var cost = planet.getBuildCost(id,planetData.Buildings[id] + 2); } 
		else							{ var cost = planet.getBuildCost(id,planetData.Buildings[id] + 1); }

		var max = (planetData.Buildings[id]+1 > maxLevels[id]);

		/* Planet Construction Tab */
		$("#building-name").text(planetBuilding[id].name + ' ( '+planetData.Buildings[id]+' )');
		$("#building-desc").text(planetBuilding[id].desc);
		$("#building-area").css("display","block");
		$("#building-img").attr("src","img/buildings/desc/"+planetBuilding[id].id+".jpg");
		$("#building-area input").id=id;

		/* Ressources */
		var costs = [
			["building-cost-iron",cost.iron],
			["building-cost-aluminium",cost.aluminium],
			["building-cost-copper",cost.copper],
			["building-cost-titanium",cost.titanium]
		];
		for(var i=0; i<4; i++) {
			if(costs[i][1]==0 || max) {
				$("#"+costs[i][0]).css("display","none");
			} else {
				$("#"+costs[i][0]).css("display","block");
				$("#"+costs[i][0]+"-val").html(GetBetterUnit(costs[i][1],'t',planetData.resources[i+2]));

				if(planetData.resources[i+2] < costs[i][1]) {
					ui.enoughResources = 0;
				}
			}
		}
		var ratios = [
			ratio.iron,
			ratio.aluminium,
			ratio.copper,
			ratio.titanium
		];
		/* Calc max wait time */
		if(ui.enoughResources==0) {
			for(var i=0; i<4; i++) {
				if(planetData.resources[i+2] < costs[i][1]) {
					var time = ((costs[i][1] - planetData.resources[i+2])/metalBaseProd);
					if(time > ui.enoughResources) {
						ui.enoughResources = time;
					}	
				}	
			}
		}

		/* Energie */
		if(cost.energy==0 || max) {
			$("#building-cost-energy").css("display","none");
		} else {
			$("#building-cost-energy").css("display","block");
			$("#building-cost-energy-val").html(GetBetterUnit(cost.energy,"Wh (+" + GetBetterUnit(cost.energy_difference,"Wh") + ")",energyProd-energyCons));
		}
		/* Temps */
		if(max) {
			$("#building-cost-time").css("display","none");
		} else {
			$("#building-cost-time").css("display","block");
			$("#building-cost-time-val").html(getStringTime(cost.time));
		}
		/* Bouton upgrade ou message */
		// Defaut Value
		$('#building-upgrade').val(messageList["UPGRADE"]);
		$("#building-upgrade").attr("onclick","");
		$('#building-upgrade').css('display', 'none');
		$('#building-message').css('display', 'block');
		$('#building-upgrade').prop('disabled', false);

		// Edits
		if(max) { // Max Level
			$('#building-message').html(messageList["UPGRADE_MAX"]);
		} else if(planetData.nextBuilding == id && planetData.nextBuildingTime > (Date.now() + planet.deltaNow)) { // Current building in build mode
			$('#building-message').html(messageList["BUILD_FINISH_IN"] + " " + getStringTime((planetData.nextBuildingTime - (Date.now() + planet.deltaNow))/1000/3600));

			ui.buildPanelInterval = setTimeout(function() {
				ui.buildPanelOpen(id);
			},1000);
		} else if(ui.enoughResources!=-1) { // No enought Ressources
			$('#building-message').html(messageList["ENOUGH_RESOURCES_AT"] + " " + getStringTime(ui.enoughResources));

			ui.buildPanelInterval = setTimeout(function() {
				ui.buildPanelOpen(id);
			},1000);
		} else if(planetData.nextBuilding!=-1 && planetData.nextBuildingTime > (Date.now() + planet.deltaNow)) { // Another building in build mode
			$('#building-message').html(messageList["ANOTHER_IN_BUILD"]);
		} else {
			$('#building-message').css('display', 'none');
			$('#building-upgrade').css('display', 'block');
			$("#building-upgrade").attr("onclick","planet.build("+id+")");
		}
	}

	/**
	 * Hide the buildpanel
	 */
	static buildPanelHide() {
		if(ui.buildPanelInterval!=-1) {
			clearTimeout(ui.buildPanelInterval);
			ui.buildPanelInterval = -1;
			ui.enoughResources = -1;
		}

		ui.buildPanel = -1;

		ui.closeTab("#building-area");
	}

	/********** PLANET NAME **********/
	static planetNameSwitchToInput() {
		var elt = $(".planet-name-text");
		ui.oldname = elt.text();
		var $input = $("<input>", {
			val: elt.text(),
			type: "text"
		});
		$input.addClass("planet-name-text");
		elt.replaceWith($input);
		$input.on("blur", ui.planetNameSwitchToSpan);
		$input.select();

		ui.renaming = true;
	}
	static planetNameSwitchToSpan() {
		var elt = $(".planet-name-text");
		var newname = elt.val();
		var $span = $("<span>", {
			text: elt.val()
		});
		$span.addClass("planet-name-text");
		elt.replaceWith($span);
		$span.on("click", ui.planetNameSwitchToInput);
		if(ui.oldname!=newname) {
			socket.emit('planet-rename', { planet: userData.pid, username: userData.username, id: userData.id, name: elt.val() });
		}
		ui.renaming = false;
	}
	/************ BOUTONS ************/
	static buttonsDefine() {
		$("#chat-button").click(function() {
			if(ui.chat) {
				ui.closeTab("#hud-chat");
				ui.chat = false;
			} else {
				$("#hud-chat").css('display','block');
				ui.chat = true;
			}
		});
		$("#ranks-button").click(function() {
			if(ui.ranks) {
				ui.closeTab("#hud-ranks");
				ui.ranks = false;
			} else {
				$("#hud-ranks").css('display','block');
				ui.ranks = true;

				$('#hud-ranks-frame').attr('src',$('#hud-ranks-frame').attr('src'));		
			}
		});
		$("#map-button").click(function() {
			if(ui.map) {
				ui.closeTab("#hud-map",false);
				$("#research-button").css('display','block');
				ui.map = false;
			} else {
				$("#hud-map").css('display','block');
				ui.closeTab("#hud-research",false); /* A no-bug fix */
				$("#research-button").css('display','none');
				ui.map = true;
			}
		});
		$("#research-button").click(function() {
			if(ui.research) {
				research.closeUI();
			} else {
				research.openUI();
			}
		});
		$("#fleet-button").click(function() {
			if(ui.fleet) {
				ui.closeTab("#hud-fleet");
				ui.fleet = false;
			} else {
				$("#hud-fleet").css('display','block');
				ui.fleet = true;
			}
		});
	}
	/********** DAILY BONUS **********/
	static dailyBonus(streak,best) {	
		$('#day-bonus-current').html(streak);
		$('#day-bonus-best').html(best);

		// What's the bonus today ?
		streak=streak%30;
		var credits = 15;
		var helium = 0;

		$("#day-bonus-choice").css('display','none');

		if(streak==1) { credits = 15; }
		else if(streak==2) { credits = 25; }
		else if(streak==3) { credits = 50; }
		else if(streak==4) { credits = 80; }
		else if(streak<10) { credits = 100; }
		else if(streak<20) { credits = 150; helium = 500; }
		else if(streak<30) { credits = 200; helium = 2000; }
		else { credits = 500; } // @ADD: generate random special bonus
		
		var desc = "<tr><td class=\"day-bonus-active\" id=\"day-bonus-1\">" + credits + " credits galactiques</td>";

		if(helium!=0) {
			$("#day-bonus-choice").css('display','block');
			desc += "<td id=\"day-bonus-2\">" + helium + "t de Helium 3</td>";
		}

		desc+= "</tr>";

		$('#day-bonus-desc').html(desc);
		$('#day-bonus').css('display','block');

		$('#day-bonus-desc td').click(function() {
			$("#day-bonus-desc .day-bonus-active").removeClass("day-bonus-active"); //Retirer les classes actives
			$(this).addClass("day-bonus-active"); // Activer l'onglet cliqué
		});
	}
}

$(document).ready( function() {
	ui.load();
});