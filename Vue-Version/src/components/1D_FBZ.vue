<template>
    <div id="interactive-Circle" style="height: 25%; width:50%; padding:50px;">
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props:{
        d: {
            default: 0.1,
        }
    },
    mounted(){
        //----------------------------------//
        //Code for k in first brillouin zone//
        //----------------------------------//

        let Circle = this;

        Circle.init = function() {
            Circle.setup.initConst();                   //Setup constants
            Circle.setup.initObjects();                 //Initialise SVG elements
            Circle.core.frame();
        };

        Circle.core = {
            frame: function() {
                Circle.workers.calcParams();
                Circle.core.draw();
                window.requestAnimationFrame(Circle.core.frame);
            },

            draw: function() {
                Circle.core.drawCircle(Circle.dCircle);
            },

            drawCircle: function(circle) {
                Circle.helpers.updateCircle(circle);
            }
        };

        Circle.helpers = {
            updateCircle: function(circle) {
                var tipx = (Circle.dFBZ + 1)*Circle.width/2;       //Brings the x origin to the center 
                var tipy = Circle.height/2;                 //SVG y coordinates increases vertically downward

                circle.body.attr('x2', tipx)
                        .attr('y2', tipy);
                circle.tip.attr('cx', tipx)
                        .attr('cy', tipy);

                circle.text.attr('x', Circle.width/2)
                            .attr('y', 0.8*Circle.height/2)
                            .attr('font-size', 12)
                            .text(circle.stext + ' = ' + Number(Circle.dFBZ).toFixed(2) + 'π');
            },
        };

        Circle.workers = {
            calcParams: function() {                                    //Calculation of k in First Brillouin Zone
                var dtemporary = Circle.d%2;
                if (Circle.d > 0 && dtemporary > 1) {Circle.dFBZ = dtemporary - 2; }
                else if (Circle.d < 0 && dtemporary < -1) {Circle.dFBZ = dtemporary + 2; }
                else {Circle.dFBZ = dtemporary;}
            },
        };

        Circle.setup = {
            initConst: function() {                             //Setup constants
                Circle.width = document.getElementById('interactive-Circle').offsetWidth;
                Circle.height = document.getElementById('interactive-Circle').offsetHeight;

                Circle.strokeWidth = 2;
                Circle.tipRadius = 5;
            },

            initObjects: function() {                           //Initialise SVG elements
                Circle.svg = d3.select('#interactive-Circle')
                                .append('svg')
                                .attr('width', Circle.width)
                                .attr('height', Circle.height);

                Circle.svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", Circle.height)
                .attr("width", Circle.width)
                .style("stroke", 'black')
                .style("fill", "none")
                .style("stroke-width", 1);

                Circle.dCircle = {
                    x: Circle.dFBZ,
                    y: 0,
                    stext: 'k'
                };

                Circle.setup.initCircle(Circle.dCircle);
            },

            initCircle: function(circle) {                      //Add the SVG elements
                circle.container = Circle.setup.createCircleContainer();
                circle.body = Circle.setup.createCircleBody(circle);
                circle.tip = Circle.setup.createCircleTip(circle);
                circle.text = Circle.setup.createCircleText(circle);
                Circle.helpers.updateCircle(circle);
            },

            createCircleContainer: function() {
                return Circle.svg.append('svg')
                                .attr('width', Circle.width)
                                .attr('height', Circle.height);
            },

            createCircleBody: function(circle) {
                return circle.container.append('line')
                                        .attr('x1', Circle.width/2).attr('y1', Circle.height/2)
                                        .attr('stroke-width', Circle.strokeWidth)
                                        .attr('stroke', 'black');
            },

            createCircleTip: function(circle) {
                return circle.container.append('circle')
                                    .attr('r', Circle.tipRadius);
            },

            createCircleText: function(circle) {
                return circle.container.append('text');
            }
        };

        document.addEventListener('DOMContentLoaded', Circle.init);
    }
    
}
</script>

<style>

</style>