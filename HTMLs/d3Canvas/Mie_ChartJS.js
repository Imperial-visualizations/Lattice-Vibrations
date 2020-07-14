//Author: Darren Lean

/*
*   Chart JS
*/

// Some global constant
var sigma = Math.pow(2, -1/6);
var epsilon = 0.1;                    
var r0 = sigma*Math.pow(2, 1/6);    //position of minimum

// Mie potential 
function MiePotential (r) {
  return (4*epsilon)*(Math.pow((sigma/r), 12) - Math.pow((sigma/r), 6));
}

// Setting up the data
var x = [], y = [];

for (i = 0; i < 20; i++) {
  var xnow = (0.8 + 0.05*i)*r0;
  x.push(xnow.toFixed(2));
  y.push(MiePotential(xnow));
}

new Chart(document.getElementById("line-chart"), {
  type: 'line',
  data: {
    labels: x,
    datasets: [{ 
        data: y
      }
    ]
  },
  options: {
  scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'V(r)',
          fontStyle: "italic"
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'r normalised to minimum',
          fontStyle: "italic"
        }
      }],
    },
    legend: {
      display: false
   },
    title: {
      display: true,
      text: 'Mie potential',
      fontStyle: "bold"
    }
  }
});