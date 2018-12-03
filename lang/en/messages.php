<?php
	define('DEFAULT_LOAD','Connecting to server ...');
?>
<script type="text/javascript">
var translate = translate || {};

translate["messages"] = {
	// Building
	"BUILD_OK": "The Building is now upgrading !",
	"BUILD_ERROR": "An error has occurred while attempting to build",
	"BUILDING_ERROR_ALREADY": "A building is already upgrading",
	"UNIT_ERROR_ALREADY": "An unit is already building",
	"BUILDING_ERROR_MAXIMUM": "Maximum level reached",
	"BUILDING_ERROR_COST": "You don't have enough resources",
	"BUILDING_ERROR_ENERGY": "No enough energy produced",
	"BUILDING_ERROR_PEOPLE": "No enough people",
	"BUILDING_ERROR_DEPENDENCIES": "Missing dependencies to build it",
	"UPGRADE": "Upgrade",
	"BUILD": "Construire",
	"LEVEL": "Level",
	"UPGRADE_MAX": "Maximum level reached",
	"ENOUGH_RESOURCES_TODAY_AT": "Enough resources today at",
	"ENOUGH_RESOURCES_TOMORROW_AT": "Enough resources tomorrow at",
	"ENOUGH_RESOURCES_THE": "Enough resources the",
	"ENOUGH_RESOURCES_AT": "at",
	"ANOTHER_IN_BUILD": "Another building is already being build",
	// Build finish at ...
	"BUILD_FINISH_TODAY_AT": "Building finish today at",
	"BUILD_FINISH_TOMORROW_AT": "Building finish tomorrow at",
	"BUILD_FINISH_THE": "Building finish the",
	"BUILD_FINISH_AT": "at",
	// [Number] units "[Name]" are being build in fleet "[FleetName]" 
	"UNIT_CURR_BUILD_01": "units",
	"UNIT_CURR_BUILD_02": "are being build in fleet",
	// Unit Notifs
	"ENDED_UNIT_TITLE": "Units Ended !",
	"ENDED_UNIT_01": "Your ",
	"ENDED_UNIT_02": " units of model ",
	"ENDED_UNIT_03": " are now finished.",
	// Building Notifs
	"ENDED_BUILDING_TITLE": "Building finished !",
	"ENDED_BUILDING_01": "Your ",
	"ENDED_BUILDING_02": " has just finished to upgrade to ",
	// Not Belonging
	"ERROR_NOT_BELONGING": "You don't own this planet !",
	// Server kick messages
	"CONNECT_LOSS": "You lost the connection to the server. Trying to reconnect ...",
	"KICK": "You're kicked from the game. Reason:",
	"BAN": "The ban hammer has spoken. Reason:",
	"MAINTENANCE": "Maintenance ongoing.",
	"RESTARTING_SERVER": "Restarting game servers ...",
	"DOUBLE_ACCOUNTS_CONNECTED": "You're already connected with this account on another game-client.",
	"SYSTEM_MESSAGE": "Message Systeme:",
	// Chat Mute
	"CHAT_MUTED": "You've been muted for",
	"CHAT_UNMUTED": "You've been unmuted",
	"CHAT_MUTED_REASON": "for the reason",
	// Research
	"MISSING_PARENTS": "Missing dependancies",
	"ENDED_RESEARCH": "Research unlocked",
	"NEEDED_RESEARCH_MISSING": "You need to discover some technologies to create that ship.",
	"PLANETS": "owned planets",
	// Fleets & Units
	"BUILDING_UNIT_OK": "Your fleet has begun expanding",
	"SHIP_HAS_INVALID_PARTS": "Your ship has invalid components",
	"SHIP_HAS_WRONG_TYPE_OR_SHAPE": "Your ship has wrong type or shape",
	"SHIP_HAS_EMPTY_FIELD": "You forgot to choose a or multiple components",
	"SHIP_HAS_NO_NAME": "Your ship isn't named",
	"SHIP_NAME_ALREADY_EXISTS": "A ship blueprint with this name already exists",
	"SHIP_TYPE_ALREADY_EXISTS": "You already have created this ship",
	"MODEL_DELETE_USED_BY_UNITS": "This blueprint is used by some unit, you need to upgrade or destroy them before",
	"MODEL_DELETED": "Ship blueprint deleted",
	"FLEET_MAX_REACHED": "Maximum count of fleets reached",
	"FLEET_NAME_ALREADY_EXISTS": "Another fleet with this name already belong to this planet",
	"BUILDING_ERROR_INVALID_FLEET": "Error: units fleet doesn't exists",
	"BUILDING_ERROR_FLEET_SIZE": "Error: fleet maximum units capacity exceeded",
	"IN_BUILDING_FLEET": "Error: Your fleet building list isn't finish.",
	"ALREADY_MOVING_FLEET": "Error: Your fleet is already moving.",
	"NO_ENOUGHT_CARRIER": "Error: You haven't enough carrier capacity.",
	"CANT_MAKE_SUPRAMOVE": "Error: Some of your ships can't move to another system.",
	// Errors message
	"PLY_NOT_FOUND": "Error: player not found",
	"NO_PM_YOU": "Error: you can't send a private message to yourself",
	"NO_LINKS": "Error: sending links in chat is prohibited.",
	"DISABLED_FUNCTIONALIY": "Error: this functionallity isn't avaiable yet.",
	// Anti Self XSS Warning
	"selfXSSWarn": "Warning: if someone told you to paste something here, it's probably a scam, this kind of attack are called \"Self XSS\" and are made to take control of your account. Be careful !",
};

translate['load'] = {
	"fleet": "Loading fleets",
	"pictures": "Loading pictures",
	"maps": "Loading maps",
	"planet": "Loading planet data",
	"player": "Loading player data",
	"server": "Connecting to server ...",
	"settings": "Loading settings",
	"units": "Loading units",
};
</script>