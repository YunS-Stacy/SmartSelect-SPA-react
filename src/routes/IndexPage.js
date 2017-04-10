import React from 'react';
import { connect } from 'dva';

import Index from '../components/Index';

function IndexPage({dispatch, loading, smartselect}) {
  return (
    <Index
      dispatch = {dispatch}
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
    parcelVis,
    footVis,
    blueVis,
    calData,
    height,
    map,
    askCalculate,
    mode,
    blueprint,
    dataSlider,
    parcelRange,
    snackMessage,
    popupInfo,
    tableStatus,
    tableMessage,
    compsLines,
    compsPts,
  } = state.smartselect;
  return {
    mapLoaded,
    maxBounds,
    mapPitch,
    mapZoom,
    mapCenter,
    mapBearing,
    mapStyle,
    parcelVis,
    footVis,
    blueVis,
    calData,
    height,
    map,
    askCalculate,
    mode,
    blueprint,
    dataSlider,
    parcelRange,
    snackMessage,
    popupInfo,
    tableStatus,
    tableMessage,
    compsLines,
    compsPts,
  };
}

export default connect(mapStateToProps)(Index)
