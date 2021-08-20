/*!
 * MainLoopX.js v1.1.0
 * [Back-compatibility: IE9+]
 * Copyright (c) 2021, Emanuel Rojas Vásquez
 * MIT License
 * https://github.com/erovas/MainLoopX.js
 */
(function(window){

    if(window.MainLoopX)
        return console.error('MainLoopX.js has already been defined');

    var ONE_THOUSAND = 1000,

        //Modificables por el programador
        simulationTimeStep = ONE_THOUSAND / 60,
        timeStep = simulationTimeStep,
        frameDelay = simulationTimeStep,
        fpsUpdateInterval = ONE_THOUSAND,
        fpsAlpha = 0.9,
        maxUpdateSteps = 240,  //agregado mio

        //Para calculos del mainloop
        fps = 0,
        frameDelta = 0,
        lastFrameTimeMs = 0,
        elapsedTime = 0,
        lastFpsUpdate = 0,
        framesSinceLastFpsUpdate = 0,
        numUpdateSteps = 0,

        //Para reset a default
        cache_simulationTimeStep = simulationTimeStep,
        cache_timeStep = timeStep,
        cache_frameDelay = frameDelay,
        cache_fpsUpdateInterval = fpsUpdateInterval,
        cache_fpsAlpha = fpsAlpha,

        //Indicadores (flags) del mainloop
        running = false,
        started = false,
        panic = false,

        //Callbacks del mainloop
        NOOP = function() {},
        raw = NOOP,
        begin = NOOP,
        update = NOOP,
        draw = NOOP,
        end = NOOP,
        reset = NOOP,
        
        //Para el "while(true)"
        rAF = window.requestAnimationFrame,
        cAF = window.cancelAnimationFrame,
        rafHandleIndex;

    function isNumber(obj){
        return typeof obj === 'number';
    }

    function isFunction(obj){
        return typeof obj === 'function';
    }

    function animate(timestamp) {

        rafHandleIndex = rAF(animate);
        elapsedTime = timestamp - lastFrameTimeMs;

        raw(fps, panic,   timestamp, frameDelta, lastFrameTimeMs, elapsedTime, lastFpsUpdate, framesSinceLastFpsUpdate, numUpdateSteps);

        //Limitacion de FPS
        if(elapsedTime < frameDelay)
            return;

        frameDelta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp - (elapsedTime % frameDelay);

        begin(fps, panic,   timestamp, frameDelta, lastFrameTimeMs, elapsedTime, lastFpsUpdate, framesSinceLastFpsUpdate, numUpdateSteps);
    
        //Calculo de los FPS
        if (timestamp > lastFpsUpdate + fpsUpdateInterval) {
            fps = fpsAlpha * framesSinceLastFpsUpdate * ONE_THOUSAND / (timestamp - lastFpsUpdate) + (1 - fpsAlpha) * fps;
            lastFpsUpdate = timestamp;
            framesSinceLastFpsUpdate = 0;
        }

        framesSinceLastFpsUpdate++;

        panic = false;
    
        //Simulacion
        numUpdateSteps = 0;
        while (frameDelta >= simulationTimeStep) {
            update(timeStep);
            frameDelta -= simulationTimeStep;

            if (++numUpdateSteps >= maxUpdateSteps) {
                panic = true;
                break;
            }
        }

        //Renderizado
        draw(frameDelta / simulationTimeStep);
    
        // Run any updates that are not dependent on time in the simulation. See
        end(fps, panic,   timestamp, frameDelta, lastFrameTimeMs, elapsedTime, lastFpsUpdate, framesSinceLastFpsUpdate, numUpdateSteps);
    }

    function start(){
        if (started)
            return;

        started = true;
        rafHandleIndex = rAF(function(timestamp) {
            // Render the initial state before any updates occur.
            draw(1);
            running = true;
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesSinceLastFpsUpdate = 0;

            // Start the main loop.
            rafHandleIndex = rAF(animate);
        });
    }

    function stop() {
        running = false;
        started = false;
        cAF(rafHandleIndex);
    }

    function resetDefaultValues(){
        timeStep = cache_timeStep;
        simulationTimeStep = cache_simulationTimeStep;
        frameDelay = cache_frameDelay;
        fpsUpdateInterval = cache_fpsUpdateInterval;
        fpsAlpha = cache_fpsAlpha;
    }

    function resetFrameDelta() {
        var oldFrameDelta = frameDelta;
        frameDelta = 0;
        return oldFrameDelta;
    }

    window.MainLoopX = window.MLX = {

        advanced: {

            get timeStep(){
                return timeStep;
            },
    
            set timeStep(value){
                if(isNumber(value) && value >= 0)
                    timeStep = value;
            },
    
            get simulationTimeStep(){
                return simulationTimeStep;
            },
    
            set simulationTimeStep(value){
                if(isNumber(value) && value > 0)
                    simulationTimeStep = value;
            },
    
            get frameDelay(){
                return frameDelay;
            },
    
            set frameDelay(value){
                if(isNumber(value) && value > 0)
                    frameDelay = value;
            },

            get fpsUpdateInterval(){
                return fpsUpdateInterval;
            },

            set fpsUpdateInterval(value){
                if(isNumber(value) && value >= 0)
                    fpsUpdateInterval = value;
            },

            get fpsAlpha(){
                return fpsAlpha;
            },

            set fpsAlpha(value){
                if(isNumber(value) && value >= 0)
                    fpsAlpha = value;
            },

            get maxUpdateSteps(){
                return maxUpdateSteps;
            },

            set maxUpdateSteps(value){
                if(isNumber(value) && value > 0)
                    maxUpdateSteps = value;
            },

            get FPS(){
                return fps;
            }

        },

        dev: {

            get speed(){
                return Math.round(ONE_THOUSAND / simulationTimeStep);
            },

            set speed(value){
                if(!isNumber(value) || value <= 0 || value > 600)
                    return;

                simulationTimeStep = ONE_THOUSAND / Math.round(value);
            },

            get maxFPS(){
                return Math.round(ONE_THOUSAND / frameDelay);
            },

            set maxFPS(value){
                if(!isNumber(value) || value === Infinity || value <= 0)
                    return;

                fps = Math.round(value);
                frameDelay = ONE_THOUSAND / fps;
            },

            get steps(){
                return Math.round(ONE_THOUSAND / timeStep);
            },

            set steps(value){
                if(!isNumber(value) || value < 1 || value > 144)
                    return;

                timeStep = ONE_THOUSAND /  Math.round(value);
            },

            get FPS(){
                return Math.round(fps);
            }

        },

        get isRunning(){
            return running;
        },

        set raw(fun){
            raw = isFunction(fun)? fun : raw;
        },

        set begin(fun) {
            begin = isFunction(fun)? fun : begin;
        },

        set update(fun){
            update = isFunction(fun)? fun : update;
        },

        set draw(fun){
            draw = isFunction(fun)? fun : draw;
        },

        set end(fun){
            end = isFunction(fun)? fun : end;
        },

        set reset(fun){
            reset = isFunction(fun)? fun : reset;
        },

        resetDefaultValues: resetDefaultValues,

        resetFrameDelta: resetFrameDelta,

        resetUser: function(){
            reset();
        },

        start: start,

        stop: stop
    }

})(window);