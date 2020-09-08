<template>
    <svg :width="dimensionOfBox" :height="dimensionOfBox">
    
        <rect x="0" y="0" :height="dimensionOfBox" :width="dimensionOfBox" stroke="black" fill="none" stroke-width="1">
        </rect>

        <text :x="slider1_textx" :y="slider1_texty" font-size="12" :text="slider1_text">{{slider1_text}}</text>
        <line :x1="dimensionOfBox/2" :y1="dimensionOfBox/2" :x2="slider1_cx" :y2="slider1_cy" stroke-width="2" stroke='black'></line>
        <circle @mousedown="startSlider1" @mouseup="stopSlider1" r="5" :cx="slider1_cx" :cy="slider1_cy"></circle>

        <text :x="slider2_textx" :y="slider2_texty" font-size="12" :text="slider2_text">{{slider2_text}}</text>
        <line :x1="dimensionOfBox/2" :y1="dimensionOfBox/2" :x2="slider2_cx" :y2="slider2_cy" stroke-width="2" stroke='black'></line>
        <circle @mousedown="startSlider2" @mouseup="stopSlider2" r="5" :cx="slider2_cx" :cy="slider2_cy"></circle>

    </svg>
</template>

<script>
export default {
    props: {
        SVGBoxSize: {
            default: 250
        },
        slider1_name: {
            default: 'd'
        },
        slider2_name: {
            default: 'u'
        }
    },
    data(){
        return{
            dimensionOfBox: this.SVGBoxSize,
            slider1_x: 0.1,
            slider1_y: 0.1, 
            slider2_x: -0.5,
            slider2_y: -0.5, 
            slider1_cx: (1+0.1)*this.SVGBoxSize/2,
            slider1_cy: (1-0.1)*this.SVGBoxSize/2,
            slider2_cx: (1-0.5)*this.SVGBoxSize/2,
            slider2_cy: (1+0.5)*this.SVGBoxSize/2,
            slider1_textx: (1+0.1)*this.SVGBoxSize/2 + 10,
            slider1_texty: (1-0.1)*this.SVGBoxSize/2 + 10,
            slider1_text: this.slider1_name + ' (0.1, 0.1)',
            slider2_textx: (1-0.5)*this.SVGBoxSize/2 + 10,
            slider2_texty: (1+0.5)*this.SVGBoxSize/2 + 10,
            slider2_text: this.slider2_name + ' (-0.5, -0.5)',
            dragOffsetX: null,
            dragOffsetY: null
        }
    },
    methods:{
        refresh(e){
            this.slider1_x = e[0],
            this.slider1_y = e[1],
            this.slider2_x = e[2],
            this.slider2_y = e[3],
            this.slider1_cx = (this.slider1_x + 1)*this.dimensionOfBox/2;
            this.slider1_cy = (1 - this.slider1_y)*this.dimensionOfBox/2;
            this.slider2_cx = (this.slider2_x + 1)*this.dimensionOfBox/2;
            this.slider2_cy = (1 - this.slider2_y)*this.dimensionOfBox/2;
            this.update_slider1_text();
            this.update_slider2_text();
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
        startSlider1() {
            this.dragOffsetX = event.clientX - this.slider1_cx;
            this.dragOffsetY = event.clientY - this.slider1_cy;
            this.$parent.$el.addEventListener('mousemove', this.moveSlider1);
        },
        moveSlider1() {
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
            this.slider1_cx = x;
            this.slider1_cy = y;
            var xy = this.convertCoords(this.slider1_cx, this.slider1_cy);
            this.slider1_x = xy[0];
            this.slider1_y = xy[1];
            this.update_slider1_text();
            this.emitSVG();
        },
        stopSlider1() {
            this.dragOffsetX = this.dragOffsetY = null;
            this.$parent.$el.removeEventListener('mousemove', this.moveSlider1);
        },
        update_slider1_text() {
            this.slider1_text = this.slider1_name + ' (' + Number(this.slider1_x).toFixed(2) + ', ' + Number(this.slider1_y).toFixed(2) + ')';
            if (this.slider1_cx < 0.33*this.dimensionOfBox) {
                this.slider1_textx = this.slider1_cx + 10;
            } else if (this.slider1_cx < 0.67*this.dimensionOfBox) {
                this.slider1_textx = this.slider1_cx - 50;
            } else {
                this.slider1_textx = this.slider1_cx - 90;
            }   
            if (this.slider1_cy < 0.33*this.dimensionOfBox) {
                this.slider1_texty = this.slider1_cy + 20;
            } else {
                this.slider1_texty = this.slider1_cy - 20;
            }  
        },
        startSlider2() {
            this.dragOffsetX = event.clientX - this.slider2_cx;
            this.dragOffsetY = event.clientY - this.slider2_cy;
            this.$parent.$el.addEventListener('mousemove', this.moveSlider2);
        },
        moveSlider2() {
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
            this.slider2_cx = x;
            this.slider2_cy = y;
            var xy = this.convertCoords(this.slider2_cx, this.slider2_cy);
            this.slider2_x = xy[0];
            this.slider2_y = xy[1];
            this.update_slider2_text();
            this.emitSVG();
        },
        stopSlider2() {
            this.dragOffsetX = this.dragOffsetY = null;
            this.$parent.$el.removeEventListener('mousemove', this.moveSlider2);
        },
        update_slider2_text() {
            this.slider2_text = this.slider2_name + ' (' + Number(this.slider2_x).toFixed(2) + ', ' + Number(this.slider2_y).toFixed(2) + ')';
            if (this.slider2_cx < 0.33*this.dimensionOfBox) {
                this.slider2_textx = this.slider2_cx + 10;
            } else if (this.slider2_cx < 0.67*this.dimensionOfBox) {
                this.slider2_textx = this.slider2_cx - 50;
            } else {
                this.slider2_textx = this.slider2_cx - 90;
            }   
            if (this.slider2_cy < 0.33*this.dimensionOfBox) {
                this.slider2_texty = this.slider2_cy + 20;
            } else {
                this.slider2_texty = this.slider2_cy - 20;
            }  
        },
        emitSVG(){
            this.$emit("SVGChanged", [this.slider1_x, this.slider1_y, this.slider2_x, this.slider2_y]);
        }
    }
}
</script>

<style>

</style>