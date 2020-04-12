<script type="text/javascript">
var translate = translate || {};

translate['research'] = {
	// Noeud Central
	researchCenter:		{ name: 'Centre de recherches', desc: 'Les centres de recherches travaillent ensemble ou seul afin de débloquer des techniques ou des technologies bénéfiques à la nation.' },
	industrialistion:	{ name: 'Industrialisation', desc: 'La partie de l\'arbre de recherche concernant la productivité et la construction.' },
	phyContemporaine:	{ name: 'Physique Contemporaine', desc: 'Bases de la physique afin d\'apprehender tout les autres domaines de la physique et de l\'astrophysique' },
	thermodynamique:	{ name: 'Thermodynamique', desc: 'Science des chaleurs permettant de travailler par la suite notamment sur des systèmes de propulsion.' },
	// Mise en orbite et propulsion
	prop_main:			{ name: 'Propulsion', desc: 'Permet de debloquer les recherches concernant le déplacements interplanétaires et interstellaires.' },
	prop_vSolaire:		{ name: 'Voile solaire', desc: 'Propulsion lente pour vaisseaux légers ne necessitant pas de carburant.' },
	prop_ions:			{ name: 'Moteurs a ions', desc: 'Moteur qui produit sa force de propulsion en accélérant des ions à très haute vitesse. C\'est un moteur interplanétaire à haut rendement.' },
	prop_plasma: 		{ name: 'Moteurs à Plasma', desc: '' },
	prop_vsl:			{ name: 'Vitesse Supraluminique (VSL)', desc: 'Moteurs génerant une poussée permettant une vitesse supérieure à celle de la lumière pour les voyages interstéllaires.' },
	prop_wd: 			{ name: 'Generateur de saut (Warp Drive)', desc: ''},
	prop_hyperespace:	{ name: 'Hyperespace', desc: '' },
	prop_manoeuvre:		{ name: 'Propulseurs de manoeuvre', desc: 'Ces propulseurs permettent d\'eviter les mines et les missiles (2% de chance d\'evitement)' },
	prop_advManoeuvre:	{ name: 'Propulseur de manoeuvres avancés', desc: 'Ces propulseurs permettent d\'eviter les mines et les missiles (5% de chance d\'evitement)' },
	prop_suprastability:{ name: 'Stabilité des moteurs interstellaires', desc: 'Augmente de 50% la precision du calcul de l\'heure d\'arrivée estimée d\'une flotte.' },
	// Construction et production
	cp_mecanisation:	{ name: 'Mecanisation', desc: '-5% de temps de construction unités' },
	cp_tracteur:		{ name: 'Rayon Tracteur', desc: '-5% de temps de construction pour unités et bâtments spatiaux' },
	cp_materielTp:		{ name: 'Teleportation de materiel', desc: '-10% de temps de construction pour unités et bâtments spatiaux' },
	cp_dbRaffinage:		{ name: 'Double raffinage', desc: 'Deux fois plus de chance de trouver des minerais rares.' },
	cp_molecular_compression: { name: 'Compression moleculaire', desc: 'Augmente sensiblement la capacité de stockage des solides et gaz.' },
	// Armes
	wep_railgun:		{ name: 'Canons éléctriques', desc: 'Aussi connu sous le nom de railgun, accélère les projectiles par une force électromagnetique.' },
	wep_nuke:			{ name: 'Armes nucléaires', desc: 'Arme de destruction massive radioactive.' },
	wep_laser:			{ name: 'Armes lasers', desc: 'Armes à laser' },
	wep_plasma:			{ name: 'Armes plasma', desc: 'Armes à projectiles à très haute température' },
	// Shields & Defenses
	def_turret:			{ name: 'Tourelles anti-projectiles', desc: 'Tourelles utilisées afin d\'intercepter les projectiles explosifs' },
	def_shield_magnetic:{ name: 'Bouclier magnetique', desc: 'Bouclier utilisant la force electromagnetique pour repousser les projectiles' },
	def_shield_projector:{ name: 'Projecteur de bouclier', desc: 'Bouclier magnetique reporté sur un vaisseau allié' },
	def_shield_singularity:{ name: 'Systeme à Singularité', desc: 'Système permettant d\'attirer les projectiles légers visant des vaisseaux alliés vers le vaisseau courant' },
	// Hangar
	hangarDouble:		{ name: 'Hangar Double', desc: 'Le hangar double permet de stocker près de deux fois plus de chasseurs qu\'un hangar normal.' },
	// Mines
	wep_mines:			{ name: 'Mines', desc: 'Explosifs conventionnels spatiaux par détection de proximité.' },
	wep_mines_nuke:		{ name: 'Mines nucléaires', desc: 'Explosifs nucléaires spatiaux par détection de proximité.' },
	wep_mines_iem:		{ name: 'Mines à impulsions électromagnetiques (IEM)', desc: 'Explosifs génerant des impulsions électromagnetiques afin de brouiller les systèmes ennemis par détection de proximité.' },
	// Figther
	figther_light_interceptor: { name: 'Intercepteur Léger', desc: '' },
	figther_heavy_interceptor: { name: 'Intercepteur Lourd', desc: '' },
	figther_bomber: 	{ name: 'Bombardier', desc: '' },
	// Battlecruiser
	battlecruiser_atrios: { name: 'Croiseur - Classe Atrios', desc: '' },
	// Cuirasse
	cuirasse_small: 	{ name: 'Petit Cuirassé', desc: '' },
	// Corvet
	corvet_aegis: 		{ name: 'Corvette - Classe Aegis', desc: '' },
	// Carrier
	carrier_small: 		{ name: 'Petit Transporteur', desc: '' },
	carrier_medium: 	{ name: 'Transporteur Moyen', desc: '' },
	// Colony ship
	colony_ship:  		{ name: 'Vaisseau de colonisation', desc: '' },
	heavy_colony_ship: 	{ name: 'Vaisseau de colonisation lourd', desc: '' },
	// Satellites
	wep_sat_ag1:		{ name: 'Satellites AG-I', desc: '' },
	wep_sat_ag2:		{ name: 'Satellites AG-II', desc: '' },
	wep_sat_ag3:		{ name: 'Satellites AG-III', desc: '' },
	// Autres recherches spatiales
	misc_astronomie:	{ name: 'Astronomie', desc: '' },
	misc_telemetrie:	{ name: 'Telemetrie', desc: ''},
	misc_advTelemetrie:	{ name: 'Telemetrie Avancée', desc: ''},
	misc_mecStellaire:	{ name: 'Mecanique Stellaire', desc: ''},
	misc_phySolaire:	{ name: 'Physique stellaire', desc: ''},
	misc_phyQuantique:	{ name: 'Physique Quantique', desc: ''},
	misc_calcGravit:	{ name: 'Calculs Gravitationels', desc: ''},
	misc_em:			{ name: 'Electromagnetisme', desc: ''},
	misc_colony:		{ name: 'Colonisation', desc:''},
	// Messages
	tech_owned: 'Technologie possédée',
	ongoing: 	'Recherche en cours ...',
	search: 	'Rechercher',
	current_research: 'Recherche en cours:',
	go_to_research: 'Acceder aux recherches',
};
</script>