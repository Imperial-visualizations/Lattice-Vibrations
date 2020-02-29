//---------------------------------//
// Visualisation Object            //
//---------------------------------//

window.Vis = window.Vis || {};

Vis.init = function() {
    Vis.isRunning = false;

    Vis.setup.initConsts();
    Vis.setup.initVars();

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
        Vis.t = (Date.now() - Vis._then) / 250; // time since start in seconds

        Vis.core.update();
        Vis.core.animate();

        Vis.animationFrameLoop = window.requestAnimationFrame(Vis.core.frame);
    },

    update: function() {
        Vis.workers.calcPos();
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
    },

    updateSliders: function() {
        Vis.kbarRange.value = Vis.kbar;
        Vis.kbarDisplay.textContent = Number(Vis.kbar).toFixed(2);

        Vis.sigmaRange.value = Vis.sigma;
        Vis.sigmaDisplay.textContent = Number(Vis.sigma).toFixed(2);

    },

}

Vis.workers = {

    calcPos: function() {

        function uk (kx, ky, kx0, ky0, sigma, x0, y0) {
            return Math.pow(2*Math.PI*Math.pow(sigma, 2), -1)*Math.exp(-0.5*(Math.pow(kx-kx0, 2)+Math.pow(ky-ky0, 2)/Math.pow(sigma, 2)))*Math.cos(-(kx*x0+ky*y0));
          }

        var A = Math.pow(4*Vis.sigma, 2)/0.1;     //Normalisation

        for (let i=0; i < Vis.Nx; i++) {
            for (let j=0; j < Vis.Ny; j++) {
                var n = Vis.Ny * i + j;
                var xdisp = 0;
                var ydisp = 0;
                for (kxcurrent = Vis.kbar - 2*Vis.sigma; kxcurrent < Vis.kbar + 2*Vis.sigma; kxcurrent += 0.1) {
                    for (kycurrent = Vis.kbar - 2*Vis.sigma; kycurrent < Vis.kbar + 2*Vis.sigma; kycurrent += 0.1) {
                      kx = kxcurrent*Math.pow(2, -0.5);
                      ky = kycurrent*Math.pow(2, -0.5);
                      w = Math.sqrt(4*Vis.dw*(Math.pow(Math.sin(kx*Vis.a/2), 2)) + Math.pow(Math.sin(ky*Vis.a/2), 2));
                      ukx = uk(kx, ky, Vis.kbar, Vis.kbar, Vis.sigma, 5, 5)/A;
                      uky = uk(kx, ky, Vis.kbar, Vis.kbar, Vis.sigma, 5, 5)/A;
                      xdisp += ukx*Math.cos(kx*Vis.a*i + ky*Vis.a*j - w*Vis.t);
                      ydisp += uky*Math.cos(kx*Vis.a*i + ky*Vis.a*j - w*Vis.t);
                    }
                }
                Vis.x[n] = i*Vis.a + xdisp;
                Vis.y[n] = j*Vis.a + ydisp;
            }
        } 
    },
};

Vis.setup = {
    initConsts: function() {
        Vis.a = 1; // atomic spacing
        Vis.dw = 1; // debye wavelength

        Vis.Nx = 20; // # of atoms in x direction
        Vis.Ny = 20; // # of atoms in y direction
        Vis.N = Vis.Nx * Vis.Ny;

        Vis.canvasx = 450;
        Vis.canvasy = 450;

        Vis.pointR = 0.20 * Vis.a;
    },

    initVars: function() {
        Vis._then = Date.now();

        Vis.kbar = 1;
        Vis.sigma = 0.5;

        Vis.x = new Array(Vis.N);
        Vis.y = new Array(Vis.N);
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
            }
        });
    },

    initSlider: function() {
        // r sliders
        Vis.kbarRange = document.getElementById('kbar-range');
        Vis.kbarDisplay = document.getElementById('kbar-display');

        Vis.kbarRange.addEventListener('input', function() {
            Vis.kbar = Vis.kbarRange.value;
            Vis.kbarDisplay.textContent = Vis.kbar;
        });

        Vis.sigmaRange = document.getElementById('sigma-range');
        Vis.sigmaDisplay = document.getElementById('sigma-display');

        Vis.sigmaRange.addEventListener('input', function() {
            Vis.sigma = Vis.sigmaRange.value;
            Vis.sigmaDisplay.textContent = Vis.sigma;
        });

        Vis.core.updateSliders();
    },
};

document.addEventListener('DOMContentLoaded', Vis.init);