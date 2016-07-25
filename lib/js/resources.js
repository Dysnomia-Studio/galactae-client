function GetMineralsRatio(type) {
	switch(eval(type)) {
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

function ClientsideResourcesUpdate() {

	//Minerals
	planetContent.resources[0] += ((planetContent.groundBuilding[0]*300)+100)/1800; //Production Algorithm
	//Petrol
	planetContent.resources[1] += ((planetContent.groundBuilding[1]*300)+100)/1800; //Production Algorithm
	//Gaz
	planetContent.resources[2] += ((planetContent.groundBuilding[2]*300)+100)/1800; //Production Algorithm

	if(planetContent.resources[0]-(((planetContent.groundBuilding[3]*200)+100)/360)>0) { //Verify if you can use basic ressources
		planetContent.resources[3] += (((planetContent.groundBuilding[3]*200)+100)/1800)*ironRatio; //Iron
		planetContent.resources[4] += (((planetContent.groundBuilding[3]*200)+100)/1800)*aluRatio; //Aluminium
		planetContent.resources[5] += (((planetContent.groundBuilding[3]*200)+100)/1800)*copperRatio; //Copper
		planetContent.resources[6] += (((planetContent.groundBuilding[3]*200)+100)/1800)*titanRatio; //Titanium

		planetContent.resources[0] -= (((planetContent.groundBuilding[3]*200)+100)/1800); //Consomation Algorithm
	}

	refreshPlanetInfos(true,false);
}