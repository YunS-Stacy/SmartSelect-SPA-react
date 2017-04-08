import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Spin} from 'antd';

const paperStyle = {
  width: '13.7em',
  flexDirection: 'column',
  position: 'absolute',
  top: '9vh',
  right: '17em',
  borderRadius: '5px',
  zIndex: 9
}

export default class InfoCard extends Component {
  render(){
    return (
      <Paper
        zDepth={3}
        style={paperStyle}
      >
        {/* <Spin>
          <div style={{width: '100%', height: '100%', padding:'1em'}}>
            fdafdafdsafdas
          </div>
        </Spin> */}
      </Paper>
            );
          }
};
