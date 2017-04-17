import React, {Component} from 'react';
import { Link } from 'dva/router';


import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
const styles = {
  button: {
    margin: '0 0.5em',
    top:'0.1em'
  },
};

export default class Nav extends Component {
    render() {
      const {props} = this;
      return (
        <Paper zDepth={1} style={{width: '100%', height: '7vh', position: 'relative'}}>
          { (props.pathname === '/')&&(
            <RaisedButton
              label={props.mode === 'mode-welcome' ? 'Project Home': 'Back to Home'}
              style={{margin: '0.7em 0.5em'}}
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
              containerElement={<Link to="/" />}
              label='Back to Home'
              style={{margin: '0.7em 0.5em'}}
            >
            </RaisedButton>
          )}

          {(props.mode === 'mode-welcome')&&(
            <RaisedButton
              containerElement={<Link to="/portfolio" />}
              label="Other Works"
              style={{margin: '0.7em 0.5em',display:'inline-flex'}}
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
              style={{position: 'absolute'}}>
              <MenuItem value={'design'} primaryText="Urban Design + Planning" />
              <MenuItem value={'analysis'} primaryText="Geospatial Analysis" />
            </DropDownMenu>
          )}
          <div style={{position: 'absolute', right: 0, top:0 ,margin:'2vh 1.5vw 1.5vh'}}>
            <h2 style={{color: '#757575'}}>Smart Select</h2>
          </div>
        </Paper>
    );
  }
};
