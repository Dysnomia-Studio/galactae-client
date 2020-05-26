<?php
	define('DEFAULT_LOAD','Connecting to server ...');
?>
<script type="text/javascript">
var translate = translate || {};

translate['messages'] = {
	// Building
	'BUILD_OK': 'The Building is now upgrading !',
	'BUILD_ERROR': 'An error has occurred while attempting to build',
	'BUILDING_ERROR_ALREADY': 'A building is already upgrading',
	'UNIT_ERROR_ALREADY': 'An unit is already building',
	'BUILDING_ERROR_MAXIMUM': 'Maximum level reached',
	'BUILDING_ERROR_COST': 'You don\'t have enough resources',
	'BUILDING_ERROR_STORAGE': 'You don\'t have enough storage capacity',
	'BUILDING_ERROR_ENERGY': 'No enough energy produced',
	'BUILDING_ERROR_PEOPLE': 'No enough people',
	'BUILDING_ERROR_DEPENDENCIES': 'Missing dependencies to build it',
	'UPGRADE': 'Upgrade',
	'BUILD': 'Construire',
	'LEVEL': 'Level',
	'UPGRADE_MAX': 'Maximum level reached',
	'ENOUGH_RESOURCES_TODAY_AT': 'Enough resources today at',
	'ENOUGH_RESOURCES_TOMORROW_AT': 'Enough resources tomorrow at',
	'ENOUGH_RESOURCES_THE': 'Enough resources the',
	'ENOUGH_RESOURCES_AT': 'at',
	'ANOTHER_IN_BUILD': 'Another building is already being build',
	// Build finish at ...
	'BUILD_FINISH_TODAY_AT': 'Building finish today at',
	'BUILD_FINISH_TOMORROW_AT': 'Building finish tomorrow at',
	'BUILD_FINISH_THE': 'Building finish the',
	'BUILD_FINISH_AT': 'at',
	// [Number] units '[Name]' are being build in fleet '[FleetName]'
	'UNIT_CURR_BUILD_01': 'units',
	'UNIT_CURR_BUILD_02': 'are being build in fleet',
	// Unit Notifs
	'ENDED_UNIT_TITLE': 'Units Ended !',
	'ENDED_UNIT_01': 'Your ',
	'ENDED_UNIT_02': ' units of model ',
	'ENDED_UNIT_03': ' are now finished.',
	// Building Notifs
	'ENDED_BUILDING_TITLE': 'Building finished !',
	'ENDED_BUILDING_01': 'Your ',
	'ENDED_BUILDING_02': ' has just finished to upgrade to ',
	// Not Belonging
	'ERROR_NOT_BELONGING': 'You don\'t own this planet !',
	// Server messages
	'CONNECT_LOSS': 'You lost the connection to the server. Trying to reconnect ...',
	'KICK': 'You\'re kicked from the game. Reason:',
	'BAN': 'The ban hammer has spoken. Reason:',
	'MAINTENANCE': 'Maintenance ongoing.',
	'RESTARTING_SERVER': 'Restarting game servers ...',
	'DOUBLE_ACCOUNTS_CONNECTED': 'You\'re already connected with this account on another game-client.',
	'ERR_BANNED': 'Erreur: you\'re banned from this server',
	'ERR_WHITELIST': 'Erreur: you\'re not whitelisted on this server',
	'SYSTEM_MESSAGE': 'Message Systeme:',
	// Chat Mute
	'CHAT_MUTED': 'You\'ve been muted for',
	'CHAT_UNMUTED': 'You\'ve been unmuted',
	'CHAT_MUTED_REASON': 'for the reason',
	// Research
	'MISSING_PARENTS': 'Missing dependancies',
	'ENDED_RESEARCH': 'Research unlocked',
	'NEEDED_RESEARCH_MISSING': 'You need to discover some technologies to create that ship.',
	'PLANETS': 'owned planets',
	// Fleets & Units
	'BUILDING_UNIT_OK': 'Your fleet has begun expanding',
	'SHIP_HAS_INVALID_PARTS': 'Your ship has invalid components',
	'SHIP_HAS_WRONG_TYPE_OR_SHAPE': 'Your ship has wrong type or shape',
	'SHIP_HAS_EMPTY_FIELD': 'You forgot to choose a or multiple components',
	'SHIP_HAS_NO_NAME': 'Your ship isn\'t named',
	'SHIP_NAME_ALREADY_EXISTS': 'A ship blueprint with this name already exists',
	'SHIP_TYPE_ALREADY_EXISTS': 'You already have created this ship',
	'MODEL_DELETE_USED_BY_UNITS': 'This blueprint is used by some unit, you need to upgrade or destroy them before',
	'MODEL_DELETED': 'Ship blueprint deleted',
	'FLEET_MAX_REACHED': 'Maximum count of fleets reached',
	'FLEET_NAME_ALREADY_EXISTS': 'Another fleet with this name already belong to this planet',
	'BUILDING_ERROR_INVALID_FLEET': 'Error: units fleet doesn\'t exists',
	'BUILDING_ERROR_FLEET_SIZE': 'Error: fleet maximum units capacity exceeded',
	// Errors message
	'PLY_NOT_FOUND': 'Error: player not found',
	'NO_PM_YOU': 'Error: you can\'t send a private message to yourself',
	'NO_LINKS': 'Error: sending links in chat is prohibited.',
	'DISABLED_FUNCTIONALIY': 'Error: this functionallity isn\'t avaiable yet.',
	// Anti Self XSS Warning
	'selfXSSWarn': 'Warning: if someone told you to paste something here, it\'s probably a scam, this kind of attack are called "Self XSS" and are made to take control of your account. Be careful !',
	// Move Panel
	'movePanelPt1': [
		'Defend planet',
		'Attack planet',
		'Move to',
		'Spy planet',
	],
	'movePanelBtn': [
		'Defend',
		'Attack',
		'Move to',
		'Spy',
	],
	'IN_BUILDING_FLEET': 'Error: Your fleet building list isn\'t finish.',
	'ALREADY_MOVING_FLEET': 'Error: Your fleet is already moving.',
	'NO_ENOUGHT_CARRIER': 'Error: You haven\'t enough carrier capacity.',
	'CANT_MAKE_SUPRAMOVE': 'Error: Some of your ships can\'t move to another system.',
	'DESTINATION_NOT_EXISTS': 'Error: Destination doesn\'t exists.',
	'NO_ENOUGH_FUEL': 'Error: Fleet doesn\'t have enough fuel.',
	'FLEET_MOVING': 'Fleet begins moving',
	'ENDED_MOVE': 'Fleet at destination',
	'ENDED_MOVE_01': ' has arrived to ',

	// Merge fleets/move units
	'FLEET_AT_DIFFERENT_POSITIONS': 'Error: the fleets are at the same place.',
	'FLEET_UNIT_TRANSFER_SUCCESSFUL': 'Units have been successfuly tranfered between fleets',
	'FLEET_MERGE_SUCCESSFUL': 'Fleets have been successfuly merged',

	// Reports
	'NEW_REPORT_AVAILABLE': 'New battle report available',
	'REPORT_ATTACK': ' attacks ',
	'NO_REPORTS_AVAILABLE': 'No battle report available',
	'REPORT_DEF_WINS': 'Defenders wins',
	'REPORT_ATK_WINS': 'Attackers wins',
	'REPORT_NO_FLEET': 'No fleet',
	'REPORT_DELETE_ONE': 'Do you really want to delete this report ?',
	'REPORT_DELETE_MULTIPLE': 'Do you really want to delete these reports ?',

	// Attack notif
	'ATTACK_INCOMING_TITLE': 'Incoming attack',
	'ATTACK_INCOMING_FROM': 'Incoming attack from ',
	'ATTACK_INCOMING_TO': ' to ',
	'ATTACK_INCOMING_TIME': ', ETA: ',

	// Alliances notif
	'ALLIANCE_CREATE_ERROR': 'Error: An alliance with the same name already exists',
	'ALLIANCE_DOES_NOT_EXISTS': 'Erreur: This alliance does not exists',
	'ALLIANCE_YOU_ALREADY_HAVE': 'Erreur: You\'re already a member of an alliance',
	'ALLIANCE_NOT_ENOUGH_RIGHTS': 'Erreur: You don\'t have enough rights.',
	'ALLIANCE_INVALID_PLAYER_PERMISSIONS': 'Erreur: Invalid permissions.',
	'ALLIANCE_ERR_SAME_ALLY': 'Erreur: You can\'t to diplomacy with your own alliance.',
	'ALLIANCE_PLY_ASKED_TO_JOIN': 'A nation asked to join your alliance',
	'ALLIANCE_ASKED_TO_PACT': 'An alliance want to make a pact with you',
	'ALLIANCE_NEW_PACT': 'A new pact as been created',
	'ALLIANCE_REFUSED_PACT': 'Refused pact',
	'ALLIANCE_STOPPED_PACT': 'Stopped pact',
	'ALLIANCE_GRANTED': (ally) => 'You were granted to join ' + ally + '.',
	'ALLIANCE_REFUSED': (ally) => 'You were not granted to join ' + ally + '.',
	'ALLIANCE_INVITED': (ally) => 'You were invited to join ' + ally + '.',
	'ALLIANCE_KICKED': 'You were kicked from you alliance by ',
	'ALLIANCE_NEWPERMS': 'Your role in the alliance were edited by ',
	'ALLIANCE_NEW_PLAYER': (plyName) => plyName + ' has joined the alliance.',
	'ALLIANCE_INVITE_REFUSED': (plyName) => plyName + ' refused to join alliance.',
	'ALLIANCE_MEMBER_KICKED': (plyName, staffName) => plyName + ' was kicked from alliance by ' + staffName + '.',
	'ALLIANCE_MEMBER_LEFT': (plyName) => plyName + ' has left the alliance.',
	'ALLIANCE_EDITED': (plyName) => plyName + ' edited name and/or description from the alliance.',
	'ALLIANCE_DISSOLVED': 'The alliance was dissolved.',

	// Conquest
	'BEING_CONQUESTED_BUILD': 'Planet is being conquered, you can\'t build anything', // @TODO: Conquest type
	'BEING_CONQUESTED_BY': 'To arms! Your planet is being conquered by ', // @TODO: Conquest type
	'YOU_ARE_CONQUERING': 'You are conquering ',
	'BEING_CONQUESTED_END': 'End time: ',
};

translate['load'] = {
	'alliance': 'Loading alliance data',
	'conquest': 'Loading conquest list',
	'fleet': 'Loading fleets',
	'load': 'Loading page',
	'maps': 'Loading maps',
	'planet': 'Loading planet data',
	'player': 'Loading player data',
	'server': 'Connecting to server ...',
	'service-worker': 'Preloading resources',
	'settings': 'Loading settings',
	'tactics': 'Loading des tactics',
	'units': 'Loading units',
};
</script>