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
    top: '9vh',
    right: '1vw',
    borderRadius: '5px'
  },
  group: {
    marginLeft: '0.5em',
    marginTop: '0.2em'

  }
}

export default class LayerToggle extends Component {
  constructor(props) {
    super(props);
  }
  handleBuildings (e, bool){
    let layerVisible = bool === true ? 'visible' : 'none';
    this.props.initialMap.setLayoutProperty('3d-buildings', 'visibility', layerVisible);
  }

  handleBlueprint (e, bool){
    let layerVisible = bool === true ? 'visible' : 'none';
    this.props.initialMap.setLayoutProperty('3d-blueprint', 'visibility', layerVisible);
  }

  handlePrice (e, bool){
    console.log(bool)
    let layerVisible = bool === true ? 'visible' : 'none';
    this.props.initialMap.setLayoutProperty('house-points', 'visibility', layerVisible);
  }

  handleStyleChange(e, value){

    let layerId = value;
    console.log(value);
    let mapStyle;
    switch (value) {

      case 'customized':
      console.log(value);
      mapStyle = 'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy?';
      break;
      case 'satellite':
      mapStyle = 'mapbox://styles/yunshi/cj0u96uwe009w2rqryu8r7bg8?'
      break;

      case 'light':
      mapStyle = 'mapbox://styles/yunshi/cj0u990c700fm2smr7yvnv1c5?'
      break;

      default:
      mapStyle = 'mapbox://styles/yunshi/cizrdgy3c00162rlr64v8jzgy?'
      break;

    };

    this.props.dispatch({
      type: 'smartselect/styleChange',
      mapStyle: mapStyle
    })
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
            defaultSelected="customized"
            onChange={this.handleStyleChange.bind(this)}
          >
            <RadioButton
              value="customized"
              label="CUSTOMIZED"
              labelStyle={styles.label}

              // style={styles.radioButton}
            />
            <RadioButton
              value="light"
              label="LIGHT"
              labelStyle={styles.label}

              // style={styles.radioButton}
            />

            <RadioButton
              value="satellite"
              label="SATELLITE"
              labelStyle={styles.label}

              // style={styles.radioButton}
            />

          </RadioButtonGroup>

        </div>
        <Divider />
        <div style={styles.group}>

          <Checkbox
            label="ESTIMATED PRICE"
            labelStyle={styles.label}
            onCheck = {this.handlePrice.bind(this)}
            defaultChecked = {true}
          />
          <Checkbox
            label="3D BUILDING LAYER"
            labelStyle={styles.label}
            onCheck = {this.handleBuildings.bind(this)}
            defaultChecked = {true}
          />
          <Checkbox
            label="YOUR BUILDING"
            labelStyle={styles.label}
            onCheck = {this.handleBlueprint.bind(this)}
            defaultChecked = {true}
            disabled = {this.props.height === 0 ? true : false}
          />
        </div>

      </Paper>
            );
          }
};
