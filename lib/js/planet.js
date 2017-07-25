var resourcesinterval = -1;
var autobuildingrefresh = -1;
var canbebuildtimeout = -1;

var buildingsNames = [
	"carriere",
	"metallurgy",
	"living",
	"serre",
	"solar",
	"warehouse",
	"headquarter",
	"launchpad",
	"research",

	"radar",
	"tank",
	"shipyard",
	"trade",
	"he3exp"
];

var maxLevels = [
	25,	// Carriere
	25,	// Metallurgie
	25,	// Habitations
	25,	// Serres
	30,	// Centrales Solaires
	25,	// Entrepôts
	5,	// Etat Major
	30,	// Centre de lancement
	30,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25	// Mine He3
];

var planetData = { //Not complete but some are needed on init because of bugs
	planetType: 0,
	id: userData.pid,
	resources: {},
	Buildings: {},
}

var ratio;
var storageRatioMetals; // Metaux
var storageRatioMinerals; // Minerais
var storageHelium; // Helium 3
 
var mineralsProd; // Production de minerais
var metalBaseProd; // Production de metaux
var metalBaseProd1; // Production de metaux lvl + 1
var heliumProd; // Production d'Helium 3

var energyProd; // Production energetique
var energyCons; // Consomation energetique

class planet {
	/* sync
	Ask to the server data on current planet
	INPUT: -
	OUTPUT: -
	*/
	static sync() {
		socket.emit('planet-ask-data', userData);
	}
	/* refresh
	Rafraichir les données affichées et stockées
	INPUT: data
	OUTPUT: -
	*/
	static refresh(data) {
		// Keep planet id in a cookie
		setCookie('galactae-account-pid', data.data._id, 1);

		planet.deltaNow = data.sNow - Date.now();

		// Clientside Calc for ressource auto-update
		if(resourcesinterval==-1) {
			resourcesinterval = setInterval(function() { planet.simMyRealRessources(); },2000);
		}

		for(var key in data.data) {
			planetData[key] = data.data[key];
		}

		userData.pid = planetData._id;

		// Edit Data
		planet.BuildingDrawUpdate();
		planet.ResourcesDrawUpdate(); // Needed to be after building for ratios
		planet.MiscDrawUpdate();
		planet.drawCanBeBuild();

		// Clear existing timeout
		if(autobuildingrefresh!=-1) {
			clearTimeout(autobuildingrefresh);
			autobuildingrefresh = -1;
		}
		// Create timeout: sync where the next building is ended
		if(planetData.nextBuildingTime != -1) {
			autobuildingrefresh = setTimeout(function() {
				planet.sync();
				autobuildingrefresh = -1;
			},planetData.nextBuildingTime-Date.now()+planet.deltaNow+1);
		}
		
		// Refresh buildPanel
		if(ui.buildPanel!= -1) {
			ui.buildPanelOpen(ui.buildPanel);
		}
	}
	/* simMyRealRessources
	ClientSide simulation of growing resources
	INPUT: -
	OUTPUT: -
	*/
	static simMyRealRessources() {
		var ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];
		var time = 2/3600; // 2 sec

		// Minerals
		planetData.resources[0] += (mineralsProd)*time; //Production Algorithm

		//Helium 3
		planetData.resources[1] += heliumProd*time;

		//Metals
		if(planetData.resources[0]-(metalBaseProd/360)>0) { //Verify if you can use basic ressources
		    for(var i=2; i<6; i++) {
		    	planetData.resources[i] += (metalBaseProd*time)*ratios[i-2];
		    }

			planetData.resources[0] -= (metalBaseProd*time); //Consomation Algorithm
		} else { // Do the max we can
		    for(var i=2; i<6; i++) {
		    	planetData.resources[i] += planetData.resources[0]*ratios[i-2];
		    }

			planetData.resources[0] = 0;
		}

