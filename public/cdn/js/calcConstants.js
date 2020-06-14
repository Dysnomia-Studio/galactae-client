/*eslint-disable no-magic-numbers */
const globalConst = {
	groundBuildingNumber: 	9,
	buildingNumber: 	14,
	maxFleetSize:   300000, // Number of people
};

const HTTP = {
	OK : 200,
	NOTFOUND : 404,
};

const TIME = {
	DAY_TO_HOUR: 24,
	DAY_TO_MINUTES: 24*60,
	DAY_TO_SECONDS: 24*60*60,
	DAY_TO_MS: 24*60*60*1000,

	HOUR_TO_MINUTES: 60,
	HOUR_TO_SECONDS: 60*60,
	HOUR_TO_MS: 60*60*1000,

	MINUTES_TO_SECONDS: 60,
	MINUTES_TO_MS: 60*1000,

	SECONDS_TO_MS: 1000,

	SECOND_MARGIN: 1,
};

const keyboardMap = [
	'CHAR?', // [0]
	'CHAR?', // [1]
	'CHAR?', // [2]
	'CANCEL', // [3]
	'CHAR?', // [4]
	'CHAR?', // [5]
	'HELP', // [6]
	'CHAR?', // [7]
	'BACK_SPACE', // [8]
	'TAB', // [9]
	'CHAR?', // [10]
	'CHAR?', // [11]
	'CLEAR', // [12]
	'ENTER', // [13]
	'ENTER_SPECIAL', // [14]
	'CHAR?', // [15]
	'SHIFT', // [16]
	'CONTROL', // [17]
	'ALT', // [18]
	'PAUSE', // [19]
	'CAPS_LOCK', // [20]
	'KANA', // [21]
	'EISU', // [22]
	'JUNJA', // [23]
	'FINAL', // [24]
	'HANJA', // [25]
	'CHAR?', // [26]
	'ESC', // [27]
	'CONVERT', // [28]
	'NONCONVERT', // [29]
	'ACCEPT', // [30]
	'MODECHANGE', // [31]
	'SPACE', // [32]
	'PAGE_UP', // [33]
	'PAGE_DOWN', // [34]
	'END', // [35]
	'HOME', // [36]
	'←', // [37]
	'↑', // [38]
	'→', // [39]
	'↓', // [40]
	'SELECT', // [41]
	'PRINT', // [42]
	'EXECUTE', // [43]
	'PRINTSCREEN', // [44]
	'INSERT', // [45]
	'DELETE', // [46]
	'CHAR?', // [47]
	'0', // [48]
	'1', // [49]
	'2', // [50]
	'3', // [51]
	'4', // [52]
	'5', // [53]
	'6', // [54]
	'7', // [55]
	'8', // [56]
	'9', // [57]
	'COLON', // [58]
	'SEMICOLON', // [59]
	'LESS_THAN', // [60]
	'EQUALS', // [61]
	'GREATER_THAN', // [62]
	'QUESTION_MARK', // [63]
	'AT', // [64]
	'A', // [65]
	'B', // [66]
	'C', // [67]
	'D', // [68]
	'E', // [69]
	'F', // [70]
	'G', // [71]
	'H', // [72]
	'I', // [73]
	'J', // [74]
	'K', // [75]
	'L', // [76]
	'M', // [77]
	'N', // [78]
	'O', // [79]
	'P', // [80]
	'Q', // [81]
	'R', // [82]
	'S', // [83]
	'T', // [84]
	'U', // [85]
	'V', // [86]
	'W', // [87]
	'X', // [88]
	'Y', // [89]
	'Z', // [90]
	'OS_KEY', // [91] Windows Key (Windows) or Command Key (Mac)
	'CHAR?', // [92]
	'CONTEXT_MENU', // [93]
	'CHAR?', // [94]
	'SLEEP', // [95]
	'NUMPAD0', // [96]
	'NUMPAD1', // [97]
	'NUMPAD2', // [98]
	'NUMPAD3', // [99]
	'NUMPAD4', // [100]
	'NUMPAD5', // [101]
	'NUMPAD6', // [102]
	'NUMPAD7', // [103]
	'NUMPAD8', // [104]
	'NUMPAD9', // [105]
	'MULTIPLY', // [106]
	'ADD', // [107]
	'SEPARATOR', // [108]
	'SUBTRACT', // [109]
	'DECIMAL', // [110]
	'DIVIDE', // [111]
	'F1', // [112]
	'F2', // [113]
	'F3', // [114]
	'F4', // [115]
	'F5', // [116]
	'F6', // [117]
	'F7', // [118]
	'F8', // [119]
	'F9', // [120]
	'F10', // [121]
	'F11', // [122]
	'F12', // [123]
	'F13', // [124]
	'F14', // [125]
	'F15', // [126]
	'F16', // [127]
	'F17', // [128]
	'F18', // [129]
	'F19', // [130]
	'F20', // [131]
	'F21', // [132]
	'F22', // [133]
	'F23', // [134]
	'F24', // [135]
	'CHAR?', // [136]
	'CHAR?', // [137]
	'CHAR?', // [138]
	'CHAR?', // [139]
	'CHAR?', // [140]
	'CHAR?', // [141]
	'CHAR?', // [142]
	'CHAR?', // [143]
	'NUM_LOCK', // [144]
	'SCROLL_LOCK', // [145]
	'WIN_OEM_FJ_JISHO', // [146]
	'WIN_OEM_FJ_MASSHOU', // [147]
	'WIN_OEM_FJ_TOUROKU', // [148]
	'WIN_OEM_FJ_LOYA', // [149]
	'WIN_OEM_FJ_ROYA', // [150]
	'CHAR?', // [151]
	'CHAR?', // [152]
	'CHAR?', // [153]
	'CHAR?', // [154]
	'CHAR?', // [155]
	'CHAR?', // [156]
	'CHAR?', // [157]
	'CHAR?', // [158]
	'CHAR?', // [159]
	'CIRCUMFLEX', // [160]
	'EXCLAMATION', // [161]
	'DOUBLE_QUOTE', // [162]
	'HASH', // [163]
	'DOLLAR', // [164]
	'PERCENT', // [165]
	'AMPERSAND', // [166]
	'UNDERSCORE', // [167]
	'OPEN_PAREN', // [168]
	'CLOSE_PAREN', // [169]
	'ASTERISK', // [170]
	'PLUS', // [171]
	'PIPE', // [172]
	'HYPHEN_MINUS', // [173]
	'OPEN_CURLY_BRACKET', // [174]
	'CLOSE_CURLY_BRACKET', // [175]
	'TILDE', // [176]
	'CHAR?', // [177]
	'CHAR?', // [178]
	'CHAR?', // [179]
	'CHAR?', // [180]
	'VOLUME_MUTE', // [181]
	'VOLUME_DOWN', // [182]
	'VOLUME_UP', // [183]
	'CHAR?', // [184]
	'CHAR?', // [185]
	'SEMICOLON', // [186]
	'EQUALS', // [187]
	'COMMA', // [188]
	'MINUS', // [189]
	'PERIOD', // [190]
	'SLASH', // [191]
	'BACK_QUOTE', // [192]
	'CHAR?', // [193]
	'CHAR?', // [194]
	'CHAR?', // [195]
	'CHAR?', // [196]
	'CHAR?', // [197]
	'CHAR?', // [198]
	'CHAR?', // [199]
	'CHAR?', // [200]
	'CHAR?', // [201]
	'CHAR?', // [202]
	'CHAR?', // [203]
	'CHAR?', // [204]
	'CHAR?', // [205]
	'CHAR?', // [206]
	'CHAR?', // [207]
	'CHAR?', // [208]
	'CHAR?', // [209]
	'CHAR?', // [210]
	'CHAR?', // [211]
	'CHAR?', // [212]
	'CHAR?', // [213]
	'CHAR?', // [214]
	'CHAR?', // [215]
	'CHAR?', // [216]
	'CHAR?', // [217]
	'CHAR?', // [218]
	'OPEN_BRACKET', // [219]
	'BACK_SLASH', // [220]
	'CLOSE_BRACKET', // [221]
	'QUOTE', // [222]
	'CHAR?', // [223]
	'META', // [224]
	'ALTGR', // [225]
	'CHAR?', // [226]
	'WIN_ICO_HELP', // [227]
	'WIN_ICO_00', // [228]
	'CHAR?', // [229]
	'WIN_ICO_CLEAR', // [230]
	'CHAR?', // [231]
	'CHAR?', // [232]
	'WIN_OEM_RESET', // [233]
	'WIN_OEM_JUMP', // [234]
	'WIN_OEM_PA1', // [235]
	'WIN_OEM_PA2', // [236]
	'WIN_OEM_PA3', // [237]
	'WIN_OEM_WSCTRL', // [238]
	'WIN_OEM_CUSEL', // [239]
	'WIN_OEM_ATTN', // [240]
	'WIN_OEM_FINISH', // [241]
	'WIN_OEM_COPY', // [242]
	'WIN_OEM_AUTO', // [243]
	'WIN_OEM_ENLW', // [244]
	'WIN_OEM_BACKTAB', // [245]
	'ATTN', // [246]
	'CRSEL', // [247]
	'EXSEL', // [248]
	'EREOF', // [249]
	'PLAY', // [250]
	'ZOOM', // [251]
	'CHAR?', // [252]
	'PA1', // [253]
	'WIN_OEM_CLEAR', // [254]
	'CHAR?' // [255]
];

