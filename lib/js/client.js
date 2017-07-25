function auth(id) {
	return (id==userData.id)
}
function kick(msg) {
	alert(msg);
	window.location.href = "https://***REMOVED***/portal";
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

//Block Inspect Element when ..
// ... right click
// $(document).ready(function() {
//     $(document).on("contextmenu",function(){
//        return false;
//     }); 
// });
// $(document).keydown(function(e){
// 	//F12 => Firefox, Chrome, Edge
//     if(e.which === 123){
//        return false;
//     }
//     //CTRL + SHIFT + C => Opera
//     if(e.which === 67 && e.ctrlKey && e.shiftKey){
//        return false;
//     }
// });

/* GetBetterUnit
Reduire un nombre
INPUT: nmbr ( int )
OUTPUT: reduced number ( string ) */
function GetBetterUnit(nmbr,unit="",max=-1) {
	var units = ["","K","M","G","T","P","E","Z","Y","B","G"];
	var unitId = 0;
	var newnbr = nmbr;

	while(newnbr>=1000) {
		newnbr = ( newnbr / 1000 );
		unitId++;
	}
	if(newnbr<0) { newnbr=0; }
	if(unitId==0) {
	var end = Math.round(newnbr)+unit;
	} else { 
	var end = (Math.round(newnbr*10)/10)+units[unitId]+unit;
	}
	if(nmbr==max) {
		end = "<span style=\"color: red;\">" + end + "</span>";
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