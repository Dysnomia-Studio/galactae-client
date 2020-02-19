const RESEARCH_DIV_SIZE = 10000;

const RESEARCH_MIN_ZOOM = 0.4;
const RESEARCH_MAX_ZOOM = 1.75;

const researchPrevMouse = [0,0];

class research extends _Research {
	/**
	 * Handle mobile touch and bind it to mouse events
	 */
	static touchHandler(event) {
		const touch = event.changedTouches[0];

		const simulatedEvent = document.createEvent('MouseEvent');
		simulatedEvent.initMouseEvent({
			touchstart: 'mousedown',
			touchmove: 'mousemove',
			touchend: 'mouseup'
		}[event.type], true, true, window, 1,
			touch.screenX, touch.screenY,
			touch.clientX, touch.clientY, false,
			false, false, false, 0, null
		);

		touch.target.dispatchEvent(simulatedEvent);
		//event.preventDefault();
	}

	/**
	 * Loader for research UI
	 */
	static loadUI() {
		document.getElementById('research-close').addEventListener('click', function() {
			research.closeUI();
		});

		'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(e) {
			document.getElementById('hud-research').addEventListener(e, function(event) {
				if(research.scaling) { return; }

				research.touchHandler(event);
			});
		});

		document.getElementById('hud-research').addEventListener('touchstart', function(e) {
			if(e.touches.length === 2) {
				researchPrevMouse[0] = Math.round((e.touches[0].pageX + e.touches[1].pageX)/2);
				researchPrevMouse[1] = Math.round((e.touches[0].pageY + e.touches[1].pageY)/2);
				return;
			}

			researchPrevMouse[0] = e.pageX;
			researchPrevMouse[1] = e.pageY;
		});

		document.getElementById('hud-research').addEventListener('mousemove', function(e) {
			if(ui.mouseStatus[1] === 1) {
				const pos = ui.position('#hud-research');

				research.moveUI([pos.left + (e.pageX - researchPrevMouse[0]),
								pos.top + (e.pageY - researchPrevMouse[1])]);
			}
			researchPrevMouse[0] = e.pageX;
			researchPrevMouse[1] = e.pageY;
		});

		const mousewheelevt=(/Firefox/i.test(navigator.userAgent))?'DOMMouseScroll' :'mousewheel'; // Because firefox doesn't know the "mousewheel" event ...
		document.getElementById('research-content').addEventListener(mousewheelevt, function(e){
			let coef = -0.03;
			if (e.wheelDelta > 0 || e.detail < 0) {
				coef = -coef; // Scroll up
			}

			research.makeZoom(coef);
		});

		document.getElementById('research-content').addEventListener('touchstart', function(e) {
			if(e.touches.length === 2 && !research.scaling) {
				research.scaling = true;

				research.dist = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY);
			} else {
				research.scaling = false;
			}
		});
		document.getElementById('research-content').addEventListener('touchmove', function(e) {
			if(research.scaling) {
				const newDist = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY);


				let coef = (research.dist / newDist) - 1;
				if(coef > 0.1) { coef = 0.1; }
				if(coef < -0.1) { coef = -0.1; }
				if(coef === 0) { return; }

				research.makeZoom(-coef);

				research.dist = newDist;
			}
		});
		document.getElementById('research-content').addEventListener('touchend', function() {
			research.scaling = false;
		});

		if(document.getElementById('researchCenter-node')) {
			document.getElementById('researchCenter-node').addEventListener('click', function() {
				research.closeUI();
				planetUI.buildPanelOpen(8);
			});
		}

		if(ui.research) {
			ui.show('#hud-research');
		}
	}

	/**
	 * Calculate & display proper zoom
	 *
	 * @param      {(Function|number|string)}  coef    Zoom difference
	 */
	static makeZoom(coef) {
		coef = parseFloat(parseFloat(coef).toFixed(2));
		research.zoom += coef;
		if(research.zoom < RESEARCH_MIN_ZOOM) { research.zoom -= coef; return; }
		if(research.zoom > RESEARCH_MAX_ZOOM) { research.zoom -= coef; return; }

		const pos = ui.position('#hud-research');
		pos.left = ((pos.left - researchPrevMouse[0]*1.1)/(research.zoom - coef) * research.zoom) + researchPrevMouse[0]*1.1;
		pos.top = ((pos.top - researchPrevMouse[1]*1.1)/(research.zoom - coef) * research.zoom) + researchPrevMouse[1]*1.1;
		document.getElementById('hud-research').style.left = pos.left + 'px';
		document.getElementById('hud-research').style.top = pos.top + 'px';

		document.getElementById('research-content').style.zoom = research.zoom;
		document.getElementById('research-content').style.MozTransform = 'scale(' + research.zoom + ')';
	}

	/**
	 * Closes research UI
	 */
	static closeUI() {
		ui.closeTab('#hud-research');
		// Re-affichage de la planete
		ui.show('#planet');
		// Re-affichage du chat si necessaire
		if(!ui.chat) {
			if(ui.researchChat) {
				ui.show('#hud-chat');
			}
			ui.chat = ui.researchChat;
		}

		ui.research = false;
	}
	/**
	 * Opens research UI
	 */
	static openUI() {
		// On cache la planete et la map
		ui.closeTab('#planet',false);
		ui.closeTab('#hud-map',false); /* A no-bug fix */
		// On centre sur la recherche courante
		if(researchPos[planetData.currResearch] !== undefined) {
			const newUIPos = [
				document.documentElement.clientWidth/2  - researchPos[planetData.currResearch][0]*research.zoom,
				document.documentElement.clientHeight/2 - researchPos[planetData.currResearch][1]*research.zoom
			];
			research.moveUI(newUIPos);
		}
		// On affiche le panel de recherches
		ui.show('#hud-research');
		// On cache le chat et memorise son statut pour plus tard
		ui.researchChat = (document.getElementById('hud-chat').style.display === 'block');
		ui.closeTab('#hud-chat',false);
		ui.chat = false;

		ui.research = true;
	}
	/**
	 * Move the UI
	 */
	static moveUI(pos) {
		if(parseInt(pos[0]) > 0) {
			pos[0] = 0;
		}
		if(parseInt(pos[1]) > 0) {
			pos[1] = 0;
		}
		if(parseInt(pos[0]) < (document.body.clientWidth-RESEARCH_DIV_SIZE*research.zoom)) {
			pos[0] = document.body.clientWidth-RESEARCH_DIV_SIZE*research.zoom;
		}
		if(parseInt(pos[1]) < (document.getElementById('planet').clientHeight-RESEARCH_DIV_SIZE*research.zoom)) {
			pos[1] = document.getElementById('planet').clientHeight-RESEARCH_DIV_SIZE*research.zoom;
		}

		document.getElementById('hud-research').style.left = pos[0] + 'px';
		document.getElementById('hud-research').style.top = pos[1] + 'px';
	}
	/**
	 * Draws research UI
	 */
	static drawPanel() {
		if(research.zoom === undefined) { research.zoom = 1; }

		document.getElementById('research-content').style.zoom = 1;
		document.getElementById('research-content').style.MozTransform = 'scale(1)';

		// !! SVG NEEDS A DISPLAY BLOCK TO WORK !! \\
		document.getElementById('hud-research').style.opacity = 0;
		ui.show('#hud-research');
		// Reset panel content
		document.getElementById('research-content').innerHTML = '<svg id="research-links" width="10000px" height="10000px"></svg>';

		// Create nodes
		for(const key in userData.research) {
			research.drawNode(key);
		}

		// Link Them
		for(const key in userData.research) {
			const current = researchList[key];

			for(let i=0; i<current.parents.length; i++) {
				research.drawLink(key,current.parents[i]);
			}

			if(research.researchedParent(userData, planetData, key) && !research.isSearched(userData, key) && planetData.currResearch !== key && !!document.getElementById(key)) {
				document.getElementById(key).addEventListener('click', () => {
					research.change(key);
				});
			}
		}

		ui.hide('#hud-research');
		document.getElementById('hud-research').style.opacity = 1;

		research.loadUI();
		document.getElementById('research-content').style.zoom = research.zoom;
		document.getElementById('research-content').style.MozTransform = 'scale(' + research.zoom + ')';
	}
	/**
	 * Draws a node.
	 *
	 * @param	  {string}  key	 The node name
	 * @param	  {number}  x	   Node center position x
	 * @param	  {number}  y	   Node center position y
	 * @param	  {string}  parent  The parent
	 */
	static drawNode(key) {
		if(document.querySelectorAll('#'+key+'-node').length > 0) { return; }

		// Place this node
		let className = '';
		if(!research.researchedParent(userData, planetData, key)) {
			className = ' research-node-notAvailable';
		} else if(research.isSearched(userData, key)) {
			className = ' research-node-done';
		} else if(planetData.currResearch === key && !research.isSearched(userData, key)) {
			className = ' research-node-current';
		}
		let content = '<div class="research-node' + className + '" id="' + key + '-node">';

		if(research.researchedParent(userData, planetData, key)) {
			content += '<h2>' + translate.research[key].name + '</h2>';
			content += '<span class="research-desc text-justify">' + translate['research'][key].desc + '</span>';
			content += '<div class="research-bottom">';
			if(!research.isSearched(userData, key)) {
				content += '<span class="research-cost"><img height="20" src="' + cdnURL + 'img/ui/research.svg" alt="research">' + Math.floor(userData.research[key]) + '/' + researchList[key].cost + '</span>';
				if(planetData.currResearch !== key) {
					content += '<a class="research-search" id="' + key + '" src="#research">' + translate['research'].search + '</a>';
				} else {
					content += '<span class="research-search">' + translate['research'].ongoing + '</span>';
				}
			} else {
				content += '<p class="research-ok">' + translate['research'].tech_owned + '</p>';
			}
			content += '</div>';
		} else {
			content += '<h2>???</h2>';
			content += '<span class="research-desc text-center">' + research.getMissingParents(key) + '</span>';
			content += '<div class="research-bottom"><span class="research-cost"><img height="20" src="' + cdnURL + 'img/ui/research.svg" alt="research">?/?</span></div>';
		}
		document.getElementById('research-content').innerHTML = document.getElementById('research-content').innerHTML + content;

		// Position
		const node = document.getElementById(key + '-node');
		if(node) {
			node.style.left = (researchPos[key][0]- (node.offsetHeight)/2) + 'px';
			node.style.top = (researchPos[key][1] - (node.offsetWidth)/2) + 'px';
		}
	}
	/**
	 * Draws a link between 2 nodes
	 *
	 * @param	  {string}  child   The child
	 * @param	  {string}  parent  The parent
	 */
	static drawLink(child,parent) {
		if(child === '' || parent === '' || typeof parent === 'object') { return; }

		if( !(document.querySelectorAll('#'+child+'-node').length) || !(document.querySelectorAll('#'+parent+'-node').length) ) { return; }

		const childPos = ui.position('#' + child + '-node');
		const parentPos = ui.position('#' + parent + '-node');

		const x1 = parseInt(childPos.left) + (parseInt(document.getElementById(child + '-node').clientWidth)/2);
		const y1 = parseInt(childPos.top) + (parseInt(document.getElementById(child + '-node').clientHeight)/2);
		const x2 = parseInt(parentPos.left) + (parseInt(document.getElementById(parent + '-node').clientWidth)/2);
		const y2 = parseInt(parentPos.top) + (parseInt(document.getElementById(parent + '-node').clientHeight)/2);
		let color; //default

		if(research.isSearched(userData, parent)) { color = '#0EC6C6'; }
		else { color = 'rgba(14,198,198,0.2)'; }

		const newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
		newLine.setAttribute('stroke',color);
		newLine.setAttribute('stroke-width','2');
		newLine.setAttribute('x1',x1);
		newLine.setAttribute('y1',y1);
		newLine.setAttribute('x2',x2);
		newLine.setAttribute('y2',y2);
		document.getElementById('research-links').append(newLine);
	}

	/**
	 * Gets the list of missing parents
	 *
	 * @param      {<type>}  key     Current research name
	 * @return     {string}  The missing parents listed as a string
	 */
	static getMissingParents(key) {
		const parents = researchList[key].parents;
		let oneParentOK = false;
		let missingParents = '';

		for(let i=0; i<parents.length; i++) {
			if(typeof parents[i] === 'string') {
				if(!research.isSearched(userData, parents[i]) && parents[i] !== 'researchCenter') {
					missingParents += ', ' + translate['research'][parents[i]].name;

				} else { oneParentOK = true; }
			} else if(typeof parents[i] === 'object' &&
					typeof parents[i][0] === 'number') {

				if(planetData.Buildings[parents[i][0]] < parents[i][1]) {
					missingParents += ', ' + translate['buildings'][parents[i][0]].name + ' ' + translate.messages['LEVEL'] + ' ' + parents[i][1];

				} else { oneParentOK = true; }
			} else if(typeof parents[i] === 'object' &&
					typeof parents[i][0] === 'string') {

				if(parents[i][0] === 'planet' &&
					userData.planetlist !== undefined &&
					userData.planetlist.length < parents[i][1]) {

					missingParents += ', ' + parents[i][1] + ' ' + translate.messages['PLANETS'];
				} else { oneParentOK = true; }
			}
		}

		if(oneParentOK && parents.length>1) {
			return translate['messages']['MISSING_PARENTS'] + ':' + missingParents.substring(1);
		}

		return '???';
	}

	/**
	 * Change current research
	 *
	 * @param      {<type>}  id      Research identifier
	 */
	static change(id) {
		socket.emit('research-change', { username: userData.username, id: userData.id, pid: userData.pid, research: id });
	}

	/**
	 * Ask server to recalc research
	 *
	 * @param      {<type>}  id      Research identifier
	 */
	static sync(id) {
		socket.emit('research-sync', { username: userData.username, id: userData.id, pid: userData.pid });
	}

	/**
	 * Simulate research evolution (client side calculation)
	 */
	static sim() {
		if(userData.research[planetData.currResearch] === undefined) { return; } // If research is undefined
		if(userData.research[planetData.currResearch] === -1) { return; } // If research is finished

		userData.research[planetData.currResearch]+= Research.getResearchProduction(planetData.Buildings[8])/1800;

		if(userData.research[planetData.currResearch]>researchList[planetData.currResearch].cost) {
			userData.research[planetData.currResearch] = -1;

			research.sync();
		}

		document.querySelector('#' + planetData.currResearch + '-node .research-cost').innerHTML = '<img height="20" src="' + cdnURL + 'img/ui/research.svg" alt="research">' + Math.floor(userData.research[planetData.currResearch]) + '/' + researchList[planetData.currResearch].cost;
	}
}

const Research = research;