/**
 * Production
 */
const mineralProd = 	[1.8,-1.5,147];
const metalProd = 	[1.85,-3,139];
const heliumProd = 	[190,-424,500];

const storageRatio = [0.1,0.5,7];
const heliumStorageRatio = 0.2;

const electricity = [2080000,165000,550000];
const habGen = [25447,419910,-170000];

const buildingSlowDown = 0.7; // 70%

const buildLvlUnitBuildingSpeedBonus = 0.004;

/**
 * Buildings
 */
const buildingsNames = [
	'carriere',
	'metallurgy',
	'living',
	'serre',
	'solar',
	'warehouse',
	'headquarter',
	'launchpad',
	'research',

	'radar',
	'tank',
	'shipyard',
	'trade',
	'he3exp',
];

const buildingMaxLvl = [];
// Terre
buildingMaxLvl[0] = buildingMaxLvl[1] = buildingMaxLvl[2] = buildingMaxLvl[3] = buildingMaxLvl[4] = buildingMaxLvl[5] = buildingMaxLvl[6] = buildingMaxLvl[7] = buildingMaxLvl[8] = buildingMaxLvl[9] = [
	25,	// Carriere
	25,	// Metallurgie
	25,	// Habitations
	25,	// Serres
	30,	// Centrales Solaires
	25,	// Entrepôts
	5,	// Etat Major
	35,	// Centre de lancement
	30,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];
// Lave
buildingMaxLvl[101] = buildingMaxLvl[104] = [
	15,	// Carriere
	30,	// Metallurgie
	22,	// Habitations
	22,	// Serres
	26,	// Centrales Solaires
	20,	// Entrepôts
	5,	// Etat Major
	30,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];
// Pierre Grise
buildingMaxLvl[102] = buildingMaxLvl[113] = [
	30,	// Carriere
	20,	// Metallurgie
	21,	// Habitations
	21,	// Serres
	25,	// Centrales Solaires
	25,	// Entrepôts
	5,	// Etat Major
	40,	// Centre de lancement
	30,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];
// Glace
buildingMaxLvl[103] = [
	15,	// Carriere
	15,	// Metallurgie
	18,	// Habitations
	18,	// Serres
	17,	// Centrales Solaires
	15,	// Entrepôts
	5,	// Etat Major
	20,	// Centre de lancement
	20,	// Centre de recherches
	10,	// Radar
	20,	// Reservoir
	20,	// Chantier naval
	15,	// Commerce
	20,	// Mine He3
];
// Pierre rouge
buildingMaxLvl[105] = buildingMaxLvl[109] = [
	25,	// Carriere
	25,	// Metallurgie
	23,	// Habitations
	23,	// Serres
	26,	// Centrales Solaires
	25,	// Entrepôts
	5,	// Etat Major
	30,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];
// Montagnes, forets
buildingMaxLvl[106] = buildingMaxLvl[107] = [
	30,	// Carriere
	30,	// Metallurgie
	25,	// Habitations
	25,	// Serres
	29,	// Centrales Solaires
	20,	// Entrepôts
	5,	// Etat Major
	25,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	20,	// Reservoir
	20,	// Chantier naval
	15,	// Commerce
	20,	// Mine He3
];
// Montagnes, glace
buildingMaxLvl[108] = [
	25,	// Carriere
	15,	// Metallurgie
	20,	// Habitations
	20,	// Serres
	21,	// Centrales Solaires
	15,	// Entrepôts
	5,	// Etat Major
	20,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	20,	// Reservoir
	20,	// Chantier naval
	15,	// Commerce
	20,	// Mine He3
];
// Pierre marron
buildingMaxLvl[110] = [
	20,	// Carriere
	20,	// Metallurgie
	21,	// Habitations
	21,	// Serres
	22,	// Centrales Solaires
	20,	// Entrepôts
	5,	// Etat Major
	25,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];
// Pierre couleur rouille
buildingMaxLvl[111] = [
	30,	// Carriere
	30,	// Metallurgie
	24,	// Habitations
	24,	// Serres
	29,	// Centrales Solaires
	25,	// Entrepôts
	5,	// Etat Major
	30,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];
