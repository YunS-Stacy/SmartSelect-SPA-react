import React, { Component, PropTypes } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, ZoomControl, ScaleControl, Source, Popup, Marker} from "react-mapbox-gl";
import turf from 'turf';

// import MapboxDirections from '@mapbox/mapbox-gl-directions/src/directions';

import jquery from 'jquery';
import _ from 'lodash';
import Pubsub from 'pubsub-js';

import Snackbar from 'material-ui/Snackbar';
import { Icon, Button, Slider } from 'antd';

import Paper from 'material-ui/Paper';

import InfoCard from './InfoCard';


// mapboxgl.accessToken = 'pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA';
export default class Mapping extends Component {
  constructor(props) {
    super(props);
    this.state={
      ptsPairs: '',
      compsPts:{
        'type': 'Feature',
        'geometry': {
          'type': 'MultiPoint',
          'coordinates': [[0,0],[0,0]]
        }
      },
      compsLines:{
        'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [[[0,0],[0,0]]]
        }
      },

      showInfoCard: false,
      zillowMessage: '',
      popupCoords: [0,0],
      popupMessage: '',
      zpid: '',
      draw: new MapboxDraw({
        displayControlsDefault: true,
        controls: {
          polygon: true,
          trash: true
        },
      }),
    };
  }
  renderInfoCard(){
    if(this.state.showInfoCard === true){
      return <InfoCard/>
    }
  };
  renderZillowMarker(){
    if(_.isObject(this.state.ptsPairs)){
      const features = this.state.ptsPairs.features;
      const i = this.state.ptsPairs.features;
      return features.map((item, i) => {
        const coord = mapboxgl.LngLat.convert(item.geometry.coordinates);
        return (
          <Marker
            // onClick={(e)=>{console.log('marker', coord);
            // this.props.map.querySourceFeatures  ('compsPts', [parameters])}}
            key={`marker${i}`} className={`marker${i}`}
            coordinates={coord} >
            <Button disabled={i===0?true:false} shape='circle' size='large'>
              <Icon type={i===0?'tag':'search'}/>
            </Button>
          </Marker>
        );
      });
    }
  }
  // handleClick(map, e){
  //   let features = map.queryRenderedFeatures(e.point, { layers: ['aptParcel'] });
  //   // if the features have no info, return nothing
  //   if (!features.length) {
  //     return;
  //   }
  //   let feature = features[0];
  //   this.setState({
  //     popupCoords: feature.geometry.coordinates,
  //     popupMessage: feature.properties['sold_without_price_estimate']
  //
  //   })
  // };

  handleMouseMove(map, e){
    //changing the cursor style to 'pointer'

    let features = map.queryRenderedFeatures(e.point, { layers: ['aptParcel'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    if (features.length) {
      this.setState({
        popupCoords: [0,0],
      })
      let feature = features[0];
      let address = feature.properties['location'];
      address = _.toLower(feature.properties['location']);
      address = _.startCase(address); // handle the upper and lowercase
      this.setState({
        popupCoords: mapboxgl.LngLat.convert([feature.properties['lon'],feature.properties['lat']]),
        popupMessage: {
          address: address,
          refPrice: feature.properties['refprice'].toFixed(2),
          source: feature.properties['predicted'] === 1 ? 'Predicted Value' : 'Record from Latest Transaction',
          zoning: feature.properties['zoning'],
          opa: feature.properties['opa_accoun'],
        },
        zpid: feature.properties['zpid'],
      });
    }
  }
  // this.props.dispatch({
  //   type: "smartselect/getInitialData"
  // });


  handleLoaded(map){
    this.props.dispatch({
      type: "smartselect/mapLoad",
      map: map,
      draw: this.state.draw,
    });

    setTimeout(()=>{
      this.props.dispatch({
        type: "smartselect/asyncLoaded"
      });

    }, 5000);
  }

  componentWillReceiveProps(nextProps){
    const map = this.props.map;

    //
    // if(nextProps.mode === mode-welcome){
    //   console.log('reset the map')
    //   this.setState({
    //     popupCoords: [0,0],
    //     popupMessage: '',
    //   });
    //   map.getSource('compsLines').setData(this.state.comps.lines);
    //   map.getSource('compsPts').setData(this.state.comps.pts);
    // }

    if(nextProps.dataZillow !== this.props.dataZillow ){
      const dataType = typeof nextProps.dataZillow;
      switch (dataType) {
        case 'object':
        // set the line data
        const linePairs = _.map(nextProps.dataZillow, (datum)=>{
          let pairs = [ _.values(datum.coord), _.values(this.state.popupCoords)];
          return pairs;
        });
        const multiLine = turf.multiLineString(linePairs);
        map.getSource('compsLines').setData(multiLine);
        // first define each point as a featurePoint and take zillowdata as properties
        // then combine them as featurecollection to set the source data
        const compsPts = nextProps.dataZillow.map((item, i)=>{
          return turf.point(_.values(item.coord),{...item, i});
        })
        // use temp source to set data
        const ptsPairs = turf.featureCollection(compsPts);
        // add the origin to create bbox contains all features
        const origin = turf.point(_.values(this.state.popupCoords)); //convert to array
        const tempPts = _.concat(compsPts, [origin]);
        const tempBbox = turf.featureCollection(tempPts)
        const bbox = turf.bbox(tempBbox);
        map.fitBounds(bbox, {padding: 100});
        this.setState({
          ptsPairs: ptsPairs,
        })
        break;
        case 'string':
        this.setState({
          zillowMessage: nextProps.dataZillow,
        })
        break;
        default:
        break;
      }

      // jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'hidden');
    }
  }
  render(){
    const {props} = this;
    const mapPosition= this.props.mode === 'mode-welcome' ? 'fixed' : 'absolute';
    // const mapInteractive = this.props.mode === 'mode-welcome' ? false : true;
    return (

      <ReactMapboxGl
        style={this.props.mapStyle}
        accessToken="pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA"
        zoom = {this.props.mapZoom}
        center={this.props.mapCenter}
        bearing={this,props.mapBearing}
        pitch={this.props.mapPitch}
        containerStyle={{
          height: "100vh",
          width: "100vw",
          position: mapPosition,
        }}
        onStyleLoad={(map)=>{this.handleLoaded(map)}}
        onMouseMove={(map, e)=>{this.handleMouseMove(map, e)}}
        onMouseUp={(map, e)=> {this.props.dispatch({type: 'smartselect/changeCenter', mapCenter: map.getCenter()})}}
      >
        {/* {this.reAddlayer()}
        {/* parcelLayer */}
        <Layer
          id="aptParcel"
          type= "fill"
          sourceId='composite'
          layerOptions={{
              'minzoom': 10,
              'source-layer': 'finalParcel',
              'filter': ["all", [">=", 'refprice', this.props.parcelRange[0]], ["<=", 'refprice', this.props.parcelRange[1]]]
          }}
          paint={{
            'fill-color': {
                property: 'refprice',
                type: 'interval',
                stops:
                [
                  [69100, 'rgba(12, 44, 132, 0.7)'],
                  [94200, 'rgba(34, 94, 168, 0.7)'],
                  [119000, 'rgba(29, 145, 192, 0.7)'],
                  [141167.2895, 'rgba(65, 182, 196, 0.7)'],
                  [166690, 'rgba(127, 205, 187, 0.7)'],
                  [191400, 'rgba(254, 190, 18, 0.7)'],
                  [225681.8558, 'rgba(238, 131, 110, 0.7)'],
                  [285000, 'rgba(232, 92, 65, 0.7)'],
                  [386939.4174, 'rgba(219, 58, 27, 0.7)'],
                  [600000, 'rgba(170, 45, 23, 0.7)'],
                ]
            }
          }}
          layout={{visibility: this.props.parcelVis}}
        />
        {/* footprintLayer */}
        <Layer
          sourceId='composite'
          layerOptions={{
              'source-layer': 'footprint-64awx0',
              'type': 'fill-extrusion',
              'minzoom': 12,
          }}
          paint={{
            'fill-extrusion-color': {
                'property': 'MAX_HGT',
                "type": "exponential",
                "stops": [
                  //convert unit: feet to meters
                  //the maximum height is 1159 feet
                  [0,'#fff'],
                  [1159, '#fbb217']
                ]
            },
            'fill-extrusion-height': {
                'property': 'MAX_HGT',
                "type": "exponential",
                "stops": [
                  //convert unit: feet to meters
                  [0,0],
                  [1159, 353.2632]
                ]
            },
              'fill-extrusion-opacity': 0.85
          }}
          layout={{'visibility': this.props.footVis}}
        />
        {/* blueprintLayer */}
        <GeoJSONLayer
          data={this.props.blueprint}
          layerOptions={{
              'minzoom': 12
          }}
          fillExtrusionPaint={{
              'fill-extrusion-color': '#fbb217',
              'fill-extrusion-height': this.props.height * 0.3048,
              'fill-extrusion-opacity': 0.8,
          }}
          fillExtrusionLayout={{'visibility': this.props.blueVis}}
        />
        {/* compsPts */}
        <GeoJSONLayer
          data={this.state.compsPts}
          layerOptions={{
              // 'minzoom': 12
          }}
          circlePaint={{
              'circle-color': '#ff9d00',

          }}
          circleLayout={{'visibility': 'visible'}}
        />
        {/* compsLines */}
        <GeoJSONLayer
          data={this.state.compsLines}
          layerOptions={{
              // 'minzoom': 12
          }}
          linePaint={{
              'line-color': '#ff9d00',
          }}
          lineLayout={{'visibility': 'visible'}}
        />
        <Popup
          coordinates={this.state.popupCoords}
          anchor='bottom'
          // onMouseLeave={(e)=>{e.preventDefault();this.setState({popupCoords: [0,0], popupMessage: ''})}}
          // onClick={(e)=>{console.log(e); this.setState({popupCoords: [0,0]})}}
        >
          <h5><strong>PARCEL INFO:</strong></h5>
          <Button onClick={(e)=>{e.preventDefault();this.setState({popupCoords: [0,0]})}}icon="close" size='small' style={{right: '0.5em',top:'0.5em',position: 'absolute',padding: 0,width: '1.4em',height: '1.4em'}}/>
          <ul>
            <li><strong>Address: </strong>{this.state.popupMessage.address}</li>
            <li><strong>Ref. Price: </strong>${this.state.popupMessage.refPrice}</li>
            <li style={{float: 'right', fontSize: '0.9em'}}><em><strong>Source: </strong>{this.state.popupMessage.source}</em></li>
            <li><Button icon='search' onClick={(e)=>{e.preventDefault();this.setState({showInfoCard: true});this.props.dispatch({type: 'smartselect/queryZillow', zpid: this.state.zpid})}}>
            Get Comps (Zillow)</Button></li>
          </ul>
        </Popup>
        {this.renderInfoCard()}
        {this.renderZillowMarker()}
        <Snackbar
          open={this.props.calData.point}
          message={'Sorry, we can not measure a point!'}
          autoHideDuration={2000}
        />
        <Snackbar
          open={_.isString(this.props.dataZillow) ? true : false}
          message={_.isString(this.props.dataZillow) ? this.props.dataZillow : ''}
          autoHideDuration={2000}
        />
      </ReactMapboxGl>);
        }
      };
