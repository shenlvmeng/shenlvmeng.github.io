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

		var nodes = d3.range(1,13).map(function(i){
			if(i < 4) return {name: "H" + i};
			else if(i > 3 && i < 8) return {name: "S" + (i - 3)};
			else if(i == 8) return {name: "DNS Server"};
			else if(i == 9) return {name: "Remedy Server"};
			else if(i > 9 && i < 12) return {name: "Web Server" + (i-9)};
			else return {name: "DB"};
		});
		var links = [{source: 0, target: 3}, {source: 1, target: 3},
			{source: 2, target: 3}, {source: 3, target: 4},
			{source: 4, target: 5}, {source: 5, target: 7},
			{source: 5, target: 8}, {source: 4, target: 6},
			{source: 6, target: 9}, {source: 6, target: 10}, {source: 6, target: 11}
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
				'stroke': '#ccc', 'stroke-width': 2,
				'lid': function(d, i){
					return i+1;
				}
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
				if(i < 3) return '\uf108';
				else if(i > 2 && i < 7) return '\uf233';
				else if(i > 6 && i < 9) return '\uf187';
				else if(i == 11) return '\uf1c0';
				else return '\uf0ac';
			})
			.on('dblclick', function(d){
				d.fixed = false;
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
		//add node fixed
		force.drag()
			.on('dragstart', function(d,i){
				d.fixed = true;
			});

		//use <g> to separate graphs, define marker to draw arrow
		d3.selectAll('svg').append('g')
			.attr('transform', 'translate(0,'+  height * 3 / 4 +')');
		var gs = d3.selectAll('#container article:nth-child(2n+1) svg g');
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
		var g4 = d3.select("#container article:nth-child(4) svg g");

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
		//draw logic chart 1,3 separately
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

		//draw logic chart 4
		g4.selectAll('g')
			.data([0,1])
			.enter()
			.append('g')
			.attr('transform', function(d){
				return 'translate('+ width * d / 2 +','+'0)';
			})
			.call(drawEllipse)
			.call(drawLine)
			.each(function(d, i){
				d3.select(this).selectAll('text')
					.data([1,3])
					.enter()
					.append('text')
					.attr({
						'x': function(d){
							return width * d / 8;
						},
						'y' : height / 8,
						'class': 'text',
						'text-anchor': 'middle',
						'alignment-baseline': 'middle'
					})
					.text(function(d){
						if(d == 1){
							if(i == 0) return 'Normal Host';
							else return 'Error Host';
						} else {
							if(i == 0) return 'DNS';
							else return 'RMD Server';
						}
					});
				d3.select(this).append('text')
					.attr({
						'fill': 'steelblue', 'font-size': "14",
						'text-anchor': 'middle',
						'alignment-baseline': 'hanging',
						'transform': 'translate('+ (width/ 4) +',28)'
					})
					.text(function(){
						return i == 0 ? "53" : "*";
					});
			});

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
		var g2g1 = g2.select('g:nth-child(1)').append('g').attr('transform', 'translate('+ (width/6-14) +',30)');
		g2g1.append('rect').attr({
			'width': 35, 'height': 30, 'fill': 'coral'
		});
		g2g1.append('text').attr({
			'fill': '#fff', 'font-size': "14",
			'alignment-baseline': 'hanging',
			'transform': 'translate(10,8)'
		}).text('LB');
		g2g1.append('text').attr({
			'fill': 'steelblue', 'font-size': "14",
			'transform': 'translate(-20,10)'
		}).text('80');
		//console.log(g2.selectAll('g:nth-child(n)'));
		g2.selectAll('g:not(:nth-child(5n+1))')
			.each(function(d, i){
				d3.select(this).append('text').attr({
					'fill': 'steelblue', 'font-size': "14",
					'alignment-baseline': 'hanging',
					'transform': 'translate('+ (width/6-38) +',28)'
				}).text(function(){
					if(i == 0) return '5900';
					else return '5900,22,23';
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
			})
			.on('mouseover', mouseIn)
			.on('mousemove', mouseMove)
			.on('mouseout', mouseOut)
			.on('click', disp_prompt);
		}

		function drawEllipse(selection){
			var split = selection[0].length || 1;
			selection.selectAll('ellipse')
			.data([1,3])
			.enter()
			.append('ellipse')
			.attr({
				'rx': 40 + 8*(3-split), 'ry': 25,
				'cx': function(d){
					return width * d / (4*split);
				},
				'cy': height / 8,
				'fill': "#fff", 'stroke': 'steelblue',
				'stroke-width': 2
			});
		}

		function drawLine(selection){
			var split = selection[0].length || 1;
			selection.append('line')
			.attr({
				'stroke-width': 3, 'stroke': "steelblue",
				'x1': width / (4*split) + 40 + 8*(3-split), 'y1': height / 8,
				'x2': width * 3 / (4*split) - 45 - 8*(3-split), 'y2': height / 8,
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
						if(i == 0) return 'Campus';
						else if(i == 1) return 'Students';
						else return 'Teachers';
					} else {
						if(i == 0) return 'Web Server';
						else return 'DB';
					}
				})
				.on('mouseover', function(){
					mouseIn(d3.select(this).text());
				})
				.on('mousemove', mouseMove)
				.on('mouseout', mouseOut)
				.on('click', disp_prompt);
		}

		//add logic graph hint
		var tooltip = d3.select('body')
			.append('div')
			.attr('class','tooltip')
			.style('opacity', 0);
		//element on listener callback function -- display tooltip
		function mouseIn(d){
			var d = d3.select(this).text() || d;
			var content = "";
			if(d == "Campus") content = ": H1, H2";
			else if(d == "Web Server") 
				content = ":<br />Web Server 1(负载均衡前)<br />Web Server 1,Web Server 2(负载均衡后)";
			else if(d == "Students") content = ": H1";
			else if(d == "Teachers") content = ": H2";
			else if(d == "DB") content = ": Database";
			else content = ": Unknown."
			tooltip.html(d+content)
				.style({
					'left': d3.event.pageX + 'px',
					'top': (d3.event.pageY+20) + 'px',
					'opacity': 1
				});
		}
		function mouseMove(){
			tooltip.style({
				'left': d3.event.pageX + 'px',
				'top': (d3.event.pageY+20) + 'px'
			});
		}
		function mouseOut(){
			tooltip.style('opacity', 0);
		}

		//change logic graph label
		var oldLabel = [];
		var newLabel = [];
		function disp_prompt(e){
			var new_label = prompt("请输入新的标签名","");
			if (new_label != null && new_label != "" && d3.select(this).text() != new_label){
				oldLabel.push(d3.select(this).text());
				d3.select(this).text(new_label);
				newLabel.push(new_label);
			}
		}

		//paint some nodes and some links
		//topo 1
		$('#container article:nth-child(1) svg text[did=4]').attr('fill', '#000');
		[1,2,3].forEach(function(val){
			$('#container article:nth-child(1) svg text[did='+ val +']').attr('fill', 'steelblue');
			$('#container article:nth-child(1) svg line[lid='+ val +']').attr('stroke', 'steelblue');
		});
		//topo 2
		[4,7].forEach(function(val){
			$('#container article:nth-child(2) svg text[did='+ val +']').attr('fill', '#000');
		});
		[1,2,3,10].forEach(function(val){
			$('#container article:nth-child(2) svg text[did='+ val +']').attr('fill', 'steelblue');
		});
		[1,2,3,4,8,9].forEach(function(val){
			$('#container article:nth-child(2) svg line[lid='+ val +']').attr('stroke', 'steelblue');
		});
		$('#container article:nth-child(2) svg text[did=12]').attr('fill', 'lightblue');
		$('#container article:nth-child(2) svg line[lid=11]').attr('stroke', 'lightblue');
		//topo 3
		[1,2,3,10,11].forEach(function(val){
			$('#container article:nth-child(3) svg text[did='+ val +']').attr('fill', 'steelblue');
		});
		$('#container article:nth-child(3) svg text[did=4]').attr('fill', '#000');
		[1,2,3,4,8,9,10].forEach(function(val){
			$('#container article:nth-child(3) svg line[lid='+ val +']').attr('stroke', 'steelblue');
		});
		//topo 4
		[1,8].forEach(function(val){
			$('#container article:nth-child(4) svg text[did='+ val +']').attr('fill', 'steelblue');
		});
		$('#container article:nth-child(4) svg text[did=6]').attr('fill', '#000');
		[1,4,5,6].forEach(function(val){
			$('#container article:nth-child(4) svg line[lid='+ val +']').attr('stroke', 'steelblue');
		});

		//adjust the scroll bar
		$("body").mousewheel(function(event, delta){
			this.scrollLeft -= (delta * 50);
			event.preventDefault();
		});

		var list = ['10.0.0.1', '10.0.0.2', '10.0.0.3'];
		//add deny button: change color and send ban request
		$("button.add_d").on('click', function(){			
			var d_ip = $(this).parent().find('input').val().trim();
			var index = list.indexOf(d_ip);
			if(index == -1) alert('Unknown host ip!');
			if($('#container article:nth-child(1) svg text[did='+ (index+1) +']').attr('fill') != 'red'){
				$('#container article:nth-child(1) svg text[did='+ (index+1) +']').attr('fill', 'red');
				$('#container article:nth-child(1) svg line[lid='+ (index+1) +']').attr('stroke', 'red');
				//some ajax request
				//...
			};
		});
		//add allow button: change color and send allow request
		$("button.add_a").on('click', function(){
			var a_ip = $(this).parent().find('input').val().trim();
			var index = list.indexOf(a_ip);
			if(index == -1) alert('Unknown host ip!');
			if($('#container article:nth-child(1) svg text[did='+ (index+1) +']').attr('fill') != 'steelblue'){
				$('#container article:nth-child(1) svg text[did='+ (index+1) +']').attr('fill', 'steelblue');
				$('#container article:nth-child(1) svg line[lid='+ (index+1) +']').attr('stroke', 'steelblue');
				//some ajax request
				//...
			};
		});

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

		//end button: invisibly kill a controller process
		$("button.end").on('click', function(){
			$.ajax({
				url: 'http://localhost:8888/kill',
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
					[7,10,11].forEach(function(val){
						$('#container article:nth-child(2) svg text[did='+ val +']').attr('fill', 'green');
					});
					[9,10].forEach(function(val){
						$('#container article:nth-child(2) svg line[lid='+ val +']').attr('stroke', 'green');
					});
					self.parent().css("background-color", "limegreen");
				});
			else
				self.animate({
					'margin-right': '0'
				},100,'swing',function(){
					$('#container article:nth-child(2) svg text[did=10]').attr('fill', 'steelblue');
					$('#container article:nth-child(2) svg text[did=7]').attr('fill', '#000');
					$('#container article:nth-child(2) svg text[did=11]').attr('fill', '#aaa');
					$('#container article:nth-child(2) svg line[lid=9]').attr('stroke', 'steelblue');
					$('#container article:nth-child(2) svg line[lid=10]').attr('stroke', '#aaa');
					self.parent().css("background-color", "#aaa");				
				});
			return false;
		});

		//DNS protect switch module
		$("select").on('change', function(){
			var state = $(this).val();
			if(state == "异常"){
				$("span#response").html("Remedy Server");
				$('#container article:nth-child(4) svg text[did=1]').attr('fill', 'orange');
				$('#container article:nth-child(4) svg text[did=9]').attr('fill', 'steelblue');
				$('#container article:nth-child(4) svg text[did=8]').attr('fill', '#aaa');
				$('#container article:nth-child(4) svg line[lid=7]').attr('stroke', 'steelblue');
				$('#container article:nth-child(4) svg line[lid=6]').attr('stroke', '#aaa');
			}
			else{
				$("span#response").html("DNS Server");
				$('#container article:nth-child(4) svg text[did=1]').attr('fill', 'steelblue');
				$('#container article:nth-child(4) svg text[did=9]').attr('fill', '#aaa');
				$('#container article:nth-child(4) svg text[did=8]').attr('fill', 'steelblue');
				$('#container article:nth-child(4) svg line[lid=7]').attr('stroke', '#aaa');
				$('#container article:nth-child(4) svg line[lid=6]').attr('stroke', 'steelblue');
			}

			$.ajax({
				url: 'TODO',
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
			if(!oldLabel.every(function(val){
				return newLabel.indexOf(val) != -1;
			})){
				alert("融合失败！标签策略冲突。");
				return false;
			}

			$('body').animate({
				'opacity': 0
			}, 2000, 'easeOutCubic', function(){
				window.location.href = "./merged.html";
			});
		});
	});
})();