// Some global constant
var sigma = Math.pow(2, -1/6);
var epsilon = 0.1;                    
var r0 = sigma*Math.pow(2, 1/6);    //position of minimum

// Mie potential 
function MiePotential (r) {
  return 10*(4*epsilon)*(Math.pow((sigma/r), 12) - Math.pow((sigma/r), 6));
}

// Setting up the data
var r = [], V = [];
var data = [];
for (i = 0; i < 100; i++) {
  var rnow = (0.8 + (1/100)*i)*r0;
  r.push(Number(rnow.toFixed(2)));      // fix to 2 decimal places
  V.push(MiePotential(rnow));
  data.push({x: Number(rnow.toFixed(2)), y: MiePotential(rnow)});
}

var oscillate = [{x: r0, y: MiePotential(r0)}];

// set the dimensions and margins of the graph
var margin = {top: 10, right: 40, bottom: 30, left: 30},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var sVg = d3.select("#Area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  // translate this svg element to leave some margin.
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X scale and Axis
var x = d3.scaleLinear()
    .domain([r[0], r.slice(-1)[0]])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, width]);       // This is the corresponding value I want in Pixel
sVg
  .append('g')
  .attr("transform", "translate(0," + 6.9925*height/8 + ")")
  .call(d3.axisBottom(x));

// Y scale and Axis
var y = d3.scaleLinear()
    .domain([math.min(V), math.max(V)])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([height, 0]);       // This is the corresponding value I want in Pixel
sVg
  .append('g')
  .call(d3.axisLeft(y));

// Draw the potential
sVg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    );

// Draw the oscillator
var oscillator = sVg
  .selectAll()
  .data(oscillate)
  .enter()
  .append("circle")
    .attr("cx", function(d){ return x(d.x); })
    .attr("cy", function(d){ return y(d.y); })
    .attr("r", 7)
    .attr("fill", "orange");

slide();

//Slide the circle from left to right
function slide() {
  (function repeat() {

    //Move the circle left and right
      oscillator.transition().duration(300)
          .attr("cx", 0.195*width )
        .transition().duration(300)
          .attr("cx", 0.205*width )
          .on("end", repeat);
  })();
}//slide