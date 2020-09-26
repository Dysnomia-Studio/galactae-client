class GameMap extends _GameMap {
	static getCoordinatesFromSystem(system) {
		const sector = GameMap.getSectorFromAdress(system + '-0');

		if(!map.xmlDoc[sector]) {
			return [0, 0];
		}

		const systemDOM = map.xmlDoc[sector].querySelector('sy[id="' + system + '"]');

		const cx = Math.round(parseFloat(systemDOM.getAttribute('x')/10) * MAP_SIZE_WIDTH);
		const cy = Math.round(parseFloat(systemDOM.getAttribute('y')/10) * MAP_SIZE_HEIGHT);

		return [cx, cy];
	}
}
