<?php
	//== Menus ==\\
	define('FLEET_BUILD','Build');
	define('FLEET_ORBIT','Orbit');
	define('FLEET_MOVE','Moves');
	define('FLEET_OUT','Out');
	define('FLEET_BUILD_ALL','All types');
	define('FLEET_BUILD_DEF','Orbital Defenses');
	define('FLEET_BUILD_CUISADER','Cruisaders');
	define('FLEET_BUILD_CUIRASSE','Battleships');
	define('FLEET_BUILD_FIGHTER','Fighters');
	define('FLEET_BUILD_CORVET','Corvette');
	define('FLEET_BUILD_CARRIER','Carriers');

	//== Details ==\\
	define('FLEET_BUILD_NAME','Name');
	define('FLEET_BUILD_TYPE','Type');
	define('FLEET_BUILD_SHAPE','Model');
	define('FLEET_BUILD_NOTE','Notation');
	define('FLEET_BUILD_COUNT','Count');
	define('FLEET_BUILD_CREATE','New blueprint');
	define('FLEET_TOTAL_COST','Total Cost');
	define('FLEET_CREATE','Create');
	define('SHIP_NAME','Name');
	define('SHIP_WEAPONS','Weapons');
	define('SHIP_SHIELD','Defences');
	define('SHIP_ROLE','Role');
	define('SHIP_SPEEDS','Engine(s)');
	define('SHIP_SUBSPEED','Interplanetary');
	define('SHIP_SUPSPEED','Interstellar');
	define('SHIP_MISS_CHANCE','Miss Chance');
	define('SHIP_FCAP','Fighters Capacity');

	//== Fleet ==\\
	define('FLEET','Fleet');
	define('FLEET_NAME','Fleet name');
	define('NEW_FLEET','New Fleet ...');

	//== Erreurs ==\\
	define('FLEET_NO_MODEL','You hav\'nt models yet');
?>
<script type="text/javascript">
	let fleetTranslate = {
		// Titles
		"SHIP_TYPE": "Type",
		"SHIP_SHAPE": "Model",

		// Types & Shapes
		"SHIP_DEF": "Defence",
		"SHIP_SAT_AG1": "AG-I Satellite",
		"SHIP_SAT_AG2": "AG-II Satellite",
		"SHIP_SAT_AG3": "AG-III Satellite",

		"SHIP_WEP_MINES": "Space mines",
		"SHIP_WEP_MINES_IEM": "Electromagnetic mines",
		"SHIP_WEP_MINES_NUKE": "Nuclear mines",

		"SHIP_BATTLECRUISER": "Battlecruiser",
		"SHIP_BATTLECRUISER_SMALL": "Small",

		"SHIP_CUIRASSE": "Battleship",
		"SHIP_CUIRASSE_SMALL": "Small",

		"SHIP_FIGHTER": "Fighter",
		"SHIP_FIGHTER_SMALL": "Light Interceptor",
		"SHIP_FIGHTER_MEDIUM": "Heavy Interceptor",
		"SHIP_FIGHTER_HUGE": "Bomber",

		"SHIP_CORVET": "Corvet",
		"SHIP_CORVET_SMALL": "Small",

		"SHIP_CARRIER": "Carrier",
		"SHIP_CARRIER_MEDIUM": "Medium",

		// Armes
		"railgun": "Railgun",
		"laser": "Laser Cannon",
		"plasma": "Plasma Cannon",
		"missile_explosive": "Conventional Missile",
		"missile_nuke": "Nuclear Missile",
		"missile_iem": "Electromagnetic Missile",
		"missile_antimater": "Antimater Missile",

		// Defenses
		"magnetic": "Magnetic shield",
		"turret": "Counter-Missile turrets",
		"projector": "Magnetic shield projector",
		"singularity": "Singularity system",

		// Other
		"hangar": "Hangar",

		// Texts
		"fleet-build-openPanel": "Build this unit",
		"fleet-build-type-copy": "Duplicate this model",
		"fleet-build-type-delete": "Delete model",

		"priorty-fuel": "Refuel priority",
		"no-priorty-fuel": "No Refuel priority",
		"orbiting": "Orbiting",

		"recycle": "Recycle units",
		"upgrade": "Upgrade units",

		"mergeInto": "Merge into ...",
		"transferFuel": "Transfer fuel to ...",
		"editTactic": "Fleet Tactics",

		"no-orbit-unit": "No unit is in orbit of this planet",
		"no-move-unit": "No fleet is moving",
		"no-out-unit": "No unit in orbit of another planet",

		"movingTo": "Moving to",
		"attacking": "Attacking",
		"movingToDef": "Moving to defend",
		"arriveAt": ", arriving:",

		"unit": "unit(s)",
	};
</script>