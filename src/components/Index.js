import React from 'react';
import jquery from 'jquery';

// import ReactDOM from 'react-dom';
import enquire from 'enquire.js';
import { scrollScreen } from 'rc-scroll-anim';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Nav from '../components/Nav';
import Mapping from '../components/Mapping';
import MappingPanel from '../components/MappingPanel';
import LayerToggle from '../components/LayerToggle';
import InfoCard from '../components/InfoCard';


import Map from '../components/Map';
import Background from '../components/Background';
import LocalMarket from '../components/LocalMarket';
import VariableSelection from '../components/VariableSelection';


// import Section3 from '../components/Section3';
// import Section4 from '../components/Section4';
//
// import Content2 from '../components/Content2';
// import Content3 from '../components/Content3';
import Footer from '../components/Footer';
import Point from '../components/Point';
// import App from '../components/Tutorial';
import Predictors from '../components/Predictors';
// import Corrplot from '../components/Corrplot';
// import RosePlot from '../components/RosePlot';
// import RosePlotPhilly from '../components/RosePlotPhilly';





// Goggle MD
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import './less/antMotion_style.less';
// import './less/common.less';
// import './less/global.less';
// import './less/custom.less';


export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMode: false,
    };
  }


  componentDidMount() {
    // for mobile;
    this.enquireScreen((isMode) => {
      this.setState({ isMode });
    });
  }

  enquireScreen = (cb) => {
    /* eslint-disable no-unused-expressions */
    enquire.register('only screen and (min-width: 320px) and (max-width: 767px)', {
      match: () => {
        cb && cb(true);
      },
      unmatch: () => {
        cb && cb();
      },
    });
    /* eslint-enable no-unused-expressions */
  }

  renderContent(){
    if(this.props.mode === 'mode-welcome'){
      return (
        <div>
          <Map
            dispatch={this.props.dispatch}
            mapLoaded={this.props.mapLoaded}
            mode={this.props.mode}
            id="map" key="map" isMode={this.state.isMode}/>
          <Background id="background" key="background" isMode={this.state.isMode}
            style= {{height: '50vh'}}/>
          <LocalMarket id="localmarket" key="localmarket" isMode={this.state.isMode}/>
          <VariableSelection id="variableselection" key="variableselection" isMode={this.state.isMode}/>

          {/* <Section3 id="content_2_0" key="content_2_0" isMode={this.state.isMode}/> */}
          {/* <Predictors id="content_2_1" key="content_2_1"/> */}
          {/* <Section4 id="section_4_0" key="section_4_0" isMode={this.state.isMode}/> */}
          {/* <Content2 id="content_3_0" key="content_3_0" isMode={this.state.isMode}/> */}
          {/* <Content3 id="content_4_0" key="content_4_0" isMode={this.state.isMode}/> */}

          <Footer id="footer" key="footer" isMode={this.state.isMode}/>
          {/* <Point key="list" ref="list" data={['map', 'content_2_0', 'content_3_0', 'content_4_0', 'content_9_0']} /> */}
          <Point key="list" ref="list" data={['map', 'background', 'localmarket', 'variableselection']} />
        </div>
      )
    } else {
      return (
        <div>
          <MappingPanel {...this.props}
            calData={this.props.calData}
            height={this.props.height}
            initialMap={this.props.initialMap}
          />
          <LayerToggle
            parcelVis={this.props.parcelVis}
            footVis={this.props.footVis}
            blueVis={this.props.blueVis}
            dispatch={this.props.dispatch}
            initialMap={this.props.initialMap}
            height={this.props.height}/>
        </div>

      )
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.mode==='mode-query'){
      jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'visible');
    } else{
      jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'hidden');
    }
  }

  render() {

    return(
      <MuiThemeProvider>
        <div className="templates-wrapper">
          {/* <Corrplot /> */}
          {/* <RosePlotPhilly /> */}

          {/* <RosePlot/>  */}
          <Mapping
            initialMap={this.props.initialMap}
            dispatch={this.props.dispatch}
            {...this.props}
          />
          <Nav
            dispatch={this.props.dispatch}
            mode={this.props.mode} id="nav" key="nav" isMode={this.state.isMode}/>
          {this.renderContent()}

          {/* <App /> */}
        </div>
      </MuiThemeProvider>
    );

  }
}
