import React, { Component, PropTypes } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, ZoomControl, ScaleControl, Source, Popup, Marker} from "react-mapbox-gl";
import turf from 'turf';

// import MapboxDirections from '@mapbox/mapbox-gl-directions/src/directions';

import jquery from 'jquery';
import _ from 'lodash';
import Pubsub from 'pubsub-js';

import { Icon, Button, Slider } from 'antd';

import Paper from 'material-ui/Paper';

import InfoCard from './InfoCard';


// mapboxgl.accessToken = 'pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA';
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
    };
  }
  // <Feature
  //   coordinates={[-75.16356468200684,39.95251688800991]}
  //   properties={{
  //     i:
  //   }}
  //   onMouseEnter={()=>{console.log('see marker')}}
  // />

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
    const origin = this.props.popupCoords;
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
  //changing the cursor style to 'pointer'

  let parcel = map.queryRenderedFeatures(e.point, { layers: ['aptParcel'] });
  map.getCanvas().style.cursor = (parcel.length) ? 'pointer' : '';
  if (parcel.length) {
      this.props.dispatch({type: 'smartselect/showPopup', feature: parcel[0]})
  }
}

componentDidUpdate(){
  // console.log(this.props.compsPts)
const map =this.props.map;
const layer = map.getLayer('compsPoints');
// console.log('check layer', layer)

}
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
              maxBounds={this.props.maxBounds}
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

              {/* compsLines */}
              <Layer
                id='compsLines'
                type='line'
                paint={{
                  'line-color': '#ff9d00',
                }}
                layout={{
                  'visibility': 'visible'
                }}

              >
                {this.renderLines()}
              </Layer>

              {/* <GeoJSONLayer
                data={this.props.compsLines}
                layerOptions={{

                  // 'minzoom': 12
                }}
                linePaint={{
                        'line-color': '#ff9d00',
                }}
                lineLayout={{'visibility': 'visible'}}
              /> */}

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
                  'visibility': 'visible'
                }}

              >
                {this.renderMarker()}
              </Layer>


              <Popup
                coordinates={this.props.popupInfo.coords}
                anchor='bottom'
                // onMouseLeave={(e)=>{e.preventDefault();this.setState({popupCoords: [0,0], popupInfo.message: ''})}}
                // onClick={(e)=>{console.log(e); this.setState({popupCoords: [0,0]})}}
              >
                <h5><strong>PARCEL INFO</strong></h5>
                <Button onClick={(e)=>{e.preventDefault();this.props.dispatch({type:'smartselect/clearPopup'})}}icon="close" size='small' style={{right: '0.5em',top:'0.5em',position: 'absolute',padding: 0,width: '1.4em',height: '1.4em'}}/>
                <ul>
                  <li><strong>Address: </strong>{this.props.popupInfo.address}</li>
                  <li><strong>Ref. Price: </strong>${this.props.popupInfo.refPrice}</li>
                  <li style={{float: 'right', fontSize: '0.9em'}}><em><strong>Source: </strong>{this.props.popupInfo.source}</em></li>
                  <li><Button icon='search' onClick={(e)=>{e.preventDefault();this.props.dispatch({type: 'smartselect/queryZillow', zpid: this.props.popupInfo.zpid})}}>
                  Get Comps (Zillow)</Button></li>
                </ul>
              </Popup>
              {/* {this.renderInfoCard()} */}
              {/* {this.renderZillowMarker()} */}

      </ReactMapboxGl>);
        }
      };
