import React from 'react';
import axios from 'axios';
export default class HeatMap extends React.Component {

    componentDidMount() {
        this.createHeatMap();
    }

    createHeatMap() {
        const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

        axios(DATA_URL)
            .then((response) => {
                const dataset = response.data.monthlyVariance;
                const {baseTemperature} = response.data;

                var months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

                // determine size of the chart:
                var margin = {
                    top: 25,
                    right: 25,
                    bottom: 50,
                    left: 100
                },
                    width = 1200 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;

                var years = [...new Set(dataset.map((d) => d.year))]
                var variances = dataset.map((d) => d.variance)

                var [minVariance, maxVariance] = d3.extent(dataset, (d) => d.variance);  
                var [minYear, maxYear] = d3.extent(dataset, (d) => d.year);
                var [minDate, maxDate] = [new Date(minYear, 0), new Date(maxYear, 0)]

                var barWidth = (width/years.length);
                var barHeight = (height/months.length);

                var colorScale = d3.scaleQuantile()
                                   .domain([minVariance + baseTemperature, maxVariance + baseTemperature])
                                   .range(colors)

                var svg = d3.select('.heat-map')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                            .append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')



                var monthLabels = svg.selectAll('.monthLabel')
                                .data(months)
                                .enter()
                                .append('text')
                                .text((d) => d)
                                .attr('x', 0)
                                .attr('y', (d, i) => i * barHeight)
                                .style("text-anchor", "end")
                                .attr("transform", "translate(-6," + barHeight / 1.5 + ")")

                
                var xScale = d3.scaleTime()
                               .domain([minDate, maxDate])
                               .range([0, width])
                
                var xAxis = d3.axisBottom(xScale)
                              .ticks(10)
            
                svg.append('g')
                    .attr('transform', 'translate(0,' + (height + 10) + ')')
                    .call(xAxis)

                var div = d3.select('body')
                            .append('div')
                            .attr('class', 'heatmap-tooltip')
                            .style('opacity', 0);

                svg.selectAll('.years')
                    .data(dataset, (d) => d.year + ':' + d.month)
                    .enter()
                    .append('rect')
                    .attr('x', (d) => ((d.year - minYear) * barWidth))
                    .attr('y', (d) => ((d.month - 1) * barHeight))
                    .attr('rx', 0)
                    .attr('ry', 0)
                    .attr('height', barHeight)
                    .attr('width', barWidth)
                    .style('fill', 'white')
                    .on('mouseover', (d) => {
                        div.transition()
                           .duration(200)
                           .style('background-color', 'black')
                           .style('color', 'white')
                           .style('opacity', '0.9')
                        
                        div.html(`<p>${d.year} - ${months[d.month - 1]}</p><p> Temp: ${(baseTemperature + d.variance).toFixed(3)} &#8451</p><p> Variance: ${d.variance.toFixed(3)} &#8451 </p>`)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");

                    })
                    .on('mouseout', (d) => {
                        div.transition()
                            .duration(500)
                            .style('opacity', 0)
                    })
                    .transition()
                    .duration(1000)
                    .style('fill', (d) => colorScale(d.variance + baseTemperature))
                
            })
    }

    render() {
        return (
            <div>
                <h2 className="title is-2 has-text-centered">Monthly Global Land-Surface Temperature (1753 - 2015)</h2>
                <svg className="heat-map"></svg>
            </div>
        )
    }
}