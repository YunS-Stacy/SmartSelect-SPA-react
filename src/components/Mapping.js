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
import { Icon, Button } from 'antd';

import InfoCard from './InfoCard';


// mapboxgl.accessToken = 'pk.eyJ1IjoieXVuc2hpIiwiYSI6ImNpeHczcjA3ZDAwMTMyd3Btb3Fzd3hpODIifQ.SWiqUD9o_DkHZuJBPIEHPA';
export default class Mapping extends Component {
  constructor(props) {
    super(props);
    this.state={
      ptsPairs: '',
      comps: {
        pts:{
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPoint',
            'coordinates': [[0,0],[0,0]]
          }
        },
        lines:{
          'type': 'Feature',
          'geometry': {
            'type': 'MultiLineString',
            'coordinates': [[[0,0],[0,0]]]
          }
        },
      },
      showInfoCard: false,
      zillowMessage: '',
      popupCoords: [0,0],
      popupMessage: '',
      zpid: '',
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
            // this.props.initialMap.querySourceFeatures  ('compsPts', [parameters])}}
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

  renderZillowPopup(){
    if(this.state.showInfoCard === true){
      return <InfoCard/>
    }
  };
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
          refPrice: feature.properties['sold_witho'].toFixed(2),
          source: feature.properties['predicted'] === 1 ? 'Predicted Value' : 'Record from Latest Transaction',
          zoning: feature.properties['zoning'],
          opa: feature.properties['opa_accoun'],
        },
        zpid: feature.properties['zpid'],
      });
    }

  }



  handleMouseUp(map){
    this.props.dispatch({
      type: "smartselect/changeCenter",
      mapCenter: map.getCenter()
    })
  }
  componentDidMount(){
    console.log('check load time')

  }
  handleLoaded(map){
    console.log('check change style ')
    var source = map.getSource('aptParcel');
    console.log(source === undefined)
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
    map.addLayer({
      "id": "aptParcel",
      "type": "fill",
      "source": 'composite',
      'source-layer': 'unionParcel',
      'minzoom': 15,
      'paint': {
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

      _.each(data.features,(datum)=>{
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
    //predifine a multipoint source to add input compspoint
    map.addSource('compsPts',{
      "type": "geojson",
      "data": {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiPoint',
          'coordinates': [[0,0],[0,0]]
        }
      }
    });
    map.addLayer({
      'id': 'compsPts',
      'source': 'compsPts',
      'type': 'circle',
      'paint': {
        'circle-color': '#ff9d00',
      },
      'layout': {
        'visibility': 'visible'
      }
    });
    //predifine a multiLine source to add input compsline
    map.addSource('compsLines',{
      "type": "geojson",
      "data": {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [[[0,0],[0,0]]]
        }
      }
    });

    map.addLayer({
      'id': 'compsLines',
      'source': 'compsLines',
      'type': 'line',
      'paint': {
        'line-color': '#ff9d00',
      },
      'layout': {
        'visibility': 'visible'
      }
    });

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

    map.addControl(this.state.scaleControl,'bottom-right');
    map.addControl(this.state.geolocateControl,'bottom-right');
    map.addControl(this.state.naviControl,'bottom-right');
    map.addControl(this.state.draw,'bottom-right');

    jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'hidden');

    setTimeout(()=>{
      this.props.dispatch({
        type: "smartselect/mapLoaded",
        initialMap: map,
      });
    }, 1000);
  }

  componentWillReceiveProps(nextProps){
    const map = this.props.initialMap;
    if(nextProps.mode !== this.props.mode){
      console.log('reset the map')
      this.setState({
        popupCoords: [0,0],
        popupMessage: '',
      });
      map.getSource('compsLines').setData(this.state.comps.lines);
      map.getSource('compsPts').setData(this.state.comps.pts);
    }

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

      if(nextProps.mapStyle !== this.props.mapStyle || nextProps.mode !== this.props.mode){
        map.removeControl(this.state.scaleControl);
        map.removeControl(this.state.geolocateControl);
        map.removeControl(this.state.naviControl);
        map.removeControl(this.state.draw);
      };

      this.props.mode === 'mode-welcome' ? 'fixed' : 'absolute';
      // this.props.initialMap.addControl(new mapboxgl.ScaleControl({unit: 'imperial'}),'bottom-right');
      // this.props.initialMap.addControl(new mapboxgl.GeolocateControl(),'bottom-right');
      // this.props.initialMap.addControl(new mapboxgl.NavigationControl(),'bottom-right');
      // this.props.initialMap.addControl(this.state.draw,'bottom-right');
      //
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
        onMouseUp={(map)=>{this.handleMouseUp(map)}}
        onMouseMove={(map, e)=>{this.handleMouseMove(map, e)}}
      >

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
