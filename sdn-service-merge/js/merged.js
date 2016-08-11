(function(){
	$().ready(function(){

		//Fade in 'body'
		$('body').animate({
				'opacity': 1
			}, 3000, 'easeInCubic', function(){
				console.log("Merged.js Loaded successfully!");
		});

		//draw the network
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
			.size([width, height])
			.linkDistance(100)
			.charge(-300)
			.gravity(0.05)
			.start();

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
				'font-size': '25', 'fill': "#aaa",
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
				'y': function(d) {return d.y = Math.max(20, Math.min(d.y, height-20));}
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

		//paint the topo
		[1,2,6,7].forEach(function(val){
			$(".topo svg text[did="+ val +"]").attr('fill', 'steelblue');
		});
		[1,2,4,6].forEach(function(val){
			$(".topo svg line[lid="+ val +"]").attr('stroke', 'steelblue');
		});
		[3,5].forEach(function(val){
			$(".topo svg text[did="+ val +"]").attr('fill', '#000');
		});
		[3,7].forEach(function(val){
			$(".topo svg line[lid="+ val +"]").attr('stroke', 'lightblue');
		});

		var list = ['10.0.0.1', '10.0.0.2'];
		//add deny button: change color and send ban request
		$("button.add_d").on('click', function(){			
			var d_ip = $(this).parent().find('input').val().trim();
			var index = list.indexOf(d_ip);
			if(index == -1) alert('Unknown host ip!');
			if($('.topo svg text[did='+ (index+1) +']').attr('fill') != 'red'){
				$('.topo svg text[did='+ (index+1) +']').attr('fill', 'red');
				$('.topo svg line[lid='+ (index+1) +']').attr('stroke', 'red');
				//some ajax request
				//...
			};
		});
		//add allow button: change color and send allow request
		$("button.add_a").on('click', function(){
			var a_ip = $(this).parent().find('input').val().trim();
			var index = list.indexOf(a_ip);
			if(index == -1) alert('Unknown host ip!');
			if($('.topo svg text[did='+ (index+1) +']').attr('fill') != 'steelblue'){
				$('.topo svg text[did='+ (index+1) +']').attr('fill', 'steelblue');
				$('.topo svg line[lid='+ (index+1) +']').attr('stroke', 'steelblue');
				//some ajax request
				//...
			};
		});

		//Load balance switch module
		$("span.button").on('click', function(){
			var self = $(this);
			if(!self.css('margin-right') || self.css('margin-right') != "31px")
				self.animate({
					'margin-right': '31px'
				},100,'swing',function(){
					[5,7,8].forEach(function(val){
						$('.topo svg text[did='+ val +']').attr('fill', 'green');
					});
					[6,8].forEach(function(val){
						$('.topo svg line[lid='+ val +']').attr('stroke', 'green');
					});
					self.parent().css("background-color", "limegreen");
				});
			else
				self.animate({
					'margin-right': '0'
				},100,'swing',function(){
					$('.topo svg text[did=7]').attr('fill', 'steelblue');
					$('.topo svg text[did=5]').attr('fill', '#000');
					$('.topo svg text[did=8]').attr('fill', '#aaa');
					$('.topo svg line[lid=6]').attr('stroke', 'steelblue');
					$('.topo svg line[lid=8]').attr('stroke', '#aaa');
					self.parent().css("background-color", "#aaa");
				});
			return false;
		});

		//billing button: get flow data and revise display
		$("button.start_catch").on('click', function(){
			var parent = $(this).parent().parent();
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

		//start button: 'new' a terminal or cmd window
		$("button#merge_b").on('click', function(){
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
	});
})();