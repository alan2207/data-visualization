import React from 'react';
import axios from 'axios';


export default class ScatterplotChart extends React.Component {

    componentDidMount() {
        this.createScatterplotChart();
    }

    createScatterplotChart() {
        const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

        axios(DATA_URL)
            .then((response) => {
                const dataset = response.data;

                // determine size of the chart:
                var margin = {
                    top: 25,
                    right: 80,
                    bottom: 50,
                    left: 60
                },
                    width = 1200 - margin.left - margin.right,
                    height = 600 - margin.top - margin.bottom;
                
                // getting lowest and highest place
                var minPlace = dataset[0].Place,
                    maxPlace = dataset[dataset.length - 1].Place;

                // getting highest and lowest time
                var minMax = d3.extent(dataset, (d) => new Date(d.Seconds * 1000));
                var [minTime, maxTime] = minMax;


                // setting up the scales
                var yScale = d3.scaleLinear()
                                .domain([minPlace - 1, maxPlace + 1])
                                .range([0, height]);

                var yAxis = d3.axisLeft(yScale);
                
                var xScale = d3.scaleTime()
                               .domain([minTime, maxTime])
                               .range([width, 0]);

                var xAxis = d3.axisBottom(xScale)
                              .tickFormat(d3.timeFormat('%M:%S'));

                // setting up the chart
                var svg = d3.select('.scatterplot-chart')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                            .attr('class', 'scatterplot-chart')
                            .append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

                var div = d3.select('body')
                            .append('div')
                            .attr('class', 'scatterplot-chart-tooltip')
                            .style('opacity', 0);

                

                // populating all circles:
                svg.selectAll('circle')
                    .data(dataset)
                    .enter()
                    .append('circle')
                    .attr('cx', (d) => xScale(d.Seconds * 1000))
                    .attr('cy', (d) => yScale(d.Place))
                    .attr('r', 5)
                    .attr('fill', (d) => d.Doping ? '#cc1215' : 'green' )
                    // setting up the tooltip
                    .on('mouseover', (d) => {
                        div.transition()
                            .duration(200)
                            .style('background-color', d.Doping ? '#cc1215' : 'green')
                            .style('color', 'white')
                            .style('opacity', 0.9)
                        div.html(`<p class="bold">${d.Name}</p> <p>Year: ${d.Year}  Time: ${d.Time}</p><p>${d.Doping}</p>`)
                            .style('left', (d3.event.pageX) + 'px')
                            .style('top', (d3.event.pageY - 28) + 'px')
                    })
                    .on('mouseout', (d) => {
                        div.transition()
                            .duration(500)
                            .style('opacity', 0)
                    })

                
                // setting up all labels:
                svg.selectAll('text')
                    .data(dataset)
                    .enter()
                    .append('text')
                    .text((d) => d.Name)
                    .attr('x', (d) => xScale(d.Seconds * 1000) + 10)
                    .attr('y', (d) => yScale(d.Place) + 5)
                    .attr('class', 'cyclist-name')

                svg.append('g')
                   .attr('class', 'axis')
                   .call(yAxis)

                svg.append('text')
                   .attr('transform', 'translate(-40, ' + height/2 + ') rotate(-90)')
                   .style('text-anchor', 'middle')
                   .text('Position')

                svg.append('g')
                   .attr('transform', 'translate(0,' + height + ')')
                   .attr('class', 'axis')
                   .call(xAxis)

                svg.append('text')
                   .attr('transform', 'translate(' + (width/2) + ',' + (height  + 40) + ')')
                   .style('text-anchor', 'middle')
                   .text('Time')

                // setting up legends:
                svg.append('g')
                    .append('circle')
                    .attr('cx', width * 0.8)
                    .attr('cy', height * 0.8)
                    .attr('r', 5)
                    .style('fill', '#cc1215')
                
                svg.append('g')
                    .append('text')
                    .attr('x', width * 0.8 + 10 )
                    .attr('y', height * 0.8 + 10)
                    .text('Riders with doping allegations')


                svg.append('g')
                    .append('circle')
                    .attr('cx', width * 0.8)
                    .attr('cy', height * 0.8 + 30)
                    .attr('r', 5)
                    .style('fill', 'green')
                
                svg.append('g')
                    .append('text')
                    .attr('x', width * 0.8 + 10 )
                    .attr('y', height * 0.8 + 40)
                    .text('No doping allegations')
                    
                    

            })
    }

    render() {

        return (
            <div>
                <h2 className="title is-2 has-text-centered">Doping in Professional Cycling</h2>
                <svg className="scatterplot-chart"></svg>
                <div className="scatterplot-chart-description">
                    <p>Sources:</p>
                    (<a href="https://en.wikipedia.org/wiki/Alpe_d%27Huez" target="_blank">Wikipedia</a>
                    , 
                    <a href="http://www.fillarifoorumi.fi/forum/showthread.php?38129-Ammattilaispy%F6r%E4ilij%F6iden-nousutietoja-%28aika-km-h-VAM-W-W-kg-etc-%29&p=2041608#post2041608" target="_blank">fillarifoorumi</a>
                    , 
                    <a href="https://alex-cycle.blogspot.com/2015/07/alpe-dhuez-tdf-fastest-ascent-times.html" target="_blank">alex-cycle</a>
                    , 
                    <a href="http://www.dopeology.org/" target="_blank">dopeology</a>)
                </div>
            </div>
        )
    }
}