var RESEARCH_DIV_SIZE = 10000;
var RESEARCH_DIV_DISTANCE = 500;
var RESEARCH_DIV_DELTA_DISTANCE = 100;
var prevMouse = [0,0];

class research {
	/**
	 * Loader for research UI
	 */
	static loadUI() {
		$("#hud-research-close").click(function() { research.closeUI() });
		$("#hud-research").mousemove(function(e) {
			if(ui.mouseStatus[1]==1) {
				var pos = $("#hud-research").position();
				research.moveUI([pos.left + (e.pageX - prevMouse[0]),
								pos.top + (e.pageY - prevMouse[1])]);
			}
			prevMouse[0] = e.pageX;
			prevMouse[1] = e.pageY;
		});
		$('#hud-research-content').bind('mousewheel', function(e){
			var zoom = parseFloat($('#hud-research-content').css('zoom'));

			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				var coef = 0.025; // Scroll up
			} else {			
				var coef = -0.025; // Scroll down
			}

			zoom += coef;
			if(zoom < 0.5) { zoom = 0.5; }
			if(zoom > 2) { zoom = 2; }
					
			//$('#hud-research-content').css('zoom',zoom);
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
		$("#planet-content").css('display','block');
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
		ui.closeTab("#planet-content",false);
		ui.closeTab("#hud-map",false); /* A no-bug fix */
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
		$("#hud-research").css("left",pos[0]);
		$("#hud-research").css("top",pos[1]);

		if($("#hud-research").css("left")< 0) {
			$("#hud-research").css("left") = 0;
		}
		if($("#hud-research").css("top")< 0) {
			$("#hud-research").css("top") = 0;
		}
	}
	/**
	 * Draws research UI
	 */
	static drawPanel() {
		research.list = {
			// Noeud Central
			researchCenter: 	{ cost: 0, parents: [] },
			industrialistion: 	{ cost: 8, parents: ["researchCenter"] },		
			phyContemporaine: 	{ cost: 20, parents: ["researchCenter"] },	
			thermodynamique: 	{ cost: 13, parents: ["researchCenter"] },
			// Mise en orbite et propulsion
			prop_thermique: 	{ cost: 380, parents: ["thermodynamique","misc_mecStellaire",] },
			prop_vSolaire: 		{ cost: 2300, parents: ["prop_thermique","misc_phySolaire"] },
			prop_ions: 			{ cost: 2000, parents: ["prop_thermique","misc_phyQuantique"] },
			prop_vsl: 			{ cost: 15000, parents: ["prop_ions","misc_advTelemetrie"] },
			prop_hyperespace: 	{ cost: 35000, parents: ["prop_vsl"] },
			prop_manoeuvre: 	{ cost: 450, parents: ["prop_thermique"] },
			prop_advManoeuvre: 	{ cost: 700, parents: ["prop_manoeuvre"] },
			// Construction et production
			cp_mecanisation: 	{ cost: 120, parents: ["industrialistion"] },
			cp_tracteur: 	 	{ cost: 150, parents: ["industrialistion"] },
			cp_materielTp: 		{ cost: 350, parents: ["cp_tracteur","misc_advTelemetrie"] },
			cp_dbRaffinage: 	{ cost: 100, parents: ["industrialistion"] },
			// Armes
			wep_railgun:		{ cost: 50, parents: ["phyContemporaine"] },
			wep_nuke:			{ cost: 180, parents: ["wep_railgun"] },
			wep_laser:			{ cost: 260, parents: ["wep_railgun","misc_phyQuantique"] },
			wep_plasma:			{ cost: 480, parents: ["wep_laser"] },
			// Mines spatiales
			wep_mines: 			{ cost: 380, parents: ["misc_calcGravit","misc_telemetrie",] },
			wep_mines_nuke:		{ cost: 750, parents: ["wep_mines","wep_nuke"] },
			wep_mines_iem:		{ cost: 550, parents: ["wep_mines","misc_em"] },
			// Satellites
			wep_sat_railgun:	{ cost: 360, parents: ["misc_calcGravit","wep_railgun"] },
			wep_sat_laser:		{ cost: 650, parents: ["wep_sat_railgun","wep_laser"] },
			wep_sat_plasma:		{ cost: 1500, parents: ["wep_sat_laser","wep_plasma"] },
			// Autres recherches
			misc_astronomie:	{ cost: 45, parents: ["phyContemporaine"] },
			misc_telemetrie: 	{ cost: 90, parents: ["misc_astronomie"] },
			misc_advTelemetrie: { cost: 320, parents: ["misc_telemetrie"] },
			misc_mecStellaire: 	{ cost: 340, parents: ["misc_calcGravit"] },
			misc_phyQuantique: 	{ cost: 120, parents: ["phyContemporaine"] },
			misc_phySolaire: 	{ cost: 280, parents: ["misc_phyQuantique"] },
			misc_calcGravit: 	{ cost: 240, parents: ["misc_astronomie"] },
			misc_em: 			{ cost: 110, parents: ["phyContemporaine"] },
		};

		// !! SVG NEEDS A DISPLAY BLOCK TO WORK !! \\
		$('#hud-research').css("opacity",0);
		$('#hud-research').css("display","block");
		// Reset panel content
		$('#hud-research-content').html('<svg id="hud-research-links" width="10000px" height="10000px"></svg>');

		// Create nodes
		research.drawNode("researchCenter",10000/2,10000/2);

		// Link Them
		for(var key in research.list) {
			var current = research.list[key];

			for(var i=0; i<current.parents.length; i++) {
				research.drawLink(key,current.parents[i]);
			}
		}

		$('#hud-research').css("display","none");
		$('#hud-research').css("opacity",1);

		research.loadUI();
	}
	/**
	 * Draws a node.
	 *
	 * @param      {string}  key     The node name
	 * @param      {number}  x       Node center position x
	 * @param      {number}  y       Node center position y
	 * @param      {string}  parent  The parent
	 */
	static drawNode(key,x,y,parent="",parentCount=0) {
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
			if(!research.isSearched(key)) {
				content += '<span class="research-cost"><img height="20" src="'+cdnURL+'img/ui/research.png" alt="research">' + Math.floor(userData.research[key]) + '/' + research.list[key].cost + '</span>';
				if(planetData.currResearch!=key) {
					content += '<a class="research-search" id="'+key+'" src="#research">Rechercher</a>'; // @ADD: Logo
				} else {
					content += '<span class="research-search">Recherche en cours ...</span>';
				}
			} else {
				content += '<p class="research-ok">Technologie possédée</p>'
			}
		} else {
			content += '<h2>???</h2>';
			content += '<span class="research-desc">' + research.getMissingParents(key) + '</span>';
			content += '<span class="research-cost"><img height="20" src="'+cdnURL+'img/ui/research.png" alt="research">?/?</span>';
		}

		$('#hud-research-content').append(content);

		// Position
		$('#' + key + '-node').css("left",  x - ($('#' + key + '-node').height())/2 );
		$('#' + key + '-node').css("top", y - ($('#' + key + '-node').width())/2  );

		if(research.canResearch(key) && !research.isSearched(key) && planetData.currResearch!=key) {
			$('#'+key).click(function(){
				research.change(key);
			});
		}

		var count = 0;
		var countAngles = 0; 
		var baseAngle = 0;

		// Childs
		for(var keyChild in research.list) {
			if(research.list[keyChild].parents.length > 0 && research.list[keyChild].parents[0]==key) { count++; }
		}

		if(count==0) { return; } // No child

		if(parent!="") {
			count++;
			//countAngles++;
			var topParent = parseInt($('#' + parent + '-node').position().top);
			var topChild = parseInt($('#' + key + '-node').position().top);
			var base = (topChild - topParent) / (RESEARCH_DIV_DISTANCE + (parentCount*RESEARCH_DIV_DELTA_DISTANCE));
			while(base>1) { base-=2; }
			while(base<-1) { base+=2; }
			baseAngle = Math.asin(base); 

			/*if(parent=="researchCenter" || (research.list[parent]!=undefined && research.list[parent].parent !=undefined && research.list[parent].parent.indexOf("researchCenter")!==-1)) {
				baseAngle -= Math.PI/2;
				count*=2;
			}*/
			if(key!="researchCenter") {
				//baseAngle -= Math.PI/2;
				count*=2;
			}
		}
		
		var uniqueAngle = 2 * Math.PI / count;

		for(var keyChild in research.list) {
			var current = research.list[keyChild];

			if(current.parents.length > 0 && current.parents[0]==key) {
				var angle = (baseAngle + uniqueAngle*countAngles)%(2 * Math.PI);

				research.drawNode(keyChild,x + (RESEARCH_DIV_DISTANCE + (parentCount*RESEARCH_DIV_DELTA_DISTANCE))*Math.cos(angle),y + (RESEARCH_DIV_DISTANCE + (parentCount*RESEARCH_DIV_DELTA_DISTANCE))*Math.sin(angle),key,parentCount+1);

				countAngles++;
			}
		}
	}
	/**
	 * Draws a link between 2 nodes
	 *
	 * @param      {string}  child   The child
	 * @param      {string}  parent  The parent
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
		else { color = 'rgba(14,198,198,0.3)'; }

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
	 * @param      {<type>}   key     The research name
	 * @return     {boolean}  True if able to research, False otherwise.
	 */
	static canResearch(key) {
		var parents = research.list[key].parents;

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
		var parents = research.list[key].parents;
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
	 * @param      {string}   key     The research name
	 * @return     {boolean}  True if searched, False otherwise.
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
 		userData.research[planetData.currResearch]+= (researchProduction[0]*Math.pow(planetData.Buildings[8],2) + researchProduction[1]* planetData.Buildings[8] + researchProduction[2])/1800
 		
 		if(userData.research[planetData.currResearch]>research.list[planetData.currResearch].cost) {
 			userData.research[planetData.currResearch] = research.list[planetData.currResearch].cost;
			ui.notify("Galactae: " + translate["messages"]['ENDED_RESEARCH'], {
				icon: cdnURL+"img/favicon.png",
				body: translate["messages"]['ENDED_RESEARCH'] + ": " + translate['research'][planetData.currResearch].name
			});
 			research.sync();
 		}
 		
 		$("#"+planetData.currResearch+"-node .research-cost").html("<img height=\"20\" src=\""+cdnURL+"img/ui/research.png\" alt=\"research\">" + Math.floor(userData.research[planetData.currResearch]) +"/"+research.list[planetData.currResearch].cost);
 	}
}