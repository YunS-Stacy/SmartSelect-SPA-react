import React, {Component} from 'react';

import { Icon, Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import MainButton from './MainButton';

export default class Map extends Component {
  render() {
    const props = { ...this.props };
    delete props.isMode;
    const visible = this.props.mode === 'mode-welcome' ? 'visible' : 'hidden';
    return (
        <OverPack
          replay
          playScale={[0.3, 0.1]}
          // {...props}
          mode={props.mode}
          id="map" key="map" className="map"
        >
          <QueueAnim
            type={['bottom', 'top']}
            delay={0}
            className={`${props.className}-wrapper`}
            key="text"
          >
            <Row
              className="title"
              key="title"
              type="flex"
              justify="space-around"
              align="middle"
            >
              <h1>Smart Select</h1>
            </Row>
            <Row
              key="content"
              type="flex" justify="space-around" align="middle"
            >
              <div style={{textAlign: 'center'}}>
                <h2>Explore <strong> YOUR </strong> next commercial <br />real estate investment in Philadelphia.</h2>
              </div>
            </Row>
            <Row
              key="button"
              type="flex" justify="space-around" align="middle"
            >
              <MainButton
                mapLoaded={this.props.mapLoaded}
                dispatch={this.props.dispatch}
                id={`${props.id}-button`}
              />
            </Row>
          </QueueAnim>
          <Row
            key='icon'
            type="flex" justify="space-around"
            style={{paddingTop:'20vh'}}
          >
            <TweenOne
              animation={{ y: '-=20', yoyo: true, repeat: -1, duration: 1000 }}
              key="icon"
            >
              <Icon type="down" className='scrolldown-icon'/>
            </TweenOne>
          </Row>

          </OverPack>
          );
  };
};
