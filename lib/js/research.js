var RESEARCH_DIV_SIZE = 10000;
var RESEARCH_DIV_DISTANCE = 500;
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

				$("#hud-research").css("left",pos.left + (e.pageX - prevMouse[0]));
				$("#hud-research").css("top",pos.top + (e.pageY - prevMouse[1]));

				if($("#hud-research").css("left")< 0) {
					$("#hud-research").css("left") = 0;
				}
				if($("#hud-research").css("top")< 0) {
					$("#hud-research").css("top") = 0;
				}
			}
			prevMouse[0] = e.pageX;
			prevMouse[1] = e.pageY;
		});
		$('#hud-research').bind('mousewheel', function(e){
			var zoom = parseFloat($('#hud-research').css('zoom'));
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				// scroll up
				zoom += 0.05;
			}
			else {
				// scroll down
				zoom -= 0.05;
			}

			if(zoom < 0.05) { zoom = 0.05; }
			if(zoom > 2) { zoom = 2; }


			$('#hud-research').css('zoom',zoom);
		});
	}
	/**
	 * Closes research UI
	 */
	static closeUI() {
		ui.closeTab("#hud-research");
		// Re-affichage de la planete
		$("#planet-content").css('display','block');
		// Re-affichage du chat si necessaire
		$("#hud-chat").css('display',(ui.researchChat)?"block":"none");
		ui.chat = ui.researchChat;

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
	 * Draws research UI
	 */
	static drawPanel() {
		research.list = {
			// Noeud Central
			researchCenter: 	{ cost: 0, parents: [] },
			industrialistion: 	{ cost: 0, parents: ["researchCenter"] },		
			phyContemporaine: 	{ cost: 0, parents: ["researchCenter"] },	
			thermodynamique: 	{ cost: 0, parents: ["researchCenter"] },
			// Mise en orbite et propulsion
			prop_thermique: 	{ cost: 0, parents: ["thermodynamique","misc_mecStellaire",] },
			prop_vSolaire: 		{ cost: 0, parents: ["prop_thermique","misc_phySolaire"] },
			prop_ions: 			{ cost: 0, parents: ["prop_thermique","misc_phyQuantique"] },
			prop_vsl: 			{ cost: 0, parents: ["prop_ions","misc_advTelemetrie"] },
			prop_hyperespace: 	{ cost: 0, parents: ["prop_vsl"] },
			prop_manoeuvre: 	{ cost: 0, parents: ["prop_thermique"] },
			prop_advManoeuvre: 	{ cost: 0, parents: ["prop_manoeuvre"] },
			// Construction et production
			cp_mecanisation: 	{ cost: 0, parents: ["industrialistion"] },
			cp_tracteur: 	 	{ cost: 0, parents: ["industrialistion"] },
			cp_materielTp: 		{ cost: 0, parents: ["cp_tracteur","misc_advTelemetrie"] },
			cp_dbRaffinage: 	{ cost: 0, parents: ["industrialistion"] },
			// Armes
			wep_railgun:		{ cost: 0, parents: ["phyContemporaine"] },
			wep_nuke:			{ cost: 0, parents: ["wep_railgun"] },
			wep_laser:			{ cost: 0, parents: ["wep_railgun","misc_phyQuantique"] },
			wep_plasma:			{ cost: 0, parents: ["wep_laser"] },
			// Mines spatiales
			wep_mines: 			{ cost: 0, parents: ["misc_calcGravit","misc_telemetrie",] },
			wep_mines_nuke:		{ cost: 0, parents: ["wep_mines","wep_nuke"] },
			wep_mines_iem:		{ cost: 0, parents: ["wep_mines","misc_em"] },
			// Satellites
			wep_sat_railgun:	{ cost: 0, parents: ["misc_calcGravit","wep_railgun"] },
			wep_sat_laser:		{ cost: 0, parents: ["wep_sat_railgun","wep_laser"] },
			wep_sat_plasma:		{ cost: 0, parents: ["wep_sat_laser","wep_plasma"] },
			// Autres recherches
			misc_astronomie:	{ cost: 0, parents: ["phyContemporaine"] },
			misc_telemetrie: 	{ cost: 0, parents: ["misc_astronomie"] },
			misc_advTelemetrie: { cost: 0, parents: ["misc_telemetrie"] },
			misc_mecStellaire: 	{ cost: 0, parents: ["misc_calcGravit"] },
			misc_phyQuantique: 	{ cost: 0, parents: ["phyContemporaine"] },
			misc_phySolaire: 	{ cost: 0, parents: ["misc_phyQuantique"] },
			misc_calcGravit: 	{ cost: 0, parents: ["misc_astronomie"] },
			misc_em: 			{ cost: 0, parents: ["phyContemporaine"] },
		};

		// !! SVG NEEDS A DISPLAY BLOCK TO WORK !! \\
		$('#hud-research').css("opacity",0);
		$('#hud-research').css("display","block");
		// Reset panel content
		$('#hud-research').html('<span id="hud-research-close">X</span>');
		$('#hud-research').append('<svg id="hud-research-links" width="10000px" height="10000px"></svg>');

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
	static drawNode(key,x,y,parent="") {
		if( $('#'+key+'-node').length ) { return; }

		// Place this node
		if(planetData.currResearch==key) {
			var content = '<div class="research-node current-research-node">';
		} else {
			var content = '<div class="research-node" id="' + key + '-node">';
		}

		if(research.canResearch(key)) {
			content += '<h2>' + researchList[key].name + '</h2>';
			content += '<span class="research-desc">' + researchList[key].desc + '</span>';
			if(!research.isSearched(key)) {
				content += '<span class="research-cost"><img height="20" src="img/ui/research.png" alt="research">' + userData.research[key] + '/' + research.list[key].cost + '</span>';
				content += '<a class="research-search" id="'+key+'" src="#research">Rechercher</a>'; // @ADD: Logo
			} else {
				content += '<p class="research-ok">Technologie possédée</p>'
			}
		} else {
			content += '<h2>???</h2>';
			content += '<span class="research-desc">???</span>';
			content += '<span class="research-cost"><img height="20" src="img/ui/research.png" alt="research">?/?</span>';
		}

		$('#hud-research').append(content);

		// Position
		$('#' + key + '-node').css("left",  x - ($('#' + key + '-node').height())/2 );
		$('#' + key + '-node').css("top", y - ($('#' + key + '-node').width())/2  );

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
			var base = (topChild - topParent) / RESEARCH_DIV_DISTANCE;
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

				research.drawNode(keyChild,x + RESEARCH_DIV_DISTANCE*Math.cos(angle),y + RESEARCH_DIV_DISTANCE*Math.sin(angle),key);

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

		if(research.canResearch(child)) { color = '#0EC6C6'; } 
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
	/**
	 * Determines if searched.
	 *
	 * @param      {string}   key     The research name
	 * @return     {boolean}  True if searched, False otherwise.
	 */
	static isSearched(key) {
		return (userData.research[key]==-1 || key=="researchCenter");
	}
}