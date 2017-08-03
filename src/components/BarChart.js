import React from 'react';
import axios from 'axios';


export default class BarChart extends React.Component {

    componentDidMount() {
        this.createBarChart();
    }

    createBarChart() {
        const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
        axios(DATA_URL)
            .then((response) => {
                const dataset = response.data.data;

                // month names - used to extract month names from the given data:
                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                //adding text for description of the chart:
                d3.select('.bar-chart-description')
                  .append('text')
                  .text(response.data.description);

                
                // determine size of the chart:
                var margin = {
                    top: 25,
                    right: 10,
                    bottom: 30,
                    left: 75
                },
                    width = 1200 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;

                var barWidth = Math.ceil(width/dataset.length);

                var minYear = new Date(dataset[0][0]);
                var maxYear = new Date(dataset[dataset.length - 1][0]);

                // setting scales:

                var x = d3.scaleTime()
                               .domain([minYear, maxYear])
                               .range([0, width]);

                var y = d3.scaleLinear()
                          .range([height, 0])
                          .domain([0, d3.max(dataset, (d) => d[1])]);
                

                var xAxis = d3.axisBottom(x)
                              .ticks(d3.timeYears.count)

                var yAxis = d3.axisLeft(y)
                              .ticks(10)


                var chart = d3.select('.bar-chart')
                              .attr('margin', '0 auto')
                              .attr('width', width + margin.left + margin.right)
                              .attr('height', height + margin.top + margin.bottom)
                              .append('g')
                              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                
                // setting horizontal axis info:
                chart.append('g')
                     .attr('class', 'x axis')
                     .attr("transform", "translate(0," + height + ")")
                     .call(xAxis);

                // setting vertical axis info:
                chart.append('g')
                     .attr('class', 'y axis')
                     .call(yAxis)
                     .append('text')
                     .attr('transform', 'rotate(-90)')
                     .attr('dy', '0.8em')
                     .style('text-anchor', 'end')
                     .text('Gross Domestic Product, USA')

                // setting the tooltip:
                var div = d3.select("body").append("div")
                            .attr("class", "bar-chart-tooltip")
                            .style("opacity", 0);

                // appending bars and adding tooltip:
                chart.selectAll('.bar')
                     .data(dataset)
                     .enter()
                     .append('rect')
                     .attr('class', 'bar')
                     .attr('x', (d) => x(new Date(d[0])))
                     .attr('y', (d) => y(d[1]))
                     .attr('height', (d) => height - y(d[1]))
                     .attr('width', barWidth)
                     .on('mouseover', (d) => {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(`${monthNames[parseInt(d[0].split('-')[1], 10) - 1]} - ${d[0].split('-')[0]}` + "<br/>" +'<p class="bold">' +`$${d[1]} billion` + '</p>' )
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            div.transition()
                                .duration(500)
                                .style("opacity", 0);
                            });
                
            })
    }

    render() {
        return (
            <div>
                <h2 className="title is-2 has-text-centered">GDP - (USA)</h2>
                <svg className="bar-chart"></svg>
                <div className="bar-chart-description"></div>
            </div>
        )
    }
}