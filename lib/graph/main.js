/**
 * Draw a circle graph with percentage 
 *
 * @param      {number}  percent  Percent drawed
 * @param      {<type>}  name     Name of graph
 * @param      {<type>}  color    Color of graph
 */
function percentCircle(percent,name,color)
{
  let datalist= new Array(percent, 100-percent);
  let colist = new Array(color,'grey');
  let canvas = document.getElementById(name);
  let w = canvas.width
  let h = canvas.height
  let ctx = canvas.getContext('2d');
  let radius = h / 2 - 5;
  let centerx = w / 2;
  let centery = h / 2;
  let total = 0;
  for(x=0; x < datalist.length; x++) { total += datalist[x]; };
  let lastend= 0;
  let offset = Math.PI / 2;
  for(x=0; x < datalist.length; x++)
  {
    let thispart = datalist[x];
    ctx.beginPath();
    ctx.fillStyle = colist[x];
    ctx.moveTo(centerx,centery);
    let arcsector = Math.PI * (2 * thispart / total);
    ctx.arc(centerx, centery, radius, lastend - offset, lastend + arcsector - offset, false);
    ctx.lineTo(centerx, centery);
    ctx.fill();
    ctx.closePath();
    lastend += arcsector;
  }
}

/**
 * Draw a linear graph
 *
 * @param      {number}  percent  Percent drawed
 * @param      {<type>}  name     Name of graph
 * @param      {<type>}  color    Color of graph
 */
function linearGraph(name,percent,color) {
		let percentContainer = document.getElementById(name);
		percentContainer.innerHTML = "<span class=\"skill-name\">"+ name +"</span><div class=\"percentBar\" id=\"" + name + "-percent\">.</div>";
		let percentBar = document.getElementById(name + "-percent");
		percentBar.style.backgroundColor = color;
		percentBar.style.color = color;

		let percentOne = percent/50; //2 sec to draw
		let currentpercent = 0;
		let intervalID = setInterval(function() {
			currentpercent += percentOne;
			percentBar.style.width = currentpercent + "%";
			if(currentpercent>=percent) {
				clearInterval(intervalID);
			}
		},40);
}