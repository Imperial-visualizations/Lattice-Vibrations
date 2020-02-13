//Author: Darren Lean

/*
*   Plotly
*/

// Some global constant
var N = 25;          // N atoms 
var a = 1;           // atomic spacing
var wd = 1;          // Debye wavelength 

// Note that k = r*pi/a 

// Setting up the initial plot
function initialData () {

  var r = 0.1; 
  var k = r*Math.PI/a;
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(k*a/2), 2)));
  
  var uk = 0.5; 
  
  var t = 0;
  var x = [], y = [];
  var colour = [];

  for (l = 0; l < N; l++) {
    x.push(l*a + uk*Math.cos(l*k*a - w*t));
    y.push(0);
    colour[l] = 'rgb(17, 157, 255)';
    if (l == 15) {
      colour[l] = 'rgb(0, 0, 0)';         //To trace single atom
    }
  }

  return [{
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        color: colour,
        size: 10,
    }}];


}

Plotly.newPlot("plotly-div", initialData(), {title: 'Infinite lattice',
width: 500,
height: 500,
margin: {
  l: 50,
  r: 50,
  b: 50,
  t: 50,
  pad: 4
},
  xaxis: {title: 'x', range: [0.1*N*a, 0.95*N*a]},
  yaxis: {showgrid: false, showticklabels: false, range: [-1, 1]}
});



//Animate plot

var t = 0;

function updateData () {

  var r = document.getElementById("r").value;
  document.getElementById("r-display").innerHTML = r.toString();
  var uk = document.getElementById("uk").value;
  document.getElementById("uk-display").innerHTML = uk.toString();

  var k = r*Math.PI/a;
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(k*a/2), 2)));
  
  var x = [], y = [];
  
  for (l = 0; l < N; l++) {
    x.push(l*a + uk*Math.cos(l*k*a - w*t));
    y.push(0);
  }

return [{x: x, y: y}];

}

function animatePlot(){
    t++;
    Plotly.animate("plotly-div",
    {data: updateData()},
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