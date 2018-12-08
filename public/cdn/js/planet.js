let resourcesinterval = -1;
let autobuildingrefresh = -1;
let canbebuildtimeout = -1;

let planetData = { //Not complete but some are needed on init because of bugs
	planetType: 0,
	address: userData.pid,
	resources: {},
	Buildings: {},
};

let buildings;
let currentBuilding;

let ratio;
let ratios;

let metalsStorageBase; // Metaux
let mineralStorageBase; // Minerais
let metalsStorageBase1; // Metaux lvl + 1
let mineralStorageBase1; // Minerais lvl + 1

let storageHelium; // Helium 3
let storageHelium1; // Helium 3 lvl + 1
 
let mineralProdBase; // Production de minerais
let mineralProdBase1; // Production de minerais lvl + 1
let metalProdBase; // Production de metaux
let metalProdBase1; // Production de metaux lvl + 1
let heliumProdBase; // Production d'Helium 3
let heliumProdBase1; // Production d'Helium 3 lvl +1

let energyProd; // Production energetique
let energyProd1; // Production energetique lvl +1
let energyCons; // Consomation energetique

let habProd; // Production population
let habProd1; // Production population lvl +1
let habCons; // Consomation population

let researchProd; // Production recherche
let researchProd1; // Production recherche lvl +1

class planet {
	/**
	 * Initilalize planet
	 */
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
		setCookie('galactae-account-pid', data.data.address, 1);

		planet.deltaNow = data.sNow - Date.now();

		// Clientside Calc for ressource auto-update
		if(resourcesinterval === -1) {
			resourcesinterval = setInterval(function() { 
				planet.simMyRealRessources();
				research.sim();
			},2000);
		}

		for(let key in data.data) {
			planetData[key] = data.data[key];
		}

		// Chargement de la map
		map.init(planetData.address);

		// Chargement des unites (utiles pour le cooldown)
		units.drawMain();

		userData.pid = planetData.address;

		// Edit Data
		planet.BuildingDrawUpdate();
		planet.ResourcesDrawUpdate(); // Needed to be after building for ratios
		planet.MiscDrawUpdate();
		planet.drawCanBeBuild();

		// Clear existing timeout
		if(autobuildingrefresh !== -1) {
			clearTimeout(autobuildingrefresh);
			autobuildingrefresh = -1;
		}
		// Create timeout: sync where the next building is ended
		if(planetData.nextBuildingTime !== -1) {
			autobuildingrefresh = setTimeout(function() {	
				planet.sync();
				autobuildingrefresh = -1;
			},planetData.nextBuildingTime-Date.now()+planet.deltaNow+5000); // Wait 5 sec
		}
		
		// Refresh buildPanel
		if(planet.buildPanel !== -1) {
			planet.buildPanelOpen(planet.buildPanel);
		}