// Pierre bleue et blanche
buildingMaxLvl[112] = [
	25,	// Carriere
	25,	// Metallurgie
	22,	// Habitations
	22,	// Serres
	25,	// Centrales Solaires
	20,	// Entrepôts
	5,	// Etat Major
	25,	// Centre de lancement
	25,	// Centre de recherches
	10,	// Radar
	25,	// Reservoir
	25,	// Chantier naval
	15,	// Commerce
	25,	// Mine He3
];

const buildingParents = [];
buildingParents[9] = { // Radar
	research: ['misc_telemetrie','misc_em'],
	building: [ [7, 2] ], // Launching Center lvl 2
};
buildingParents[10] = { // Tank
	research: [],
	building: [ [7, 8] ], // Launching Center lvl 8
};
buildingParents[11] = { // Shipyard
	research: ['prop_main'],
	building: [ [7, 5] ], // Launching Center lvl 5
};
buildingParents[12] = { // Trade
	research: [],
	building: [ [11, 5], [9, 1] ], // Shipyard lvl 5 & Radar lvl 1
};
buildingParents[13] = { // He3exp
	research: [],
	building: [ [7, 8] ], // Launching Center lvl 8
};

/**
 * Map
 */
// Stars: 4.8 to 12 em
// in XML from 0 to 37
const STAR_SIZE_BASE = 4;
const STAR_SIZE_COEF = 2 / 37;
const STAR_ECART = 2.25;

// Planets: 4 to 15 em
const PLANET_SIZE_BASE = 3 / 2;
const PLANET_SIZE_COEF = 9 / 14;
const PLANET_ECART = 2.5;

const MAP_SIZE_HEIGHT = 40000;
const MAP_SIZE_WIDTH = 50000;

const MAP_STAR_SIZE_BASE = 5;
const MAP_STAR_SIZE_RATIO = 0.08;

const MAP_MIN_ZOOM = 0.4;
const MAP_MAX_ZOOM = 1.75;
const MAP_ZOOM_COEF = 0.05;
const MAP_ZOOM_COEF_MOBILE_MAX = 0.1;

const MAP_4K_LOADER_WIDTH = 1920;

const MAP_BG_WIDTH = 3840;
const MAP_BG_HEIGHT = 2160;

/**
 * Research
 */
const researchProduction = [-0.05,12,-4];
const researchBonus = {
	// Bonus construction
	cp_mecanisation: -0.05,
	cp_tracteur: 	 -0.05,
	cp_materielTp: 	 -0.1,
	cp_molecular_compression: 1.1,
};

