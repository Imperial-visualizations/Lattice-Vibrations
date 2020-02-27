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
        Vis.workers.calcParams();
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
        Vis.context.arc(Vis.convertCanvasX(Vis.x[Math.round(Vis.N/2)])
                            , Vis.convertCanvasY(Vis.y[Math.round(Vis.N/2)])
                            , Vis.convertCanvasX(Vis.pointR*1.03), 0, 2*Math.PI);
        Vis.context.fill();

    },

    updateSliders: function() {
        Vis.rRange.value = Vis.r;
        Vis.rDisplay.textContent = Number(Vis.r).toFixed(2);

        Vis.uRange.value = Vis.u;
        Vis.uDisplay.textContent = Number(Vis.u).toFixed(2);


    },
};

Vis.workers = {
    calcParams: function() {
        Vis.k = Vis.r * Math.PI / Vis.a;
        Vis.w = Math.sqrt(4*Vis.dw*(Math.pow(Math.sin(Vis.k*Vis.a/2), 2)));
    },

    calcPos: function() {
        for (let i=0; i < Vis.N; i++) {
                let offset = Math.cos(Vis.k*Vis.a*i - Vis.w*Vis.t);

                Vis.x[i] = i*Vis.a + Vis.u * offset;
                Vis.y[i] = Vis.N*Vis.a/2;
        }
    },
}

Vis.setup = {
    initConsts: function() {
        Vis.a = 1; // atomic spacing
        Vis.dw = 1; // debye wavelength

        Vis.N = 20; // # of atoms in x direction


        Vis.canvasx = 450;
        Vis.canvasy = 450;

        Vis.pointR = 0.20 * Vis.a;
    },

    initVars: function() {
        Vis._then = Date.now();

        Vis.r = 0.10; // % of max x wavenumber, (-1, 1)

        Vis.u = -0.50; // x amplitude

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
                                .domain([0, Vis.N*Vis.a])
                                .range([0, Vis.canvasx]);
        Vis.convertCanvasY = d3.scaleLinear()
                                .domain([0, Vis.N*Vis.a])
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
        Vis.rRange = document.getElementById('r-range');
        Vis.rDisplay = document.getElementById('r-display');

        Vis.rRange.addEventListener('input', function() {
            Vis.r = Vis.rRange.value;
            Vis.rDisplay.textContent = Vis.r;

        });

        // u sliders
        Vis.uRange = document.getElementById('uk-range');
        Vis.uDisplay = document.getElementById('uk-display');

        Vis.uRange.addEventListener('input', function() {
            Vis.u = Vis.uRange.value;
            Vis.uDisplay.textContent = Vis.u;

        });

        Vis.core.updateSliders();
    },

};


document.addEventListener('DOMContentLoaded', Vis.init);