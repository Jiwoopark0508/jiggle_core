import recordTransition from "./d3-record";
import * as d3 from "d3";

export default function makeGIF(
  svgToRender,
  gifToPresent,
  jumpToTime,
  duration,
  frames = 30,
  workers = 1,
  quality = 10
) {
  var gif = new window.GIF({
    workers: workers,
    quality: quality,
    repeat: 0
  });

  // const jumpToTime = recordTransition(transientG, true);

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

  // let promises = [];
  // d3.range(frames).forEach((frm, i) => {
  //   promises.push(
  //     new Promise((resolve, reject) => {
  //       console.log(i);
  //       resolve();
  //     })
  //   );
  // });
  // Promise.all(promises).then(results => {
  //   console.log("Done.");
  // });

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
      serialized = new XMLSerializer().serializeToString(svgToRender.node()),
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
