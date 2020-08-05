//---------------------------------------------//
//Code for main vis and svg arrows starts here //
//---------------------------------------------//

function omega_k (dx, dy) {
    return Math.sqrt(4*1*(Math.pow(Math.sin(dx*Math.PI*1/2), 2) + Math.pow(Math.sin(dy*Math.PI*1/2), 2)));
}

var n = 200, values = new Array(n*n);
for (var i = 0; i < n; i++){
    for (var j = 0; j < n ; j++){
        var k = n*i + j;
        var dx = -1 + i/100;
        var dy = -1 + j/100;
        values[k] = omega_k (dx, dy);
    }
}

window.Vis = window.Vis || {};

Vis.init = function() {
    Vis.isRunning = false;

    Vis.setup.initConsts();
    Vis.setup.initVars();

    Arrow.init(); // init arrows

    Vis.setup.initDisplay();
    Vis.setup.initGraph();

    Vis.setup.initSlider();

    Vis.start();
};

Vis.start = function() {
    if (Vis._stoptime) {
        Vis._then += Date.now() - Vis._stoptime; // add stopped time
    }

    if (!Vis.isRunning) {
        Vis.core.frame();
        Vis.isRunning = true;
    }
};

Vis.stop = function() {
    window.cancelAnimationFrame(Vis.animationFrameLoop);
    Vis.isRunning = false;
    Vis._stoptime = Date.now(); // record when animation paused
};

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
    },

    updateSliders: function() {
        Vis.dxRange.value = Vis.dx;
        Vis.dxDisplay.textContent = Number(Vis.dx).toFixed(2);

        Vis.dyRange.value = Vis.dy;
        Vis.dyDisplay.textContent = Number(Vis.dy).toFixed(2);

        Vis.uxRange.value = Vis.ux;
        Vis.uxDisplay.textContent = Number(Vis.ux).toFixed(2);

        Vis.uyRange.value = Vis.uy;
        Vis.uyDisplay.textContent = Number(Vis.uy).toFixed(2);

        Vis.core.updateDisplay();
    },

    updateDisplay: function() {
        let ukvec = [Vis.ux, Vis.uy, 0];
        let kx = Vis.dx*Math.PI/Vis.a;
        let ky = Vis.dy*Math.PI/Vis.a;
        let kvec = [kx, ky, 0];

        let dotproduct = Math.round(100*Math.abs(math.dot(kvec, ukvec)))/100;
        Vis.dotDisplay.textContent = dotproduct.toString();

        let crossproduct = Math.round(Math.abs(100*Math.pow((Math.pow(math.cross(kvec, ukvec)[0], 2) + Math.pow(math.cross(kvec, ukvec)[1], 2) + Math.pow(math.cross(kvec, ukvec)[2], 2)), 0.5)))/100;
        Vis.crossDisplay.textContent = crossproduct.toString();

        slide(Vis.dx, Vis.dy);
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

        Vis.canvasx = 450;
        Vis.canvasy = 450;

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

        //Code for dispersion graph
        Vis.dispersionGraph = d3.select('#dispersion-graph')
                                .append('canvas')
                                .style("position", "relative")
                                .attr('width', 200)
                                .attr('height', 200);

        Vis.dispersionContext = Vis.dispersionGraph.node().getContext('2d');  

        color = d3.scaleSequential(d3.interpolateRdBu).domain([0, 2]);
        path = d3.geoPath(null, Vis.dispersionContext);
        thresholds = d3.range(0, 2, 0.1);
        contours = d3.contours().size([200, 200]);
    
        
        function fill(geometry) {
            Vis.dispersionContext.beginPath();
            path(geometry);
            Vis.dispersionContext.fillStyle = color(geometry.value);
            Vis.dispersionContext.fill();
        }
        
        contours
        .thresholds(thresholds)
        (values)
        .forEach(fill);

        Vis.dispersionSVG = d3.select('#dispersion-graph')
                            .append("svg")
                            .style("position", "absolute")
                            .attr('width', 200)
                            .attr('height', 200)
                            .attr('transform', "translate(-200, 0)");

        Vis.dispersionSVG.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("height", 200)
                            .attr("width", 200)
                            .style("stroke", 'black')
                            .style("fill", "none")
                            .style("stroke-width", 1);

        Vis.dispersionDot = Vis.dispersionSVG
                                .append('circle')
                                .attr("cx", 0)
                                .attr("cy", 0)
                                .attr("r", 3)
                                .attr("fill", "orange");
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
        Vis.dxRange = document.getElementById('dx-range');
        Vis.dxDisplay = document.getElementById('dx-display');

        Vis.dxRange.addEventListener('input', function() {
            Vis.dx = Vis.dxRange.value;
            Vis.dxDisplay.textContent = Vis.dx;

            Arrow.rArrow.x = parseFloat(Vis.dx);
            Arrow.core.draw();

            //refreshDispersion(Vis.dx, Vis.dy);

            Vis.core.updateDisplay();
        });

        Vis.dyRange = document.getElementById('dy-range');
        Vis.dyDisplay = document.getElementById('dy-display');

        Vis.dyRange.addEventListener('input', function() {
            Vis.dy = Vis.dyRange.value;
            Vis.dyDisplay.textContent = Vis.dy;

            Arrow.rArrow.y = parseFloat(Vis.dy);
            Arrow.core.draw();

            //refreshDispersion(Vis.dx, Vis.dy);

            Vis.core.updateDisplay();
        });

        // u sliders
        Vis.uxRange = document.getElementById('ukx-range');
        Vis.uxDisplay = document.getElementById('ukx-display');

        Vis.uxRange.addEventListener('input', function() {
            Vis.ux = Vis.uxRange.value;
            Vis.uxDisplay.textContent = Vis.ux;

            Arrow.uArrow.x = parseFloat(Vis.ux);
            Arrow.core.draw();

            Vis.core.updateDisplay();
        });

        Vis.uyRange = document.getElementById('uky-range');
        Vis.uyDisplay = document.getElementById('uky-display');

        Vis.uyRange.addEventListener('input', function() {
            Vis.uy = Vis.uyRange.value;
            Vis.uyDisplay.textContent = Vis.uy;

            Arrow.uArrow.y = parseFloat(Vis.uy);
            Arrow.core.draw();

            Vis.core.updateDisplay();
        });

        Vis.core.updateSliders();
    },

    initDisplay: function() {
        Vis.dotDisplay = document.getElementById("dotproduct");
        Vis.crossDisplay = document.getElementById("crossproduct");
    }
};

