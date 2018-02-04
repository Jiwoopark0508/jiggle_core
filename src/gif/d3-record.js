import * as d3 from "d3";

// d3.selection.prototype.record = function(realtime) {
export default function recordTransition(selection, realtime) {
  // console.log(selection);
  let self = this,
    tweeners = [];

  // Get tweeners on each element in the selection
  selection.each(function(d, i) {
    // using .count should work as long as it's called right after the transition is created?
    // can use .active if you wait for the "start" event
    var node = this,
      pending = getTransitions.call(this);

    // console.log(this);
    // console.log(node);
    // console.dir(pending);
    var cumulativeSum = [pending[0].delay];
    for (var j = 1; j < pending.length; j++) {
      cumulativeSum[j] =
        cumulativeSum[j - 1] + pending[j].delay + pending[j].duration;
    }

    pending.forEach(function(transition, i) {
      // Probably unnecessary?
      var ease = transition.ease || id;

      transition.tween.forEach(function(tween) {
        // Create a tweener with the tween function and the element's datum and index
        // Tweens with no change return false
        var tweener = (tween.value.call(node, d, i) || noop).bind(node);

        // Function that calls the tweener with an eased time value
        (function(idx) {
          tweeners.push(function(t) {
            if (realtime) {
              t = relativeTime(t, transition.duration, cumulativeSum[idx]);
            }
            tweener(ease(t));
          });
        })(i);
      });
    });
  });
  // Return a function that takes relative time between 0 and 1,
  // or an absolute number of ms
  return function(t) {
    // Interrupt any active transitions on the selection
    // Cancel any scheduled transitions
    // console.log(selection);
    // console.log(selection._id);
    if (selection._id) {
      selection.selection().interrupt();
    } else {
      selection.interrupt().transition();
    }

    // Apply every tweener function with the provided value t
    // TODO: only call one tweener per attribute based on the time
    tweeners.forEach(function(tweener) {
      tweener(t);
    });
  };

  function getTransitions() {
    // console.log(this);
    const res = d3
      .entries(this.__transition)
      .filter(function(tr) {
        return tr.key !== "active" && tr.key !== "count";
      })
      .map(function(tr) {
        return tr.value;
      });
    // console.log(res);
    return res;
  }

  function relativeTime(ms, duration, delay) {
    return Math.min(1, Math.max(0, (ms - delay) / duration));
  }

  function noop() {}
  function id(d) {
    return d;
  }
}
