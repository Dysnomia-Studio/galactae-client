<?php
// Menu
define('ALLY_MEMBERS', 'Members');
define('ALLY_INFOS', 'Informations');
define('ALLY_DIPLOMACY', 'Diplomacy');

// Infos
define('ALLY_NAME', 'Alliance name:');
define('ALLY_SEARCH', 'Search alliance ...');
define('ALLY_PLY_NAME', 'Player Name:');
define('ALLY_DESC', 'Description:');
define('ALLY_EDIT', 'Edit');
define('ALLY_EDIT_CANCEL', 'Cancel Edit');
define('ALLY_EDIT_SAVE', 'Save');
define('ALLY_DISSOLVE', 'Dissolve alliance');
define('ALLY_QUIT', 'Quit alliance');
define('ALLY_CREATE', 'Create alliance');

// Members list
define('ALLY_MEMBERS_PLAYER_NAME', 'Player name');
define('ALLY_MEMBERS_PERMS_FOUNDER', 'Founder');
define('ALLY_MEMBERS_PERMS_LEADER', 'Leader');
define('ALLY_MEMBERS_PERMS_DIPLOMACY', 'Diplomacy');
define('ALLY_MEMBERS_PERMS_NONE', 'No permission');
?>
<script type="text/javascript">
var translate = translate || {};

translate['alliance'] = {
	'pact-no': 'No pact',
	'pact-current': 'Pacts:',

	'pact-askToJoin-no': 'No incoming pact invitation',
	'pact-askToJoin-current': 'Incoming pact invitation(s):',

	'pact-invitations-no': 'No pact invitation',
	'pact-invitations-current': 'Pact invitation(s):',

	'members-askToJoin-no': 'No player asked to join alliance',
	'members-askToJoin-current': 'Player(s) that asked to join alliance:',

	'members-invitations-no': 'No player invited to join alliance',
	'members-invitations-current': 'Player(s) invited to join alliance:',

	'noAlly-askToJoin-no': 'You have not applied to alliance',
	'noAlly-askToJoin-current': 'Alliance(s) you applied to:',

	'noAlly-invitations-no': 'No invitation to join alliance',
	'noAlly-invitations-current': 'Invitation(s) to join an alliance:',

	'askToJoin': 'Ask to join',
	'results-no': 'No results',
	'results': 'Results:',

	'quit-confirm': 'Do you really want to quit this alliance ?',
	'dissolve-confirm': 'Do you really want to dissolve this alliance ?',
	'stopPact-confirm': 'Do you really want to stop this pact ?',
	'abandon-founder-confirm': (playerName) => 'Do you really want to abandon your founder role and give it to '+ playerName + ' ?',
	'kick-confirm': (playerName) => 'Do you really want to kick ' + playerName + ' from alliance ?',
};
</script>