//---------------------------------//
// Interactive Arrow Object        //
//---------------------------------//

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
};

Arrow.helpers = {
    updateArrow: function(arrow) {
        let tipx = (arrow.x + 1)*Arrow.width/2;
        let tipy = (1 - arrow.y)*Arrow.height/2;

        arrow.body.attr('x2', tipx)
                  .attr('y2', tipy);
        arrow.tip.attr('cx', tipx)
                 .attr('cy', tipy);

        if (tipy > 22) {
            if (tipx < 85) {
                arrow.text.attr('x', tipx + 10)
                .attr('y', tipy - 7.5)
                .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
            } else if (tipx < 100) {
                arrow.text.attr('x', tipx + 10 - 80)
                .attr('y', tipy - 7.5)
                .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
            } else {
                arrow.text.attr('x', tipx + 10 - 105)
                .attr('y', tipy - 7.5)
                .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
            }   
        } else {
            if (tipx < 85) {
                arrow.text.attr('x', tipx)
                .attr('y', tipy + 15)
                .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
            } else if (tipx < 100) {
                arrow.text.attr('x', tipx - 90)
                .attr('y', tipy + 15)
                .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
            } else {
                arrow.text.attr('x', tipx - 110)
                .attr('y', tipy + 15)
                .text(arrow.stext + ' (' + Number(arrow.x).toFixed(2) + ', ' + Number(arrow.y).toFixed(2) + ')');
            }   
        }


    },

    convertCoords: function(sx, sy) {
        x = 2*sx/Arrow.width - 1;
        y = 1 - 2*sy/Arrow.height;
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

    updateAPP: function() {
        Vis.dx = Arrow.rArrow.x;
        Vis.dy = Arrow.rArrow.y;

        Vis.ux = Arrow.uArrow.x;
        Vis.uy = Arrow.uArrow.y;
    }
};

Arrow.setup = {
    initConst: function() {
        Arrow.width = window.innerHeight*0.35;
        Arrow.height = window.innerHeight*0.35;

        Arrow.strokeWidth = 2;
        Arrow.tipRadius = 5;
    },

    initObjects: function() {
        Arrow.svg = d3.select('#interactive-arrow');
        Arrow.svg.attr('width', Arrow.width)
                 .attr('height', Arrow.height)
                 .attr('style', 'border: 10px grey');

        Arrow.rArrow = {
            x: Vis.dx,
            y: Vis.dy,
            stext: 'd'
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
                var xy = Arrow.helpers.convertCoords(d3.event.x, d3.event.y);
                arrow.x = xy[0];
                arrow.y = xy[1];
                Arrow.helpers.updateArrow(arrow);
                Arrow.helpers.updateAPP(); // sync arrow values with main vis
                Vis.core.updateSliders(); // trigger update of sliders in vis
            };
        }
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
                        .attr('height', Arrow.height);
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

function slide(dx, dy) {
    Vis.dispersionDot.remove();
    cx = 100*dx+100;
    cy = 100*(1-dy);
    Vis.dispersionDot = Vis.dispersionSVG.append("circle")
                                        .attr("cx", cx)
                                        .attr("cy", cy)
                                        .attr("r", 3)
                                        .attr("fill", "orange");
}