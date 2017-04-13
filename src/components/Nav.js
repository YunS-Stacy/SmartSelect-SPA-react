import React, { PropTypes } from 'react';
import TweenOne from 'rc-tween-one';
import { Menu } from 'antd';
import { Navbar, Nav, NavItem } from 'react-bootstrap/lib';
import './css/nav.css';

const Item = Menu.Item;

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isMode: false
    }
  }

  render() {
    const props = { ...this.props };
    delete props.isMode;
    const firstNavItem= props.mode === 'mode-welcome' ? 'Home' : 'Back'
    const navData = props.mode === 'mode-welcome' ? {Item1: 'Background', Item2: 'About Model'} : {}
    const navChildren = Object.keys(navData)
    .map((item, i) => (<NavItem key={i} href={`#${navData[item]}`}>{navData[item]}</NavItem>));

    return (
      <Navbar collapseOnSelect style={{margin: 0, height: '7vh', borderRadius: 0}}>
        <Navbar.Header>
          {/* <Navbar.Brand >
          </Navbar.Brand> */}
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse >
          <Nav style={{fontSize: '1.2em'}}>
            <NavItem onClick={(e) => {
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
            }} href="#">{firstNavItem}</NavItem>
            {navChildren}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
