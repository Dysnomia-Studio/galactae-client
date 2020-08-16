<script type="text/javascript">
var translate = translate || {};

translate['alliance'] = {
	'pact-no': "<?= ALLY_PACT_NO ?>",
	'pact-current': "<?= ALLY_PACT_CURRENT ?>",

	'pact-askToJoin-no': "<?= ALLY_PACT_ASKTOJOIN_NO ?>",
	'pact-askToJoin-current': "<?= ALLY_PACT_ASKTOJOIN_CURRENT ?>",

	'pact-invitations-no': "<?= ALLY_PACT_INVITATIONS_NO ?>",
	'pact-invitations-current': "<?= ALLY_PACT_INVITATIONS_CURRENT ?>",

	'members-askToJoin-no': "<?= ALLY_MEMBERS_ASKTOJOIN_NO ?>",
	'members-askToJoin-current': "<?= ALLY_MEMBERS_ASKTOJOIN_CURRENT ?>",

	'members-invitations-no': "<?= ALLY_MEMBERS_INVITATIONS_NO ?>",
	'members-invitations-current': "<?= ALLY_MEMBERS_INVITATIONS_CURRENT ?>",

	'noAlly-askToJoin-no': "<?= ALLY_NOALLY_ASKTOJOIN_NO ?>",
	'noAlly-askToJoin-current': "<?= ALLY_NOALLY_ASKTOJOIN_CURRENT ?>",

	'noAlly-invitations-no': "<?= ALLY_NOALLY_INVITATIONS_NO ?>",
	'noAlly-invitations-current': "<?= ALLY_NOALLY_INVITATIONS_CURRENT ?>",

	'askToJoin': "<?= ALLY_ASKTOJOIN ?>",
	'results-no': "<?= ALLY_RESULTS ?>",
	'results': "<?= ALLY_RESULTS_NO ?>",

	'quit-confirm': "<?= ALLY_QUIT_CONFIRM ?>",
	'dissolve-confirm': "<?= ALLY_DISSOLVE_CONFIRM ?>",
	'stopPact-confirm': "<?= ALLY_STOPPACT_CONFIRM ?>",
	'abandon-founder-confirm': (playerName) => "<?= ALLY_ABANDON_FOUNDER_CONFIRM ?>".replace('%playerName%', playerName),
	'kick-confirm': (playerName) => "<?= ALLY_KICK_CONFIRM ?>".replace('%playerName%', playerName),
};

translate['map'] = {
	PLANET_INFO_NOREPORTS: "<?= PLANET_INFO_NOREPORTS ?>",
};

