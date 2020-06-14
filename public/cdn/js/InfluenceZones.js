class InfluenceZones {
	static edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }

	static pointsOfTriangle(delaunay, t) {
		return InfluenceZones.edgesOfTriangle(t)
			.map(e => delaunay.triangles[e]);
	}

	static triangleOfEdge(e)  { return Math.floor(e / 3); }

	static circumcenter(a, b, c) {
		const ad = a[0] * a[0] + a[1] * a[1];
		const bd = b[0] * b[0] + b[1] * b[1];
		const cd = c[0] * c[0] + c[1] * c[1];
		const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
		return [
			1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
			1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
		];
	}

	static triangleCenter(points, delaunay, t) {
		const vertices = InfluenceZones.pointsOfTriangle(delaunay, t).map(p => points[p]);
		return InfluenceZones.circumcenter(vertices[0], vertices[1], vertices[2]);
	}

	static memberFilter(points, list) {
		return points.filter((coords) =>
			list.filter(
				(elt) => elt[0] === coords[0] && elt[1] === coords[1]
			).length > 0
		).length > 0;
	}

	static drawInfluenceZones() {
		if(!planetData.galacticPos) {
			return;
		}

		const overlayGroup = document.getElementById('map-global-overlay');

		map.points = Array.from(new Set(map.points));

		const delaunay = Delaunator.from(map.points);

		const alliedAndEnnemiesSystems = map.influenceZones.alliedAndEnnemiesSystems.map(GameMap.getCoordinatesFromSystem);
		const ennemiesSystems = map.influenceZones.ennemiesSystems.map(GameMap.getCoordinatesFromSystem);
		const allyAlliedSystems = map.influenceZones.allyAlliedSystems.map(GameMap.getCoordinatesFromSystem);
		const alliedSystems = map.influenceZones.alliedSystems.map(GameMap.getCoordinatesFromSystem);
		const playerSystems = map.influenceZones.playerSystems.map(GameMap.getCoordinatesFromSystem);

		ui.emptyElt(overlayGroup);

		for(let i = 0; i < delaunay.triangles.length; i++) {
			if (delaunay.halfedges[i] > 0) {
				const p = InfluenceZones.triangleCenter(map.points, delaunay, InfluenceZones.triangleOfEdge(i));
				const q = InfluenceZones.triangleCenter(map.points, delaunay, InfluenceZones.triangleOfEdge(delaunay.halfedges[i]));

				const points = [
					map.points[delaunay.triangles[i]],
					p,
					q,
				];

				if(points.filter((elt) => !elt).length > 0) {
					continue;
				}

				let className = '';

				if(InfluenceZones.memberFilter(points, alliedAndEnnemiesSystems)) {
					className = 'alliedAndEnnemies';
				} else if(InfluenceZones.memberFilter(points, ennemiesSystems)) {
					className = 'ennemies';
				} else if(InfluenceZones.memberFilter(points, allyAlliedSystems)) {
					className = 'allyAllied';
				} else if(InfluenceZones.memberFilter(points, alliedSystems)) {
					className = 'allied';
				} else if(InfluenceZones.memberFilter(points, playerSystems)) {
					className = 'player';
				}

				if(className !== '') {
					const triangle = ui.createSVGElt('polygon', {
						id: i + '-triangle',
						points: points.map((elt) => elt.join(',')).join(' '),
						class: 'map-overlay-' + className,
					});
					overlayGroup.appendChild(triangle);
				}
			}
		}
	}
}