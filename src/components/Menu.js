import React from 'react';
import {Link} from 'react-router-dom';


export default class Menu extends React.Component {

    render() {
        return (
            <div className="tabs is-centered">
                <ul>
                    <li><Link to="/barchart">Bar Chart</Link></li>
                    <li><Link to="/scatterplot">Scatterplot Graph</Link></li>
                    <li><Link to="/heatmap">Heat Map</Link></li>
                    <li><Link to="/forcedirected">Force Directed Graph</Link></li>
                    <li><Link to="/geomap">Geo Map</Link></li>
                </ul>
            </div>
        )
    }
}