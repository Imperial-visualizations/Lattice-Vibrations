<template>
    <div id="main-vis" style="height: 50%; width:50%; padding:5px 50px 0px 70px;">
        <canvas id="canvas-div"></canvas>
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as THREE from 'three';

export default {
    props:{
        dx: {
            default: 0.5,
        },
        dy: {
            default: 0.0,
        },
        dz: {
            default: 0.0,
        },
        ux: {
            default: 0.0,
        },
        uy: {
            default: 0.0,
        },
        uz: {
            default: 0.5,
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

            //Vis.setup.initGraph();
            Vis.setup.initScene();

            Vis.start();
        };

        Vis.start = function() {
            Vis.core.frame();
            Vis.isRunning = true;
        };

        Vis.core = {
            frame: function() {
                Vis.t = (Date.now() - Vis._then) / 500; // time since start in seconds

                Vis.core.update();
                Vis.core.animate();

                window.requestAnimationFrame(Vis.core.frame);
            },

            update: function() {
                Vis.workers.calcParams();
                Vis.workers.calcPos();
            },

            animate: function() {
                for (let n=0; n<Vis.N; n++) {
                    Vis.spheres[n].position.set(Vis.x[n], Vis.y[n], Vis.z[n]);
                }

                Vis.renderer.render(Vis.scene, Vis.camera);
                
            },

        };

        Vis.workers = {
            calcParams: function() {
                Vis.k = Math.sqrt(Vis.kx**2 + Vis.ky**2 + Vis.kz**2);
                Vis.kx = Vis.dx * Math.PI / Vis.a;
                Vis.ky = Vis.dy * Math.PI / Vis.a;
                Vis.kz = Vis.dz * Math.PI / Vis.a;

                Vis.w = 2 * Vis.dw * Math.sqrt(Math.sin(Vis.kx * Vis.a / 2)**2 + Math.sin(Vis.ky * Vis.a / 2)**2 + Math.sin(Vis.kz * Vis.a / 2)**2);

                Vis.dphase = 2*Math.PI/Vis.k; // update spacing of phase tracker 
            },

            calcPos: function() {
                for (let i=0; i < Vis.Nx; i++) {
                    for (let j=0; j < Vis.Ny; j++) {
                        for (let k=0; k < Vis.Nz; k++) {
                            let n = Vis.Ny*Vis.Nz*i + Vis.Nz*j + k;
                            let offset = Math.cos( Vis.kx*Vis.a*i + Vis.ky*Vis.a*j + Vis.kz*Vis.a*k - Vis.w*Vis.t);
            
                            Vis.x[n] = i*Vis.a + Vis.ukx * offset;
                            Vis.y[n] = j*Vis.a + Vis.uky * offset;
                            Vis.z[n] = k*Vis.a + Vis.ukz * offset;
                        }
                    }
                }
            },

        };

        Vis.setup = {
            initConsts: function() {
                Vis.a = 1; // atomic spacing
                Vis.dw = 1; // debye wavelength

                Vis.Nx = 10; // # of atoms in x direction
                Vis.Ny = 10; // # of atoms in y direction
                Vis.Nz = 10; // # of atoms in z direction
                Vis.N = Vis.Nx * Vis.Ny * Vis.Nz;

                Vis.Nphase = 2*Vis.Nx;

                Vis.canvasx = document.getElementById('main-vis').offsetWidth;
                //Vis.canvasy = document.getElementById('main-vis').offsetHeight;
                Vis.canvasy = Vis.canvasx;

                Vis.pointR = 0.10 * Vis.a;
            },

            initVars: function() {
                Vis._then = Date.now();

                Vis.dx = 0.5; // % of max x wavenumber, (-1, 1)
                Vis.dy = 0; // % of max y wavenumber, (-1, 1)
                Vis.dz = 0; // % of max z wavenumber, (-1, 1)

                Vis.ukx = 0; // x amplitude
                Vis.uky = 0; // y amplitude
                Vis.ukz = 0.5; // z amplitude

                Vis.x = new Array(Vis.N);
                Vis.y = new Array(Vis.N);
                Vis.z = new Array(Vis.N);
                Vis.spheres = new Array(Vis.N);
            },

            // initGraph: function() {
            //     Vis.canvas = d3.select('#main-vis')
            //                 .append('canvas')
            //                     .attr('width', Vis.canvasx)
            //                     .attr('height', Vis.canvasy);
            //     Vis.context = Vis.canvas.node().getContext('2d');

            //     Vis.convertCanvasX = d3.scaleLinear()
            //                             .domain([0, Vis.Nx*Vis.a])
            //                             .range([0, Vis.canvasx]);
            //     Vis.convertCanvasY = d3.scaleLinear()
            //                             .domain([0, Vis.Ny*Vis.a])
            //                             .range([Vis.canvasy, 0]);
            // },

            initScene: function() {
                Vis.scene = new THREE.Scene();
                Vis.scene.background = new THREE.Color( 0xffffff );
                
                Vis.camera = new THREE.PerspectiveCamera( 75, Vis.canvasx/Vis.canvasy, 0.1, 1000 );
                Vis.camera.position.set(-0.8, 0, -0.8);
                Vis.camera.lookAt(new THREE.Vector3(0,0.6,0));

                Vis.renderer = new THREE.WebGLRenderer({ 
                    antialias: true,
                    canvas: document.getElementById('canvas-div')
                });
                Vis.renderer.setSize(Vis.canvasx, Vis.canvasy);
                // document.getElementById('canvas-div').appendChild(Vis.renderer.domElement);

                for (let n=0; n<Vis.N; n++) {
                    let geometry = new THREE.SphereBufferGeometry(Vis.pointR, 10, 10);
                    let material = new THREE.MeshBasicMaterial( { 
                        color: new THREE.Color("hsl(" + Number(360*n/(Vis.N-1)).toFixed(2) + ", 60%, 52%)") 
                    } );
                    let sphere = new THREE.Mesh( geometry, material );
                    Vis.spheres[n] = sphere;
                    
                    Vis.scene.add(sphere);
                }
            },

        };

        document.addEventListener('DOMContentLoaded', Vis.init);
                
                

    }
    
}
</script>

<style>
html{
    overflow:hidden;
}
</style>