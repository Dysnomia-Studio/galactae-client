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

var planetData = { //Not complete but some are needed on init because of bugs
	planetType: 0,
	id: userData.pid,
	resources: {},
	Buildings: {},
}

var buildings;
var currentBuilding;

var ratio;
var ratios;
var metalsStorageBase; // Metaux
var mineralStorageBase; // Minerais
var storageHelium; // Helium 3
 
var mineralProdBase; // Production de minerais
var metalProdBase; // Production de metaux
var metalProdBase1; // Production de metaux lvl + 1
var heliumProdBase; // Production d'Helium 3

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
			resourcesinterval = setInterval(function() { 
				planet.simMyRealRessources();
				research.sim();
			},2000);
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
				ui.notify("Galactae: " + translate["messages"]['ENDED_BUILDING_TITLE'], {
					icon: cdnURL+"img/favicon.png",
					body: translate["messages"]['ENDED_BUILDING_01'] + translate['buildings'][planetData.nextBuilding].name + translate["messages"]['ENDED_BUILDING_02'] + planetData.Buildings[planetData.nextBuilding]
				});
				autobuildingrefresh = -1;
			},planetData.nextBuildingTime-Date.now()+planet.deltaNow+1);
		}
		
		// Refresh buildPanel
		if(ui.buildPanel!= -1) {
			ui.buildPanelOpen(ui.buildPanel);
		}

		// Needed late after load ...
		ui.loadHUDButtons();
	}
	/* simMyRealRessources
	ClientSide simulation of growing resources
	INPUT: -
	OUTPUT: -
	*/
	static simMyRealRessources() {
		var time = 2/3600; // 2 sec

		//Minerals
		if(currentBuilding!=0)
		planetData.resources[0] += mineralProdBase*time;

		//Helium 3
		if(buildings[13]!=0 && currentBuilding!=13) { planetData.resources[1] += heliumProdBase*time; }

		//Metals
		if(planetData.resources[0]-(mineralProdBase*time)>0 && currentBuilding!=1) { //Verify if you can use basic ressources
		    for(var i=2; i<6; i++) {
		    	planetData.resources[i] += (mineralProdBase*time)*ratios[i-2];
		    }

			planetData.resources[0] -= (mineralProdBase*time); //Consomation Algorithm
		} else { // Do the max we can
		    for(var i=2; i<6; i++) {
		    	planetData.resources[i] += planetData.resources[0]*ratios[i-2];
		    }

			planetData.resources[0] = 0;
		}

		// Si Max de tout les metaux
		if((planetData.resources[5]>metalsStorageBase*ratio.titanRatio) && 
			(planetData.resources[4]>metalsStorageBase*ratio.copperRatio) && 
			(planetData.resources[3]>metalsStorageBase*ratio.aluRatio) && 
			(planetData.resources[2]>metalsStorageBase*ratio.ironRatio)) {

			var min = (planetData.resources[2] - metalsStorageBase*ratios[0])/ratios[0];

			for(var i=3; i<6; i++) {
				var temp = (planetData.resources[i] - metalsStorageBase*ratios[i-2])/ratios[i-2];

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
		if(planetData.resources[0]>mineralStorageBase) {
			planetData.resources[0] = mineralStorageBase;
		}
		if(planetData.resources[1]>storageHelium) {
			planetData.resources[1] = storageHelium;
		}
	    for(var i=2; i<6; i++) {
	    	if(planetData.resources[i]>metalsStorageBase*ratios[i-2]) { // You can't have more iron than your storage capacity
				planetData.resources[i] = metalsStorageBase*ratios[i-2];
			}
	    }

		planet.ResourcesDrawUpdate();
	}
	/**
	 * Gets the minerals ratio.
	 *
	 * @class      GetMineralsRatio (name)
	 * @param      {<type>}  type    The type of planet
	 * @return     {Object}  The minerals ratio.
	 */
	static GetMineralsRatio(type) {
		if(planetRatios[type]!=undefined) {
			return planetRatios[type];	
		} else {
			return planetRatios[0];
		}
	}
	/* build
	Construire un bâtiment
	INPUT: -
	OUTPUT: -
	*/
	static build(id) {
		if(planetData.Buildings[id]+1 > buildingMaxLvl[id]) {
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
		$('#research_nmb').html(GetBetterUnit(Math.round(researchProduction[0]*Math.pow(planetData.Buildings[8],2) + researchProduction[1]* planetData.Buildings[8] + researchProduction[2]),"/h"));
		$('#moral_nmb').html(50+'%');

		//Top right
		$('#minerals_nmb').html(GetBetterUnit(planetData.resources[0],'t',mineralStorageBase));
		$('#he_nmb').html(GetBetterUnit(planetData.resources[1],'t',storageHelium));
		$('#fe_nmb').html(GetBetterUnit(planetData.resources[2],'t',metalsStorageBase*ratio.ironRatio));
		$('#al_nmb').html(GetBetterUnit(planetData.resources[3],'t',metalsStorageBase*ratio.aluRatio));
		$('#cu_nmb').html(GetBetterUnit(planetData.resources[4],'t',metalsStorageBase*ratio.copperRatio));
		$('#ti_nmb').html(GetBetterUnit(planetData.resources[5],'t',metalsStorageBase*ratio.titanRatio));
	}
	/* BuildingDrawUpdate
	Afficher les modifications en rapport avec les batiments (niveaux ou production)
	INPUT: -
	OUTPUT: -
	*/
	static BuildingDrawUpdate() {
		buildings = planetData.Buildings;
		currentBuilding = planetData.nextBuilding;

		ratio = planet.GetMineralsRatio(planetData.planetType);
		ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) - mineralProd[1]*buildings[0] + mineralProd[2];
		metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   - metalProd[1]*buildings[1]   + metalProd[2];
		heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  - heliumProd[1]*buildings[13]  + heliumProd[2];

		var warehouseBase = storageRatio[0]*Math.log(buildings[5]) + storageRatio[1];

		mineralStorageBase = (mineralProd[0]*Math.pow(buildings[5],2) - mineralProd[1]*buildings[5] + mineralProd[2])*warehouseBase;
		metalsStorageBase  = (metalProd[0]*Math.pow(buildings[5],2)   - metalProd[1]*buildings[5]   + metalProd[2]  )*warehouseBase;

		if(buildings[10]!=0) {
			storageHelium = (heliumProd[0]*Math.pow(buildings[10],2)  - heliumProd[1]*buildings[10]  + heliumProd[2])*(storageRatio[0]*Math.log(buildings[10]) + storageRatio[1])*heliumStorageRatio; // Helium 3
		} else {
			storageHelium = 0;
		}
		// Energy
		energyProd = Math.round(2080000*Math.pow(planetData.Buildings[4],2) + 165000*planetData.Buildings[4] + 550000);
		energyCons = planet.getEnergyConsomation();

		// Buildings Levels
		for(var i=0; i<14; i++) {
			$('#lvl-'+ buildingsNames[i]).html(planetData.Buildings[i]);
		}

		// Building Production (tooltips)
		// Minerals
		$('#minerals-cap').html(GetBetterUnit(mineralStorageBase,'t'));
		if(planetData.resources[0]>=mineralStorageBase) {
			$('#minerals-prod').html(GetBetterUnit(0,'t/h'));
		} else {		
			$('#minerals-prod').html(GetBetterUnit(mineralProdBase,'t/h'));
		}

		if((planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) && 
			(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) && 
			(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) && 
			(planetData.resources[2]>=metalsStorageBase*ratio.ironRatio)) {
				$('#minerals-cons').html(GetBetterUnit(0,'t/h'));
		} else {	
			$('#minerals-cons').html(GetBetterUnit(metalProdBase,'t/h'));
		}
		// Helium-3
		$('#he-cap').html(GetBetterUnit(storageHelium,'t'));
		if(planetData.resources[1]>=storageHelium) {
			$('#he-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#he-prod').html(GetBetterUnit(heliumProdBase,'t/h'));
		}
		// Iron
		$('#fe-cap').html(GetBetterUnit(metalsStorageBase*ratio.ironRatio,'t'));		
		if(planetData.resources[2]>=metalsStorageBase*ratio.ironRatio) {
			$('#fe-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#fe-prod').html(GetBetterUnit(metalProdBase*ratio.ironRatio,'t/h'));
		}
		$('#fe-variety').html(GetBetterUnit(ratio.ironRatio*100,'%'));
		// Aluminium
		$('#al-cap').html(GetBetterUnit(metalsStorageBase*ratio.aluRatio,'t'));
		if(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) {
			$('#al-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#al-prod').html(GetBetterUnit(metalProdBase*ratio.aluRatio,'t/h'));
		}
		$('#al-variety').html(GetBetterUnit(ratio.aluRatio*100,'%'));
		// Copper
		$('#cu-cap').html(GetBetterUnit(metalsStorageBase*ratio.copperRatio,'t'));
		if(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) {
			$('#cu-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#cu-prod').html(GetBetterUnit(metalProdBase*ratio.copperRatio,'t/h'));
		}
		$('#cu-variety').html(GetBetterUnit(ratio.copperRatio*100,'%'));
		// Titanium
		$('#ti-cap').html(GetBetterUnit(metalsStorageBase*ratio.titanRatio,'t'));
		if(planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) {	
			$('#ti-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#ti-prod').html(GetBetterUnit(metalProdBase*ratio.titanRatio,'t/h'));
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
		if(timeLeft>0) {
			canbebuildtimeout = setTimeout(function() {
				planet.drawCanBeBuild();
			},timeLeft);
		}
		// Refresh this when a building is ended
		var timeBeforeEndBuild = (planetData.nextBuildingTime - (Date.now() + planet.deltaNow + 1000));
		if(timeBeforeEndBuild>0) {
			setTimeout(function() {
				planet.drawCanBeBuild();
			},timeBeforeEndBuild + 1000);
		}


		$(".arrow-build-active").removeClass("arrow-build-active");

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

		var ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		var timeCurrent = 0;
		for(var i=0; i<4; i++) {
			if(planetData.resources[i+2] < costs[i][1]) {
				var time = ((costs[i][1] - planetData.resources[i+2])/(metalProdBase*ratios[i]));
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
		return ((planet.getTimeBeforeBuild(id)==0)&&(planetData.Buildings[id]+1 <= buildingMaxLvl[id]&&((planetData.nextBuildingTime-Date.now()+planet.deltaNow)<0)));
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
			$('.build-tab-background').attr("src",cdnURL+'img/buildings/tabs/'+planetData.planetType+'.png');
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
		if(build < 0 || build > globalConst["buildingNumber"]) { return; }

		return {
			aluminium: 	Math.round(buildCost["aluminium"][build][0]*Math.pow(level,2) +		buildCost["aluminium"][build][1]*level + 	buildCost["aluminium"][build][2]),
			iron: 		Math.round(buildCost["iron"][build][0]*Math.pow(level,2) +			buildCost["iron"][build][1]*level + 		buildCost["iron"][build][2]),
			copper: 	Math.round(buildCost["copper"][build][0]*Math.pow(level,2) + 		buildCost["copper"][build][1]*level + 		buildCost["copper"][build][2]),
			titanium: 	Math.round(buildCost["titanium"][build][0]*Math.pow(level,2) + 		buildCost["titanium"][build][1]*level + 	buildCost["titanium"][build][2]),
			time: 				   buildCost["time"][build][0]*Math.pow(level,2) + 			buildCost["time"][build][1]*level + 		buildCost["time"][build][2],
			energy: 	Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + 		buildCost["energy"][build][1]*level + 		buildCost["energy"][build][2]),
			energy_difference: 	Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + buildCost["energy"][build][1]*level + buildCost["energy"][build][2]) - Math.round(Math.pow(buildCost["energy"][build][0]*(level-1),2) + buildCost["energy"][build][1]*(level-1) + buildCost["energy"][build][2])
		}
	}
	// Prev/Next
	static prev() {
		socket.emit("planet-ask-data-prev", userData);
	}
	static next() {
		socket.emit("planet-ask-data-next", userData);
	}
}