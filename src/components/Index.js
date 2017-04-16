import React, {Component} from 'react';

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
import MissingData from '../components/MissingData';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Point from '../components/Point';
import Predictors from '../components/Predictors';

import {Spin} from 'antd';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';

// Goggle MD
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default class Index extends Component {
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
      snackStatus: nextProps.snackMessage !== (this.props.snackMessage || '') ? true : false
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
          {/* banner and main button*/}
          <Map
            dispatch={this.props.dispatch}
            mapLoaded={this.props.mapLoaded}
            mode={this.props.mode}
            id="map" key="map" className='map' isMode={this.state.isMode}/>
          {/* backgrond */}
          <Background id="background" key="background" className='background' isMode={this.state.isMode}
            style= {{height: '50vh'}}/>
          {/* missing data section */}
          <MissingData id="missingdata" key="missingdata" className="missingdata" isMode={this.state.isMode}/>
          {/* data visualization */}
          <LocalMarket id="localmarket" key="localmarket" className='localmarket' isMode={this.state.isMode}
            dataMarket={this.props.dataMarket}
          />
          {/* banner */}
          <Banner id="banner" key="banner" className='banner' isMode={this.state.isMode}/>
          {/* process overview */}
          <ProcessOverview id="processoverview" key="processoverview" className='processoverview' isMode={this.state.isMode} style= {{padding: '5em 0'}}/>
          {/* corrplot */}
          <VariableSelection id="variableselection" key="variableselection" className='variableselection' isMode={this.state.isMode} style= {{padding: '3em 0'}}
            data={this.props.dataCorrplot}
          />
          <Footer id="footer" key="footer" className='footer' isMode={this.state.isMode}/>
          <Point key="list" ref="list" data={['map', 'background', 'missingdata', 'localmarket', 'banner', 'processoverview', 'variableselection']} />
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
            pathname={this.props.location.pathname}
            className='nav'
            dispatch={this.props.dispatch}
            mode={this.props.mode} id="nav" key="nav" isMode={this.state.isMode}/>
          {this.renderContent()}
        </div>
      </MuiThemeProvider>
    );
  }
}
