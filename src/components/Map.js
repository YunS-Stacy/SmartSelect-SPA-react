import React, { Component, PropTypes } from 'react';

import { Button, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import MainButton from './MainButton';
import './css/map.css';
// import './less/section1.less';

export default class Map extends React.Component {
  render() {
    const props = { ...this.props };
    delete props.isMode;
    const visible = this.props.mode === 'mode-welcome' ? 'visible' : 'hidden';
    return (
      <div style={{visibility: visible}}>
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
            id={`${props.id}-wrapper`}
          >
            <div className="clearfix justify-content-center">
              <span
                style={{visibility: visible}}
                className="title"
                key="title"
                id={`${props.id}-title`}
              >
                <h1>Smart Select</h1>
                <h2>Explore <strong> YOUR </strong> next commercial real estate investment in Philadelphia.</h2>
                <MainButton
                  mapLoaded={this.props.mapLoaded}
                  dispatch={this.props.dispatch}
                  id={`${props.id}-button`}
                />
              </span>
            </div>

          </QueueAnim>
          <TweenOne
            animation={{ y: '-=20', yoyo: true, repeat: -1, duration: 1000 }}
            className={`${props.className}-icon`}
            key="icon"
          >
            <Icon type="down" />
          </TweenOne>
        </OverPack>
      </div>
    );
  };
};
