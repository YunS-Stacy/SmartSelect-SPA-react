import React from 'react';
import { connect } from 'dva';

import Index from '../components/Index';

function IndexPage({dispatch, location, smartselect}) {
  return (
    <Index
      dispatch = {dispatch}
      location = {location}
    />
  )
};

function mapStateToProps(state){
  const {
    mapLoaded,
    maxBounds,
    mapPitch,
    mapZoom,
    mapCenter,
    mapBearing,
    mapStyle,
    styleName,
    parcelVis,
    footVis,
    blueVis,
    vacantVis,
    calData,
    height,
    map,
    askCalculate,
    mode,
    blueprint,
    dataSlider,
    dataMarket,
    dataCorrplot,
    parcelRange,
    snackMessage,
    popupInfo,
    tableStatus,
    tableMessage,
    compsLines,
    compsPts,
    routeLines,
    routePts,
  } = state.smartselect;
  return {
    mapLoaded,
    maxBounds,
    mapPitch,
    mapZoom,
    mapCenter,
    mapBearing,
    mapStyle,
    styleName,
    parcelVis,
    footVis,
    blueVis,
    vacantVis,
    calData,
    height,
    map,
    askCalculate,
    mode,
    blueprint,
    dataSlider,
    dataMarket,
    dataCorrplot,
    parcelRange,
    snackMessage,
    popupInfo,
    tableStatus,
    tableMessage,
    compsLines,
    compsPts,
    routeLines,
    routePts,
  };
}

export default connect(mapStateToProps)(Index)
