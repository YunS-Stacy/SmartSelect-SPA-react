import React, { Component } from 'react';
import { Button, Icon, Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

export default class Banner extends Component {
  render() {
    const props = { ...this.props };
    delete props.isMode;
    return (
      <OverPack
        replay
        playScale={[0.3, 0.1]}
        {...props}
      >
        <Row
          className="title"
          key="title"
          id={`${props.id}-title`}
          style={{height:'50vh'}}
          type="flex" justify="space-around" align="middle"
        >
          <QueueAnim
            type={['bottom', 'top']}
            delay={200}
            className={`${props.className}-wrapper`}
            key="text"
            id={`${props.id}-wrapper`}
          >

            <h2 style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '5em',
              whiteSpace: 'nowrap',
              fontWeight: 100
            }}>
              About Model
            </h2>
          </QueueAnim>
        </Row>
        <Row
          key='icon'
          // style={{margin: '30vh 0 1vh'}}
          type="flex" justify="space-around" align="bottom"
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
  }
};
