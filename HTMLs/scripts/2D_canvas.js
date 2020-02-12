window.Vis = window.Vis || {};

Vis.init = function() {
    Vis.isRunning = false;

    Vis.setup.initConsts();
    Vis.setup.initVars();

    Arrow.init(); // init arrows

    Vis.setup.initGraph();
    //Vis.setup.initButton();
    //Vis.setup.initSlider();

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

        Vis.context.fillStyle = 'green';
        for (let i=0; i < 11; i++) {
            Vis.context.beginPath();
            Vis.context.arc(Vis.convertCanvasX(Vis.phasex[i]), Vis.convertCanvasY(Vis.phasey[i])
                                , Vis.convertCanvasX(Vis.pointR), 0, 2*Math.PI);
            Vis.context.fill();
        }
    },

    updateSliders: function() {
        Vis.rxRange.value = Vis.rx;
        Vis.rxDisplay.textContent = 'rx = ' + Number(Vis.rx).toFixed(2);

        Vis.ryRange.value = Vis.ry;
        Vis.ryDisplay.textContent = 'ry = ' + Number(Vis.ry).toFixed(2);

        Vis.uxRange.value = Vis.ux;
        Vis.uxDisplay.textContent = 'ux = ' + Number(Vis.ux).toFixed(2);

        Vis.uyRange.value = Vis.uy;
        Vis.uyDisplay.textContent = 'uy = ' + Number(Vis.uy).toFixed(2);
    }
}

Vis.workers = {
    calcParams: function() {
        Vis.kx = Vis.rx * Math.PI / Vis.a;
        Vis.ky = Vis.ry * Math.PI / Vis.a;

        Vis.w = 2 * Vis.dw * Math.sqrt(Math.sin(Vis.kx * Vis.a / 2)**2 + Math.sin(Vis.ky * Vis.a / 2)**2);
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

    calcPhase: function() { //broken in general...
        let k = Math.sqrt(Vis.kx**2 + Vis.ky**2);
        let v = Vis.w / k; // broken at small values of k
        let wl = 2 * Math.PI / k;
        let nx = Math.round(Vis.Nx*Vis.a/wl);
        let ny = Math.round(Vis.Ny*Vis.a/wl);
        for (let i=-5; i <= 5; i++) {
            Vis.phasex[i+5] = (Vis.t*v*Vis.kx/k + i*Vis.Nx*Vis.a/2) % (nx * wl);
            Vis.phasey[i+5] = (Vis.t*v*Vis.ky/k + i*Vis.Ny*Vis.a/2) % (ny * wl);
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

        Vis.phasex = new Array(11);
        Vis.phasey = new Array(11);
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
            Vis.rxDisplay.textContent = 'rx = ' + Vis.rx;

            Arrow.rArrow.x = parseFloat(Vis.rx);
            Arrow.core.draw();
        });

        Vis.ryRange = document.getElementById('ry-range');
        Vis.ryDisplay = document.getElementById('ry-display');

        Vis.ryRange.addEventListener('input', function() {
            Vis.ry = Vis.ryRange.value;
            Vis.ryDisplay.textContent = 'ry = ' + Vis.ry;

            Arrow.rArrow.y = parseFloat(Vis.ry);
            Arrow.core.draw();
        });

        // u sliders
        Vis.uxRange = document.getElementById('ux-range');
        Vis.uxDisplay = document.getElementById('ux-display');

        Vis.uxRange.addEventListener('input', function() {
            Vis.ux = Vis.uxRange.value;
            Vis.uxDisplay.textContent = 'ux = ' + Vis.ux;

            Arrow.uArrow.x = parseFloat(Vis.ux);
            Arrow.core.draw();
        });

        Vis.uyRange = document.getElementById('uy-range');
        Vis.uyDisplay = document.getElementById('uy-display');

        Vis.uyRange.addEventListener('input', function() {
            Vis.uy = Vis.uyRange.value;
            Vis.uyDisplay.textContent = 'uy = ' + Vis.uy;

            Arrow.uArrow.y = parseFloat(Vis.uy);
            Arrow.core.draw();
        });

        Vis.core.updateSliders();
    }
}

