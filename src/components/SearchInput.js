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
      <div
        style={{display: 'inline-flex', width:'100%'}}
      >
        <TextField
          hintText="Search for Address"
          hintStyle={{fontStyle:'italic', fontSize:'0.9em'}}
          inputStyle={{fontSize:'0.9em'}}
          value={this.state.address}
          onChange={this.handleChange}
        />
        <IconButton
          className='searchInput'

          onTouchTap={()=>{this.props.dispatch({type:'smartselect/geocodeAddress',address:`${this.state.address},Philadelphia`})}}
        >
          <Search />
        </IconButton>
      </div>
    );
  }
};
