define(['d3'], function (d3) {
    'use strict';
    var init = function () {
        var
        margin = { t : 20, r : 140, b : 80, l : 40 },
        w = 960 - margin.l - margin.r,
        h = 470 - margin.t - margin.b,
        x = d3.scale.ordinal().rangeRoundBands([0, w], 0.07),
        y = d3.scale.linear().rangeRound([h, 0]),
        color = d3.scale.ordinal(), // range to be determined based on data
        stack = d3.layout.stack(),
        formatPercent = d3.format('.0%');

        var surveyData,
            data;

        var colorBlends = {
            'blue': ['#ADCDE1', '#96BFD9', '#6baed6', '#3182bd', '#08519c'],
            'red': ['#FDAD9B', '#FC9078', '#fb6a4a', '#de2d26', '#a50f15']
        };

        var questions = {
            'women-politics': 'Which one of the following statements comes closest to your opinion about men and women as political leaders?...Men generally make better political leaders than women, or Women generally make better political leaders than men, or In general, women and men make equally good political leaders?',
            'jobs': 'Please tell me whether you completely agree, mostly agree, mostly disagree, or completely disagree with the following statements...When jobs are scarce, men should have more right to a job than women.',
            'outside-home': 'Please tell me whether you completely agree, mostly agree, mostly disagree, or completely disagree with the following statements...Women should be able to work outside the home.'
        };

        var surveyChart = d3.select('#surveys').append('svg')
           .attr('width', w + margin.l + margin.r)
           .attr('height', h + margin.t + margin.b)
        .append('g')
            .attr({
                transform: 'translate(' + margin.l + ',' + margin.t + ')',
                class: 'surveyGroup'
            });

        // data source attribution
        surveyChart.append('text')
            .attr('class', 'surveyAttribution')
            .attr('y', h + margin.b - 5)
            .attr('x', 0)
            .text('Source: Pew Global Attitudes Project. *Non-national sample.');

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(d3.format('.0%'));

        surveyChart.append('g')
              .attr('class', 'y axis')
              .call(yAxis);

        d3.json('./data/asia-surveys-master.json', function (error, json) {
            surveyData = json;

            // change text of survey question
            d3.select('#questText').text(questions.jobs);

            // x-domain contains one entry for each country
            x.domain(json.jobs.map(function (d) { return d.Country; }));

            surveyChart.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + h + ')')
                .call(xAxis);

            d3.selectAll('#surveys .x.axis text')
                .attr('transform', 'translate(' + x.rangeBand() / 2 + ',15) rotate(45)');

            // draw first chart
            setData('jobs');
        });

        function setData(dataset) {

            // filter data based on chosen dataset
            data = surveyData[dataset];

            // create arrays of values for each response choice
            var responseNames = d3.keys(data[0]).filter(function (key) {
                return key !== 'Country' && key !== 'region' && key !== 'responses';
            });

            var stackData =
                stack(responseNames.map(function (name) {
                    return data.map(function (d) {
                        return {name: name, region: d.region, x: d.Country, y: d[name] / 100 };
                    });
                }));

            var yMax = d3.max(stackData, function (layer) {
                return d3.max(layer, function (d) {
                    return d.y0 + d.y;
                });
            });

            y.domain([0, yMax]);

            drawData(stackData);
        }

        function drawData(filtered) {

            d3.transition().duration(750).each(function () {

                // bring stuff into chart
                var bars = surveyChart.selectAll('.surveyRectGroup')
                    .data(filtered);

                bars.exit().transition()
                    .style('opacity', '1e-6').remove();

                bars.enter().append('g')
                    .attr('class', 'surveyRectGroup');

                bars.selectAll('rect')
                    .data(function (d) { return d; })
                .enter().append('rect')
                    .attr('width', x.rangeBand())
                    .attr('x', function (d) { return x(d.x); })
                    .attr('y', function (d) { return y(d.y0 + d.y); })
                    .attr('height', 0);

                bars.selectAll('.barText')
                    .data(function (d) { return d; })
                .enter().append('text')
                    .attr('class', 'barText')
                    .attr('pointer-events', 'none')
                    .style('text-anchor', 'middle')
                    .style('visibility', 'hidden')
                    .text(function (d) { return formatPercent(d.y); });

                var legend = bars.selectAll('.legend')
                    .data(function (d) {
                        return d.filter(function (c) {
                            return c.x === 'USA';
                        });
                    });

                legend.enter().append('text')
                    .attr('class', 'legend')
                    .attr('id', function (d) { return cleanClass(d.name); })
                    .attr('transform', function (d) {
                        return 'translate(' + (x(d.x) + x.rangeBand()) + ',' + (y(d.y0 + d.y) + (y(d.y0) - y(d.y0 + d.y)) / 2) + ')';
                    })
                    .attr('x', 5)
                    .attr('dy', '.35em')
                    .style('opacity', '0.2')
                    .on('mouseover', mouseOn)
                    .on('mouseout', mouseOff)
                    .text(function (d) { return d.name; });

                // transitions
                bars.selectAll('rect').transition()
                    .attr('y', function (d) { return y(d.y0 + d.y); })
                    .attr('height', function (d) { return y(d.y0) - y(d.y0 + d.y); })
                    .style('fill', function (d) {
                        d.region === 'Asia' ?
                        color.range(colorBlends.red)
                        : color.range(colorBlends.blue);
                        return color(d.name);
                    })
                    .each('end', function () {
                        d3.select(this).attr('class', function (d) {
                            return cleanClass(d.name);
                        });
                    });

                bars.selectAll('.barText').transition()
                    .attr('y', function (d) { return y(d.y0 + d.y) + (y(d.y0) - y(d.y0 + d.y)) / 2; })
                    .attr('x', function (d) { return x(d.x) + x.rangeBand() / 2; })
                    .attr('dy', function (d) { return (d.y) < 0.025 ? '.5em' : '.35em'; })
                    .style('opacity', function (d) { return (d.y) === 0 ? 1e-6 : 1; })
                    .text(function (d) { return formatPercent(d.y); })
                    .each('end', function () {
                        d3.select(this).attr('class', function (d) { return cleanClass(d.name) + ' barText' ; });
                    });

                bars.selectAll('.legend').transition()
                    .attr('transform', function (d) { return 'translate(' + (x(d.x) + x.rangeBand()) + ',' + (y(d.y0 + d.y) + (y(d.y0) - y(d.y0 + d.y)) / 2) + ')'; })
                    .attr('id', function (d) { return cleanClass(d.name); })
                    .text(function (d) { return d.name; });

                d3.selectAll('.surveyRectGroup rect').on('mouseover', mouseOn);
                d3.selectAll('.surveyRectGroup rect').on('mouseout', mouseOff);
            });
        }

        // remove spaces and slashes from class names
        function cleanClass(name) {
            return name.replace(/\s/g, '').replace('/', '');
        }

        function mouseOn() {
            var thisClass;

            if (d3.select(this).attr('class') === 'legend') {
                thisClass = d3.select(this).attr('id');
                d3.selectAll('text.' + thisClass).style('visibility', 'visible');
                d3.select('#' + thisClass).style('opacity', '0.9');
            } else {
                thisClass = d3.select(this).attr('class');
                d3.selectAll('text.' + thisClass).style('visibility', 'visible');
                d3.select('#' + thisClass).style('opacity', '0.9');
            }
        }

        function mouseOff() {
            var thisClass;

            if (d3.select(this).attr('class') === 'legend') {
                thisClass = d3.select(this).attr('id');
                d3.selectAll('.barText').style('visibility', 'hidden');
                d3.select('#' + thisClass).style('opacity', '0.2');
            } else {
                thisClass = d3.select(this).attr('class');
                d3.selectAll('.barText').style('visibility', 'hidden');
                d3.select('#' + thisClass).style('opacity', '0.2');
            }
        }

        d3.selectAll('.surveyControl').on('click', function () {
            var updateVal = d3.select(this).property('id');
            setData(updateVal);

            d3.select('#questText').text(questions[updateVal]);

            d3.selectAll('.surveyControl').style('color', null);
            d3.select(this).style('color', '#E5ABA9');
        });
    };
    return {
        init: init
    };
});
