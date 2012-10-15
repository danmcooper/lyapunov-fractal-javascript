var LYAPUNOV = LYAPUNOV || {};

(function() {

	var drawPoint = function (x, y, ctx, colorRGB) {
		ctx.strokeStyle = colorRGB;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x + 1,y + 1);
		ctx.stroke();
	};

	var transForm = function (expon) {
		var isNeg = (expon < 0.0);
		var scaledExp = (Math.abs(expon) / 2.0);
		var color;

		if (isNeg === true) {
			color = [parseInt(scaledExp*512), parseInt(scaledExp*384), 0];
		}
		else {
			color = [parseInt(scaledExp*512), 0, parseInt(scaledExp*256)];
		}

		var rgb = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
	
		console.log(color[0] + "    " + color[1] + "     " + color[2]);
		return rgb;
	};

	LYAPUNOV.drawPoints = function(points, ctx) {
		points.forEach(function(v, i, a) {
			var point = v[0];
			drawPoint(point[2], point[3], ctx, transForm(v[1]));
		});

		// var id = setInterval(function () {
		// 	for(piecelen += 5000; (i < piecelen) && (i < len); i++) {
		// 		var pointExp = computeExponent(pointList[i]);
		// 		var point = pointExp[0];
		// 		drawPoint(point[2], point[3], ctx, transForm(pointExp[1]));
		// 	};
		// 	if (i >= len) {
		// 		clearInterval(id);
		// 		var end = new Date();
		// 		alert("Took " + (end - start) + " millseconds to compute and render.");
		// 	}
		// }, 1/100);		
	};

}());