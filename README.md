# MainLoopX.js
Provides a well-constructed main loop useful for JavaScript games and other animated or time-dependent applications.

The main loop is a core part of any application in which state changes over time. In games, it is typically responsible for computing physics and AI as well as drawing the result on the screen.

This script is based on [MainLoop.js](https://github.com/IceCreamYou/MainLoop.js), , with any improves.

## API - General

| Property/Method       | Description                                                                                                      |
|-----------------------|------------------------------------------------------------------------------------------------------------------|
| `raw`                 | SET - Sets the function that always runs in the the main loop.                                                   |
| `begin`               | SET - Sets the function that runs at the beginning of the main loop.                                             |
| `update`              | SET - Sets the function that runs updates (e.g. AI and physics).                                                 |
| `draw`                | SET - Sets the function that draws things on the screen.                                                         |
| `end`                 | SET - Sets the function that runs at the end of the main loop.                                                   |
| `reset`               | SET - Sets the function that you can execute with resetUser() method.                                            |
| `isRunning`           | GET - Returns true whether the main loop is currently running.                                                   |
| `resetDefaultValues()`| Reset timers to defaults.                                                                                        |
| `resetDefaultValues()`| Reset the amount of time that has not yet been simulated to zero.                                                |
| `resetUser()`         | Method that executes the reset function defined above                                                            |
| `start()`             | Starts the main loop.                                                                                            |
| `stop()`              | Stops the main loop.                                                                                             |
| `dev`                 | GET - Returns an object (see below).                                                                             |
| `advanced`            | GET - Returns an object (see below).                                                                             |


## API - advanced

| Property/Method       | Description                                                                                                       |
|--------------------------|----------------------------------------------------------------------------------------------------------------|
| `timeStep`               | SET/GET - The amount of time (in milliseconds) to simulate each time update(timeStep). Default value = 1000/60 |
| `simulationTimeStep`     | SET/GET - The amount of time (in milliseconds) to fire update() function. Default value = 1000/60              |
| `frameDelay`             | SET/GET - The amount of time (in milliseconds) to delay next frame. Default value = 1000/60                    |
| `fpsUpdateInterval`      | SET/GET - The minimum duration between updates to the frames-per-second estimate. Default value = 1000         |
| `fpsAlpha`               | SET/GET - A factor that affects how heavily to weight more recent seconds' performance when calculating the average frames per second. Default value =  0.9 |
| `maxUpdateSteps`         | GET/SET - The maximum number of times update() is called in a given frame. Default value = 240                 |
| `FPS`                    | GET - Returns the exponential moving average of the frames per second as float number.                         |


## API - dev

| Property/Method       | Description                                                                                                |
|--------------------------|---------------------------------------------------------------------------------------------------------|
| `speed`               | SET/GET - The speed in steps/second to fire update(). Default = 60, Minimum = 0, Maximum = 600             |
| `steps`               | SET/GET - The amount of steps to simulate each time update(). Default = 60, Minimum = 1, Maximum = 144     |
| `maxFPS`              | SET/GET - Limit the frame rate. Default = 60, Minimum = 1, Maximum = the frame rate of your monitor        |
| `FPS`                 | GET - Returns the exponential moving average of the frames per second as integer number.                   |

## How to use it?

Import the MainLoopX.js JavaScript library wherever you want into the document before using it.

``` html
<script src="MainLoopX.js"></script>
<script>
    MainLoopX.update = function(timeStep){
      //Do logic
    }
  
    MLX.start();
</script>
```

or

``` html
<script defer src="MainLoopX.js"></script>
<script defer src="otherScript.js"></script>
```

or

``` html
<script type="module" src="MainLoopX.js"></script>
<script type="module" src="otherScript.js"></script>
```

or

``` html
<script type="module">
    import "MainLoopX.js";
     MainLoopX.update = function(timeStep){
      //Do logic
    }
  
    MLX.start();
</script>
```

`MainLoopX` works by running functions you define every time the browser is
ready to update the screen (up to about 60 times per second on most monitors).
There are four such functions, all of which are optional. You can set them
using the following methods:

 - `MainLoopX.begin`: the `begin` function runs at the beginning of each
   frame and is typically used to process input.
 - `MainLoopX.update`: the `update` function runs zero or more times per
   frame depending on the frame rate. It is used to compute anything affected
   by time - typically physics and AI movements.
 - `MainLoopX.draw`: the `draw` function should update the screen, usually
   by changing the DOM or painting a canvas.
 - `MainLoopX.end`: the `end` function runs at the end of each frame and is
   typically used for cleanup tasks such as adjusting the visual quality based
   on the frame rate.

The `update` function receives a `delta`/`timestep` parameter which holds the amount of
time in milliseconds that should be simulated. This should be used to calculate
movement. For example, if an object `obj` has an x-axis velocity of 100 units
per second (0.1 units per millisecond), the `update` function might look like
this:

```javascript
function update(timestep) {
    obj.x += 0.1 * delta;
}
```

This structure will ensure that your application behaves regardless of the
frame rate.

To start the application, simply call `MainLoopX.start()`. For example, to start
the application for the first time, you might write:

```javascript
MainLoopX.update = update
MLX.draw = draw
MLX.start();
```

You can call `MainLoopX.stop()`/`MLX.stop()` to stop the application.

## Example

TODO

## Notes

This project is
[MIT-licensed](https://github.com/erovas/MainLoopX.js/blob/main/LICENSE).

Compatible with all modern browsers (IE9+) including mobile browsers, as well
as node.js. There are no dependencies.

