import React from 'react';
import {Link} from 'react-router-dom';


export default class Menu extends React.Component {

    render() {
        return (
            <div className="menu">
                <ul>
                    <li className="menu-item"><Link to="/barchart">Bar Chart</Link></li>
                    <li className="menu-item"><Link to="/scatterplot">Scatterplot Graph</Link></li>
                    <li className="menu-item"><Link to="/heatmap">Heat Map</Link></li>
                    <li className="menu-item"><Link to="/forcedirected">Force Directed Graph</Link></li>
                    <li className="menu-item"><Link to="/geomap">Geo Map</Link></li>
                </ul>
            </div>
        )
    }
}