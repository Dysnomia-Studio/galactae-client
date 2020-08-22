<script type="text/javascript">
var translate = translate || {};

translate['alliance'] = {
	'pacts-no': "<?= ALLY_PACT_NO ?>",
	'pacts-current': "<?= ALLY_PACT_CURRENT ?>",

	'pacts-askToJoin-no': "<?= ALLY_PACT_ASKTOJOIN_NO ?>",
	'pacts-askToJoin-current': "<?= ALLY_PACT_ASKTOJOIN_CURRENT ?>",

	'pacts-invitations-no': "<?= ALLY_PACT_INVITATIONS_NO ?>",
	'pacts-invitations-current': "<?= ALLY_PACT_INVITATIONS_CURRENT ?>",

	'ennemies-no': "<?= ALLY_ENNEMIES_NO ?>",
	'ennemies-current': "<?= ALLY_ENNEMIES_CURRENT ?>",

	'ennemies-askToJoin-no': "<?= ALLY_ENNEMIES_ASKTOJOIN_NO ?>",
	'ennemies-askToJoin-current': "<?= ALLY_ENNEMIES_ASKTOJOIN_CURRENT ?>",

	'ennemies-invitations-no': "<?= ALLY_ENNEMIES_INVITATIONS_NO ?>",
	'ennemies-invitations-current': "<?= ALLY_ENNEMIES_INVITATIONS_CURRENT ?>",

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
	'stop-pacts-confirm': "<?= ALLY_STOPPACT_CONFIRM ?>",
	'stop-ennemies-confirm': "<?= ALLY_STOPENNEMIES_CONFIRM ?>",
	'abandon-founder-confirm': (playerName) => "<?= ALLY_ABANDON_FOUNDER_CONFIRM ?>".replace('%playerName%', playerName),
	'kick-confirm': (playerName) => "<?= ALLY_KICK_CONFIRM ?>".replace('%playerName%', playerName),
};

translate['load'] = {
	'fleet': "<?= LOAD_FLEET ?>",
	'pictures': "<?= LOAD_PICTURES ?>",
	'load': "<?= LOAD_LOAD ?>",
	'maps': "<?= LOAD_MAPS ?>",
	'planet': "<?= LOAD_PLANET ?>",
	'player': "<?= LOAD_PLAYER ?>",
	'server': "<?= LOAD_SERVER ?>",
	'service-worker': "<?= LOAD_SERVICE_WORKER ?>",
	'settings': "<?= LOAD_SETTINGS ?>",
	'tactics': "<?= LOAD_TACTICS ?>",
	'trading': "<?= LOAD_TRADING ?>",
	'units': "<?= LOAD_UNITS ?>",
};

