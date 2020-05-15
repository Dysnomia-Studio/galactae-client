let resourcesinterval = -1;
let autobuildingrefresh = -1;
let canbebuildtimeout = -1;

let planetData = { //Not complete but some are needed on init because of bugs
	planetType: 0,
	address: userData.pid,
	resources: {},
	Buildings: {},
};

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

class planetUI {
	/**
	 * Initilalize planet
	 */
	static init() {
		planetUI.buildPanel = -1; // Current opened building
		planetUI.buildPanelInterval = -1; // Time before next client auto update
		planetUI.enoughResources = -1; // Time before enough ressources
		planetUI.deltaNow = 0; // Security measure
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

		planetUI.deltaNow = data.sNow - Date.now();

		if(data.data.nextBuildingTime) {
			data.data.nextBuildingTime = new Date(data.data.nextBuildingTime);
		}
		data.data.lastResourcesUpdate = new Date(data.data.lastResourcesUpdate);
		data.data.lastUnitUpdate = new Date(data.data.lastUnitUpdate);
		if(data.data.unitBuildingEndTime) {
			data.data.unitBuildingEndTime = new Date(data.data.unitBuildingEndTime);
		}

		// Clientside Calc for ressource auto-update
		if(resourcesinterval === -1) {
			resourcesinterval = setInterval(function() {
				planetUI.simMyRealRessources();
				research.sim();
			},2*TIME.SECONDS_TO_MS);
		}

		for(const key in data.data) {
			planetData[key] = data.data[key];
		}

		if(Object.keys(data.data).length === 1 && typeof data.data.resources !== 'undefined') {
			// Next update will draw it, no need to recalc all planet, etc.
			return;
		}

		userData = Tutorials.updateTutorialList(userData, planetData, units.fleetList, units.list);

		// Chargement de la map
		map.init(planetData.address);

		// Chargement des unites (utiles pour le cooldown)
		units.drawMain();

		userData.pid = planetData.address;

		// Edit Data
		planetUI.BuildingDrawUpdate();
		planetUI.ResourcesDrawUpdate(); // Needed to be after building for ratios
		planetUI.MiscDrawUpdate();
		planetUI.InfoPopupDrawUpdate();
		planetUI.drawCanBeBuild();

		// Clear existing timeout
		if(autobuildingrefresh !== -1) {
			clearTimeout(autobuildingrefresh);
			autobuildingrefresh = -1;
		}
		// Create timeout: sync where the next building is ended
		if(planetData.nextBuildingTime) {
			autobuildingrefresh = setTimeout(function() {
				planetUI.sync();
				autobuildingrefresh = -1;
			},planetData.nextBuildingTime.getTime()-Date.now()+planetUI.deltaNow+5000); // Wait 5 sec
		}

		// Refresh buildPanel
		if(planetUI.buildPanel !== -1) {
			planetUI.buildPanelOpen(planetUI.buildPanel);
		}

		// Needed late after load ...
		ui.loadHUDButtons();
	}

	/**
	 * Clientside simulation of growing resources
	 */
	static simMyRealRessources() {
		if(!Conquest.isPlanetBeingConquested()) {
			planetData.resources = Resources.CalcNewResources(
				planetData.resources,
				planetData.Buildings,
				planetData.planetType,
				2*TIME.SECONDS_TO_MS, // 2 secondes
				userData,
				planetData.nextBuilding
			);
		}

		//Helium 3
		document.getElementById('he-fuel-distribute').style.display = 'none';

		if(planetData.Buildings[13] !== 0) {

			if(units.fleetList && units.fleetList.length > 0) {
				let empty;
				[planetData, units.fleetList, empty] = Fleets.distributeFuel(Object.assign({}, planetData), units.fleetList.slice(0), userData);

				// @TODO: Update before full on server

				if(!empty) {
					document.getElementById('he-fuel-distribute').style.display = 'inline';
				}
			}
		}

		planetUI.ResourcesDrawUpdate();
	}


	/**
	 * Construire un bâtiment
	 *
	 * @param      {<type>}  id      Building ID
	 */
	static build(id) {
		if(planetData.Buildings[id]+1 > buildingMaxLvl[planetData.planetType][id]) {
			ui.drawMessage('MAX_LEVEL');
		} else {
			socket.emit('planet-build', { planet: planetData.address, id: userData.id, username: userData.username, building: id });
		}
	}

