define(['d3', 'jquery', 'tipsy'], function (d3, $) {
    'use strict';
    var init = function () {
        var
        margin = { t : 210, r : 40, b : 40, l : 40 },
        w = 960 - margin.l - margin.r,
        h = 600 - margin.t - margin.b,
        color = d3.scale.ordinal(),
        percent = d3.format('.1%');

        // color pies differently based on region
        var colorScales = {
            'Asia' : ['#9ECAE1', '#3182BD'],
            'Europe' : ['#A1D99B', '#30A354'],
            'Middle East' : ['#BDBDBD', '#636363'],
            'Nordic Countries' : ['#FDAE6B', '#E6550D'],
            'North America' : ['#BCBDDC', '#756BB1'],
            'South America' : ['#FC9272', '#DE2D26']
        };

        var data,
            sexes = ['women', 'men'];

        var boards = d3.select('#board').append('svg')
            .attr('width', w + margin.r + margin.l)
            .attr('height', h + margin.t + margin.b)
        .append('g')
            .attr({
                transform: 'translate(' + margin.l + ',' + margin.t + ')',
                class: 'boardGroup'
            });

        // legend and clickable options
        var boardControls = d3.select('#board')
            .append('div').attr('class', 'boardControls');

        // data attribution
        boards.append('text')
            .attr('x', w - 150)
            .attr('y', h)
            .style('font-style', 'italic')
            .text('Source: GMI Ratings');

        var radius = 32;

        var force = d3.layout.force()
            .size([w, h])
            .gravity(0)
            .charge(-1200);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) { return d.values; });

        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - 26);

        d3.csv('./data/women-on-boards.csv', function (csv) {
            data = csv;
            var titles = d3.keys(data[0]).filter(function (key) { return key !== 'country' && key !== 'region'; });

            // clickable options and legend
            boardControls.html('<h2>Select an indicator</h2>')
                .append('ul')
                .attr('class', 'boardChoices')
                .selectAll('li')
                .data(titles)
            .enter().append('li').append('a').attr('class', 'boardLink')
                .style('cursor', 'pointer')
                .on('click', function (d) {
                    d3.selectAll('.boardLink').style('color', null);
                    d3.select(this).style('color', '#E5ABA9');
                    return dataPie(d);
                })
                .text(function (d) { return d; });

            boardControls.append('div')
                .attr('class', 'boardLegend')
                .html('<h3>Legend: </h3>')
                .append('ul').selectAll('li')
                .data(data, function (d) { return d.region; })
            .enter().append('li')
                .style('color', function (d) { return colorScales[d.region][1]; })
                .text(function (d) { return d.region; });
        });

        function dataPie(dataset) {
            // filter data based on dataset, arrange it for use with pie layout
            var filterData = data.map(function (d) {
                return {name: d.country, region: d.region, women: d[dataset] / 100, men: 1 - d[dataset] / 100 };
            });

            filterData.forEach(function (d) {
                d.pieData = sexes.map(function (name) {
                    return {name: name, values: d[name]};
                });
            });

            filterData.sort(function (a, b) {
                    return d3.descending(a.women, b.women);
                });

            drawPie(filterData);
        }

        function drawPie(filtered) {
            // draw pies
            var pieGroup = boards.selectAll('.pie')
                .data(filtered);

            boards.selectAll('path').remove();

            pieGroup.enter().append('g')
                .attr('class', 'pie')
                .on('mouseover', mouseOn)
                .on('mouseout', mouseOff)
                .call(force.drag);

            pieGroup.selectAll('.arc')
                .data(function (d) { return pie(d.pieData); })
            .enter().append('path')
                .attr('class', '.arc')
                .attr('d', arc)
                .style('fill', function (d, i) {
                    color.range(colorScales[this.parentNode.__data__.region]);
                    return color(i);
                });

            // tooltips
            pieGroup.append('title')
                .text(function (d) { return percent(d.women) + ' in ' + d.name; });

            $('.pie').tipsy({
                gravity: 'w',
                html: true,
                title: function () {
                    var d = this.__data__;
                    return '<strong>' + percent(d.women) + '</strong> in <strong>' + d.name + '</strong>';
                }
            });

            function tick(e) {
                // collision detection for pies
                var q = d3.geom.quadtree(filtered),
                    i = 0,
                    n = filtered.length;

                while (++i < n) {
                    q.visit(collide(filtered[i]));
                }

                pieGroup
                    .each(gravity(e.alpha))
                    .attr('transform', function (d) {
                    return 'translate(' +
                        Math.max(radius, Math.min(w - radius, d.x)) + ',' +
                        Math.max(radius, Math.min(h - radius, d.y)) + ')';
                });
            }

            pieGroup.exit().remove();

            force
                .nodes(filtered)
                .on('tick', tick)
                .start();
        }

        // mouseover animation
        function mouseOn() {
            var circle = d3.select(this);

            circle.insert('circle', '.arc').attr('class', 'outline')
                .attr('r', radius)
                .attr('fill', 'none')
                .attr('stroke', '#EBE970')
                .attr('stroke-width', '6');
        }

        function mouseOff() {
            var circle = d3.select(this);

            circle.select('.outline').remove();
            d3.select('.boardTooltip').remove();
        }

        // custom gravity
        function gravity(alpha) {
            var cx = w / 2,
                cy = h / 2,
                ax = alpha / 2,
                ay = alpha;

            return function (d) {
                d.x += (cx - d.x) * ax,
                d.y += (cy - d.y) * ay;
            };
        }

        // collision detection
        function collide(node) {
            var r = node.radius + 20,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2
                || x2 < nx1
                || y1 > ny2
                || y2 < ny1;
          };
        }

    };
    return {
        init: init
    };
});