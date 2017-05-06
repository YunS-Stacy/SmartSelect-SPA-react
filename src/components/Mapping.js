import React, { Component, PropTypes } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, ZoomControl, ScaleControl, Source, Popup, Marker} from "react-mapbox-gl";
import turf from 'turf';

import { mapbox } from '../services/config.json';

import Search from 'material-ui/svg-icons/action/search';
import LocalOffer from 'material-ui/svg-icons/maps/local-offer';
import DirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import DirectionsBus from 'material-ui/svg-icons/maps/directions-bus';
import DirectionsBike from 'material-ui/svg-icons/maps/directions-bike';
import DirectionsWalk from 'material-ui/svg-icons/maps/directions-walk';



import Business from 'material-ui/svg-icons/communication/business';


import IconButton from 'material-ui/IconButton';

import _ from 'lodash';
import { Icon, Button } from 'antd';

export default class Mapping extends Component {
  constructor(props) {
    super(props);
    this.state={
      showInfoCard: false,
      draw: new MapboxDraw({
        displayControlsDefault: true,
        controls: {
          polygon: true,
          trash: true
        },
      }),
      map: {}
    };
  }

  renderMarker(){
    return this.props.compsPts.map((item, i)=>{
      return (
        <Feature
          coordinates={item.geometry.coordinates}
          key={i}
          properties = {item.properties}
          onMouseEnter={(e)=>{
            this.props.map.getCanvas().style.cursor = 'pointer';
            this.props.dispatch({type: 'smartselect/showTable', feature: e.feature.properties, tableStatus: 'visible'});
          }}
          onMouseLeave={(e)=>{
            this.props.dispatch({type: 'smartselect/showTable', feature: '', tableStatus: 'hidden'});
          }}
        />
      )
    })
  }

  renderLines(){
    return this.props.compsLines.map((item, i)=>{
      return (
        <Feature
          coordinates={item}
          key={i}
        />
      )
    })
  }
  handleMouseMove(map, e){
    //only when the mode is mode-query
    if(this.props.mode === 'mode-query'){
      let parcel = map.queryRenderedFeatures(e.point, { layers: ['aptParcel'] });
      //changing the cursor style to 'pointer'
      map.getCanvas().style.cursor = (parcel.length) ? 'pointer' : '';
      if (parcel.length) {
        this.props.dispatch({type: 'smartselect/showPopup', feature: parcel[0]})
      }
    }

  }
  shouldComponentUpdate(nextProps){
    return nextProps.map === this.props.map;
  }
  componentDidUpdate(prevProps){
    const map = this.state.map;
    if(!map.loaded()){
      this.props.dispatch({
        type: "smartselect/asyncLoaded",
        mapLoaded: map.loaded(),
      });
      let timer;
      const checker = ()=> {
        if(map.loaded()) {
          clearInterval(timer);
          this.props.dispatch({
            type: "smartselect/asyncLoaded",
            mapLoaded: map.loaded(),
          });
        }
      };
      timer = setInterval(checker, 500);
    };
  }
  handleLoaded(map){
    this.setState({
      map: map
    });
    this.props.dispatch({
      type: "smartselect/mapLoad",
      map: map,
      draw: this.state.draw,
    });
  }

