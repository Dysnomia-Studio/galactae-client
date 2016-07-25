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

