var connectTimeout = -1;

function kick(msg,time=3000,canBeCanceled=false) {
	if(msg!="") {
		chat.sm(msg);
		ui.drawMessage(msg);
	}
	
	connectTimeout = setTimeout(function() {
		window.location.href = "https://galactae.elanis.eu/portal";
	},time);

	if(!canBeCanceled) {
		connectTimeout = -1;
	}
}

//get "GET"
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* GetBetterUnit
Reduire un nombre
INPUT: nmbr ( int )
OUTPUT: reduced number ( string ) */
function GetBetterUnit(nmbr,unit="",max=0) {
	var units = ["","K","M","G","T","P","E","Z","Y"];
	var unitId = 0;
	var newnbr = nmbr;
	var signe = false;

	if(newnbr<0) {
		newnbr = -newnbr
		var signe = true;
	}

	while(newnbr>=1000) {
		newnbr = ( newnbr / 1000 );
		unitId++;
	}
	if(newnbr<0) { newnbr=0; }
	if(signe) {
		newnbr = -newnbr;
	}
	if(unitId==0) {
	var end = Math.round(newnbr)+unit;
	} else { 
	var end = (Math.round(newnbr*10)/10)+units[unitId]+unit;
	};
	if((nmbr>=max && max!=0) || nmbr<=0) {
		end = "<span class=\"max-value\">" + end + "</span>";
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