  render(){
    const {props} = this;
    const mapPosition= this.props.mode === 'mode-welcome' ? 'fixed' : 'absolute';
    const mapWidth = this.props.mode === 'mode-welcome' ? '100vw' : '100%';
    return (
      <ReactMapboxGl
        style={this.props.mapStyle}
        accessToken={mapbox}
        zoom = {this.props.mapZoom}
        center={this.props.mapCenter}
        bearing={this,props.mapBearing}
        pitch={this.props.mapPitch}
        containerStyle={{
          height: "100vh",
          width: mapWidth,
          position: mapPosition,
        }}
        movingMethod='easeTo'
        maxBounds={this.props.maxBounds}
        onStyleLoad={(map)=>{this.handleLoaded(map)}}
        onMouseMove={(map, e)=>{this.handleMouseMove(map, e)}}
        onMouseUp={(map, e)=> {this.props.dispatch({type: 'smartselect/changeCenter', mapCenter: map.getCenter()})}}
      >
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
        {/* vacantLayer */}

        <Layer
          id="vacantParcel"
          type= "fill"
          sourceId='composite'
          layerOptions={{
              'minzoom': 10,
              'source-layer': 'vacantParcel',
              'filter': ["<", 'Shape_Area', 10000],
          }}
          paint={{
              "fill-color": '#aaa',
              'fill-opacity': 0.8
          }}
          layout={{visibility: this.props.vacantVis}}
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
        {/* blueprint */}
        {(this.props.mode === 'mode-build') && (this.props.styleName === 'customized') && (
          <GeoJSONLayer
            data={this.props.blueprint}
            fillExtrusionPaint={{
                'fill-extrusion-color': '#fbb217',
                'fill-extrusion-height': this.props.height * 0.3048,
                'fill-extrusion-opacity': 0.8,
            }}
            fillExtrusionLayout={{'visibility': this.props.blueVis}}
          />
        )}

        {/* routePts */}
        <Layer
          id='routePoints'
          type='circle'
          paint={{
              'circle-color': '#d93a1b',
          }}
          layout={{
              'visibility': this.props.mode === 'mode-query' ? 'visible' : 'none'
          }}
        >
          <Feature
            coordinates={this.props.routePts}
          />
        </Layer>
        {/* routeLines */}
        <Layer
          id='routeLines'
          type='line'
          paint={{
                'line-color': '#d93a1b',
                'line-opacity': 0.5,
                'line-width': 2,
          }}
          layout={{
                'visibility': this.props.mode === 'mode-query' ? 'visible' : 'none'
          }}
        >
          <Feature
            coordinates={this.props.routeLines}
          />
        </Layer>
        {/* compsLines */}
        <Layer
          id='compsLines'
          type='line'
          paint={{
                  'line-color': '#ff9d00',
          }}
          layout={{
                  'visibility': this.props.mode === 'mode-query' ? 'visible' : 'none'
          }}
        >
          {this.renderLines()}
        </Layer>
        {/* compsPts */}
        <Layer
          id='compsPoints'
          type='symbol'
          paint={{
                    'icon-opacity': 0.8,
          }}
          layout={{
                    'icon-image': 'city-15',
                    'icon-allow-overlap': true,
                    'visibility': this.props.mode === 'mode-query' ? 'visible' : 'none'
          }}
        >
          {this.renderMarker()}
        </Layer>
        <Popup
          coordinates={this.props.popupInfo.coords}
          anchor='bottom'
          style={{visibility: this.props.mode === 'mode-query' ? 'visible' : 'hidden', minWidth:'18em'}}
        >
          <h5><strong>PARCEL INFO</strong></h5>
          <Button onClick={(e)=>{e.preventDefault();this.props.dispatch({type:'smartselect/clearPopup'})}}icon="close" size='small' style={{right: '0.5em',top:'0.5em',position: 'absolute',padding: 0,width: '1.4em',height: '1.4em'}}/>
          <ul>
            <li><strong>Address: </strong>{this.props.popupInfo.address}</li>
            <li><strong>Ref. Price: </strong>${this.props.popupInfo.refPrice}</li>
            <li style={{float: 'right', fontSize: '0.9em'}}><em><strong>Source: </strong>{this.props.popupInfo.source}</em></li>
            <br />
            <li style={{display:'flex', justifyContent:'space-around'}}>
              <div>
                <IconButton tooltip="Get Comps (Zillow)" tooltipPosition="bottom-center"
                  onTouchTap={()=>{this.props.dispatch({type: 'smartselect/queryZillow', zpid: this.props.popupInfo.zpid})}}
                >
                  <Business />
                </IconButton>
              </div>

              <div style={{marginLeft: '1em'}}>
                <IconButton tooltip="Driving Directions" tooltipPosition="bottom-center"
                  onTouchTap={()=>{this.props.dispatch({type: 'smartselect/geocodeRoute', dest: this.props.popupInfo.coords, methods: 'driving-traffic'})}}>
                  <DirectionsCar />
                </IconButton>
                <IconButton tooltip="Public Transit Directions" tooltipPosition="bottom-center"
                  onTouchTap={()=>{this.props.dispatch({type: 'smartselect/geocodeRoute', dest: this.props.popupInfo.coords, methods: 'cycling'})}}>
                  <DirectionsBike />
                </IconButton>
                <IconButton tooltip="Cycling Directions" tooltipPosition="bottom-center"
                  onTouchTap={()=>{this.props.dispatch({type: 'smartselect/geocodeRoute', dest: this.props.popupInfo.coords, methods: 'walking'})}}>
                  <DirectionsWalk />
                </IconButton>
              </div>
            </li>
          </ul>
        </Popup>

      </ReactMapboxGl>);
                  }
                };
