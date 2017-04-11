import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

const styles ={
  label: {
    fontWeight: 400,
    fontSize: '0.9em'
  },
  paper: {
    width: '13.7em',
    flexDirection: 'column',
    position: 'absolute',
    top: '5.5em',
    right: '1em',
    borderRadius: '5px'
  },
  group: {
    marginLeft: '0.5em',
    marginTop: '0.2em'
  }
}

export default class LayerToggle extends Component {
  handleBuilding (e, bool){
    const layerName = 'footprint';
    const layerVis = bool === true ? 'visible' : 'none';
    this.props.dispatch({
      type: 'smartselect/changeVis',
      layerName: layerName,
      layerVis: layerVis,
    })
  }


  handleBlueprint (e, bool){
    const layerName = 'blueprint';
    const layerVis = bool === true ? 'visible' : 'none';
    this.props.dispatch({
      type: 'smartselect/changeVis',
      layerName: layerName,
      layerVis: layerVis,
    })
  }

  handleParcel (e, bool){
    const layerName = 'parcel';
    const layerVis = bool === true ? 'visible' : 'none';
    this.props.dispatch({
      type: 'smartselect/changeVis',
      layerName: layerName,
      layerVis: layerVis,
    })
  }

  handlechangeStyle(e, value){
    this.props.dispatch({
      type: 'smartselect/changeStyle',
      styleName: value
    });
  }
  render(){
    return (
      <Paper
        zDepth={3}
        style={styles.paper}
      >

        <div style={styles.group}>
          <RadioButtonGroup
            name="mapStyle"
            valueSelected={this.props.styleName}
            onChange={this.handlechangeStyle.bind(this)}
          >
            <RadioButton
              value="customized"
              label="CUSTOMIZED"
              labelStyle={styles.label}
              disabled = {this.props.mode === 'mode-build' ? true : false}
            />
            <RadioButton
              value="light"
              label="LIGHT"
              labelStyle={styles.label}
              disabled = {this.props.mode === 'mode-build' ? true : false}
            />
            <RadioButton
              value="satellite"
              label="SATELLITE"
              labelStyle={styles.label}
              disabled = {this.props.mode === 'mode-build' ? true : false}
            />
          </RadioButtonGroup>
        </div>
        <Divider />
        <div style={styles.group}>
          <Checkbox
            label="ESTIMATED PRICE"
            labelStyle={styles.label}
            onCheck = {this.handleParcel.bind(this)}
            checked = {this.props.parcelVis === 'visible' ? true : false}
          />
          <Checkbox
            label="3D BUILDING LAYER"
            labelStyle={styles.label}
            onCheck = {this.handleBuilding.bind(this)}
            checked = {this.props.footVis === 'visible' ? true : false}
          />
          <Checkbox
            label="YOUR BUILDING"
            labelStyle={styles.label}
            onCheck = {this.handleBlueprint.bind(this)}
            checked = {this.props.blueVis === 'visible' ? true : false}
            // disabled = {this.props.mode !== 'mode-build' ? true : false}
          />
        </div>
      </Paper>
    );
  }
};
