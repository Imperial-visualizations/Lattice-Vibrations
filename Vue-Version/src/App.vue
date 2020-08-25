<template>
    <div @drag="emitSVG" id="interactive-arrow" style="height: 50%; width:50%; padding:50px;" v-on:mousemove="emitSVG">
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    data(){
        return{
            dx: 0.1,
            dy: 0.1, 
            ux: -0.5, 
            uy: -0.5,
            allVal: this.dx + this.dy + this.ux + this.uy,
        }
    },
    methods:{
        emitSVG(){
            console.log('hello');
            this.$emit("SVGChanged", [this.dx, this.dy, this.ux, this.uy]);
        }
    },
    watch: {
    },
    mounted(){
        //--------------------//
        //Code for main stage //
        //--------------------//
        let Arrow = this;

        Arrow.init = function() {
            Arrow.setup.initConst();
            Arrow.setup.initObjects();
            Arrow.setup.initDrag();

            Arrow.core.frame();
        };

        Arrow.core = {
            frame: function() {
                Arrow.core.draw();
                Arrow.rArrow.x = Arrow.dx;
                Arrow.rArrow.y = Arrow.dy;
                Arrow.uArrow.x = Arrow.ux;
                Arrow.uArrow.y = Arrow.uy;
                window.requestAnimationFrame(Arrow.core.frame);
            },

            draw: function() {
                Arrow.core.drawArrow(Arrow.rArrow);
                Arrow.core.drawArrow(Arrow.uArrow);
            },

            drawArrow: function(arrow) {
                Arrow.helpers.updateArrow(arrow);
            }
        };

        Arrow.helpers = {
            updateArrow: function(arrow) {
                var tipx = (arrow.x + 1)*Arrow.width/2;
                var tipy = (1 - arrow.y)*Arrow.height/2;
                var fontSize = 12;

                arrow.body.attr('x2', tipx)
                        .attr('y2', tipy);
                arrow.tip.attr('cx', tipx)
                        .attr('cy', tipy);

                if (tipy > 22) {
                    if (tipx < 85) {
                        arrow.text.attr('x', tipx + 10)
                        .attr('y', tipy - 7.5)
                        .attr('font-size', fontSize)
                        .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
                    } else if (tipx < 100) {
                        arrow.text.attr('x', tipx + 10 - 80)
                        .attr('y', tipy - 7.5)
                        .attr('font-size', fontSize)
                        .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
                    } else {
                        arrow.text.attr('x', tipx + 10 - 105)
                        .attr('y', tipy - 7.5)
                        .attr('font-size', fontSize)
                        .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
                    }   
                } else {
                    if (tipx < 85) {
                        arrow.text.attr('x', tipx)
                        .attr('y', tipy + 15)
                        .attr('font-size', fontSize)
                        .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
                    } else if (tipx < 100) {
                        arrow.text.attr('x', tipx - 90)
                        .attr('y', tipy + 15)
                        .attr('font-size', fontSize)
                        .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
                    } else {
                        arrow.text.attr('x', tipx - 110)
                        .attr('y', tipy + 15)
                        .attr('font-size', fontSize)
                        .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
                    }   
                }


            },

            convertCoords: function(sx, sy) {
                var x = 2*sx/Arrow.width - 1;
                var y = 1 - 2*sy/Arrow.height;
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
                return [x, y];
            },
                
            updateAPP: function() {
                Arrow.dx = Arrow.rArrow.x;
                Arrow.dy = Arrow.rArrow.y;

                Arrow.ux = Arrow.uArrow.x;
                Arrow.uy = Arrow.uArrow.y;
            }
        };

        Arrow.setup = {
            initConst: function() {
                Arrow.width = document.getElementById('interactive-arrow').offsetWidth;
                //Arrow.height = document.getElementById('interactive-arrow').offsetHeight;
                Arrow.height = Arrow.width;

                Arrow.strokeWidth = 2;
                Arrow.tipRadius = 5;
            },

            initObjects: function() {
                Arrow.svg = d3.select('#interactive-arrow')
                .append('svg')
                .attr('width', Arrow.width)
                .attr('height', Arrow.height);

                Arrow.svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", Arrow.height)
                .attr("width", Arrow.width)
                .style("stroke", 'black')
                .style("fill", "none")
                .style("stroke-width", 1);

                Arrow.rArrow = {
                    x: Arrow.dx,
                    y: Arrow.dy,
                    stext: 'd'
                };

                Arrow.uArrow = {
                    x: Arrow.ux,
                    y: Arrow.uy,
                    stext: 'u'
                };

                Arrow.setup.initArrow(Arrow.rArrow);
                Arrow.setup.initArrow(Arrow.uArrow);
            },

            initDrag: function() {
                function dragged(arrow) {
                    return function() {
                        var xy = Arrow.helpers.convertCoords(d3.event.x, d3.event.y);
                        arrow.x = xy[0];
                        arrow.y = xy[1];
                        Arrow.helpers.updateArrow(arrow);
                        Arrow.helpers.updateAPP(); // sync arrow values with main vis
                    };
                }
                Arrow.rArrow.tip.call(d3.drag().on('drag', dragged(Arrow.rArrow)));
                Arrow.uArrow.tip.call(d3.drag().on('drag', dragged(Arrow.uArrow)));
            },

            initArrow: function(arrow) {
                arrow.container = Arrow.setup.createArrowContainer();
                arrow.body = Arrow.setup.createArrowBody(arrow);
                arrow.tip = Arrow.setup.createArrowTip(arrow);
                arrow.text = Arrow.setup.createArrowText(arrow);

                Arrow.helpers.updateArrow(arrow);
            },

            createArrowContainer: function() {
                return Arrow.svg.append('svg')
                                .attr('width', Arrow.width)
                                .attr('height', Arrow.height);
            },

            createArrowBody: function(arrow) {
                return arrow.container.append('line')
                                        .attr('x1', Arrow.width/2).attr('y1', Arrow.height/2)
                                        .attr('stroke-width', Arrow.strokeWidth)
                                        .attr('stroke', 'black');
            },

            createArrowTip: function(arrow) {
                return arrow.container.append('circle')
                                    .attr('r', Arrow.tipRadius);
            },

            createArrowText: function(arrow) {
                return arrow.container.append('text');
            }
        };

        document.addEventListener('DOMContentLoaded', Arrow.init);
                
                

    }
    
}
</script>

<style>

</style>