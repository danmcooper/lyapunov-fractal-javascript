/*
#   Copyright [2012] [Dan Cooper]
#   Copyright [2011] [Ryan C. Marcus]

#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.*/

(function () {
	"use strict";


	// get the dimensions of the image
	var xDimension = 800, yDimension = 800, getSequence = "BBBBAAAA", getImgRange = 2.0, getImgOffset = 2.0;

	Array.range = function (a, b, step) {
	    var A = [], s = 'abcdefghijklmnopqrstuvwxyz';
	    if (typeof a === 'number') {
	        A[0] = a;
	        step = step || 1;
	        while (a + step <= b) {
	            A[A.length] = a += step;
	        }
	    } else {
	        if (a === a.toUpperCase()) {
	            b = b.toUpperCase();
	            s = s.toUpperCase();
	        }
	        s = s.substring(s.indexOf(a), s.indexOf(b) + 1);
	        A = s.split('');
	    }

	    return A;
	};

	var getSequenceElement = function (n) {
		return getSequence[n % getSequence.length];
	};

	// a function that returns either the first or 2nd element of a point (x or y) depending on an index of the sequence
	var rFunc = function (point, n) {
		if (getSequenceElement(n) === "A") {
			return point[0];
		} else {
			return point[1];
		}
	};

	var genPoint = function (n) {
		var irange = getImgRange;
		var offset = getImgOffset;
		var unscaled = [n / xDimension, (n % yDimension), Math.floor(n / (xDimension)), (n % (yDimension))];
		unscaled[0] = unscaled[0] / xDimension;
		unscaled[0] = unscaled[0] * irange;
		unscaled[0] = unscaled[0] + offset;

		unscaled[1] = unscaled[1] / yDimension;
		unscaled[1] = unscaled[1] * irange;
		unscaled[1] = unscaled[1] + offset;

		return [unscaled[0], unscaled[1], unscaled[2], unscaled[3]];
	};

	var computeExponent = function (p) {
		var point = genPoint(p), x = 0.5, i, runningSum = 0.0;
		for (i in range) {
			x = rFunc(point, range[i] - 1) * x * (1.0 - x);
			runningSum = runningSum + Math.log(Math.abs(rFunc(point, range[i]) * (1.0 - 2.0*x)));
		}
		runningSum = runningSum * (1.0/N);
		//console.log(point + ", " + runningSum);
		return [point, runningSum];
	};

	var generateFract = function (pointList) {
		return pointList.map(computeExponent);
	};

	var drawPoint = function (x, y, ctx, colorRGB) {
		ctx.strokeStyle = colorRGB;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x + 1,y + 1);
		ctx.stroke();
	};

	var createCanvas = function (x, y) {
		var canvas = document.getElementById('lyapunovCanvas');
		canvas.width = x;
		canvas.height = y;
		return canvas.getContext('2d');
	};

	var transForm = function (expon) {
		var isNeg = (expon < 0.0);
		var scaledExp = (Math.abs(expon) / 2.0);
		var color;

		if (isNeg === true) {
			color = [parseInt(scaledExp*255), parseInt(scaledExp*255), 0];
		}
		else {
			color = [parseInt(scaledExp*255), 0, parseInt(scaledExp*255)];
		}

		var rgb = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
	
		return rgb;
	}

	var pointList = Array.range(0, xDimension * yDimension);
	var N = 200;
	var range = Array.range(1,N,1);
	debugger;
	var theList = generateFract(pointList);
	var ctx = createCanvas(xDimension, yDimension);
	theList.forEach(function(v, i, a) {
		var point = v[0];
		drawPoint(point[2], point[3], ctx, transForm(v[1]));
	});




})();