const researchPos = {
	// Noeud Central
	researchCenter:				[5000,5000],
	industrialistion:			[5333,5000],
	phyContemporaine:			[4666,6000],
	thermodynamique:			[4666,4666],
	// Mise en orbite et propulsion
	prop_main:					[3333,4333],
	prop_vSolaire:				[3666,4900],
	prop_ions:					[4500,4100],
	prop_plasma:				[4000,3666],
	prop_vsl:					[7500,4000],
	prop_wd:					[8000,4000],
	prop_hyperespace:			[8500,4000],
	prop_manoeuvre:				[3000,4000],
	prop_advManoeuvre:			[2666,3666],
	prop_suprastability:		[8000,4500],
	// Construction et production
	cp_mecanisation:			[5666,5333],
	cp_tracteur:				[5666,4666],
	cp_materielTp:				[6000,5000],
	cp_dbRaffinage:				[5333,4600],
	cp_molecular_compression: 	[5333,5500],
	// Armes
	wep_railgun:				[4000,8500],
	wep_nuke:					[5000,9000],
	wep_laser:					[4000,7000],
	wep_plasma:					[3666,7333],
	// Shields & Defenses
	def_turret:					[6500,8500],
	def_shield_magnetic: 		[6000,8000],
	def_shield_projector: 		[5666,8333],
	def_shield_singularity:		[4500,8250],
	// Hangars
	hangarDouble:				[4666,3222],
	// Mines
	wep_mines:					[5500,7000],
	wep_mines_nuke:				[5666,7666],
	wep_mines_iem:				[5333,7333],
	// Figther
	figther_light_interceptor:	[7000,3000],
	figther_heavy_interceptor:	[7000,6000],
	figther_bomber: 			[7000,7500],
	// Battlecruiser
	battlecruiser_atrios: 		[6600,3500],
	// Cuirasse
	cuirasse_small: 			[6333,4150],
	// Corvet
	corvet_aegis: 				[6000,4500],
	// Carrier
	carrier_small: 				[5000,3500],
	carrier_medium: 			[5000,3000],
	// Colony ship
	colony_ship: 				[3000,5500],
	heavy_colony_ship:  		[2666,4900],
	// Satellites
	wep_sat_ag1:				[6000,6500],
	wep_sat_ag2:				[6000,7000],
	wep_sat_ag3:				[6000,7500],
	// Autres recherches spatiales
	misc_astronomie:			[5500,6000],
	misc_telemetrie:			[6000,6000],
	misc_advTelemetrie:			[6500,6000],
	misc_mecStellaire:			[3333,6666],
	misc_phySolaire:			[3666,5666],
	misc_phyQuantique:			[4000,6000],
	misc_calcGravit:			[5000,6666],
	misc_em:					[4800,7800],
	misc_colony:				[3000,6666],
};
const researchList = {
	// Noeud Central
	researchCenter: 			{ cost: 0, 		parents: [] },
	industrialistion: 			{ cost: 8, 		parents: [{ type: 'research', name: 'researchCenter' }] },
	phyContemporaine: 			{ cost: 20, 	parents: [{ type: 'research', name: 'researchCenter' }] },
	thermodynamique: 			{ cost: 13, 	parents: [{ type: 'research', name: 'researchCenter' }] },
	// Mise en orbite et propulsion
	prop_main: 					{ cost: 380, 	parents: [
		{ type: 'research', name: 'thermodynamique' },
		{ type: 'research', name: 'misc_mecStellaire' },
		{ type: 'building', id: 7, lvl: 3 },
	]},
	prop_vSolaire: 				{ cost: 2300, 	parents: [
		{ type: 'research', name: 'prop_main' },
		{ type: 'research', name: 'misc_phySolaire' },
	]},
	prop_ions: 					{ cost: 2000, 	parents: [
		{ type: 'research', name: 'prop_main' },
		{ type: 'research', name: 'misc_phyQuantique' },
	]},
	prop_plasma:				{ cost: 2500, 	parents: [
		{ type: 'research', name: 'prop_ions' },
	]},
	prop_vsl: 					{ cost: 15000, 	parents: [
		{ type: 'research', name: 'prop_ions' },
		{ type: 'research', name: 'misc_advTelemetrie' },
		{ type: 'building', id: 11, lvl: 5 },
		{ type: 'building', id: 8, lvl: 10 },
	]},
	prop_wd: 					{ cost: 24000, 	parents: [
		{ type: 'research', name: 'prop_vsl' },
		{ type: 'building', id: 11, lvl: 10 },
		{ type: 'planetCount', count: 2 },
	]},
	prop_hyperespace: 			{ cost: 35000, 	parents: [
		{ type: 'research', name: 'prop_wd' },
		{ type: 'building', id: 11, lvl: 20 },
		{ type: 'planetCount', count: 5 },
	]},
	prop_manoeuvre: 			{ cost: 450, 	parents: [{ type: 'research', name: 'prop_main' }] },
	prop_advManoeuvre: 			{ cost: 700, 	parents: [{ type: 'research', name: 'prop_manoeuvre' }] },
	prop_suprastability:		{ cost: 5000, 	parents: [{ type: 'research', name: 'prop_vsl' }] },
	// Construction et production
	cp_mecanisation: 			{ cost: 120, 	parents: [{ type: 'research', name: 'industrialistion' }] },
	cp_tracteur: 	 			{ cost: 150, 	parents: [
		{ type: 'research', name: 'industrialistion' },
		{ type: 'building', id: 9, lvl: 1 },
	]},
	cp_materielTp: 				{ cost: 350, 	parents: [
		{ type: 'research', name: 'cp_tracteur' },
		{ type: 'research', name: 'misc_advTelemetrie' },
	]},
	cp_dbRaffinage: 			{ cost: 100, 	parents: [{ type: 'research', name: 'industrialistion' }] },
	cp_molecular_compression:	{ cost: 180, 	parents: [
		{ type: 'research', name: 'industrialistion' },
		{ type: 'research', name: 'misc_phyQuantique' },
	]},
	// Armes
	wep_railgun:				{ cost: 50, 	parents: [{ type: 'research', name: 'phyContemporaine' }] },
	wep_nuke:					{ cost: 180, 	parents: [
		{ type: 'research', name: 'misc_phyQuantique' },
		{ type: 'building', id: 8, lvl: 5 },
	]},
	wep_laser:					{ cost: 260, 	parents: [
		{ type: 'research', name: 'wep_railgun' },
		{ type: 'research', name: 'misc_phyQuantique' },
	]},
	wep_plasma:					{ cost: 480, 	parents: [{ type: 'research', name: 'wep_laser' }] },
	// Shields & Defenses
	def_turret:					{ cost: 450, 	parents: [
		{ type: 'research', name: 'wep_railgun' },
		{ type: 'research', name: 'misc_advTelemetrie'},
	]},
	def_shield_magnetic:		{ cost: 750, 	parents: [
		{ type: 'research', name: 'def_turret' },
		{ type: 'research', name: 'misc_em' },
	]},
	def_shield_projector:		{ cost: 1150, 	parents: [{ type: 'research', name: 'def_shield_magnetic' }] },
	def_shield_singularity:		{ cost: 1550, 	parents: [
		{ type: 'research', name: 'def_shield_magnetic' },
		{ type: 'research', name: 'misc_calcGravit' },
	]},
	// Hangars
	hangarDouble: 				{ cost: 2200, 	parents: [{ type: 'research', name: 'carrier_small' }] },
	// Mines spatiales
	wep_mines: 					{ cost: 380, 	parents: [
		{ type: 'research', name: 'misc_calcGravit' },
		{ type: 'research', name: 'misc_telemetrie' },
		{ type: 'building', id: 7, lvl: 5 },
	]},
	wep_mines_nuke:				{ cost: 750, 	parents: [
		{ type: 'research', name: 'wep_mines' },
		{ type: 'research', name: 'wep_nuke' },
		{ type: 'building', id: 7, lvl: 10 },
	]},
	wep_mines_iem:				{ cost: 550, 	parents: [
		{ type: 'research', name: 'wep_mines' },
		{ type: 'research', name: 'misc_em' },
		{ type: 'building', id: 7, lvl: 15 },
	]},
	// Figther
	figther_light_interceptor: 	{ cost: 550, 	parents: [
		{ type: 'research', name: 'prop_main' },
		{ type: 'research', name: 'misc_advTelemetrie' },
	]},
	figther_heavy_interceptor: 	{ cost: 850, 	parents: [{ type: 'research', name: 'figther_light_interceptor' }] },
	figther_bomber: 			{ cost: 1320, 	parents: [
		{ type: 'research', name: 'figther_heavy_interceptor' },
		{ type: 'research', name: 'wep_nuke' },
	]},
	// Battlecruiser
	battlecruiser_atrios: 		{ cost: 2550, 	parents: [
		{ type: 'research', name: 'prop_ions' },
		{ type: 'research', name: 'misc_advTelemetrie' },
	]},
	// Cuirasse
	cuirasse_small: 			{ cost: 2580, 	parents: [
		{ type: 'research', name: 'prop_ions' },
		{ type: 'research', name: 'misc_advTelemetrie' },
	]},
	// Corvet
	corvet_aegis: 				{ cost: 680, 	parents: [
		{ type: 'research', name: 'prop_main' },
		{ type: 'research', name: 'misc_advTelemetrie' },
	]},
	// Carrier
	carrier_small: 				{ cost: 2580, 	parents: [
		{ type: 'research', name: 'figther_light_interceptor' },
		{ type: 'research', name: 'prop_ions' },
	]},
	carrier_medium: 			{ cost: 2850, 	parents: [{ type: 'research', name: 'carrier_small' }] },
	// Colony ship
	colony_ship:  				{ cost: 3500,	parents: [
		{ type: 'research', name: 'misc_colony' },
		{ type: 'research', name: 'cp_molecular_compression' },
		{ type: 'building', id: 11, lvl: 10 },
	]},
	heavy_colony_ship: 			{ cost: 8500, 	parents: [
		{ type: 'research', name: 'prop_vsl' },
		{ type: 'research', name: 'colony_ship' },
		{ type: 'building', id: 11, lvl: 15 },
	]},
	// Satellites
	wep_sat_ag1:				{ cost: 360, 	parents: [
		{ type: 'research', name: 'misc_calcGravit' },
		{ type: 'research', name: 'misc_telemetrie' },
		{ type: 'building', id: 7, lvl: 5 },
	]},
	wep_sat_ag2:				{ cost: 650, 	parents: [
		{ type: 'research', name: 'wep_sat_ag1' },
		{ type: 'research', name: 'misc_advTelemetrie' },
		{ type: 'building', id: 7, lvl: 10 },
	]},
	wep_sat_ag3:				{ cost: 1500, 	parents: [
		{ type: 'research', name: 'wep_sat_ag2' },
		{ type: 'building', id: 7, lvl: 15 },
	]},
	// Autres recherches
	misc_astronomie:			{ cost: 45, 	parents: [{ type: 'research', name: 'phyContemporaine' }] },
	misc_telemetrie: 			{ cost: 90, 	parents: [{ type: 'research', name: 'misc_astronomie' }] },
	misc_advTelemetrie:			{ cost: 320, 	parents: [
		{ type: 'research', name: 'misc_telemetrie' },
		{ type: 'building', id: 9, lvl: 1 },
	] },
	misc_mecStellaire: 			{ cost: 600, 	parents: [
		{ type: 'research', name: 'misc_calcGravit' },
	]},
	misc_phyQuantique: 			{ cost: 120, 	parents: [
		{ type: 'research', name: 'phyContemporaine' },
		{ type: 'building', id: 8, lvl: 3 },
	]},
	misc_phySolaire: 			{ cost: 280, 	parents: [{ type: 'research', name: 'misc_phyQuantique' }] },
	misc_calcGravit: 			{ cost: 240, 	parents: [{ type: 'research', name: 'misc_astronomie' }] },
	misc_em: 					{ cost: 110, 	parents: [{ type: 'research', name: 'phyContemporaine' }] },
	misc_colony: 				{ cost: 850,    parents: [{ type: 'research', name: 'misc_mecStellaire' }] },
};

