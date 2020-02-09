
/*
*   Plotly
*/

// Setting up the initial plot
var N = 50;          // N atoms 
var a = 1;           // atomic spacing
var wd = 1;          // Debye wavelength 

/* Note that k = r*pi/a */
var r = 0.1; 
var k = r*Math.PI/a;
var w = Math.sqrt(4*wd*(Math.pow(Math.sin(k*a/2), 2)));

var uk = 1; 

var t = 0;
var x = [], y = [];
var colour = [];

for (l = 0; l < N; l++) {
  w = Math.sqrt(4*wd*(Math.pow(Math.sin(k*a/2), 2)));
  t = 1;
  x[l] = l*a + uk*Math.cos(l*k*a - w*t);
  y[l] = 0;
  colour[l] = 'rgb(17, 157, 255)';
  if (l == 30) {
    colour[l] = 'rgb(0, 0, 0)';         //To trace single atom
  }

}

Plotly.newPlot("plotly-div", [{
  x: x,
  y: y,
  mode: 'markers',
  marker: {
    color: colour,
    size: 10,
}}], {title: 'Infinite lattice',
  xaxis: {showticklabels: false,
    range: [0.1*N*a, 0.95*N*a]},
  yaxis: {showgrid: false,
    showticklabels: false,
    range: [-1, 1]}
});



//Animate plot
function data () {
  var r = document.getElementById("r").value;
  document.getElementById("r-display").innerHTML = r.toString();
  var uk = document.getElementById("uk").value;
  document.getElementById("uk-display").innerHTML = uk.toString();
  
  t++;


  var k = r*Math.PI/a;
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(k*a/2), 2)));

  for (l = 0; l < N; l++) {
    w = Math.sqrt(4*wd*(Math.pow(Math.sin(k*a/2), 2)));
    x[l] = l*a + uk*Math.cos(l*k*a - w*t);
    y[l] = 0;
}

}

function animatePlot(){
    data(r, uk);  //update data
    Plotly.animate("plotly-div",
    {data: [{x: x, y: y}]},
            {
                fromcurrent: false,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: true,},
                mode: "immediate"
            }
        );

    requestAnimationFrame(animatePlot);

}
requestAnimationFrame(animatePlot);