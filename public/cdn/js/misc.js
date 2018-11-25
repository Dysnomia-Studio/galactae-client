let connectTimeout = -1;

/**
 * Kick player from game
 *
 * @param      {string}   msg            Kick message
 * @param      {number}   time           Countdown before redirect
 * @param      {boolean}  canBeCanceled  Indicates if redirect timer be canceled
 */
function kick(msg,time=0,canBeCanceled=false) {
    let message;

	if(msg !== '' && translate.messages[msg] !== undefined) {
        message = message = translate.messages[msg];
    } else if(msg === undefined) {
        message = '';
    } else {
        message = msg;
    }

    chat.sm(msg);
    ui.drawMessage(msg);    

	connectTimeout = setTimeout(function() {
		window.location.href = 'https://galactae.eu/portal?kickmsg=' + message;
	},time);

	if(!canBeCanceled) {
		connectTimeout = -1;
	}
}

//get "GET"
function getParameterByName(name, url) {
    if (!url) { 
        url = window.location.href; 
    }

    name = name.replace(/[\[\]]/g, '\\$&')

    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if (!results) { 
        return null;
    }
    if (!results[2]) { 
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Gets the better unit.
 *
 * @class      GetBetterUnit (name)
 * @param      {number}  nmbr    Number to reduce
 * @param      {string}  unit    Unit value
 * @param      {number}  max     The maximum value
 * @return     {string}  Reduced value with unit
 */
function GetBetterUnit(nmbr,unit='',max=0) {
	let units = ['','K','M','G','T','P','E','Z','Y'];
	let unitId = 0;
	let newnbr = nmbr;
	let signe = false;

	if(newnbr < 0) {
		newnbr = -newnbr;
		signe = true;
	}

	while(newnbr >= 1000) {
		newnbr = newnbr/1000;
		unitId++;
	}
	if(newnbr < 0) { newnbr = 0; }
	if(signe) {
		newnbr = -newnbr;
	}

    let end;
	if(unitId === 0) {
	   end = Math.round(newnbr)+unit;
	} else { 
	   end = (Math.round(newnbr*10)/10)+units[unitId]+unit;
	}

	if((nmbr >= max && max !== 0) || nmbr <= 0) {
		end = '<span class="max-value">' + end + '</span>';
	}

	return end;
}

/**
 * Gets the string time
 *
 * @param      {number}  number  Timestamp
 * @return     {string}  The string time.
 */
function getStringTime(number) {
	let hours = (number<10)?'0'+Math.floor(number):Math.floor(number);
	let min = ((number*60)%60<10)?'0'+Math.floor((number*60)%60):Math.floor((number*60)%60);
	let sec = ((number*3600)%60<10)?'0'+Math.floor((number*3600)%60):Math.floor((number*3600)%60);
	return hours+':'+min+':'+sec;
}

let charList = [
    // a    
    ['à','&agrave;'],
    ['á','&aacute;'],
    ['â','&acirc;'],
    ['ã','&atilde;'],
    ['ä','&auml;'],
    ['å','&aring;'],
    ['æ','&aelig;'],
    // c
    ['ç','&ccedil;'],
    // e        
    ['è','&egrave;'],
    ['é','&eacute;'],
    ['ê','&ecirc;'],
    ['ë','&euml;'],
    // i
    ['ì','&igrave;'],
    ['í','&iacute;'],
    ['î','&icirc;'],
    ['ï','&iuml;'], 
    // n
    ['ñ','&ntilde;'],
    // o
    ['ò','&ograve;'],
    ['ó','&oacute;'],
    ['ô','&ocirc;'],
    ['õ','&otilde;'],
    ['ö','&ouml;'],
    // u
    ['ù','&ugrave;'],
    ['ú','&uacute;'],
    ['û','&ucirc;'],
    ['ü','&uuml;'],
    // y
    ['ý','&yacute;'],
    ['ÿ','&yuml;'],
    //math
    ['÷','&divide;'],
    ['×','&times;'],
    ['±','&plusmn;'],
    ['¼','&frac14;'],
    ['½','&frac12;'],
    ['¾','&frac34;'],
    ['¹','&sup1;'],
    ['²','&sup2;'],
    ['³','&sup3;'],
    // others
    ['€','&euro;'],
    ['¢','&cent;'],
    ['£','&pound;'],
    ['ß','&szlig;'],
    ['¿','&iquest;'],
    ['µ','&micro;'],
    ['©','&copy;'],
    ['°','&deg;'],
    ['¨','&uml;'],
    ['§','&sect;'],
    ['¤','&curren;'],
    ['¦','&brvbar;'],
];

/**
 * [Un]Normalize a text to be compatible with sockets
 *
 * @param      {<type>}  str     The string
 * @return     {<type>}  normalized string
 */
function normalizeText(str) {
    for(let i=0; i<charList.length; i++) {
    	str = str.split(charList[i][0]).join(charList[i][1]);
    }

	return str;
}
function unNormalizeText(str) {
    for(let i=0; i<charList.length; i++) {
        str = str.split(charList[i][1]).join(charList[i][0]);
    }

    return str;
}