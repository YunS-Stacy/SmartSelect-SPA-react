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
    dataZillow,
    map,
    askCalculate,
    mode,
    blueprint,
    dataSlider,
    parcelRange,
  } = state.smartselect;
  return {
    mapLoaded,
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
    dataZillow,
    map,
    askCalculate,
    mode,
    blueprint,
  dataSlider,
  parcelRange,
  };
}

export default connect(mapStateToProps)(Index)
