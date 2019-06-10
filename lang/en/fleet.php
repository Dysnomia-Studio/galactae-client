<?php
	//== Menus ==\\
	define('FLEET_BUILD','Build');
	define('FLEET_ORBIT','Orbit');
	define('FLEET_MOVE','Moves');
	define('FLEET_OUT','Out');
	define('FLEET_TACTICS','Tactics');
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
	define('FLEET_NEWNAME','New fleet name for');
	define('FLEET_TRANSFER_TYPE','Transfer units of type');
	define('FLEET_TRANSFERALL_TYPE','Transfer all units of type');
	define('FLEET_TRANSFERFUEL_FROM','Tranfer fuel from');
	define('FLEET_TRANSFER_TO','to');
	define('NEW_FLEET','New Fleet ...');

	//== Tactics ==\\
	define('FLEET_UNIT_TYPE', 'Unit type');
	define('FLEET_UNIT_TARGET', 'Priority target');
	define('FLEET_PRIORITY', 'Priority level');
	define('FLEET_TACTIC_NAME', 'Tactic name');
	define('FLEET_TACTIC_ADD_ORDER', 'Add order');
	define('FLEET_TACTIC_DELETE_ORDER', 'Delete this order');
	define('FLEET_TACTIC_SAVE_ORDER', 'Save this order');
	define('FLEET_TACTIC_SAVE', 'Save tactic');

	define('TACTIC', 'Tactic');
	define('DEFAULT_TACTIC', 'Default tactic');
	define('FLEET_ASSIGN_TACTIC', 'Tactic to assign to');

	//== Erreurs ==\\
	define('FLEET_NO_MODEL','You have\'nt models yet');
?>
<script type="text/javascript">
const fleetTranslate = {
	// Titles
	'SHIP_TYPE': 'Type',
	'SHIP_SHAPE': 'Model',

	// Types & Shapes
	'SHIP_DEF': 'Defence',
	'SHIP_SAT_AG1': 'AG-I Satellite',
	'SHIP_SAT_AG2': 'AG-II Satellite',
	'SHIP_SAT_AG3': 'AG-III Satellite',

	'SHIP_WEP_MINES': 'Space mines',
	'SHIP_WEP_MINES_IEM': 'Electromagnetic mines',
	'SHIP_WEP_MINES_NUKE': 'Nuclear mines',

	'SHIP_BATTLECRUISER': 'Battlecruiser',
	'SHIP_BATTLECRUISER_SMALL': 'Small',

	'SHIP_CUIRASSE': 'Battleship',
	'SHIP_CUIRASSE_SMALL': 'Small',

	'SHIP_FIGHTER': 'Fighter',
	'SHIP_FIGHTER_SMALL': 'Light Interceptor',
	'SHIP_FIGHTER_MEDIUM': 'Heavy Interceptor',
	'SHIP_FIGHTER_HUGE': 'Bomber',

	'SHIP_CORVET': 'Corvet',
	'SHIP_CORVET_SMALL': 'Small',

	'SHIP_CARRIER': 'Carrier',
	'SHIP_CARRIER_MEDIUM': 'Medium',

	// Armes
	'railgun': 'Railgun',
	'railgun_desc': 'Electromagnetic speeded-up projectile',
	'laser': 'Laser Cannon',
	'laser_desc': 'Laser powered weapons',
	'plasma': 'Plasma Cannon',
	'plasma_desc': 'Highly heated projectile weapons',
	'explosive': 'Conventional Missile',
	'explosive_desc': 'Mid-range conventionnal explosive missile',
	'nuke': 'Nuclear Missile',
	'nuke_desc': 'Massive and radioactive destruction weapon',
	'iem': 'Electromagnetic Missile',
	'iem_desc': 'Missile creating electromagnetic impulsion on explosion',
	'antimater': 'Antimater Missile',

	// Defenses
	'magnetic': 'Magnetic shield',
	'magnetic_desc': 'Shield using electromagnetic force to repulse projectiles',
	'turret': 'Counter-Missile turrets',
	'turret_desc': 'Turret used to intercept explosive projectiles',
	'projector': 'Magnetic shield projector',
	'projector_desc': 'Magnetic shield projected on allied ship',
	'singularity': 'Singularity system',
	'singularity_desc': 'System that bring light projectiles targetting allied ships to current ship',

	// Propulsion
	'engine_speed': 'Max. speed',
	'ion': 'Ion engine',
	get ion_desc() { return `${this['engine_speed']}: %speed% au/s`; },
	'pplasma': 'Plasma engines',
	get pplasma_desc() { return `${this['engine_speed']}: %speed% au/s`; },
	'vsolaire': 'Solar sail',
	get vsolaire_desc() { return `${this['engine_speed']}: %speed% au/s`; },
	'vsl': 'Faster Than Light engine',
	get vsl_desc() { return `${this['engine_speed']}: %speed% pc/s`; },
	'wd': 'Warp Drive',
	get wd_desc() { return `${this['engine_speed']}: %speed% pc/s`; },
	'hyperespace': 'Hyperspace engine',
	get hyperespace_desc() { return `${this['engine_speed']}: %speed% pc/s`; },

	// Other
	'hangar': 'Hangar',
	'hangarCapacity': 'Capacity',
	'hangarSimple': 'Simple Hangar',
	get hangarSimple_desc() { return `${this['hangarCapacity']} : %hangarCapacity%`; },
	'hangarDouble': 'Double Hangar',
	get hangarDouble_desc() { return `${this['hangarCapacity']} : %hangarCapacity%`; },
	'none': 'No part',
	'none_desc': '&nbsp;',
	'noPartResearched': 'No part researched',
	'noPartResearched_desc': 'No part researched',

	// Texts
	'fleet-build-openPanel': 'Build this unit',
	'fleet-build-type-copy': 'Duplicate this model',
	'fleet-build-type-delete': 'Delete model',
	'fleet-build-type-delete-confirmMessage': 'Do you want to delete this model ?',

	'priorty-fuel': 'Refuel priority',
	'no-priorty-fuel': 'No Refuel priority',
	'of-maxFuel': 'of reservoir',
	'orbiting': 'Orbiting',

	'transferUnits': 'Transfer units',
	'recycle': 'Recycle units',
	'upgrade': 'Upgrade units',

	'mergeInto': 'Merge into ...',
	'transferFuel': 'Transfer fuel to ...',
	'assignTactic': 'Assign tactic',

	'no-orbit-unit': 'No unit is in orbit of this planet',
	'no-move-unit': 'No fleet is moving',
	'no-out-unit': 'No unit in orbit of another planet',

	'movingTo': 'Moving to',
	'attacking': 'Attacking',
	'movingToDef': 'Moving to defend',
	'arriveAt': ', arriving:',

	'unit': 'unit(s)',

	'tactic': 'Tactic',
	'defaultTactic': 'Default',
};
</script>