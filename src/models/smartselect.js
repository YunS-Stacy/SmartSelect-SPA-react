
import request from '../utils/request';
import fetch from 'dva/fetch';

import Zillow from '../services/fetchZillow';
import * as fetchData from '../services/fetchData';

import _ from 'lodash';
import turf from 'turf';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from 'mapbox-gl-draw';
import MapboxGeocoder from 'mapbox-gl-geocoder';


import g2, {Stat, Frame} from 'g2';

import { mapbox } from '../services/config';

export default {
  namespace: 'smartselect',
  state: {
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
    geocoderControl: new MapboxGeocoder({
      accessToken: mapbox
    }),
    // draw:{},
    blueprint: {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[0,0],[0,0],[0,0],[0,0]]]
          }
        }
      ]
    },
    // Three mode: 'mode-welcome', 'mode-query', 'mode-build'
    mode: 'mode-welcome',
    map: {},
    // maxBounds: mapboxgl.LngLatBounds.convert(arr);SW39.824024,-75.3324037,40.1551322,-74.9240231
    maxBounds: [[-75.3324037,39.824024],[-74.9240231,40.1551322]],
    mapLoaded: false,
    mapCenter: [-75.1639, 39.9522],
    mapPitch: [65],
    mapZoom: [14],
    mapBearing: 9.2,
    mapStyle:'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy',
    styleName: 'customized',
    footVis: 'visible',
    blueVis: 'none',
    parcelVis: 'none',
    vacantVis: 'none',
    calData: {
      polygon: {
        area: 0,
        length: 0
      },
      line: {
        length: 0
      },
      num: 0,
      point: false,
    },
    height: 0,
    compsLines:[],
    compsPts:[],
    routeLines:[[],[]],
    routePts:[],
    dataSlider: [],
    dataMarket: {
      marketPhilly:[],
      marketNeigh:[]
    },
    dataCorrplot: [],
    dataInitialized: false,
    parcelRange: [0,600000],
    snackMessage: '',
    compsInfo: false,
    popupInfo: {
      coords:[0,0],
      address: '',
      refPrice: 0,
      source: '',
      zoning: '',
      opa: '',
      zpid: '',
    },
    tableStatus: 'hidden',
    tableMessage: {
      address: '',
      lastSoldDate: '',
      lastSoldPrice: '',
      zestimate: '',
      monthChange: '',
      valueHigh: '',
      valueLow: '',
    },
    portName: 'design',
    listing: [],
    imgsrc: '',
  },
  reducers: {
    changePortfolio(state, {portName}){
      return {...state, portName}
    },
    showSnack(state, {snackMessage}){
      return {...state, snackMessage}
    },
    clearPopup(state){
      return { ...state, popupInfo:
        {
          coords:[0,0],
          address: '',
          refPrice: 0,
          source: '',
          zoning: '',
          opa: '',
          zpid: '',
        },
      }
    },
    showPopup(state, datum){
      let {popupInfo} = state;
      const feature = datum.feature;
      let address = feature.properties['location'];
      address = _.toLower(feature.properties['location']);
      address = _.startCase(address); // handle the upper and lowercase
      popupInfo = {
        coords: [feature.properties['lon'],feature.properties['lat']],
        address: address,
        refPrice: feature.properties['refprice'].toFixed(2),
        source: feature.properties['predicted'] === 1 ? 'Predicted Value' : 'Record from Latest Transaction',
        zoning: feature.properties['zoning'],
        opa: feature.properties['opa_accoun'],
        zpid: feature.properties['zpid'],
      }
      return { ...state, popupInfo }
    },
    showTable(state, datum){
      let {tableStatus, tableMessage} = state;
      tableMessage = datum.feature;
      tableStatus = datum.tableStatus;
      return { ...state, tableStatus, tableMessage }
    },
    changeStyle(state, datum){
      let {mapStyle, styleName} = state;
      styleName = datum.styleName;
      switch (styleName) {
        case 'customized':
        mapStyle = 'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy';
        break;
        case 'satellite':
        mapStyle = 'mapbox://styles/yunshi/cj0u96uwe009w2rqryu8r7bg8';
        break;
        case 'light':
        mapStyle = 'mapbox://styles/yunshi/cj0u990c700fm2smr7yvnv1c5';
        break;
        default:
        break;
      };
      return { ...state, mapStyle, styleName};
    },
    askCalculate(state){
      const data = state.draw.getAll();
      const num = data.features.length;
      let {calData, snackMessage} = state;
      calData.num = num;
      snackMessage = `You have drawn ${num} things. We will calculate only the last of each type of shapes.`;
      _.each(data.features,(datum)=>{
        let type = datum.geometry.type;
        switch (type) {
          case 'Polygon':
          // convert square meters to square foot
          let poly_area = turf.area(datum) * 10.7639;
          let poly_length = turf.lineDistance(datum, 'miles');
          // restrict to 2 decimal points
          let rounded_poly_area = Math.round(poly_area*100)/100;
          let rounded_poly_length = Math.round(poly_length*5280*100)/100;
          calData.polygon.area = rounded_poly_area;
          calData.polygon.length = rounded_poly_length;
          break;
          case 'LineString':
          // convert square meters to square foot
          let line_length = turf.lineDistance(datum, 'miles');
          // restrict to 2 decimal points
          let rounded_line_length = Math.round(line_length*5280*100)/100;
          calData.line.length = rounded_line_length;
          break;
          case 'Point':
          calData.point = true;
          snackMessage = 'Sorry, we can not measure a point!';
          break;
          default:
          break;
        }
      });
      return { ...state, calData, snackMessage};
    },

    buildingHeight(state, {heihgt}){
      return { ...state, height};
    },
    askExtrude(state, datum){
      const height = datum.height;
      let data = state.draw.getAll();
      // only draw the polygon
      data.features = _.filter(data.features, function(datum){
        return datum.geometry.type === 'Polygon' || datum.geometry.type === 'MultiPolygon';
      });
      if (data.features.length > 0){
        return { ...state, blueprint: data, height}
      } else {
        return { ...state, height}
      }
    },
    asyncLoaded(state, {mapLoaded}){
      return { ...state, mapLoaded };
    },
    mapSetup(state, {map,draw}){
      return { ...state, map, draw};
    },

    changeVis(state, {layerName, layerVis}){
      switch (layerName) {
        case 'parcel':
        return { ...state, parcelVis: layerVis};
        case 'footprint':
        return { ...state, footVis: layerVis};
        case 'blueprint':
        return { ...state, blueVis: layerVis};
        case 'vacant':
        return { ...state, vacantVis: layerVis};
        default:
        break;
      };
    },

    changePitch(state, {mapPitch}){
      return { ...state, mapPitch}
    },

    changeCenter(state, {mapCenter}){
      return { ...state, mapCenter}
    },

    changeMode(state, {mode}){
      const map = state.map;
      let {
        //set map
        mapPitch, mapZoom, mapCenter, mapBearing,
        //set data (cleaned if not mode-query)
        compsLines, compsPts, routePts,routeLines, parcelRange, popupCoords,tableStatus, tableMessage,
        //set data (cleaned after the full step)
        calData, height, snackMessage,
        //set layer
        footVis, parcelVis, vacantVis, blueVis,
      } = state
      switch (mode) {
        case 'mode-welcome':
        if(state.mode !== 'mode-welcome'){
          //set map
          mapPitch = [65];
          mapZoom =[14];
          mapCenter = [-75.1639, 39.9522];
          mapBearing = 9.2;
          //set data
          calData = {
            polygon: {
              area: 0,
              length: 0
            },
            line: {
              length: 0
            },
            num: 0,
            point: false,
          };
          height = 0;
          snackMessage='';
          //set layer
          footVis = 'visible';
          parcelVis = 'none';
          blueVis = 'none';
          //remove control
          map.removeControl(state.scaleControl);
          map.removeControl(state.geolocateControl);
          map.removeControl(state.naviControl);
          map.removeControl(state.draw);
        }
        break;

        case 'mode-intro':
        if(state.mode !== 'mode-intro'){
          footVis = 'none';
          parcelVis = 'none';
          mapPitch = [0];
          mapZoom =[15];
          mapBearing = 0;
          if(state.mode === 'mode-welcome'){
            map.addControl(state.scaleControl,'bottom-right');
            map.addControl(state.naviControl,'bottom-right');
            map.addControl(state.draw,'bottom-right');
            map.addControl(state.geolocateControl,'bottom-right');
          }
        }
        break;
        case 'mode-query':
        //make sure comes from the previous step
        if (state.mode !== 'mode-query'){
          //set map
          mapPitch = [0];
          mapBearing = 0;
          //set data
          compsLines=[];
          compsPts=[];
          routeLines=[[],[]];
          routePts=[];
          parcelRange=[0,600000];
          popupCoords=[0,0];
          tableStatus='hidden';
          //set layer
          footVis = 'none';
          parcelVis = 'visible';
          blueVis = 'none';
          vacantVis = 'visible';
        };
        break;
        case 'mode-measure':
        if(state.mode !== 'mode-measure'){
          popupCoords = [0,0];
          tableStatus = 'hidden';
          compsLines=[];
          compsPts=[];
          parcelRange=[0,600000];
          blueVis = 'none';
          footVis = 'none';
          parcelVis = 'visible';
          mapPitch = [0];
          mapBearing = 0;
          height = 0;
        }
        break;
        case 'mode-build':
        if (state.mode !== 'mode-build'){
          mapPitch = [65];
          mapBearing = 9.2;
          parcelVis = 'none';
          blueVis = 'visible';
          vacantVis = 'none';
        };
        break;
        default:
        break;
      }
      // zoom number must extract the number first, cannot tell [14] === [14] is true
      return { ...state, mode,
        //set map
        mapPitch, mapZoom, mapCenter, mapBearing,
        //set data (cleaned if not mode-query)
        compsLines, compsPts, routePts,routeLines, parcelRange, popupCoords, tableStatus, tableMessage,
        //set data (cleaned after the full step)
        calData, height, snackMessage,
        //set layer
        footVis, parcelVis, vacantVis, blueVis};
      },

      getZillow(state, datum){
        let {compsLines, compsPts, snackMessage, popupInfo, map} = state;
        // {dataZillow} = datum.dataZillow;
        const dataType = typeof datum.dataZillow;
        switch (dataType) {
          case 'object':
          // set the line data
          const linePairs = _.map(datum.dataZillow, (item)=>{
            let pairs = [ _.values(item.coord), _.values(popupInfo.coords)];
            return pairs;
          });
          compsLines = linePairs;

          const tempPts = datum.dataZillow.map((item, i)=>{
            return turf.point(_.values(item.coord),{...item, i});
          });
          // set the point data
          compsPts = tempPts;
          // add the origin to create bbox contains all features
          const origin = turf.point(popupInfo.coords); //convert to array
          const tempBbox = turf.featureCollection(_.concat(tempPts, [origin]))
          const bounds = turf.bbox(tempBbox);
          map.fitBounds(bounds, {padding: 100});
          break;
          case 'string':
          snackMessage = datum.dataZillow;
          break;
          default:
          break;
        }
        return { ...state, compsLines, compsPts, snackMessage}
      },
      getRoute(state, datum){
        let {routeLines, snackMessage, routePts, popupInfo, map} = state;
        if(datum.res.code === 'Ok'){
          routeLines = datum.res.routes[0].geometry.coordinates;
          routeLines = [routePts, ...routeLines, popupInfo.coords];
          const tempBbox = turf.lineString(routeLines);
          const bounds = turf.bbox(tempBbox);
          map.fitBounds(bounds, {padding: 100});
        } else{
          snackMessage = `Sorry, we don't find any route!`
        }
        return { ...state, routeLines, snackMessage}
      },

      getSlider(state, datum){
        const response = datum.res.data.rows
        const frame = new Frame(response);
        const filterData = Frame.filter(frame, function(obj, index) {
          return obj.refprice < 600000;
        });
        const tempData = Frame.sort(filterData, 'refprice');
        const data = tempData.toJSON();
        return { ...state, dataSlider: data, dataInitialized: true }
      },

      getAddress(state, datum){
        let {mapCenter, snackMessage,routePts} = state;
        if(datum.res.status === 'OK'){
          const coords = datum.res.results[0].geometry.location;
          mapCenter = coords;
          routePts = [coords['lng'], coords['lat']];
        } else {
          snackMessage = `Sorry, we can't find the place!`
        }
        return { ...state, mapCenter,snackMessage, routePts}
      },


      filterParcel(state, {parcelRange}){
        return {...state, parcelRange}
      },

      getTable(state, {resListing}){
        let {imgsrc, listing} = state;
        listing = _.toArray(resListing.data);
        let pts = listing.map((item)=>{
          return `pin-s+52bad5(${item.lon},${item.lat})`
        });
        imgsrc = `https://api.mapbox.com/styles/v1/mapbox/light-v9/static/${_.join(pts, ',')}/-75.145507,39.982574,10/600x600@2x?logo=false&access_token=${mapbox}`;
        return {...state, listing, imgsrc}
      },

      getChartData(state, {resSlider,resMarket,resCorrplot}){
        // slider
        const tempSlider = resSlider.data;
        const frameSlider = new Frame(tempSlider);
        const filterSlider = Frame.filter(frameSlider, function(obj, index) {
          return obj.refprice < 600000;
        });
        const sortSlider = Frame.sort(filterSlider, 'refprice');
        const dataSlider = sortSlider.toJSON();
        // localmarket
        const tempMarket = resMarket.data;
        const frameMarket = new Frame(tempMarket);
        // philly
        const dataPhilly = Frame.filter(frameMarket, function(obj){
          return obj['Region Type'] == 'city'
        });
        const tempPhillyMonth = Frame.combineColumns(dataPhilly,
          ['Jan_2010', 'Feb_2010', 'Mar_2010', 'Apr_2010', 'May_2010', 'Jun_2010', 'Jul_2010', 'Aug_2010', 'Sep_2010', 'Oct_2010', 'Nov_2010', 'Dec_2010',
          'Jan_2011', 'Feb_2011', 'Mar_2011', 'Apr_2011', 'May_2011', 'Jun_2011', 'Jul_2011', 'Aug_2011', 'Sep_2011', 'Oct_2011', 'Nov_2011', 'Dec_2011',
          'Jan_2012', 'Feb_2012', 'Mar_2012', 'Apr_2012', 'May_2012', 'Jun_2012', 'Jul_2012', 'Aug_2012', 'Sep_2012', 'Oct_2012', 'Nov_2012', 'Dec_2012',
          'Jan_2013', 'Feb_2013', 'Mar_2013', 'Apr_2013', 'May_2013', 'Jun_2013', 'Jul_2013', 'Aug_2013', 'Sep_2013', 'Oct_2013', 'Nov_2013', 'Dec_2013',
          'Jan_2014', 'Feb_2014', 'Mar_2014', 'Apr_2014', 'May_2014', 'Jun_2014', 'Jul_2014', 'Aug_2014', 'Sep_2014', 'Oct_2014', 'Nov_2014', 'Dec_2014',
          'Jan_2015', 'Feb_2015', 'Mar_2015', 'Apr_2015', 'May_2015', 'Jun_2015', 'Jul_2015', 'Aug_2015', 'Sep_2015', 'Oct_2015', 'Nov_2015', 'Dec_2015',
          'Jan_2016', 'Feb_2016', 'Mar_2016', 'Apr_2016', 'May_2016', 'Jun_2016', 'Jul_2016', 'Aug_2016', 'Sep_2016', 'Oct_2016', 'Nov_2016', 'Dec_2016',
          'Jan_2017', 'Feb_2017'], 'valueChange', 'monthYear', ['Region_Name']);
          const marketPhilly = tempPhillyMonth.toJSON();
          // neighborhood
          const dataNeigh = Frame.sort(frameMarket,'Feb_2017');
          const filterNeigh = Frame.filter(dataNeigh, function(obj){
            return obj['Region Type'] == 'neighborhood'
          });
          const tempNeigh = Frame.combineColumns(filterNeigh, ['Feb_2017', 'Jan_2017', 'Dec_2016', 'Nov_2016','Oct_2016', 'Sep_2016', 'Aug_2016', 'Jul_2016', 'Jun_2016', 'May_2016', 'Apr_2016', 'Mar_2016', 'Feb_2016', 'Jan_2016', 'Dec_2015', 'Nov_2015', 'Oct_2015', 'Sep_2015', 'Aug_2015', 'Jul_2015', 'Jun_2015', 'May_2015', 'Apr_2015', 'Mar_2015', 'Feb_2015', 'Jan_2015'], 'valueChange', 'monthYear', ['Region_Name']);
          const marketNeigh = tempNeigh.toJSON();
          // corrplot
          const dataCorrplot = resCorrplot.data;
          return { ...state, dataSlider, dataMarket: {marketPhilly, marketNeigh}, dataCorrplot }
        },


      },
      effects: {
        *mapLoad({map,draw}, {call,put}){
          yield put({ type: 'asyncLoaded', mapLoaded: false});
          yield put({ type: 'mapSetup', map, draw});
          const resSlider = yield call(fetchData.slider);
          const resMarket = yield call(fetchData.market);
          const resCorrplot = yield call(fetchData.corrplot);
          const resListing = yield call(fetchData.listing);
          yield put({ type: 'getChartData', resSlider, resMarket, resCorrplot});
          yield put({ type: 'getTable', resListing});
          yield put({ type: 'asyncLoaded', mapLoaded: true});
        },
        *queryZillow({zpid}, {call, put}){
          yield put({ type: 'asyncLoaded', mapLoaded: false});
          const dataZillow = yield call(Zillow.getComps, zpid);
          yield put({ type: 'getZillow', dataZillow});
          yield put({ type: 'asyncLoaded', mapLoaded: true});
        },

        *geocodeAddress(datum, {call, put}){
          const {address} = datum;
          yield put({ type: 'asyncLoaded', mapLoaded: false});
          const res = yield call(fetchData.geocode, address);
          yield put({ type: 'getAddress', res: res.data});
          yield put({ type: 'asyncLoaded', mapLoaded: true});
        },

        *geocodeRoute(datum, {call, put, select}){
          const {dest, methods} = datum;
          yield put({ type: 'asyncLoaded', mapLoaded: false});
          const origin = yield select(state => state.smartselect.routePts);
          if(origin.length > 0){
            const res = yield call(fetchData.direction, origin, dest, methods);
            yield put({ type: 'getRoute', res: res.data});
          } else {
            yield put({ type: 'showSnack', snackMessage: 'Please search for the address first!'})
          };
          yield put({ type: 'asyncLoaded', mapLoaded: true});

        },
      },
      subscriptions: {
        setup({ dispatch, history }) {
        },
      },
    };
