var resourcesinterval = -1;
var autobuildingrefresh = -1;

var planetData = { //Not complete but some are needed on init because of bugs
	type: 0,
	id: userData.pid,
	resources: {},
	groundBuilding: {},
	spaceBuilding: {}
}

var ratio;
var storageRatioMetals; // Metaux
var storageRatioMinerals; // Minerais


class planet {
	static sync() {
		// Ask to the server data on current planet
		socket.emit('ask-planet-info', { planet: userData.pid, username: userData.username, id: userData.id });
	}
	static refresh(data) {
		if(auth(data.id)) {
			// Clientside Calc for ressource auto-update
			if(resourcesinterval==-1) {
				resourcesinterval = setInterval(function() { planet.simMyRealRessources(); },2000);
			}

			planetData = data.data;
			userData.pid = planetData._id;

			// Edit Data
			planet.BuildingDrawUpdate();
			planet.ResourcesDrawUpdate(); // Needed to be after building for ratios
			planet.MiscDrawUpdate();

			if(autobuildingrefresh!=-1) {
				clearTimeout(autobuildingrefresh);
				autobuildingrefresh = -1;
			}
			if(planetData.nextBuildingTime != -1) {
				autobuildingrefresh = setTimeout(function() {

					planetData.groundBuilding[planetData.nextBuilding]++;
					planet.BuildingDrawUpdate();

					if(ui.buildPanel!= -1) {
						OpenBuildingPanel(ui.buildPanel);
					}
					clearTimeout(autobuildingrefresh);
					autobuildingrefresh = -1;
				},Math.ceil((planetData.nextBuildingTime-Date.now()))+1);
			}


			if(ui.buildPanel!= -1) {
				OpenBuildingPanel(ui.buildPanel);
			}
		}
	}
	static simMyRealRessources() {
		// ClientSide simulation of growing resources

		var baseProd = 2*Math.pow(planetData.groundBuilding[1],2)-3* planetData.groundBuilding[1]+139; // Metaux
		var baseProd1 = (2*Math.pow(planetData.groundBuilding[1]+1,2)-3* planetData.groundBuilding[1]+1)+139; // Metaux lvl+1

		// Minerals
		planetData.resources[0] += (2.2*Math.pow(planetData.groundBuilding[0],2)-3*planetData.groundBuilding[0]+145)/1800; //Production Algorithm

		//Helium 3
		planetData.resources[1] = planetData.resources[1]; //Space Resource

		if(planetData.resources[0]-(baseProd/360)>0) { //Verify if you can use basic ressources
			planetData.resources[2] += (baseProd/1800)*ratio.ironRatio; //Iron
			planetData.resources[3] += (baseProd/1800)*ratio.aluRatio; //Aluminium
			planetData.resources[4] += (baseProd/1800)*ratio.copperRatio; //Copper
			planetData.resources[5] += (baseProd/1800)*ratio.titanRatio; //Titanium

			planetData.resources[0] -= (baseProd/1800); //Consomation Algorithm
		}

		//Max Storage
		if(planetData.resources[0]>storageRatioMinerals) {
			planetData.resources[0] = storageRatioMinerals;
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
	}
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
	static build(id) {
		var maxLevels = [
			20,  // Carriere
			25,  // Metallurgie
			25,  // Habitations
			25,  // Serres
			30,  // Centrales Solaires
			25,  // Entrepôts
			25,  // Reservoir
			30,  // Centre de lancement
			30   // Centre de recherches
		];

		if(planetData.groundBuilding[id]+1 > maxLevels[id]) {
			drawMessage('MAX_LEVEL');
		} else {
			socket.emit('ask-build-ground', { planet: planetData._id, id: userData.id, username: userData.username, building: id });
		}
	}
	static ResourcesDrawUpdate() {
		//Top left
		$('#population_nmb').html(GetBetterUnit(Math.round(3242*Math.exp(0.3608*planetData.groundBuilding[2]))));
		$('#research_nmb').html(GetBetterUnit(Math.round(1.96*Math.exp(0.2295*planetData.groundBuilding[8]))));
		$('#moral_nmb').html(50+'%');
		$('#electricity_nmb').html(GetBetterUnit(Math.round(2080000*Math.pow(planetData.groundBuilding[4],2) + 165000*planetData.groundBuilding[4] + 500000),'Wh'));

		//Top right
		$('#minerals_nmb').html(GetBetterUnit(planetData.resources[0],'t',storageRatioMinerals));
		$('#he_nmb').html(GetBetterUnit(planetData.resources[1],'L',42));
		$('#iron_nmb').html(GetBetterUnit(planetData.resources[2],'t',storageRatioMetals*ratio.ironRatio));
		$('#aluminium_nmb').html(GetBetterUnit(planetData.resources[3],'t',storageRatioMetals*ratio.aluRatio));
		$('#copper_nmb').html(GetBetterUnit(planetData.resources[4],'t',storageRatioMetals*ratio.copperRatio));
		$('#titanium_nmb').html(GetBetterUnit(planetData.resources[5],'t',storageRatioMetals*ratio.titanRatio));
	}
	static BuildingDrawUpdate() {
		ratio = planet.GetMineralsRatio(planetData.planetType);
		storageRatioMetals = (2*Math.pow(planetData.groundBuilding[5],2)-3* planetData.groundBuilding[5]+139)*(47.52*Math.log(planetData.groundBuilding[5]) + 8.29); // Metaux
		storageRatioMinerals = (2.2*Math.pow(planetData.groundBuilding[5],2)-3*planetData.groundBuilding[5]+145)*(47.52*Math.log(planetData.groundBuilding[5]) + 8.29); // Minerais
		var baseProd = 2*Math.pow(planetData.groundBuilding[1],2)-3* planetData.groundBuilding[1]+139; // Metaux

		// Buildings Levels
		$('#lvl-carriere').html(planetData.groundBuilding[0]);
		$('#lvl-metallurgy').html(planetData.groundBuilding[1]);
		$('#lvl-living').html(planetData.groundBuilding[2]);
		$('#lvl-serre').html(planetData.groundBuilding[3]);
		$('#lvl-solar').html(planetData.groundBuilding[4]);
		$('#lvl-warehouse').html(planetData.groundBuilding[5]);
		$('#lvl-tank').html(planetData.groundBuilding[6]);
		$('#lvl-launchpad').html(planetData.groundBuilding[7]);
		$('#lvl-research').html(planetData.groundBuilding[8]);

		// Building Production
		$('#minerals-cap').html(GetBetterUnit(storageRatioMinerals,'t',storageRatioMinerals + 1));
		$('#minerals-prod').html(GetBetterUnit(2.2*Math.pow(planetData.groundBuilding[0],2)-3*planetData.groundBuilding[0]+145,'t/h',2.2*Math.pow(planetData.groundBuilding[0],2)-3*planetData.groundBuilding[0]+145 + 1));
		$('#minerals-cons').html(GetBetterUnit(2*Math.pow(planetData.groundBuilding[1],2)-3* planetData.groundBuilding[1]+139,'t/h',2*Math.pow(planetData.groundBuilding[1],2)-3* planetData.groundBuilding[1]+139 + 1));

		$('#he-cap').html(GetBetterUnit(42,'t',42 + 1));
		$('#he-prod').html(GetBetterUnit(0,'t/h',0));
		$('#he-variety').html(GetBetterUnit(0,'%',0));

		$('#fe-cap').html(GetBetterUnit(storageRatioMetals*ratio.ironRatio,'t',storageRatioMetals + 1));
		$('#fe-prod').html(GetBetterUnit(baseProd*ratio.ironRatio,'t/h',baseProd*ratio.ironRatio + 1));
		$('#fe-variety').html(GetBetterUnit(ratio.ironRatio*100,'%',100));

		$('#al-cap').html(GetBetterUnit(storageRatioMetals*ratio.aluRatio,'t',storageRatioMetals + 1));
		$('#al-prod').html(GetBetterUnit(baseProd*ratio.aluRatio,'t/h',baseProd*ratio.aluRatio + 1));
		$('#al-variety').html(GetBetterUnit(ratio.aluRatio*100,'%',100));

		$('#cu-cap').html(GetBetterUnit(storageRatioMetals*ratio.copperRatio,'t',storageRatioMetals + 1));
		$('#cu-prod').html(GetBetterUnit(baseProd*ratio.copperRatio,'t/h',baseProd*ratio.copperRatio + 1));
		$('#cu-variety').html(GetBetterUnit(ratio.copperRatio*100,'%',100));

		$('#ti-cap').html(GetBetterUnit(storageRatioMetals*ratio.titanRatio,'t',storageRatioMetals + 1));
		$('#ti-prod').html(GetBetterUnit(baseProd*ratio.titanRatio,'t/h',baseProd*ratio.titanRatio + 1));
		$('#ti-variety').html(GetBetterUnit(ratio.titanRatio*100,'%',100));
	}
	static MiscDrawUpdate() {
		$('#hud-username').text(userData.username);

		//Planet name
		$('#hud-planet-name span').text(planetData.name);

		//Page Title
		document.title = userData.username + " - " + planetData.name;

		//Set background
		$('#planet-content').css('backgroundImage','url(img/planets/'+planetData.planetType+'.jpg)');

		//Set Build Tabs Background
		$('.build-tab-background').attr("src",'img/buildings-tabs/'+planetData.planetType+'.png');
	}
	 /* GetBuildCost
	Retourner les coûts de construction et d'utilisation du bâtiment.
	INPUT: build (int)
	OUTPUT: cost(array)
	*/
	static getBuildCost(build) {

	var cost;
	var level = planetData.groundBuilding[build] + 1;

	switch(build) {
			case 0: //Quarry
				cost = {
					aluminium: 0,
					iron: Math.round(8*Math.pow(level,2) - 20*level + 17),
					copper: 0,
					titanium: Math.round(Math.pow(0.75*level,2) + 6.5*level - 2),
					time: 0.03*Math.pow(level,2) + 0.05*level -0.2,
					energy: Math.round(Math.pow(725*level,2) + 100000*level + 500000),
					energy_difference: (Math.round(Math.pow(725*level,2) + 100000*level + 500000)-Math.round(Math.pow(725*(level-1),2) + 100000*(level-1) + 500000))
				}
			break;
			case 1: //Metallurgie
				cost = {
					aluminium: 0,
					iron: Math.round(Math.pow(2*level,2) - 2*level), //Structure
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
					iron: Math.round(Math.pow(0.5*level,2) + 2*level),
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
			case 6: //Tank
				cost = {
					aluminium: Math.round(0.6*Math.pow(level,2) + 8*level - 6),
					iron: Math.round(Math.pow(2.2*level,2) + level - 10),
					copper: 0,
					titanium: Math.round(2*Math.pow(level,2) + 7*level - 6.5),
					time: 0.025*Math.pow(level,2) + 0.1*level - 0.2,
					energy: Math.round(Math.pow(15*level,2)+200*level + 1200), //Energy is just for lights :D
					energy_difference: Math.round(Math.pow(15*level,2)+200*level + 1200)-Math.round(Math.pow(15*(level-1),2)+200*(level-1) + 1200),
				}
			break;
			case 7: //Shipyard
				cost = {
					aluminium: Math.round(Math.pow(0.6*level,2) + 3*level),
					iron: Math.round(6*Math.pow(level,2) - 20*level + 24),
					copper: Math.round(0.85*Math.pow(level,2) + 3*level + 3),
					titanium: Math.round(0.5*Math.pow(level,2) + 6.5*level - 2),
					time: Math.pow(0.04*level,2) + 0.08*level - 0.1,
					energy: Math.round(Math.pow(300*level,2)-1300*level + 800),
					energy_difference: Math.round(Math.pow(300*level,2)-1300*level + 800)-Math.round(Math.pow(300*(level-1),2)-1300*(level-1) + 800),
				}
			break;
			case 8: //Research Center
				cost = {
					aluminium: Math.round(0.25*Math.pow(level,2) + 8*level),
					iron: Math.round(1.25*Math.pow(level,2) - level),
					copper: Math.round(0.25*Math.pow(level,2) + 4*level),
					titanium: Math.round(Math.pow(0.8*level,2) + 6.5*level - 2),
					time: 0.02*Math.pow(level,2) + 0.03*level - 0.1,
					energy: Math.round(Math.pow(550*level,2)-2500*level + 700),
					energy_difference: Math.round(Math.pow(550*level,2)-2500*level + 700)-Math.round(Math.pow(550*(level-1),2)-2500*(level-1) + 700),
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
}