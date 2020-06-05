(function (exports) {
	exports._Trading = class Trading {
		static getPlanetCapacity(lvl) {
			if(lvl === 0) {
				return 0;
			}

			return 1000 * Math.pow(lvl, 2) - 2700 * lvl + 2600;
		}
	};
})(typeof exports === 'undefined'? window : exports);
