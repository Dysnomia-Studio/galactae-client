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
class notifications {
	/**
	 * Notifies on operating system
	 *
	 * @param      {<type>}  txt      Notification Text
	 * @param      {<type>}  options  Notification Options
	 */
	static notifyOnOS(txt,options={}) {
		let notification;

		if (!('Notification' in window)) {
			return;
		} else if (Notification.permission === 'granted') {
			notification = new Notification(txt,options);
		} else if (Notification.permission !== 'denied') {
			// Note : Chrome n'implémente pas la propriété statique permission
			Notification.requestPermission(function (permission) {
				if(!('permission' in Notification)) {
					Notification.permission = permission;
				}

				if (permission === 'granted') {
					notification = new Notification(txt,options);
				}
			});
		}

		if(notification && options.callback) {
			notification.onclick = options.callback;
		}
	}

	/**
	 * Add all events of notification panel
	 */
	static gameNotifAddEvents() {
		const DOMElts = document.querySelectorAll('.notif-elt');
		for(let elt=0; elt<DOMElts.length; elt++) {
			const element = DOMElts[elt];
			element.addEventListener('click', function() {
				notifications.gameNotifClick(this);

				ui.updatePageTitle();
				notifications.updateClearButtonDisplay();
			});
		}

		document.getElementById('notifications-closeAll').addEventListener('click', function() {
			const keep = [];

			const list = document.getElementById('notifications-panel');
			while(list.firstChild) {
				if(ui.hasClass(list.firstChild, 'notif-tutorial') || ui.hasClass(list.firstChild, 'notif-conquest')) {
					keep.push(list.firstChild);
				}
				list.removeChild(list.firstChild);
			}

			const closeAllButton = document.createElement('span');
			closeAllButton.id = 'notifications-closeAll';
			closeAllButton.innerText = '☒';

			list.appendChild(closeAllButton);

			for(const notif of keep) {
				list.appendChild(notif);
			}

			ui.updatePageTitle();
			notifications.updateClearButtonDisplay();
		});
	}

	/**
	 * Compute click on a game notification
	 *
	 * @param      {DOM Element}  element  The element clicked on
	 */
	static gameNotifClick(element) {
		// Open needed windows
		if(ui.hasClass(element, 'notif-mail')) {
			// @TODO
		} else if(ui.hasClass(element, 'notif-building')) {
			planetUI.buildPanelOpen(parseInt(element.id.split('-')[1]));
		} else if(ui.hasClass(element, 'notif-research')) {
			research.openUI();
		} else if(ui.hasClass(element, 'notif-tutorial')) {
			ui.show('#tutorial-panel');
		} else if(ui.hasClass(element, 'notif-report')) {
			Reports.showReport(element.id.substring('notif-'.length));
		} else if(ui.hasClass(element, 'notif-attack')) {
			ui.fleetPanelToggle('fleet-move');
		} else if(ui.hasClass(element, 'notif-conquest')) {
			socket.emit('planet-ask-data', {
				...userData,
				pid: element.id.substring('notif-conquest_'.length),
			});
			return;
		}

		// Remove element
		if(element) {
			element.remove();
		}
	}

	static count() {
		return Array.from(document.getElementById('notifications-panel').children).filter(
			(elt) => !ui.hasClass(elt, 'notif-tutorial') && !ui.hasClass(elt, 'notif-conquest')
		).length - 1;
	}

	/**
	 * Draw or not "clear all" button
	 */
	static updateClearButtonDisplay() {
		if(notifications.count() === 0) {
			ui.hide('#notifications-closeAll');
		} else {
			ui.show('#notifications-closeAll');
		}
	}

	static removeInGameNotif(id) {
		const notifElt = document.getElementById('notif-' + id);
		if(notifElt) {
			notifElt.remove();
		}
	}

	/**
	 * Create an in-game notification (left tab)
	 *
	 * @param      {string}  type     Notification typr
	 * @param      {string}  text     Notification text
	 * @param      {<type>}  options  Notification options
	 */
	static notifyOnGame(type, text, options={}) {
		const notifPanel = document.getElementById('notifications-panel');
		let content = '<div class="notif-elt notif-' + type + '"';

		if(options.id !== undefined) {
			notifications.removeInGameNotif(options.id);

			content += ' id="notif-' + options.id + '" ';
		}
		content +=' title="' + text + '"></div>' + notifPanel.innerHTML;

		notifPanel.innerHTML = content;

		ui.updatePageTitle();
		notifications.updateClearButtonDisplay();

		notifications.gameNotifAddEvents();
	}

