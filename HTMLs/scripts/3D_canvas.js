//---------------------------------//
// Visualisation Object            //
//---------------------------------//

window.Vis = window.Vis || {};

Vis.init = function() {
    Vis.isRunning = false;

    Vis.setup.initConsts();
    Vis.setup.initVars();

    Vis.setup.initDisplay();
    Vis.setup.initGraph();
    //Vis.setup.initButton();
    Vis.setup.initSlider();

    Vis.start();
};

Vis.start = function() {
    if (Vis._stoptime) {
        Vis._then += Date.now() - Vis._stoptime; // add stopped time
    };

    if (!Vis.isRunning) {
        Vis.core.frame();
        Vis.isRunning = true;
    };
};

Vis.stop = function() {
    window.cancelAnimationFrame(Vis.animationFrameLoop);
    Vis.isRunning = false;
    Vis._stoptime = Date.now(); // record when animation paused
}

Vis.core = {
    frame: function() {
        Vis.t = (Date.now() - Vis._then) / 1000; // time since start in seconds

        Vis.core.update();
        Vis.core.animate();

        Vis.animationFrameLoop = window.requestAnimationFrame(Vis.core.frame);
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
            Vis.context.arc(Vis.convertCanvasX(Vis.x[i]), Vis.convertCanvasY(Vis.y[i])
                                , Vis.convertCanvasX(Vis.pointR), 0, 2*Math.PI);
            Vis.context.fill();
        }
        
        // pick the middle particle to track with a black dot 
        Vis.context.fillStyle = 'black';
        Vis.context.beginPath();
        Vis.context.arc(Vis.convertCanvasX(Vis.x[Math.round(Vis.N/2 - Vis.Ny/2)])
                            , Vis.convertCanvasY(Vis.y[Math.round(Vis.N/2 - Vis.Ny/2)])
                            , Vis.convertCanvasX(Vis.pointR*1.03), 0, 2*Math.PI);
        Vis.context.fill();

        Vis.context.fillStyle = 'green';
        for (let i=0; i < Vis.Nphase; i++) {
            Vis.context.beginPath();
            Vis.context.arc(Vis.convertCanvasX(Vis.phasex[i]), Vis.convertCanvasY(Vis.phasey[i])
                                , Vis.convertCanvasX(Vis.pointR), 0, 2*Math.PI);
            Vis.context.fill();
        }
    },

    updateSliders: function() {
        Vis.rxRange.value = Vis.rx;
        Vis.rxDisplay.textContent = Number(Vis.rx).toFixed(2);

        Vis.ryRange.value = Vis.ry;
        Vis.ryDisplay.textContent = Number(Vis.ry).toFixed(2);

        Vis.uxRange.value = Vis.ux;
        Vis.uxDisplay.textContent = Number(Vis.ux).toFixed(2);

        Vis.uyRange.value = Vis.uy;
        Vis.uyDisplay.textContent = Number(Vis.uy).toFixed(2);

        Vis.core.updateDisplay();
    },

    updateDisplay: function() {
        let ukvec = [Vis.ux, Vis.uy, 0];
        let kx = Vis.rx*Math.PI/Vis.a;
        let ky = Vis.ry*Math.PI/Vis.a;
        let kvec = [kx, ky, 0];

        let dotproduct = Math.round(100*Math.abs(math.dot(kvec, ukvec)))/100;
        Vis.dotDisplay.textContent = dotproduct.toString();

        let crossproduct = Math.round(Math.abs(100*Math.pow((Math.pow(math.cross(kvec, ukvec)[0], 2)
                                                           + Math.pow(math.cross(kvec, ukvec)[1], 2)
                                                           + Math.pow(math.cross(kvec, ukvec)[2], 2)), 0.5)))/100;
        Vis.crossDisplay.textContent = crossproduct.toString();
    }
}