/**
 * Units
 */
const hqFleetCount = [2,5,9,14,20,0]; // Last entry to prevent bugs
const shipResearchDependencies = {
	// Satelites shapes
	SHIP_SAT_AG1: 'wep_sat_ag1',
	SHIP_SAT_AG2: 'wep_sat_ag2',
	SHIP_SAT_AG3: 'wep_sat_ag3',

	// Mines
	SHIP_WEP_MINES: 'wep_mines',
	SHIP_WEP_MINES_IEM: 'wep_mines_iem',
	SHIP_WEP_MINES_NUKE: 'wep_mines_nuke',

	// Fighter
	SHIP_FIGHTER_SMALL: 'figther_light_interceptor',
	SHIP_FIGHTER_MEDIUM: 'figther_heavy_interceptor',

	// Battlecruiser
	SHIP_BATTLECRUISER_ATRIOS: 'battlecruiser_atrios',

	// Cuirasse
	SHIP_CUIRASSE_SMALL: 'cuirasse_small',

	// Corvet
	SHIP_CORVET_AEGIS: 'corvet_aegis',

	// Carrier
	SHIP_CARRIER_MEDIUM: 'carrier_medium',

	// Colony ships
	SHIP_COLONY: 'colony_ship',

	// Explosives
	explosive: 'wep_mines',
	nuke: 'wep_nuke',
	iem: 'wep_iem',
	antimater: 'wep_antimater',

	// Cannon
	railgun: 'wep_railgun',
	laser: 'wep_laser',
	plasma: 'wep_plasma',

	// Shields & Defences
	magnetic: 'def_shield_magnetic',
	turret: 'def_turret',
	singularity: 'def_shield_singularity',
	projector: 'def_shield_projector',

	// Cloak

	// Scanners

	// Hangar
	hangarDouble: 'hangarDouble',

	// Propulsion
	vsl: 'prop_vsl',
	wd: 'prop_wd',
	hyperespace: 'prop_hyperespace',

	ion: 'prop_ions',
	pplasma: 'prop_plasma',
	vsolaire: 'prop_vSolaire',
};
const unitTypes = [
	'SHIP_DEF',
	'SHIP_BATTLECRUISER',
	'SHIP_COLONY',
	'SHIP_CUIRASSE',
	'SHIP_FIGHTER',
	'SHIP_CORVET',
	'SHIP_CARRIER',
];

