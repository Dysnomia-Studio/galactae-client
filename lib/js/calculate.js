/* GetBetterUnit
Reduire un nombre
INPUT: nmbr ( int )
OUTPUT: reduced number ( string ) */
function GetBetterUnit(nmbr) {
	var units = ["","K","M","G","T"];
	var unitId = 0;
	var newnbr = nmbr;

	while(newnbr>=1000) {
		newnbr = ( newnbr / 1000 );
		unitId++;
	}
	if(newnbr<0) { newnbr=0; }
	if(unitId==0) {
	var end = Math.round(newnbr);
	} else { 
	var end = (Math.round(newnbr*10)/10)+units[unitId];
	}
	return end
}

/* getStringTime
Recuperer le temps en version lisible par l'humain
INPUT: temps en heures (int)
OUTPUT: Temps lisible (string)
*/
function getStringTime(number) {
	var hours = (number<10)?"0"+Math.floor(number):Math.floor(number);
	var min = ((number*60)%60<10)?"0"+Math.floor((number*60)%60):Math.floor((number*60)%60);
	var sec = ((number*3600)%60<10)?"0"+Math.floor((number*3600)%60):Math.floor((number*3600)%60);	
	return hours+":"+min+":"+sec;
}

/* rand and token
Used to generate a random token for socket communications
*/
function rand() {
return Math.random().toString(36).substr(2); // remove `0.`
};

function token() {
    return rand() + rand(); // to make it longer
};

/* GetBuildCost
Retourner les coûts de construction et d'utilisation du bâtiment.
INPUT: build (int), level(int)
OUTPUT: cost(array)
*/
function GetBuildCost(build,level) {

var cost;

switch(build) {
		case 0: //Quarry
			cost = {
				aluminium: 0,
				iron: Math.round(4*Math.exp(0.3214*level)),
				copper: 0,
				titanium:  Math.round(Math.pow(0.75*level,2) + 6.5*level - 2),
				time: getStringTime(Math.pow(0.037*level,2) + 0.0255*level - 0.05),
				energy: Math.round(65.2*Math.exp(0.4314*level)),
				energy_difference: (Math.round(65.2*Math.exp(0.4314*level))-Math.round(65.2*Math.exp(0.4314*(level-1))))
			}
		break;
		case 1: //Metallurgie
			cost = {
				aluminium: 0,
				iron: Math.round(Math.pow(2*level,2) - 2*level + 2), //Structure
				copper: 0,
				titanium: Math.round(4.3*Math.pow(level,2) + 6*level + 6),
				time: getStringTime(0.0122*Math.exp(0.3676*level)),
				energy: Math.round(360*Math.pow(level,2) -1000*level + 700),
				energy_difference: Math.round(360*Math.pow(level,2) -1000*level + 700)-Math.round(360*Math.pow(level-1,2) -1000*(level-1) + 700)
			}
		break;
		case 2: //Living
			cost = {
				aluminium: 0,
				iron: Math.round(1.3*Math.pow(level,2) + 13*level - 10),
				copper: Math.round(0.4*Math.pow(level,2) + 9*level - 5),
				titanium: 0,
				time: getStringTime(0.03*Math.exp(0.3*level)),
				energy: Math.round(400*Math.pow(level,2) - 1100*level + 760),
				energy_difference: Math.round(400*Math.pow(level,2) - 1100*level + 760)-Math.round(400*Math.pow(level-1,2) - 1100*(level-1) + 760)
			}
		break;
		case 3: //Serres
			cost = {
				aluminium: Math.round(0.4*Math.pow(level,2) + 8*level - 3.8), //Structure
				iron: 0, 
				copper: 0,
				titanium: Math.round(1.2*Math.pow(level,2) + 12*level - 3.8),
				time: getStringTime(0.035*Math.exp(0.28*level)),
				energy: Math.round(5*level),
				energy_difference: Math.round(5*level)-Math.round(5*(level-1))
			}
		break;
		case 4: //Solar panel
			cost = {
				aluminium: Math.round(Math.pow(0.1*level,2) + 3*level),
				iron: Math.round(Math.pow(0.25*level,2) + 2*level + 3),
				copper: Math.round(Math.pow(0.7*level,2) + 7*level - 3),
				titanium: 0,
				time: getStringTime(0.0132*Math.exp(0.3476*level)),
				energy: 0,
				energy_difference: 0,
			}
		break;
		case 5: //Warehouse
			cost = {
				aluminium: 0,
				iron: Math.round(Math.pow(2*level,2) - 2*level + 2), //Structure
				copper: 0,
				titanium: Math.round(Math.pow(4.1*level,2) + 6.07*level + 6.5), //Outside
				time: getStringTime(0.0122*Math.exp(0.3676*level)),
				energy: Math.round(2.5*level), //Energy is just for lights :D
				energy_difference: Math.round(2.5*level)-Math.round(2.5*(level-1)),
			}
		break;
		case 6: //Tank
			cost = {
				aluminium: 0,
				iron: Math.round(Math.pow(2.2*level,2) + level + 2),
				copper: 0,
				titanium: Math.round(Math.pow(3.15*level,2) + 7.1*level - 6.5),
				time: getStringTime(0.0172*Math.exp(0.33*level)),
				energy: Math.round(2*level), //Energy is just for lights :D
				energy_difference: Math.round(2.5*level)-Math.round(2.5*(level-1)),
			}
		break;
		case 7: //Shipyard
			cost = {
				aluminium: 0,
				iron: Math.round(4*Math.exp(0.3214*level)),
				copper: Math.round(Math.pow(level,2) + 3*level + 3),
				titanium: 0,
				time: getStringTime(Math.pow(0.04*level,2) + 0.08*level - 0.1),
				energy: Math.round(4*level), //Energy is just for lights :D
				energy_difference: Math.round(2.5*level)-Math.round(2.5*(level-1)),
			}
		break;
		case 8: //launchpad
			cost = {
				aluminium: 0,
				iron: 1,
				copper: Math.round(0.25*Math.pow(level,2) + 4*level),
				titanium: 0,
				time: getStringTime(0.032*Math.exp(0.345*level)),
				energy: Math.round(14.975*Math.pow(level,3.1193)),
				energy_difference: Math.round(14.975*Math.pow(level,3.1193))-Math.round(14.975*Math.pow(level-1,3.1193)),
			}
		break;
		default:
			cost = {
				aluminium: 0,
				iron: 0,
				copper: 0,
				titanium: 0,
				time: getStringTime(0),
				energy: 0,
				energy_difference: 0,
			}
	}
	return cost
}

function CanvasCalcAngle(i) {
	var time = new Date();

	return i*0.87*Math.PI //Decalage
		 + (2*Math.PI)/(60/(14-2.5*i))*time.getMinutes()
		 + (2*Math.PI)/(60*60/(14-2.5*i))*time.getSeconds()
		 + (2*Math.PI)/(60*1000*60/(14-2.5*i))*time.getMilliseconds();
}