		// Max de tout les metaux
		if((planetData.resources[5]>storageRatioMetals*ratio.titanRatio) && 
			(planetData.resources[4]>storageRatioMetals*ratio.copperRatio) && 
			(planetData.resources[3]>storageRatioMetals*ratio.aluRatio) && 
			(planetData.resources[2]>storageRatioMetals*ratio.ironRatio)) {

			var min = (planetData.resources[2] - storageRatioMetals*ratios[0])/ratios[0];

			for(var i=3; i<6; i++) {
				var temp = (planetData.resources[i] - storageRatioMetals*ratios[i-2])/ratios[i-2];

				if(temp<min) {
					min = temp;
				}
			}
			planetData.resources[0]+=min
		    for(var i=2; i<6; i++) {
		    	planetData.resources[i] -= min*ratios[i-2];
		    }
		}
		//Max Storage
		if(planetData.resources[0]>storageRatioMinerals) {
			planetData.resources[0] = storageRatioMinerals;
		}
		if(planetData.resources[1]>storageHelium) {
			planetData.resources[1] = storageHelium;
		}
		if(planetData.resources[2]>storageRatioMetals*ratio.ironRatio) { // You can't have more iron than your storage capacity
			planetData.resources[2] = storageRatioMetals*ratio.ironRatio;
		}
		if(planetData.resources[3]>storageRatioMetals*ratio.aluRatio) { // You can't have more aluminium than your storage capacity
			planetData.resources[3] = storageRatioMetals*ratio.aluRatio;
		}
		if(planetData.resources[4]>storageRatioMetals*ratio.copperRatio) { // You can't have more copper than your storage capacity
			planetData.resources[4] = storageRatioMetals*ratio.copperRatio;
		}
		if(planetData.resources[5]>storageRatioMetals*ratio.titanRatio) { // You can't have more titanium than your storage capacity
			planetData.resources[5] = storageRatioMetals*ratio.titanRatio;
		}


		planet.ResourcesDrawUpdate();