	/**
	 * Afficher les modifications de quantité de ressources
	 *
	 * @class      ResourcesDrawUpdate (name)
	 */
	static ResourcesDrawUpdate() {
		// Top left
		document.getElementById('credits_nmb').innerText = GetBetterUnit(userData.money);
		document.getElementById('population_nmb').innerHTML = GetBetterUnit(habProd - habCons);
		document.getElementById('research_nmb').innerHTML = GetBetterUnit(researchProd,'/h');
		document.getElementById('moral_nmb').innerHTML = Math.round(Buildings.calcPlanetMorale(planetData.Buildings)*100)+'%';

		//Top right
		document.getElementById('minerals_nmb').innerHTML = GetBetterUnit(Math.floor(planetData.resources[0]),'t',mineralStorageBase);
		document.getElementById('he_nmb').innerHTML = GetBetterUnit(Math.floor(planetData.resources[1]),'t',storageHelium);
		document.getElementById('fe_nmb').innerHTML = GetBetterUnit(Math.floor(planetData.resources[2]),'t',metalsStorageBase*ratio.ironRatio);
		document.getElementById('al_nmb').innerHTML = GetBetterUnit(Math.floor(planetData.resources[3]),'t',metalsStorageBase*ratio.aluRatio);
		document.getElementById('cu_nmb').innerHTML = GetBetterUnit(Math.floor(planetData.resources[4]),'t',metalsStorageBase*ratio.copperRatio);
		document.getElementById('ti_nmb').innerHTML = GetBetterUnit(Math.floor(planetData.resources[5]),'t',metalsStorageBase*ratio.titanRatio);
	}

	/**
	 * Recalc ressources
	 */
	static recalcBaseRessources() {
		const buildings = planetData.Buildings;

		ratio = Resources.GetRatiosPerPlanet(planetData.planetType);
		ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) + mineralProd[1]*buildings[0] + mineralProd[2];
		mineralProdBase1 = mineralProd[0]*Math.pow((buildings[0] + 1),2) + mineralProd[1]*(buildings[0] + 1) + mineralProd[2];

		metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   + metalProd[1]*buildings[1]   + metalProd[2];
		metalProdBase1   = metalProd[0]*Math.pow((buildings[1] + 1),2)   + metalProd[1]*(buildings[1] + 1)   + metalProd[2];

		heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  + heliumProd[1]*buildings[13]  + heliumProd[2];
		heliumProdBase1  = heliumProd[0]*Math.pow((buildings[13] + 1),2)  + heliumProd[1]*(buildings[13]+1)  + heliumProd[2];

		[ mineralStorageBase, metalsStorageBase, storageHelium ] = Buildings.calcStorageCapacity(buildings[5], buildings[10], research.isSearched(userData, 'cp_molecular_compression'));
		[ mineralStorageBase1, metalsStorageBase1, storageHelium1 ] = Buildings.calcStorageCapacity(buildings[5] + 1, buildings[10] + 1, research.isSearched(userData, 'cp_molecular_compression'));

		// Energy
		energyProd = Buildings.getEnergyProd(buildings);
		energyProd1 = Math.round(electricity[0]*Math.pow((buildings[4]+1),2) + electricity[1]*(buildings[4]+1) + electricity[2]);
		energyCons = Buildings.getEnergyCons(buildings);

		// Habitants
		[ habProd, habCons ] = Buildings.getPeopleConsAndProd(planetData, units.fleetList);
		habProd1 = Math.round(habGen[0]*Math.pow((buildings[2]+1),2) + habGen[1]*(buildings[2]+1) + habGen[2]);

