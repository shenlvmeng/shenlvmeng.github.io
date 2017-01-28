(function () {
	var G = 4,

		color = ['#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a','#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b','#c49c94','#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d','#17becf','#9edae5'],
		
		ni,

		ci,

		status = 'on',

		nextTick = function () {
			d3.select('svg').selectAll('circle')
				.filter(function (d) {
					var x = parseInt(d3.select(this).attr('cx')),
						y = parseInt(d3.select(this).attr('cy'));
					return x < -d.r || x > 800 + d.r || (y > 400 && Math.abs(d.y) < 1) || Math.abs(d.x) < 1;
				})
				.remove();

			d3.select('svg')
				.selectAll('circle')
				.transition()
				.duration(100)
				.attr('cx', function (d) {
					return parseInt(d3.select(this).attr('cx')) + d.x;
				})
				.attr('cy', function (d) {
					d.y += G;
					return parseInt(d3.select(this).attr('cy')) + d.y - G / 2;
				})
				.each(function (d) {
					var y = parseInt(d3.select(this).attr('cy'));
					if (y > 400 && d.y > 0) {
						d.y = d.y * -0.5;
						d.x = d.x * 0.9;
					}
				});

		},

		createOne = function () {
			d3.select('svg')
				.append('circle')
				.attr({
					cx: 400, cy: 100, r: 10 + Math.random() * 8,
					fill: function(){
						return color[Math.floor(Math.random() * 20)];
					}
				})
				.datum({
					x: -20 + Math.random() * 40, y: -25 * Math.random(), 
					r: function (d) {return d.r}
				});
		},

		turn = function() {
			if (status == 'off'){
				status = 'on';
				ni = setInterval(nextTick, 50);
				ci = setInterval(createOne, 200);
				document.getElementById('switch').innerHTML = 'Pause';
			} else {
				status = 'off';
				clearInterval(ni);
				clearInterval(ci);
				document.getElementById('switch').innerHTML = 'Continue';
			}
		};

	//smarter than forEach
	Array.apply(null, Array(1)).forEach(function(){ createOne(); });

	document.getElementById('switch').addEventListener('click', turn);

	ni = setInterval(nextTick, 50);
	ci = setInterval(createOne, 200);
})()