<template>
    <div id="dispersion-graph" style="height: 50%; width:50%; padding:50px;">
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props:{
        dx: {
            default: 0.1,
        },
        dy: {
            default: 0.1,
        },
        ux: {
            default: -0.5,
        },
        uy: {
            default: -0.5,
        }
    },
    methods:{
        emitSVG(){
            console.log('hello');
            this.$emit("SVGChanged", [this.dx, this.dy, this.ux, this.uy]);
        }
    },
    mounted(){
        //--------------------//
        //Code for main stage //
        //--------------------//
        let Vis = this;

        Vis.init = function() {
            Vis.setup.initConsts();
            Vis.setup.initData();
            Vis.setup.initGraph();
            //Vis.setup.initDispersionDrag();

            Vis.core.frame();
        };


        Vis.core = {
            frame: function() {
                //Update dot on the dispersion graph
                var cx = Vis.dispersionGraphWidth*(Vis.dx+1)/2;
                var cy = Vis.dispersionGraphHeight*(1-Vis.dy)/2;
                Vis.dispersionDot.attr("cx", cx).attr("cy", cy);
                window.requestAnimationFrame(Vis.core.frame);
            }
        };

        Vis.workers = {
            omega_k: function(dx, dy) {
                return Math.sqrt(4*1*(Math.pow(Math.sin(dx*Math.PI*1/2), 2) + Math.pow(Math.sin(dy*Math.PI*1/2), 2)));
            }
        };

        Vis.setup = {
            initConsts: function() {

                Vis.dispersionGraphWidth = 250;
                //Vis.dispersionGraphWidth = document.getElementById('dispersion-graph').offsetWidth;
                //Vis.dispersionGraphHeight = document.getElementById('dispersion-graph').offsetHeight;
                Vis.dispersionGraphHeight = Vis.dispersionGraphWidth;
            
            },
            initData: function() {

                Vis.nx = Vis.dispersionGraphWidth+1, Vis.ny = Vis.dispersionGraphHeight+1, Vis.values = new Array(Vis.nx*Vis.ny);
                for (var i = 0; i < Vis.nx; i++){
                    for (var j = 0; j < Vis.ny ; j++){
                        var k = i + Vis.nx*j;
                        var dx = -1 + 2*i/Vis.nx;
                        var dy = -1 + 2*j/Vis.ny;
                        Vis.values[k] = Vis.workers.omega_k(dx, dy);
                    }
                }

            },
            initGraph: function() {
                //Code for dispersion graph

                Vis.dispersionGraph = d3.select('#dispersion-graph')
                                        .append('canvas')
                                        .attr('width', Vis.dispersionGraphWidth)
                                        .attr('height', Vis.dispersionGraphHeight);

                Vis.dispersionContext = Vis.dispersionGraph.node().getContext('2d');  

                //Making contour
                var color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 2.82]);
                var path = d3.geoPath(null, Vis.dispersionContext);
                var thresholds = d3.range(0, 2.82, 0.01);
                var contours = d3.contours().size([Vis.nx, Vis.ny]);
                
                function fillGraph(geometry) {
                    Vis.dispersionContext.beginPath();
                    path(geometry);
                    Vis.dispersionContext.fillStyle = color(geometry.value);
                    Vis.dispersionContext.fill();
                }
                
                contours.thresholds(thresholds)(Vis.values).forEach(fillGraph);

                //Preparing SVG for dispersion dot and legend
                Vis.dispersionSVG = d3.select('#dispersion-graph')
                                    .append("svg")
                                    .attr('width', 1.4*Vis.dispersionGraphWidth)
                                    .attr('height', Vis.dispersionGraphHeight)
                                    .attr('transform', "translate(0, "+ -1.025*Vis.dispersionGraphHeight + ")");

                //Box to check if Canvas and SVG are aligned
                Vis.dispersionSVG.append("rect")
                                    .attr("x", 0)
                                    .attr("y", 0)
                                    .attr("height", Vis.dispersionGraphHeight)
                                    .attr("width", Vis.dispersionGraphWidth)
                                    .style("stroke", 'black')
                                    .style("fill", "none")
                                    .style("stroke-width", 1);
            
                var legendXOffset = 1.175*Vis.dispersionGraphWidth;
                var legendYOffset = 0.1*Vis.dispersionGraphHeight;
                var legendHeight = 0.8*Vis.dispersionGraphHeight;
                var legendWidth = 0.15*Vis.dispersionGraphWidth;
                
                //Box for legend scale
                Vis.legendSVG = Vis.dispersionSVG.append("rect")
                                    .attr("x", legendXOffset)
                                    .attr("y", legendYOffset)
                                    .attr("height", legendHeight)
                                    .attr("width", legendWidth)
                                    .style("stroke", 'black')
                                    .style("fill", "none")
                                    .style("stroke-width", 1);
                                    
                for (var i = 0; i < 14 ; i++){
                    Vis.dispersionSVG.append("rect")
                    .attr("x", legendXOffset)
                    .attr("y", legendHeight*(14-i)/14)
                    .attr("transform", "translate(0," + legendYOffset/2.2 + ")")
                    .attr("height", legendHeight/14)
                    .attr("width", legendWidth)
                    .style("fill", color(2.82*i/14));
                }

                var legendScale = d3.scaleLinear()
                    .domain([0, 2.8])
                    .range([legendHeight+legendYOffset, legendYOffset]);

                //Legend scale axis
                Vis.dispersionSVG.append('g')
                .attr("transform", "translate("+ legendXOffset+ ", 0)")  // Position of x axis
                .call(d3.axisLeft(legendScale));

                //Legend scale title
                Vis.dispersionSVG.append("text")
                .attr("text-anchor", "end")
                .attr("font-style", "italic")
                .attr('font-size', 10*legendWidth/25)
                .attr("x", legendXOffset+legendWidth)
                .attr("y", legendYOffset/2)
                .text("ω(k) = E/ħ");

                Vis.dispersionDot = Vis.dispersionSVG
                                        .append('circle')
                                        .attr(':v-on:mousemove', this.emitSVG)
                                        .attr("cx", 0)
                                        .attr("cy", 0)
                                        .attr("r", 5)
                                        .attr("fill", "black");               
            },

            initDispersionDrag: function() {
                function dispersionDragged() {
                    return function() {
                        var x = 2*d3.event.x/Vis.dispersionGraphWidth - 1;
                        var y = 1 - 2*d3.event.y/Vis.dispersionGraphHeight;
                        if (x > 1) {
                            x = 1;
                        } else if (x < -1){
                            x = -1;
                        }
                        if (y > 1) {
                            y = 1;
                        } else if (y < -1) {
                            y = -1;
                        }
                        Vis.dx = x;
                        Vis.dy = y;
                    };
                }
                Vis.dispersionDot.call(d3.drag().on('drag', dispersionDragged(Vis.dispersionDot)));
            },
        };

        document.addEventListener('DOMContentLoaded', Vis.init);
                
                

    }
    
}
</script>

<style>

</style>