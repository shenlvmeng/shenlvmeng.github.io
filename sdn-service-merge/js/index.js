(function(){
	$().ready(function(){
		//Adjust each article's width
		var width = $('#container').children().length * 50 + "%";
		$('body').width(width);
		$('article').width((100 / $('#container').children().length) - 0.1 + "%");
		console.log('indes.js Loaded successfully!');

		//draw each network
		var width = $('svg').width();
		var height = $('svg').height();

		var nodes = d3.range(1,9).map(function(i){
			if(i < 3) return {name: "H" + i};
			else if(i > 2 && i < 6) return {name: "S" + (i - 2)};
			else if(i == 6) return {name: "DB"};
			else return {name: "Web Server" + (i - 6)};
		});
		var links = [{source: 0, target: 2}, {source: 1, target: 2},
			{source: 2, target: 3}, {source: 2, target: 4},
			{source: 3, target: 4}, {source: 4, target: 6},
			{source: 3, target: 5}, {source: 4, target: 7}
		];
		var force = d3.layout.force()
			.nodes(nodes)
			.links(links)
			.size([width, height * 3 / 4 ])
			.linkDistance(80)
			.charge(-300)
			.start();
		//console.log(force.nodes());

		var svg_links = d3.selectAll('svg')
			.selectAll('line')
			.data(links)
			.enter()
			.append('line')
			.attr({
				'stroke': '#ccc', 'stroke-width': 2
			});
		var svg_nodes = d3.selectAll('svg')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr({
				'font-family': 'FontAwesome',
				'font-size': '20', 'fill': "#aaa",
				'did': function(d, i){
					return i+1;
				}
			})
			.text(function(d, i){
				if(i < 2) return '\uf108';
				else if(i > 1 && i < 5) return '\uf233';
				else if(i == 5) return '\uf1c0';
				else return '\uf0ac';
			})
			.call(force.drag); //this line can be commented
		var svg_texts = d3.selectAll('svg')
			.selectAll('text.text')
			.data(nodes)
			.enter()
			.append('text')
			.attr({
				'dx': 15, 'dy': 10, 'fill': '#333'
			})
			.style('font-family', 'Calibri')
			.text(function(d){
				return d.name;
			});

		force.on('tick', function(){
			svg_links.attr("x1", function(d) { return d.source.x + 8; })
				.attr("y1", function(d) { return d.source.y - 8; })
				.attr("x2", function(d) { return d.target.x + 8; })
				.attr("y2", function(d) { return d.target.y - 8; });
			svg_nodes.attr({
				'x': function(d) {return d.x = Math.max(20, Math.min(d.x, width-20));},
				'y': function(d) {return d.y = Math.max(20, Math.min(d.y, height*3/4-20));}
			});
			svg_texts.attr({
				'x': function(d) {return d.x;},
				'y': function(d) {return d.y;}
			});
		});

		//use <g> to separate graphs, define marker to draw arrow
		d3.selectAll('svg').append('g')
			.attr('transform', 'translate(0,'+  height * 3 / 4 +')');
		var gs = d3.selectAll('#container article:not(:nth-child(2)) svg g');
		var defs = 	d3.selectAll('svg').append('defs');
		defs.append('marker')
			.attr({
				'id': 'arrow', 'viewBox': "0 -5 10 10",
				'refX': 5, 'refY': 0,
				'markerWidth': 3, 'markerHeight': 3,
				'orient': 'auto',
				'stroke-width': 1, 'fill': 'steelblue'
			})
			.append('path')
			.attr('d', 'M0,-5L10,0L0,5');

		var g1 = d3.select("#container article:nth-child(1) svg g");
		var g2 = d3.select("#container article:nth-child(2) svg g");
		var g3 = d3.select("#container article:nth-child(3) svg g");

		//draw ellipse and arrow line
		gs.selectAll('ellipse')
			.data([1,2])
			.enter()
			.append('ellipse')
			.attr({
				'rx': 50, 'ry': 25,
				'cx': function(d){
					return width * d / 3;
				},
				'cy': height / 8,
				'fill': "#fff", 'stroke': 'steelblue',
				'stroke-width': 2
			});
		gs.append('line')
			.attr({
				'stroke-width': 3, 'stroke': "steelblue",
				'x1': width / 3 + 50, 'y1': height / 8,
				'x2': width * 2 / 3 - 55, 'y2': height / 8,
				'marker-end' : 'url(#arrow)'
			});
		//draw chart 1,3 separately
		g1.selectAll('text').data(['Campus','Web Server'])
			.enter()
			.append('text')
			.call(gsChart);
		var gg1 = g1.append('g').attr('transform', 'translate('+ (width/2-35) +',30)');
		gg1.append('rect').attr({
			'width': 70, 'height': 30, 'fill': 'coral'
		});
		gg1.append('text').attr({
			'fill': '#fff', 'font-size': "14",
			'alignment-baseline': 'hanging',
			'transform': 'translate(8,8)'
		}).text('Firewall');
		g3.selectAll('text').data(['Students','Web Server'])
			.enter()
			.append('text')
			.call(gsChart);
		var gg3 = g3.append('g').attr('transform', 'translate('+ (width/2-35) +',30)');
		gg3.append('rect').attr({
			'width': 70, 'height': 30, 'fill': 'coral'
		});
		gg3.append('text').attr({
			'fill': '#fff', 'font-size': "14",
			'alignment-baseline': 'hanging',
			'transform': 'translate(14,8)'
		}).text('Billing');

		//draw fucking chart 2
		g2.selectAll('g')
			.data([0,1,2])
			.enter()
			.append('g')
			.attr('transform', function(d){
				return 'translate('+ width * d / 3 +','+'0)';
			})
			.call(drawEllipse)
			.call(drawLine)
			.each(drawText);
		var g2g1 = g2.select('g:nth-child(1)').append('g').attr('transform', 'translate('+ (width/6-25) +',30)');
		g2g1.append('rect').attr({
			'width': 40, 'height': 30, 'fill': 'coral'
		});
		g2g1.append('text').attr({
			'fill': '#fff', 'font-size': "14",
			'alignment-baseline': 'hanging',
			'transform': 'translate(12,8)'
		}).text('LB');
		//console.log(g2.selectAll('g:nth-child(n)'));
		g2.selectAll('g:not(:nth-child(5n+1))')
			.each(function(d, i){
				d3.select(this).append('text').attr({
					'fill': 'steelblue', 'font-size': "14",
					'alignment-baseline': 'hanging',
					'transform': 'translate('+ (width/6-25) +',28)'
				}).text(function(){
					if(i == 0) return '5900';
					else return '5900,22';
				});
			});

		//some function for chart drawing
		function gsChart(selection){
			selection.attr({
				'x': function(d,i){
					return width * (i+1) / 3;
				},
				'y' : height / 8,
				'class': 'text',
				'text-anchor': 'middle',
				'alignment-baseline': 'middle'
			})
			.text(function(d){
				return d;
			});
		}

		function drawEllipse(selection){
			selection.selectAll('ellipse')
			.data([1,3])
			.enter()
			.append('ellipse')
			.attr({
				'rx': 40, 'ry': 25,
				'cx': function(d){
					return width * d / 12;
				},
				'cy': height / 8,
				'fill': "#fff", 'stroke': 'steelblue',
				'stroke-width': 2
			});
		}

		function drawLine(selection){
			selection.append('line')
			.attr({
				'stroke-width': 3, 'stroke': "steelblue",
				'x1': width / 12 + 40, 'y1': height / 8,
				'x2': width * 1 / 4 - 45, 'y2': height / 8,
				'marker-end' : 'url(#arrow)'
			});
		}

		function drawText(d, i){
			d3.select(this)
				.selectAll('text')
				.data([1,3])
				.enter()
				.append('text')
				.attr({
					'x': function(d){
						return width * d / 12;
					},
					'y' : height / 8,
					'class': 'text',
					'text-anchor': 'middle',
					'alignment-baseline': 'middle'
				})
				.text(function(d){
					if(d == 1){
						if(i == 0) return 'School';
						else if(i == 1) return 'Students';
						else return 'Teachers';
					} else {
						if(i == 0) return 'Web Server';
						else return 'DB';
					}
				})
		}

		//start button: 'new' a terminal or cmd window
		$("button.start").on('click', function(){
			$.ajax({
				url: 'http://localhost:8888',
				dataType: 'jsonp',
				jsonpCallback: '_cb',
				cache: false,
				success: function(data){
					var data = JSON.parse(data);
					if(data.status == 'error') alert(data.message);
				},
				error: function(XHR, status, error){
					console.log('error'+ status +" "+ error);
				}
			});
		});
		
		//Load balance switch module
		$("span.button").on('click', function(){
			var self = $(this);
			if(!self.css('margin-right') || self.css('margin-right') != "31px")
				self.animate({
					'margin-right': '31px'
				},100,'swing',function(){
					$('#container article:nth-child(2) svg text[did=3]').attr('fill', 'steelblue');
					self.parent().css("background-color", "limegreen");
				});
			else
				self.animate({
					'margin-right': '0'
				},100,'swing',function(){
					$('#container article:nth-child(2) svg text[did=3]').attr('fill', '#aaa');
					self.parent().css("background-color", "#aaa");
				});
			return false;
		});

		//billing button: get flow data and revise display
		$("button.start_catch").on('click', function(){
			var parent = $(this).parent();
			var len = parent.find('p:nth-child(1)').html().length;
			$.ajax({
				url: 'http://localhost:8888/billing',
				dataType: 'jsonp',
				jsonpCallback: '_cb',
				cache: false,
				success: function(data){
					var data = JSON.parse(data);
					if(data.status == 'error') alert(data.message);
					else var flows = data.bills;

					flows.forEach(function(val, i){
						var tmpstr = parent.find('p:nth-child('+ (i+1) +')').html().substr(0,24);
						parent.find('p:nth-child('+ (i+1) +')').html(tmpstr+'￥'+val);
					});
				},
				error: function(XHR, status, error){
					console.log('error'+ status +" "+ error);
				}
			});
		});

		//Merge button
		$("button#merge_b").on('click', function(){
			$('body').animate({
				'opacity': 0
			}, 2000, 'easeOutCubic', function(){
				window.location.href = "./merged.html";
			});
		})
	});
})();