const fleetTranslate = {
	// Titles
	'SHIP_TYPE': "<?= FLEET_BUILD_TYPE ?>",
	'SHIP_SHAPE': "<?= FLEET_BUILD_SHAPE ?>",

	// Types & Shapes
	'SHIP_DEF': "<?= FLEET_TYPE_DEFENSE ?>",
	'SHIP_SAT_AG1': "<?= FLEET_TYPE_DEFENSE_SAT_AG1 ?>",
	'SHIP_SAT_AG2': "<?= FLEET_TYPE_DEFENSE_SAT_AG2 ?>",
	'SHIP_SAT_AG3': "<?= FLEET_TYPE_DEFENSE_SAT_AG3 ?>",

	'SHIP_WEP_MINES': "<?= FLEET_TYPE_DEFENSE_WEP_MINES ?>",
	'SHIP_WEP_MINES_IEM': "<?= FLEET_TYPE_DEFENSE_WEP_MINES_IEM ?>",
	'SHIP_WEP_MINES_NUKE': "<?= FLEET_TYPE_DEFENSE_WEP_MINES_NUKE ?>",

	'SHIP_BATTLECRUISER': "<?= FLEET_TYPE_BATTLECRUISER ?>",
	'SHIP_BATTLECRUISER_ATRIOS': "<?= FLEET_TYPE_BATTLECRUISER_ATRIOS ?>",

	'SHIP_CUIRASSE': "<?= FLEET_TYPE_CUIRASSE ?>",
	'SHIP_CUIRASSE_SMALL': "<?= FLEET_TYPE_CUIRASSE_SMALL ?>",

	'SHIP_COLONY': "<?= FLEET_TYPE_COLONY ?>",

	'SHIP_FIGHTER': "<?= FLEET_TYPE_FIGHTER ?>",
	'SHIP_FIGHTER_SMALL': "<?= FLEET_TYPE_FIGHTER_SMALL ?>",
	'SHIP_FIGHTER_MEDIUM': "<?= FLEET_TYPE_FIGHTER_MEDIUM ?>",
	'SHIP_FIGHTER_HUGE': "<?= FLEET_TYPE_FIGHTER_HUGE ?>",

	'SHIP_CORVET': "<?= FLEET_TYPE_CORVET ?>",
	'SHIP_CORVET_AEGIS': "<?= FLEET_TYPE_CORVET_AEGIS ?>",

	'SHIP_CARRIER': "<?= FLEET_TYPE_CARRIER ?>",
	'SHIP_CARRIER_MEDIUM': "<?= FLEET_TYPE_CARRIER_MEDIUM ?>",

	// Armes
	'railgun': "<?= SHIP_PART_WEAPON_RAILGUN ?>",
	'railgun_desc': "<?= SHIP_PART_WEAPON_RAILGUN_DESC ?>",
	'laser': "<?= SHIP_PART_WEAPON_LASER ?>",
	'laser_desc': "<?= SHIP_PART_WEAPON_LASER_DESC ?>",
	'plasma': "<?= SHIP_PART_WEAPON_PLASMA ?>",
	'plasma_desc': "<?= SHIP_PART_WEAPON_PLASMA_DESC ?>",
	'explosive': "<?= SHIP_PART_WEAPON_EXPLOSIVE ?>",
	'explosive_desc': "<?= SHIP_PART_WEAPON_EXPLOSIVE_DESC ?>",
	'nuke': "<?= SHIP_PART_WEAPON_NUKE ?>",
	'nuke_desc': "<?= SHIP_PART_WEAPON_NUKE_DESC ?>",
	'iem': "<?= SHIP_PART_WEAPON_IEM ?>",
	'iem_desc': "<?= SHIP_PART_WEAPON_IEM_DESC ?>",
	'antimater': "<?= SHIP_PART_WEAPON_ANTIMATER ?>",

	// Defenses
	'magnetic': "<?= SHIP_PART_DEF_MAGNETIC ?>",
	'magnetic_desc': "<?= SHIP_PART_DEF_MAGNETIC_DESC ?>",
	'turret': "<?= SHIP_PART_DEF_TURRET ?>",
	'turret_desc': "<?= SHIP_PART_DEF_TURRET_DESC ?>",
	'projector': "<?= SHIP_PART_DEF_PROJECTOR ?>",
	'projector_desc': "<?= SHIP_PART_DEF_PROJECTOR_DESC ?>",
	'singularity': "<?= SHIP_PART_DEF_SINGULARITY ?>",
	'singularity_desc': "<?= SHIP_PART_DEF_SINGULARITY_DESC ?>",

	// Propulsion
	'engine_speed': "<?= SHIP_PART_PROP_ENGINE_SPEED ?>",
	'ion': "<?= SHIP_PART_PROP_ION ?>",
	'ion_desc': "<?= SHIP_PART_PROP_ION_DESC ?>",
	'pplasma': "<?= SHIP_PART_PROP_PPLASMA ?>",
	'pplasma_desc': "<?= SHIP_PART_PROP_PPLASMA_DESC ?>",
	'vsolaire': "<?= SHIP_PART_PROP_VSOLAIRE ?>",
	'vsolaire_desc': "<?= SHIP_PART_PROP_VSOLAIRE_DESC ?>",
	'vsl': "<?= SHIP_PART_PROP_VSL ?>",
	'vsl_desc': "<?= SHIP_PART_PROP_VSL_DESC ?>",
	'wd': "<?= SHIP_PART_PROP_WD ?>",
	'wd_desc': "<?= SHIP_PART_PROP_WD_DESC ?>",
	'hyperespace': "<?= SHIP_PART_PROP_HYPERESPACE ?>",
	'hyperespace_desc': "<?= SHIP_PART_PROP_HYPERESPACE_DESC ?>",

	// Other
	'hangar': "<?= SHIP_PART_OTHER_HANGAR ?>",
	'hangarCapacity': "<?= SHIP_PART_OTHER_HANGARCAPACITY ?>",
	'hangarSimple': "<?= SHIP_PART_OTHER_HANGARSIMPLE ?>",
	'hangarSimple_desc': "<?= SHIP_PART_OTHER_HANGARSIMPLE_DESC ?>",
	'hangarDouble': "<?= SHIP_PART_OTHER_HANGARDOUBLE ?>",
	'hangarDouble_desc': "<?= SHIP_PART_OTHER_HANGARDOUBLE_DESC ?>",
	'none': "<?= SHIP_PART_OTHER_NONE ?>",
	'none_desc': "<?= SHIP_PART_OTHER_NONE_DESC ?>",
	'noPartResearched': "<?= SHIP_PART_OTHER_NOPARTRESEARCHED ?>",
	'noPartResearched_desc': "<?= SHIP_PART_OTHER_NOPARTRESEARCHED_DESC ?>",

	// Types
	'cannon': "<?= SHIP_PART_TYPE_CANNON ?>",
	'rocketLauncher': "<?= SHIP_PART_TYPE_ROCKETLAUNCHER ?>",
	'shield': "<?= SHIP_PART_TYPE_SHIELD ?>",
	'sub_propulsion': "<?= SHIP_PART_TYPE_SUB_PROPULSION ?>",
	'sup_propulsion': "<?= SHIP_PART_TYPE_SUP_PROPULSION ?>",

	// Texts
	'fleet-build-openPanel': "<?= FLEET_BUILD_OPENPANEL ?>",
	'fleet-build-type-copy': "<?= FLEET_BUILD_TYPE_COPY ?>",
	'fleet-build-type-delete': "<?= FLEET_BUILD_TYPE_DELETE ?>",
	'fleet-build-type-delete-confirmMessage': "<?= FLEET_BUILD_TYPE_DELETE_CONFIRMMESSAGE ?>",

	'priority-fuel': "<?= UNITS_PRIORITY_FUEL ?>",
	'no-priority-fuel': "<?= UNITS_NO_PRIORITY_FUEL ?>",
	'of-maxFuel': "<?= UNITS_OF_MAXFUEL ?>",
	'orbiting': "<?= UNITS_ORBITING ?>",

	'transferUnits': "<?= UNITS_TRANSFERUNITS ?>",
	'recycle': "<?= UNITS_RECYCLE ?>",
	'upgrade': "<?= UNITS_UPGRADE ?>",
	'backToMotherPlanet': "<?= UNITS_BACKTOMOTHERPLANET ?>",

	'mergeInto': "<?= UNITS_MERGEINTO ?>",
	'transferFuel': "<?= UNITS_TRANSFERFUEL ?>",
	'assignTactic': "<?= UNITS_ASSIGNTACTIC ?>",

	'no-orbit-unit': "<?= UNITS_NO_ORBIT_UNIT ?>",
	'no-move-unit': "<?= UNITS_NO_MOVE_UNIT ?>",
	'no-out-unit': "<?= UNITS_NO_OUT_UNIT ?>",

	'movingTo': "<?= UNITS_MOVINGTO ?>",
	'attacking': "<?= UNITS_ATTACKING ?>",
	'movingToDef': "<?= UNITS_MOVINGTODEF ?>",
	'arriveAt': "<?= UNITS_ARRIVEAT ?>",

	'unit': "<?= UNITS_UNIT ?>",

	'tactic': "<?= UNITS_TACTIC ?>",
	'defaultTactic': "<?= UNITS_DEFAULTTACTIC ?>",
};
</script>