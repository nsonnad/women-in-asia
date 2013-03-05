define(['d3'], function (d3) {

    'use strict';
    var init = function () {
        var
        margin = { t : 20, r : 40, b : 20, l : 130 },
        w = 600 - margin.l - margin.r,
        h = 620 - margin.t - margin.b,
        x = d3.scale.linear().range([0, w]).domain([0, 2.2]),
        y = d3.scale.ordinal().rangeRoundBands([0, h], 0.5),
        formatDecimal = d3.format('.2f');

        var colorScale = d3.scale.linear()
                .domain([0.3, 2]).interpolate(d3.interpolateHsl)
                .range(['#A8322E', '#EDC5C4']);

        // object used to draw comparison OECD average line
        var oecd = [{'Primary': 0.99, 'Secondary': 1.01, 'Tertiary': 1.29}];

        var eduData;

        var eduChart = d3.select('#education').append('svg')
            .attr('width', w + margin.l + margin.r)
            .attr('height', h + margin.t + margin.b)
        .append('g')
            .attr({
                transform: 'translate(' + margin.l + ',' + margin.t + ')',
                class: 'eduGroup'
            });

        var xAxis = d3.svg.axis()
                .scale(x)
                .orient('top')
                .tickSubdivide(1);

        eduChart.append('g')
            .attr({
                transform: 'translate(' + [0, 0] + ')',
                class: 'x axis'
            })
            .call(xAxis);

        d3.select('.x.axis')
            .append('text')
            .attr('class', 'xLabels')
            .attr('text-anchor', 'end')
            .attr('x', w)
            .attr('y', 12)
            .text('Ratio: girls to boys in education');

        d3.select('.x.axis')
            .append('text')
            .attr('class', 'xLabels')
            .attr('text-anchor', 'end')
            .attr('x', w)
            .attr('y', h)
            .text('Source: Asian Development Bank; OECD');

        eduChart.append('g')
            .attr('class', 'y axis')
            .append('line')
            .attr('class', 'domain')
            .attr('y2', h);

        d3.json('./data/education-ratios.json', function (json) {
            eduData = json;
            drawEdu('Primary');
        });

        function drawEdu(dataset) {

            // sort data based on girl:boy ratios
            var ySort = y.domain(eduData.sort(function (a, b) {
                    return d3.ascending(b[dataset].ratio, a[dataset].ratio);
                })
                .map(function (d) { return d.country; }));

            var rect = eduChart.selectAll('.rect')
                .data(eduData, function (d) { return d.country; });

            var rectEnter = rect.enter().append('g')
                .attr('transform', function (d) { return 'translate(0,' + ySort(d.country) + ')'; })
                .attr('class', 'rectGroup')
                .on('mouseover', mouseOn)
                .on('mouseout', mouseOff);

            rectEnter.append('rect')
                .attr({
                    width: function (d) { return x(d[dataset].ratio); },
                    height: 15,
                    fill: function (d) {
                        return colorScale(d[dataset].ratio);
                    },
                    class: 'rects'
                });

            // append country labels and mouseover labels
            rectEnter.append('text')
                .attr('class', 'label')
                .attr('x', -3)
                .attr('y', y.rangeBand() / 2)
                .attr('dy', '.45em')
                .attr('text-anchor', 'end')
                .text(function (d) { return d.country; });

            rectEnter.append('text')
                .attr('class', 'eduHover')
                .attr('x', function (d) { return x(d[dataset].ratio) / 2; })
                .attr('dy', '.45em')
                .attr('y', y.rangeBand() / 2)
                .style('opacity', '0.001')
                .style('fill', 'white')
                .text(function (d) { return formatDecimal(d[dataset].ratio); })

            // line for comparison to OECD
            var oecdLine = eduChart.selectAll('.oecdLine')
                .data(oecd);

            oecdLine.enter().append('g')
                .attr('class', 'oecd');

            oecdLine.append('line')
                .attr('class', 'oecdLine')
                .attr({
                    y1: 0,
                    x1: function (d) { return x(d[dataset]); },
                    y2: h,
                    x2: function (d) { return x(d[dataset]); }
                });

            oecdLine.append('text')
                .attr('class', 'oecdLabel')
                .attr('x', function (d) { return x(d[dataset]) + 10; })
                .attr('y', (h / 2))
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .text('OECD Average');
        }

        function updateEdu(dataset) {

        // update everything
            var ySort = y.domain(eduData.sort(function (a, b) {
                    return d3.ascending(b[dataset].ratio, a[dataset].ratio);
                })
                .map(function (d) { return d.country; }));

            var rectUpdate = eduChart.transition().duration(500),
                        delay = function (d, i) { return 500 + (i * 35); };

            rectUpdate.selectAll('.rects')
                .attr({
                    width: function (d) { return x(d[dataset].ratio); },
                    fill: function (d) {
                        return colorScale(d[dataset].ratio);
                    }
                });

            rectUpdate.selectAll('.rectGroup')
                .delay(delay)
                .attr('transform', function (d) {
                    return 'translate(0,' + ySort(d.country) + ')';
                })

            rectUpdate.selectAll('.oecdLine')
                .attr({
                    y1: 0,
                    x1: function (d) { return x(d[dataset]); },
                    y2: h,
                    x2: function (d) { return x(d[dataset]); }
                });

            rectUpdate.selectAll('.eduHover')
                .attr('x', function (d) { return x(d[dataset].ratio) / 2; })
                .text(function (d) { return formatDecimal(d[dataset].ratio); })

            rectUpdate.selectAll('.oecdLabel')
                .attr('x', function (d) { return x(d[dataset]) + 10; });

        }

        function mouseOn () {
            // fade out everything but selected
            var selected = this;
            d3.selectAll('.rectGroup').transition().style('opacity',function () {
                return (this === selected) ? 1.0 : 0.5;
            });

            d3.select(this).select('.eduHover').transition()
                .style('opacity', '1.0')
        }

        function mouseOff () {
            // revert to normal
            d3.selectAll('.rectGroup').transition().style('opacity', '1.0');

            d3.select(this).select('.eduHover').transition()
                .style('opacity', '1e-6')
        }

        d3.selectAll('.eduControl').on('click', function () {
            // update chart on click
                var text = this.innerHTML;

                d3.selectAll('.eduControl').style('color', null);
                d3.select(this).style('color', '#E5ABA9');
                updateEdu(text);
            });
    };
    return {
        init: init
    };
});