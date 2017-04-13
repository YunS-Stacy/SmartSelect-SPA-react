import React from 'react';

import enquire from 'enquire.js';
import { scrollScreen } from 'rc-scroll-anim';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';

import Nav from '../components/Nav';
import Mapping from '../components/Mapping';
import MappingPanel from '../components/MappingPanel';
import LayerToggle from '../components/LayerToggle';
import InfoCard from '../components/InfoCard';
import Map from '../components/Map';
import Background from '../components/Background';
import LocalMarket from '../components/LocalMarket';
import VariableSelection from '../components/VariableSelection';
import ModelSelection from '../components/ModelSelection';
import ProcessOverview from '../components/ProcessOverview';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { Button, Spin} from 'antd';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';

import Section3 from '../components/Section3';
import Section4 from '../components/Section4';

import Content2 from '../components/Content2';
import Content3 from '../components/Content3';
import Footer from '../components/Footer';
import Point from '../components/Point';
// import App from '../components/Tutorial';
import Predictors from '../components/Predictors';

// Goggle MD
import injectTapEventPlugin from 'react-tap-event-plugin';
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
      snackStatus: false,
    };
  }


  componentDidMount() {
    // for mobile;
    this.enquireScreen((isMode) => {
      this.setState({ isMode });
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      snackStatus: nextProps.snackMessage !==this.props.snackMessage ? true : false
    })
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
            className='background' style= {{height: '50vh'}}/>
          <Section3 id="content_2_0" key="content_2_0" isMode={this.state.isMode}/>

          <Section4 id="section_4_0" key="section_4_0" isMode={this.state.isMode}/>

          <ProcessOverview id="processoverview" key="processoverview" className='processoverview' isMode={this.state.isMode} style= {{padding: '5em 0'}}/>
          <LocalMarket id="localmarket" key="localmarket" className='localmarket' isMode={this.state.isMode}/>
          <VariableSelection id="variableselection" key="variableselection" className='variableselection' isMode={this.state.isMode} style= {{padding: '5em 0'}}/>


          {/* <Predictors id="content_2_1" key="content_2_1" isMode={this.state.isMode}/> */}

          {/* <Content2 id="content_3_0" key="content_3_0" isMode={this.state.isMode}/> */}
          {/* <Content3 id="content_4_0" key="content_4_0" isMode={this.state.isMode}/> */}

          <Footer id="footer" key="footer" isMode={this.state.isMode}/>
          <Point key="list" ref="list" data={['map', 'background', 'content_2_0', 'section_4_0', 'processoverview', 'localmarket', 'variableselection']} />
        </div>
      )
    } else {
      return (
        <div>
          <InfoCard
            tableStatus={this.props.tableStatus}
            tableMessage={this.props.tableMessage}
          />
          <MappingPanel
            dataSlider={this.props.dataSlider}
            mode={this.props.mode}
            calData={this.props.calData}
            height={this.props.height}
            dispatch={this.props.dispatch}
            mapLoaded={this.props.mapLoaded}
          />
          {/* <Spin
  					spinning={!this.props.mapLoaded}
  					delay={500}
          style={{top: '13vh', right: '-40vw', position: 'absolute'}}> */}
          <LayerToggle
            styleName={this.props.styleName}
            mode={this.props.mode}
            parcelVis={this.props.parcelVis}
            vacantVis={this.props.vacantVis}
            footVis={this.props.footVis}
            blueVis={this.props.blueVis}
            height={this.props.height}
            dispatch={this.props.dispatch}
          />
          {/* </Spin> */}
          <Snackbar
            open={this.state.snackStatus}
            message={this.props.snackMessage}
            autoHideDuration={5000}
            bodyStyle={{
              padding: '1em',
              minHeight: '6em',
              lineHeight: '2em',
            }}
          />
        </div>

      )
    }
  }

  render() {

    return(
      <MuiThemeProvider>
        <div className="templates-wrapper">
          <Spin
            spinning={!this.props.mapLoaded}
            delay={500}
            size='large'
            style={{
              visibility: this.props.mode === 'mode-welcome' ? 'hidden' : 'visible',
              top: '35vh',
              right: '38vw'
            }}>
            <Mapping
              map={this.props.map}
              maxBounds={this.props.maxBounds}
              mapStyle={this.props.mapStyle}
              mapCenter={this.props.mapCenter}
              mapZoom={this.props.mapZoom}
              mapBearing={this.props.mapBearing}
              mapPitch={this.props.mapPitch}
              calData={this.props.calData}
              height={this.props.height}
              dispatch={this.props.dispatch}
              parcelVis={this.props.parcelVis}
              footVis={this.props.footVis}
              blueVis={this.props.blueVis}
              vacantVis={this.props.vacantVis}
              blueprint={this.props.blueprint}
              mode={this.props.mode}
              parcelRange={this.props.parcelRange}
              popupInfo={this.props.popupInfo}
              compsLines={this.props.compsLines}
              compsPts={this.props.compsPts}
              routeLines={this.props.routeLines}
              routePts={this.props.routePts}
              styleName={this.props.styleName}
            />
          </Spin>
          <Nav
            className='nav'
            dispatch={this.props.dispatch}
            mode={this.props.mode} id="nav" key="nav" isMode={this.state.isMode}/>
          {this.renderContent()}

          {/* <App /> */}
        </div>
      </MuiThemeProvider>
    );

  }
}
