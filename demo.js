/**
 * Draw a filled-in circle on the canvas.
 *
 * @param {Number} x
 *   The x-coordinate of the center of the circle.
 * @param {Number} y
 *   The y-coordinate of the center of the circle.
 * @param {Number} r
 *   The radius of the circle.
 * @param {Mixed} [fillStyle]
 *   A canvas fillStyle used to fill the circle. If not specified, the circle
 *   uses the current fillStyle.
 *
 * @member CanvasRenderingContext2D
 */
 CanvasRenderingContext2D.prototype.circle = function(x, y, r, fillStyle) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI, false);
    if (fillStyle) {
        this.fillStyle = fillStyle;
    }
    this.fill();
};

/**
 * The Planet class - an orbiting circle.
 *
 * @param {Object} center
 *   An object with `x` and `y` parameters representing coordinates for the
 *   center of the planet's orbit.
 * @param {Number} radius
 *   The radius of the planet.
 * @param {Number} [orbitRadius=0]
 *   The radius of the planet's orbit.
 * @param {Number} [velocity=0]
 *   The velocity of the planet.
 * @param {String} [color='black']
 *   The color of the planet.
 */
 function Planet(center, radius, orbitRadius, velocity, color) {
    this.center = center;
    this.x = center.x + orbitRadius;
    this.y = center.y;
    this.lastX = this.x;
    this.lastY = this.y;
    this.radius = radius;
    this.orbitRadius = orbitRadius || 0;
    this.velocity = velocity || 0;
    this.theta = 0;
    this.color = color || 'black';
}

/**
 * Updates the planet's position.
 *
 * @param {Number} delta
 *   The amount of time since the last time the planet was updated, in seconds.
 */
 Planet.prototype.update = function(delta) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.theta += this.velocity * delta;
    this.x = this.center.x + Math.cos(this.theta) * this.orbitRadius;
    this.y = this.center.y + Math.sin(this.theta) * this.orbitRadius;
};

/**
 * Draws the planet.
 *
 * @param {Number} interpolationPercentage
 *   How much to interpolate between frames.
 */
 Planet.prototype.draw = function(interpolationPercentage) {
    // Interpolate with the last position to reduce stuttering. (smooth movement)
    var x = this.lastX + (this.x - this.lastX) * interpolationPercentage,
        y = this.lastY + (this.y - this.lastY) * interpolationPercentage;
    /*var x = this.x,
        y = this.y;*/
    context.circle(x, y, this.radius, this.color);
};

/**
 * Updates all planets.
 *
 * @param {Number} delta
 *   The amount of time since the last update, in seconds.
 */
 function update(delta) {
    for (var i = 0, l = planets.length; i < l; i++) {
        planets[i].update(delta);
    }
}

/**
 * Draws all planets.
 *
 * @param {Number} interpolationPercentage
 *   How much to interpolate between frames.
 */
function draw(interpolationPercentage) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0, l = planets.length; i < l; i++) {
        planets[i].draw(interpolationPercentage);
    }
}

/**
 * Updates the FPS counter.
 *
 * @param {Number} fps
 *   The smoothed frames per second.
 * @param {Boolean} panic
 *   Whether the main loop panicked because the simulation fell too far behind
 *   real time.
 */
function end(fps, panic) {
    fpsCounter.textContent = Math.round(fps) + ' FPS';
    //fpsCounter.textContent = fps + ' FPS';
    if (panic) {
        // This pattern introduces non-deterministic behavior, but in this case
        // it's better than the alternative (the application would look like it
        // was running very quickly until the simulation caught up to real
        // time). See the documentation for `MainLoopX.end` for additional
        // explanation.
        var discardedTime = Math.round(MainLoopX.resetFrameDelta());
        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
}

// Set up the canvas.
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    fpsCounter = document.getElementById('fpscounter'),
    fpsValue = document.getElementById('fpsvalue'),
    factorValue = document.getElementById('factorvalue'),
    stepValue = document.getElementById('stepvalue');



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set up the planets.
var smallerDimension = Math.min(window.innerWidth, window.innerHeight),
    earthOrbitRadius = smallerDimension * 0.38,
    moonOrbitRadius = smallerDimension * 0.10,
    moonRadius = smallerDimension * 0.01,
    sunRadius = earthOrbitRadius * 0.5,
    earthRadius = earthOrbitRadius * 0.15,
    sun = new Planet({x: canvas.width*0.5, y: canvas.height * 0.5}, sunRadius, 0, 0, '#FFD000'),
    earth = new Planet(sun, earthRadius, earthOrbitRadius, 0.03 * Math.PI / 180, 'blue'),
    moon = new Planet(earth, moonRadius, moonOrbitRadius, 0.1 * Math.PI / 180, 'gray'),

    jupiter = new Planet(sun, earthRadius, earthOrbitRadius * 2, 0.1 * Math.PI / 180, 'red'),

    planets = [sun, earth, moon, jupiter];

// Start the main loop
MLX.update = update;
MLX.draw = draw;
MLX.end = end;
MLX.start();


//#region CONTROLS

// Update the slider value label while the slider is being dragged.
document.getElementById('fps').addEventListener('input', function() {
    fpsValue.textContent = Math.round(this.value);
    var val = parseInt(this.value, 10);
    MLX.dev.maxFPS = val;
});
// Throttle the FPS when the slider value is set.
document.getElementById('fps').addEventListener('change', function() {
    var val = parseInt(this.value, 10);
    fpsValue.textContent = Math.round(this.value);
    MLX.dev.maxFPS = val;
});

// Update the slider value label while the slider is being dragged.
document.getElementById('factor').addEventListener('input', function() {
    var val = parseFloat(this.value);
    factorValue.textContent = val + ' steps/sec';
    MLX.dev.speed = val;
});

document.getElementById('factor').addEventListener('change', function() {
    var val = parseFloat(this.value);
    factorValue.textContent = val + ' steps/sec';
    MLX.dev.speed = val;
});


// Update the slider value label while the slider is being dragged.
document.getElementById('step').addEventListener('input', function() {
    stepValue.textContent = this.value;
    var val = parseFloat(this.value);
    MLX.dev.steps = val;
});

document.getElementById('step').addEventListener('change', function() {
    var val = parseFloat(this.value);
    stepValue.textContent = val;
    MLX.dev.steps = val;
});

//#endregion