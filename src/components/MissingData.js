import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';

export default class MissingData extends Component {
  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
    delete props.isMode;
    const animType = {
      queue: isMode ? 'bottom' : 'right',
      one: isMode ? { y: '+=30', opacity: 0, type: 'from' }
      : { x: '-=30', opacity: 0, type: 'from' },
    }
    return (
      <Row
        {...props}
        className={`content-template-wrapper content-half-wrapper missingdata-wrapper`}
        type="flex" justify="space-around" align="middle"
        style={{paddingBottom:'5vh'}}
      >
        <OverPack
          className={`content-template missingdata`}
          location={props.id}
        >
          <TweenOne
            animation={{ y: '-=30', opacity: 0, type: 'from' }}
            key="h3"
            reverseDelay={300}
            id={`${props.id}-title`}
          >
            <Col span={24}>
              <h2>
                Challenge
              </h2>
              <br />
            </Col>
          </TweenOne>
          <TweenOne
            key="img"
            animation={animType.one}
            className={`missingdata-img`}
            id={`${props.id}-imgWrapper`}
            resetStyleBool
          >
            <Col
              span={12}
              offset={2}
            >
              <img style={{width: '100%'}} src="./img/MissingData.png" />
            </Col>
            <Col
              span={8}
              offset={1}
              style={{padding:'5em 0'}}
            >
              <h3 key="h3" id={`${props.id}-title`}>
              Find the Missing Piece</h3>
              <br />
              <p
                key="p" id={`${props.id}-content`}>
                As mentioned, public data sources for real estate are complicated with >30% missing values.
              </p>
            </Col>
          </TweenOne>
        </OverPack>
      </Row>
    );
  }
};
