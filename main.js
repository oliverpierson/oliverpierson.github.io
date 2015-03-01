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
    
    var radius = 0;
    var centerX = 320;
    var centerY = 320;

    var prevTimeStamp = 0.0;
    var timeSinceFront = 0.0;
    var c = 25; // wave speed in px per second


    function animate(timeStamp) {
        requestID = requestAnimationFrame(animate);
        if ( prevTimeStamp <= 0.0 ) {
            prevTimeStamp = timeStamp;
            timeSinceFront = timeStamp;
        }
        var timeElapsed = timeStamp - prevTimeStamp;
        prevTimeStamp = timeStamp;

        if (radius <= Math.sqrt(2)*(canvas.width/2)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.strokeStyle='red';
            ctx.stroke();
            radius += c*timeElapsed/1000; 
        } else {
            cancelAnimationFrame(requestID);
        }
    }
    requestId = requestAnimationFrame(animate);
})();
