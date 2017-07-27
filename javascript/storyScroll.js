function storyScroll(width, height, spread, story) {
    //setting up canvas and defs for D3 chart
    d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        //create a marker that can be used to indicate direction.
        .append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', 15)
        .attr('refY', 5)
        .attr('orient', 'auto')
        .attr('markerUnits', 'strokeWidth')
        //add a shape to that marker
        .append('circle').attr('r', 3).attr('cx', 5).attr('cy', 5);

    //setting up a tooltip to call later
    var tooltip = d3.select('body').append('div')
        .attr('id', 'tooltipNode')
        .style('display', 'block')
        .style('position', 'absolute')
        .style('z-index', 10)
        .style('visibility', 'hidden');

    //loading canvas into variable
    var svg = d3.select('svg');

    //setting up force simulation, defining the nodes on which to apply the force and a center
    var storySpread = d3.forceSimulation()
        .force('link', d3.forceLink().distance(function () {
            return spread;
        }).id(function (d) {
            return d.id;
        }))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(function () {
            return spread;
        }));

    //collecting data
    var data = story;

    //use data to create svg group for links, set stroke, attach arrow-head
    var link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke-width', 1)
        .attr('marker-end', 'url(#arrow)');

    //use data to create svg group for nodes, set circle radius, etc.
    var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', 4)
        .attr('fill', function (d) {
            if (d.type == 'Start') {
                return '#00E676';
            } else if (d.type == 'End') {
                return '#e66';
            } else {
                return '#29B6F6';
            };
        })
        .attr('stroke', function (d) {
            if (d.type == 'Start') {
                return '#00E676'
            } else if (d.type == 'End') {
                return '#e66';
            } else {
                return '#29B6F6';
            }
        })
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragContinued)
            .on('end', dragEnded))
        //show tooltip when hovering over node
            .on('mouseover', function (d) {
                tooltip.text(d.event);
                tooltip.style('visibility', 'visible')
            })
            .on('mousemove', function (d) {
                tooltip.style('left', (d3.event.pageX));
                tooltip.style('top', (d3.event.pageY));
            });

    //use data to create svg group for text labels
    var label = svg.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(function (d) {
            return d.id;
        });

    //use data to create svg group for choice labels
    var choice = svg.append('g')
        .attr('class', 'choices')
        .selectAll('text')
        .data(data.links)
        .enter()
        .append('text')
        .text(function (d) {
            return d.choice;
        });

    //OPTIONAL add metadata to nodes:
    node.append('title').text(function (d) {
        return d.id;
    });

    //load simulation on nodes from data
    storySpread
        .nodes(data.nodes)
        //gradually change start and end point of lines, circles until resting
        .on('tick', ticked);

    //load simulation on links form data
    storySpread
        .force('link')
        .links(data.links);

    //function that defines paths/circles based on data (helper functions)
    function ticked() {
        link
            .attr('x1', function (d) {
                return d.source.x;
            })
            .attr('y1', function (d) {
                return d.source.y;
            })
            .attr('x2', function (d) {
                return d.target.x;
            })
            .attr('y2', function (d) {
                return d.target.y;
            });

        choice
            .attr('x', function (d) {
                return (d.source.x + d.target.x) / 2;
            })
            .attr('y', function (d) {
                return (d.source.y + d.target.y) / 2;
            });

        node
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            });

        label
            .attr('x', function (d) {
                return d.x + 14
            })
            .attr('y', function (d) {
                return d.y + 5
            });
    };

    //functions that, when called, allow nodes to be dragged
    function dragStarted(d) {
        if (!d3.event.active) storySpread.alphaTarget(0.3).restart();
        //making the fixed position a starting position
        d.fx = d.x;
        d.fy = d.y;
    };

    function dragContinued(d) {
        //making the fixed position the same as the mouse position during the dragged event
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    function dragEnded(d) {
        if (!d3.event.active) storySpread.alphaTarget(0);
        //making it so that there is no fixed position, allowing the simulation to set the position again
        d.fx = null;
        d.fy = null;
    };
};
