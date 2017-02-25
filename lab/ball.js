//shim for requestAnimationFrame API
(function () {
    "use strict";

    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x;

    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            window.clearTimeout(id);
        };
    }
}());

(function () {
	var G = 0.7,

		color = ['#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a','#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b','#c49c94','#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d','#17becf','#9edae5'],
		
		ni = true,

		ci = 0,

		status = 'on',

		svg = d3.select('svg'),

		_nextTick = function () {
			svg.selectAll("ellipse").remove();
			svg.selectAll('circle')
				.filter(function (d) {
					var x = parseInt(d3.select(this).attr('cx')),
						y = parseInt(d3.select(this).attr('cy'));
					return x < -d.r || x > 800 + d.r || (y > 400 && Math.abs(d.y) < 1) || Math.abs(d.x) < 1;
				})
				.remove();

			svg.selectAll('circle')
				.attr('cx', function (d) {
					return parseInt(d3.select(this).attr('cx')) + d.x;
				})
				.attr('cy', function (d) {
					d.y += G;
					return parseInt(d3.select(this).attr('cy')) + d.y - G / 2;
				})
				.each(function (d) {
					var x = parseInt(d3.select(this).attr('cx'))
						y = parseInt(d3.select(this).attr('cy'));
					if (d.f && y < 380) {
						d.y = d.y * -0.5;
						d.f = false;
						return;
					}
					if (y > 400 && d.y > 0) {
						d.y = d.y * -0.6;
						d.x = d.x * 0.9;
					}
				});
			if (ni) {
				requestAnimationFrame(_nextTick);
			}
			ci++;
			ci > 10 && (ci = 0, _createOne());
		},

		_createOne = function () {
			svg.append('circle')
				.datum({
					x: (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 3 + 2), y: -4 * Math.random(), f: true,
					r: 10 + Math.random() * 8
				})
				.attr({
					cx: 400, cy: 100, r: function (d) {return d.r},
					fill:  color[Math.floor(Math.random() * 20)]
				});
		},

		turn = function() {
			if (status == 'off'){
				status = 'on';
				ni = true;
				_nextTick();
				document.getElementById('switch').innerHTML = 'Pause';
			} else {
				status = 'off';
				ni = false;
				document.getElementById('switch').innerHTML = 'Continue';
			}
		};

	//smarter than forEach
	Array.apply(null, Array(3)).forEach(function(){ _createOne(); });

	if (window.addEventListener){
		document.getElementById('switch').addEventListener('click', turn);
		document.getElementById('speed').addEventListener('change', function (e) {
			requestAnimationFrame(function(){G = parseInt(e.target.value);});
		});
	} else {
		document.getElementById('switch').attachEvent('click', turn);
		document.getElementById('speed').attachEvent('change', function (e) {
			requestAnimationFrame(function(){G = parseInt(e.target.value);});
		});
	}

	_nextTick();
})()