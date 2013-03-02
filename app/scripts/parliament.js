define(['d3'], function (d3) {
    'use strict';
    var init = function () {
        var
        margin = { t : 20, r : 40, b : 40, l : 40 },
        w = 450 - margin.l - margin.r,
        h = 550 - margin.t - margin.b,
        x = d3.scale.ordinal().rangeRoundBands([0, w], 1),
        y = d3.scale.linear().range([h, 0]).domain([0, .4]),
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

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(formatPercent)
            .tickSubdivide(1)
            .tickSize(6, 3, 0);

        d3.csv('/data/women-parliament-asia.csv', function (csv) {

            data = csv;

            data.forEach(function (d) {
                d.value = +d.value / 100;
            });

            x.domain(data.map(function (d) { return d.year; }));

            parliament.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            parliament.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(xAxis);

            var parlGroup = parliament.selectAll('.dotGroup')
                .data(data);

            parlGroup.enter().append("g")
                .attr('class', '.dotGroup')
                .attr('transform', 'translate(0,0)');

            parlGroup.append('circle')
                .attr({
                    class: function (d) { return cleanClass(d.country); },
                    r: 10,
                    cx: function (d) { return x(d.year); },
                    cy: function (d) { return y(d.value); },
                    fill: function (d) { return color(d.country); }
                });


            console.log(data)



        });
        function cleanClass(name) {
            return name.replace(/\s/g, '').replace('*', '');
        }
    }
    return {
        init: init
    };
});