Vis.workers = {
    calcParams: function() {
        Vis.k = Math.sqrt(Vis.kx**2 + Vis.ky**2);
        Vis.kx = Vis.rx * Math.PI / Vis.a;
        Vis.ky = Vis.ry * Math.PI / Vis.a;

        Vis.w = 2 * Vis.dw * Math.sqrt(Math.sin(Vis.kx * Vis.a / 2)**2 
                                     + Math.sin(Vis.ky * Vis.a / 2)**2);

        Vis.dphase = 2*Math.PI/Vis.k; // update spacing of phase tracker 
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

        let m = vy / vx;

        if (m >= -1 && m <= 1) {
            // do y processing
            let spacing = Vis.dphase * Vis.ky / Vis.k; // distance between phases 
            var t_space = spacing / vy;
        } else {
            // do x processing
            let spacing = Vis.dphase * Vis.kx / Vis.k;
            var t_space = spacing / vx;
        };

        let t = Vis.t % (Vis.Nx*t_space/2); // heuristic # of time spacings until wrap around 

        for (let i=0; i < Vis.Nphase; i++) {
            let T = t + (i - Vis.Nphase/2)*t_space; // shift each phase particle 

            if (m >= -1 && m <= 1) {
                // do x processing
                Vis.phasex[i] = T*vx;
                Vis.phasey[i] = (m)*(T*vx - Vis.Nx*Vis.a/2) + Vis.Ny*Vis.a/2;
            } else {
                // do y processing
                Vis.phasex[i] = (1/m)*(T*vy - Vis.Ny*Vis.a/2) + Vis.Nx*Vis.a/2;
                Vis.phasey[i] = T*vy;
            }

            
        }
    }
}

Vis.setup = {
    initConsts: function() {
        Vis.a = 1; // atomic spacing
        Vis.dw = 1; // debye wavelength

        Vis.Nx = 20; // # of atoms in x direction
        Vis.Ny = 20; // # of atoms in y direction
        Vis.N = Vis.Nx * Vis.Ny;

        Vis.Nphase = 2*Vis.Nx;

        Vis.canvasx = 450;
        Vis.canvasy = 450;

        Vis.pointR = 0.20 * Vis.a;
    },

    initVars: function() {
        Vis._then = Date.now();

        Vis.rx = 0.20; // % of max x wavenumber, (-1, 1)
        Vis.ry = 0.50; // % of max y wavenumber, (-1, 1)

        Vis.ux = -0.30; // x amplitude
        Vis.uy = 0.60; // y amplitude

        Vis.x = new Array(Vis.N);
        Vis.y = new Array(Vis.N);

        Vis.phasex = new Array(Vis.Nphase);
        Vis.phasey = new Array(Vis.Nphase);
    },

    initGraph: function() {
        Vis.canvas = d3.select('#canvas-div')
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

    initButton: function() {
        Vis.button = document.getElementById('start-stop');

        Vis.button.addEventListener('click', function() {
            if (Vis.isRunning) {
                Vis.stop();
            } else {
                Vis.start();
            };
        });
    },

    initSlider: function() {
        // r sliders
        Vis.rxRange = document.getElementById('rx-range');
        Vis.rxDisplay = document.getElementById('rx-display');

        Vis.rxRange.addEventListener('input', function() {
            Vis.rx = Vis.rxRange.value;
            Vis.rxDisplay.textContent = Vis.rx;

            Vis.core.updateDisplay();
        });

        Vis.ryRange = document.getElementById('ry-range');
        Vis.ryDisplay = document.getElementById('ry-display');

        Vis.ryRange.addEventListener('input', function() {
            Vis.ry = Vis.ryRange.value;
            Vis.ryDisplay.textContent = Vis.ry;

            Vis.core.updateDisplay();
        });

        // u sliders
        Vis.uxRange = document.getElementById('ukx-range');
        Vis.uxDisplay = document.getElementById('ukx-display');

        Vis.uxRange.addEventListener('input', function() {
            Vis.ux = Vis.uxRange.value;
            Vis.uxDisplay.textContent = Vis.ux;

            Vis.core.updateDisplay();
        });

        Vis.uyRange = document.getElementById('uky-range');
        Vis.uyDisplay = document.getElementById('uky-display');

        Vis.uyRange.addEventListener('input', function() {
            Vis.uy = Vis.uyRange.value;
            Vis.uyDisplay.textContent = Vis.uy;

            Vis.core.updateDisplay();
        });

        Vis.core.updateSliders();
    },

    initDisplay: function() {
        Vis.dotDisplay = document.getElementById("dotproduct");
        Vis.crossDisplay = document.getElementById("crossproduct");
    }
}