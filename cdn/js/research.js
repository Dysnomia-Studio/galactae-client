var RESEARCH_DIV_SIZE = 10000;
var RESEARCH_DIV_DISTANCE = 500;
var RESEARCH_DIV_DELTA_DISTANCE = 100;
var researchPrevMouse = [0,0];

class research {
	static touchHandler(event) {
		var touch = event.changedTouches[0];

		var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent({
			touchstart: "mousedown",
			touchmove: "mousemove",
			touchend: "mouseup"
		}[event.type], true, true, window, 1,
			touch.screenX, touch.screenY,
			touch.clientX, touch.clientY, false,
			false, false, false, 0, null);

		touch.target.dispatchEvent(simulatedEvent);
		//event.preventDefault();
	}

	/**
	 * Loader for research UI
	 */
	static loadUI() {
		$("#hud-research-close").click(function() { research.closeUI(); });

		$("#hud-research").on('touchstart touchmove touchend touchcancel', function(e) {
			research.touchHandler(e);
		});

		$("#hud-research").on('touchstart', function(e) {
			researchPrevMouse[0] = e.pageX;
			researchPrevMouse[1] = e.pageY;
		});
		$("#hud-research").mousemove(function(e) {
			if(ui.mouseStatus[1]==1) {
				var pos = $("#hud-research").position();
				research.moveUI([pos.left + (e.pageX - researchPrevMouse[0]),
								pos.top + (e.pageY - researchPrevMouse[1])]);
			}
			researchPrevMouse[0] = e.pageX;
			researchPrevMouse[1] = e.pageY;
		});

		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))?'DOMMouseScroll' :'mousewheel'; // Because firefox doesn't know the "mousewheel" event ...
		$('#hud-research-content').on(mousewheelevt, function(e){
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				var coef = 0.03; // Scroll up
			} else {			
				var coef = -0.03; // Scroll down
			}

			research.zoom += coef;
			if(research.zoom < 0.5) { research.zoom -= coef; return; }
			if(research.zoom > 1.75) { research.zoom -= coef; return; }

			var pos = $("#hud-research").position();
			pos.left = ((pos.left - researchPrevMouse[0])/(research.zoom - coef) * research.zoom) + researchPrevMouse[0];
			pos.top = ((pos.top - researchPrevMouse[1])/(research.zoom - coef) * research.zoom) + researchPrevMouse[1];
			$("#hud-research").css("left",pos.left);
			$("#hud-research").css("top" ,pos.top );
					
			$('#hud-research-content').css('zoom',research.zoom);
			$('#hud-research-content').css('-moz-transform','scale(' + research.zoom + ')');
		});

		$('#researchCenter-node').click(function() {
			research.closeUI();
			planet.buildPanelOpen(8);
		});

		if(ui.research) {
			$("#hud-research").css('display','block');
		}
	}
	/**
	 * Closes research UI
	 */
	static closeUI() {
		ui.closeTab("#hud-research");
		// Re-affichage de la planete
		$("#planet").css('display','block');
		// Re-affichage du chat si necessaire
		if(!ui.chat) {
			$("#hud-chat").css('display',(ui.researchChat)?"block":"none");
			ui.chat = ui.researchChat;
		}

		ui.research = false;
	}
	/**
	 * Opens research UI
	 */
	static openUI() {
		// On cache la planete et la map
		ui.closeTab("#planet",false);
		ui.closeTab("#hud-map",false); /* A no-bug fix */
		// On centre sur la recherche courante
		if(researchPos[planetData.currResearch] !== undefined) {
			var newUIPos = [
				$(document).width()/2  - researchPos[planetData.currResearch][0]*research.zoom,
				$(document).height()/2 - researchPos[planetData.currResearch][1]*research.zoom
			];
			research.moveUI(newUIPos);
		}
		// On affiche le panel de recherches
		$("#hud-research").css('display','block');
		// On cache le chat et memorise son statut pour plus tard	
		ui.researchChat = ($("#hud-chat").css('display')=="block");
		ui.closeTab("#hud-chat",false);
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
		if(parseInt(pos[0]) < ($(document).width()-RESEARCH_DIV_SIZE*research.zoom)) {
			pos[0] = $(document).width()-RESEARCH_DIV_SIZE*research.zoom;
		}
		if(parseInt(pos[1]) < ($(document).height()-RESEARCH_DIV_SIZE*research.zoom)) {
			pos[1] = $(document).height()-RESEARCH_DIV_SIZE*research.zoom;
		}

		$("#hud-research").css({
			left: pos[0],
			top: pos[1]
		});
	}
	/**
	 * Draws research UI
	 */
	static drawPanel() {
		if(research.zoom === undefined) { research.zoom = 1; }

		$('#hud-research-content').css('zoom', 1);
		$('#hud-research-content').css('-moz-transform','scale(1)');

		// !! SVG NEEDS A DISPLAY BLOCK TO WORK !! \\
		$('#hud-research').css("opacity",0);
		$('#hud-research').css("display","block");
		// Reset panel content
		$('#hud-research-content').html('<svg id="hud-research-links" width="10000px" height="10000px"></svg>');

		// Create nodes
		for(var key in researchPos) {
			research.drawNode(key);
		}

		// Link Them
		for(var key in researchList) {
			var current = researchList[key];

			for(var i=0; i<current.parents.length; i++) {
				research.drawLink(key,current.parents[i]);
			}
		}

		$('#hud-research').css("display","none");
		$('#hud-research').css("opacity",1);

		research.loadUI();
		$('#hud-research-content').css('zoom',research.zoom);
		$('#hud-research-content').css('-moz-transform','scale(' + research.zoom + ')');
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
		if( $('#'+key+'-node').length ) { return; }

		// Place this node
		if(planetData.currResearch==key) {
			var content = '<div class="research-node current-research-node" id="' + key + '-node">';
		} else {
			var content = '<div class="research-node" id="' + key + '-node">';
		}

		if(research.canResearch(key)) {
			content += '<h2>' + translate['research'][key].name + '</h2>';
			content += '<span class="research-desc">' + translate['research'][key].desc + '</span>';
			content += '<div class="research-bottom">';
			if(!research.isSearched(key)) {
				content += '<span class="research-cost"><img height="20" src="'+cdnURL+'img/ui/research.svg" alt="research">' + Math.floor(userData.research[key]) + '/' + researchList[key].cost + '</span>';
				if(planetData.currResearch!=key) {
					content += '<a class="research-search" id="'+key+'" src="#research">' + translate['research']['search'] + '</a>';
				} else {
					content += '<span class="research-search">' + translate['research']['ongoing'] + '</span>';
				}
			} else {
				content += '<p class="research-ok">' + translate['research']['tech_owned'] + '</p>';
			}
			content += "</div>";
		} else {
			content += '<h2>???</h2>';
			content += '<span class="research-desc">' + research.getMissingParents(key) + '</span>';
			content += '<div class="research-bottom"><span class="research-cost"><img height="20" src="'+cdnURL+'img/ui/research.svg" alt="research">?/?</span></div>';
		}

		$('#hud-research-content').append(content);

		// Position
		$('#' + key + '-node').css("left",  researchPos[key][0]- ($('#' + key + '-node').height())/2 );
		$('#' + key + '-node').css("top", researchPos[key][1] - ($('#' + key + '-node').width())/2  );

		if(research.canResearch(key) && !research.isSearched(key) && planetData.currResearch!=key) {
			$('#'+key).click(function(){
				research.change(key);
			});
		}
	}
	/**
	 * Draws a link between 2 nodes
	 *
	 * @param	  {string}  child   The child
	 * @param	  {string}  parent  The parent
	 */
	static drawLink(child,parent) {
		if(child=="" || parent=="") { return; }

		if( !($('#'+child+'-node').length) || !($('#'+parent+'-node').length) ) { return; }

		var childPos = $('#' + child + '-node').position();
		var parentPos = $('#' + parent + '-node').position();

		var x1 = parseInt(childPos.left) + (parseInt($('#' + child + '-node').width())/2);
		var y1 = parseInt(childPos.top) + (parseInt($('#' + child + '-node').height())/2);
		var x2 = parseInt(parentPos.left) + (parseInt($('#' + parent + '-node').width())/2);
		var y2 = parseInt(parentPos.top) + (parseInt($('#' + parent + '-node').height())/2);
		var color; //default 

		if(research.isSearched(parent)) { color = '#0EC6C6'; } 
		else { color = 'rgba(14,198,198,0.2)'; }

		var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
		newLine.setAttribute('stroke',color);
		newLine.setAttribute('stroke-width','2');
		newLine.setAttribute('x1',x1);
		newLine.setAttribute('y1',y1);
		newLine.setAttribute('x2',x2);
		newLine.setAttribute('y2',y2);
		$("#hud-research-links").append(newLine);
	}
	/**
	 * Determines ability to research.
	 *
	 * @param	  {<type>}   key	 The research name
	 * @return	 {boolean}  True if able to research, False otherwise.
	 */
	static canResearch(key) {
		var parents = researchList[key].parents;

		for(var i=0; i<parents.length; i++) {
			if(userData.research[parents[i]]==undefined) { userData.research[parents[i]]=0; } // No bug then
			/**
			 * Research Status:
			 * 0  => Not Begin
			 * >0 => In progress
			 * -1 => Finished
			 */
			if(userData.research[parents[i]]!=-1 && parents[i]!="researchCenter") {
				return false;
			}
			
		}
		return true;
	}

	static getMissingParents(key) {
		var parents = researchList[key].parents;
		var oneParentOK = false;
		var missingParents = "";

		for(var i=0; i<parents.length; i++) {
			if(userData.research[parents[i]]==undefined) { userData.research[parents[i]]=0; } // No bug then
			/**
			 * Research Status:
			 * 0  => Not Begin
			 * >0 => In progress
			 * -1 => Finished
			 */
			if(userData.research[parents[i]]!=-1 && parents[i]!="researchCenter") {
				if(missingParents!="") { missingParents+=","; }
				missingParents += " " + translate['research'][parents[i]].name;
			} else { // == -1 or parent is researchCenter
				oneParentOK = true;
			}
			
		}

		if(oneParentOK && parents.length>1) {
			return translate["messages"]['MISSING_PARENTS'] + ':' + missingParents;
		}

		return "???";
	}

	/**
	 * Determines if searched.
	 *
	 * @param	  {string}   key	 The research name
	 * @return	 {boolean}  True if searched, False otherwise.
	 */
	static isSearched(key) {
		return (userData.research[key]==-1 || key=="researchCenter");
	}

	static change(id) {
		socket.emit('research-change', { username: userData.username, id: userData.id, pid: userData.pid, research: id });
 	}

 	static sync(id) {
 		socket.emit('research-sync', { username: userData.username, id: userData.id, pid: userData.pid });
 	}	

 	static sim() {
 		if(userData.research[planetData.currResearch]==-1) { return; } // If research is finished
 		if(researchList[planetData.currResearch] == undefined) { return; } // If research is undefined

 		userData.research[planetData.currResearch]+= (researchProduction[0]*Math.pow(planetData.Buildings[8],2) + researchProduction[1]* planetData.Buildings[8] + researchProduction[2])/1800
 		
 		if(userData.research[planetData.currResearch]>researchList[planetData.currResearch].cost) {
 			userData.research[planetData.currResearch] = -1;
			ui.notify("Galactae: " + translate["messages"]['ENDED_RESEARCH'], {
				icon: cdnURL+"img/favicon.png",
				body: translate["messages"]['ENDED_RESEARCH'] + ": " + translate['research'][planetData.currResearch].name
			});
 			research.sync();
 		}
 		
 		$("#"+planetData.currResearch+"-node .research-cost").html("<img height=\"20\" src=\""+cdnURL+"img/ui/research.svg\" alt=\"research\">" + Math.floor(userData.research[planetData.currResearch]) +"/"+researchList[planetData.currResearch].cost);
 	}
}