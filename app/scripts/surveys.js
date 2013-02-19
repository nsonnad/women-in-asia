require(['d3'], function() {

var margin = {t:20, r:40, b:40, l:40 },
		w = 800 - margin.l - margin.r,
		h = 520 - margin.t - margin.b,
		x = d3.scale.ordinal().rangeRoundBands([0, w], .2),
		y = d3.scale.linear().rangeRound([h, 0]),
		color = d3.scale.ordinal();

var colorBlends = {
	    	"blue": ["#B8D4E5","#96BFD9","#6baed6","#3182bd","#08519c"],
	    	"red": ["#EFCDBE","#fcae91","#fb6a4a","#de2d26","#a50f15"],
	    }

// hsl(245, 29%, 84%)
var questions = ['women-politics', 'jobs', 'outside-home'];

var surveyData;

var surveyChart = d3.select('#surveys').append('svg')
	.attr("width",w + margin.l + margin.r)
	.attr("height",h + margin.t + margin.b)
.append("g")
		.attr({
			transform: "translate("+ margin.l + "," + margin.t + ")",
			class: "surveyGroup"
		});

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));

surveyChart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

d3.json('../data/asia-surveys-master.json', function(error, json) {
	surveyData = json;
	setData(questions[1]);
});

function setData(dataset) {
	data = surveyData[dataset];

	x.domain(data.map(function(d) { return d.Country }));

	surveyChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

   d3.selectAll('.x.axis text')
   	.attr("transform", "translate(" + x.rangeBand()/2 + ",15) rotate(45)")

	responseNames = d3.keys(data[0]).filter(function(key) { return key !== "Country" && key !== "region"})

	data.forEach(function(d) {
		var y0 = 0;
		d.responses = responseNames.map(function(name) { return {name: name, region: d.region, y0: y0, y1: y0 += +d[name]}; });
	   d.responses.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
	});

	var bars = surveyChart.selectAll(".surveyRect")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x(d.Country) + ",0)"; });

      console.log(data)
  	bars.selectAll(".surveyRect")
      .data(function(d) { return d.responses; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { d.region === "Asia" ? 
      									color.range(colorBlends["red"]) 
      									: color.range(colorBlends["blue"]);
      										return color(d.name)});
}

})
