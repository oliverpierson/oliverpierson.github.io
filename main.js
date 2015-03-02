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
var lastPausedTime = 0.0
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

var radii = [0.0];
function startAnimation() {
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext('2d');
    
    var centerX = 320;
    var centerY = 320;
    var separation = Number(document.getElementById('separation').value);

    var prevTimeStamp = 0.0;
    var timeOfLastFront = 0.0;
    var c = 25; // wave speed in px per second
    //var wavelength = 16; // in px
    var wavelength = Number(document.getElementById('wavelength').value);
    var T = wavelength/c; 
    var startTime = false;
    

    function drawWaveCrestAndTrough(i, time) {
        var radius = radii[i];
        if (radius <= Math.sqrt(2)*(canvas.width/2 + +separation + +wavelength) ) {
            ctx.beginPath();
            ctx.arc(centerX + separation/2, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='grey';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX - separation/2, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='grey';
            ctx.stroke();

            radius = radii[i] - wavelength/2;
            if ( radius > 0 ) {
                ctx.beginPath();
                ctx.arc(centerX + separation/2, centerY, radius, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.strokeStyle='black';
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(centerX - separation/2, centerY, radius, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.strokeStyle='black';
                ctx.stroke();
            }
            radii[i] += c*time/1000;
        } else {
            if (i == 0) {
                radii.shift();
            } else { console.log('radius error.'); }
        }
    }

    function drawWaveTrough(i, time) {
        var radius = radii[i] - wavelength/2;
        if (radius <= Math.sqrt(2)*(canvas.width/2) && radius > 0) {
            ctx.beginPath();
            ctx.arc(centerX + separation/2, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='black';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX - separation/2, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='black';
            ctx.stroke();
        }
    }


    function animate(timeStamp) {
        requestID = requestAnimationFrame(animate);
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
            drawWaveCrestAndTrough(i, timeElapsed);
            //drawWaveTrough(i, timeElapsed);
        }
        if ( radii.length == 0 ) cancelAnimationFrame(requestID);
        if ( paused ) {
            cancelAnimationFrame(requestID);
        }
    }
    requestId = requestAnimationFrame(animate);
}

(function() { startAnimation(); })();
