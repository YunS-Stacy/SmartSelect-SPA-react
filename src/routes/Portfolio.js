import React from 'react';
import { connect } from 'dva';
import Portfolio from '../components/Portfolio';

function portfolio({dispatch, smartselect}) {
  return (
    <Portfolio
      location={location}
      dispatch={dispatch}
    />
  );
}

function mapStateToProps(state) {
  const {portName} = state.smartselect
  return {portName};
}

export default connect(mapStateToProps)(Portfolio);
