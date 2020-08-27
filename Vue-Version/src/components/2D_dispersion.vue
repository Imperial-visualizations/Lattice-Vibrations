<template>
    <div>
        <canvas id="dispersion-graph" :width="dimensionOfBox" :height="dimensionOfBox"></canvas>
        <svg id="dispersion-svg" :width="1.4*dimensionOfBox" :height="dimensionOfBox" :transform="SVGTranslation">
            <rect x="0" y="0" :height="dimensionOfBox" :width="dimensionOfBox" stroke="black" fill="none" stroke-width="1"></rect>
            <rect :x="1.175*dimensionOfBox" :y="0.1*dimensionOfBox" :height="0.8*dimensionOfBox" :width="0.15*dimensionOfBox" stroke="black" fill="none" stroke-width="1"></rect>

            <text :x="dtextx" :y="dtexty" font-size="12" :text="dtext">{{dtext}}</text>
            <circle @mousedown="startdSlider" @mouseup="stopdSlider" r="5" :cx="dcx" :cy="dcy"></circle>
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props: {
        init_length: {
            default: 250
        }
    },
    data(){
        return{
            dimensionOfBox: this.init_length,
            dx: 0.1,
            dy: 0.1, 
            ux: -0.5, 
            uy: -0.5,
            dcx: (1+0.1)*this.init_length/2,
            dcy: (1-0.1)*this.init_length/2,
            ucx: (1-0.5)*this.init_length/2,
            ucy: (1+0.5)*this.init_length/2,
            dtextx: (1+0.1)*this.init_length/2 + 10,
            dtexty: (1-0.1)*this.init_length/2 + 10,
            dtext: 'd (0.1, 0.1)',
            utextx: (1-0.5)*this.init_length/2 + 10,
            utexty: (1+0.5)*this.init_length/2 + 10,
            utext: 'u (-0.5, -0.5)',
            SVGTranslation: "translate(0,"+ -1.025*this.init_length+")",
            dragOffsetX: null,
            dragOffsetY: null
        }
    },
    methods:{
        refresh(e){
            this.dx = e[0],
            this.dy = e[1],
            this.ux = e[2],
            this.uy = e[3],
            this.dcx = (this.dx + 1)*this.dimensionOfBox/2;
            this.dcy = (1 - this.dy)*this.dimensionOfBox/2;
            this.update_dtext();
        },
        convertCoords(cx, cy) {
            var x = 2*cx/this.dimensionOfBox - 1;
            var y = 1 - 2*cy/this.dimensionOfBox;
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
        startdSlider() {
            this.dragOffsetX = event.clientX - this.dcx;
            this.dragOffsetY = event.clientY - this.dcy;
            this.$parent.$el.addEventListener('mousemove', this.movedSlider);
        },
        movedSlider() {
            var x = event.clientX - this.dragOffsetX;
            var y = event.clientY - this.dragOffsetY;
            if (x > this.dimensionOfBox) {
                x = this.dimensionOfBox;
            } else if (x < 0){
                x = 0;
            }
            if (y > this.dimensionOfBox) {
                y = this.dimensionOfBox;
            } else if (y < 0) {
                y = 0;
            }
            this.dcx = x;
            this.dcy = y;
            var xy = this.convertCoords(this.dcx, this.dcy);
            this.dx = xy[0];
            this.dy = xy[1];
            this.update_dtext();
            this.emitSVG();
        },
        stopdSlider() {
            this.dragOffsetX = this.dragOffsetY = null;
            this.$parent.$el.removeEventListener('mousemove', this.movedSlider);
        },
        update_dtext() {
            this.dtext = 'd (' + Number(this.dx).toFixed(2) + ', ' + Number(this.dy).toFixed(2) + ')';
            if (this.dcx < 0.33*this.dimensionOfBox) {
                this.dtextx = this.dcx + 10;
            } else if (this.dcx < 0.67*this.dimensionOfBox) {
                this.dtextx = this.dcx - 50;
            } else {
                this.dtextx = this.dcx - 90;
            }   
            if (this.dcy < 0.33*this.dimensionOfBox) {
                this.dtexty = this.dcy + 20;
            } else {
                this.dtexty = this.dcy - 20;
            }  
        },
        emitSVG(){
            this.$emit("SVGChanged", [this.dx, this.dy, this.ux, this.uy]);
        },
        omega_k(dx, dy) {
            return Math.sqrt(4*1*(Math.pow(Math.sin(dx*Math.PI*1/2), 2) + Math.pow(Math.sin(dy*Math.PI*1/2), 2)));
        }
    },
    mounted(){

        var dispersionGraphWidth = this.dimensionOfBox;
        var dispersionGraphHeight = this.dimensionOfBox;
    
        var nx = dispersionGraphWidth+1, ny = dispersionGraphHeight+1, values = new Array(nx*ny);
        for (var i = 0; i < nx; i++){
            for (var j = 0; j < ny ; j++){
                var k = i + nx*j;
                var dx = -1 + 2*i/nx;
                var dy = -1 + 2*j/ny;
                values[k] = this.omega_k(dx, dy);
            }
        }

        //Code for dispersion graph

        var dispersionGraph = d3.select('#dispersion-graph')
        var dispersionContext = dispersionGraph.node().getContext('2d');  

        //Making contour
        var color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 2.82]);
        var path = d3.geoPath(null, dispersionContext);
        var thresholds = d3.range(0, 2.82, 0.01);
        var contours = d3.contours().size([nx, ny]);
        
        function fillGraph(geometry) {
            dispersionContext.beginPath();
            path(geometry);
            dispersionContext.fillStyle = color(geometry.value);
            dispersionContext.fill();
        }
        
        contours.thresholds(thresholds)(values).forEach(fillGraph);

        //Code for legend
        var legendXOffset = 1.175*dispersionGraphWidth;
        var legendYOffset = 0.1*dispersionGraphHeight;
        var legendHeight = 0.8*dispersionGraphHeight;
        var legendWidth = 0.15*dispersionGraphWidth;
        
        var dispersionSVG = d3.select('#dispersion-svg')
    
        //Add small boxes within legend
        for (i = 0; i < 14 ; i++){
            dispersionSVG.append("rect")
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
        dispersionSVG.append('g')
        .attr("transform", "translate("+ legendXOffset+ ", 0)")  // Position of x axis
        .call(d3.axisLeft(legendScale));

        //Legend scale title
        dispersionSVG.append("text")
        .attr("text-anchor", "end")
        .attr("font-style", "italic")
        .attr('font-size', 10*legendWidth/25)
        .attr("x", legendXOffset+legendWidth)
        .attr("y", legendYOffset/2)
        .text("ω(k) = E/ħ");                    
                
    }
    
}
</script>

<style>

</style>