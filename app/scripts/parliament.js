define(['d3'], function (d3) {
    'use strict';
    var init = function () {
        var
        margin = { t : 20, r : 40, b : 40, l : 40 },
        w = 450 - margin.l - margin.r,
        h = 550 - margin.t - margin.b,
        x = d3.scale.ordinal().rangeRoundBands([0, w], 1),
        y = d3.scale.linear().range([h, 0]).domain([0, .351]),
        color = d3.scale.category20(),
        formatPercent = d3.format('.0%');

        var data;

        var parliament = d3.select('#parliament').append('svg')
            .attr('width', w + margin.l + margin.r)
            .attr('height', h + margin.t + margin.b)
        .append("g")
            .attr({
                transform: "translate(" + margin.l + ',' + margin.t + ")",
                class: "parlGroup"
            });

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
            .tickFormat(formatPercent)
            .tickSubdivide(1)
            .ticks(8)
            .tickSize(6, 3, 0);

        // d3.selection.prototype.moveToFront = function() {
        //     return this.each(function(){
        //         this.parentNode.appendChild(this);
        //   });
        // };

        d3.csv('/data/women-parliament-asia.csv', function (csv) {

            data = csv;

            data.forEach(function (d) {
                d.value = +d.value / 100;
            });

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

            var parlGroup = parliament.selectAll('.dotGroup')
                .data(transpose);

            parlGroup.enter().append("g")
                .attr('class', '.dotGroup')
                .attr('transform', 'translate(0,0)')
                .on('mouseover', function (d) { return drawPath(cleanClass(d.name)); })
                .on('mouseout', function (d) { return removePath(cleanClass(d.name)); });;

            parlGroup.selectAll('circle')
                .data(function (d) { return d.values; })
            .enter().append('circle')
                .attr({
                    class: function (d) { return cleanClass(d.country); },
                    r: 8,
                    cx: function (d) { return x(d.year); },
                    cy: function (d) { return y(d.value); },
                    fill: function (d) { return color(d.country); }
                })
                .style('opacity', '0.7')

            var parlPath = parlGroup.append('path')
                .attr({
                    class: function (d) { return cleanClass(d.name); },
                    stroke: function (d) { return color(d.name); },
                    "stroke-width": 2,
                    fill: "none",
                    d: function (d) { return line(d.values); },
                    'pointer-events': 'none'
                })
                .style('opacity', '0.2');

            var totalLength = parlPath.node().getTotalLength();

            parlPath
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength);

            parlGroup.selectAll('text')
                .data(function (d) { return d.values; })
            .enter().append('text')
                .attr({
                    fill: "white",
                    class: function (d) { return cleanClass(d.country); },
                    x : function (d) { return x(d.year); },
                    y: function (d) { return y(d.value); },
                    dy: '.35em',
                    "font-size": 12,
                    "font-family": "Arial",
                    "text-anchor": "middle",
                    'pointer-events': 'none'
                })
                .style('visibility', 'hidden')
                .text(function (d) { return formatPercent(d.value); });

        });

        function drawPath (country) {

            var circles = d3.selectAll('circle.' + country);
            var text = d3.selectAll('text.' + country);

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
                .attr('r', 20)
                .style('opacity', '1');

            text
                .transition().duration(600)
                .delay(function (d, i) { return 300 + i*100; })
                .style('visibility', 'visible');

        }

        function removePath (country) {

            var path = d3.select('path.' + country);
            var totalLength = path.node().getTotalLength();
            var text = d3.selectAll('text.' + country);

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
        }


        function cleanClass(name) {
            return name.replace(/\s/g, '').replace('*', '');
        }
    }
    return {
        init: init
    };
});