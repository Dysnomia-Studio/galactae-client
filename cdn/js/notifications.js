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

	static notifyOnGame(type, text) {
		$('#notifications-panel').html('<div class="notif-elt notif-' + type + '"></div>' + $('#notifications-panel').html());

		// @TODO: Ajouter message de description

		ui.notifCount++;
		ui.updatePageTitle();

		notifications.gameNotifAddEvents();
	}

	static notify(type, args) {
		var title = "";
		var osOpt = { icon: cdnURL + "img/favicon.png" };
		var desc = "";

		switch(type) {
			case "attack":
				title = translate.messages['ATTACK_INCOMING_TITLE'];
				desc = translate.messages['ATTACK_INCOMING_01'] + getStringTime(args.arriveTime);

			case "building":
				title = translate.messages['ENDED_BUILDING_TITLE'];
				desc = osOpt.body = translate.messages['ENDED_BUILDING_01'] + args.name + translate.messages['ENDED_BUILDING_02'] + args.lvl;

			case "research":
				title = "Galactae: " + translate.messages['ENDED_RESEARCH'];
				desc = translate["messages"]['ENDED_RESEARCH'] + ": " + args.name;

			case "unit":
				title = "Galactae: " + translate.messages['ENDED_UNIT_TITLE'];
				desc = translate.messages['ENDED_UNIT_01'] + args.count + translate.messages['ENDED_UNIT_02'] + args.fname + translate.messages['ENDED_UNIT_03'];

			default:
				// Do nothing
		}

		if(osOpt.icon !== undefined && desc != "") {
			osOpt.body = desc;
			notifications.notifyOnOS("Galactae: " + title, osOpt);
		}

		notifications.notifyOnGame(type, gameOpt);
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

		} else if($(this).hasClass('notif-building')) {

		}
		// @TODO

		// Remove element
		$(this).remove();
	}
}