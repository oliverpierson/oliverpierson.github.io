// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var x = 0;
    for(x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    console.log(vendors[x]);
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    console.log('requestAnimationFrame initialized for: ' + vendors[x]);
}());




var paused = false;
function playOrPause() {
    paused = !paused;
    if ( paused ) {
        document.getElementById('pause').innerHTML = "Play";
    }
    if ( !paused ) {
        document.getElementById('pause').innerHTML = "Pause";
        startAnimation();
    }
}
var updateSources; 

var radii = [0.0];
function startAnimation() {
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.5;
    
    var centerX = canvas.width/2;
    var centerY = canvas.height/2;
    var separation = Number(document.getElementById('separation').value);
    var numOfSources = Number(document.getElementById('numOfSources').value);
    var sources = [];
    updateSources = function() {
        sources = [];
        numOfSources = Number(document.getElementById('numOfSources').value);
        separation = Number(document.getElementById('separation').value);
        for ( var i = 0; i < numOfSources; i++ ) {
            sources.push(centerX - (Math.floor(numOfSources/2) - i)*separation)
        }
    }; 
    updateSources();
    var prevTimeStamp = 0.0;
    var timeOfLastFront = 0.0;
    var c = 25; // wave speed in px per second
    var wavelength = Number(document.getElementById('wavelength').value);
    var T = wavelength/c; 
    
    function drawCircle(x, y, radius, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.strokeStyle=color;
        ctx.stroke();
    }

    function animate(timeStamp) {
        requestID = requestAnimationFrame(animate);
        updateSources();
        if ( prevTimeStamp <= 0.0 ) {
            prevTimeStamp = timeStamp;
            timeOfLastFront = timeStamp;
        }
        var timeElapsed = timeStamp - prevTimeStamp;
        prevTimeStamp = timeStamp;

        if ( (timeStamp - timeOfLastFront)/1000 >= T ) {
            radii.push(0.0);
            timeOfLastFront = timeStamp;
        }
        
        console.log(radii.length);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        wavelength = document.getElementById('wavelength').value;
        T = wavelength/c; 
        separation = document.getElementById('separation').value;
        for (var i = 0; i < radii.length; ++i) {
            for ( var j = 0; j < numOfSources; ++j ) {
                drawCircle(sources[j], centerY, radii[i], '#8b2252');
                if ( radii[i] > wavelength/2 )
                    drawCircle(sources[j], centerY, radii[i] - wavelength/2, '#008282');
            }
            radii[i] += c*timeElapsed/1000;
            if ( radii[i] >=  Math.sqrt(2)*(canvas.width/2 + numOfSources*separation + +wavelength) )
                radii.shift();
        }
        if ( radii.length == 0 ) cancelAnimationFrame(requestID);
        if ( paused ) {
            cancelAnimationFrame(requestID);
        }
    }
    requestId = requestAnimationFrame(animate);
}

(function() { startAnimation(); })();
