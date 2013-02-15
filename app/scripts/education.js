require(['d3'], function() {

var margin = {t:20, r:20, b:20, l:30 },
		w = 600 - margin.l - margin.r,
		h = 650 - margin.t - margin.b,
		x = d3.scale.linear().range([0,w]).domain([0, 1.8]),
		y = d3.scale.ordinal().rangeRoundBands([0, h], .05),
		color = d3.scale.category20c();

var eduData;

var eduChart = d3.select('#education').append('svg')
	.attr('width', w + margin.l + margin.r)
	.attr('height', h + margin.t + margin.b)
.append("g")
	.attr({
		transform: "translate("+ margin.l + "," + margin.t + ")",
		class: "eduGroup"
	});

var xAxis = d3.svg.axis()
		.scale(x)
		.orient('top');

eduChart.append("g")
	.attr({
		transform: "translate(" + [0,0] + ")",
		class: "x axis"
	});

eduChart.append("g")
    .attr("class", "y axis")
    .append("line")
    .attr("class", "domain")
    .attr("y2", h);

d3.json('../data/education-ratios.json', function(json) {
	eduData = json;
	redraw("Primary")	
})

function redraw(dataset) {

	var rect = eduChart.selectAll('.rect')
		.data(eduData);

	var rectEnter = rect.enter().append("g")
		.attr("class","rect")

	rectEnter.append("rect")
		.attr({
				width: function(d) { return x(d[dataset].ratio); },
				height: 12,
				fill: function(d, i){
					return color(d.country);
				}
			})
		.attr("transform", function(d, i) { return "translate(0," + (5 + i*15) + ")"; });
	
	eduChart.select('.x.axis')
		.call(xAxis);
};

})