import React, { Component } from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';

import Menu from './Menu';
import Index from './Index';
import BarChart from './BarChart';
import ForceDirectedGraph from './ForceDirectedGraph';
import GeoMap from './GeoMap';
import HeatMap from './HeatMap';
import ScatterplotChart from './ScatterplotChart';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1 className="title is-1 has-text-centered">Data Visualization With D3 & React</h1>
        
        <Router>
          <div className="container">
          <Menu />
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/barchart" component={BarChart} />
            <Route path="/scatterplot" component={ScatterplotChart} />
            <Route path="/heatmap" component={HeatMap} />
            <Route path="/forcedirected" component={ForceDirectedGraph}/>
            <Route path="/geomap" component={GeoMap}/>
          </Switch>
          </div>
        </Router>
      </div>
      
    );
  }
}
