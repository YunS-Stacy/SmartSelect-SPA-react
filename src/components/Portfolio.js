import React, { Component } from 'react';
import Frame from 'react-frame-component';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Nav from './Nav';
export default class Portfolio extends Component {
  render(){
    return (
            <MuiThemeProvider>
              <div style={{display: 'inline-flex', flexDirection: 'column', width: '100%', height: '98%'}}>
                <Nav
                  className='nav' id="nav" key="nav"
                  pathname={this.props.location.pathname}
                  portName={this.props.portName}
                  dispatch={this.props.dispatch}
                />
                {(this.props.portName === 'design')&&(
                  <Frame
                    style={{width: '100%',height:'100vw', border: '0', margin: 'auto'}}
                    initialContent={`<!DOCTYPE html>
                    <html>
                      <head>
                      </head>
                      <body style="margin: 0">
                        <div data-configid="22809099/41527839" class="issuuembed" style="height: 99vh"></div>
                        <script type="text/javascript" src="https://e.issuu.com/embed.js"></script>
                      </body>
                    </html>`}
                  />
                )}
                {(this.props.portName === 'analysis')&&(
                  <Frame
                    style={{width: '100%',height:'100vw', border: '0', margin: 'auto'}}
                    initialContent={`<!DOCTYPE html>
                  <html>
                    <head>
                    </head>
                    <body style="margin: 0">
                      <div data-configid="22809099/47345258" class="issuuembed" style="height: 99vh"></div>
                      <script type="text/javascript" src="https://e.issuu.com/embed.js"></script>
                    </body>
                  </html>`}
                  />
                )}
              </div>
            </MuiThemeProvider>

    )
  }
};
