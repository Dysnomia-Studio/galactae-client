class Conquest {
	static async init(list) {
		Conquest.list = list.map((elt) => {
			return {
				...elt,
				endDate: new Date(elt.endDate),
			};
		});

		console.log(Conquest.list);
	}

	static getConquestListOnCurrentPlanet() {
		return Conquest.list.filter((elt) =>
			elt.planet === planetData.address &&
			elt.endDate.getTime() > Date.now() &&
			!elt.aborted
		);
	}

	static isBeingConquested() {
		return Conquest.getConquestListOnCurrentPlanet().length > 0;
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