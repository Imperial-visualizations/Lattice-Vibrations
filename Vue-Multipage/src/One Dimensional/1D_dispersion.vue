<template>
    <div @sliderChanged="change" id="dispersion-graph" style="height: 33%; width:33%; padding:0px; position:absolute; padding-top: 250px;">
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as math from 'mathjs';

export default {
    props:{
        d: {
            default: 0.1,
        }
    },
    mounted(){
        //-------------------------//
        //Code for dispersion graph//
        //-------------------------//

        let Vis = this;

        Vis.init = function(){
            Vis.setup.initConsts();
            Vis.setup.initData();
            Vis.setup.initGraph();
            Vis.core.frame();
        }

        Vis.core = {
            frame: function() {
                var cx = (Vis.d)*Vis.width/20;
                var cy = -Vis.workers.omega_k(Vis.d)*Vis.height/2;
                Vis.movingk.attr('cx', cx).attr('cy', cy);
                window.requestAnimationFrame(Vis.core.frame);
            }
        }

        Vis.setup = {
            initConsts: function() {
                Vis.dispersionWidth = document.getElementById('dispersion-graph').offsetWidth;
                //Vis.dispersionHeight = document.getElementById('dispersion-graph').offsetHeight;
                Vis.dispersionHeight = 0.8*Vis.dispersionWidth;
                // set the dimensions and margins of the graph
                Vis.margin = {top: 0.1*Vis.dispersionHeight, right: 0.1*Vis.dispersionWidth, bottom: 0.2*Vis.dispersionHeight, left: 0.1*Vis.dispersionWidth},
                Vis.width = 0.8*Vis.dispersionWidth,
                Vis.height = 0.7*Vis.dispersionHeight;
            },

            initData: function() {
                // Setting up data for graph
                Vis.k = [], Vis.w_k = [], Vis.data = [];
                for (var i = 0; i < 20000; i++) {
                    var Visd = (-10 + i/1000);
                    var Visk = (-10 + i/1000)*Math.PI;
                    Vis.k.push(Number(Visk.toFixed(2)));      // fix to 2 decimal places
                    Vis.w_k.push(Vis.workers.omega_k(Visd));
                    Vis.data.push({x: Number(Visk.toFixed(2)), y: Vis.workers.omega_k(Visd)});
                }
            },

            initGraph: function() {
                Vis.svg = d3.select("#dispersion-graph")
                            .append("svg")
                            .attr("width", Vis.width + Vis.margin.left + Vis.margin.right)
                            .attr("height", Vis.height + Vis.margin.top + Vis.margin.bottom)
                            // translate Vis svg element to leave some margin.
                            .append("g")
                            .attr("transform", "translate(" + Vis.margin.left + "," + Vis.margin.top + ")");
                
                // X scale and Axis
                var x = d3.scaleLinear()
                            .domain([Vis.k[0], Vis.k.slice(-1)[0]])                           // Range of x axis
                            .range([0, Vis.width]);                                       // Length of x axis

                Vis.svg.append('g')
                        .attr("transform", "translate(0," + Vis.height + ")")  // Position of x axis
                        .call(d3.axisBottom(x));

                // Add X axis label:
                Vis.svg.append("text")
                        .attr("text-anchor", "end")
                        .attr("font-style", "italic")
                        .attr("font-size", Vis.height/11)
                        .attr("x", Vis.width)
                        .attr("y", 11*Vis.height/12 + 14*Vis.margin.bottom/11)
                        .text("k = πd");

                // Y scale and Axis
                var y = d3.scaleLinear()
                            .domain([math.min(Vis.w_k), math.max(Vis.w_k)])                       // Range of y axis
                            .range([Vis.height, 0]);                                      // Length of y axis

                Vis.svg.append('g')
                        .attr("transform", "translate(" + Vis.width/2 + ", 0)")  // Position of x axis
                        .call(d3.axisLeft(y));

                // Y axis label:
                Vis.svg.append("text")
                        .attr("text-anchor", "end")
                        .attr("font-style", "italic")
                        .attr("font-size", Vis.height/11)
                        .attr("x", 1.4*Vis.width/2)
                        .attr("y", -Vis.margin.top/2)
                        .text("ω(k) = E/ħ");

                // Draw the potential
                Vis.svg.append("path")
                        .datum(Vis.data)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3.line()
                            .x(function(d) { return x(d.x); })
                            .y(function(d) { return y(d.y); })
                            );

                // Draw current k 
                Vis.movingk = Vis.svg.append("circle")
                                    .attr("cx", Vis.d*Math.PI)
                                    .attr("cy", Vis.workers.omega_k(Vis.d))
                                    .attr("r", 3)
                                    .attr("transform", "translate(" + Vis.width/2 + "," + Vis.height + ")")
                                    .attr("fill", "orange");
            }
        }

        Vis.workers = {
            omega_k: function(d) {
                return Math.sqrt(4*1*(Math.pow(Math.sin(d*Math.PI*1/2), 2)));
            }
        }

        document.addEventListener('DOMContentLoaded', Vis.init);
    }
    
}
</script>

<style>

</style>