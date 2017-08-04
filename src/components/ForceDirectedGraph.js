import React from 'react';
import axios from 'axios';


var container;

export default class ForceDirectedGraph extends React.Component {

    componentDidMount() {
        this.createForceDirectedGraph();
    }

    componentWillUnmount() {        
        container.remove();
    }

    createForceDirectedGraph() {

        const DATA_URL = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

        axios(DATA_URL)
            .then((response) => {

                const {links} = response.data;
                const nodes = response.data.nodes.map((node, i) => {
                    node.id = i;
                    return node;
                })

                var margin = {
                    top: 25,
                    right: 0,
                    bottom: 30,
                    left: 75
                },
                     width = 1200 - margin.left - margin.right,
                    height = 700 - margin.top - margin.bottom;

                container = d3.select('body').append('div')
                                    .attr('id', 'container');

                var svg = container.append('svg')
                                     .attr('class', 'force-directed-graph')
                                     .attr('width', width + margin.left + margin.right)
                                     .attr('height', height + margin.bottom + margin.top)
                                     .append('g')


                var simulation = d3.forceSimulation()
                                   .force('link', d3.forceLink().id((d) => d.id))
                                   .force('charge', d3.forceManyBody().strength(-80).distanceMax(150))
                                   .force('center', d3.forceCenter(width/2, height/2))
                                   .force('', d3.forceCollide(5))
                                   .force("x", d3.forceX(width / 2).strength(.05))
                                   .force("y", d3.forceY(height / 2).strength(.05))

                var link = svg.append('g')
                              .selectAll('line')
                              .data(links)
                              .enter()
                              .append('line')
                              .attr('stroke', 'black' )

                // setting the tooltip:
                var div = d3.select("body").append("div")
                            .attr("class", "forced-direction-tooltip")
                            .style("opacity", 0);

                var node = container.append('div')
                              .attr('id', 'flag-box')
                              .selectAll('img')
                              .data(nodes)
                              .enter()
                              .append('img')
                              .attr('class', (d) => `flag flag-${d.code}`)
                              .on('mouseover', (d) => {
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.html(d.country)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                                })
                                .on("mouseout", function(d) {
                                    div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                    })
                              .call(d3.drag()
                                      .on('start', (d) => {
                                            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                                            d.fx = d.x;
                                            d.fy = d.y;
                                        })
                                      .on('drag', (d) => {
                                            d.fx = d3.event.x;
                                            d.fy = d3.event.y;
                                        })
                                      .on('end', (d) => {
                                            if (!d3.event.active) simulation.alphaTarget(0);
                                            d.fx = null;
                                            d.fy = null;
                                        }));
                node.append('title')
                    .text((d) => d.country)
                
                
                simulation.nodes(nodes)
                          .on('tick', ticked)


                simulation.force('link')
                          .links(links)
                
                    
                function ticked() {
                    link
                        .attr("x1", (d) =>  d.source.x)
                        .attr("y1", (d) =>  d.source.y)
                        .attr("x2", (d) =>  d.target.x)
                        .attr("y2", (d) =>  d.target.y);

                    node
                        .style('left',(d)=>`${d.x-8}px`)
			            .style('top',(d)=>`${d.y-5}px`);
                }
                    
                        
            })
    }

    render() {
        return (
            <div>
                <h2 className="title is-2 has-text-centered">Force Directed Graph of State Contiguity</h2>
            </div>
        )
    }
}