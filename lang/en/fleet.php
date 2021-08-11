<?php
	//== Menus ==\\
	define('FLEET_BUILD','Build');
	define('FLEET_ORBIT','Orbit');
	define('FLEET_MOVE','Moves');
	define('FLEET_OUT','Out');
	define('FLEET_TACTICS','Tactics');
	define('FLEET_BUILD_ALL','All types');

	//== Types ==\\
	define('FLEET_TYPE_DEFENSE', 'Orbital Defenses');
		define('FLEET_TYPE_DEFENSE_SAT_AG1', 'AG-I Satellite');
		define('FLEET_TYPE_DEFENSE_SAT_AG2', 'AG-II Satellite');
		define('FLEET_TYPE_DEFENSE_SAT_AG3', 'AG-III Satellite');

		define('FLEET_TYPE_DEFENSE_WEP_MINES', 'Space mines');
		define('FLEET_TYPE_DEFENSE_WEP_MINES_IEM', 'Electromagnetic mines');
		define('FLEET_TYPE_DEFENSE_WEP_MINES_NUKE', 'Nuclear mines');

	define('FLEET_TYPE_BATTLECRUISER','Battlecruisers');
		define('FLEET_TYPE_BATTLECRUISER_ATRIOS','Atrios Class');

	define('FLEET_TYPE_CUIRASSE','Battleships');
		define('FLEET_TYPE_CUIRASSE_SMALL','Small');

	define('FLEET_TYPE_FIGHTER','Fighters');
		define('FLEET_TYPE_FIGHTER_SMALL','Light Interceptor');
		define('FLEET_TYPE_FIGHTER_MEDIUM','Heavy Interceptor');
		define('FLEET_TYPE_FIGHTER_HUGE','Bomber');

	define('FLEET_TYPE_CORVET','Corvette');
		define('FLEET_TYPE_CORVET_AEGIS','Aegis Class');

	define('FLEET_TYPE_CARRIER','Carriers');
		define('FLEET_TYPE_CARRIER_MEDIUM','Medium');

	define('FLEET_TYPE_COLONY','Colony ships');

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
	define('SHIP_SHIELD','Defenses');
	define('SHIP_ROLE','Role');
	define('SHIP_SPEEDS','Engine(s)');
	define('SHIP_SUBSPEED','Interplanetary');
	define('SHIP_SUPSPEED','Interstellar');
	define('SHIP_MISS_CHANCE','Miss Chance');
	define('SHIP_FCAP','Fighters Capacity');
	define('SHIP_FWEIGHT', 'Used Fighter Capacity');

	//== Weapons ==\\
	define('SHIP_PART_WEAPON_RAILGUN', 'Railgun');
	define('SHIP_PART_WEAPON_RAILGUN_DESC', 'Electromagnetic speeded-up projectile');
	define('SHIP_PART_WEAPON_LASER', 'Laser Cannon');
	define('SHIP_PART_WEAPON_LASER_DESC', 'Laser powered weapons');
	define('SHIP_PART_WEAPON_PLASMA', 'Plasma Cannon');
	define('SHIP_PART_WEAPON_PLASMA_DESC', 'Highly heated projectile weapons');
	define('SHIP_PART_WEAPON_EXPLOSIVE', 'Conventional Missile');
	define('SHIP_PART_WEAPON_EXPLOSIVE_DESC', 'Mid-range conventionnal explosive missile');
	define('SHIP_PART_WEAPON_NUKE', 'Nuclear Missile');
	define('SHIP_PART_WEAPON_NUKE_DESC', 'Massive and radioactive destruction weapon');
	define('SHIP_PART_WEAPON_IEM', 'Electromagnetic Missile');
	define('SHIP_PART_WEAPON_IEM_DESC', 'Missile creating electromagnetic impulsion on explosion');
	define('SHIP_PART_WEAPON_ANTIMATER', 'Antimater Missile');

	//== Ship Defenses ==\\
	define('SHIP_PART_DEF_MAGNETIC', 'Magnetic shield');
	define('SHIP_PART_DEF_MAGNETIC_DESC', 'Shield using electromagnetic force to repulse projectiles');
	define('SHIP_PART_DEF_TURRET', 'Counter-Missile turrets');
	define('SHIP_PART_DEF_TURRET_DESC', 'Turret used to intercept explosive projectiles');
	define('SHIP_PART_DEF_PROJECTOR', 'Magnetic shield projector');
	define('SHIP_PART_DEF_PROJECTOR_DESC', 'Magnetic shield projected on allied ship');
	define('SHIP_PART_DEF_SINGULARITY', 'Singularity system');
	define('SHIP_PART_DEF_SINGULARITY_DESC', 'System that bring light projectiles targetting allied ships to current ship');

	//== Propulsion ==\\
	define('SHIP_PART_PROP_ENGINE_SPEED', 'Max. speed');
	define('SHIP_PART_PROP_ION', 'Ion engine');
	define('SHIP_PART_PROP_ION_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% au/s');
	define('SHIP_PART_PROP_PPLASMA', 'Plasma engines');
	define('SHIP_PART_PROP_PPLASMA_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% au/s');
	define('SHIP_PART_PROP_VSOLAIRE', 'Solar sail');
	define('SHIP_PART_PROP_VSOLAIRE_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% au/s');
	define('SHIP_PART_PROP_VSL', 'Faster Than Light engine');
	define('SHIP_PART_PROP_VSL_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% pc/s');
	define('SHIP_PART_PROP_WD', 'Warp Drive');
	define('SHIP_PART_PROP_WD_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% pc/s');
	define('SHIP_PART_PROP_HYPERESPACE', 'Hyperspace engine');
	define('SHIP_PART_PROP_HYPERESPACE_DESC', SHIP_PART_PROP_ENGINE_SPEED.': %speed% pc/s');

	//== Other ==\\
	define('SHIP_PART_OTHER_HANGAR', 'Hangar');
	define('SHIP_PART_OTHER_HANGARCAPACITY', 'Capacity');
	define('SHIP_PART_OTHER_HANGARSIMPLE', 'Simple Hangar');
	define('SHIP_PART_OTHER_HANGARSIMPLE_DESC', SHIP_PART_OTHER_HANGARCAPACITY.': %hangarCapacity%');
	define('SHIP_PART_OTHER_HANGARDOUBLE', 'Double Hangar');
	define('SHIP_PART_OTHER_HANGARDOUBLE_DESC', SHIP_PART_OTHER_HANGARCAPACITY.': %hangarCapacity%');
	define('SHIP_PART_OTHER_NONE', 'No part');
	define('SHIP_PART_OTHER_NONE_DESC', '&nbsp;');
	define('SHIP_PART_OTHER_NOPARTRESEARCHED', 'No part researched');
	define('SHIP_PART_OTHER_NOPARTRESEARCHED_DESC', 'No part researched');

	//== Types ==\\
	define('SHIP_PART_TYPE_CANNON', 'Cannons');
	define('SHIP_PART_TYPE_ROCKETLAUNCHER', 'Missile Launchers');
	define('SHIP_PART_TYPE_SHIELD', 'Defenses');
	define('SHIP_PART_TYPE_SUB_PROPULSION', 'Subluminic propulsion');
	define('SHIP_PART_TYPE_SUP_PROPULSION', 'Supraluminic propulsion');

	//== Texts ==\\
	define('FLEET_BUILD_OPENPANEL', 'Build this unit');
	define('FLEET_BUILD_TYPE_COPY', 'Duplicate this model');
	define('FLEET_BUILD_TYPE_DELETE', 'Delete model');
	define('FLEET_BUILD_TYPE_DELETE_CONFIRMMESSAGE', 'Do you want to delete this model ?');

	define('UNITS_PRIORITY_FUEL', 'Refuel priority');
	define('UNITS_NO_PRIORITY_FUEL', 'No Refuel priority');
	define('UNITS_OF_MAXFUEL', 'of reservoir');
	define('UNITS_ORBITING', 'Orbiting');

	define('UNITS_TRANSFERUNITS', 'Transfer units');
	define('UNITS_RECYCLE', 'Recycle units');
	define('UNITS_UPGRADE', 'Upgrade units');
	define('UNITS_BACKTOMOTHERPLANET', 'Call back');

	define('UNITS_MERGEINTO', 'Merge into ...');
	define('UNITS_TRANSFERFUEL', 'Transfer fuel to ...');
	define('UNITS_ASSIGNTACTIC', 'Assign tactic');

	define('UNITS_NO_ORBIT_UNIT', 'No unit is in orbit of this planet');
	define('UNITS_NO_MOVE_UNIT', 'No fleet is moving');
	define('UNITS_NO_OUT_UNIT', 'No unit in orbit of another planet');

	define('UNITS_MOVINGTO', 'Moving to');
	define('UNITS_ATTACKING', 'Attacking');
	define('UNITS_MOVINGTODEF', 'Moving to defend');
	define('UNITS_ARRIVEAT', ', arriving:');

	define('UNITS_MOVE_TIME', 'Time');
	define('UNITS_MOVE_HABITABLE', 'Habitable');

	define('UNITS_UNIT', 'unit(s)');

	define('UNITS_TACTIC', 'Tactic');
	define('UNITS_DEFAULTTACTIC', 'Default');

	//== Fleet ==\\
	define('FLEET','Fleet');
	define('FLEET_NAME','Fleet name');
	define('FLEET_NEWNAME','New name for');
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