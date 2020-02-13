//Author: Darren Lean

/*
*   Plotly
*/

// Some global constant
var N = 10;          // N atoms 
var a = 1;           // atomic spacing
var wd = 1;          // Debye wavelength 

// Note that k = r*pi/a 

// Setting up the initial plot
function initialData () {

  var rx = 0.1; 
  var ry = 0.1; 
  var rz = 0.1;
  var kx = rx*Math.PI/a;
  var ky = ry*Math.PI/a;
  var kz = rz*Math.PI/a;
  var k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2) + Math.pow(kz, 2));
  var lamb = 2*Math.PI/k; 
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2) + Math.pow(Math.sin(kz*a/2), 2));
  var v = w/k; 

  var ukx = 0.5; 
  var uky = 0.5; 
  var ukz = 0.5;
  
  var t = 0;
  var x = [], y = []; z = [];
  var colour = [];

  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      for (n = 0; n < N; n++) {
        x.push(l*a + ukx*Math.cos(l*kx*a + m*ky*a + n*kz*a - w*t));
        y.push(m*a + uky*Math.cos(l*kx*a + m*ky*a + n*kz*a - w*t));
        z.push(n*a + ukz*Math.cos(l*kx*a + m*ky*a + n*kz*a - w*t));
        colour.push('rgb(17, 157, 255)');
        if (l == 6 && m == 6 && n == 6) {
          colour.push('rgb(0, 0, 0)');         //To trace single atom
        }
      }
    }
  }

  // Phase track data
  for (n = 0; n < 100; n++) {
    x.push(5 + t*v*kx/k);
    y.push(5 + t*v*ky/k);
    z.push(5 + t*v*kz/k);
    colour.push('rgb(0, 0, 255)');
    x.push(5 + n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(5 + n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    z.push(5 + n*Math.round(N*a/lamb - 1)*lamb*kz/k + t*v*kz/k);
    colour.push('rgb(0, 0, 255)');
    x.push(5 - n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(5 - n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    z.push(5 - n*Math.round(N*a/lamb - 1)*lamb*kz/k + t*v*kz/k);
    colour.push('rgb(0, 0, 255)');
  }

  return [{
      x: x,
      y: y,
      z: z,
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        color: colour,
        size: 5,
      }
  }];


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
  scene: {
    aspectmode: 'cube',                     //This stops the camera from zooming
    xaxis: {title: 'x', range: [0.1*N*a, 0.95*N*a]},
    yaxis: {title: 'y', range: [0.1*N*a, 0.95*N*a]},
    zaxis: {title: 'z', range: [0.1*N*a, 0.95*N*a]}
  },
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
  var rz = document.getElementById("rz").value;
  document.getElementById("rz-display").innerHTML = rz.toString();
  var ukz = document.getElementById("ukz").value;
  document.getElementById("ukz-display").innerHTML = ukz.toString();

  var ukvec = [ukx, uky, ukz];
  var kx = rx*Math.PI/a;
  var ky = ry*Math.PI/a;
  var kz = rz*Math.PI/a;
  var kvec = [kx, ky, kz];
  var k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2) + Math.pow(kz, 2));
  var lamb = 2*Math.PI/k; 
  var w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2) + Math.pow(Math.sin(kz*a/2), 2));
  var v = w/k; 

  var dotproduct = Math.round(100*Math.abs(math.dot(kvec, ukvec)))/100;
  document.getElementById("dotproduct").innerHTML = dotproduct.toString();
  var crossproduct = Math.round(Math.abs(100*Math.pow((Math.pow(math.cross(kvec, ukvec)[0], 2) + Math.pow(math.cross(kvec, ukvec)[1], 2) + Math.pow(math.cross(kvec, ukvec)[2], 2) ), 0.5)))/100;
  document.getElementById("crossproduct").innerHTML = crossproduct.toString();

  var x = [], y = [], z = [];
  

  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      for (n = 0; n < N; n++) {
        x.push(l*a + ukx*Math.cos(l*kx*a + m*ky*a + n*kz*a - w*t));
        y.push(m*a + uky*Math.cos(l*kx*a + m*ky*a + n*kz*a - w*t));
        z.push(n*a + ukz*Math.cos(l*kx*a + m*ky*a + n*kz*a - w*t));
      }
    }
  }

  // Phase track data
  for (n = 0; n < 100; n++) {
    x.push(15 + t*v*kx/k);
    y.push(15 + t*v*ky/k);
    z.push(15 + t*v*kz/k);
    x.push(15 + n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(15 + n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    z.push(15 + n*Math.round(N*a/lamb - 1)*lamb*kz/k + t*v*kz/k);
    x.push(15 - n*Math.round(N*a/lamb - 1)*lamb*kx/k + t*v*kx/k);
    y.push(15 - n*Math.round(N*a/lamb - 1)*lamb*ky/k + t*v*ky/k);
    z.push(15 - n*Math.round(N*a/lamb - 1)*lamb*kz/k + t*v*kz/k);
  }




return [{x: x, y: y, z: z}];

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