const shipShapesDetails = {
	SHIP_DEF: {
		SHIP_SAT_AG1: {
			svg: [
				// Aile Gauche
				['struct','rect', 75,175,250,150],
				['struct','line',125,185,125,315],
				['struct','line',175,185,175,315],
				['struct','line',225,185,225,315],
				['struct','line',275,185,275,315],
				// Centre
				['struct','rect',325,125,150,250],
				// Aile droite
				['struct','rect',475,175,250,150],
				['struct','line',525,185,525,315],
				['struct','line',575,185,575,315],
				['struct','line',625,185,625,315],
				['struct','line',675,185,675,315],
				// Contenu
				['cannon','rect',375,150, 50, 50, 'cannon_1'],
				['shield','rect',375,300, 50, 50, 'shield_1'],
			],
			content: {
				cannon: ['railgun','laser','plasma'],
				shield: ['none','magnetic','projector'],
			},
			partCount: 2,
		},
	},
	SHIP_BATTLECRUISER: {
		SHIP_BATTLECRUISER_ATRIOS: {
			svg: [
				// Structure
				['struct','path','M200',130,'Q',300,165,200,200,'L100',200,'L100',130,'L200',130], // Moteur gauche
				['struct','path','M400',200,'Q',600,250,400,300,'L100',300,'Q',20,250,100,200,'L400',200], // Centre
				['struct','path','M200',300,'Q',300,335,200,370,'L100',370,'L100',300,'L200',300], // Moteur droit
				// Armes
				['cannon','rect',410,225, 50, 50, 'cannon_1'],
				['rocketLauncher','rect'  ,325,225, 50, 50, 'rocket_1'],
				// Boucliers
				['shield','rect',200,225, 50, 50, 'shield_1'],
				// Propulseurs
				['sup_propulsion','rect'  , 80,225, 50, 50, 'prop_1'],
				['sub_propulsion','rect'  ,120,140, 50, 50, 'prop_2'],
				['sub_propulsion','rect'  ,120,310, 50, 50, 'prop_3'],
			],
			content: {
				cannon: ['railgun','laser','plasma'],
				rocketLauncher: ['explosive','nuke','antimater'],
				sub_propulsion: ['ion','pplasma'],
				sup_propulsion: ['vsl','wd'],
				shield: ['none','magnetic','turret'],
			},
			partCount: 6,
		},
	},
	SHIP_CUIRASSE: {
		SHIP_CUIRASSE_SMALL: {
			svg: [
				['struct','poly',100,100,50,200,50,300,100,400,225,300,500,250,225,200],
				['struct','poly',50,200,50,300,340,275,400,250,340,225],
				// Armes
				['cannon','rect',200,225, 50, 50,'cannon_1'],
				// Boucliers
				['shield','rect',130,225, 50, 50, 'shield_1'],
				['shield','rect',270,225, 50, 50, 'shield_2'],
				// Propulseurs
				['sup_propulsion','rect', 60,225, 50, 50, 'prop_1'],
				['sub_propulsion','rect', 90,140, 50, 50, 'prop_2'],
				['sub_propulsion','rect', 90,310, 50, 50, 'prop_3'],
			],
			content: {
				cannon: ['railgun','laser','plasma'],
				sub_propulsion: ['ion','pplasma'],
				sup_propulsion: ['vsl','wd'],
				shield: ['none','magnetic','turret','singularity','projector'],
			},
			partCount: 6,
		},
	},
	SHIP_FIGHTER: {
		SHIP_FIGHTER_SMALL: {
			svg: [
				['struct','poly',100,100,70,250,100,400,170,400,250,350,180,340,250,250,180,160,250,150,170,100], // Ailes
				['struct','poly',60,205,50,250,60,295,510,280,520,250,510,220], // Corps
				// Armes
				['cannon','rect'  ,455,225, 50, 50,'cannon_1'],
				// Propulseur
				['sub_propulsion','rect'  ,70,225, 50, 50,'prop_1'],
			],
			content: {
				cannon: ['railgun','laser','plasma'],
				sub_propulsion: ['vsolaire','ion'],
			},
			partCount: 2,
		},
		SHIP_FIGHTER_MEDIUM: {
			svg: [
				['struct','path','M50',300,'Q',300,-100,550,300], // Arriere
				['struct','path','M260',228,'Q',300,130,340,228], // Avant
				['struct','path','M50',300,'Q',300,150,550,300], // Cockpit
				['struct','poly',170,300,180,300,185,210,165,210], // Arme 1
				['struct','poly',420,300,430,300,435,210,415,210], // Arme 2
				// Armes
				['cannon','rect'  ,150,180, 50, 50,'cannon_1'],
				['cannon','rect'  ,400,180, 50, 50,'cannon_2'],
				// Propulseur
				['sub_propulsion','rect'  ,275,115, 50, 50,'prop_1'],
			],
			content: {
				cannon: ['railgun','laser','plasma'],
				sub_propulsion: ['vsolaire','ion'],
			},
			partCount: 3,
		},
	},
	SHIP_CORVET: {
		SHIP_CORVET_AEGIS: {
			svg: [
				['struct', 'poly', 20,150,50,210,170,210,170,150 ], // Moteur 1
				['struct', 'poly', 50,290,20,350,170,350,170,290 ], // Moteur 2
				['struct','circle',250,250,150], // Corps
				['struct','path'  ,'M385',185,'Q',300,250,385,315], // Cockpit
				// Cloak
				['cloak','rect',250,120,50,50,'cloak_1'],
				// Scanner
				['scanner','rect',250,330,50,50,'scanner_1'],
				// Propulseurs
				['sub_propulsion','rect'  , 55,295, 50, 50,'prop_1'],
				['sub_propulsion','rect'  , 55,155, 50, 50,'prop_2'],
				['sup_propulsion','rect'  ,110,225, 50, 50,'prop_3'],
			],
			content: {
				cloak: ['none'],
				scanner: ['none'],
				sub_propulsion: ['vsolaire','ion','pplasma'],
				sup_propulsion: ['none','vsl','wd'],
			},
			partCount: 5,
		},
	},
	SHIP_CARRIER: {
		SHIP_CARRIER_MEDIUM: {
			svg: [
				['struct','path','M400',200,'Q',500,250,400,300,'L50',300,'Q',0,250,50,200,'L400',200], // Centre
				['struct','poly',60,200,60,130,220,130,240,200], // Aile gauche avant
				['struct','poly',60,200,60,90,130,90,150,200], // Aile gauche arriere
				['struct','poly',60,300,60,370,220,370,240,300], // Aile droite avant
				['struct','poly',60,300,60,410,130,410,150,300], // Aile droite arriere
				// Hangars
				['hangar','rect', 70,110,50,50,'hangar_1'], // Aile gauche arriere
				['hangar','rect',160,140,50,50,'hangar_2'], // Aile gauche avant
				['hangar','rect', 70,340,50,50,'hangar_3'], // Aile droite arriere
				['hangar','rect',160,310,50,50,'hangar_4'], // Aile droite avant
				// Boucliers
				['shield','rect',250,225, 50, 50,'shield_1'],
				// Propulseurs
				['sub_propulsion','rect'  , 100,225, 50, 50,'prop_1'],
				['sup_propulsion','rect'  , 40,225, 50, 50,'prop_2'],
			],
			content: {
				hangar: ['none','hangarSimple','hangarDouble'],
				sub_propulsion: ['ion','pplasma'],
				sup_propulsion: ['vsl','wd','hyperespace'],
				shield: ['none','magnetic','turret'],
			},
			partCount: 7,
		},
	},
	SHIP_COLONY: {
		SHIP_COLONY: {
			svg: [
				['struct','path','m 305.55765,95.391223 c 12.00793,20.734877 12.00777,37.482067 -1.6e-4,59.213837 l -72.17261,4.93449 -67.92718,-4.93449 v -19.73792 l 42.58812,-1.97383 V 117.10293 L 165.4577,115.12914 V 95.391223 l 67.92718,-4.93449 z'], // Moteur Arriere gauche
				['struct','path','m 217.22906,159.44692 -39.61156,30.01299 v 70.03045 l 39.61156,30.013 h 237.66931 l 16.50478,-10.00438 V 169.4513 c -5.50159,-3.33483 -11.00319,-6.66959 -16.50478,-10.00438 H 217.22906'], // Structure principale
				['struct','path','m 305.55766,295.39287 c 12.00792,20.73489 12.00776,37.48204 -1.7e-4,59.21384 l -72.17261,4.93445 -67.92718,-4.93445 v -19.73796 l 42.58812,-1.97378 v -15.79039 l -42.58812,-1.97382 v -19.73789 l 67.92718,-4.93453 z'], // Moteur Arriere droit
				['struct','path','m 505.55768,295.39287 c 12.00791,20.73489 12.00776,37.48204 -1.9e-4,59.21384 l -72.1726,4.93445 -67.92719,-4.93445 v -19.73796 l 42.58813,-1.97378 v -15.79039 l -42.58813,-1.97382 v -19.73789 l 67.92719,-4.93453 z'], // Moteur Avant droit
				['struct','path','m 505.55768,95.391263 c 12.00791,20.734877 12.00776,37.482067 -1.9e-4,59.213837 l -72.1726,4.93449 -67.92719,-4.93449 v -19.73793 l 42.58813,-1.97382 V 117.10297 L 365.4577,115.12918 V 95.391263 l 67.92719,-4.93449 z'], // Moteur Avant gauche
				// Cockpit (structure)
				['struct','path','m 471.40099,179.90785 7.4514,25.27136 h 7.45167 l -2.3e-4,-34.68308 h 49.62172 l 60.00177,9.41172 24.50234,29.73038 v 29.73047 l -24.50234,29.73039 -60.00177,10.40478 h -49.62172 l 2.3e-4,-34.68517 h -7.45167 l -7.4514,24.28039'],
				['struct','path','m 620,223 h 60'],
				['struct','path','m 620,230 h 90'],
				['struct','path','m 535.92555,170.49613 9.68309,34.66815 30.17831,0 11.3559,9.83572 0,20 -11.3559,9.56023 -30.17831,0 -9.68309,34.94364'],
				// Boucliers
				['shield','rect',305,200, 50, 50,'shield_1'],
				// Propulseurs
				['sup_propulsion','rect'  , 220,100, 50, 50,'prop_1'], // Arriere droit
				['sup_propulsion','rect'  , 220,300, 50, 50,'prop_2'], // Arriere gauche
				['sub_propulsion','rect'  , 420,300, 50, 50,'prop_3'], // Avant gauche
				['sub_propulsion','rect'  , 420,100, 50, 50,'prop_4'], // Avant droit
			],
			content: {
				sub_propulsion: ['ion','pplasma'],
				sup_propulsion: ['vsl','wd','hyperespace'],
				shield: ['none','magnetic','turret'],
			},
			partCount: 5,
		},
	}
};

