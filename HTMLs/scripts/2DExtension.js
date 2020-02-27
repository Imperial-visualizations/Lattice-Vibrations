//Author: Darren Lean

/*
*   Plotly
*/

// Some global constant
var N = 25;          // N atoms 
var a = 1;           // atomic spacing
var wd = 1;          // Debye wavelength 
var playing = false;

// Note that k = r*pi/a 

function uk (kx, ky, kx0, ky0, sigma, x0, y0) {
  return Math.pow(2*Math.PI*Math.pow(sigma, 2), 1)*Math.exp(-0.5*(Math.pow(kx-kx0, 2)+Math.pow(ky-ky0, 2)/sigma))*Math.cos(-(kx*x0+ky*y0));
}

// Setting up the initial plot
function initialData () {

  var kpeak = 1;
  var sigma = 0.5;
  var latticeColour = 'rgb(17, 157, 255)';
  var trackSingleColour = 'rgb(0, 0, 0)';
  var trackPhaseColour = 'rgb(255, 0, 0)';
  
  var t = 0;
  var colour = [];

  var x = [], y = [];

  var A = 0;        //Normalisation factor

  for (kcurrent = kpeak - 3*sigma; kcurrent < kpeak + 3*sigma; kcurrent += 0.01) {
    k = kcurrent*Math.pow(2, -0.5);
    A += uk(k, 0, kpeak/2, kpeak/2, sigma, 0, 0);
  }

  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      xpos = l*a;
      ypos = m*a;
      for (kcurrent = kpeak - 3*sigma; kcurrent < kpeak + 3*sigma; kcurrent += 0.01) {
        kx = kcurrent*Math.pow(2, -0.5);
        ky = kcurrent*Math.pow(2, -0.5);
        k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2));
        lamb = 2*Math.PI/k; 
        w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2));
        v = w/k; 
        ukx = uk(kx, ky, kpeak, kpeak, sigma, 0, 0)/A;
        uky = uk(kx, ky, kpeak, kpeak, sigma, 0, 0)/A;
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

  var kpeak = document.getElementById("kpeak").value;
  document.getElementById("kpeak-display").innerHTML = kpeak.toString();
  var sigma = document.getElementById("sigma").value;
  document.getElementById("sigma-display").innerHTML = sigma.toString();

  var x = [], y = [];

  var A = 0;        //Normalisation factor

  for (kcurrent = kpeak - 3*sigma; kcurrent < kpeak + 3*sigma; kcurrent += 0.01) {
    k = kcurrent*Math.pow(2, -0.5);
    A += uk(k, 0, kpeak/2, kpeak/2, sigma, 0, 0);
  }
  
  // Lattice data
  for (l = 0; l < N; l++) {
    for (m = 0; m < N; m++) {
      xpos = l*a;
      ypos = m*a;
      for (kcurrent = kpeak - 3*sigma; kcurrent < kpeak + 3*sigma; kcurrent += 0.01) {
        kx = kcurrent*Math.pow(2, -0.5);
        ky = kcurrent*Math.pow(2, -0.5);
        k  = Math.sqrt(Math.pow(kx, 2) + Math.pow(ky, 2));
        lamb = 2*Math.PI/k; 
        w = Math.sqrt(4*wd*(Math.pow(Math.sin(kx*a/2), 2)) + Math.pow(Math.sin(ky*a/2), 2));
        v = w/k; 
        ukx = uk(kx, ky, kpeak, kpeak, sigma, 0, 0)/A;
        uky = uk(kx, ky, kpeak, kpeak, sigma, 0, 0)/A;
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
//button functions:

function buttonPlayFunction() {
  console.log(playing);
  if (playing){

      document.getElementById("buttonPlay").html('Pause');
      document.getElementById("buttonReset").show();
  } else {
      document.getElementById("buttonPlay").html('Play');
  }

  $( "#kpeak, #sigma" ).prop( "disabled", true );
}

document.getElementById("buttonPlay").click(buttonPlayFunction);