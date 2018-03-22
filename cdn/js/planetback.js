class planetBack {
	static init(type) {
		/* DOM */
		this.planet = document.getElementById('planet-back');	
		this.planetBg = document.getElementById('planet-back-bg');
		this.planetSphere = document.getElementById('planet-back-sphere');
		this.planetContent = document.getElementById('planet-back-content');
		this.planetHalo = document.getElementById('planet-back-halo');
		this.contentDOM = [];

		/* Planet Config */
		this.planet = {};
		this.planet.speed = 0.02;
		this.planet.type = type;
		this.planet.radius = 268;

		/* Calc Vars */
		this.calc = {};
		
		this.calc.lat = 0;

		this.tick = 1;

		// Create planet
		this.createPlanet();
		// Start rotate !
		this.renderPlanet();
		// Tell we loaded the planet
		loadScreen.complete("pback");
	}

	static createPlanet() {
		this.resetPlanet();

		/* Images */
		this.planetBg.style.backgroundImage = 'url('+cdnURL+'img/planets/back/0.png)'; // Temp one back @ADD: new backgrounds
		this.planetHalo.style.backgroundImage = 'url('+cdnURL+'img/planets/halo/' + this.planet.type + '.png)';
		this.planetMap = 'url('+cdnURL+'img/planets/front/' + this.planet.type + '.jpg)';
	
		/* Planet */
		this.calc.Xparts = 16;
		this.calc.Yparts = 9;
		this.calc.picWidth = 1920;
		this.calc.picHeight = 1080;
		this.calc.partWidth = this.calc.picWidth / this.calc.Xparts;
		this.calc.partHeight = this.calc.picHeight / this.calc.Yparts;

		this.calc.vertices = [];

		var phi0 = 0;
		var phiMax = 2* Math.PI;

		var theta0 = 0;
		var thetaMax = Math.PI;

		/* Let's calc all vertices ! */
		for (var y=0; y<=this.calc.Yparts; y++) {
			var verticesRow = [];

			for (var x=0; x<=this.calc.Xparts; x++) {
				var u = x / this.calc.Xparts;
				var v = 0.05 + y/this.calc.Yparts*0.9;

				verticesRow.push({
					x: -this.planet.radius * Math.cos( phi0 + u * phiMax ) * Math.sin( theta0 + v * thetaMax ),
					y: -this.planet.radius * Math.cos( theta0 + v * thetaMax ),
					z: this.planet.radius * Math.sin( phi0 + u * phiMax ) * Math.sin( theta0 + v * thetaMax ),
					phi: phi0 + u * phiMax,
					theta: theta0 + v * thetaMax
				});
			}
			this.calc.vertices.push( verticesRow );
		}

		/* Now place all the faces of the planet */
		for (var y=0; y < this.calc.Yparts; y++) {
			for (var x = 0; x < this.calc.Xparts; ++x ) {
				/* Create element */
			    var elt = document.createElement('div');
			    /* Size and place */
			    elt.style.width = this.calc.partWidth + 'px';
			    elt.style.height = this.calc.partHeight + 'px';
			    elt.style[PerspectiveTransform.transformOriginStyleName] = '0 0';
			    elt.style.backgroundImage = this.planetMap;
			    elt.perspectiveTransform = new PerspectiveTransform(elt , this.calc.partWidth, this.calc.partHeight);
			    elt.topLeft = this.calc.vertices[y][x];
			    elt.topRight = this.calc.vertices[y][x+1];
			    elt.bottomLeft = this.calc.vertices[y+1][x];
			    elt.bottomRight = this.calc.vertices[y+1][x+1];
			    /* Bg image */
			    var bgX = x*(-this.calc.partWidth);
			    var bgY = y*(-this.calc.partHeight);
			    elt.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
			    /* Add it to the HTML Code */
			    this.planetContent.appendChild(elt);
			    this.contentDOM.push(elt);
			}
		}
	}

	static resetPlanet() {
		/* Empty Vars */
		this.contentDOM = [];
		/* Remove DOM Elements */
		var elt;
		while (elt = this.planetContent.firstChild) {
			this.planetContent.removeChild(elt);
		}
	}

	static renderPlanet() {
		// New position
		planetBack.calc.long = (-Date.now()/1000)%360 - 180;

		// Rotate
		planetBack.rotatePlanet();

		// Loop it
		requestAnimationFrame(planetBack.renderPlanet);
	}

	static rotatePlanet() {
		if(planetBack.tick^=1) {
			// Calc all angles only one time
			var sinX = Math.sin(planetBack.calc.lat/180*Math.PI);
			var sinY = Math.sin((planetBack.calc.long-270)/180*Math.PI);
			var cosX = Math.cos(planetBack.calc.lat/180*Math.PI);
			var cosY = Math.cos((planetBack.calc.long-270)/180*Math.PI);

			// Calc rotate
			for(var j=0; j<=planetBack.calc.Yparts; j++) {
				for(var i=0; i<=planetBack.calc.Xparts; i++) {
					var x = planetBack.calc.vertices[j][i].x;
					var y = planetBack.calc.vertices[j][i].y;
					var z = planetBack.calc.vertices[j][i].z;

					var x0 = x * cosY - z * sinY;
					var z0 = z * cosY + x * sinY;
					var y0 = y * cosX - z0 * sinX;
					var z0 = z0 * cosX + y * sinX;

					planetBack.calc.vertices[j][i].px = x0 * (1 + (z0 / 4000));
					planetBack.calc.vertices[j][i].py = y0 * (1 + (z0 / 4000));
				}
			}

			// Apply Rotate
			for(var y=0; y<planetBack.calc.Yparts; y++) {
				for(var x=0; x<planetBack.calc.Xparts; x++) {
					var elt = planetBack.contentDOM[planetBack.calc.Xparts*y + x];
					var pos = [
						elt.topLeft,
						elt.topRight,
						elt.bottomLeft,
						elt.bottomRight
					];

					for(var i=0; i<3; i++) {
						planetBack.expandVector(pos[i],pos[i+1]);
					}
					planetBack.expandVector(pos[3],pos[0]);

					elt.perspectiveTransform.topLeft.x = pos[0].tx;
					elt.perspectiveTransform.topLeft.y = pos[0].ty;
					elt.perspectiveTransform.topRight.x = pos[1].tx;
					elt.perspectiveTransform.topRight.y = pos[1].ty;
					elt.perspectiveTransform.bottomLeft.x = pos[2].tx;
					elt.perspectiveTransform.bottomLeft.y = pos[2].ty;
					elt.perspectiveTransform.bottomRight.x = pos[3].tx;
					elt.perspectiveTransform.bottomRight.y = pos[3].ty;
					elt.perspectiveTransform.hasError = elt.perspectiveTransform.checkError();

	                if(!(elt.perspectiveTransform.hasError = elt.perspectiveTransform.checkError())) {
	                    elt.perspectiveTransform.calc();
	                }
	            }
			}
		} else {
	        for (var i=0; i<planetBack.contentDOM.length; i++) {
	            var perspectiveTransform = planetBack.contentDOM[i].perspectiveTransform;
	            if(!perspectiveTransform.hasError) {
	                perspectiveTransform.update();
	            } else {
	                perspectiveTransform.style[PerspectiveTransform.transformStyleName] = 'translate3d(-8192px, 0, 0)';
	            }
	        }
		}
	}

	static expandVector(u,v) {
		var deltaX = v.px - u.px;
		var deltaY = v.py - u.py;
		var delta = Math.pow(deltaX,2) + Math.pow(deltaY,2);

		if(delta===0) {
			u.tx = u.px;
			u.ty = u.py;
			v.tx = v.px;
			v.ty = v.py;

			return; // Don't calc with the other method ...
		}

	    var DeltaI = 1.5 / Math.sqrt(delta);

	    deltaX *= DeltaI; 
	    deltaY *= DeltaI;

		u.tx = u.px - deltaX;
		u.ty = u.py - deltaY;
		v.tx = v.px + deltaX;
		v.ty = v.py + deltaY;
	}
}