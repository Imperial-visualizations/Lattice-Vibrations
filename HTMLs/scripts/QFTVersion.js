//---------------------------------//
// Visualisation Object            //
//---------------------------------//

window.Vis = window.Vis || {};

Vis.init = function() {
    Vis.isRunning = false;

    Vis.setup.initConsts();
    Vis.setup.initVars();

    Vis.setup.initGraph();
    Vis.setup.initButton();
    Vis.setup.initSlider();

    //Vis.start();
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
                                , Vis.convertCanvasX(Vis.pointR[i]), 0, 2*Math.PI);
            Vis.context.fill();
        }

    },

    updateSliders: function() {

        Vis.xbarRange.value = Vis.xbar;
        Vis.xbarDisplay.textContent = Number(Vis.xbar).toFixed(2);

        Vis.ybarRange.value = Vis.ybar;
        Vis.ybarDisplay.textContent = Number(Vis.ybar).toFixed(2);

        Vis.kxbarRange.value = Vis.kxbar;
        Vis.kxbarDisplay.textContent = Number(Vis.kxbar).toFixed(2);

        Vis.kybarRange.value = Vis.kybar;
        Vis.kybarDisplay.textContent = Number(Vis.kybar).toFixed(2);

        Vis.sigmaRange.value = Vis.sigma;
        Vis.sigmaDisplay.textContent = Number(Vis.sigma).toFixed(2);

    },

}

Vis.workers = {

    calcPos: function() {

        function uk (kx, ky, kx0, ky0, sigma, x0, y0) {
            return Math.pow(2*Math.PI*Math.pow(sigma, 2), -1)*Math.exp(-0.5*(Math.pow(kx-kx0, 2)+Math.pow(ky-ky0, 2)/Math.pow(sigma, 2)))*Math.cos(-(kx*x0+ky*y0));
          }

        var A = Math.pow(4*Vis.sigma, 2)/0.05;     //Normalisation

        for (let i=0; i < Vis.Nx; i++) {
            for (let j=0; j < Vis.Ny; j++) {
                var n = Vis.Ny * i + j;
                var magnitude = 0;
                for (kxcurrent = Vis.kxbar - 2*Vis.sigma; kxcurrent < Vis.kxbar + 2*Vis.sigma; kxcurrent += 0.05) {
                    for (kycurrent = Vis.kybar - 2*Vis.sigma; kycurrent < Vis.kybar + 2*Vis.sigma; kycurrent += 0.05) {
                      kx = kxcurrent*Math.pow(2, -0.5);
                      ky = kycurrent*Math.pow(2, -0.5);
                      w = Math.sqrt(4*Vis.dw*(Math.pow(Math.sin(kx*Vis.a/2), 2)) + Math.pow(Math.sin(ky*Vis.a/2), 2));
                      magnitude += Math.abs(uk(kx, ky, Vis.kxbar, Vis.kybar, Vis.sigma, Vis.xbar, Vis.ybar)*Math.cos(kx*Vis.a*i + ky*Vis.a*j - w*Vis.t));
                    }
                }
                Vis.pointR[n] = Math.pow(0.1 * magnitude / A, 1.5);
            }
        } 
    },
};

Vis.setup = {
    initConsts: function() {
        Vis.a = 0.5; // atomic spacing
        Vis.dw = 1; // debye wavelength

        Vis.Nx = 40; // # of atoms in x direction
        Vis.Ny = 40; // # of atoms in y direction
        Vis.N = Vis.Nx * Vis.Ny;

        Vis.canvasx = 450;
        Vis.canvasy = 450;

        Vis.x = new Array(Vis.N);
        Vis.y = new Array(Vis.N);

        for (let i=0; i < Vis.Nx; i++) {
            for (let j=0; j < Vis.Ny; j++) {
                var n = Vis.Ny * i + j;
                Vis.x[n] = i*Vis.a;
                Vis.y[n] = j*Vis.a;
            }
        } 

    },

    initVars: function() {
        Vis._then = Date.now();

        Vis.xbar = 5;
        Vis.ybar = 5;
        Vis.kxbar = 0.5;
        Vis.kybar = 0.5;
        Vis.sigma = 0.5;

        Vis.pointR = new Array(Vis.N);
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
        Vis.button = document.getElementById('buttonPlay');

        Vis.button.addEventListener('click', function() {
            if (Vis.isRunning) {
                Vis.stop();
            } else {
                Vis.start();
            }
        });
    },

    initSlider: function() {

        Vis.xbarRange = document.getElementById('xbar-range');
        Vis.xbarDisplay = document.getElementById('xbar-display');

        Vis.xbarRange.addEventListener('input', function() {
            Vis.xbar = Vis.xbarRange.value;
            Vis.xbarDisplay.textContent = Vis.xbar;
        });

        Vis.ybarRange = document.getElementById('ybar-range');
        Vis.ybarDisplay = document.getElementById('ybar-display');

        Vis.ybarRange.addEventListener('input', function() {
            Vis.ybar = Vis.ybarRange.value;
            Vis.ybarDisplay.textContent = Vis.ybar;
        });

        Vis.kxbarRange = document.getElementById('kxbar-range');
        Vis.kxbarDisplay = document.getElementById('kxbar-display');

        Vis.kxbarRange.addEventListener('input', function() {
            Vis.kxbar = Vis.kxbarRange.value;
            Vis.kxbarDisplay.textContent = Vis.kxbar;
        });

        Vis.kybarRange = document.getElementById('kybar-range');
        Vis.kybarDisplay = document.getElementById('kybar-display');

        Vis.kybarRange.addEventListener('input', function() {
            Vis.kybar = Vis.kybarRange.value;
            Vis.kybarDisplay.textContent = Vis.kybar;
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