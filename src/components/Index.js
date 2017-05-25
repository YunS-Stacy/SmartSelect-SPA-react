import React, {Component} from 'react';
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
import ModelSelection from '../components/ModelSelection';
import ProcessOverview from '../components/ProcessOverview';
import ModelBuilder from '../components/ModelBuilder';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Point from '../components/Point';
import QuerySlider from '../components/QuerySlider';
import {Spin, Row, Col} from 'antd';
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
    };
  }

  componentDidMount() {
    // for mobile;
    this.enquireScreen((isMode) => {
      this.setState({ isMode });
    });
    setTimeout(() => {
      this.setState({
        isReady: true,
        isRunning: true,
      });
    }, 8000);
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
          <Row
            type="flex" justify="space-around" align="middle"
            style={{
                height:'93vh',
                backgroundColor: 'rgba(82, 186, 213, 0.8)',
            }}>
            {/* banner and main button*/}
            <Map
              dispatch={this.props.dispatch}
              mapLoaded={this.props.mapLoaded}
              mode={this.props.mode}
              id="map" key="map" className='map' isMode={this.state.isMode}/>
          </Row>
          <Row>
            {/* backgrond */}
            <Background id="background" key="background" className='background' isMode={this.state.isMode}
              style={{
                padding: '5vh 0'
              }}/>
          </Row>
          <Row>
            {/* local market */}
            <LocalMarket id="localmarket" key="localmarket" className='localmarket' isMode={this.state.isMode}
              dataMarket={this.props.dataMarket}
              listing={this.props.listing}
              imgsrc={this.props.imgsrc}
              style={{
                  padding: '5vh 0'
              }}
            />
          </Row>
          <Row
            type="flex" justify="space-around" align="middle"
            style={{
              backgroundColor: 'rgba(82, 186, 213, 0.8)',
            }}
          >
            {/* banner */}
            <Banner id="banner" key="banner" className='banner' isMode={this.state.isMode}
              style={{
                height: '60vh',
              }}
            />
          </Row>
          <Row>
            {/* process overview */}
            <ProcessOverview id="processoverview" key="processoverview" className='processoverview' />
          </Row>
          <Row>
            {/* corrplot */}
            <VariableSelection id="variableselection" key="variableselection" className='variableselection'
              data={this.props.dataCorrplot}
            />
          </Row>
          <Row>
            {/* missing data section */}
            <ModelBuilder id="modelbuilder" key="modelbuilder" className="modelbuilder" isMode={this.state.isMode}/>
          </Row>
          <Row>
            <Footer
              style={{height:'9vh'}}
              id="footer" key="footer" className='footer' isMode={this.state.isMode}/>
          </Row>
          <Point key="list" ref="list" data={['map', 'background', 'localmarket', 'processoverview', 'variableselection','modelbuilder']} />
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
            snackMessage={this.props.snackMessage}
          />
          {(this.props.mode === 'mode-query') && (
            <QuerySlider
              data={this.props.dataSlider}
              height={130}
              width={400}
              plotCfg={{margin: [10,30,40,60]}}
              forceFit={true}
              dispatch={this.props.dispatch}
              style={{
                position: 'absolute',
                top: '75vh'
              }}
            />
          )}
          <LayerToggle
            className='rightPanel'
            styleName={this.props.styleName}
            mode={this.props.mode}
            parcelVis={this.props.parcelVis}
            vacantVis={this.props.vacantVis}
            footVis={this.props.footVis}
            blueVis={this.props.blueVis}
            height={this.props.height}
            dispatch={this.props.dispatch}
          />
        </div>
      )
    }
  }

  render() {
    return(
      <MuiThemeProvider>
        <div>
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
              className='mapping'
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

          <Row>
            <Nav
              pathname={this.props.location.pathname}
              dispatch={this.props.dispatch}
              mode={this.props.mode} id="nav" key="nav" isMode={this.state.isMode}/>
            {this.renderContent()}
          </Row>
        </div>
      </MuiThemeProvider>
    );
  }
}
