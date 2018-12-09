class planetBack {
	/**
	 * Initializing all variables
	 */
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
		this.planet.radius = Math.min(document.documentElement.clientHeight/4, 268);

		/* Calc Vars */
		this.calc = {};
		
		this.calc.lat = 0;

		this.tick = 1;

		// Create planet
		this.createPlanet();
		// Start rotate !
		this.renderPlanet();
		// Tell we loaded the planet
		loadScreen.complete('pback');
	}

	/**
	 * Create the planet
	 */
	static createPlanet() {
		this.resetPlanet();

		/* Images */
		this.planetBg.style.backgroundImage = 'url('+cdnURL+'img/planets/back/0.png)'; // Temp one back @ADD: new backgrounds
		this.planetHalo.style.backgroundImage = 'url('+cdnURL+'img/planets/halo/' + this.planet.type + '.png)';
		this.planetMap = 'url('+cdnURL+'img/planets/front/' + this.planet.type + '.jpg)';
		
		let halo = document.querySelector('#planet-back-halo');
		halo.style.width = Math.round(this.planet.radius*2/536*725) + 'px';
		halo.style.height = Math.round(this.planet.radius*2/536*710) + 'px';

		let mleft = Math.round(this.planet.radius/536*725);
		let mTop = Math.round(this.planet.radius/536*710);
		if(this.planet.type > 101) {
			mleft += 0;
			mTop += 0;
		}
		halo.style.marginLeft = '-' + mleft + 'px';
		halo.style.marginTop = '-' + mTop + 'px';

		/* Planet */
		this.calc.Xparts = 16;
		this.calc.Yparts = 9;
		this.calc.picWidth = 1920;
		this.calc.picHeight = 1080;
		this.calc.partWidth = this.calc.picWidth / this.calc.Xparts;
		this.calc.partHeight = this.calc.picHeight / this.calc.Yparts;

		this.calc.vertices = [];

		let phi0 = 0;
		let phiMax = 2* Math.PI;

		let theta0 = 0;
		let thetaMax = Math.PI;

		/* Let's calc all vertices ! */
		for (let y=0; y<=this.calc.Yparts; y++) {
			let verticesRow = [];

			for (let x=0; x<=this.calc.Xparts; x++) {
				let u = x / this.calc.Xparts;
				let v = 0.05 + y/this.calc.Yparts*0.9;

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
		for (let y=0; y < this.calc.Yparts; y++) {
			for (let x = 0; x < this.calc.Xparts; ++x ) {
				/* Create element */
			    let elt = document.createElement('div');
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
			    let bgX = x*(-this.calc.partWidth);
			    let bgY = y*(-this.calc.partHeight);
			    elt.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
			    /* Add it to the HTML Code */
			    this.planetContent.appendChild(elt);
			    this.contentDOM.push(elt);
			}
		}
	}

	/**
	 * Remove the planet
	 */
	static resetPlanet() {
		/* Empty Vars */
		this.contentDOM = [];
		/* Remove DOM Elements */
		let elt;
		while (elt = this.planetContent.firstChild) {
			this.planetContent.removeChild(elt);
		}
	}

	/**
	 * Render the planet
	 */
	static renderPlanet() {
		// New position
		planetBack.calc.long = (-Date.now()/1000)%360 - 180;

		// Rotate
		planetBack.rotatePlanet();

		// Loop it
		requestAnimationFrame(planetBack.renderPlanet);
	}

	/**
	 * Animate rotation
	 */
	static rotatePlanet() {
		if(planetBack.tick^=1) {
			// Calc all angles only one time
			let sinX = Math.sin(planetBack.calc.lat/180*Math.PI);
			let sinY = Math.sin((planetBack.calc.long-270)/180*Math.PI);
			let cosX = Math.cos(planetBack.calc.lat/180*Math.PI);
			let cosY = Math.cos((planetBack.calc.long-270)/180*Math.PI);

			// Calc rotate
			for(let j=0; j<=planetBack.calc.Yparts; j++) {
				for(let i=0; i<=planetBack.calc.Xparts; i++) {
					let x = planetBack.calc.vertices[j][i].x;
					let y = planetBack.calc.vertices[j][i].y;
					let z = planetBack.calc.vertices[j][i].z;

					let x0 = x * cosY - z * sinY;
					let z0 = z * cosY + x * sinY;
					let y0 = y * cosX - z0 * sinX;
						z0 = z0 * cosX + y * sinX;

					planetBack.calc.vertices[j][i].px = x0 * (1 + (z0 / 4000));
					planetBack.calc.vertices[j][i].py = y0 * (1 + (z0 / 4000));
				}
			}

			// Apply Rotate
			for(let y=0; y<planetBack.calc.Yparts; y++) {
				for(let x=0; x<planetBack.calc.Xparts; x++) {
					let elt = planetBack.contentDOM[planetBack.calc.Xparts*y + x];
					let pos = [
						elt.topLeft,
						elt.topRight,
						elt.bottomLeft,
						elt.bottomRight
					];

					for(let i=0; i<3; i++) {
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
	        for (let i=0; i<planetBack.contentDOM.length; i++) {
	            let perspectiveTransform = planetBack.contentDOM[i].perspectiveTransform;
	            if(!perspectiveTransform.hasError) {
	                perspectiveTransform.update();
	            } else {
	                perspectiveTransform.style[PerspectiveTransform.transformStyleName] = 'translate3d(-8192px, 0, 0)';
	            }
	        }
		}
	}

	static expandVector(u,v) {
		let deltaX = v.px - u.px;
		let deltaY = v.py - u.py;
		let delta = Math.pow(deltaX,2) + Math.pow(deltaY,2);

		if(delta===0) {
			u.tx = u.px;
			u.ty = u.py;
			v.tx = v.px;
			v.ty = v.py;

			return; // Don't calc with the other method ...
		}

	    let DeltaI = 1.5 / Math.sqrt(delta);

	    deltaX *= DeltaI; 
	    deltaY *= DeltaI;

		u.tx = u.px - deltaX;
		u.ty = u.py - deltaY;
		v.tx = v.px + deltaX;
		v.ty = v.py + deltaY;
	}
}