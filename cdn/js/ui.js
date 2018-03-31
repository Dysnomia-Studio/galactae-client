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
		if(msg === undefined) { return; }
		if((translate["messages"][msg] !=undefined) && (translate["messages"][msg] !="")) { msg = translate["messages"][msg]; }
		// Draw the message
		$("#messagePanel").text(msg);
		$("#messagePanel").fadeIn(1000);
		setTimeout(function() { $("#messagePanel").fadeOut(1000); }, 1000 + 100*msg.length);	
	}
	/**
	 * Tout les événements à creer au lancement
	 */
	static load() {
		planet.init();

		ui.updateBottom();

		// Panels
		ui.renaming = false;
		ui.menu = false;
		ui.map = false;
		ui.research = false;
		ui.researchChat = false;
		ui.fleet = false;
		ui.chat = ($('#hud-chat').css('display')=="block");
		ui.ranks = false;
		ui.news = false;
		ui.bonusStreak = 0;
		ui.bonusStreakBest = 0;

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
		$("#hud-planet-name").click(function() {
			ui.planetNameSwitchToInput()
		});
		//HUD Buttons
		ui.hudBottomButtons();

		$(window).resize(function() {
			ui.loadHUDButtons();
		});

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

		$("#hud-news-close").click(function() {
			ui.closeTab("#hud-news");
			ui.news = false;
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

		// Ranks
		$(".ranks-ul li").click(function() {
			$(".ranks-ul .ul-choice-line-li-active").removeClass("ul-choice-line-li-active"); //Retirer les classes actives
			$(this).addClass("ul-choice-line-li-active"); // Activer l'onglet cliqué

			$('#hud-ranks-frame').attr("src", "ranks.php?type=" + $(this).attr("choice"));
		});

		// Sécurité
		//Block Inspect Element when 
		//right click
		/*$(document).on("contextmenu",function(){
			return false;
		}); */
		$(document).keydown(function(e){
		//F12 => Firefox, Chrome, Edge
			if(e.which === KEYBOARD.F12){
				return false;
			}
			//CTRL + SHIFT + C => Opera
			if(e.which === KEYBOARD.C && e.ctrlKey && e.shiftKey){
				return false;
			}
		});
	}

	static loadHUDButtons() {
		// HUD Top right
		$('#hud-top-right-moveLeft').click(function() {
			var scroll = $('#hud-top-right').scrollLeft();
			scroll -= 20;
			if(scroll<0) { scroll=0; }
			$('#hud-top-right').scrollLeft(scroll);
		});

		$('#hud-top-right-moveRight').click(function() {
			var scroll = $('#hud-top-right').scrollLeft();
			scroll += 20;
			if(scroll>$('#hud-top-right').width()) { scroll=$('#hud-top-right').width(); }
			$('#hud-top-right').scrollLeft(scroll);
		});
		// HUD Top left
		$('#hud-top-left-moveLeft').click(function() {
			var scroll = $('#hud-top-left').scrollLeft();
			scroll -= 20;
			if(scroll<0) { scroll=0; }
			$('#hud-top-left').scrollLeft(scroll);
		});

		$('#hud-top-left-moveRight').click(function() {
			var scroll = $('#hud-top-left').scrollLeft();
			scroll += 20;
			if(scroll>$('#hud-top-left').width()) { scroll=$('#hud-top-left').width(); }
			$('#hud-top-left').scrollLeft(scroll);
		});

		// Display none if needed	
		if(document.getElementById('hud-top-left').scrollWidth
			<= Math.round($('#hud-top-left').width())) {
			$('#hud-top-left-moveRight').css('display','none');
			$('#hud-top-left-moveLeft').css('display','none');
		} else {
			$('#hud-top-left-moveRight').css('display','block');
			$('#hud-top-left-moveLeft').css('display','block');
		}

		if(document.getElementById('hud-top-right').scrollWidth
			<= Math.round($('#hud-top-right').width())) {
			$('#hud-top-right-moveRight').css('display','none');
			$('#hud-top-right-moveLeft').css('display','none');
		} else {
			$('#hud-top-right-moveRight').css('display','block');
			$('#hud-top-right-moveLeft').css('display','block');
		}
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
			} else if(ui.fleet==true && !preventFleetHUDClosing) {
				ui.closeTab("#hud-fleet");
				ui.fleet= false;
			} else if(ui.ranks==true) {
				ui.closeTab("#hud-ranks")
				ui.ranks = false;
			} else if(ui.map==true) {
				if(map.currentMap == "" || map.currentMap == "global") {
					map.closeTab();
				} else {
					map.openGlobalMap(map.currentAddress);
				}
				
			} else if(planet.buildPanel!=-1) {
				planet.buildPanelHide(); // Ferme la vue du batiment
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
			var closeUISound = new Audio(cdnURL+'snd/ui/wclose.mp3');
			closeUISound.volume = 0.5;
			closeUISound.play();
		}

		ui.updateBottom();
	}

	static updateBottom() {
		// Map
		if($('#hud-map').css('display') == "block") {
			$('#hud-bottom-button-map').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-map').removeClass('hud-bottom-active');
		}
		// Research
		if($('#hud-research').css('display') == "block") {
			$('#hud-bottom-button-researchs').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-researchs').removeClass('hud-bottom-active');
		}
		// Fleet build
		if($('#hud-fleet').css('display') == "block" && $("#fleet-build").css('display') == "block") {
			$('#hud-bottom-button-units').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-units').removeClass('hud-bottom-active');
		}
		// Fleet orbit
		if($('#hud-fleet').css('display') == "block" && $("#fleet-orbit").css('display') == "block") {
			$('#hud-bottom-button-fleets').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-fleets').removeClass('hud-bottom-active');
		}
		// Fleet move
		if($('#hud-fleet').css('display') == "block" && $("#fleet-move").css('display') == "block") {
			$('#hud-bottom-button-radar').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-radar').removeClass('hud-bottom-active');
		}
		// Ranks
		if($("#hud-ranks").css('display') == "block") {
			$('#hud-bottom-button-ranks').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-ranks').removeClass('hud-bottom-active');
		}
		// Chat
		if($("#hud-chat").css('display') == "block") {
			$('#hud-bottom-button-chat').addClass('hud-bottom-active');
		} else {
			$('#hud-bottom-button-chat').removeClass('hud-bottom-active');
		}
	}

	/********** PLANET NAME **********/
	static planetNameSwitchToInput() {
		var elt = $("#hud-planet-name");
		ui.oldname = elt.text();
		var $input = $("<input>", {
			val: elt.text(),
			type: "text",
			id: "hud-planet-name"
		});
		elt.replaceWith($input);
		$input.on("blur", ui.planetNameSwitchToSpan);
		$input.select();

		ui.renaming = true;
	}
	static planetNameSwitchToSpan() {
		var elt = $("#hud-planet-name");
		var newname = elt.val();
		var $span = $("<span>", {
			text: elt.val(),
			id: "hud-planet-name"
		});;
		elt.replaceWith($span);
		$span.on("click", ui.planetNameSwitchToInput);
		if(ui.oldname!=newname) {
			newname = normalizeText(newname);
			socket.emit('planet-rename', { planet: userData.pid, username: userData.username, id: userData.id, name: elt.val() });
		}
		ui.renaming = false;
	}
	/************ BOUTONS ************/
	static hudBottomButtons() {
		$("#hud-bottom-button-chat").click(function() {
			if(ui.chat) {
				ui.closeTab("#hud-chat");
				ui.chat = false;
			} else {
				$("#hud-chat").css('display','block');
				ui.updateBottom();
				ui.chat = true;
			}
		});
		$("#hud-bottom-button-ranks").click(function() {
			if(ui.ranks) {
				ui.closeTab("#hud-ranks");
				ui.ranks = false;
			} else {
				$("#hud-ranks").css('display','block');
				ui.updateBottom();
				ui.ranks = true;

				$('#hud-ranks-frame').attr('src',$('#hud-ranks-frame').attr('src'));		
			}
		});
		$("#hud-bottom-button-map").click(function() {
			if(ui.map) {
				map.closeTab();
			} else {
				map.openTab();
				if(ui.research) {
					research.closeUI();
				}
				ui.updateBottom();
			}
		});
		$("#hud-map-close").click(function() {
			if(ui.map) {
				map.closeTab();
			}
		});
		$("#hud-bottom-button-researchs").click(function() {
			if(ui.research) {
				research.closeUI();
			} else {
				research.openUI();
				if(ui.map) {
					map.closeTab();
				}
				ui.updateBottom();
			}
		});

		function hideFleetMenu() {
			if(units.unitPanelTimeout != -1) {
				clearTimeout(units.unitPanelInterval);
				units.unitPanelTimeout = -1;
			}

			ui.closeTab("#hud-fleet");
			ui.fleet = false;
		}
		function drawFleetMenu() {
			$("#hud-fleet").css('display','block');
			
			$(".fleet-ul1 .ul-choice-line-li-active").removeClass("ul-choice-line-li-active"); //Retirer les classes actives

			$("#fleet-orbit").css('display',"none");
			$("#fleet-build").css('display',"none");
			$("#fleet-move").css('display',"none");
			$("#fleet-out").css('display',"none");
			ui.fleet = true;
		}
		$("#hud-bottom-button-units").click(function() {
			if(ui.fleet && !preventFleetHUDClosing && $("#fleet-build").css('display') == "block") {
				hideFleetMenu();
			} else {
				drawFleetMenu();

				$("#fleet-build").css('display',"block");
				$("#fleet-build-button").addClass("ul-choice-line-li-active");

				ui.updateBottom();
			}
		});
		$("#hud-bottom-button-fleets").click(function() {
			if(ui.fleet && !preventFleetHUDClosing && $("#fleet-orbit").css('display') == "block") {
				hideFleetMenu();
			} else {
				drawFleetMenu();

				$("#fleet-orbit").css('display',"block");
				$("#fleet-orbit-button").addClass("ul-choice-line-li-active");

				ui.updateBottom();
			}
		});
		$("#hud-bottom-button-radar").click(function() {
			if(ui.fleet && !preventFleetHUDClosing && $("#fleet-move").css('display') == "block") {
				 hideFleetMenu();
			} else {
				drawFleetMenu();

				$("#fleet-move").css('display',"block");
				$("#fleet-move-button").addClass("ul-choice-line-li-active");

				ui.updateBottom();
			}
		});
	}
	/********** DAILY BONUS **********/
	static dailyBonus(streak,best) {
		// "0 + ..." prevent using the same variable
		ui.bonusStreak = 0 + streak; 
		ui.bonusStreakBest = 0 + best;

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
		else if(streak<20) { 
			credits = 10*(streak + 1); // 110 to 200
			helium = 1750 * streak; // 15000 is about 45 min of ion propulsion for 1 vessel - 15000 to 33250
		} else if(streak<30) { 
			credits = 15*streak; // 300 to 435
			helium = 2000 * streak; // 40000 to 58000
		} else { 
			credits = 1000;
		} // @ADD: generate random special bonus
		
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

		var dateNow = new Date();
		setTimeout(function() {
			ui.dailyBonus(ui.bonusStreak+1, ui.bonusStreakBest+1);
		},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planet.deltaNow); // Refresh at 00:00:05
	}
	static notify(txt,options={}) {
		// Voyons si le navigateur supporte les notifications
		if (!("Notification" in window)) { return; }

		// Voyons si l'utilisateur est OK pour recevoir des notifications
		else if (Notification.permission === "granted") {
		// Si c'est ok, créons une notification
			var notification = new Notification(txt,options);
		}

		// Sinon, nous avons besoin de la permission de l'utilisateur
		// Note : Chrome n'implémente pas la propriété statique permission
		// Donc, nous devons vérifier s'il n'y a pas 'denied' à la place de 'default'
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
			    // Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
				if(!('permission' in Notification)) {
					Notification.permission = permission;
				}

				// Si l'utilisateur est OK, on crée une notification
				if (permission === "granted") {
					var notification = new Notification(txt,options);
				}
			});
		}

		// Comme ça, si l'utlisateur a refusé toute notification, et que vous respectez ce choix,
		// il n'y a pas besoin de l'ennuyer à nouveau.
	}
}

$(document).ready( function() {
	ui.load();
});