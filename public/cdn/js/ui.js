/**
 * Keyboard keys constants
 */
let KEYBOARD = {};
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
KEYBOARD.I = 73;
KEYBOARD.F5 = 116;
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
		if((translate.messages[msg] !=undefined) && (translate.messages[msg] !="")) { msg = translate.messages[msg]; }
		// Draw the message
		let msgPanel = document.getElementById('messagePanel');
		msgPanel.innerText = msg;
		
		msgPanel.classList.add('fadeIn-1s');
		msgPanel.style.display = "block";

		setTimeout(function() { 
			msgPanel.classList.remove('fadeIn-1s');
			msgPanel.classList.add('fadeOut-1s'); 

			setTimeout(function() {
				msgPanel.style.display = "none";
				msgPanel.classList.remove('fadeOut-1s'); 
			},1000);

		}, 1000 + 100*msg.length);	
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
		ui.chat = (document.getElementById('hud-chat').style.display != "none");
		ui.ranks = false;
		ui.news = false;
		ui.bonusStreak = 0;
		ui.bonusStreakBest = 0;

		ui.notifCount = 0;

		ui.mouseStatus = [0,0,0,0];

		document.addEventListener('mousedown', function(event) {
			ui.mouseStatus[event.which] = 1;
		});
		document.addEventListener('mouseup', function(event) {
			ui.mouseStatus[event.which] = 0;
		});

		// Chat tampon
		ui.lastMessage = "";

		// Actions au clavier
		document.addEventListener('keydown', function(e){
			ui.keydown(e);
		});

		// Settings panel
		settings.loadUI();

		//Rename planet
		document.getElementById("hud-planet-name").addEventListener('click', function() {
			ui.planetNameSwitchToInput();
		});
		//HUD Buttons
		ui.hudBottomButtons();

		window.addEventListener('resize', function() {
			ui.loadHUDButtons();
		});

		// Load Research UI
		research.loadUI();

		// Load Fleet UI
		units.loadUI();

		// Load Chat UI
		chat.loadUI();

		document.getElementById("hud-ranks-close").addEventListener('click', function() {
			ui.closeTab("#hud-ranks");
			ui.ranks = false;
		});

		document.getElementById("news-close").addEventListener('click', function() {
			ui.closeTab("#hud-news");
			ui.news = false;
		});

		//Bonus Quotidien
		document.getElementById("day-bonus-confirm").addEventListener('click', function() {
			let choice = 1;
			let dayBonus2 = document.getElementById('day-bonus-2');
			if(dayBonus2 && ui.hasClass(dayBonus2, 'day-bonus-active')) {
				choice = 2;
			}
			socket.emit('daily-bonus',{user: userData, choice: choice});
			ui.closeTab("#day-bonus");
		});
		document.getElementById("day-bonus-later").addEventListener('click', function() {
			ui.closeTab("#day-bonus");
		});

		// Ranks
		$(".ranks-ul li").click(function() {
			let DOMelts = document.querySelectorAll('.ranks-ul .ul-choice-line-li-active');
			for(let elt=0; elt<DOMelts.length; elt++) {
				DOMelts[elt].classList.remove("ul-choice-line-li-active");
			}

			this.classList.add("ul-choice-line-li-active"); // Activer l'onglet cliqué

			$('#hud-ranks-frame').attr("src", "ranks.php?type=" + $(this).attr("choice"));
		});

		// Notifs
		notifications.gameNotifAddEvents();

		// Prevent players putting code that can break their account security like Self XSS breachs
			//Block Inspect Element when 
			//right click
			$(document).on("contextmenu",function(){
				if(document.location.host.substr(3,3) !== "dev" && document.location.host.substr(0,4) !== "test") {
					return false;
				}
			});
			$(document).keydown(function(e){
			//F12 => Firefox, Chrome, Edge
				if(e.which === KEYBOARD.F12){
					if(document.location.host.substr(3,3) !== "dev" && document.location.host.substr(0,4) !== "test") {
						return false;
					}
				}
				//CTRL + SHIFT + C => Opera
				if(e.which === KEYBOARD.C && e.ctrlKey && e.shiftKey){
					if(document.location.host.substr(3,3) !== "dev" && document.location.host.substr(0,4) !== "test") {
						return false;
					}
				}

				//CTRL + SHIFT + I => Chromium
				if(e.which === KEYBOARD.I && e.ctrlKey && e.shiftKey){
					if(document.location.host.substr(3,3) !== "dev" && document.location.host.substr(0,4) !== "test") {
						return false;
					}
				}
			});
	}

	/**
	 * Update the page title (tab text)
	 */
	static updatePageTitle() {
		let notifString = "";
		if(ui.notifCount != 0) {
			notifString = "("+ui.notifCount+") ";
		}

		document.title = notifString + userData.username + " - " + planetData.name;
	}

	/**
	 * Add events to make work all HUD buttons
	 */
	static loadHUDButtons() {
		// HUD Top right
		document.getElementById('hud-top-right-moveLeft').addEventListener('click', function() {
			let scroll = $('#hud-top-right').scrollLeft();
			scroll -= 20;
			if(scroll<0) { scroll=0; }
			$('#hud-top-right').scrollLeft(scroll);
		});

		document.getElementById('hud-top-right-moveRight').addEventListener('click', function() {
			let scroll = $('#hud-top-right').scrollLeft();
			scroll += 20;
			if(scroll>$('#hud-top-right').width()) { scroll=$('#hud-top-right').width(); }
			$('#hud-top-right').scrollLeft(scroll);
		});
		// HUD Top left
		document.getElementById('hud-top-left-moveLeft').addEventListener('click', function() {
			let scroll = $('#hud-top-left').scrollLeft();
			scroll -= 20;
			if(scroll<0) { scroll=0; }
			$('#hud-top-left').scrollLeft(scroll);
		});

		document.getElementById('hud-top-left-moveRight').addEventListener('click', function() {
			let scroll = $('#hud-top-left').scrollLeft();
			scroll += 20;
			if(scroll>$('#hud-top-left').width()) { scroll=$('#hud-top-left').width(); }
			$('#hud-top-left').scrollLeft(scroll);
		});

		// Display none if needed	
		if(document.getElementById('hud-top-left').scrollWidth <=
			Math.round($('#hud-top-left').width())) {

			ui.hide('#hud-top-left-moveRight');
			ui.hide('#hud-top-left-moveLeft');
		} else {
			ui.show('#hud-top-left-moveRight');
			ui.show('#hud-top-left-moveLeft');
		}

		if(document.getElementById('hud-top-right').scrollWidth <=
			Math.round($('#hud-top-right').width())) {

			ui.hide('#hud-top-right-moveRight');
			ui.hide('#hud-top-right-moveLeft');
		} else {
			ui.show('#hud-top-right-moveRight');
			ui.show('#hud-top-right-moveLeft');
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
				ui.closeTab("#hud-ranks");
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
			planet.prev();
		}
		if(e.which === KEYBOARD.RARROW && !($("#chat_message").is(":focus"))) { // Droite
			planet.next();
		}

		if(e.which === KEYBOARD.F5) {
			loadStatus = 0;
			loadStatusArr = {
				"settings": false,
				"server": false,
				"planet": false,
				"units": false,
				"player": false,
				"fleet": false,
				"maps": false,
				"load": false,
				"service-worker": false,
			};
			ui.show('#loading-overlay');
		}
	}
	/**
	 * Closes a tab.
	 *
	 * @param      {<type>}  tab     The tab to be closed
	 */
	static closeTab(tab,sound=true) {
		ui.hide(tab);

		if(sound) {
			let closeUISound = new Audio(cdnURL+'snd/ui/wclose.mp3');
			closeUISound.volume = 0.5;
			closeUISound.play();
		}

		ui.updateBottom();
	}

	/**
	 * Hide something
	 */
	static hide(selector) {
		let DOMelts = document.querySelectorAll(selector);
		for(let elt = 0; elt<DOMelts.length; elt++) {
			DOMelts[elt].style.display = "none";
		}
	}

	/**
	 * Show somethinf
	 */
	static show(selector, display="block") {
		let DOMelts = document.querySelectorAll(selector);
		for(let elt = 0; elt<DOMelts.length; elt++) {
			DOMelts[elt].style.display = display;
		}
	}

	/**
	 * Determines if an element has a specific class.
	 *
	 * @param      {<type>}  elt        The element
	 * @param      {string}  className  The class name
	 * @return     {string}  True if has the class, False otherwise.
	 */
	static hasClass(elt, className) {
		return ((" " + elt.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + className +" ") > -1);
	}

	/**
	 * Update the bottom button display depending on current opened windows
	 */
	static updateBottom() {
		// Map
		if(document.getElementById('hud-map').style.display == "block") {
			document.getElementById('hud-bottom-button-map').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-map').classList.remove('hud-bottom-active');
		}
		// Research
		if(document.getElementById('hud-research').style.display == "block") {
			document.getElementById('hud-bottom-button-researchs').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-researchs').classList.remove('hud-bottom-active');
		}
		// Fleet build
		if(document.getElementById('hud-fleet').style.display == "block" && 
			document.getElementById('fleet-build').style.display == "block") {

			document.getElementById('hud-bottom-button-units').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-units').classList.remove('hud-bottom-active');
		}
		// Fleet orbit
		if(document.getElementById('hud-fleet').style.display == "block" && 
			document.getElementById('fleet-orbit').style.display == "block") {

			document.getElementById('hud-bottom-button-fleets').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-fleets').classList.remove('hud-bottom-active');
		}
		// Fleet move
		if(document.getElementById('hud-fleet').style.display == "block" && 
			document.getElementById('fleet-move').style.display == "block") {

			document.getElementById('hud-bottom-button-radar').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-radar').classList.remove('hud-bottom-active');
		}
		// Ranks
		if(document.getElementById('hud-ranks').style.display == "block") {
			document.getElementById('hud-bottom-button-ranks').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-ranks').classList.remove('hud-bottom-active');
		}
		// Chat
		if(document.getElementById('hud-chat').style.display == "block") {
			document.getElementById('hud-bottom-button-chat').classList.add('hud-bottom-active');
		} else {
			document.getElementById('hud-bottom-button-chat').classList.remove('hud-bottom-active');
		}
	}

	/********** PLANET NAME **********/
	/**
	 * Switch between span and input for planet name
	 */
	static planetNameSwitchToInput() {
		let elt = $("#hud-planet-name");
		ui.oldname = elt.text();
		let $input = $("<input>", {
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
		let elt = $("#hud-planet-name");
		let newname = elt.val();
		let $span = $("<span>", {
			text: elt.val(),
			id: "hud-planet-name"
		});
		elt.replaceWith($span);
		$span.on("click", ui.planetNameSwitchToInput);
		if(ui.oldname!=newname) {
			newname = normalizeText(newname);
			socket.emit('planet-rename', { planet: userData.pid, username: userData.username, id: userData.id, name: newname });
		}
		ui.renaming = false;
	}
	/************ BOUTONS ************/
	/**
	 * Add events for bottom buttons
	 */
	static hudBottomButtons() {
		document.getElementById("hud-bottom-button-chat").addEventListener('click', function() {
			if(ui.chat) {
				ui.closeTab("#hud-chat");
				ui.chat = false;
			} else {
				ui.show('#hud-chat');
				ui.updateBottom();
				ui.chat = true;
			}
		});
		document.getElementById("hud-bottom-button-ranks").addEventListener('click', function() {
			if(ui.ranks) {
				ui.closeTab("#hud-ranks");
				ui.ranks = false;
			} else {
				ui.show('#hud-ranks');
				ui.updateBottom();
				ui.ranks = true;

				$('#hud-ranks-frame').attr('src',$('#hud-ranks-frame').attr('src'));		
			}
		});
		document.getElementById("hud-bottom-button-map").addEventListener('click', function() {
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
		document.getElementById("map-close").addEventListener('click', function() {
			if(ui.map) {
				map.closeTab();
			}
		});
		document.getElementById("hud-bottom-button-researchs").addEventListener('click', function() {
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

		function fleetPanelToggle(elt) {
			if(ui.fleet && !preventFleetHUDClosing && $("#" + elt).css('display') == "block") {
				if(units.unitPanelTimeout != -1) {
					clearTimeout(units.unitPanelInterval);
					units.unitPanelTimeout = -1;
				}

				ui.closeTab("#hud-fleet");
				ui.fleet = false;
			} else {
				ui.show('#hud-fleet');
				
				$(".fleet-ul1 .ul-choice-line-li-active").removeClass("ul-choice-line-li-active"); //Retirer les classes actives

				ui.hide('#fleet-orbit');
				ui.hide('#fleet-build');
				ui.hide('#fleet-move');
				ui.hide('#fleet-out');
				ui.fleet = true;

				ui.show("#" + elt);
				$("#" + elt + "-button").addClass("ul-choice-line-li-active");

				ui.updateBottom();
			}
		}

		document.getElementById("hud-bottom-button-units").addEventListener('click', function() {
			fleetPanelToggle("fleet-build");
		});
		document.getElementById("hud-bottom-button-fleets").addEventListener('click', function() {
			fleetPanelToggle("fleet-orbit");
		});
		document.getElementById("hud-bottom-button-radar").addEventListener('click', function() {
			fleetPanelToggle("fleet-move");
		});

		document.getElementById("hud-bottom-button-ally").addEventListener('click', function() {
			ui.drawMessage(translate["messages"]["DISABLED_FUNCTIONALIY"]);
		});
		document.getElementById("hud-bottom-button-rapports").addEventListener('click', function() {
			ui.drawMessage(translate["messages"]["DISABLED_FUNCTIONALIY"]);
		});
		document.getElementById("hud-bottom-button-quests").addEventListener('click', function() {
			ui.drawMessage(translate["messages"]["DISABLED_FUNCTIONALIY"]);
		});
		document.getElementById("hud-bottom-button-trade").addEventListener('click', function() {
			ui.drawMessage(translate["messages"]["DISABLED_FUNCTIONALIY"]);
		});
		document.getElementById("hud-bottom-button-profil").addEventListener('click', function() {
			ui.drawMessage(translate["messages"]["DISABLED_FUNCTIONALIY"]);
		});
		document.getElementById("hud-bottom-button-messages").addEventListener('click', function() {
			ui.drawMessage(translate["messages"]["DISABLED_FUNCTIONALIY"]);
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
		let credits;
		let helium = 0;

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
		
		let desc = "<tr><td class=\"day-bonus-active\" id=\"day-bonus-1\">" + credits + " credits galactiques</td>";

		if(helium!=0) {
			desc += "<td id=\"day-bonus-2\">" + helium + "t de Helium 3</td>";
		}

		desc+= "</tr>";

		$('#day-bonus-desc').html(desc);
		ui.show('#day-bonus');

		let DOMElts = document.querySelectorAll('day-bonus-desc td');
		for(let elt=0; elt<DOMElts.length; elt++) {
			DOMElts[elt].addEventListener('click', function() {
				let DOMEltList = document.querySelectorAll('#day-bonus-desc .day-bonus-active');
				for(let elt=0; elt<DOMEltList.length; elt++) {
					DOMEltList[elt].classList.remove("day-bonus-active");
				}
				this.classList.add("day-bonus-active"); // Activer l'onglet cliqué
			});
		}

		let dateNow = new Date();
		setTimeout(function() {
			ui.dailyBonus(ui.bonusStreak+1, ui.bonusStreakBest+1);
		},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planet.deltaNow); // Refresh at 00:00:05
	}
}

ready(function() {
	ui.load();
});