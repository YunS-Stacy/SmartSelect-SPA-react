import React, { Component } from 'react';
import Search from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

export default class InfoCard extends Component {
  constructor(props) {
  super(props);

  this.state = {
    address: '',
  };
};

  handleChange = (ev) => {
    this.setState({
      address: ev.target.value,
    });
  };

  render(){
    return (
      <div style={{display: 'inline-flex'}}>
        <TextField
          style={{fontSize: '1.1em', width: '15vw'}}
          hintText="Search for Address"
          value={this.state.address}
          onChange={this.handleChange}
        />
        <IconButton
          onTouchTap={()=>{this.props.dispatch({type:'smartselect/geocodeAddress',address:`${this.state.address},Philadelphia`})}}
        >
          <Search />
        </IconButton>
      </div>
        );
  }
};
