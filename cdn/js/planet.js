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
var storageHelium1; // Helium 3 lvl + 1
 
var mineralProdBase; // Production de minerais
var mineralProdBase1; // Production de minerais lvl + 1
var metalProdBase; // Production de metaux
var metalProdBase1; // Production de metaux lvl + 1
var heliumProdBase; // Production d'Helium 3
var heliumProdBase1; // Production d'Helium 3 lvl +1

var energyProd; // Production energetique
var energyProd1; // Production energetique lvl +1
var energyCons; // Consomation energetique

var habProd; // Production population
var habProd1; // Production population lvl +1
var habCons; // Consomation population

var researchProd; // Production recherche
var researchProd1; // Production recherche lvl +1

class planet {
	static init() {
		planet.buildPanel = -1; // Current opened building
		planet.buildPanelInterval = -1; // Time before next client auto update
		planet.enoughResources = -1; // Time before enought ressources
		planet.deltaNow = 0; // Security measure
	}

	/**
	 * Ask to the server data on current planet
	 */
	static sync() {
		socket.emit('planet-ask-data', userData);
	}

	/**
	 * Rafraichir les données affichées et stockées
	 *
	 * @param      {<type>}  data    The data
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

		// Chargement de la map
		map.init(planetData.address);

		// Chargement des unites (utiles pour le cooldown)
		units.drawMain();

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
				ui.notify("Galactae: " + translate["messages"]['ENDED_BUILDING_TITLE'], {
					icon: cdnURL+"img/favicon.png",
					body: translate["messages"]['ENDED_BUILDING_01'] + translate['buildings'][planetData.nextBuilding].name + translate["messages"]['ENDED_BUILDING_02'] + (planetData.Buildings[planetData.nextBuilding]+1)
				});
				planet.sync();
				autobuildingrefresh = -1;
			},planetData.nextBuildingTime-Date.now()+planet.deltaNow+5000); // Wait 5 sec
		}
		
		// Refresh buildPanel
		if(planet.buildPanel!= -1) {
			planet.buildPanelOpen(planet.buildPanel);
		}

		// Needed late after load ...
		ui.loadHUDButtons();
	}

	/**
	 * Clientside simulation of growing resources
	 */
	static simMyRealRessources() {
		var time = 2/3600; // 2 sec

		//Minerals
		if(currentBuilding!=0)
		planetData.resources[0] += mineralProdBase*time;

		//Helium 3
		if(buildings[13]!=0 && currentBuilding!=13) { planetData.resources[1] += heliumProdBase*time; }

		//Metals
		if(planetData.resources[0]-(metalProdBase*time)>0 && currentBuilding!=1) { //Verify if you can use basic ressources
		    for(var i=2; i<6; i++) {
		    	planetData.resources[i] += (metalProdBase*time)*ratios[i-2];
		    }

			planetData.resources[0] -= (metalProdBase*time); //Consomation Algorithm
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

	/**
	 * Construire un bâtiment
	 *
	 * @param      {<type>}  id      Building ID
	 */
	static build(id) {
		if(planetData.Buildings[id]+1 > buildingMaxLvl[id]) {
			ui.drawMessage('MAX_LEVEL');
		} else {
			socket.emit('planet-build', { planet: planetData._id, id: userData.id, username: userData.username, building: id });
		}
	}

	/**
	 * Afficher les modifications de quantité de ressources
	 *
	 * @class      ResourcesDrawUpdate (name)
	 */
	static ResourcesDrawUpdate() {
		// Top left
		$('#population_nmb').html(GetBetterUnit(habProd - habCons));
		$('#research_nmb').html(GetBetterUnit(researchProd,"/h"));
		$('#moral_nmb').html(50+'%');

		//Top right
		$('#minerals_nmb').html(GetBetterUnit(planetData.resources[0],'t',mineralStorageBase));
		$('#he_nmb').html(GetBetterUnit(planetData.resources[1],'t',storageHelium));
		$('#fe_nmb').html(GetBetterUnit(planetData.resources[2],'t',metalsStorageBase*ratio.ironRatio));
		$('#al_nmb').html(GetBetterUnit(planetData.resources[3],'t',metalsStorageBase*ratio.aluRatio));
		$('#cu_nmb').html(GetBetterUnit(planetData.resources[4],'t',metalsStorageBase*ratio.copperRatio));
		$('#ti_nmb').html(GetBetterUnit(planetData.resources[5],'t',metalsStorageBase*ratio.titanRatio));
	}

	/**
	 * Recalc ressources
	 */
	static recalcBaseRessources() {
		buildings = planetData.Buildings;
		currentBuilding = planetData.nextBuilding;

		ratio = planet.GetMineralsRatio(planetData.planetType);
		ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) + mineralProd[1]*buildings[0] + mineralProd[2];
		mineralProdBase1 = mineralProd[0]*Math.pow((buildings[0] + 1),2) + mineralProd[1]*(buildings[0] + 1) + mineralProd[2];

		metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   + metalProd[1]*buildings[1]   + metalProd[2];
		metalProdBase1   = metalProd[0]*Math.pow((buildings[1] + 1),2)   + metalProd[1]*(buildings[1] + 1)   + metalProd[2];

		heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  + heliumProd[1]*buildings[13]  + heliumProd[2];
		heliumProdBase1  = heliumProd[0]*Math.pow((buildings[13] + 1),2)  + heliumProd[1]*(buildings[13]+1)  + heliumProd[2];

		var warehouseBase = storageRatio[0]*Math.log(buildings[5]) + storageRatio[1];

		mineralStorageBase = (mineralProd[0]*Math.pow(buildings[5],2) + mineralProd[1]*buildings[5] + mineralProd[2])*warehouseBase;
		metalsStorageBase  = (metalProd[0]*Math.pow(buildings[5],2)   + metalProd[1]*buildings[5]   + metalProd[2]  )*warehouseBase;

		if(buildings[10]!=0) {
			storageHelium = (heliumProd[0]*Math.pow(buildings[10],2)  + heliumProd[1]*buildings[10]  + heliumProd[2])*(storageRatio[0]*Math.log(buildings[10]) + storageRatio[1])*heliumStorageRatio; // Helium 3
		} else {
			storageHelium = 0;
		}

		storageHelium1 = (heliumProd[0]*Math.pow((buildings[10]+1),2)  + heliumProd[1]*(buildings[10]+1)  + heliumProd[2])*(storageRatio[0]*Math.log((buildings[10]+1)) + storageRatio[1])*heliumStorageRatio;

		if(research.isSearched("cp_molecular_compression")) {
			mineralStorageBase *= researchBonus["cp_molecular_compression"];
			metalsStorageBase *= researchBonus["cp_molecular_compression"];
			storageHelium *= researchBonus["cp_molecular_compression"];
			storageHelium1 *= researchBonus["cp_molecular_compression"];
		}

		// Energy
		energyProd = Math.round(electricity[0]*Math.pow(buildings[4],2) + electricity[1]*buildings[4] + electricity[2]);
		energyProd1 = Math.round(electricity[0]*Math.pow((buildings[4]+1),2) + electricity[1]*(buildings[4]+1) + electricity[2]);
		energyCons = planet.getEnergyConsomation();

		// Habitants
		habProd = Math.round(habGen[0]*Math.pow(buildings[2],2) + habGen[1]* buildings[2] + habGen[2]);
		habProd1 = Math.round(habGen[0]*Math.pow((buildings[2]+1),2) + habGen[1]*(buildings[2]+1) + habGen[2]);
		habCons = planet.getHabitantConsomation();

		// Research
		researchProd = Math.round(researchProduction[0]*Math.pow(buildings[8],2) + researchProduction[1]*buildings[8] + researchProduction[2]);
		researchProd1 = Math.round(researchProduction[0]*Math.pow((buildings[8] + 1),2) + researchProduction[1]*(buildings[8] + 1) + researchProduction[2]);
	}

	/**
	 * Afficher les modifications en rapport avec les batiments (niveaux ou production)
	 *
	 * @class      BuildingDrawUpdate (name)
	 */
	static BuildingDrawUpdate() {
		planet.recalcBaseRessources();

		// Buildings Levels
		for(var i=0; i<14; i++) {
			$('#lvl-'+ buildingsNames[i]).html(planetData.Buildings[i]);
		}

		// Building Production (tooltips)
		// Minerals
		var mineralProdBaseTemp = mineralProdBase;
		var metalProdBaseTemp = metalProdBase;

		if((planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) && 
			(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) && 
			(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) && 
			(planetData.resources[2]>=metalsStorageBase*ratio.ironRatio)) { // Si on a tout les metaux
			metalProdBaseTemp = 0;
		}

		if(planetData.resources[0]>=mineralStorageBase 
			&& mineralProdBaseTemp > metalProdBaseTemp) { // Si on a tout les minerais
			mineralProdBaseTemp = metalProdBaseTemp;
		} else if(planetData.resources[0]==0 && metalProdBaseTemp > mineralProdBaseTemp) {
			metalProdBaseTemp = mineralProdBaseTemp;
		}


		$('#minerals-cap').html(GetBetterUnit(mineralStorageBase,'t'));
		$('#minerals-prod').html(GetBetterUnit(mineralProdBaseTemp,'t/h'));
		$('#minerals-cons').html(GetBetterUnit(metalProdBaseTemp,'t/h'));

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
			$('#fe-prod').html(GetBetterUnit(metalProdBaseTemp*ratio.ironRatio,'t/h'));
		}
		$('#fe-variety').html(GetBetterUnit(ratio.ironRatio*100,'%'));
		// Aluminium
		$('#al-cap').html(GetBetterUnit(metalsStorageBase*ratio.aluRatio,'t'));
		if(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) {
			$('#al-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#al-prod').html(GetBetterUnit(metalProdBaseTemp*ratio.aluRatio,'t/h'));
		}
		$('#al-variety').html(GetBetterUnit(ratio.aluRatio*100,'%'));
		// Copper
		$('#cu-cap').html(GetBetterUnit(metalsStorageBase*ratio.copperRatio,'t'));
		if(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) {
			$('#cu-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#cu-prod').html(GetBetterUnit(metalProdBaseTemp*ratio.copperRatio,'t/h'));
		}
		$('#cu-variety').html(GetBetterUnit(ratio.copperRatio*100,'%'));
		// Titanium
		$('#ti-cap').html(GetBetterUnit(metalsStorageBase*ratio.titanRatio,'t'));
		if(planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) {	
			$('#ti-prod').html(GetBetterUnit(0,'t/h'));
		} else {
			$('#ti-prod').html(GetBetterUnit(metalProdBaseTemp*ratio.titanRatio,'t/h'));
		}
		$('#ti-variety').html(GetBetterUnit(ratio.titanRatio*100,'%'));


		$('#electricity_nmb').html(GetBetterUnit(energyProd-energyCons,"Wh",0));
		$('#electricity-available').html(GetBetterUnit(energyProd-energyCons,"Wh",0));
		$('#electricity-used').html(GetBetterUnit(energyCons,"Wh"));
		$('#electricity-total').html(GetBetterUnit(energyProd,"Wh"));

		$('#population_nmb').html(GetBetterUnit(habProd-habCons,"",0));
		$('#population-available').html(GetBetterUnit(habProd-habCons,"",0));
		$('#population-used').html(GetBetterUnit(habCons,""));
		$('#population-total').html(GetBetterUnit(habProd,""));	
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

		$('.building-list-active').removeClass('building-list-active');
		if(planetData.nextBuilding > -1 && planetData.nextBuilding < 14) {
			$('#'+ buildingsNames[planetData.nextBuilding]).addClass('building-list-active');
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

	static getHabitantConsomation() {
		var habitants = 0;
		var buildings = planetData.Buildings;

		// Buildings
		for(var i=0; i<14; i++) {
			if(buildings[i]==0) { continue; }
			if(i==planetData.nextBuilding) {
				// Current in-build building
				habitants += parseInt(planet.getBuildCost(i,buildings[i] + 1).habitants);
				continue; 
			}
			habitants += parseInt(planet.getBuildCost(i,buildings[i]).habitants);
		}

		// Units builded and in-build
		for(var i=0; i<units.fleetList.length; i++) {
			habitants += units.fleetList[i].population;
		}

		return habitants;
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
		$('#hud-planet-name').text(planetData.name);

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
	 * Open the buildpanel.
	 *
	 * @param      {string}  id      Building ID
	 */
	static buildPanelOpen(id) {
		if(id == planet.buildPanel) {
			planet.buildPanelHide();
			return;
		}

		planet.buildPanel = id;
		var dateNow = new Date();

		if(planet.buildPanelInterval!=-1) {
			clearTimeout(planet.buildPanelInterval);
			planet.buildPanelInterval = -1;
		}

		 //Next level cost
		if(planetData.nextBuilding==id) { 
			var cost = planet.getBuildCost(id,planetData.Buildings[id] + 2);		
		} 
		else { 
			var cost = planet.getBuildCost(id,planetData.Buildings[id] + 1);
		}

		var max = planetData.Buildings[id]+1 > buildingMaxLvl[id];
		var max2 = ((planetData.Buildings[id]+2 > buildingMaxLvl[id]) && (planetData.nextBuilding==id));

		/* Planet Construction Tab */
		$("#building-name").text(translate["buildings"][id].name);
		$("#building-level").text(translate["messages"]['LEVEL'] + ' ' +  planetData.Buildings[id]);
		$("#building-desc").text(translate["buildings"][id].desc);
		$("#building-area").css("display","block");
		$("#building-img").attr("src",cdnURL+"img/buildings/desc/"+translate["buildings"][id].id+".jpg");
		$("#building-area input").id=id;
		$('#building-cost').css('display', 'block');

		/* Ressources */
		var costs = [
			["building-cost-iron",cost.iron],
			["building-cost-aluminium",cost.aluminium],
			["building-cost-copper",cost.copper],
			["building-cost-titanium",cost.titanium]
		];
		for(var i=0; i<4; i++) {
			if(costs[i][1]==0) {
				$("#"+costs[i][0]).css("display","none");
			} else {
				$("#"+costs[i][0]).css("display","inline-block");
				$("#"+costs[i][0]+"-val").html(GetBetterUnit(costs[i][1],'t',planetData.resources[i+2]));
			}
		}
		/* Calc max wait time */
		planet.enoughResources = planet.getTimeBeforeBuild(id);

		/* Energie */
		if(cost.energy==0) {
			$("#building-cost-energy").css("display","none");
		} else {
			$("#building-cost-energy").css("display","inline-block");
			$("#building-cost-energy-val").html(
				GetBetterUnit(cost.energy,"Wh (+" + 
					GetBetterUnit(cost.energy_difference,"Wh",energyProd-energyCons) + ")",
					cost.energy + energyProd - energyCons - cost.energy_difference));
		}
		/* Habitants */
		if(cost.habitants==0) {
			$("#building-cost-population").css("display","none");
		} else {
			$("#building-cost-population").css("display","inline-block");
			$("#building-cost-population-val").html(
				GetBetterUnit(cost.habitants," (+" + 
					GetBetterUnit(cost.habitants_difference,"",habProd-habCons) + ")",
					cost.habitants + habProd - habCons - cost.habitants_difference));
		}
		/* Temps */
		if(id > 8) { // Faster if shipyard have higher lvl
			cost.time *= (1-(buildLvlUnitBuildingSpeedBonus*planetData.Buildings[7]));
		}
		$("#building-cost-time-val").html(getStringTime(cost.time));

		/* Bouton upgrade ou message */
		// Defaut Value
		if(planetData.Buildings[id]==0) {
			$('#building-upgrade').val(translate["messages"]["BUILD"]);
		} else {
			$('#building-upgrade').val(translate["messages"]["UPGRADE"]);
		}
		$("#building-upgrade").attr("onclick","");
		$('#building-upgrade').css('display', 'none');
		$('#building-message').css('display', 'inline-block');

		// Edits
		if(max) { // Max Level
			$('#building-message').html(translate["messages"]["UPGRADE_MAX"]);
			$('#building-cost').css('display', 'none');
		} else if(planetData.nextBuilding == id && planetData.nextBuildingTime > (Date.now() + planet.deltaNow)) { // Current building in build mode
			var dateEnd = new Date(planetData.nextBuildingTime + planet.deltaNow);
			var dateTom = new Date(Date.now() + (24*60*60*1000));

			if(dateNow.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Same day
				$('#building-message').html(translate["messages"]["BUILD_FINISH_TODAY_AT"] + " " + dateEnd.toLocaleTimeString());
			} else if(dateTom.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Tomorrow
				$('#building-message').html(translate["messages"]["BUILD_FINISH_TOMORROW_AT"] + " " + dateEnd.toLocaleTimeString());
			} else {
				$('#building-message').html(translate["messages"]["BUILD_FINISH_THE"] + " " + dateEnd.toLocaleDateString() + " " + translate["messages"]["BUILD_FINISH_AT"] + " " + dateEnd.toLocaleTimeString());
			}

			planet.buildPanelInterval = setTimeout(function() {
				planet.buildPanelOpen(id);
			},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planet.deltaNow); // Refresh at 00:00:05
		} else if(planet.enoughResources>0) { // No enought Ressources
			var dateEnd = new Date(Date.now() + planet.enoughResources*3600*1000);
			var dateTom = new Date(Date.now() + (24*60*60*1000));

			if(dateNow.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Same day
				$('#building-message').html(translate["messages"]["ENOUGH_RESOURCES_TODAY_AT"] + " " + dateEnd.toLocaleTimeString());
			} else if(dateTom.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Tomorrow
				$('#building-message').html(translate["messages"]["ENOUGH_RESOURCES_TOMORROW_AT"] + " " + dateEnd.toLocaleTimeString());
			} else {
				$('#building-message').html(translate["messages"]["ENOUGH_RESOURCES_THE"] + " " + dateEnd.toLocaleDateString() + " " + translate["messages"]["ENOUGH_RESOURCES_AT"] + " " + dateEnd.toLocaleTimeString());
			}

			planet.buildPanelInterval = setTimeout(function() {
				planet.buildPanelOpen(id);
			},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planet.deltaNow); // Refresh at 00:00:05
		} else if(planetData.nextBuilding!=-1 && planetData.nextBuildingTime > (Date.now() + planet.deltaNow)) { // Another building in build mode
			$('#building-message').html(translate["messages"]["ANOTHER_IN_BUILD"]);
			planet.buildPanelInterval = setTimeout(function() {
				planet.buildPanelOpen(id);
			},planetData.nextBuildingTime - (Date.now() + planet.deltaNow + 1000));
		} else {
			$('#building-message').css('display', 'none');
			$('#building-upgrade').css('display', 'block');
			$("#building-upgrade").attr("onclick","planet.build("+id+")");
		}

		// Bonus
		var title = "",
			icon = "",
			value = "",
			valuep1 = "";
	
		switch(id) {
			case 0: // Quarry
				title = translate['planet-ui']['production'];
				icon = '<img height="20" src="'+cdnURL+'img/ui/minerals.png" alt="minerals">';
				value = GetBetterUnit(mineralProdBase,'t/h');
				valuep1 = ' (+ ' + GetBetterUnit(mineralProdBase1 - mineralProdBase,'t/h') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 1: // Metallurgie
				title = translate['planet-ui']['production'];
				icon = translate['planet-ui']['metal'];
				value = GetBetterUnit(metalProdBase,'t/h');
				valuep1 = ' (+ ' + GetBetterUnit(metalProdBase1 - metalProdBase,'t/h') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 2: // Houses
				title = translate['planet-ui']['population'];
				icon = '';
				value = GetBetterUnit(habProd,'');
				valuep1 = ' (+ ' + GetBetterUnit(habProd1 - habProd,'') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 4: // Solar panel
				title = translate['planet-ui']['production'];
				icon = '<img height="15" src="'+cdnURL+'img/ui/electricity.svg" alt="electricity">';
				value = GetBetterUnit(energyProd,'Wh');
				valuep1 = ' (+ ' + GetBetterUnit(energyProd1 - energyProd,'Wh') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 6: // Headquarters
				title = translate['planet-ui']['availableFleets'];
				icon = '';
				value = hqFleetCount[planetData.Buildings[id] - 1];
				valuep1 = ' (' + hqFleetCount[planetData.Buildings[id]]
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 8: // Research Center
				title = translate['planet-ui']['production'];
				icon = '<img height="15" src="'+cdnURL+'img/ui/research.svg" alt="research">';
				value = GetBetterUnit(researchProd,'/h'); 
				valuep1 = ' (+ ' + GetBetterUnit(researchProd1 - researchProd,'/h') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 10: // Tank
				title = translate['planet-ui']['storage'];
				icon = '&sup3;He';
				value = GetBetterUnit(storageHelium,'t'); 
				valuep1 = ' (+ ' + GetBetterUnit(storageHelium1 - storageHelium,'t') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			case 13: // Helium production facility
				title = translate['planet-ui']['production'];
				icon = '&sup3;He';
				value = GetBetterUnit(heliumProdBase,'t/h');
				valuep1 = ' (+ ' + GetBetterUnit(heliumProdBase1 - heliumProdBase,'t/h') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			default:
		}

		if(planetData.Buildings[id]==0 && value != "") { value = "0"; } // If lvl, we set to 0

		$('#building-bonus-title').html(title);
		$('#building-bonus-icon').html(icon);
		if(max || max2) {
			$('#building-bonus-val').html(value);
		} else {
			$('#building-bonus-val').html(value + valuep1);
		}
	}

	/**
	 * Hide the buildpanel
	 */
	static buildPanelHide() {
		if(planet.buildPanelInterval!=-1) {
			clearTimeout(planet.buildPanelInterval);
			planet.buildPanelInterval = -1;
			planet.enoughResources = -1;
		}

		planet.buildPanel = -1;

		ui.closeTab("#building-area");
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

		var retour = {
			aluminium: 	Math.round(buildCost["aluminium"][build][0]*Math.pow(level,2) +		buildCost["aluminium"][build][1]*level + 	buildCost["aluminium"][build][2]),
			iron: 		Math.round(buildCost["iron"][build][0]*Math.pow(level,2) +			buildCost["iron"][build][1]*level + 		buildCost["iron"][build][2]),
			copper: 	Math.round(buildCost["copper"][build][0]*Math.pow(level,2) + 		buildCost["copper"][build][1]*level + 		buildCost["copper"][build][2]),
			titanium: 	Math.round(buildCost["titanium"][build][0]*Math.pow(level,2) + 		buildCost["titanium"][build][1]*level + 	buildCost["titanium"][build][2]),
			time: 				   buildCost["time"][build][0]*Math.pow(level,2) + 			buildCost["time"][build][1]*level + 		buildCost["time"][build][2],
			energy: 	Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + 		buildCost["energy"][build][1]*level + 		buildCost["energy"][build][2]),
			energy_difference: Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + buildCost["energy"][build][1]*level +       buildCost["energy"][build][2] 
			                        - (Math.pow(buildCost["energy"][build][0]*(level-1),2) + buildCost["energy"][build][1]*(level-1) +   buildCost["energy"][build][2])),
			habitants:  Math.round(buildCost["habitants"][build][0]*Math.pow(level,2) +		buildCost["habitants"][build][1]*level + 	buildCost["habitants"][build][2]),
			habitants_difference: Math.round(buildCost["habitants"][build][0]*Math.pow(level,2) +	buildCost["habitants"][build][1]*level + 	buildCost["habitants"][build][2]
				                         - (buildCost["habitants"][build][0]*Math.pow((level-1),2) +	buildCost["habitants"][build][1]*(level-1) + buildCost["habitants"][build][2])),
		};

		if(level == 1) {
			retour.habitants_difference = retour.habitants;
			retour.energy_difference = retour.energy;
		}

		return retour;
	}
	// Prev/Next
	static prev() {
		socket.emit("planet-ask-data-prev", userData);
	}
	static next() {
		socket.emit("planet-ask-data-next", userData);
	}
}