		// Research
		researchProd = Research.getResearchProduction(buildings[8]);
		researchProd1 = Research.getResearchProduction(buildings[8] + 1);
	}

	/**
	 * Afficher les modifications en rapport avec les batiments (niveaux ou production)
	 *
	 * @class      BuildingDrawUpdate (name)
	 */
	static BuildingDrawUpdate() {
		planetUI.recalcBaseRessources();

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
			document.getElementById('he-prod').innerHTML = GetBetterUnit(0,'t/h',0);
		} else {
			document.getElementById('he-prod').innerHTML = GetBetterUnit(heliumProdBase,'t/h');
		}
		// Iron
		document.getElementById('fe-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.ironRatio,'t');
		if(planetData.resources[2]>=metalsStorageBase*ratio.ironRatio) {
			document.getElementById('fe-prod').innerHTML = GetBetterUnit(0,'t/h',0);
		} else {
			document.getElementById('fe-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.ironRatio,'t/h');
		}
		document.getElementById('fe-variety').innerHTML = GetBetterUnit(ratio.ironRatio*100,'%');
		// Aluminium
		document.getElementById('al-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.aluRatio,'t');
		if(planetData.resources[3]>=metalsStorageBase*ratio.aluRatio) {
			document.getElementById('al-prod').innerHTML = GetBetterUnit(0,'t/h',0);
		} else {
			document.getElementById('al-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.aluRatio,'t/h');
		}
		document.getElementById('al-variety').innerHTML = GetBetterUnit(ratio.aluRatio*100,'%');
		// Copper
		document.getElementById('cu-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.copperRatio,'t');
		if(planetData.resources[4]>=metalsStorageBase*ratio.copperRatio) {
			document.getElementById('cu-prod').innerHTML = GetBetterUnit(0,'t/h',0);
		} else {
			document.getElementById('cu-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.copperRatio,'t/h');
		}
		document.getElementById('cu-variety').innerHTML = GetBetterUnit(ratio.copperRatio*100,'%');
		// Titanium
		document.getElementById('ti-cap').innerHTML = GetBetterUnit(metalsStorageBase*ratio.titanRatio,'t');
		if(planetData.resources[5]>=metalsStorageBase*ratio.titanRatio) {
			document.getElementById('ti-prod').innerHTML = GetBetterUnit(0,'t/h',0);
		} else {
			document.getElementById('ti-prod').innerHTML = GetBetterUnit(metalProdBaseTemp*ratio.titanRatio,'t/h');
		}
		document.getElementById('ti-variety').innerHTML = GetBetterUnit(ratio.titanRatio*100,'%');


		document.getElementById('electricity_nmb').innerHTML = GetBetterUnit(energyProd-energyCons,'Wh');
		document.getElementById('electricity-available').innerHTML = GetBetterUnit(energyProd-energyCons,'Wh');
		document.getElementById('electricity-used').innerHTML = GetBetterUnit(energyCons,'Wh');
		document.getElementById('electricity-total').innerHTML = GetBetterUnit(energyProd,'Wh');

		document.getElementById('population_nmb').innerHTML = GetBetterUnit(habProd-habCons,'');
		document.getElementById('population-available').innerHTML = GetBetterUnit(habProd-habCons,'');
		document.getElementById('population-used').innerHTML = GetBetterUnit(habCons,'');
		document.getElementById('population-total').innerHTML = GetBetterUnit(habProd,'');

		const pCountTotal = Conquest.getPlanetMaxCount(userData.points);
		const pCountUsed = userData.planetlist.length;

		document.getElementById('planetCount_nmb').innerHTML = pCountUsed + '/' + pCountTotal;
		document.getElementById('planetCount-available').innerHTML = pCountTotal - pCountUsed;
		document.getElementById('planetCount-used').innerHTML = pCountUsed;
		document.getElementById('planetCount-total').innerHTML = pCountTotal;
		document.getElementById('planetCount-next-level').innerHTML = Conquest.minPointForPlanetCount(pCountTotal + 1) + ' pts';
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
		const timeLeft = planetUI.getNextBuildingReady();
		if(timeLeft>0) {
			canbebuildtimeout = setTimeout(function() {
				planetUI.drawCanBeBuild();
			},timeLeft*TIME.HOUR_TO_MS);
		}

		// Refresh this when a building is ended
		const nextBuildingTime = (!planetData.nextBuildingTime) ? -1 : planetData.nextBuildingTime.getTime();
		const timeBeforeEndBuild = (nextBuildingTime- (Date.now() + planetUI.deltaNow + 1000));
		if(timeBeforeEndBuild > 0) {
			setTimeout(function() {
				planetUI.drawCanBeBuild();
			},timeBeforeEndBuild + 1000);
		}

		ui.toggleClass('.building-list-active', 'building-list-active', document.getElementById(buildingsNames[planetData.nextBuilding]));

		// @TODO: Draw if a building can be upgraded (use of planetUI.canBeBuild())
	}

	/**
	 * Calculates times before this buiding can be build
	 *
	 * @param      {<type>}  building  The building id
	 * @return     {number}  The time before we can build it
	 */
	static getTimeBeforeBuild(building) {
		let cost;
		if(planetData.nextBuilding===building) {
			cost = Buildings.GetCost(building,planetData.Buildings[building] + 2);
		} else {
			cost = Buildings.GetCost(building,planetData.Buildings[building] + 1);
		}

		const costs = [
			['building-cost-iron',cost.iron],
			['building-cost-aluminium',cost.aluminium],
			['building-cost-copper',cost.copper],
			['building-cost-titanium',cost.titanium],
		];

		const ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		let timeCurrent = 0;
		for(let i=0; i<4; i++) {
			if(planetData.resources[i+2] < costs[i][1]) {
				const time = ((costs[i][1] - planetData.resources[i+2])/(metalProdBase*ratios[i]));
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
		const nextBuildingTime = (planetData.nextBuildingTime === null) ? -1 : planetData.nextBuildingTime.getTime();
		return (
			planetUI.getTimeBeforeBuild(id) === 0 &&
			planetData.Buildings[id] + 1 <= buildingMaxLvl[planetData.planetType][id] &&
			(nextBuildingTime-Date.now()+planetUI.deltaNow) < 0 &&
			Buildings.HasRequirements(userData, planetData, id)
		);
	}

	/*
	 * Gets the next building ready.
	 *
	 * @return     {number}  The time before the next can be build.
	 */
	static getNextBuildingReady() {
		let timeLeft = planetUI.getTimeBeforeBuild(0);

		for(let i=1; i<14; i++) {
			const timeCurrent = planetUI.getTimeBeforeBuild(i);
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

		if(typeof map.xmlDoc !== 'undefined') {
			map.loadMapAndNeighborhood(sector, function() {
				//Set background
				planetBack.init(planetData.planetType);
			});
		}
	}

	static InfoPopupDrawUpdate() {
		ui.hide('#planet-conquest-popup');
		ui.hide('#planet-research-popup');

		if(Conquest.isPlanetBeingConquested()) {
			planetUI.InfoPopupDrawConquest();
		} else if(planetData.currResearch && planetData.currResearch !== '' && !Research.isSearched(userData, planetData.currResearch)) {
			planetUI.InfoPopupDrawResearch();
		}
	}

	static InfoPopupDrawConquest() {
		ui.empty('#planet-conquest-popup');

		const popup = document.getElementById('planet-conquest-popup');

		if(Conquest.isDefender()) {
			const span = document.createElement('span');
			span.innerText = translate['messages'].BEING_CONQUESTED_BY;
			popup.appendChild(span);

			const span2 = document.createElement('span');
			span2.classList.add('planet-info-important');
			span2.innerText = Conquest.getConquestor();
			popup.appendChild(span2);
		} else {
			const span = document.createElement('span');
			span.innerText = translate['messages'].YOU_ARE_CONQUERING;
			popup.appendChild(span);

			const span2 = document.createElement('span');
			span2.classList.add('planet-info-important');
			span2.innerText = planetData.address;
			popup.appendChild(span2);
		}

		popup.appendChild(document.createElement('br'));
		popup.appendChild(document.createElement('br'));

		const spanConquestEndTime = document.createElement('span');
		spanConquestEndTime.innerText = translate['messages'].BEING_CONQUESTED_END;
		popup.appendChild(spanConquestEndTime);

		const spanConquestEndTime2 = document.createElement('span');
		spanConquestEndTime2.classList.add('planet-info-important');
		spanConquestEndTime2.innerText = getDateTime(Conquest.getConquestEndTime());
		popup.appendChild(spanConquestEndTime2);

		ui.show('#planet-conquest-popup');
	}

	static InfoPopupDrawResearch() {
		ui.empty('#planet-research-popup');

		const production = Research.getResearchProduction(planetData.Buildings[8]);

		const popup = document.getElementById('planet-research-popup');

		const description = document.createElement('p');

		const spanCurrResearch = document.createElement('span');
		spanCurrResearch.innerText = translate['research'].current_research;
		description.appendChild(spanCurrResearch);

		description.appendChild(document.createElement('br'));

		const spanCurrResearchName = document.createElement('span');
		spanCurrResearchName.innerText = translate.research[planetData.currResearch].name;
		description.appendChild(spanCurrResearchName);

		description.appendChild(document.createElement('br'));

		// Research status
		const spanCurrResearchStatus = document.createElement('span');
		spanCurrResearchStatus.innerText = Math.floor(userData.research[planetData.currResearch]) + '/' + researchList[planetData.currResearch].cost;
		description.appendChild(spanCurrResearchStatus);

		description.appendChild(document.createElement('br'));

		// Research time
		const spanCurrResearchTime = document.createElement('span');

		let researchTime = (researchList[planetData.currResearch].cost - userData.research[planetData.currResearch]) / production;
		spanCurrResearchTime.innerText = getStringTime(researchTime);

		description.appendChild(spanCurrResearchTime);

		popup.appendChild(description);

		const link = document.createElement('a');
		link.id = 'planet-info-popup-right';
		link.classList.add('research-search');
		link.classList.add('planet-info-important');
		link.innerText = translate['research'].go_to_research;
		link.addEventListener('click', () => {
			research.openUI();
		});
		popup.appendChild(link);

		ui.show('#planet-research-popup');

		// Refresh periodically
		clearInterval(planetUI.InfoPopupResearchInterval);
		planetUI.InfoPopupResearchInterval = setInterval(() => {
			if(!researchList[planetData.currResearch]) {
				return;
			}

			researchTime -= 1/3600;
			spanCurrResearchTime.innerText = getStringTime(researchTime);

			spanCurrResearchStatus.innerText = Math.floor(userData.research[planetData.currResearch]) + '/' + researchList[planetData.currResearch].cost;
		},1000);
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
		if(id === planetUI.buildPanel) {
			planetUI.buildPanelHide();
			return;
		}

		planetUI.buildPanel = id;
		const dateNow = new Date();

		if(planetUI.buildPanelInterval!==-1) {
			clearTimeout(planetUI.buildPanelInterval);
			planetUI.buildPanelInterval = -1;
		}

		//Next level cost
		let cost;
		if(planetData.nextBuilding===id) {
			cost = Buildings.GetCost(id,planetData.Buildings[id] + 2);
		} else {
			cost = Buildings.GetCost(id,planetData.Buildings[id] + 1);
		}

		const max = planetData.Buildings[id]+1 > buildingMaxLvl[planetData.planetType][id];
		const max2 = ((planetData.Buildings[id]+2 > buildingMaxLvl[planetData.planetType][id]) && (planetData.nextBuilding === id));

		/* Planet Construction Tab */
		document.getElementById('building-name').innerText = translate.buildings[id].name;
		document.getElementById('building-level').innerText = translate.messages['LEVEL'] + ' ' +  planetData.Buildings[id];
		document.getElementById('building-desc').innerText = translate.buildings[id].desc;
		ui.show('#building-area');
		document.getElementById('building-img').src = cdnURL+'img/buildings/desc/' + translate.buildings[id].id + '.jpg';
		ui.show('#building-cost');

		/* Ressources */
		const costs = [
			['building-cost-iron',cost.iron],
			['building-cost-aluminium',cost.aluminium],
			['building-cost-copper',cost.copper],
			['building-cost-titanium',cost.titanium],
		];
		for(let i=0; i<4; i++) {
			if(costs[i][1] === 0) {
				ui.hide('#' + costs[i][0]);
			} else {
				ui.show('#' + costs[i][0], 'inline-block');
				document.getElementById(costs[i][0]+'-val').innerHTML = GetBetterUnit(costs[i][1],'t',planetData.resources[i+2]);
			}
		}
		/* Calc max wait time */
		planetUI.enoughResources = planetUI.getTimeBeforeBuild(id);

		/* Energie */
		if(cost.energy === 0) {
			ui.hide('#building-cost-energy');
		} else {
			ui.show('#building-cost-energy', 'inline-block');
			document.getElementById('building-cost-energy-val').innerHTML =
				GetBetterUnit(cost.energy,'Wh (+' +
					GetBetterUnit(cost.energy_difference,'Wh',energyProd-energyCons) + ')',
					cost.energy + energyProd - energyCons - cost.energy_difference);
		}
		/* Habitants */
		if(cost.habitants === 0) {
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
		// Research bonus
		let timeSpeed = 1;
		if(Research.isSearched(userData,'cp_mecanisation')) {
			timeSpeed += researchBonus.cp_mecanisation;
		}

		if(id >= globalConst.groundBuildingNumber) {
			if(Research.isSearched(userData,'cp_tracteur')) {
				timeSpeed += researchBonus.cp_tracteur;
			}
			if(Research.isSearched(userData,'cp_materielTp')) {
				timeSpeed += researchBonus.cp_materielTp;
			}

			// Faster if shipyard have higher lvl
			cost.time *= (1-(buildLvlUnitBuildingSpeedBonus*planetData.Buildings[7]));
		}
		cost.time *= timeSpeed;
		document.getElementById('building-cost-time-val').innerHTML = getStringTime(cost.time);

		/* Bouton upgrade ou message */
		// Defaut Value
		if(planetData.Buildings[id] === 0) {
			document.getElementById('building-upgrade').value = translate.messages['BUILD'];
		} else {
			document.getElementById('building-upgrade').value = translate.messages['UPGRADE'];
		}
		document.getElementById('building-upgrade').setAttribute('onclick','');
		ui.hide('#building-upgrade');
		ui.show('#building-message', 'inline-block');

		const requirements = Buildings.GetRequirements(userData, planetData, id);

		// Edits
		if(max) { // Max Level
			document.getElementById('building-message').innerHTML = translate.messages['UPGRADE_MAX'];
			ui.hide('#building-cost');
		} else if(Conquest.isPlanetBeingConquested()) {
			document.getElementById('building-message').innerHTML = translate.messages['BEING_CONQUESTED_BUILD'];
		} else if(requirements !== '') { // Another building in build mode
			document.getElementById('building-message').innerHTML = translate.messages['MISSING_PARENTS'] + ': ' + requirements;
		} else if(planetData.nextBuilding === id && planetData.nextBuildingTime !== null && planetData.nextBuildingTime.getTime() > (Date.now() + planetUI.deltaNow)) { // Current building in build mode
			const dateEnd = new Date(planetData.nextBuildingTime.getTime() + planetUI.deltaNow);
			const dateTom = new Date(Date.now() + (24*60*60*1000));

			if(dateNow.toLocaleDateString() === dateEnd.toLocaleDateString()) { // Same day
				document.getElementById('building-message').innerHTML = translate.messages['BUILD_FINISH_TODAY_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
			} else if(dateTom.toLocaleDateString() === dateEnd.toLocaleDateString()) { // Tomorrow
				document.getElementById('building-message').innerHTML = translate.messages['BUILD_FINISH_TOMORROW_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
			} else {
				document.getElementById('building-message').innerHTML = translate.messages['BUILD_FINISH_THE'] + ' <em>' + dateEnd.toLocaleDateString() + '</em> ' + translate.messages['BUILD_FINISH_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
			}

			planetUI.buildPanelInterval = setTimeout(function() {
				planetUI.buildPanelOpen(id);
			},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planetUI.deltaNow); // Refresh at 00:00:05
		} else if(!Buildings.hasEnoughtStorage(planetData, id, Research.isSearched(userData, 'cp_molecular_compression'))) {
			document.getElementById('building-message').innerHTML = translate.messages['BUILDING_ERROR_STORAGE'];
		} else if(planetUI.enoughResources>0) { // No enough Ressources
			const dateEnd = new Date(Date.now() + planetUI.enoughResources*3600*1000);
			const dateTom = new Date(Date.now() + (24*60*60*1000));

			if(dateNow.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Same day
				document.getElementById('building-message').innerHTML = translate.messages['ENOUGH_RESOURCES_TODAY_AT'] + ' ' + dateEnd.toLocaleTimeString();
			} else if(dateTom.toLocaleDateString() == dateEnd.toLocaleDateString()) { // Tomorrow
				document.getElementById('building-message').innerHTML = translate.messages['ENOUGH_RESOURCES_TOMORROW_AT'] + ' ' + dateEnd.toLocaleTimeString();
			} else {
				document.getElementById('building-message').innerHTML = translate.messages['ENOUGH_RESOURCES_THE'] + ' ' + dateEnd.toLocaleDateString() + ' ' + translate.messages['ENOUGH_RESOURCES_AT'] + ' ' + dateEnd.toLocaleTimeString();
			}

			planetUI.buildPanelInterval = setTimeout(function() {
				planetUI.buildPanelOpen(id);
			},(((24 - dateNow.getHours())*60 + (60 - dateNow.getMinutes()))*60 + (65 - dateNow.getSeconds()))*1000 + planetUI.deltaNow); // Refresh at 00:00:05
		} else if(planetData.nextBuilding !== -1 && planetData.nextBuildingTime.getTime() > (Date.now() + planetUI.deltaNow)) { // Another building in build mode
			document.getElementById('building-message').innerHTML = translate.messages['ANOTHER_IN_BUILD'];
			planetUI.buildPanelInterval = setTimeout(function() {
				planetUI.buildPanelOpen(id);
			},planetData.nextBuildingTime.getTime() - (Date.now() + planetUI.deltaNow + 1000));
		} else {
			ui.hide('#building-message');
			ui.show('#building-upgrade');
			document.getElementById('building-upgrade').setAttribute('onclick','planetUI.build('+id+')');
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

		if(planetData.Buildings[id] === 0 && value !== '') { value = '0'; } // If lvl, we set to 0

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
		if(planetUI.buildPanelInterval !== -1) {
			clearTimeout(planetUI.buildPanelInterval);
			planetUI.buildPanelInterval = -1;
			planetUI.enoughResources = -1;
		}

		planetUI.buildPanel = -1;

		ui.closeTab('#building-area');
	}


	static getPlanetData(planetId) {
		if(planetId < 0) { planetId = userData.planetlist.length - 1; }
		if(planetId >= userData.planetlist.length) { planetId = 0; }

		socket.emit('planet-ask-data', { id: userData.id, username: userData.username, pid: userData.planetlist[planetId] });
	}

	/**
	 * Go to previous planet
	 */
	static prev() {
		const currPlanet = userData.planetlist.indexOf(userData.pid);

		planetUI.getPlanetData(currPlanet - 1);
	}
	/**
	 * Go to next planet
	 */
	static next() {
		const currPlanet = userData.planetlist.indexOf(userData.pid);

		planetUI.getPlanetData(currPlanet + 1);
	}

	/**
	 * Opens the planet panel of a different planet than current (mostly other players)
	 */
	static openOtherPlanetPanel() {
		const type = planetUI.getTypeOfPlanet(units.planetTarget);
		planetBack.init(type);

		let system = units.planetTarget.split('-');
		system.pop();
		system = system.join('-');

		const pData = map.planetData[system][units.planetTarget];

		// Set informations
		document.getElementById('planet-other-address-data').innerText = units.planetTarget;

		if(!!pData.name) {
			if(pData.ally === '') {
				document.getElementById('planet-other-ally-data').innerText = translate['ui']['no-ally'];
			} else {
				document.getElementById('planet-other-ally-data').innerText = pData.ally;
			}

			document.getElementById('planet-other-player-data').innerText = pData.ownerName;
			document.getElementById('planet-other-planet-data').innerText =  pData.name;
			document.getElementById('planet-other-points-data').innerText =  pData.points;

			ui.show('#planet-other-planet', 'inline');
			ui.show('#planet-other-points', 'inline');
		} else {
			document.getElementById('planet-other-ally-data').innerText = translate['ui']['no-ally'];
			document.getElementById('planet-other-player-data').innerText = translate['ui']['no-player'];

			ui.hide('#planet-other-planet');
			ui.hide('#planet-other-points');
		}

		if(units.planetTarget.split('S').length === 2) {
			ui.hide('#planet-other-ally');
			ui.hide('#planet-other-player');
		} else {
			ui.show('#planet-other-ally', 'inline');
			ui.show('#planet-other-player', 'inline');
		}

		const reports = Reports.reportList.filter((elt) => elt.location === units.planetTarget);
		const reportListElt = document.getElementById('planet-other-lastReports-list');
		ui.emptyElt(reportListElt);

		// @TODO: Spy reports
		if(reports.length === 0) {
			const liElt = document.createElement('li');
			liElt.innerText = translate.map.PLANET_INFO_NOREPORTS;

			reportListElt.append(liElt);
		} else {
			for(const report of reports) {
				const liElt = document.createElement('li');

				liElt.innerText = Reports.buildAtkText(report) + translate['messages']['REPORT_ATTACK'] + Reports.buildDefText(report);
				liElt.addEventListener('click', () => Reports.showReport(report.battleLogId));

				reportListElt.append(liElt);
			}
		}

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