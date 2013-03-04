define(['d3'], function (d3) {
    'use strict';
    var init = function () {
        var
        margin = { t : 20, r : 60, b : 50, l : 30 },
        w = 470 - margin.l - margin.r,
        h = 550 - margin.t - margin.b,
        x = d3.scale.ordinal().rangeRoundBands([0, w], 1),
        y = d3.scale.linear().range([h, 0]).domain([0, .45]),
        color = d3.scale.category10(),
        formatPercent = d3.format('.1%'),
        formatAxis = d3.format('.0%');

        var data;

        var globalAvg = [
            {"region":"Nordic countries","number":"42.0"},
            {"region":"Americas","number":"24.1"},
            {"region":"Europe^","number":"21.8"},
            {"region":"Sub-Saharan Africa","number":"20.8"},
            {"region":"Arab States","number":"13.3"}
        ];

        var exceptions = [
            {"nation":"Afghanistan","original":"Second","alternate":2006},
            {"nation":"Pakistan","original":"Second","alternate":2003},
            {"nation":"Maldives","original":"Second","alternate":2001},
            {"nation":"Cambodia","original":"First","alternate":1997},
            {"nation":"Indonesia","original":"Second","alternate":2001},
            {"nation":"Malaysia","original":"Second","alternate":2001}
        ];

        var parliament = d3.select('#parliament').append('svg')
            .attr('width', w + margin.l + margin.r)
            .attr('height', h + margin.t + margin.b)
        .append("g")
            .attr({
                transform: "translate(" + margin.l + ',' + margin.t + ")",
                class: "parlGroup"
            });

        d3.select('#parliament').append('div')
            .attr('class', 'parlSidebar');

        parliament.append('text')
            .attr('x', 10)
            .attr('y', h + margin.b - 5)
            .style('font-style', 'italic')
            .text('Source: Asian Development Bank');

        var line = d3.svg.line()
            .interpolate('linear')
           .x(function (d) { return x(d.year); })
           .y(function (d) { return y(d.value); });

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(formatAxis)
            .tickSubdivide(1)
            .ticks(8)
            .tickSize(6, 3, 0);

        d3.csv('/data/women-parliament-asia.csv', function (csv) {

            data = csv;

            data.forEach(function (d) {
                d.value = +d.value / 100;
            });

            globalAvg.forEach(function (d) {
                d.number = +d.number / 100;
            })

            x.domain(data.map(function (d) { return d.year; }));

            var countries = d3.keys(data[0]).filter(function(key) {
                return (key !== "year" && key !== 'value');
            });

            var transpose = countries.map(function(name) {
                    return {
                      name: name,
                      values: data.map(function(d) {
                        return {country: name, year: d.year, value: +d[name]/100};
                      })
                    };
                });

            parliament.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            parliament.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis);

            var comparisons = parliament.selectAll('.compLine')
                .data(globalAvg)

            comparisons.enter().append('g')
                .attr('class', '.parlComp')

            comparisons.append('line')
                .attr({
                    class: 'compLine',
                    y1: function (d) { return y(d.number); },
                    y2: function (d) { return y(d.number); },
                    x1: 0,
                    x2: w - margin.r - 5
                });

            comparisons.append('text')
                .attr({
                    x: w - margin.r,
                    y: function (d) { return y(d.number); },
                    dy: '.35em',
                    'text-anchor': 'start'
                })
                .style('fill', '#2B2D31')
                .text(function (d) { return d.region; });

            var parlGroup = parliament.selectAll('.dotGroup')
                .data(transpose);

            parlGroup.enter().append("g")
                .attr('class', '.dotGroup')
                .attr('transform', 'translate(0,0)')
                .on('mouseover', function (d) { return drawPath(cleanClass(d.name)); })
                .on('mouseout', function (d) { return removePath(cleanClass(d.name)); });

            parlGroup.selectAll('circle')
                .data(function (d) { return d.values; })
            .enter().append('circle')
                .attr({
                    class: function (d) { return cleanClass(d.country); },
                    r: 8,
                    cx: function (d) { return x(d.year); },
                    cy: function (d) { return y(d.value); },
                    fill: function (d) { return color(d.country); },
                })
                .style('opacity', '0.7')
                .style('cursor', 'pointer');

            var parlPath = parlGroup.append('path')
                .attr({
                    class: function (d) { return cleanClass(d.name); },
                    stroke: function (d) { return color(d.name); },
                    "stroke-width": 2,
                    fill: "none",
                    d: function (d) { return line(d.values); },
                    'pointer-events': 'none'
                });

            parlPath.each(function() {
                var paths = d3.select(this);
                var totalLength = paths.node().getTotalLength();

                paths
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength);
            });

            parlGroup.selectAll('text')
                .data(function (d) { return d.values; })
            .enter().append('text')
                .attr({
                    fill: "white",
                    class: function (d) { return cleanClass(d.country); },
                    x : function (d) { return x(d.year); },
                    y: function (d) { return y(d.value); },
                    dy: '.35em',
                    "font-size": '1.2em',
                    "text-anchor": "middle",
                    'pointer-events': 'none'
                })
                .style('visibility', 'hidden')
                .text(function (d) { return formatPercent(d.value); });

            d3.select('.parlSidebar').append('div')
                .attr('class', 'parlLegend')
                .append('ul').selectAll('li')
                .data(transpose)
            .enter().append('li')
                .attr('class', function (d) { return cleanClass(d.name); })
                .style('color', function (d) { return color(d.name); })
                .on('mouseover', function (d) { return drawPath(cleanClass(d.name)); })
                .on('mouseout', function (d) { return removePath(cleanClass(d.name)); })
                .text(function (d) { return d.name; });

            d3.select('.parlSidebar').append('div')
                .attr('class', 'parlNotes')
                .append('ul')
                .attr('class', 'parlNotesUl')
                .append('li')
                .text('^Excluding Nordic countries');

        });

        function drawPath (country) {

            var circles = parliament.selectAll('circle.' + country);
            var text = parliament.selectAll('text.' + country);
            var li = d3.selectAll('.parlLegend li').filter(function() { return d3.select(this).attr('class') !== country; });
            var remAsterisk = country.replace('*', '');
            var currException = exceptions.filter(function (d) { return d.nation === remAsterisk; });

            circles.each(function () {
                this.parentNode.parentNode.appendChild(this.parentNode);
            });

            d3.select('path.' + country)
                .transition().duration(600)
                .ease("sin")
                .attr("stroke-dashoffset", 0)
                .style('opacity', '1');

            circles
                .transition().duration(600)
                .delay(function (d, i) { return i*100; })
                .attr('r', 22)
                .style('opacity', '1');

            text
                .transition().duration(600)
                .delay(function (d, i) { return 300 + i*100; })
                .style('visibility', 'visible');

            li
              .transition().duration(600)
              .style('opacity', '0.2');

            function contains (d) {
                d.country === remAsterisk;
            }

            if (exceptions.some(function (d) { return d.nation === remAsterisk; }) === true ) {

                var exceptLi = d3.select('.parlNotesUl').selectAll('.exception')
                    .data(currException)
                .enter().append('li')
                    .attr('class', 'exception')
                    .style('opacity', '0.001')

                d3.select('.exception').transition().duration(600)
                    .style('opacity', '1')
                    .text(function (d) { return '*' + d.original + ' data point recorded in ' + d.alternate; });
            }

        }

        function removePath (country) {

            var path = parliament.select('path.' + country);
            var totalLength = path.node().getTotalLength();
            var text = parliament.selectAll('text.' + country);
            var li = d3.selectAll('.parlLegend li');

            path
                .transition()
                .duration(400)
                .ease("sin")
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .style('opacity', '0.2');

            d3.selectAll('circle.' + country)
                .transition()
                .duration(400)
                .delay(function (d, i) { return i*75; })
                .attr('r', 8)
                .style('opacity', '0.7');

            text
                .transition().duration(600)
                .delay(function (d, i) { return i*75; })
                .style('visibility', 'hidden');

            li
              .transition().duration(600)
              .style('opacity', '1');

            d3.select('.exception').transition()
                .duration(600)
                .style('opacity', '0.001')
                .remove();
        }

        function cleanClass(name) {
            return name.replace(/\s/g, '').replace('*', '');
        }
    }
    return {
        init: init
    };
});