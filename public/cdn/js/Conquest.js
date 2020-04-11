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

	static isBeingConquested() {
		return Conquest.list.filter((elt) =>
			elt.planet === planetData.address &&
			elt.endDate.getTime() > Date.now() &&
			!elt.aborted
		).length > 0;
	}
}