const SHIP_SHAPE_SVG_WIDTH = 800;
const SHIP_SHAPE_SVG_HEIGHT = 450;

const shipCosts = { // [Al,Fe,Ti,Cu,Time,Population]
	/**
	 * Ship shapes
	 */

	// Defenses
	SHIP_WEP_MINES: 			[  3, 15,  5,  4,0.08,   0],
	SHIP_WEP_MINES_NUKE: 		[  8, 30, 12, 10,0.15,   0],
	SHIP_WEP_MINES_IEM: 		[ 15, 35,  6, 12,0.20,   0],
	SHIP_WEP_MINES_AM: 			[  6, 35,  8,  7,0.12,   0],
	// Satellites
	SHIP_SAT_AG1: 				[ 10, 15, 35, 15,0.25,   0],
	SHIP_SAT_AG2: 				[ 15, 20, 50, 23,0.37,   0],
	SHIP_SAT_AG3: 				[ 30, 35, 60, 36,0.70,   0],
	// Battlecruisers
	SHIP_BATTLECRUISER_ATRIOS: 	[260,250,120, 60,1.12, 160],
	// Cruisaders
	SHIP_CUIRASSE_SMALL: 		[330,350,180, 95,1.45, 220],
	// Fighters
	SHIP_FIGHTER_SMALL: 		[ 50, 25, 40, 18, 0.35,   5],
	SHIP_FIGHTER_MEDIUM: 		[ 70, 35, 60, 25, 0.52,  10],
	SHIP_FIGHTER_BOMBER: 		[ 95, 60,100, 40, 0.78,  20],
	// Corvets
	SHIP_CORVET_AEGIS: 			[110, 18, 85, 35, 0.62,  40],
	// Carriers
	SHIP_CARRIER_SMALL: 		[405,300,140, 75,1.25, 920],
	SHIP_CARRIER_MEDIUM: 		[510,420,190, 95,1.65,1200],
	// Colony ship
	SHIP_COLONY: 				[290,300,150, 80,   4, 500],

	/**
	 * Ship parts
	 */
	// Boom
	explosive: 		[  1, 10,  3,  3,0.05   ,0],
	nuke: 			[  3, 12,  5,  4,0.08,   0],
	iem: 			[ 10, 15,  4, 10,0.19,   0],
	antimater: 		[  3, 15,  6,  5,0.10,   0],
	// Cannons
	railgun: 		[  4,  1,  8,  5,0.10,   1],
	laser: 			[  8,  7,  3,  6,0.12,   1],
	plasma: 		[ 15, 20,  7,  8,0.15,   1],
	// Propulsions subluminiques
	ion: 			[ 80, 60, 40,  5,0.25,   0],
	pplasma: 		[130, 90, 60, 10,0.40,   0],
	vsolaire: 		[120, 45, 35, 15,0.30,   0],
	// Propulsions supraluminiques
	vsl: 			[ 65,120, 60, 20,0.55,  80],
	wd: 			[ 80,145, 60, 25,0.65, 120],
	hyperespace: 	[100,160,115, 30,0.75, 160],
	// Defences
	magnetic: 		[ 20, 50,  5, 15,0.20,   1],
	turret: 		[ 15, 30,  3,  5,0.15,   1],
	singularity: 	[ 20, 45,  8, 20,0.45,   1],
	projector: 		[ 22, 65,  7, 20,0.30,   1],
	// Hangars
	hangarSimple: 	[  5, 30, 18,  5,0.50,   5],
	hangarDouble: 	[ 12, 45, 25,  7,0.80,  10],

	none: [0,0,0,0,0,0],
};

const GALACTIC_PARSEC_SIZE = 30674;
const SYSTEM_AU_SIZE = 39.445;
const shipPartsSpeed = {
	// Propulsions subluminiques
	ion: 			[ -0.000046, 0.0096, 0],
	pplasma: 		[ -0.000045, 0.0090, 0],
	vsolaire: 		[ -0.000040, 0.0080, 0],
	// Propulsions supraluminiques
	vsl: 			[    -0.027,   7.23, 0.001],
	wd: 			[    -0.016,   5.13, 0.001],
	hyperespace: 	[    -0.014,   3.68, 0.001],

	noPartResearched: [0,0,0],
};
const fuelCost = {
	// Propulsions subluminiques
	ion: 			10682,
	pplasma: 		 7244,
	vsolaire: 		    0,
	// Propulsions supraluminiques
	vsl: 			32761,
	wd: 			29012,
	hyperespace: 	25492,
};

const fighterWeight = {
	SHIP_FIGHTER_SMALL: 1,
	SHIP_FIGHTER_MEDIUM: 2,
	SHIP_FIGHTER_BOMBER: 2,
};

const fighterMult = {
	SHIP_FIGHTER_SMALL: 0.15,
	SHIP_FIGHTER_MEDIUM: 0.3,
	SHIP_FIGHTER_BOMBER: 0.3,
};

const hangarSize = {
	hangarSimple: 40,
	hangarDouble: 75,
};

const hangarMiss = {
	hangarSimple: -0.01,
	hangarDouble: -0.03,
};

const TACTIC_MAX_ORDERS = 50;

if(!cdnURL) {
	var cdnURL = 'https://cdn.galactae.eu/game/';
}

const imgCache = [
	// Misc UI
	cdnURL + 'img/ui/hud-top.png',
	cdnURL + 'img/ui/hud-bottom-left.png',
	cdnURL + 'img/ui/hud-bottom-right.png',
	cdnURL + 'img/ui/hud-chat.png',
	cdnURL + 'img/ui/chat-voice.png',
	cdnURL + 'img/ui/build-panel.png',
	cdnURL + 'img/ui/window.png',

	cdnURL + 'img/favicon.png',

	// HUD TOP
	cdnURL + 'img/ui/population.png',
	cdnURL + 'img/ui/moral.png',
	cdnURL + 'img/ui/money.png',
	cdnURL + 'img/ui/minerals.png',

	// HUD BOTTOM
	cdnURL + 'img/ui/fleets.png',
];

// Buildings
for(let i=0; i<buildingsNames.length; i++) {
	// Panel picture
	imgCache.push(cdnURL + 'img/buildings/desc/' + buildingsNames[i] + '.jpg');
}

// Planets
const backPlanetList = [0];
for(const i in backPlanetList) {
	imgCache.push(cdnURL + 'img/planets/back/' + backPlanetList[i] + '.png');
}
const planetList = [0,1,2,3,4,5,6,7,8,9,
	//101,102,103,104,105,106,107,108,109,110,111,112,113,
	//501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,
	///*901,*/42,
	//1000,1001,1002,//1003,1004,1005,1006,1007,1008,
];
for(const i in planetList) {
	imgCache.push(cdnURL + 'img/planets/front/' + planetList[i] + '.jpg');
	imgCache.push(cdnURL + 'img/planets/halo/' + planetList[i] + '.png');
}

