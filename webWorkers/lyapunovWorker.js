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
	var xDimension;
	var yDimension;
	var getSequence;
	var getImgRange;
	var getImgOffset;
	var N;

	function messageHandler(event) {
		var data = calcBlockOfPoints(event.data);
		data.isData = true;
	    this.postMessage(data);
	}

	// Defining the callback function raised when the main page will call us
	this.addEventListener('message', messageHandler, false);

	Array.range = function (a, b, step) {
	    var A = [];

        A[0] = a;
        step = step || 1;
        while (a + step < b) {
            A[A.length] = a += step;
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
		var unscaled = [n / xDimension, (n % yDimension), Math.floor(n / (xDimension)), (n % (yDimension))];
		unscaled[0] = unscaled[0] / xDimension;
		unscaled[0] = unscaled[0] * xRange;
		unscaled[0] = unscaled[0] + xOffset;

		unscaled[1] = unscaled[1] / yDimension;
		unscaled[1] = unscaled[1] * yRange;
		unscaled[1] = unscaled[1] + yOffset;

		return [unscaled[0], unscaled[1], unscaled[2], unscaled[3]];
	};

	var computeExponent = function (p) {
		var point = genPoint(p), x = 0.5, i, runningSum = 0.0;
		for (i in rangeN) {
			x = rFunc(point, rangeN[i] - 1) * x * (1.0 - x);
			runningSum = runningSum + Math.log(Math.abs(rFunc(point, rangeN[i]) * (1.0 - 2.0*x)));
		}
		runningSum = runningSum * (1.0/N);
		//console.log(point + ", " + runningSum);
		return [point, runningSum];
	};

	var generateFract = function (pointList) {
		return pointList.map(computeExponent);
	};

	var calcBlockOfPoints = function (options) {
		xDimension = options.xDimension;
		yDimension = options.yDimension;
		getSequence = options.getSequence;
		xRange = options.xEnd - options.xStart;
		xOffset = options.xStart;
		yRange = options.yEnd - options.yStart;
		yOffset = options.yStart;
		N = options.N;
		var start = (xDimension * yDimension * options.thisWorker)/options.numberOfWorkers;
		var end = start + (xDimension * yDimension / options.numberOfWorkers);
		var pointList = Array.range(start, end, 1);
		rangeN = Array.range(1,N,1);

		return generateFract(pointList);
	};

	var rangeN;
}());