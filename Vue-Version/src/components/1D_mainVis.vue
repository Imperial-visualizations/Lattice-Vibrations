<template>
    <div id="main-vis" style="height: 35%; width:35%; padding:100px;">
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props:{
        d: {
            default: 0.1,
        },
        u: {
            default: 0.1,
        }
    },
    mounted(){
        //--------------------//
        //Code for main stage //
        //--------------------//
        let Vis = this;

        Vis.init = function() {             //Main initialising function
            Vis.isRunning = false;

            Vis.setup.initConsts();         //Setup constants
            Vis.setup.initVars();           //Initialise variables

            Vis.setup.initGraph();          //Setup Canvas

            Vis.start();                    //Let time run for animation
        };

        Vis.start = function() {
            Vis.core.frame();
            Vis.isRunning = true;
        };

        Vis.core = {
            frame: function() {
                Vis.t = (Date.now() - Vis._then) / 250; // time since start in seconds

                Vis.core.update();
                Vis.core.animate();
                window.requestAnimationFrame(Vis.core.frame);
            },

            update: function() {
                Vis.workers.calcParams();                                               //Calculate new k in First Brillouin Zone
                Vis.workers.calcPos();                                                  //Calculate new positions
            },

            animate: function() {
                Vis.context.clearRect(0, 0, Vis.canvasx, Vis.canvasy);                  //Redraw blank canvas
                
                Vis.context.fillStyle = 'orange';
                for (var i=0; i < Vis.N; i++) {                                         //Draw individual circles
                    Vis.context.beginPath();
                    Vis.context.arc(Vis.convertCanvasX(Vis.x[i]), Vis.convertCanvasY(Vis.y[i]), Vis.convertCanvasX(Vis.pointD), 0, 2*Math.PI);
                    Vis.context.fill();
                }
                
                // pick a particle to track with a black dot 
                Vis.context.fillStyle = 'black';
                Vis.context.beginPath();
                Vis.context.arc(Vis.convertCanvasX(Vis.x[Math.round(Vis.N/2)]), Vis.convertCanvasY(Vis.y[Math.round(Vis.N/2)]), Vis.convertCanvasX(Vis.pointD*1.03), 0, 2*Math.PI);
                Vis.context.fill();

            },
        };

        Vis.workers = {
            calcParams: function() {                                    //Calculation of k in First Brillouin Zone
                Vis.k = Vis.d * Math.PI / Vis.a;
                var dtemporary = Vis.d%2;
                if (Vis.d > 0 && dtemporary > 1) {Vis.dFBZ = dtemporary - 2; }
                else if (Vis.d < 0 && dtemporary < -1) {Vis.dFBZ = dtemporary + 2; }
                else {Vis.dFBZ = dtemporary;}
                Vis.w = Math.sqrt(4*Vis.dw*(Math.pow(Math.sin(Vis.k*Vis.a/2), 2)));
            },

            calcPos: function() {                                       //Calculation of new atomic positions
                for (var i=0; i < Vis.N; i++) {
                        var offset = Math.cos(Vis.k*Vis.a*i - Vis.w*Vis.t);

                        Vis.x[i] = i*Vis.a + Vis.u * offset;
                        Vis.y[i] = Vis.N*Vis.a/2;
                }
            },
        };

        Vis.setup = {
            initConsts: function() {
                Vis.a = 1;                  //Atomic spacing
                Vis.dw = 1;                 //Debye wavelength

                Vis.N = 20;                 //Number of atoms in x direction

                Vis.canvasx = document.getElementById('main-vis').offsetWidth;
                Vis.canvasy = document.getElementById('main-vis').offsetHeight;

                Vis.pointD = 0.20 * Vis.a;  //Atomic radius
            },

            initVars: function() {
                Vis._then = Date.now();

                Vis.d = 0.10;               //k = (pi/a)*d
                Vis.dFBZ = 0.10;            //d in the First Brillouin Zone

                Vis.u = -0.50;              //Oscillation amplitude

                Vis.x = new Array(Vis.N);   //Empty array for atomic x positions
                Vis.y = new Array(Vis.N);   //Empty array for atomic y positions

            },

            initGraph: function() {         //Setup the canvas to the right scale
                Vis.canvas = d3.select('#main-vis')
                            .append('canvas')
                                .attr('width', Vis.canvasx)
                                .attr('height', Vis.canvasy);
                Vis.context = Vis.canvas.node().getContext('2d');

                Vis.convertCanvasX = d3.scaleLinear()                   //x range
                                        .domain([0, Vis.N*Vis.a])
                                        .range([0, Vis.canvasx]);
                Vis.convertCanvasY = d3.scaleLinear()                   //y range
                                        .domain([0, Vis.N*Vis.a])
                                        .range([Vis.canvasy, 0]);
            },


        };

        document.addEventListener('DOMContentLoaded', Vis.init);
                
                

    }
    
}
</script>

<style>

</style>