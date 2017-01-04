'use strict';

/**
 * Created by Drapegnik on 29.12.16.
 */

vkGraphApp.service('Graph', ['$window', '$document', function($window, $document) {
    var Graph = this;

    var navbar = $document.find('.navbar');

    Graph.width = $window.innerWidth;
    Graph.height = $window.innerHeight - navbar.height() - 10;

    Graph.center = {
        x: Graph.width / 2,
        y: Graph.height / 2
    };

    var minDem = Math.min(Graph.width, Graph.height);

    Graph.charge = {
        strength: -minDem / 2,
        maxDist: minDem / 3
    };
    Graph.nodeRadius = minDem / 50;

    Graph.draw = function(data) {
        var svg = d3.select('#graph').append('svg')
            .attr('viewBox', '0 0 ' + Graph.width + ' ' + Graph.height)
            .attr('class', 'svg-content');

        d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(function(d) { return d.id; }))
            .force('charge', d3.forceManyBody().strength(Graph.charge.strength).distanceMax(Graph.charge.maxDist))
            .force('center', d3.forceCenter().x(Graph.center.x).y(Graph.center.y))
            .on('tick', tick);


        var links = svg.selectAll('line')
            .data(data.links)
            .enter().append('line')
            .style('stroke', '#ccc')
            .style('stroke-width', 0.5);

        var nodes = svg.selectAll('g.node')
            .data(data.nodes)
            .enter().append('g');

        nodes.append('circle')
            .attr('r', Graph.nodeRadius);

        var clipPath = nodes.append('clipPath').attr('id', 'clipCircle');
        clipPath.append('circle')
            .attr('r', Graph.nodeRadius);

        nodes.append('svg:image')
            .attr('xlink:href', function(d) { return d.photo;})
            .attr('x', function() { return -Graph.nodeRadius;})
            .attr('y', function() { return -Graph.nodeRadius;})
            .attr('height', 2 * Graph.nodeRadius)
            .attr('width', 2 * Graph.nodeRadius)
            .attr('clip-path', 'url(#clipCircle)');

        function tick() {
            links
                .attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            nodes.attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';});
        }
    };
}]);