		//console.log(getStringTime((planetData.nextBuildingTime-Date.now())/3600/1000));
	}
	/* GetMineralsRatio
	Obtenir le ratio de minerais selon le type de planète
	INPUT: -
	OUTPUT: ratios (objet)
	*/
	static GetMineralsRatio() {
		var ironRatio;
		var aluRatio;
		var copperRatio;
		var titanRatio;

		switch(planetData.planetType) {
			case 0: //Earth type
				ironRatio = 0.35;
				aluRatio = 0.50;
				copperRatio = 0.04;
				titanRatio = 0.10;
			break;
			case 1:
				ironRatio = 0.1;
				aluRatio = 0.2;
				copperRatio = 0.3;
				titanRatio = 0.4;
			break;
			default:
				ironRatio = 42;
				aluRatio = 42;
				copperRatio = 42;
				titanRatio = 42;	
			break;
		}
		return {ironRatio: ironRatio ,aluRatio: aluRatio ,copperRatio: copperRatio ,titanRatio: titanRatio};		
	}
	/* build
	Construire un bâtiment
	INPUT: -
	OUTPUT: -
	*/
	static build(id) {
		if(planetData.Buildings[id]+1 > maxLevels[id]) {
			ui.drawMessage('MAX_LEVEL');
		} else {
			socket.emit('planet-build', { planet: planetData._id, id: userData.id, username: userData.username, building: id });
		}
	}
	/* ResourcesDrawUpdate
	Afficher les modifications de quantité de ressources
	INPUT: -
	OUTPUT: -
	*/
	static ResourcesDrawUpdate() {
		//Top left
		$('#population_nmb').html(GetBetterUnit(Math.round(3242*Math.exp(0.3608*planetData.Buildings[2]))));
		$('#research_nmb').html(GetBetterUnit(Math.round(1.96*Math.exp(0.2295*planetData.Buildings[8]))));
		$('#moral_nmb').html(50+'%');

		//Top right
		$('#minerals_nmb').html(GetBetterUnit(planetData.resources[0],'t',storageRatioMinerals));
		$('#he_nmb').html(GetBetterUnit(planetData.resources[1],'t',storageHelium));
		$('#fe_nmb').html(GetBetterUnit(planetData.resources[2],'t',storageRatioMetals*ratio.ironRatio));
		$('#al_nmb').html(GetBetterUnit(planetData.resources[3],'t',storageRatioMetals*ratio.aluRatio));
		$('#cu_nmb').html(GetBetterUnit(planetData.resources[4],'t',storageRatioMetals*ratio.copperRatio));
		$('#ti_nmb').html(GetBetterUnit(planetData.resources[5],'t',storageRatioMetals*ratio.titanRatio));
	}
	/* BuildingDrawUpdate
	Afficher les modifications en rapport avec les batiments (niveaux ou production)
	INPUT: -
	OUTPUT: -
	*/
	static BuildingDrawUpdate() {
		ratio = planet.GetMineralsRatio(planetData.planetType);

		mineralsProd = 2*Math.pow(planetData.Buildings[0],2)-2*planetData.Buildings[0]+145; // Minerals
		metalBaseProd = 1.85*Math.pow(planetData.Buildings[1],2)-3* planetData.Buildings[1]+139; // Metaux
		metalBaseProd1 = 1.85*Math.pow(planetData.Buildings[1]+1,2)-3*(planetData.Buildings[1]+1)+139; // Metaux lvl+1
		heliumProd = (planetData.Buildings[13]!=0)?(190*Math.pow(planetData.Buildings[13],2)-424*planetData.Buildings[13]+500):0;

		storageRatioMetals = (1.85*Math.pow(planetData.Buildings[5],2)-3* planetData.Buildings[5]+139)*(47.52*Math.log(planetData.Buildings[5]) + 8.29); // Metaux
		storageRatioMinerals = (2*Math.pow(planetData.Buildings[5],2)-2*planetData.Buildings[5]+145)*(47.52*Math.log(planetData.Buildings[5]) + 8.29); // Minerais
		storageHelium = (planetData.Buildings[10]!=0)?((190*Math.pow(planetData.Buildings[10],2)-424*planetData.Buildings[10]+500)/5)*(47.52*Math.log(planetData.Buildings[10]) + 8.29):0; // Helium 3

		// Energy
		energyProd = Math.round(2080000*Math.pow(planetData.Buildings[4],2) + 165000*planetData.Buildings[4] + 500000);
		energyCons = planet.getEnergyConsomation();

		// Buildings Levels
		for(var i=0; i<14; i++) {
			$('#lvl-'+ buildingsNames[i]).html(planetData.Buildings[i]);
		}

		// Building Production (tooltips)
		// Minerals
		$('#minerals-cap').html(GetBetterUnit(storageRatioMinerals,'t'));
		if(planetData.resources[0]>=storageRatioMinerals) {
			$('#minerals-prod').html(GetBetterUnit(0,'t/h'));
		} else {		
			$('#minerals-prod').html(GetBetterUnit(mineralsProd,'t/h'));
		}

		if((planetData.resources[5]>=storageRatioMetals*ratio.titanRatio) && 
			(planetData.resources[4]>=storageRatioMetals*ratio.copperRatio) && 
			(planetData.resources[3]>=storageRatioMetals*ratio.aluRatio) && 
			(planetData.resources[2]>=storageRatioMetals*ratio.ironRatio)) {
				$('#minerals-cons').html(GetBetterUnit(0,'t/h'));
		} else {	
			$('#minerals-cons').html(GetBetterUnit(metalBaseProd,'t/h'));
		}
		// Helium-3
		$('#he-cap').html(GetBetterUnit(storageHelium,'t'));
		if(planetData.resources[1]>=storageHelium) {
			$('#he-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#he-prod').html(GetBetterUnit(heliumProd,'t/h'));
		}
		// Iron
		$('#fe-cap').html(GetBetterUnit(storageRatioMetals*ratio.ironRatio,'t'));		
		if(planetData.resources[2]>=storageRatioMetals*ratio.ironRatio) {
			$('#fe-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#fe-prod').html(GetBetterUnit(metalBaseProd*ratio.ironRatio,'t/h'));
		}
		$('#fe-variety').html(GetBetterUnit(ratio.ironRatio*100,'%'));
		// Aluminium
		$('#al-cap').html(GetBetterUnit(storageRatioMetals*ratio.aluRatio,'t'));
		if(planetData.resources[3]>=storageRatioMetals*ratio.aluRatio) {
			$('#al-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#al-prod').html(GetBetterUnit(metalBaseProd*ratio.aluRatio,'t/h'));
		}
		$('#al-variety').html(GetBetterUnit(ratio.aluRatio*100,'%'));
		// Copper
		$('#cu-cap').html(GetBetterUnit(storageRatioMetals*ratio.copperRatio,'t'));
		if(planetData.resources[4]>=storageRatioMetals*ratio.copperRatio) {
			$('#cu-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#cu-prod').html(GetBetterUnit(metalBaseProd*ratio.copperRatio,'t/h'));
		}
		$('#cu-variety').html(GetBetterUnit(ratio.copperRatio*100,'%'));
		// Titanium
		$('#ti-cap').html(GetBetterUnit(storageRatioMetals*ratio.titanRatio,'t'));
		if(planetData.resources[5]>=storageRatioMetals*ratio.titanRatio) {	
			$('#ti-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#ti-prod').html(GetBetterUnit(metalBaseProd*ratio.titanRatio,'t/h'));
		}
		$('#ti-variety').html(GetBetterUnit(ratio.titanRatio*100,'%'));


		$('#electricity_nmb').html(GetBetterUnit(energyProd-energyCons,"Wh",0));
		$('#electricity-prod').html(GetBetterUnit(energyProd,"Wh"));
		$('#electricity-cons').html(GetBetterUnit(energyCons,"Wh"));
	}
	/*
	Draws if buildings can be build.
	*/
	static drawCanBeBuild() {
		if(canbebuildtimeout!=-1) {
			clearTimeout(canbebuildtimeout);
			canbebuildtimeout = -1;
		}
		// Update all when building could be upgraded
		var timeLeft = planet.getNextBuildingReady();
		if(timeLeft==0) {
			canbebuildtimeout = setTimeout(function() {
				planet.drawCanBeBuild();
			},timeLeft);
		}

		$("arrow-build-active").removeClass("arrow-build-active");

		// Draw arrows or not :p
		for(var i=0; i<14; i++) {
			if(planet.canBeBuild(i)) {
				$('#arrow-'+ buildingsNames[i]).css('display','block');
			} else if(planetData.nextBuilding==i) {
				$('#arrow-'+ buildingsNames[i]).css('display','block');
				$('#arrow-'+ buildingsNames[i]).addClass("arrow-build-active");
			} else {
				$('#arrow-'+ buildingsNames[i]).css('display','none');
			}
		}
	}
	/*
	Gets the energy consomation.
	
	@return     {number}  The energy consomation.
	*/
	static getEnergyConsomation() {
		var energy = 0;

		for(var i=0; i<9; i++) {
			energy += planet.getBuildCost(i,planetData.Buildings[i]).energy;
		}

		return energy;
	}

	static getTimeBeforeBuild(building) {
		if(planetData.nextBuilding==building) { var cost = planet.getBuildCost(building,planetData.Buildings[building] + 2); } 
		else							{ var cost = planet.getBuildCost(building,planetData.Buildings[building] + 1); }
		var costs = [
			["building-cost-iron",cost.iron],
			["building-cost-aluminium",cost.aluminium],
			["building-cost-copper",cost.copper],
			["building-cost-titanium",cost.titanium]
		];

		var timeCurrent = 0;
		for(var i=0; i<4; i++) {
			if(planetData.resources[i+2] < costs[i][1]) {
				var time = ((costs[i][1] - planetData.resources[i+2])/metalBaseProd);
				if(time > timeCurrent) {
					timeCurrent = time;
				}	
			}
		}

		return timeCurrent;
	}
	/**
	 * Determines ability to be build.
	 *
	 * @param      {<type>}  building  The building ID
	 */
	static canBeBuild(id) {
		return ((planet.getTimeBeforeBuild(id)==0)&&(planetData.Buildings[id]+1 <= maxLevels[id]&&((planetData.nextBuildingTime-Date.now()+planet.deltaNow)<0)));
	}
	/*
	 * Gets the next building ready.
	 *
	 * @return     {number}  The time before the next can be build.
	 */
	static getNextBuildingReady() {
		var timeLeft = planet.getTimeBeforeBuild(0);

		for(var i=1; i<14; i++) {
			var timeCurrent = planet.getTimeBeforeBuild(i);
			if(timeCurrent < timeLeft && timeCurrent!=0) {
				var timeLeft = timeCurrent;
			}
		}

		return timeLeft;
	}

	/**
	 * Draw miscellaneaous things on HUD
	 */
	static MiscDrawUpdate() {
		//Planet name
		$('#hud-planet-name span').text(planetData.name);
		$('#money_nmb').html(GetBetterUnit(userData.money,""));

		//Page Title
		document.title = userData.username + " - " + planetData.name;

		
		if(planetData.planetType!=undefined) {
			//Set background
			planetBack.init(planetData.planetType);

			//Set Build Tabs Background
			$('.build-tab-background').attr("src",'img/buildings/tabs/'+planetData.planetType+'.png');
		}
	}
	/**
	 * etourner les coûts de construction et d'utilisation du bâtiment.
	 *
	 * @param      {number}  build   The building id
	 * @param      {number}  level   The building level
	 * 
	 * @return     {array}   cost    The final cost
	 */
	static getBuildCost(build,level) {

	var cost;

	switch(build) {
			case 0: //Quarry
				cost = {
					aluminium: 0,
					iron: Math.round(8*Math.pow(level,2) - 20*level + 17),
					copper: 0,
					titanium: Math.round(0.75*Math.pow(level,2) + 6.5*level - 2),
					time: 0.03*Math.pow(level,2) + 0.05*level -0.2,
					energy: Math.round(Math.pow(725*level,2) + 100000*level + 500000),
					energy_difference: (Math.round(Math.pow(725*level,2) + 100000*level + 500000)-Math.round(Math.pow(725*(level-1),2) + 100000*(level-1) + 500000))
				}
			break;
			case 1: //Metallurgie
				cost = {
					aluminium: 0,
					iron: Math.round(2*Math.pow(level,2) - 2*level), //Structure
					copper: 0,
					titanium: Math.round(2.8*Math.pow(level,2) + 6*level + 6),
					time: 0.06*Math.pow(level,2) - 0.15*level + 0.1,
					energy: Math.round(Math.pow(1000*level,2) + 10000*level + 700),
					energy_difference: Math.round(Math.pow(1000*level,2) + 10000*level + 700)-Math.round(Math.pow(1000*(level-1),2) + 10000*(level-1) + 700)
				}
			break;
			case 2: //Living
				cost = {
					aluminium: 0,
					iron: Math.round(2.7*Math.pow(level,2) - 6*level + 8),
					copper: Math.round(0.4*Math.pow(level,2) + 9*level - 5),
					titanium: 0,
					time: 0.07*Math.pow(level,2) - 0.1*level + 0.05,
					energy: Math.round(Math.pow(400*level,2) + 1100*level + 700),
					energy_difference: Math.round(Math.pow(400*level,2) + 1100*level + 700)-Math.round(Math.pow(400*(level-1),2) + 1100*(level-1) + 700)
				}
			break;
			case 3: //Serres
				cost = {
					aluminium: Math.round(0.8*Math.pow(level,2) + 8*level - 5), //Structure
					iron: 0, 
					copper: 0,
					titanium: Math.round(1.2*Math.pow(level,2) + 12*level - 3.8),
					time: 0.065*Math.pow(level,2) - 0.1*level,
					energy: Math.round(80000*level - 10000),
					energy_difference: Math.round(80000*(level-1)-10000)-Math.round(80000*(level-1)-10000)
				}
			break;
			case 4: //Solar panel
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 3*level),
					iron: Math.round(0.5*Math.pow(level,2) + 2*level),
					copper: Math.round(0.4*Math.pow(level,2) + 9*level - 5),
					titanium: 0,
					time: 0.05*Math.pow(level,2) - 0.1*level + 0.03,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 5: //Warehouse
				cost = {
					aluminium: 0,
					iron: Math.round(1.75*Math.pow(level,2) -1.5*level), //Structure
					copper: 0,
					titanium: Math.round(2.5*Math.pow(level,2) + 6*level + 6.5), //Blindage
					time: 0.035*Math.pow(level,2) + 0.05*level - 0.2,
					energy: Math.round(Math.pow(35*level,2)-200*level + 800), //Energy is just for lights :D
					energy_difference: Math.round(Math.pow(35*level,2) -200*level + 800)-Math.round(Math.pow(35*(level-1),2) -200*(level-1) + 800),
				}
			break;
			case 6: //Hedquarters
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 8*level - 6),
					iron: Math.round(0.8*Math.pow(level,2) + 2*level),
					copper: 0,
					titanium: Math.round(1.2*Math.pow(level,2) + 5*level - 6.5),
					time: 0.05*Math.pow(level,2) + 0.1*level - 0.1,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 7: //Launching Center
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 3*level),
					iron: Math.round(6*Math.pow(level,2) - 20*level + 24),
					copper: Math.round(0.85*Math.pow(level,2) + 3*level + 3),
					titanium: Math.round(0.5*Math.pow(level,2) + 6.5*level - 2),
					time: 0.04*Math.pow(level,2) + 0.08*level - 0.1,
					energy: Math.round(Math.pow(300*level,2)-1300*level + 800),
					energy_difference: Math.round(Math.pow(300*level,2)-1300*level + 800)-Math.round(Math.pow(300*(level-1),2)-1300*(level-1) + 800),
				}
			break;
			case 8: //Research Center
				cost = {
					aluminium: Math.round(0.25*Math.pow(level,2) + 8*level),
					iron: Math.round(1.25*Math.pow(level,2) - level),
					copper: Math.round(0.25*Math.pow(level,2) + 4*level),
					titanium: Math.round(0.8*Math.pow(level,2) + 6.5*level - 2),
					time: 0.02*Math.pow(level,2) + 0.03*level - 0.1,
					energy: Math.round(Math.pow(550*level,2)-2500*level + 700),
					energy_difference: Math.round(Math.pow(550*level,2)-2500*level + 700)-Math.round(Math.pow(550*(level-1),2)-2500*(level-1) + 700),
				}
			break;
			// Space stations
			case 9: //Radar
				cost = {
					aluminium: Math.round(1.7*Math.pow(level,2) + level),
					iron: 0,
					copper: Math.round(0.35*Math.pow(level,2) + 9*level),
					titanium: 0,
					time: 0.1*Math.pow(level,2) + 0.1*level,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 10: //Tank
				cost = {
					aluminium: Math.round(0.7*Math.pow(level,2) + 8*level - 3),
					iron: Math.round(2.2*Math.pow(level,2) + 2*level),
					copper: 0,
					titanium: 2*Math.round(Math.pow(level,2) + 7*level),
					time: 0.025*Math.pow(level,2) + 0.1*level,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 11: //Shipyard
				cost = {
					aluminium: Math.round(0.5*Math.pow(level,2) + 4*level + 5),
					iron: Math.round(2*Math.pow(level,2) + 2*level + 8),
					copper: 0,
					titanium: Math.round(3*Math.pow(level,2) + 8),
					time: 0.075*Math.pow(level,2) + 0.15*level+0.15,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 12: //Trade
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 3*level + 5),
					iron: Math.round(2.5*Math.pow(level,2) + 4*level),
					copper: 0,
					titanium: 0,
					time: 0.12*Math.pow(level,2) + 0.5*level,
					energy: 0,
					energy_difference: 0,
				}
			break;
			case 13: //He3exp
				cost = {
					aluminium: Math.round(0.9*Math.pow(level,2) + 9*level - 3),
					iron: Math.round(1.5*Math.pow(level,2) + 3*level),
					copper: 0,
					titanium: 0,
					time: 0.017*Math.pow(level,2) + 0.15*level,
					energy: 0,
					energy_difference: 0,
				}
			break;
			default:
				cost = {
					aluminium: 0,
					iron: 0,
					copper: 0,
					titanium: 0,
					time: 0,
					energy: 0,
					energy_difference: 0,
				}
		}
		return cost
	}
	// Prev/Next
	static prev() {
		socket.emit("planet-ask-data-prev", userData);
	}
	static next() {
		socket.emit("planet-ask-data-next", userData);
	}
}