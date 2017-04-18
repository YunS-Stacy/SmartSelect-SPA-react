import React, {Component} from 'react';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class Nav extends Component {
    render() {
      const {props} = this;
      return (
        <Paper zDepth={1}>
          <Row style={{height:'7vh'}}
            type="flex" align="middle" justify='space-around'
          >
            <Col span={15} style={{display:'flex',alignItems:"center"}}>
              {(props.pathname === '/')&&(
                <RaisedButton
                  style={{marginLeft: '1em'}}
                  label={props.mode === 'mode-welcome' ? 'Project Home': 'Back to Home'}
                  onTouchTap={(e)=>{
                    e.preventDefault();
                    if(props.mode !== 'mode-welcome'){
                      props.dispatch({type: 'smartselect/changeMode', mode: 'mode-welcome'});
                      setTimeout(()=>{
                        props.dispatch({
                          type: 'smartselect/changeStyle',
                          styleName: 'customized',
                        })
                      },1000)
                    }
                  }}
                >
                </RaisedButton>
              )}
              {(props.pathname === '/portfolio')&&(
                <RaisedButton
                  style={{marginLeft: '1em'}}
                  containerElement={<Link to="/" />}
                  label='Back to Home'
                >
                </RaisedButton>
              )}
              {(props.mode === 'mode-welcome')&&(
                <RaisedButton
                  style={{marginLeft: '1em'}}
                  containerElement={<Link to="/portfolio" />}
                  label="Other Works"
                >
                </RaisedButton>
              )}
              {(props.pathname === '/portfolio')&&(
                <DropDownMenu
                  selectedMenuItemStyle={{color:'#158cba'}}
                  value={props.portName}
                  onChange={(e, value) => {
                    e.preventDefault();
                    props.dispatch({type: 'smartselect/changePortfolio', portName: value===0?'design':'analysis'});
                  }}
                  style={{marginLeft: '1em'}}
                >
                  <MenuItem value={'design'} primaryText="Urban Design + Planning" />
                  <MenuItem value={'analysis'} primaryText="Geospatial Analysis" />
                </DropDownMenu>
              )}
            </Col>
            <Col span={9}>
              <p style={{fontSize:'1.5em',color: '#757575', float: 'right', marginRight: '1em'}}>Smart Select</p>
            </Col>
          </Row>

        </Paper>
    );
  }
};