	/**
	 * Global method to notify everywhere
	 *
	 * @param      {<type>}  type    Notiification type
	 * @param      {<type>}  args    Notification arguments
	 */
	static notify(type, args={}) {
		let title = '';
		const osOpt = { icon: cdnURL + 'img/favicon.png' };
		let desc = '';

		switch(type) {
			case 'ally_askToJoin':
				title = translate.message['ALLIANCE_PLY_ASKED_TO_JOIN'];
				desc = translate.message['ALLIANCE_PLY_ASKED_TO_JOIN'] + ': ' + args.playerName;
				break;
			case 'ally_askToPact':
				title = translate.message['ALLIANCE_ASKED_TO_PACT'];
				desc = translate.message['ALLIANCE_ASKED_TO_PACT'] + ': ' + args.name;
				break;
			case 'ally_refusedPact':
				title = translate.message['ALLIANCE_REFUSED_PACT'];
				desc = translate.message['ALLIANCE_REFUSED_PACT'] + ': ' + args.name;
				break;
			case 'ally_stopPact':
				title = translate.message['ALLIANCE_STOPPED_PACT'];
				desc = translate.message['ALLIANCE_STOPPED_PACT'] + ': ' + args.name;
				break;
			case 'ally_accepted':
				title = translate.message['ALLIANCE_GRANTED'](args.name);
				desc = translate.message['ALLIANCE_GRANTED'](args.name);
				break;
			case 'ally_refused':
				title = translate.message['ALLIANCE_REFUSED'](args.name);
				desc = translate.message['ALLIANCE_REFUSED'](args.name);
				break;
			case 'ally_invited':
				title = translate.message['ALLIANCE_INVITED'](args.name);
				desc = translate.message['ALLIANCE_INVITED'](args.name);
				break;
			case 'ally_kicked':
				title = translate.message['ALLIANCE_KICKED'] + args.staffName;
				desc = translate.message['ALLIANCE_KICKED'] + args.staffName;
				break;
			case 'ally_newPerms':
				title = translate.message['ALLIANCE_NEWPERMS'] + args.staffName;
				desc = translate.message['ALLIANCE_NEWPERMS'] + args.staffName;
				break;
			case 'ally_joined':
				title = translate.message['ALLIANCE_NEW_PLAYER'](args.playerName);
				desc = translate.message['ALLIANCE_NEW_PLAYER'](args.playerName);
				break;
			case 'ally_refuse_join':
				title = translate.message['ALLIANCE_INVITE_REFUSED'](args.playerName);
				desc = translate.message['ALLIANCE_INVITE_REFUSED'](args.playerName);
				break;
			case 'ally_member_kicked':
				title = translate.message['ALLIANCE_MEMBER_KICKED'](args.playerName, args.staffName);
				desc = translate.message['ALLIANCE_MEMBER_KICKED'](args.playerName, args.staffName);
				break;
			case 'ally_member_left':
				title = translate.message['ALLIANCE_MEMBER_LEFT'](args.playerName);
				desc = translate.message['ALLIANCE_MEMBER_LEFT'](args.playerName);
				break;
			case 'ally_edited':
				title = translate.message['ALLIANCE_EDITED'](args.playerName);
				desc = translate.message['ALLIANCE_EDITED'](args.playerName);
				break;
			case 'ally_dissolved':
				title = translate.message['ALLIANCE_DISSOLVED'];
				desc = translate.message['ALLIANCE_DISSOLVED'];
				break;
			case 'attack':
				title = translate.messages['ATTACK_INCOMING_TITLE'];
				desc = translate.messages['ATTACK_INCOMING_FROM'] + args.origin + '(' + args.player + ')' +
					translate.messages['ATTACK_INCOMING_TO'] + args.destination +
					translate.messages['ATTACK_INCOMING_TIME'] + new Date(args.arriveTime).toLocaleDateString() + ' ' + new Date(args.arriveTime).toLocaleTimeString();
				break;
			case 'building':
				title = translate.messages['ENDED_BUILDING_TITLE'];
				desc = translate.messages['ENDED_BUILDING_01'] + translate['buildings'][args.building].name + translate.messages['ENDED_BUILDING_02'] + args.lvl;
				args.id = args.building;
				break;
			case 'fleetMove':
				title = translate.messages['ENDED_MOVE'];
				desc = args.fleetName + translate.messages['ENDED_MOVE_01'] + args.destination;
				break;
			case 'report':
				title = translate.messages['NEW_REPORT_AVAILABLE'];
				desc = translate.messages['NEW_REPORT_AVAILABLE']; // TODO planet name/address/player
				break;
			case 'research':
				title = 'Galactae: ' + translate.messages['ENDED_RESEARCH'];
				desc = translate['messages']['ENDED_RESEARCH'] + ': ' + translate.research[args.research].name;
				break;
			case 'unit':
				if(fleetTranslate[args.unitName]) {
					args.unitName = fleetTranslate[args.unitName];
				}

				title = 'Galactae: ' + translate.messages['ENDED_UNIT_TITLE'];
				desc = translate.messages['ENDED_UNIT_01'] + args.unitCount + translate.messages['ENDED_UNIT_02'] + args.unitName + translate.messages['ENDED_UNIT_03'];
				break;
			default:
				// Do nothing
		}

		if(osOpt.icon !== undefined && desc !== '') {
			osOpt.body = desc;
			notifications.notifyOnOS('Galactae: ' + title, osOpt);
		}

		notifications.notifyOnGame(type, desc, args);
	}
}