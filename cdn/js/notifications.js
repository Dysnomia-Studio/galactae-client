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
		$('#notifications-panel').html('<div class="notif-elt notif-' + type + '"></div>' + $('#notifications-panel').html());

		// @TODO: Ajouter message de description

		// @TODO: Ajouter attributs données dans options

		ui.notifCount++;
		ui.updatePageTitle();

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
		$(".notif-elt").click(function() {
			$(this).remove();

			ui.notifCount--;
			ui.updatePageTitle();
		});

		$('#notifications-closeAll').click(function() {
			$('#notifications-panel').html('<span id="notifications-closeAll">☒</span>');

			ui.notifCount = 0;
			ui.updatePageTitle();
		});
	}

	static gameNotifClick() {
		// Open needed windows
		if($(this).hasClass('notif-mail')) {
			// @TODO
		} else if($(this).hasClass('notif-building')) {
			// @TODO
		} else if($(this).hasClass('notif-research')) {
			research.openUI();
		}
		

		// Remove element
		$(this).remove();
	}
}