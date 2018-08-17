class notifications {
	/**
	 * Notifications types:
	 * - Attack (incoming)
	 * - Attack (report)
	 * - Build
	 * - Private message
	 * - Research
	 * - Trade
	 * - Unit build
	 */

	static notifyOnOS(txt,options={}) {
		var notification;

		if (!("Notification" in window)) { // Le navigateur support les notifications ?
			return; 
		} else if (Notification.permission === "granted") {
			notification = new Notification(txt,options);
		} else if (Notification.permission !== 'denied') { 
			// Note : Chrome n'implémente pas la propriété statique permission
			Notification.requestPermission(function (permission) {
				if(!('permission' in Notification)) {
					Notification.permission = permission;
				}

				if (permission === "granted") {
					notification = new Notification(txt,options);
				}
			});
		}

		if(notification && options.callback) {
			notification.onclick = options.callback;
		}
	}

	static notifyOnGame(type, text, options={}) {
		let notifPanel = document.getElementById('notifications-panel');
		notifPanel.innerHTML = '<div class="notif-elt notif-' + type + '"></div>' + notifPanel.innerHTML;

		// @TODO: Ajouter message de description

		// @TODO: Ajouter attributs données dans options

		ui.notifCount++;
		ui.updatePageTitle();
		notifications.updateClearButtonDisplay();

		notifications.gameNotifAddEvents();
	}

	static notify(type, args={}) {
		var title = "";
		var osOpt = { icon: cdnURL + "img/favicon.png" };
		var desc = "";

		switch(type) {
			case "attack":
				title = translate.messages['ATTACK_INCOMING_TITLE'];
				desc = translate.messages['ATTACK_INCOMING_01'] + getStringTime(args.arriveTime);
				break;
			case "building":
				title = translate.messages['ENDED_BUILDING_TITLE'];
				desc = translate.messages['ENDED_BUILDING_01'] + translate['buildings'][args.building].name + translate.messages['ENDED_BUILDING_02'] + args.lvl;
				break;
			case "research":
				title = "Galactae: " + translate.messages['ENDED_RESEARCH'];
				desc = translate["messages"]['ENDED_RESEARCH'] + ": " + translate.research[args.research].name;
				break;
			case "unit":
				title = "Galactae: " + translate.messages['ENDED_UNIT_TITLE'];
				desc = translate.messages['ENDED_UNIT_01'] + args.unitCount + translate.messages['ENDED_UNIT_02'] + args.unitName + translate.messages['ENDED_UNIT_03'];
				break;
			default:
				// Do nothing
		}

		if(osOpt.icon !== undefined && desc != "") {
			osOpt.body = desc;
			notifications.notifyOnOS("Galactae: " + title, osOpt);
		}

		notifications.notifyOnGame(type, desc, args);
	}

	static gameNotifAddEvents() {
		let DOMElts = document.querySelectorAll('.notif-elt');
		for(let elt=0; elt<DOMElts.length; elt++) {
			let element = DOMElts[elt];
			element.addEventListener('click', function() {
				notification.gameNotifClick(element);

				ui.notifCount--;
				ui.updatePageTitle();
				notifications.updateClearButtonDisplay();
			});
		}

		document.getElementById('notifications-closeAll').addEventListener('click', function() {
			document.getElementById('notifications-panel').innerHTML = '<span id="notifications-closeAll">☒</span>';

			ui.notifCount = 0;
			ui.updatePageTitle();
			notifications.updateClearButtonDisplay();
		});
	}

	static gameNotifClick(element) {
		// Open needed windows
		if(ui.hasClass(element, 'notif-mail')) {
			// @TODO
		} else if(ui.hasClass(element, 'notif-building')) {
			// @TODO
		} else if(ui.hasClass(element, 'notif-research')) {
			research.openUI();
		}
		
		// Remove element
		this.parentNode.removeChild(this);
	}

	static updateClearButtonDisplay() {
		if(ui.notifCount == 0) {
			ui.hide('#notifications-closeAll');
		} else {
			ui.show('#notifications-closeAll');
		}
	}
}