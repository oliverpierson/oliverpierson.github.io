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

(function() {
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext('2d');
    
    var radii = [0.0];
    var centerX = 320;
    var centerY = 320;
    var separation = 50;

    var prevTimeStamp = 0.0;
    var timeOfLastFront = 0.0;
    var c = 25; // wave speed in px per second
    //var wavelength = 16; // in px
    var wavelength = document.getElementById('wavelength').value;
    var T = wavelength/c; 

    function drawWaveCrest(i, time) {
        var radius = radii[i];
        if (radius <= Math.sqrt(2)*(canvas.width/2)) {
            ctx.beginPath();
            ctx.arc(centerX + separation/2, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='red';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX - separation/2, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='red';
            ctx.stroke();

            radii[i] += c*time/1000;
        } else {
            if (i == 0) {
                radii.shift();
            }
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
        for (var i = 0; i < radii.length; ++i) {
            drawWaveCrest(i, timeElapsed);
        }
        if ( radii.length == 0 ) cancelAnimationFrame(requestID);
        //cancelAnimationFrame(requestID);
    }
    requestId = requestAnimationFrame(animate);
})();
