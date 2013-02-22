require(['d3'], function() {

var margin = {t:20, r:20, b:40, l:40 },
		w = 930 - margin.l - margin.r,
		h = 520 - margin.t - margin.b,
		x = d3.scale.ordinal().rangeRoundBands([0, w], .1),
		y = d3.scale.linear().rangeRound([h, 0]),
		color = d3.scale.ordinal()
    formatPercent = formatPercent = d3.format(".0%");;

var colorBlends = {
	    	"blue": ["#ADCDE1","#96BFD9","#6baed6","#3182bd","#08519c"],
	    	"red": ["#FDAD9B","#FC9078","#fb6a4a","#de2d26","#a50f15"],
	    }

var questions = {
  'women-politics': "Which one of the following statements comes closest to your opinion about men and women as political leaders?...Men generally make better political leaders than women, or Women generally make better political leaders than men, or In general, women and men make equally good political leaders?",
  'jobs': "Please tell me whether you completely agree, mostly agree, mostly disagree, or completely disagree with the following statements...When jobs are scarce, men should have more right to a job than women.",
  'outside-home': "Please tell me whether you completely agree, mostly agree, mostly disagree, or completely disagree with the following statements...Women should be able to work outside the home."
  };

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

  d3.select('#surveyQuest').html(questions['women-politics'])

  x.domain(json['jobs'].map(function(d) { return d.Country }));

  surveyChart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

  d3.selectAll('#surveys .x.axis text')
    .attr("transform", "translate(" + x.rangeBand()/2 + ",15) rotate(45)")

  setData('jobs');
});

function setData(dataset) {
  
  data = surveyData[dataset];

	responseNames = d3.keys(data[0]).filter(function(key) { 
    return key !== "Country" && key !== "region" && key !== "responses"})

	data.forEach(function(d) {
		var y0 = 0;
		d.responses = responseNames.map(function(name) { 
      return {name: name, region: d.region, y0: y0, y1: y0 += +d[name]}; });
	   d.responses.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
	});

  drawData(data)
};

function drawData (filtered) {
console.log(filtered)
 // d3.transition().ease("elastic").duration(750).each(function() {

	var bars = surveyChart.selectAll(".surveyRectGroup")
    .data(filtered)
  
  var barEnter = bars.enter().append("g")
    .attr('class', 'surveyRectGroup')
    .attr("transform", function(d) { 
      return "translate(" + x(d.Country) + ",0)"; });

  var barRect = barEnter.selectAll("rect")
    .data(function(d) { return d.responses; })

  barRect.enter().append("rect")
    .attr("class", function(d) { return d.name.replace(/\s/g, '').replace('/', ''); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { d.region === "Asia" ? 
    									color.range(colorBlends["red"]) 
    									: color.range(colorBlends["blue"]);
    										return color(d.name)});

  var barText = barEnter.selectAll('text')
     .data(function(d) { return d.responses; })
   .enter().append('text')
    .attr("class", function(d) { return d.name.replace(/\s/g, '').replace('/', ''); })
    .attr("y", function(d) { return (y(d.y1) + y(d.y0)) / 2; })
    .attr("x",x.rangeBand()/2)
    .attr("dy", function(d) { return (d.y1-d.y0) < .025 ? '.5em' : '.35em' })
    .style('text-anchor', 'middle')
    .style('visibility', 'hidden')
    .style('opacity', function(d) { return (d.y1-d.y0) === 0 ? 1e-6 : 1 })
    .text(function(d) { return formatPercent(d.y1 - d.y0); });

  bars.exit().remove();

  barRect.selectAll('rect').transition().duration(600)
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); });

d3.selectAll(".surveyRectGroup rect").on("mouseover", mouseOn);
d3.selectAll(".surveyRectGroup rect").on("mouseout", mouseOff);
d3.selectAll(".surveyRectGroup text").on("mouseover", mouseOn);
d3.selectAll(".surveyRectGroup text").on("mouseout", mouseOff);
 // });
};


function mouseOn() {
  var thisClass = d3.select(this).attr('class')
  d3.selectAll("text." + thisClass).style('visibility', 'visible')
  };
  
function mouseOff() {
  var thisClass = d3.select(this).attr('class')
  d3.selectAll("text." + thisClass).style('visibility', 'hidden')
  };

d3.selectAll('.surveyControl').on("click", function() {
    var updateVal = d3.select(this).property('id')
    // d3.selectAll('.eduControl').style('color', null)
    // d3.select(this).style('color', '#E5ABA9')
    // updateEdu(text);
    console.log(updateVal)
  setData(updateVal)
  })

})
