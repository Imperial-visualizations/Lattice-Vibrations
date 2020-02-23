//Author: Darren Lean

/*
*   Plotly
*/

// Some global constant
var N = 25;          // N atoms 
var a = 1;           // atomic spacing
var wd = 1;          // Debye wavelength 

// Note that k = r*pi/a 

function uk (k, k0, sigma, x0) {
  return Math.pow(2*Math.PI*Math.pow(sigma, 2), 1.5)*Math.exp(-0.5*Math.pow((k-k0)/sigma, 2))*Math.cos(-k*x0);
}

// Setting up the initial plot
function initialData () {

  var kmax = 0.5;
  var latticeColour = 'rgb(17, 157, 255)';
  var trackSingleColour = 'rgb(0, 0, 0)';
  var trackPhaseColour = 'rgb(255, 0, 0)';
  
  var t = 0;
  var colour = [];

  var x = [], y = [];

  var A = 0;        //Normalisation factor

  for (kcurrent = 0; kcurrent < kmax; kcurrent += 0.001) {
    k = kcurrent*Math.pow(2, -0.5);
    A += uk(k, kmax/2, 0.5, N/2);
  }

  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      xpos = l*a;
      ypos = m*a;
      for (kcurrent = 0; kcurrent < kmax; kcurrent += 0.001) {
        kx = kcurrent*Math.pow(2, -0.5);
        ky = kcurrent*Math.pow(2, -0.5);
        kvec = [kx, ky, 0];
        k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2));
        lamb = 2*Math.PI/k; 
        w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2));
        v = w/k; 
        ukx = uk(kx, kmax/2, 0.5, N/2)/A;
        uky = uk(ky, kmax/2, 0.5, N/2)/A;
        xpos += ukx*Math.cos(l*kx*a + m*ky*a - w*t);
        ypos += uky*Math.cos(l*kx*a + m*ky*a - w*t);
      }
      x.push(xpos);
      y.push(ypos);
      if (l == 15 && m == 15) {
        colour.push(trackSingleColour);         //To trace single atom
      } else {
        colour.push(latticeColour);
      }
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
  yaxis: {title: 'y', range: [0.1*N*a, 0.95*N*a]}
});


//Animate plot

var t = 0;

function updateData () {

  var kmax = document.getElementById("kmax").value;
  document.getElementById("kmax-display").innerHTML = kmax.toString();

  var x = [], y = [];

  var A = 0;        //Normalisation factor

  for (kcurrent = 0; kcurrent < kmax; kcurrent += 0.001) {
    k = kcurrent*Math.pow(2, -0.5);
    A += uk(k, kmax/2, 0.5, N/2);
  }
  
  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      xpos = l*a;
      ypos = m*a;
      for (kcurrent = 0; kcurrent < kmax; kcurrent += 0.001) {
        kx = kcurrent*Math.pow(2, -0.5);
        ky = kcurrent*Math.pow(2, -0.5);
        kvec = [kx, ky, 0];
        k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2));
        lamb = 2*Math.PI/k; 
        w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2));
        v = w/k; 
        ukx = uk(kx, kmax/2, 0.5, N/2)/A;
        uky = uk(ky, kmax/2, 0.5, N/2)/A;
        xpos += ukx*Math.cos(l*kx*a + m*ky*a - w*t);
        ypos += uky*Math.cos(l*kx*a + m*ky*a - w*t);
      }
      x.push(xpos);
      y.push(ypos);
    }
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