window.Arrow = window.Arrow || {};

Arrow.init = function() {
    Arrow.setup.initConst();
    Arrow.setup.initObjects();
    Arrow.setup.initDrag();

};

Arrow.core = {
    draw: function() {
        Arrow.core.drawArrow(Arrow.rArrow);
        Arrow.core.drawArrow(Arrow.uArrow);
    },

    drawArrow: function(arrow) {
        Arrow.helpers.updateArrow(arrow);
    }
}

Arrow.helpers = {
    updateArrow: function(arrow) {
        let tipx = (arrow.x + 1)*Arrow.width/2;
        let tipy = (1 - arrow.y)*Arrow.height/2;

        arrow.body.attr('x2', tipx)
                  .attr('y2', tipy);
        arrow.tip.attr('cx', tipx)
                 .attr('cy', tipy);
        arrow.text.attr('x', tipx + 5)
                  .attr('y', tipy - 5)
                  .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) 
                     + ', ' + Number(arrow.y).toFixed(2) + ')');
    },

    convertCoords: function(sx, sy) {
        x = 2*sx/Arrow.width - 1;
        y = 1 - 2*sy/Arrow.height;
        return [x, y]
    },

    updateAPP: function() {
        Vis.rx = Arrow.rArrow.x;
        Vis.ry = Arrow.rArrow.y;

        Vis.ux = Arrow.uArrow.x;
        Vis.uy = Arrow.uArrow.y;
    }
}

Arrow.setup = {
    initConst: function() {
        Arrow.width = window.innerHeight*0.45;
        Arrow.height = window.innerHeight*0.45;

        Arrow.strokeWidth = 2;
        Arrow.tipRadius = 5;
    },

    initObjects: function() {
        Arrow.svg = d3.select('#interactive-arrow');
        Arrow.svg.attr('width', Arrow.width)
                 .attr('height', Arrow.height)
                 .attr('style', 'border: 10px grey');

        Arrow.rArrow = {
            x: Vis.rx,
            y: Vis.ry,
            stext: 'r'
        };

        Arrow.uArrow = {
            x: Vis.ux,
            y: Vis.uy,
            stext: 'u'
        };

        Arrow.setup.initArrow(Arrow.rArrow);
        Arrow.setup.initArrow(Arrow.uArrow);
    },

    initDrag: function() {
        function dragged(arrow) {
            return function() {
                let xy = Arrow.helpers.convertCoords(d3.event.x, d3.event.y);
                arrow.x = xy[0];
                arrow.y = xy[1];
                Arrow.helpers.updateArrow(arrow);
                Arrow.helpers.updateAPP(); // sync arrow values with main vis
                //Vis.core.updateSliders(); // trigger update of sliders in vis
            }
        };
        Arrow.rArrow.tip.call(d3.drag().on('drag', dragged(Arrow.rArrow)));
        Arrow.uArrow.tip.call(d3.drag().on('drag', dragged(Arrow.uArrow)));
    },

    initArrow: function(arrow) {
        arrow.container = Arrow.setup.createArrowContainer();
        arrow.body = Arrow.setup.createArrowBody(arrow);
        arrow.tip = Arrow.setup.createArrowTip(arrow);
        arrow.text = Arrow.setup.createArrowText(arrow);

        Arrow.helpers.updateArrow(arrow);
    },

    createArrowContainer: function() {
        return Arrow.svg.append('svg')
                        .attr('width', Arrow.width)
                        .attr('height', Arrow.height)
    },

    createArrowBody: function(arrow) {
        return arrow.container.append('line')
                                  .attr('x1', Arrow.width/2).attr('y1', Arrow.width/2)
                                  .attr('stroke-width', Arrow.strokeWidth)
                                  .attr('stroke', 'black');
    },

    createArrowTip: function(arrow) {
        return arrow.container.append('circle')
                              .attr('r', Arrow.tipRadius);
    },

    createArrowText: function(arrow) {
        return arrow.container.append('text');
    }
};

document.addEventListener('DOMContentLoaded', Vis.init);