		// Needed late after load ...
		ui.loadHUDButtons();
	}

	/**
	 * Clientside simulation of growing resources
	 */
	static simMyRealRessources() {
		let time = 2/3600; // 2 sec

		//Minerals
		if(currentBuilding !== 0) {
			planetData.resources[0] += mineralProdBase*time;
		}

		//Helium 3
		if(buildings[13] !== 0 && currentBuilding !== 13) { planetData.resources[1] += heliumProdBase*time; }

		//Metals
		if(planetData.resources[0]-(metalProdBase*time)>0 && currentBuilding !== 1) { //Verify if you can use basic ressources
		    for(let i=2; i<6; i++) {
		    	planetData.resources[i] += (metalProdBase*time)*ratios[i-2];
		    }

			planetData.resources[0] -= (metalProdBase*time); //Consomation Algorithm
		} else if(currentBuilding !== 1) { // Do the max we can
		    for(let i=2; i<6; i++) {
		    	planetData.resources[i] += planetData.resources[0]*ratios[i-2];
		    }

			planetData.resources[0] = 0;
		}

		// Si Max de tout les metaux
		if((planetData.resources[5]>metalsStorageBase*ratio.titanRatio) && 
			(planetData.resources[4]>metalsStorageBase*ratio.copperRatio) && 
			(planetData.resources[3]>metalsStorageBase*ratio.aluRatio) && 
			(planetData.resources[2]>metalsStorageBase*ratio.ironRatio)) {

			let min = (planetData.resources[2] - metalsStorageBase*ratios[0])/ratios[0];

			for(let i=3; i<6; i++) {
				let temp = (planetData.resources[i] - metalsStorageBase*ratios[i-2])/ratios[i-2];

				if(temp<min) {
					min = temp;
				}
			}
			planetData.resources[0]+=min;
		    for(let i=2; i<6; i++) {
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
	    for(let i=2; i<6; i++) {
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
		if(planetRatios[type] !== undefined) {
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
		document.getElementById('population_nmb').innerHTML = GetBetterUnit(habProd - habCons);
		document.getElementById('research_nmb').innerHTML = GetBetterUnit(researchProd,'/h');
		document.getElementById('moral_nmb').innerHTML = Math.round(planetData.Buildings[3]/planetData.Buildings[2]*100)+'%';

		//Top right
		document.getElementById('minerals_nmb').innerHTML = GetBetterUnit(planetData.resources[0],'t',mineralStorageBase);
		document.getElementById('he_nmb').innerHTML = GetBetterUnit(planetData.resources[1],'t',storageHelium);
		document.getElementById('fe_nmb').innerHTML = GetBetterUnit(planetData.resources[2],'t',metalsStorageBase*ratio.ironRatio);
		document.getElementById('al_nmb').innerHTML = GetBetterUnit(planetData.resources[3],'t',metalsStorageBase*ratio.aluRatio);
		document.getElementById('cu_nmb').innerHTML = GetBetterUnit(planetData.resources[4],'t',metalsStorageBase*ratio.copperRatio);
		document.getElementById('ti_nmb').innerHTML = GetBetterUnit(planetData.resources[5],'t',metalsStorageBase*ratio.titanRatio);
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

		let warehouseBase = storageRatio[0]*Math.log(buildings[5]) + storageRatio[1];

		mineralStorageBase = (mineralProd[0]*Math.pow(buildings[5],2) + mineralProd[1]*buildings[5] + mineralProd[2])*warehouseBase;
		metalsStorageBase  = (metalProd[0]*Math.pow(buildings[5],2)   + metalProd[1]*buildings[5]   + metalProd[2]  )*warehouseBase;

		mineralStorageBase1 = (mineralProd[0]*Math.pow(buildings[5] + 1,2) + mineralProd[1]*(buildings[5] + 1) + mineralProd[2])*warehouseBase;
		metalsStorageBase1  = (metalProd[0]*Math.pow(buildings[5] + 1,2)   + metalProd[1]*(buildings[5] + 1)   + metalProd[2]  )*warehouseBase;

		if(buildings[10]!==0) {
			storageHelium = (heliumProd[0]*Math.pow(buildings[10],2)  + heliumProd[1]*buildings[10]  + heliumProd[2])*(storageRatio[0]*Math.log(buildings[10]) + storageRatio[1])*heliumStorageRatio; // Helium 3
		} else {
			storageHelium = 0;
		}

		storageHelium1 = (heliumProd[0]*Math.pow((buildings[10]+1),2)  + heliumProd[1]*(buildings[10]+1)  + heliumProd[2])*(storageRatio[0]*Math.log((buildings[10]+1)) + storageRatio[1])*heliumStorageRatio;

		if(research.isSearched('cp_molecular_compression')) {
			mineralStorageBase *= researchBonus.cp_molecular_compression;
			metalsStorageBase *= researchBonus.cp_molecular_compression;
			mineralStorageBase1 *= researchBonus.cp_molecular_compression;
			metalsStorageBase1 *= researchBonus.cp_molecular_compression;
			storageHelium *= researchBonus.cp_molecular_compression;
			storageHelium1 *= researchBonus.cp_molecular_compression;
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
		for(let i=0; i<14; i++) {
			document.getElementById('lvl-'+ buildingsNames[i]).innerHTML = planetData.Buildings[i];
		}

		// Building Production (tooltips)
		// Minerals
		let mineralProdBaseTemp = mineralProdBase;
		let metalProdBaseTemp = metalProdBase;

		if((planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) && 
			(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) && 
			(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) && 
			(planetData.resources[2]>=metalsStorageBase*ratio.ironRatio)) { // Si on a tout les metaux
			metalProdBaseTemp = 0;
		}

		if(planetData.resources[0]>=mineralStorageBase && 
			mineralProdBaseTemp > metalProdBaseTemp) { // Si on a tout les minerais
			mineralProdBaseTemp = metalProdBaseTemp;
		} else if(planetData.resources[0]===0 && metalProdBaseTemp > mineralProdBaseTemp) {
			metalProdBaseTemp = mineralProdBaseTemp;
		}


		document.getElementById('minerals-cap').innerHTML = GetBetterUnit(mineralStorageBase,'t');
		document.getElementById('minerals-prod').innerHTML = GetBetterUnit(mineralProdBaseTemp,'t/h');
		document.getElementById('minerals-cons').innerHTML = GetBetterUnit(metalProdBaseTemp,'t/h');

		// Helium-3
		document.getElementById('he-cap').innerHTML = GetBetterUnit(storageHelium,'t');
		if(planetData.resources[1]>=storageHelium) {
			document.getElementById('he-prod').innerHTML = GetBetterUnit(0,'t/h');
		} else {
			document.getElementById('he-prod').innerHTML = GetBetterUnit(heliumProdBase,'t/h');
		}
		// Iron
		document.getElementById('fe-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.ironRatio,'t');		
		if(planetData.resources[2]>=metalsStorageBase*ratio.ironRatio) {
			document.getElementById('fe-prod').innerHTML = GetBetterUnit(0,'t/h');
		} else {
			document.getElementById('fe-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.ironRatio,'t/h');
		}
		document.getElementById('fe-variety').innerHTML = GetBetterUnit(ratio.ironRatio*100,'%');
		// Aluminium
		document.getElementById('al-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.aluRatio,'t');
		if(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) {
			document.getElementById('al-prod').innerHTML = GetBetterUnit(0,'t/h');
		} else {
			document.getElementById('al-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.aluRatio,'t/h');
		}
		document.getElementById('al-variety').innerHTML = GetBetterUnit(ratio.aluRatio*100,'%');
		// Copper
		document.getElementById('cu-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.copperRatio,'t');
		if(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) {
			document.getElementById('cu-prod').innerHTML = GetBetterUnit(0,'t/h');
		} else {
			document.getElementById('cu-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.copperRatio,'t/h');
		}
		document.getElementById('cu-variety').innerHTML = GetBetterUnit(ratio.copperRatio*100,'%');
		// Titanium
		document.getElementById('ti-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.titanRatio,'t');
		if(planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) {	
			document.getElementById('ti-prod').innerHTML = GetBetterUnit(0,'t/h');
		} else {
			document.getElementById('ti-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.titanRatio,'t/h');
		}
		document.getElementById('ti-variety').innerHTML = GetBetterUnit(ratio.titanRatio*100,'%');


		document.getElementById('electricity_nmb').innerHTML = GetBetterUnit(energyProd-energyCons,'Wh',0);
		document.getElementById('electricity-available').innerHTML = GetBetterUnit(energyProd-energyCons,'Wh',0);
		document.getElementById('electricity-used').innerHTML = GetBetterUnit(energyCons,'Wh');
		document.getElementById('electricity-total').innerHTML = GetBetterUnit(energyProd,'Wh');

		document.getElementById('population_nmb').innerHTML = GetBetterUnit(habProd-habCons,'',0);
		document.getElementById('population-available').innerHTML = GetBetterUnit(habProd-habCons,'',0);
		document.getElementById('population-used').innerHTML = GetBetterUnit(habCons,'');
		document.getElementById('population-total').innerHTML = GetBetterUnit(habProd,'');	
	}
	/*
	* Draws if buildings can be build.
	*/
	static drawCanBeBuild() {
		if(canbebuildtimeout!==-1) {
			clearTimeout(canbebuildtimeout);
			canbebuildtimeout = -1;
		}
		// Update all when building could be upgraded
		let timeLeft = planet.getNextBuildingReady();
		if(timeLeft>0) {
			canbebuildtimeout = setTimeout(function() {
				planet.drawCanBeBuild();
			},timeLeft);
		}
		// Refresh this when a building is ended
		let timeBeforeEndBuild = (planetData.nextBuildingTime - (Date.now() + planet.deltaNow + 1000));
		if(timeBeforeEndBuild>0) {
			setTimeout(function() {
				planet.drawCanBeBuild();
			},timeBeforeEndBuild + 1000);
		}

		ui.toggleClass('.building-list-active', 'building-list-active', document.getElementById(buildingsNames[planetData.nextBuilding]));

		// @TODO: Draw if a building can be upgraded (use of planet.canBeBuild())
	}
	/*
	Gets the energy consomation.
	
	@return     {number}  The energy consomation.
	*/
	static getEnergyConsomation() {
		let energy = 0;

		for(let i=0; i<9; i++) {
			energy += planet.getBuildCost(i,planetData.Buildings[i]).energy;
		}

		return energy;
	}

	/**
	 * Gets the current habitant use.
	 *
	 * @return     {number}  The current habitant use
	 */
	static getHabitantConsomation() {
		let habitants = 0;
		let buildings = planetData.Buildings;

		// Buildings
		for(let i=0; i<14; i++) {
			if(buildings[i]===0) { continue; }
			if(i===planetData.nextBuilding) {
				// Current in-build building
				habitants += parseInt(planet.getBuildCost(i,buildings[i] + 1).habitants);
				continue; 
			}
			habitants += parseInt(planet.getBuildCost(i,buildings[i]).habitants);
		}

		// Units builded and in-build
		for(let i=0; i<units.fleetList.length; i++) {
			habitants += units.fleetList[i].population;
		}

		return habitants;
	}

	/**
	 * Calculates times before this buiding can be build
	 *
	 * @param      {<type>}  building  The building id
	 * @return     {number}  The time before we can build it
	 */
	static getTimeBeforeBuild(building) {
		let cost;
		if(planetData.nextBuilding===building) { cost = planet.getBuildCost(building,planetData.Buildings[building] + 2); } 
		else							      { cost = planet.getBuildCost(building,planetData.Buildings[building] + 1); }
		let costs = [
			['building-cost-iron',cost.iron],
			['building-cost-aluminium',cost.aluminium],
			['building-cost-copper',cost.copper],
			['building-cost-titanium',cost.titanium],
		];

		let ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		let timeCurrent = 0;
		for(let i=0; i<4; i++) {
			if(planetData.resources[i+2] < costs[i][1]) {
				let time = ((costs[i][1] - planetData.resources[i+2])/(metalProdBase*ratios[i]));
				if(time > timeCurrent) {
					timeCurrent = time;
				}	
			}
		}

		return timeCurrent;
	}

	static buildingHasRequirements(id) {
		// @TODO: Will be activated soon, just disabled to make tests on dev server
		//if(planetData.Buildings[id] > 0) { return ''; }
		if(buildingParents[id] === undefined) { return ''; }

		let requirements = '';

		for(let i=0; i<buildingParents[id].research.length; i++) {
			if(!research.isSearched(buildingParents[id].research[i])) {
				requirements += ', ' + translate['research'][buildingParents[id].research[i]].name;
			}
		}

		for(let i=0; i<buildingParents[id].building.length; i++) {
			let currentBuilding = buildingParents[id].building[i];
			if(currentBuilding[1] > planetData.Buildings[currentBuilding[0]]) {
				requirements += ', ' + translate['buildings'][currentBuilding[0]].name + ' ' + translate.messages['LEVEL'] + ' ' + currentBuilding[1];
			}
		}

		return requirements.substring(1);
	}

	/**
	 * Determines ability to be build.
	 *
	 * @param      {<type>}  building  The building ID
	 */
	static canBeBuild(id) {
		return (
			planet.getTimeBeforeBuild(id) === 0 &&
			planetData.Buildings[id] + 1 <= buildingMaxLvl[id] &&
			(planetData.nextBuildingTime-Date.now()+planet.deltaNow) < 0 &&
			planet.buildingHasRequirements(id)
		);
	}

	/*
	 * Gets the next building ready.
	 *
	 * @return     {number}  The time before the next can be build.
	 */
	static getNextBuildingReady() {
		let timeLeft = planet.getTimeBeforeBuild(0);

		for(let i=1; i<14; i++) {
			let timeCurrent = planet.getTimeBeforeBuild(i);
			if(timeCurrent < timeLeft && timeCurrent!==0) {
				timeLeft = timeCurrent;
			}
		}

		return timeLeft;
	}

	/**
	 * Draw miscellaneaous things on HUD
	 */
	static MiscDrawUpdate() {
		//Planet name
		document.getElementById('hud-planet-name').innerText = planetData.name;

		//Page Title
		ui.updatePageTitle();

		if(!planetData.address) { return; }

		let sector = planetData.address.split('-');
		sector.pop();
		sector.pop();
		sector = sector.join('-');

		map.loadXML(sector, function() {
			//Set background
			planetBack.init(planetData.planetType);
		});
	}

	/**
	 * Gets the type of planet by its adress
	 *
	 * @param      {<type>}  address  Planet address
	 * @return     {<type>}  Planet type
	 */
	static getTypeOfPlanet(address) {
		let system = address.split('-');
		system.pop();
		system = system.join('-');

		return map.planetData[system][address].planetType;
	}

	/**
	 * Open the buildpanel.
	 *
	 * @param      {string}  id      Building ID
	 */
	static buildPanelOpen(id) {
		if(id === planet.buildPanel) {
			planet.buildPanelHide();
			return;
		}

		planet.buildPanel = id;
		let dateNow = new Date();

		if(planet.buildPanelInterval!==-1) {
			clearTimeout(planet.buildPanelInterval);
			planet.buildPanelInterval = -1;
		}

		 //Next level cost
		let cost;
		if(planetData.nextBuilding===id) { cost = planet.getBuildCost(id,planetData.Buildings[id] + 2); } 
		else							{ cost = planet.getBuildCost(id,planetData.Buildings[id] + 1); }

		let max = planetData.Buildings[id]+1 > buildingMaxLvl[id];
		let max2 = ((planetData.Buildings[id]+2 > buildingMaxLvl[id]) && (planetData.nextBuilding==id));

		/* Planet Construction Tab */
		document.getElementById('building-name').innerText = translate.buildings[id].name;
		document.getElementById('building-level').innerText = translate.messages['LEVEL'] + ' ' +  planetData.Buildings[id];
		document.getElementById('building-desc').innerText = translate.buildings[id].desc;
		ui.show('#building-area');
		document.getElementById('building-img').src = cdnURL+'img/buildings/desc/' + translate.buildings[id].id + '.jpg';
		ui.show('#building-cost');

		/* Ressources */
		let costs = [
			['building-cost-iron',cost.iron],
			['building-cost-aluminium',cost.aluminium],
			['building-cost-copper',cost.copper],
			['building-cost-titanium',cost.titanium]
		];
		for(let i=0; i<4; i++) {
			if(costs[i][1]==0) {
				ui.hide('#' + costs[i][0]);
			} else {
				ui.show('#' + costs[i][0], 'inline-block');
				document.getElementById(costs[i][0]+'-val').innerHTML = GetBetterUnit(costs[i][1],'t',planetData.resources[i+2]);
			}
		}
		/* Calc max wait time */
		planet.enoughResources = planet.getTimeBeforeBuild(id);

		/* Energie */
		if(cost.energy==0) {
			ui.hide('#building-cost-energy');
		} else {
			ui.show('#building-cost-energy', 'inline-block');
			document.getElementById('building-cost-energy-val').innerHTML =
				GetBetterUnit(cost.energy,'Wh (+' + 
					GetBetterUnit(cost.energy_difference,'Wh',energyProd-energyCons) + ')',
					cost.energy + energyProd - energyCons - cost.energy_difference);
		}
		/* Habitants */
		if(cost.habitants==0) {
			ui.hide('#building-cost-population');
		} else {
			ui.show('#building-cost-population', 'inline-block');
			document.getElementById('building-cost-population-val').innerHTML =
				GetBetterUnit(cost.habitants,' (+' + 
					GetBetterUnit(cost.habitants_difference,'',habProd-habCons) + ')',
					cost.habitants + habProd - habCons - cost.habitants_difference);
		}
		/* Temps */
		if(id > 8) { // Faster if shipyard have higher lvl
			cost.time *= (1-(buildLvlUnitBuildingSpeedBonus*planetData.Buildings[7]));
		}
		document.getElementById('building-cost-time-val').innerHTML = getStringTime(cost.time);

		/* Bouton upgrade ou message */
		// Defaut Value
		if(planetData.Buildings[id]==0) {
			document.getElementById('building-upgrade').value = translate.messages['BUILD'];
		} else {
			document.getElementById('building-upgrade').value = translate.messages['UPGRADE'];
		}
		document.getElementById('building-upgrade').setAttribute('onclick','');
		ui.hide('#building-upgrade');
		ui.show('#building-message', 'inline-block');

		let requirements = planet.buildingHasRequirements(id);

		// Edits
		if(max) { // Max Level
			document.getElementById('building-message').innerHTML = translate.messages['UPGRADE_MAX'];
			ui.hide('#building-cost');
		} else if(requirements !== '') { // Another building in build mode
			document.getElementById('building-message').innerHTML = translate.messages['MISSING_PARENTS'] + ": " + requirements;
		} else if(planetData.nextBuilding == id && planetData.nextBuildingTime > (Date.now() + planet.deltaNow)) { // Current building in build mode
			let dateEnd = new Date(planetData.nextBuildingTime + planet.deltaNow);
			let dateTom = new Date(Date.now() + (24*60*60*1000));

			if(dateNow.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Same day
				document.getElementById('building-message').innerHTML = translate.messages['BUILD_FINISH_TODAY_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
			} else if(dateTom.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Tomorrow
				document.getElementById('building-message').innerHTML = translate.messages['BUILD_FINISH_TOMORROW_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
			} else {
				document.getElementById('building-message').innerHTML = translate.messages['BUILD_FINISH_THE'] + ' <em>' + dateEnd.toLocaleDateString() + '</em> ' + translate.messages['BUILD_FINISH_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
			}

			planet.buildPanelInterval = setTimeout(function() {
				planet.buildPanelOpen(id);
			},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planet.deltaNow); // Refresh at 00:00:05
		} else if(planet.enoughResources>0) { // No enought Ressources
			let dateEnd = new Date(Date.now() + planet.enoughResources*3600*1000);
			let dateTom = new Date(Date.now() + (24*60*60*1000));

			if(dateNow.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Same day
				document.getElementById('building-message').innerHTML = translate.messages['ENOUGH_RESOURCES_TODAY_AT'] + ' ' + dateEnd.toLocaleTimeString();
			} else if(dateTom.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Tomorrow
				document.getElementById('building-message').innerHTML = translate.messages['ENOUGH_RESOURCES_TOMORROW_AT'] + ' ' + dateEnd.toLocaleTimeString();
			} else {
				document.getElementById('building-message').innerHTML = translate.messages['ENOUGH_RESOURCES_THE'] + ' ' + dateEnd.toLocaleDateString() + ' ' + translate.messages['ENOUGH_RESOURCES_AT'] + ' ' + dateEnd.toLocaleTimeString();
			}

			planet.buildPanelInterval = setTimeout(function() {
				planet.buildPanelOpen(id);
			},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planet.deltaNow); // Refresh at 00:00:05
		} else if(planetData.nextBuilding!=-1 && planetData.nextBuildingTime > (Date.now() + planet.deltaNow)) { // Another building in build mode
			document.getElementById('building-message').innerHTML = translate.messages['ANOTHER_IN_BUILD'];
			planet.buildPanelInterval = setTimeout(function() {
				planet.buildPanelOpen(id);
			},planetData.nextBuildingTime - (Date.now() + planet.deltaNow + 1000));
		} else {
			ui.hide('#building-message');
			ui.show('#building-upgrade');
			document.getElementById('building-upgrade').setAttribute('onclick','planet.build('+id+')');
		}

		// Bonus
		let title = '',
			icon = '',
			value = '',
			valuep1 = '';
	
		ui.show('#building-bonus-br');

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
			case 5: // Warehouse
				title = translate['planet-ui']['storage'];
				icon = translate['planet-ui']['min&met'];
				value = GetBetterUnit(mineralStorageBase,'t') + '/' + GetBetterUnit(metalsStorageBase,'t') + translate['planet-ui']['total']; 
				valuep1 = ' (+ ' + GetBetterUnit(mineralStorageBase1 - mineralStorageBase,'t') + '/+ ' +  GetBetterUnit(metalsStorageBase1 - metalsStorageBase,'t')
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				ui.hide('#building-bonus-br');
				break;
			case 6: // Headquarters
				title = translate['planet-ui']['availableFleets'];
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
				let val = heliumProdBase1 - heliumProdBase;
				if(val < 0) { val = heliumProdBase1; }
				valuep1 = ' (+ ' + GetBetterUnit(val,'t/h') 
					+ ' ' + translate['planet-ui']['afterUpdating'] + ')';
				break;
			default:
		}

		if(planetData.Buildings[id]==0 && value != '') { value = '0'; } // If lvl, we set to 0

		document.getElementById('building-bonus-title').innerHTML = title;
		document.getElementById('building-bonus-icon').innerHTML = icon;
		if(max || max2) {
			document.getElementById('building-bonus-val').innerHTML = value;
		} else {
			document.getElementById('building-bonus-val').innerHTML = value + valuep1;
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

		ui.closeTab('#building-area');
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
		if(build < 0 || build > globalConst.buildingNumber) { return; }

		let retour = {
			aluminium: 	Math.round(buildCost['aluminium'][build][0]*Math.pow(level,2) +		buildCost['aluminium'][build][1]*level + 	buildCost['aluminium'][build][2]),
			iron: 		Math.round(buildCost['iron'][build][0]*Math.pow(level,2) +			buildCost['iron'][build][1]*level + 		buildCost['iron'][build][2]),
			copper: 	Math.round(buildCost['copper'][build][0]*Math.pow(level,2) + 		buildCost['copper'][build][1]*level + 		buildCost['copper'][build][2]),
			titanium: 	Math.round(buildCost['titanium'][build][0]*Math.pow(level,2) + 		buildCost['titanium'][build][1]*level + 	buildCost['titanium'][build][2]),
			time: 				   buildCost['time'][build][0]*Math.pow(level,2) + 			buildCost['time'][build][1]*level + 		buildCost['time'][build][2],
			energy: 	Math.round(Math.pow(buildCost['energy'][build][0]*level,2) + 		buildCost['energy'][build][1]*level + 		buildCost['energy'][build][2]),
			energy_difference: Math.round(Math.pow(buildCost['energy'][build][0]*level,2) + buildCost['energy'][build][1]*level +       buildCost['energy'][build][2] 
			                        - (Math.pow(buildCost['energy'][build][0]*(level-1),2) + buildCost['energy'][build][1]*(level-1) +   buildCost['energy'][build][2])),
			habitants:  Math.round(buildCost['habitants'][build][0]*Math.pow(level,2) +		buildCost['habitants'][build][1]*level + 	buildCost['habitants'][build][2]),
			habitants_difference: Math.round(buildCost['habitants'][build][0]*Math.pow(level,2) +	buildCost['habitants'][build][1]*level + 	buildCost['habitants'][build][2]
				                         - (buildCost['habitants'][build][0]*Math.pow((level-1),2) +	buildCost['habitants'][build][1]*(level-1) + buildCost['habitants'][build][2])),
		};

		if(level == 1) {
			retour.habitants_difference = retour.habitants;
			retour.energy_difference = retour.energy;
		}

		return retour;
	}
	
	/**
	 * Go to previous planet
	 */
	static prev() {
		socket.emit('planet-ask-data-prev', userData);
	}
	/**
	 * Go to next planet
	 */
	static next() {
		socket.emit('planet-ask-data-next', userData);
	}

	/**
	 * Opens the planet panel of a different planet than current (mostly other players)
	 */
	static openOtherPlanetPanel() {
		let type = planet.getTypeOfPlanet(units.planetTarget);
		planetBack.init(type);

		let system = units.planetTarget.split('-');
		system.pop();
		system = system.join('-');

		let pData = map.planetData[system][units.planetTarget];

		// Set informations
		document.getElementById('planet-other-address-data').innerText = units.planetTarget;

		if(pData !== undefined) {
			if(pData.ally == '') {
				document.getElementById('planet-other-ally-data').innerText = 'Aucune alliance';
			} else {
				document.getElementById('planet-other-ally-data').innerText = pData.ally;
			}
			
			document.getElementById('planet-other-player-data').innerText = pData.ownerName;
			document.getElementById('planet-other-planet-data').innerText =  pData.name;
			document.getElementById('planet-other-points-data').innerText =  pData.points;

			document.getElementById('planet-other-planet').style.display = 'inline';
			document.getElementById('planet-other-points').style.display = 'inline';
		} else {
			document.getElementById('planet-other-ally-data').innerText = 'Aucune alliance';
			document.getElementById('planet-other-player-data').innerText = 'Aucun joueur';
			document.getElementById('planet-other-planet').style.display = 'none';
			document.getElementById('planet-other-points').style.display = 'none';
		}

		if(units.planetTarget.split('S').length == 2) {
			document.getElementById('planet-other-ally').style.display = 'none';
			document.getElementById('planet-other-player').style.display = 'none';
		} else {
			document.getElementById('planet-other-ally').style.display = 'inline';
			document.getElementById('planet-other-player').style.display = 'inline';
		}

		//@TODO: Add last reports

		// Show/Hide UIs
		if(!ui.chat) {
			if(ui.mapChat) {
				ui.show('#hud-chat');
			}
			ui.chat = ui.mapChat;
		}

		ui.hide('#hud-top');
		ui.hide('#hud-map');

		ui.hide('#planet-current');
		ui.show('#planet-other');
	}
}