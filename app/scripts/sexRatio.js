require(['d3'], function () {

    'use strict';

    var
    margin = { t : 20, r : 40, b : 40, l : 40 },
    w = 960 - margin.l - margin.r,
    h = 580 - margin.t - margin.b,
    forceW = w - 300;

    var
    data,
    girlPath = 'M21.022,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.104,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.579,5.192-0.351,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.167,1.213-0.167,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.464,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.603,21.541,22.444,18.912,21.022,16.349zM15.808,13.757c2.363,0,4.279-1.916,4.279-4.279s-1.916-4.279-4.279-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757zM18.731,4.974c1.235,0.455,0.492-0.725,0.492-1.531s0.762-1.792-0.492-1.391c-1.316,0.422-2.383,0.654-2.383,1.461S17.415,4.489,18.731,4.974zM15.816,4.4c0.782,0,0.345-0.396,0.345-0.884c0-0.488,0.438-0.883-0.345-0.883s-0.374,0.396-0.374,0.883C15.442,4.005,15.034,4.4,15.816,4.4zM12.884,4.974c1.316-0.484,2.383-0.654,2.383-1.461S14.2,2.474,12.884,2.052c-1.254-0.402-0.492,0.584-0.492,1.391S11.648,5.428,12.884,4.974z',
    boyPath = 'M21.021,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.103,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.578,5.192-0.35,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.166,1.213-0.166,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.463,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.602,21.541,22.443,18.912,21.021,16.349zM15.808,13.757c2.362,0,4.278-1.916,4.278-4.279s-1.916-4.279-4.278-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757z';

    var sexRatio = d3.select('#sexRatio').append('svg')
        .attr('width', w + margin.l + margin.r)
        .attr('height', h + margin.t + margin.b)
    .append('g')
        .attr({
            transform: 'translate(330,' + margin.t + ')',
            class: 'sexGroup'
        });

    var sexControls = d3.select('#sexRatio').append('div')
        .attr('width', 200)
        .attr('class', 'sexControls')
        .html('<h2>View sex ratio data for:</h2>');

    sexControls.append('div')
        .attr('class', 'sexLegend');

    var force = d3.layout.force()
        .size([forceW, h])
        .charge(-40).alpha(0);

    d3.csv('../data/sex-ratio.csv', function (csv) {
        data = csv;

        sexControls.insert('div', '.sexLegend').attr('class', 'sexCountries')
            .append('ul').attr('class', 'countries')
            .selectAll('li')
            .data(csv)
        .enter().append('li')
            .attr('class', 'countryLink')
            .append('a')
            .style('cursor', 'pointer')
            .text(function (d) { return d.country; });

        data.map(function (d) {
            d.node = {name: d.country, boys: 105,
            girls: 100 - d['missing-girls'], missing: +d['missing-girls'] };
        });

        sexControls.selectAll('.countryLink')
            .on('click', function (d) { return drawNodes(d.country); });

    });

    function drawNodes(country) {

        // use only data from selected country
        var filtered = data.filter(function (d) {
            return d.country === country;
        });

        d3.select('.sexLegend').html(function () {
            var a = filtered[0];
            return '<p>In 2010 <strong>' + a.country + '</strong> registered ' + commas(a.births) + ' births. At the natural rate of 105 boys for every 100 girls, ' + commas(a.natural) + ' girls should have been born that year. But at its ratio of ' + a['sex-ratio'] + ' girls for every 1,000 boys, only ' + commas(a.est) + ' were born. That means <strong>' + commas(a.diff) + ' girls are "missing"</strong> for 2010 alone. And for every 105 boys, ' + a.node.missing + ' more girls should have been born.</p><h3>105<svg width="25px" height="20px"><path transform=scale(1.2) class="boyPath" d="' + boyPath + '" /></svg></h3><h3>' + a.node.girls + '<svg width="25px" height="20px"><path transform=scale(1.2) class="girlPath" d="' + girlPath + '" /></svg></h3><h3>' + a.node.missing + '<svg width="25px" height="20px"><path transform=scale(1.2) class="missingPath" d="' + girlPath + '" /></svg></h3><p><em>Data are from the World Bank and UN</em></p>';
        });

        // create array with entries for each boy, girl or missing girl
        var nodeArray = [];
        for (var i = 0; i < filtered[0].node.boys; i++) {
            nodeArray.push(['boy']);
        }
        for (i = 0; i < filtered[0].node.girls; i++) {
            nodeArray.push(['girl']);
        }
        for (i = 0; i < filtered[0].node.missing; i++) {
            nodeArray.push(['missing']);
        }

        var node = sexRatio.selectAll('.node')
            .data(nodeArray);

        node.exit().remove();

        var nodeEnter = node.enter().append('g')
            .attr('class', 'node');

        var icons = node.selectAll('path')
            .data(function (d) { return d; })
        .enter().append('path')
            .attr('class', 'iconPath')
            .attr('d', girlPath);

        d3.selectAll('.iconPath').transition()
            .each(function (d) {
            var path = d3.select(this);

            if (d === 'girl') {
                path.attr('d', girlPath)
                    .style('stroke', 'none')
                    .style('fill', 'orange');
            } else if (d === 'boy') {
                path.attr('d', boyPath)
                    .style('stroke', 'none')
                    .style('fill', '#B83834');
            } else {
                path.attr('d', girlPath)
                    .style('fill-opacity', '0')
                    .style('stroke', '#E98125')
                    .style('stroke-width', '1');
            }
        });

        icons.attr('transform', 'scale(1.2)');

        nodeEnter.call(force.drag);

        function tick() {
            node.attr('transform', function (d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });
        }

        force
            .nodes(nodeArray)
            .on('tick', tick)
            .start();
    }

    function commas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

});