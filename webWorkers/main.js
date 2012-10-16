var LYAPUNOV = LYAPUNOV || {};

 var go = function () {
	"use strict";

	var createCanvas = function (x, y) {
		var canvas = document.getElementById('lyapunovCanvas');
		canvas.width = x;
		canvas.height = y;
		return canvas.getContext('2d');
	};

	var validate = function() {
		var options = {};
		options.xDimension = parseInt(document.getElementById('x').value);
		options.yDimension = parseInt(document.getElementById('y').value);
		options.getSequence = document.getElementById('pattern').value;
		options.xStart = document.getElementById('xstart').value - 0;
		options.xEnd = document.getElementById('xend').value - 0;
		options.yStart = document.getElementById('ystart').value - 0;
		options.yEnd = document.getElementById('yend').value - 0;		
		options.N = parseInt(document.getElementById('iterations').value);
		options.numberOfWorkers = parseInt(document.getElementById('workers').value);

		if ((options.xDimension > 0) &&
		   (options.yDimension > 0) &&
		   (options.getSequence.length > 0) &&
		   (options.N > 0) &&
		   (options.numberOfWorkers > 0) &&
		   (options.xStart > 0) &&
		   (options.xEnd > 0) &&
		   (options.yStart > 0) &&	   
   		   (options.yEnd > 0)) return options;
		else
			return false;
	}

	var options = validate();

	if (options === false) {
		alert("fix your options!");
		return;
	}

	var ctx = createCanvas(options.xDimension, options.yDimension);

	var time = document.getElementById('time').innerHTML = "Time to complete: Pending...";
    // var lyapWorker = new Worker('lyapunovWorker.js');
    // lyapWorker.addEventListener("message", function (event) {
    //     LYAPUNOV.drawPoints(event.data, ctx);
    //     lyapWorker.terminate();	
    // }, false);
    // lyapWorker.postMessage(options);
    var lyapWorker = [options.numberOfWorkers];
    var start = new Date();
    var threadsGoing = options.numberOfWorkers;

    for (var i = 0; i < options.numberOfWorkers; i++) {
    	options.thisWorker = i;
	    lyapWorker[i] = new Worker('lyapunovWorker.js');
	    lyapWorker[i].addEventListener("message", function (event) {
	        LYAPUNOV.drawPoints(event.data, ctx);
	        this.terminate();
	        threadsGoing--;
	        if (threadsGoing === 0) {
	        	var stop = new Date();
				document.getElementById('time').innerHTML = "Time to complete: " + ((stop - start)/1000) + "seconds.";
	        }
	    }, false);
	    lyapWorker[i].postMessage(options);
    }  

};


window.onload = function()
{
     goButton = document.getElementById("go");

     goButton.onclick = go;
};
