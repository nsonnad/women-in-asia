define(['d3'], function (d3) {

    'use strict';

    var
    margin = { t : 20, r : 40, b : 20, l : 130 },
    w = 600 - margin.l - margin.r,
    h = 620 - margin.t - margin.b,
    x = d3.scale.linear().range([0, w]).domain([0, 2.2]),
    y = d3.scale.ordinal().rangeRoundBands([0, h], 0.5);

    var colorScale = d3.scale.linear()
            .domain([0.3, 2]).interpolate(d3.interpolateHsl)
            .range(['#A8322E', '#EDC5C4']);

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

    d3.json('../data/education-ratios.json', function (json) {
        eduData = json;
        drawEdu('Primary');
    });

    function drawEdu(dataset) {

        eduData.filter(function (d) {
            return d[dataset].ratio !== 'null';
        });

        var ySort = y.domain(eduData.sort(function (a, b) {
                return d3.ascending(b[dataset].ratio, a[dataset].ratio);
            })
            .map(function (d) { return d.country; }));

        var rect = eduChart.selectAll('.rect')
            .data(eduData, function (d) { return d.country; });

        var rectEnter = rect.enter().append('g')
            .attr('transform', function (d) { return 'translate(0,' + ySort(d.country) + ')'; })
            .attr('class', 'rectGroup');

        rectEnter.append('rect')
            .attr({
                width: function (d) { return x(d[dataset].ratio); },
                height: 12,
                fill: function (d) {
                    return colorScale(d[dataset].ratio);
                },
                class: 'rects'
            });

        rectEnter.append('text')
            .attr('class', 'label')
                .attr('x', -3)
                .attr('y', y.rangeBand() / 2)
                .attr('dy', '.35em')
                .attr('text-anchor', 'end')
                .text(function (d) { return d.country; });

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
        eduData.filter(function (d) {
            return d[dataset].ratio !== 'null';
        });

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
            });

        rectUpdate.selectAll('.oecdLine')
            .attr({
                y1: 0,
                x1: function (d) { return x(d[dataset]); },
                y2: h,
                x2: function (d) { return x(d[dataset]); }
            });

        rectUpdate.selectAll('.oecdLabel')
            .attr('x', function (d) { return x(d[dataset]) + 10; });

    }

    d3.selectAll('.eduControl').on('click', function () {

            var text = this.innerHTML;

            d3.selectAll('.eduControl').style('color', null);
            d3.select(this).style('color', '#E5ABA9');
            updateEdu(text);
        });
});