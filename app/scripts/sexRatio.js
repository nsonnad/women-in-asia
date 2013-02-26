require(['d3'], function() {

var 	margin = {t:20, r:40, b:40, l:40 },
		w = 960 - margin.l - margin.r,
		h = 580 - margin.t - margin.b,
		x = d3.scale.ordinal().rangeRoundBands([0, w], .07),
		y = d3.scale.linear().rangeRound([h, 0])
		color = d3.scale.category10(),
		forceW = w-200;

var	data,
		girlPath = 'M21.022,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.104,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.579,5.192-0.351,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.167,1.213-0.167,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.464,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.603,21.541,22.444,18.912,21.022,16.349zM15.808,13.757c2.363,0,4.279-1.916,4.279-4.279s-1.916-4.279-4.279-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757zM18.731,4.974c1.235,0.455,0.492-0.725,0.492-1.531s0.762-1.792-0.492-1.391c-1.316,0.422-2.383,0.654-2.383,1.461S17.415,4.489,18.731,4.974zM15.816,4.4c0.782,0,0.345-0.396,0.345-0.884c0-0.488,0.438-0.883-0.345-0.883s-0.374,0.396-0.374,0.883C15.442,4.005,15.034,4.4,15.816,4.4zM12.884,4.974c1.316-0.484,2.383-0.654,2.383-1.461S14.2,2.474,12.884,2.052c-1.254-0.402-0.492,0.584-0.492,1.391S11.648,5.428,12.884,4.974z',
		boyPath = 'M21.021,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.103,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.578,5.192-0.35,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.166,1.213-0.166,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.463,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.602,21.541,22.443,18.912,21.021,16.349zM15.808,13.757c2.362,0,4.278-1.916,4.278-4.279s-1.916-4.279-4.278-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757z';

centers = {
  "boy": {x: forceW / 3, y: h / 2},
  "girl": {x: forceW / 2, y: h / 2},
  "missing": {x: 2 * forceW / 3, y: h / 2}
};

var sexRatio = d3.select('#sexRatio').append('svg')
		.attr("width",w + margin.l + margin.r)
		.attr("height",h + margin.t + margin.b)
	.append("g")
		.attr({
			transform: "translate(300," + margin.t +")",
			class: "sexGroup"
		});

var sexControls = d3.select('#sexRatio').append('div')
	.attr('width', 200)
	.attr("class","sexControls")
	.html('<h1>Select country</h1>')

var force = d3.layout.force().size([forceW, h])
    .charge(-70);

d3.csv('../data/sex-ratio.csv', function(csv) {
	data = csv;

	sexControls.append('div').attr('class', 'sexCountries')
	.append('ul').attr("class","countries")
	.selectAll('li')
		.data(csv)
	.enter().append('li')
		.attr("class",'countryLink')
		.append('a')
		.style('cursor', 'pointer')
		.text(function(d) { return d.country; })

	data.map(function(d) {
		d.node = {name: d.country, boys: 105, 
		girls: 100 - d["missing-girls"], missing: +d["missing-girls"] };
	});

	sexControls.selectAll('.countryLink').on('click', update)

	drawNodes('China');
});

function drawNodes(country) {

// use only data from selected country
	var filtered = data.filter(function(d, i){
		return d.country === country;
	});
// create array with entries for each boy, girl or missing girl
	var nodeArray = [];
		for (var i=0; i<filtered[0].node.boys; i++) {
			nodeArray.push(["boy"])
		};
		for (var i=0; i<filtered[0].node.girls; i++) {
			nodeArray.push(["girl"])
		};
		for (var i=0; i<filtered[0].node.missing; i++) {
			nodeArray.push(["missing"])
		};

force
    .nodes(nodeArray)
    .on("tick", tick)
    .start();

	var node = sexRatio.selectAll(".node")
 		.data(nodeArray)

 	node.exit().remove()
 	console.log(node.exit())
	nodeEnter = node.enter().append("g")
		.attr("class", "node")
	
	var icons = node.selectAll('path')
		.data(function(d) { return d; })
	.enter().append('path')
		.attr("class",'iconPath')

	d3.selectAll('.iconPath').transition().each(function(d) {
		 	path = d3.select(this)
		 	if (d === 'girl') {
				path
		 		.attr('d', girlPath)
		 		.style('stroke', 'none')
		 		.style('fill', 'orange')
		 	} else if (d === 'boy') {
		 		path
		 		.attr('d', boyPath)
		 		.style('stroke', 'none')
		 		.style('fill', '#B83834')
		 	} else { 
		 		path
		 		.attr('d', girlPath)
		 		.style('fill-opacity', '0')
		 		.style('stroke', '#E98125')
		 		.style('stroke-width', '1')
		 	}
		 })

	icons.attr("transform","scale(1.3)")
	console.log(icons)
	nodeEnter.call(force.drag);

	function tick(e) {
		var k = .1 * e.alpha;
	  	nodeArray.forEach(function(o, i) {
	    o.y += (centers[o].y - o.y) * k;
	    o.x += (centers[o].x - o.x) * k;
	  	});

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  	};
};

function update() {
	selected = d3.select(this).datum().country
	drawNodes(selected)
}
	
});