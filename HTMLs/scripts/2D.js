
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

  var rx = 0.1; 
  var ry = 0.1; 
  var kx = rx*Math.PI/a;
  var ky = ry*Math.PI/a;
  var k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2));
  var lamb = 2*Math.PI/k; 
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2));
  var v = w/k; 

  var ukx = 0.5; 
  var uky = 0.5; 
  
  var t = 0;
  var x = [], y = [];
  var colour = [];

  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      x.push(l*a + ukx*Math.cos(l*kx*a + m*ky*a - w*t));
      y.push(m*a + uky*Math.cos(l*kx*a + m*ky*a - w*t));
      colour.push('rgb(17, 157, 255)');
      if (l == 15 && m == 15) {
        colour.push('rgb(0, 0, 0)');         //To trace single atom
      }
    }
  }

  // Phase track data
  for (n = 0; n < 100; n++) {
    x.push(15 + t*v*kx/k);
    y.push(15 + t*v*ky/k);
    colour.push('rgb(0, 0, 255)');
    x.push(15 + n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(15 + n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    colour.push('rgb(0, 0, 255)');
    x.push(15 - n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(15 - n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    colour.push('rgb(0, 0, 255)');
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
  xaxis: {range: [0.1*N*a, 0.95*N*a]},
  yaxis: {range: [0.1*N*a, 0.95*N*a]}
});



//Animate plot

var t = 0;

function updateData () {

  var rx = document.getElementById("rx").value;
  document.getElementById("rx-display").innerHTML = rx.toString();
  var ukx = document.getElementById("ukx").value;
  document.getElementById("ukx-display").innerHTML = ukx.toString();
  var ry = document.getElementById("ry").value;
  document.getElementById("ry-display").innerHTML = ry.toString();
  var uky = document.getElementById("uky").value;
  document.getElementById("uky-display").innerHTML = uky.toString();

  var kx = rx*Math.PI/a;
  var ky = ry*Math.PI/a;
  var k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2));
  var lamb = 2*Math.PI/k; 
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2));
  var v = w/k; 
  
  var x = [], y = [];
  
  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      x.push(l*a + ukx*Math.cos(l*kx*a + m*ky*a - w*t));
      y.push(m*a + uky*Math.cos(l*kx*a + m*ky*a - w*t));
    }
  }

  // Phase track data
  for (n = 0; n < 100; n++) {
    x.push(15 + t*v*kx/k);
    y.push(15 + t*v*ky/k);
    x.push(15 + n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(15 + n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    x.push(15 - n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(15 - n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
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