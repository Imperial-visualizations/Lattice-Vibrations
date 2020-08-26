<template>
    <svg id='box' :width="dimensionOfBox" :height="dimensionOfBox">
    
        <rect x="0" y="0" :height="dimensionOfBox" :width="dimensionOfBox" stroke="black" fill="none" stroke-width="1">
        </rect>

        <text :x="dtextx" :y="dtexty" font-size="12" :text="dtext">{{dtext}}</text>
        <line :x1="dimensionOfBox/2" :y1="dimensionOfBox/2" :x2="dcx" :y2="dcy" stroke-width="2" stroke='black'></line>
        <circle @mousedown="startdSlider($event)" @mouseup="stopdSlider" r="5" :cx="dcx" :cy="dcy"></circle>

        <text :x="utextx" :y="utexty" font-size="12" :text="utext">{{utext}}</text>
        <line :x1="dimensionOfBox/2" :y1="dimensionOfBox/2" :x2="ucx" :y2="ucy" stroke-width="2" stroke='black'></line>
        <circle @mousedown="startuSlider($event)" @mouseup="stopuSlider" r="5" :cx="ucx" :cy="ucy"></circle>

    </svg>
</template>

<script>
export default {
    data(){
        return{
            dimensionOfBox: 300,
            dx: 0.1,
            dy: 0.1, 
            ux: -0.5, 
            uy: -0.5,
            dcx: (1+0.1)*300/2,
            dcy: (1+0.1)*300/2,
            ucx: (1-0.5)*300/2,
            ucy: (1-0.5)*300/2,
            dtextx: (1+0.1)*300/2 + 10,
            dtexty: (1+0.1)*300/2 + 10,
            dtext: 'd (0.1, 0.1)',
            utextx: (1-0.5)*300/2 + 10,
            utexty: (1-0.5)*300/2 + 10,
            utext: 'u (-0.5, -0.5)',
            dragOffsetX: null,
            dragOffsetY: null
        }
    },
    methods:{
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
        startdSlider({offsetX, offsetY}) {
            this.dragOffsetX = offsetX - this.dcx;
            this.dragOffsetY = offsetY - this.dcy;
            this.$parent.$el.addEventListener('mousemove', this.movedSlider);
        },
        movedSlider({offsetX, offsetY}) {
            var x = offsetX - this.dragOffsetX;
            var y = offsetY - this.dragOffsetY;
            if (x > 0 && x < this.dimensionOfBox) {
                this.dcx = x;
            }
            if (y > 0 && y < this.dimensionOfBox) {
                this.dcy = y;
            }
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
        startuSlider({offsetX, offsetY}) {
            this.dragOffsetX = offsetX - this.ucx;
            this.dragOffsetY = offsetY - this.ucy;
            this.$parent.$el.addEventListener('mousemove', this.moveuSlider);
        },
        moveuSlider({offsetX, offsetY}) {
            var x = offsetX - this.dragOffsetX;
            var y = offsetY - this.dragOffsetY;
            if (x > 0 && x < this.dimensionOfBox) {
                this.ucx = x;
            }
            if (y > 0 && y < this.dimensionOfBox) {
                this.ucy = y;
            }
            var xy = this.convertCoords(this.ucx, this.ucy);
            this.ux = xy[0];
            this.uy = xy[1];
            this.update_utext();
            this.emitSVG();
        },
        stopuSlider() {
            this.dragOffsetX = this.dragOffsetY = null;
            this.$parent.$el.removeEventListener('mousemove', this.moveuSlider);
        },
        update_utext() {
            this.utext = 'u (' + Number(this.ux).toFixed(2) + ', ' + Number(this.uy).toFixed(2) + ')';
            if (this.ucx < 0.33*this.dimensionOfBox) {
                this.utextx = this.ucx + 10;
            } else if (this.ucx < 0.67*this.dimensionOfBox) {
                this.utextx = this.ucx - 50;
            } else {
                this.utextx = this.ucx - 90;
            }   
            if (this.ucy < 0.33*this.dimensionOfBox) {
                this.utexty = this.ucy + 20;
            } else {
                this.utexty = this.ucy - 20;
            }  
        },
        emitSVG(){
            this.$emit("SVGChanged", [this.dx, this.dy, this.ux, this.uy]);
        }
    },
    mounted(){
        var element = document.getElementById('box');
        var bound = element.getBoundingClientRect();
        var html = document.documentElement;

        this.mainTopOffset = bound.top + window.pageYOffset - html.clientTop;
        this.mainLeftOffset = bound.left + window.pageXOffset - html.clientLeft;
        console.log(bound.top, window.pageYOffset, html.clientTop);
    }
}
</script>

<style>

</style>