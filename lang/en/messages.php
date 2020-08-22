<?php
	define('DEFAULT_LOAD','Connecting to server ...');

	// Building
	define('BUILD_OK', 'The Building is now upgrading !');
	define('BUILD_ERROR', 'An error has occurred while attempting to build');
	define('BUILDING_ERROR_ALREADY', 'A building is already upgrading');
	define('UNIT_ERROR_ALREADY', 'An unit is already building');
	define('BUILDING_ERROR_MAXIMUM', 'Maximum level reached');
	define('BUILDING_ERROR_COST', 'You don\'t have enough resources');
	define('BUILDING_ERROR_STORAGE', 'You don\'t have enough storage capacity');
	define('BUILDING_ERROR_ENERGY', 'No enough energy produced');
	define('BUILDING_ERROR_PEOPLE', 'No enough people');
	define('BUILDING_ERROR_DEPENDENCIES', 'Missing dependencies to build it');
	define('UPGRADE', 'Upgrade');
	define('LEVEL', 'Level');
	define('UPGRADE_MAX', 'Maximum level reached');
	define('ENOUGH_RESOURCES_TODAY_AT', 'Enough resources today at');
	define('ENOUGH_RESOURCES_TOMORROW_AT', 'Enough resources tomorrow at');
	define('ENOUGH_RESOURCES_THE', 'Enough resources the');
	define('ENOUGH_RESOURCES_AT', 'at');
	define('ANOTHER_IN_BUILD', 'Another building is already being build');
	// Build finish at ...
	define('BUILD_FINISH_TODAY_AT', 'Building finish today at');
	define('BUILD_FINISH_TOMORROW_AT', 'Building finish tomorrow at');
	define('BUILD_FINISH_THE', 'Building finish the');
	define('BUILD_FINISH_AT', 'at');
	// [Number] units '[Name]' are being build in fleet '[FleetName]'
	define('UNIT_CURR_BUILD_01', 'units');
	define('UNIT_CURR_BUILD_02', 'are being build in fleet');
	// Unit Notifs
	define('ENDED_UNIT_TITLE', 'Units Ended !');
	define('ENDED_UNIT_01', 'Your ');
	define('ENDED_UNIT_02', ' units of model ');
	define('ENDED_UNIT_03', ' are now finished.');
	// Building Notifs
	define('ENDED_BUILDING_TITLE', 'Building finished !');
	define('ENDED_BUILDING_01', 'Your ');
	define('ENDED_BUILDING_02', ' has just finished to upgrade to ');
	// Not Belonging
	define('ERROR_NOT_BELONGING', 'You don\'t own this planet !');
	// Server messages
	define('CONNECT_LOSS', 'You lost the connection to the server. Trying to reconnect ...');
	define('KICK', 'You\'re kicked from the game. Reason:');
	define('BAN', 'The ban hammer has spoken. Reason:');
	define('MAINTENANCE', 'Maintenance ongoing.');
	define('RESTARTING_SERVER', 'Restarting game servers ...');
	define('DOUBLE_ACCOUNTS_CONNECTED', 'You\'re already connected with this account on another game-client.');
	define('ERR_BANNED', 'Erreur: you\'re banned from this server');
	define('ERR_WHITELIST', 'Erreur: you\'re not whitelisted on this server');
	define('SYSTEM_MESSAGE', 'Message Systeme:');
	// Chat Mute
	define('CHAT_MUTED', 'You\'ve been muted for');
	define('CHAT_UNMUTED', 'You\'ve been unmuted');
	define('CHAT_MUTED_REASON', 'for the reason');
	// Research
	define('MISSING_PARENTS', 'Missing dependancies');
	define('ENDED_RESEARCH', 'Research unlocked');
	define('NEEDED_RESEARCH_MISSING', 'You need to discover some technologies to create that ship.');
	define('PLANETS', 'owned planets');
	// Fleets & Units
	define('BUILDING_UNIT_OK', 'Your fleet has begun expanding');
	define('SHIP_HAS_INVALID_PARTS', 'Your ship has invalid components');
	define('SHIP_HAS_WRONG_TYPE_OR_SHAPE', 'Your ship has wrong type or shape');
	define('SHIP_HAS_EMPTY_FIELD', 'You forgot to choose a or multiple components');
	define('SHIP_HAS_NO_NAME', 'Your ship isn\'t named');
	define('SHIP_NAME_ALREADY_EXISTS', 'A ship blueprint with this name already exists');
	define('SHIP_TYPE_ALREADY_EXISTS', 'You already have created this ship');
	define('MODEL_DELETE_USED_BY_UNITS', 'This blueprint is used by some unit, you need to upgrade or destroy them before');
	define('MODEL_DELETED', 'Ship blueprint deleted');
	define('FLEET_MAX_REACHED', 'Maximum count of fleets reached');
	define('FLEET_NAME_ALREADY_EXISTS', 'Another fleet with this name already belong to this planet');
	define('BUILDING_ERROR_INVALID_FLEET', 'Error: units fleet doesn\'t exists');
	define('BUILDING_ERROR_FLEET_SIZE', 'Error: fleet maximum units capacity exceeded');
	// Errors message
	define('PLY_NOT_FOUND', 'Error: player not found');
	define('NO_PM_YOU', 'Error: you can\'t send a private message to yourself');
	define('NO_LINKS', 'Error: sending links in chat is prohibited.');
	define('DISABLED_FUNCTIONALIY', 'Error: this functionallity isn\'t avaiable yet.');
	// Anti Self XSS Warning
	define('SELF_XSS_WARN', 'Warning: if someone told you to paste something here, it\'s probably a scam, this kind of attack are called «Self XSS» and are made to take control of your account. Be careful !');

	// Move Panel
	define('MOVE_PANEL_PT1_DEF', 'Defend planet');
	define('MOVE_PANEL_PT1_ATK', 'Attack planet');
	define('MOVE_PANEL_PT1_MOVE', 'Move to');
	define('MOVE_PANEL_PT1_SPY', 'Spy planet');

	define('MOVE_PANEL_BTN_DEF', 'Defend');
	define('MOVE_PANEL_BTN_ATK', 'Attack');
	define('MOVE_PANEL_BTN_MOVE', 'Move to');
	define('MOVE_PANEL_BTN_SPY', 'Spy');

	define('IN_BUILDING_FLEET', 'Error: Your fleet building list isn\'t finish.');
	define('ALREADY_MOVING_FLEET', 'Error: Your fleet is already moving.');
	define('NO_ENOUGHT_CARRIER', 'Error: You haven\'t enough carrier capacity.');
	define('CANT_MAKE_SUPRAMOVE', 'Error: Some of your ships can\'t move to another system.');
	define('DESTINATION_NOT_EXISTS', 'Error: Destination doesn\'t exists.');
	define('NO_ENOUGH_FUEL', 'Error: Fleet doesn\'t have enough fuel.');
	define('FLEET_MOVING', 'Fleet begins moving');
	define('ENDED_MOVE', 'Fleet at destination');
	define('ENDED_MOVE_01', ' has arrived to ');

	// Merge fleets/move units
	define('FLEET_AT_DIFFERENT_POSITIONS', 'Error: the fleets are at the same place.');
	define('FLEET_UNIT_TRANSFER_SUCCESSFUL', 'Units have been successfuly tranfered between fleets');
	define('FLEET_MERGE_SUCCESSFUL', 'Fleets have been successfuly merged');

	// Reports
	define('NEW_REPORT_AVAILABLE', 'New battle report available');
	define('REPORT_ATTACK', ' attacks ');
	define('NO_REPORTS_AVAILABLE', 'No battle report available');
	define('REPORT_DEF_WINS', 'Defenders wins');
	define('REPORT_ATK_WINS', 'Attackers wins');
	define('REPORT_NO_FLEET', 'No fleet');
	define('REPORT_DELETE_ONE', 'Do you really want to delete this report ?');
	define('REPORT_DELETE_MULTIPLE', 'Do you really want to delete these reports ?');

	// Attack notif
	define('ATTACK_INCOMING_TITLE', 'Incoming attack');
	define('ATTACK_INCOMING_FROM', 'Incoming attack from ');
	define('ATTACK_INCOMING_TO', ' to ');
	define('ATTACK_INCOMING_TIME', '); ETA: ');

	// Alliances notif
	define('ALLIANCE_CREATE_ERROR', 'Error: An alliance with the same name already exists');
	define('ALLIANCE_DOES_NOT_EXISTS', 'Erreur: This alliance does not exists');
	define('ALLIANCE_YOU_ALREADY_HAVE', 'Erreur: You\'re already a member of an alliance');
	define('ALLIANCE_NOT_ENOUGH_RIGHTS', 'Erreur: You don\'t have enough rights.');
	define('ALLIANCE_INVALID_PLAYER_PERMISSIONS', 'Erreur: Invalid permissions.');
	define('ALLIANCE_ERR_SAME_ALLY', 'Erreur: You can\'t to diplomacy with your own alliance.');
	define('ALLIANCE_PLY_ASKED_TO_JOIN', 'A nation asked to join your alliance');
	define('ALLIANCE_ASKED_TO_PACT', 'An alliance want to make a pact with you');
	define('ALLIANCE_NEW_PACT', 'A new pact as been created');
	define('ALLIANCE_REFUSED_PACT', 'Refused pact');
	define('ALLIANCE_STOPPED_PACT', 'Stopped pact');
	define('ALLIANCE_GRANTED', 'You were granted to join %ally%.');
	define('ALLIANCE_REFUSED', 'You were not granted to join %ally%.');
	define('ALLIANCE_INVITED', 'You were invited to join %ally%.');
	define('ALLIANCE_KICKED', 'You were kicked from you alliance by ');
	define('ALLIANCE_NEWPERMS', 'Your role in the alliance were edited by ');
	define('ALLIANCE_NEW_PLAYER', '%playerName% has joined the alliance.');
	define('ALLIANCE_INVITE_REFUSED', '%playerName% refused to join alliance.');
	define('ALLIANCE_MEMBER_KICKED', '%playerName% was kicked from alliance by %staffName%.');
	define('ALLIANCE_MEMBER_LEFT', '%playerName% has left the alliance.');
	define('ALLIANCE_EDITED', '%playerName% edited name and/or description from the alliance.');
	define('ALLIANCE_DISSOLVED', 'The alliance was dissolved.');

	// Conquest
	define('BEING_CONQUESTED_BUILD', 'Planet is being conquered, you can\'t build anything'); // @TODO: Conquest type
	define('BEING_CONQUESTED_BY', 'To arms! Your planet is being conquered by '); // @TODO: Conquest type
	define('YOU_ARE_CONQUERING', 'You are conquering ');
	define('BEING_CONQUESTED_END', 'End time: ');

	// Load
	define('LOAD_FLEET', 'Loading fleets');
	define('LOAD_PICTURES', 'Loading pictures');
	define('LOAD_LOAD', 'Loading page');
	define('LOAD_MAPS', 'Loading maps');
	define('LOAD_PLANET', 'Loading planet data');
	define('LOAD_PLAYER', 'Loading player data');
	define('LOAD_SERVER', 'Connecting to server ...');
	define('LOAD_SERVICE_WORKER', 'Preloading resources');
	define('LOAD_SETTINGS', 'Loading settings');
	define('LOAD_TACTICS', 'Loading des tactics');
    define('LOAD_TRADING','Loading trading orders');
	define('LOAD_UNITS', 'Loading units');