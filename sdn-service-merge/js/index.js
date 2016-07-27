(function(){
	$().ready(function(){
		//Adjust each article's width
		var width = $('#container').children().length * 50 + "%";
		$('body').width(width);
		$('article').width((100 / $('#container').children().length) - 0.1 + "%");
		console.log('indes.js Loaded successfully!');

		//draw each network
		var nodes = d3.range(1,8).map(function(i){
			return {name: "S" + i};
		});
		var links = [{source: 0, target: 1}, {source: 0, target: 2},
			{source: 1, target: 3}, {source: 1, target: 4},
			{source: 2, target: 5}, {source: 2, target: 6}
		];
		var force = d3.layout.force()
			.nodes(nodes)
			.links(links)
			.size([$('svg').width(), $('svg').height()])
			.linkDistance(80)
			.charge(-300)
		force.start();

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
			.text('\uf108')
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
				'x': function(d) {return d.x;},
				'y': function(d) {return d.y;}
			});
			svg_texts.attr({
				'x': function(d) {return d.x;},
				'y': function(d) {return d.y;}
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