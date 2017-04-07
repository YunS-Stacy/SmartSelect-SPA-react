import React, { Component, PropTypes } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';
import ReactMapboxGl, { Layer, Feature, ZoomControl, ScaleControl, Source, Popup} from "react-mapbox-gl";
import turf from 'turf';
// import MapboxDirections from '@mapbox/mapbox-gl-directions/src/directions';

import jquery from 'jquery';
import _ from 'underscore';
import Pubsub from 'pubsub-js';

import Snackbar from 'material-ui/Snackbar';
import { Button } from 'antd';

// mapboxgl.accessToken = 'pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA';

export default class Mapping extends Component {
  constructor(props) {
    super(props);
    console.log('mapping', this.props);
    this.state={
      popupCoords: [0,0],
      popupMessage: '',
      map: {},
      scaleControl: new mapboxgl.ScaleControl({unit: 'imperial'}),
      geolocateControl: new mapboxgl.GeolocateControl(),
      naviControl: new mapboxgl.NavigationControl(),
      draw: new MapboxDraw({
        displayControlsDefault: true,
        controls: {
          polygon: true,
          trash: true
        },
      }),
      // for Snackbar
      // open: false,
    };

  }
  //
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
    if (!features.length) {
      this.setState({
        popupCoords: [0,0],
        popupMessage: ''
      })
      return;
    }
    let feature = features[0];
    this.setState({
      popupCoords: {lng: feature.properties['lon'],lat: feature.properties['lat']},
      popupMessage: {
        address: feature.properties['location'],
        refPrice: feature.properties['sold_witho'],
        source: feature.properties['predicted'] === 1 ? 'Predicted Value' : 'Record from Latest Transaction',
        zoning: feature.properties['zoning'],
        zpid: feature.properties['zpid'],
        opa: feature.properties['opa_accoun'],
      },
    });
  }



  handleMouseUp(map){
    this.props.dispatch({
      type: "smartselect/changeCenter",
      mapCenter: map.getCenter()
    })
  }

  handleLoaded(map){

    map.addLayer({
      'id': '3d-buildings',
      "source": 'composite',
      'source-layer': 'footprint-64awx0',
      'type': 'fill-extrusion',
      'minzoom': 12,
      'paint': {
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
      },
      'layout': {
        'visibility': 'visible'
      }
    });

    this.handleHeight = PubSub.subscribe('askforExtrude', function(){
      let data = this.state.draw.getAll();
      let height = this.props.height;
      // only draw the polygon
      data.features = _.filter(data.features, function(datum){
        return datum.geometry.type === 'Polygon' || datum.geometry.type === 'MultiPolygon';
      });

      if (data.features.length > 0){
        map.getSource('poly').setData(data);
        map.setPaintProperty('3d-blueprint', 'fill-extrusion-height', height*0.3048); // convert foot to meter
        map.setLayoutProperty('3d-blueprint', 'visibility', 'visible');
      }
    }.bind(this));

    this.handleCalculate = PubSub.subscribe('askforCalculate', function(){
      // console.log('button know map is loaded');

      // console.log('someone asked for a count');
      let data = this.state.draw.getAll();
      let calculatedValue = {
        polygon: {
          area: 0,
          length: 0
        },
        line: {
          length: 0
        },
        point: false,
        num: 0
      };

      _.each(data.features,function(datum){
        let type = datum.geometry.type;
        // console.log(type);
        switch (type) {
          case 'Polygon':
          // console.log(n);
          // convert square meters to square foot
          let poly_area = turf.area(datum) * 10.7639;
          let poly_length = turf.lineDistance(datum, 'miles');
          // restrict to 2 decimal points
          let rounded_poly_area = Math.round(poly_area*100)/100;
          let rounded_poly_length = Math.round(poly_length*5280*100)/100;
          calculatedValue.polygon.area = rounded_poly_area;
          calculatedValue.polygon.length = rounded_poly_length;
          break;

          case 'LineString':
          // convert square meters to square foot
          let line_length = turf.lineDistance(datum, 'miles');
          // restrict to 2 decimal points
          let rounded_line_length = Math.round(line_length*5280*100)/100;
          calculatedValue.line.length = rounded_line_length;
          break;
          case 'Point':
          calculatedValue.point = true;
          default:
        }
      });
      calculatedValue.num = data.features.length;

      this.props.dispatch({
        type: "smartselect/calculate",
        calData: calculatedValue
      });
    }.bind(this));

    //predefine a polygon source to add input polygon
    map.addSource('poly',{
      "type": "geojson",
      "data": {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[0,0],[0,0],[0,0]]]
        }
      }
    });
    map.addLayer({
      'id': '3d-blueprint',
      'source': 'poly',
      'type': 'fill-extrusion',
      'minzoom': 12,
      'paint': {
        'fill-extrusion-color': '#fbb217',
        'fill-extrusion-height': 0,
        'fill-extrusion-opacity': 0.8
      },
      'layout': {
        'visibility': 'none'
      }
    });


    // Use the earthquakes source to create five layers:
    // One for unclustered points, three for each cluster category,
    // and one for cluster labels.
    map.addLayer({
      "id": "aptParcel",
      "type": "fill",
      "source": 'composite',
      'source-layer': 'unionParcel',
      'paint': {
        // make circles larger as the user zooms from z12 to z22

        'fill-color': {
          property: 'unit_price',
          type: 'exponential',
          stops:
          [
            [0, '#1d91c0'],
            [2500000, '#7fcdbb'],
            [5000000, '#febe12'],
          ]
        }
      },
      'layout': {
        visibility: 'none'
      }
    });


    // map.setLayoutProperty('3d-buildings', 'visibility', 'visible');
    setTimeout(()=>{
      this.props.dispatch({
        type: "smartselect/mapLoaded",
        initialMap: map,
        // initialDraw: draw
      });
    }, 5000);
    map.addControl(this.state.scaleControl,'bottom-right');
    map.addControl(this.state.geolocateControl,'bottom-right');
    map.addControl(this.state.naviControl,'bottom-right');
    map.addControl(this.state.draw,'bottom-right');

    jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'hidden');
  }

  componentWillReceiveProps(nextProps){
    const map = this.props.initialMap;
    if(nextProps.mapStyle !== this.props.mapStyle){
      map.removeControl(this.state.scaleControl);
      map.removeControl(this.state.geolocateControl);
      map.removeControl(this.state.naviControl);
      map.removeControl(this.state.draw);
    }
    // this.props.initialMap.addControl(new mapboxgl.ScaleControl({unit: 'imperial'}),'bottom-right');
    // this.props.initialMap.addControl(new mapboxgl.GeolocateControl(),'bottom-right');
    // this.props.initialMap.addControl(new mapboxgl.NavigationControl(),'bottom-right');
    // this.props.initialMap.addControl(this.state.draw,'bottom-right');
    //
    // jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'hidden');
  }
  render(){

    const {draw} = this.state;
    // const {center} = this.state;
    const {props} = this;
    const mapPosition= this.props.mode === 'mode-welcome' ? 'fixed' : 'absolute';
    const mapInteractive = this.props.mode === 'mode-welcome' ? false : true;
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
          position: mapPosition
        }}
        interactive={mapInteractive}
        onStyleLoad={(map)=>{this.handleLoaded(map)}}
        onMouseUp={(map)=>{this.handleMouseUp(map)}}
        // onClick={(map, e)=>{this.handleClick(map, e)}}
        onMouseMove={(map, e)=>{this.handleMouseMove(map, e)}}
        // onMouseOut={(map, e)=>{this.handleMouseOut(map, e)}}
      >

        <Popup
          coordinates={this.state.popupCoords}
          anchor='bottom'
          // onMouseLeave={(e)=>{e.preventDefault();this.setState({popupCoords: [0,0], popupMessage: ''})}}
          // onClick={(e)=>{console.log(e); this.setState({popupCoords: [0,0]})}}
        >
          <h5><strong>Parcel Information:</strong></h5>
          <ul>
            <li><strong>Address: </strong>{this.state.popupMessage.address}</li>
            <li><strong>Ref. Price: </strong>{this.state.popupMessage.refPrice}</li>
            <li style={{float: 'right'}}><em><strong>Source: </strong>{this.state.popupMessage.source}</em></li>

            <li><Button>Zillow</Button></li>

          </ul>

        </Popup>
        <Snackbar
          open={this.props.calData.point}
          message={'Sorry, we can not measure a point!'}
          autoHideDuration={2000}
        />
      </ReactMapboxGl>);
        }
      };
