function makeGIF(
	svgToRender,
	gifToPresent,
	jumpToTime,
	duration,
	frames,
	workers = 1,
	quality = 10
) {
	var gif = new GIF({
		workers: workers,
		quality: quality,
		repeat: 0
	});

	gif.on("progress", function(p) {
		drawFrame(p * duration);
		// d3.select("#gif").text(d3.format("%")(p) + " rendered");
		gifToPresent.text(d3.format("%")(p) + " rendered");
	});

	gif.on("finished", function(blob) {
		// d3
		//   .select("#gif")
		gifToPresent
			.text("")
			.append("img")
			.attr("src", URL.createObjectURL(blob));

		d3.timer(drawFrame);
	});

	var promises = [];
	d3.range(frames).forEach(function(f) {
		promises.push(
			new Promise(function(resolve, reject) {
				addFrame(f * duration / (frames - 1), resolve);
			})
		);
	});

	Promise.all(promises).then(function(arrOfResults) {
		// svgToRender.style("display", "block");
		gif.render();
	});

	function addFrame(t, resolve) {
		drawFrame(t);
		var img = new Image(),
			serialized = new XMLSerializer().serializeToString(
				svgToRender.node()
			),
			// serialized = new XMLSerializer().serializeToString(svg.node()),
			blob = new Blob([serialized], { type: "image/svg+xml" }),
			url = URL.createObjectURL(blob);

		img.onload = function() {
			gif.addFrame(img, {
				delay: duration / frames,
				copy: true
			});
			resolve();
		};
		img.src = url;
	}

	function drawFrame(t) {
		if (t > duration) {
			t = t % duration;
		}
		jumpToTime(t);
	}
}