translate['messages'] = {
	// Building
	'BUILD_OK': "<?= BUILD_OK ?>",
	'BUILD_ERROR': "<?= BUILD_ERROR ?>",
	'BUILDING_ERROR_ALREADY': "<?= BUILDING_ERROR_ALREADY ?>",
	'UNIT_ERROR_ALREADY': "<?= UNIT_ERROR_ALREADY ?>",
	'BUILDING_ERROR_MAXIMUM': "<?= BUILDING_ERROR_MAXIMUM ?>",
	'BUILDING_ERROR_COST': "<?= BUILDING_ERROR_COST ?>",
	'BUILDING_ERROR_STORAGE': "<?= BUILDING_ERROR_STORAGE ?>",
	'BUILDING_ERROR_ENERGY': "<?= BUILDING_ERROR_ENERGY ?>",
	'BUILDING_ERROR_PEOPLE': "<?= BUILDING_ERROR_PEOPLE ?>",
	'BUILDING_ERROR_DEPENDENCIES': "<?= BUILDING_ERROR_DEPENDENCIES ?>",
	'UPGRADE': "<?= UPGRADE ?>",
	'BUILD': "<?= BUILD ?>",
	'LEVEL': "<?= LEVEL ?>",
	'UPGRADE_MAX': "<?= UPGRADE_MAX ?>",
	'ENOUGH_RESOURCES_TODAY_AT': "<?= ENOUGH_RESOURCES_TODAY_AT ?>",
	'ENOUGH_RESOURCES_TOMORROW_AT': "<?= ENOUGH_RESOURCES_TOMORROW_AT ?>",
	'ENOUGH_RESOURCES_THE': "<?= ENOUGH_RESOURCES_THE ?>",
	'ENOUGH_RESOURCES_AT': "<?= ENOUGH_RESOURCES_AT ?>",
	'ANOTHER_IN_BUILD': "<?= ANOTHER_IN_BUILD ?>",
	// Build finish at ...
	'BUILD_FINISH_TODAY_AT': "<?= BUILD_FINISH_TODAY_AT ?>",
	'BUILD_FINISH_TOMORROW_AT': "<?= BUILD_FINISH_TOMORROW_AT ?>",
	'BUILD_FINISH_THE': "<?= BUILD_FINISH_THE ?>",
	'BUILD_FINISH_AT': "<?= BUILD_FINISH_AT ?>",
	// [Number] units '[Name]' are being build in fleet '[FleetName]'
	'UNIT_CURR_BUILD_01': "<?= UNIT_CURR_BUILD_01 ?>",
	'UNIT_CURR_BUILD_02': "<?= UNIT_CURR_BUILD_02 ?>",
	// Unit Notifs
	'ENDED_UNIT_TITLE': "<?= ENDED_UNIT_TITLE ?>",
	'ENDED_UNIT_01': "<?= ENDED_UNIT_01 ?>",
	'ENDED_UNIT_02': "<?= ENDED_UNIT_02 ?>",
	'ENDED_UNIT_03': "<?= ENDED_UNIT_03 ?>",
	// Building Notifs
	'ENDED_BUILDING_TITLE': "<?= ENDED_BUILDING_TITLE ?>",
	'ENDED_BUILDING_01': "<?= ENDED_BUILDING_01 ?>",
	'ENDED_BUILDING_02': "<?= ENDED_BUILDING_02 ?>",
	// Not Belonging
	'ERROR_NOT_BELONGING': "<?= ERROR_NOT_BELONGING ?>",
	// Server messages
	'CONNECT_LOSS': "<?= CONNECT_LOSS ?>",
	'KICK': "<?= KICK ?>",
	'BAN': "<?= BAN ?>",
	'MAINTENANCE': "<?= MAINTENANCE ?>",
	'RESTARTING_SERVER': "<?= RESTARTING_SERVER ?>",
	'DOUBLE_ACCOUNTS_CONNECTED': "<?= DOUBLE_ACCOUNTS_CONNECTED ?>",
	'ERR_BANNED': "<?= ERR_BANNED ?>",
	'ERR_WHITELIST': "<?= ERR_WHITELIST ?>",
	'SYSTEM_MESSAGE': "<?= SYSTEM_MESSAGE ?>",
	// Chat Mute
	'CHAT_MUTED': "<?= CHAT_MUTED ?>",
	'CHAT_UNMUTED': "<?= CHAT_UNMUTED ?>",
	'CHAT_MUTED_REASON': "<?= CHAT_MUTED_REASON ?>",
	// Research
	'MISSING_PARENTS': "<?= MISSING_PARENTS ?>",
	'ENDED_RESEARCH': "<?= ENDED_RESEARCH ?>",
	'NEEDED_RESEARCH_MISSING': "<?= NEEDED_RESEARCH_MISSING ?>",
	'PLANETS': "<?= PLANETS ?>",
	// Fleets & Units
	'BUILDING_UNIT_OK': "<?= BUILDING_UNIT_OK ?>",
	'SHIP_HAS_INVALID_PARTS': "<?= SHIP_HAS_INVALID_PARTS ?>",
	'SHIP_HAS_WRONG_TYPE_OR_SHAPE': "<?= SHIP_HAS_WRONG_TYPE_OR_SHAPE ?>",
	'SHIP_HAS_EMPTY_FIELD': "<?= SHIP_HAS_EMPTY_FIELD ?>",
	'SHIP_HAS_NO_NAME': "<?= SHIP_HAS_NO_NAME ?>",
	'SHIP_NAME_ALREADY_EXISTS': "<?= SHIP_NAME_ALREADY_EXISTS ?>",
	'SHIP_TYPE_ALREADY_EXISTS': "<?= SHIP_TYPE_ALREADY_EXISTS ?>",
	'MODEL_DELETE_USED_BY_UNITS': "<?= MODEL_DELETE_USED_BY_UNITS ?>",
	'MODEL_DELETED': "<?= MODEL_DELETED ?>",
	'FLEET_MAX_REACHED': "<?= FLEET_MAX_REACHED ?>",
	'FLEET_NAME_ALREADY_EXISTS': "<?= FLEET_NAME_ALREADY_EXISTS ?>",
	'BUILDING_ERROR_INVALID_FLEET': "<?= BUILDING_ERROR_INVALID_FLEET ?>",
	'BUILDING_ERROR_FLEET_SIZE': "<?= BUILDING_ERROR_FLEET_SIZE ?>",
	// Errors message
	'PLY_NOT_FOUND': "<?= PLY_NOT_FOUND ?>",
	'NO_PM_YOU': "<?= NO_PM_YOU ?>",
	'NO_LINKS': "<?= NO_LINKS ?>",
	'DISABLED_FUNCTIONALIY': "<?= DISABLED_FUNCTIONALIY ?>",
	// Anti Self XSS Warning
	'selfXSSWarn': "<?= SELF_XSS_WARN ?>",
	// Move Panel
	'movePanelPt1': [
		"<?= MOVE_PANEL_PT1_DEF ?>",
		"<?= MOVE_PANEL_PT1_ATK ?>",
		"<?= MOVE_PANEL_PT1_MOVE ?>",
		"<?= MOVE_PANEL_PT1_SPY ?>",
	],
	'movePanelBtn': [
		"<?= MOVE_PANEL_BTN_DEF ?>",
		"<?= MOVE_PANEL_BTN_ATK ?>",
		"<?= MOVE_PANEL_BTN_MOVE ?>",
		"<?= MOVE_PANEL_BTN_SPY ?>",
	],
	'IN_BUILDING_FLEET': "<?= IN_BUILDING_FLEET ?>",
	'ALREADY_MOVING_FLEET': "<?= ALREADY_MOVING_FLEET ?>",
	'NO_ENOUGHT_CARRIER': "<?= NO_ENOUGHT_CARRIER ?>",
	'CANT_MAKE_SUPRAMOVE': "<?= CANT_MAKE_SUPRAMOVE ?>",
	'DESTINATION_NOT_EXISTS': "<?= DESTINATION_NOT_EXISTS ?>",
	'NO_ENOUGH_FUEL': "<?= NO_ENOUGH_FUEL ?>",
	'FLEET_MOVING': "<?= FLEET_MOVING ?>",
	'ENDED_MOVE': "<?= ENDED_MOVE ?>",
	'ENDED_MOVE_01': "<?= ENDED_MOVE_01 ?>",

	// Merge fleets/move units
	'FLEET_AT_DIFFERENT_POSITIONS': "<?= FLEET_AT_DIFFERENT_POSITIONS ?>",
	'FLEET_UNIT_TRANSFER_SUCCESSFUL': "<?= FLEET_UNIT_TRANSFER_SUCCESSFUL ?>",
	'FLEET_MERGE_SUCCESSFUL': "<?= FLEET_MERGE_SUCCESSFUL ?>",

	// Reports
	'NEW_REPORT_AVAILABLE': "<?= NEW_REPORT_AVAILABLE ?>",
	'REPORT_ATTACK': "<?= REPORT_ATTACK ?>",
	'NO_REPORTS_AVAILABLE': "<?= NO_REPORTS_AVAILABLE ?>",
	'REPORT_DEF_WINS': "<?= REPORT_DEF_WINS ?>",
	'REPORT_ATK_WINS': "<?= REPORT_ATK_WINS ?>",
	'REPORT_NO_FLEET': "<?= REPORT_NO_FLEET ?>",
	'REPORT_DELETE_ONE': "<?= REPORT_DELETE_ONE ?>",
	'REPORT_DELETE_MULTIPLE': "<?= REPORT_DELETE_MULTIPLE ?>",

	// Attack notif
	'ATTACK_INCOMING_TITLE': "<?= ATTACK_INCOMING_TITLE ?>",
	'ATTACK_INCOMING_FROM': "<?= ATTACK_INCOMING_FROM ?>",
	'ATTACK_INCOMING_TO': "<?= ATTACK_INCOMING_TO ?>",
	'ATTACK_INCOMING_TIME': "<?= ATTACK_INCOMING_TIME ?>",

	// Alliances notif
	'ALLIANCE_CREATE_ERROR': "<?= ALLIANCE_CREATE_ERROR ?>",
	'ALLIANCE_DOES_NOT_EXISTS': "<?= ALLIANCE_DOES_NOT_EXISTS ?>",
	'ALLIANCE_YOU_ALREADY_HAVE': "<?= ALLIANCE_YOU_ALREADY_HAVE ?>",
	'ALLIANCE_NOT_ENOUGH_RIGHTS': "<?= ALLIANCE_NOT_ENOUGH_RIGHTS ?>",
	'ALLIANCE_INVALID_PLAYER_PERMISSIONS': "<?= ALLIANCE_INVALID_PLAYER_PERMISSIONS ?>",
	'ALLIANCE_ERR_SAME_ALLY': "<?= ALLIANCE_ERR_SAME_ALLY ?>",
	'ALLIANCE_PLY_ASKED_TO_JOIN': "<?= ALLIANCE_PLY_ASKED_TO_JOIN ?>",
	'ALLIANCE_ASKED_TO_PACT': "<?= ALLIANCE_ASKED_TO_PACT ?>",
	'ALLIANCE_NEW_PACT': "<?= ALLIANCE_NEW_PACT ?>",
	'ALLIANCE_REFUSED_PACT': "<?= ALLIANCE_REFUSED_PACT ?>",
	'ALLIANCE_STOPPED_PACT': "<?= ALLIANCE_STOPPED_PACT ?>",
	'ALLIANCE_GRANTED': (ally) => "<?= ALLIANCE_GRANTED ?>".replace('%ally%', ally),
	'ALLIANCE_REFUSED': (ally) => "<?= ALLIANCE_REFUSED ?>".replace('%ally%', ally),
	'ALLIANCE_INVITED': (ally) => "<?= ALLIANCE_INVITED ?>".replace('%ally%', ally),
	'ALLIANCE_KICKED': "<?= ALLIANCE_KICKED ?>",
	'ALLIANCE_NEWPERMS': "<?= ALLIANCE_NEWPERMS ?>",
	'ALLIANCE_NEW_PLAYER': (plyName) => "<?= ALLIANCE_INVITED ?>".replace('%playerName%', plyName),
	'ALLIANCE_INVITE_REFUSED': (plyName) => "<?= ALLIANCE_INVITE_REFUSED ?>".replace('%playerName%', plyName),
	'ALLIANCE_MEMBER_KICKED': (plyName, staffName) => "<?= ALLIANCE_MEMBER_LEFT ?>".replace('%playerName%', plyName).replace('%staffName%', staffName),
	'ALLIANCE_MEMBER_LEFT': (plyName) => "<?= ALLIANCE_MEMBER_LEFT ?>".replace('%playerName%', plyName),
	'ALLIANCE_EDITED': (plyName) => "<?= ALLIANCE_EDITED ?>".replace('%playerName%', plyName),
	'ALLIANCE_DISSOLVED': "<?= ALLIANCE_DISSOLVED ?>",

	// Conquest
	'BEING_CONQUESTED_BUILD': "<?= BEING_CONQUESTED_BUILD ?>", // @TODO: Conquest type
	'BEING_CONQUESTED_BY': "<?= BEING_CONQUESTED_BY ?>", // @TODO: Conquest type
	'YOU_ARE_CONQUERING': "<?= YOU_ARE_CONQUERING ?>",
	'BEING_CONQUESTED_END': "<?= BEING_CONQUESTED_END ?>",
};


translate['map'] = {
	PLANET_INFO_NOREPORTS: "<?= PLANET_INFO_NOREPORTS ?>",
};

translate['tactic'] = {
	'orderNew': "<?= TACTIC_NEW_ORDER ?>",
};

translate['ui'] = {
	// Day bonus
	'credits': "<?= UI_CREDITS ?>",
	'ofHe3': "<?= UI_OFHE3 ?>",

	// Confirm box
	'CONFIRM_YES': "<?= UI_CONFIRM_YES ?>",
	'CONFIRM_NO': "<?= UI_CONFIRM_NO ?>",

	'no-ally': "<?= UI_NO_ALLY ?>",
	'no-player': "<?= UI_NO_PLAYER ?>",
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