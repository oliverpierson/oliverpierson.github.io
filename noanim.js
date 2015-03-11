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



var updateSeparation,
    updateWavelength,
    updateCanvas,
    updateSources;

// adapted from stackoverflow
function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    var div = document.getElementById('stage');
    var mouseX = event.pageX - div.offsetLeft;
        mouseY = event.pageY - div.offsetTop;
    if ( mouseX >= 0 && mouseX <= div.width &&
         mouseY >= 0 && mouseY <= div.height ) {
        document.getElementById('mouseX').innerHTML = mouseX - div.width/2;
        document.getElementById('mouseY').innerHTML = div.height/2 - mouseY;
     } else {
        document.getElementById('mouseX').innerHTML = "";
        document.getElementById('mouseY').innerHTML = "";
     }

}

function setupCanvas() {
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.5;
    
    var radii = [0.0],
        centerX = canvas.width/2,
        centerY = canvas.height/2,
        c = 25, // wave speed in px per second
        separation,
        wavelength,
        numOfSources,
        sources = [];

    updateSources = function() {
        sources = [];
        numOfSources = Number(document.getElementById('numOfSources').value);
        separation = Number(document.getElementById('separation').value);
        if ( numOfSources % 2 == 0 ) {
            for ( var i = 0; i < numOfSources; i++ ) {
                sources.push(centerX - numOfSources*separation/2.0 + i*separation + separation/2.0);
                //sources.push(centerX - separation/2 + i*separation);
            }
        } else {
            for ( var i = 0; i < numOfSources; i++ ) {
                sources.push(centerX - Math.floor(numOfSources/2.0)*separation + i*separation);
                //sources.push(centerX - (Math.floor(numOfSources/2) - i)*separation)
            }
        }
        updateCanvas();
    }; 
   
    updateSeparation = function () {
        separation = Number(document.getElementById('separation').value);
        updateSources();
        updateCanvas();
    };

    updateWavelength= function (){
        wavelength = Number(document.getElementById('wavelength').value);
        T = wavelength/c;
        ctx.lineWidth = wavelength/6;
        updateCanvas();
    };

    function drawCircle(x, y, radius, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.strokeStyle=color;
        ctx.stroke();
    };

    updateCanvas = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for( r = 0; 
             r <= Math.sqrt(2)*(canvas.width/2 + numOfSources*separation + +wavelength);
             r += wavelength ) {
                 sources.forEach( function (source) {
                     drawCircle(source, centerY, r, "#8b2552");
                     if ( r > wavelength/2 )
                         drawCircle(source, centerY, r - wavelength/2, "#008282");
                 } ) } };

    updateSources();
    updateSeparation();
    updateWavelength();
    updateCanvas();
}

(function() { 
    document.onmousemove= handleMouseMove;
    setupCanvas();
    updateCanvas();
})();
