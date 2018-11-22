/**
 * Set a cookie
 *
 * @param      {string}  cname   Cookie name
 * @param      {string}  cvalue  Cookie value
 * @param      {number}  exdays  Expirations days
 */
function setCookie(cname, cvalue, exdays=30) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = 'expires='+ d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
}

/**
 * Gets a cookie value by its name
 *
 * @param      {string}  cname   Cookie name
 * @return     {string}  Cookie value
 */
function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return '';
}

/**
 * Checks if a cookie exists
 *
 * @param      {<type>}   cname   Cookie name
 * @return     {boolean}  True if the cookie exists, false otherwise
 */
function existCookie(cname) {
    let content = getCookie(cname);
    return (content !== '' || content !== null);
}