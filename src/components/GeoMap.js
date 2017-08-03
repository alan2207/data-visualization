import React from 'react';
import axios from 'axios';

export default class GeoMap extends React.Component {

    componentDidMount()  {
        this.createMap();
    }


    createMap() {
        const MAP = 'http://enjalot.github.io/wwsd/data/world/world-110m.geojson';
        const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';


        var margin = {
                    top: 25,
                    right: 0,
                    bottom: 30,
                    left: 5
                },
                     width = 1200 - margin.left - margin.right,
                    height = 700 - margin.top - margin.bottom;

        const zoom = d3.zoom()
                        .scaleExtent([1, 10])
                        .on('zoom', () => d3.selectAll('path').attr('transform', d3.event.transform));


        var svg = d3.select('.geomap')
                    .attr('height', height + margin.top + margin.bottom)
                    .attr('width', width + margin.left + margin.right)
                    .call(zoom)

        var projection = d3.geoMercator()
                            .scale(width/2/Math.PI)
                            .translate([width/2, height/2])
        

        var path = d3.geoPath()
                      .projection(projection)

        axios(MAP)
                .then((map) => {
                    svg.append('path')
                        .attr('d', path(map.data))
                        .style('fill', 'E8D8B7')


                    axios(DATA_URL)
                        .then((response) => {

                            // setting the tooltip:
                            var div = d3.select("body").append("div")
                                        .attr("class", "geomap-tooltip")
                                        .style("opacity", 0);

                            

                            svg.append('g')
                                .selectAll('.meteorites')
                                .data(response.data.features)
                                .enter()
                                .append('path')
                                .attr('class', 'meteorite')
                                .attr('d', path.pointRadius((d) => Math.cbrt(d.properties.mass * 5 / (4 * Math.PI) ) /10))
                                .attr('fill', 'red')
                                .style('opacity', '0.8')
                                .on('mouseover', (d) => {
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.html(`<p>Name: ${d.properties.name}</p> <p>Mass: ${d.properties.mass}</p> <p>Year: ${d.properties.year.split('-')[0]}</p>`)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                                })
                                .on("mouseout", function(d) {
                                    div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                    })
                        })
                })
    }

    render() {
        return (
            <div>
                <h2 className="title is-2 has-text-centered">Meteorite Landings</h2>
                <svg className="geomap"></svg>
            </div>
        )
    }
}