import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Spin} from 'antd';


export default class InfoCard extends Component {

 paperStyle= {
    width: '13.7em',
    height: '50vh',
    flexDirection: 'column',
    position: 'absolute',
    top: '9vh',
    right: '17em',
    borderRadius: '5px',
    zIndex: 9,
    visibility: this.props.visibility
  }
  render(){

    console.log(this.props.visibility, 'vy info card')
    return (
      <Paper
        zDepth={3}
        style={this.paperStyle}
      >
        <div>{this.props.tableMessage.address}</div>
        {/* <Spin>
          <div style={{width: '100%', height: '100%', padding:'1em'}}>
            fdafdafdsafdas
          </div>
        </Spin> */}
      </Paper>
            );
          }
};
