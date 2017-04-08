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
  const { mapLoaded, mapPitch, mapZoom, mapCenter, mapBearing, mapStyle, parcelVis, footVis, blueVis, calData, height, dataZillow, blueprint,
    askCalculate, map, mode} = state.smartselect;
  return {
    loading: state.loading.models.smartselect,
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
    blueprint
  };
}

export default connect(mapStateToProps)(Index)