const neededCache = [
	cdnURL + 'css/style.css',

	cdnURL + 'js/cookies.js',
	cdnURL + 'js/readyEvent.js',
	cdnURL + 'js/remove-polyfill.js',
	cdnURL + 'js/details-polyfill.js',
	cdnURL + 'js/socket.min.js',
	cdnURL + 'js/css_globe_perspectivetransform.js',

	cdnURL + 'js/_shared/Buildings.js',
	cdnURL + 'js/_shared/Conquest.js',
	cdnURL + 'js/_shared/DependencyEngine.js',
	cdnURL + 'js/_shared/Fleets.js',
	cdnURL + 'js/_shared/GameMap.js',
	cdnURL + 'js/_shared/Reports.js',
	cdnURL + 'js/_shared/Research.js',
	cdnURL + 'js/_shared/Resources.js',
	cdnURL + 'js/_shared/Tutorials.js',
	cdnURL + 'js/_shared/Units.js',

	cdnURL + 'js/Alliances.js',
	cdnURL + 'js/Buildings.js',
	cdnURL + 'js/calcConstants.js',
	cdnURL + 'js/chat.js',
	cdnURL + 'js/Conquest.js',
	cdnURL + 'js/DependencyEngine.js',
	cdnURL + 'js/Fleets.js',
	cdnURL + 'js/GameMap.js',
	cdnURL + 'js/InfluenceZones.js',
	cdnURL + 'js/map.js',
	cdnURL + 'js/misc.js',
	cdnURL + 'js/notifications.js',
	cdnURL + 'js/planetback.js',
	cdnURL + 'js/planetUI.js',
	cdnURL + 'js/research.js',
	cdnURL + 'js/Reports.js',
	cdnURL + 'js/Resources.js',
	cdnURL + 'js/settings.js',
	cdnURL + 'js/tactics.js',
	cdnURL + 'js/trade.js',
	cdnURL + 'js/Tutorials.js',
	cdnURL + 'js/ui.js',
	cdnURL + 'js/units.js',
	cdnURL + 'js/websockets.js',

	cdnURL + 'js/load.js',

	...imgCache,

	cdnURL + 'snd/music/music01.ogg',
];

/**
 * Fleets move type
 */
const FLEET_MOVE_TYPE = {
	DEFEND: 0,
	ATTACK: 1,
	MOVE: 2,
	SPY: 3,
};

/**
 * Tutorials
 */
const tutorialsList = [
	'welcome',
	'energy',
	'inhabitants',
	'resources',
	'research',
	'endFirstPart',
	'unitsCreate',
	'unitsBuild',
	// 'buyAndSell',
	'interplanetaryFlight',
	'interstellarFlight',
	//'spy',
	'battle',
	// 'joinAlly',
	// 'quests',
	// 'secondPlanet',
];
const tutorialsDependancies = {
	'welcome': [],
	'energy':
		[{
			type: 'tutorial',
			name: 'welcome',
		}],
	'inhabitants':
		[{
			type: 'tutorial',
			name: 'energy',
		}],
	'resources':
		[{
			type: 'tutorial',
			name: 'inhabitants',
		}],
	'research':
		[{
			type: 'tutorial',
			name: 'resources',
		}],
	'endFirstPart':
		[{
			type: 'tutorial',
			name: 'research',
		}],
	'unitsCreate':[
		{
			type: 'atLeastOne',
			name: 'researchList',
			subDependencies: [
				{ type: 'research', name: 'figther_light_interceptor' },
				{ type: 'research', name: 'figther_heavy_interceptor' },
				{ type: 'research', name: 'figther_bomber' },

				{ type: 'research', name: 'battlecruiser_atrios' },
				{ type: 'research', name: 'cuirasse_small' },

				{ type: 'research', name: 'corvet_aegis' },

				{ type: 'research', name: 'carrier_small' },
				{ type: 'research', name: 'carrier_medium' },

				{ type: 'research', name: 'wep_sat_ag1' },
				{ type: 'research', name: 'wep_sat_ag2' },
				{ type: 'research', name: 'wep_sat_ag3' },
			],
		},
	],
	'unitsBuild':
		[{ //@TODO: prendre en compte les mines
			type: 'tutorial',
			name: 'unitsCreate',
		}],
	// 'buyAndSell':[],
	'interplanetaryFlight':[
		{
			type: 'tutorial',
			name: 'unitsBuild',
		},
		{
			type: 'atLeastOne',
			name: 'researchList',
			subDependencies: [
				{ type: 'research', name: 'prop_vSolaire' },
				{ type: 'research', name: 'prop_ions' },
			],
		},
	],
	'interstellarFlight':[
		{
			type: 'tutorial',
			name: 'unitsBuild',
		},
		{
			type: 'research',
			name: 'prop_vsl',
		},
	],
	/*'spy':
		[{ //@TODO: prendre en compte corvette
			type: 'tutorial',
			name: 'unitsBuild',
		}],*/
	'battle':
		[{
			type: 'tutorial',
			name: 'interplanetaryFlight',
		}],
	// 'joinAlly':[],
	// 'quests':[],
	// 'secondPlanet':[],
};
const tutorialObjectives = {
	'welcome': [],
	'energy':
	[{
		type: 'building',
		id: 4,
		lvl: 2,
	}],
	'inhabitants':
	[{
		type: 'building',
		id: 2,
		lvl: 2,
	},{
		type: 'building',
		id: 3,
		lvl: 2,
	}],
	'resources':
	[{
		type: 'building',
		id: 0,
		lvl: 2,
	},{
		type: 'building',
		id: 1,
		lvl: 2,
	}],
	'research':
	[{
		type: 'atLeastOne',
		name: 'researchList',
		subDependencies: [
			{ type: 'research', name: 'thermodynamique' },
			{ type: 'research', name: 'phyContemporaine' },
			{ type: 'research', name: 'industrialistion' },
		],
	}],
	'endFirstPart': [],
	'unitsCreate': [{
		type: 'unitModel',
		count: 1,
	}],
	'unitsBuild': [{
		type: 'unitBuild',
		count: 5,
	}],
	// 'buyAndSell': [],
	'interplanetaryFlight': [{
		type: 'move',
		moveType: FLEET_MOVE_TYPE.MOVE,
		location: 'all',
		count: 1,
	}],
	'interstellarFlight': [{
		type: 'move',
		moveType: FLEET_MOVE_TYPE.MOVE,
		location: 'outerSystem',
		count: 1,
	}],
	//'spy': [],
	'battle': [{
		type: 'move',
		moveType: FLEET_MOVE_TYPE.ATTACK,
		location: 'all',
		count: 1,
	}],
	// 'joinAlly': [],
	// 'quests': [],
	// 'secondPlanet': [],
};