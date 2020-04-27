class Conquest extends _Conquest {
	static async init(list) {
		Conquest.list = list.map((elt) => {
			return {
				...elt,
				endDate: new Date(elt.endDate),
			};
		});

		for(const conquest of Conquest.list) {
			if(conquest.endDate.getTime() < Date.now()) {
				return;
			}

			if(userData.username === conquest.prevPlayer) {
				notifications.notifyOnGame(
					'conquest',
					conquest.planet + ' - ' + translate.messages['BEING_CONQUESTED_BY'] + conquest.newplayer,
					{ id: 'conquest_' + conquest.planet }
				);
			} else {
				notifications.notifyOnGame(
					'conquest',
					translate.messages['YOU_ARE_CONQUERING'] + conquest.planet,
					{ id: 'conquest_' + conquest.planet }
				);
			}
		}
	}

	static getConquestListOnCurrentPlanet() {
		return Conquest.list.filter((elt) =>
			elt.planet === planetData.address &&
			elt.endDate.getTime() > Date.now() &&
			!elt.aborted
		);
	}

	static isPlanetBeingConquested() {
		return Conquest.getConquestListOnCurrentPlanet().length > 0;
	}

	static isDefender() {
		return Conquest.getConquestListOnCurrentPlanet().filter((elt) => {
			return elt.prevplayer === userData.username;
		}).length > 0;
	}

	static getConquestor() {
		return Conquest.getConquestListOnCurrentPlanet().map((elt) => {
			return elt.newplayer;
		}).join(',');
	}

	static getConquestEndTime() {
		return new Date(
			Math.min(...
				Conquest.getConquestListOnCurrentPlanet().map(
					(elt) => new Date(elt.endDate).getTime()
				)
			)
		);
	}
}