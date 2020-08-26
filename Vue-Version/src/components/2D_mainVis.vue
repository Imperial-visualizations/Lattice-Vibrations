<template>
    <div id="main-vis" style="height: 35%; width:35%; padding:50px;">
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
    mounted(){
        //--------------------//
        //Code for main stage //
        //--------------------//
        let Vis = this;

        Vis.init = function() {
            Vis.isRunning = false;

            Vis.setup.initConsts();
            Vis.setup.initVars();

            Vis.setup.initGraph();

            Vis.start();
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
                Vis.workers.calcParams();
                Vis.workers.calcPos();
                Vis.workers.calcPhase();
            },

            animate: function() {
                Vis.context.clearRect(0, 0, Vis.canvasx, Vis.canvasy);
                
                Vis.context.fillStyle = 'orange';
                for (let i=0; i < Vis.N; i++) {
                    Vis.context.beginPath();
                    Vis.context.arc(Vis.convertCanvasX(Vis.x[i]), Vis.convertCanvasY(Vis.y[i]), Vis.convertCanvasX(Vis.pointR), 0, 2*Math.PI);
                    Vis.context.fill();
                }
                
                // pick the middle particle to track with a black dot 
                Vis.context.fillStyle = 'black';
                Vis.context.beginPath();
                Vis.context.arc(Vis.convertCanvasX(Vis.x[Math.round(Vis.N/2 - Vis.Ny/2)]), Vis.convertCanvasY(Vis.y[Math.round(Vis.N/2 - Vis.Ny/2)]), Vis.convertCanvasX(Vis.pointR*1.03), 0, 2*Math.PI);
                Vis.context.fill();

                // draw phase track
                Vis.context.strokeStyle = 'green';
                Vis.context.lineWidth = 3;
                for (let i=0; i < Vis.Nphase; i++) {
                    Vis.context.beginPath();
                    Vis.context.moveTo(Vis.convertCanvasX(Vis.phasex[2*i]), Vis.convertCanvasY(Vis.phasey[2*i]));
                    Vis.context.lineTo(Vis.convertCanvasX(Vis.phasex[2*i+1]), Vis.convertCanvasY(Vis.phasey[2*i+1]));
                    Vis.context.stroke();
                }
            }
        };

        Vis.workers = {
            calcParams: function() {
                Vis.k = Math.sqrt(Vis.kx**2 + Vis.ky**2);
                Vis.kx = Vis.dx * Math.PI / Vis.a;
                Vis.ky = Vis.dy * Math.PI / Vis.a;

                Vis.w = 2 * Vis.dw * Math.sqrt(Math.sin(Vis.kx * Vis.a / 2)**2 + Math.sin(Vis.ky * Vis.a / 2)**2);

                Vis.lamb = 2*Math.PI/Vis.k; // update spacing of phase tracker 
            },

            calcPos: function() {
                for (let i=0; i < Vis.Nx; i++) {
                    for (let j=0; j < Vis.Ny; j++) {
                        let n = Vis.Ny * i + j;
                        let offset = Math.cos(Vis.kx*Vis.a*i + Vis.ky*Vis.a*j - Vis.w*Vis.t);

                        Vis.x[n] = i*Vis.a + Vis.ux * offset;
                        Vis.y[n] = j*Vis.a + Vis.uy * offset;
                    }
                }
            },

            calcPhase: function() {
                let v = Vis.w / Vis.k;
                let vx = v * Vis.kx / Vis.k;
                let vy = v * Vis.ky / Vis.k;

                let m = vy / vx;                // gradient of line
                let mi = vx / vy;               // inverse of gradient

                var spacing;
                var t_space;
                if (m >= -1 && m <= 1) {
                    // do y processing
                    spacing = Vis.lamb * Vis.ky / Vis.k; // distance between phases 
                    if (vy == 0) {
                        mi = 10000000;
                        t_space = 20;
                    } else {
                        t_space = spacing / vy;
                    }
                } else {
                    // do x processing
                    spacing = Vis.lamb * Vis.kx / Vis.k;
                    if (vx == 0) {
                        m = 10000000;
                        t_space = 20;
                    } else {
                        t_space = spacing / vx;
                    }
                }

                let offset = 10;
                let t = Vis.t % (Vis.Nx*t_space/2); // heuristic # of time spacings until wrap around 

                for (let i=0; i < Vis.Nphase; i++) {
                    let T = t + (i - Vis.Nphase/2)*t_space + Vis.shift; // shift each phase particle 
                                            // (+1 heuristic to get phase correct)

                    if (m >= -1 && m <= 1) {
                        // do x processing
                        let x = T*vx;
                        let y = m*(T*vx - Vis.Nx*Vis.a/2) + Vis.Ny*Vis.a/2;

                        Vis.phasex[2*i] = x - offset;
                        Vis.phasey[2*i] = y + mi*offset;

                        Vis.phasex[2*i+1] = x + offset;
                        Vis.phasey[2*i+1] = y - mi*offset;
                    } else {
                        // do y processing
                        let x = mi*(T*vy - Vis.Ny*Vis.a/2) + Vis.Nx*Vis.a/2;
                        let y = T*vy;

                        Vis.phasex[2*i] = x + m*offset;
                        Vis.phasey[2*i] = y - offset;

                        Vis.phasex[2*i+1] = x - m*offset;
                        Vis.phasey[2*i+1] = y + offset;
                    }

                    
                }
            }
        };

        Vis.setup = {
            initConsts: function() {
                Vis.a = 1; // atomic spacing
                Vis.dw = 1; // debye wavelength

                Vis.Nx = 20; // # of atoms in x direction
                Vis.Ny = 20; // # of atoms in y direction
                Vis.N = Vis.Nx * Vis.Ny;

                Vis.Nphase = 2*Vis.Nx;

                Vis.canvasx = document.getElementById('main-vis').offsetWidth;
                //Vis.canvasy = document.getElementById('main-vis').offsetHeight;
                Vis.canvasy = Vis.canvasx;

                Vis.pointR = 0.20 * Vis.a;
            },

            initVars: function() {
                Vis._then = Date.now();

                Vis.dx = 0.10; // % of max x wavenumber, (-1, 1)
                Vis.dy = 0.10; // % of max y wavenumber, (-1, 1)

                Vis.ux = -0.50; // x amplitude
                Vis.uy = -0.50; // y amplitude

                Vis.x = new Array(Vis.N);
                Vis.y = new Array(Vis.N);

                Vis.shift = -5.3;

                Vis.phasex = new Array(2*Vis.Nphase); // requires two points to draw a line
                Vis.phasey = new Array(2*Vis.Nphase);
            },

            initGraph: function() {
                //Code for main-vis
                Vis.canvas = d3.select('#main-vis')
                            .append('canvas')
                                .attr('width', Vis.canvasx)
                                .attr('height', Vis.canvasy);
                Vis.context = Vis.canvas.node().getContext('2d');

                Vis.convertCanvasX = d3.scaleLinear()
                                        .domain([0, Vis.Nx*Vis.a])
                                        .range([0, Vis.canvasx]);
                Vis.convertCanvasY = d3.scaleLinear()
                                        .domain([0, Vis.Ny*Vis.a])
                                        .range([Vis.canvasy, 0]);                
            },
        };

        document.addEventListener('DOMContentLoaded', Vis.init);
                
                

    }
    
}
</script>

<style>

</style>