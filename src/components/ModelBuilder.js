import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';

export default class ModelBuilder extends Component {
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
        className={`content-template-wrapper content-half-wrapper modelbuilder-wrapper`}
        type="flex" justify="space-around"
        style={{paddingBottom:'5vh', height: '115vh'}}
      >
        <OverPack
          className={`content-template modelbuilder`}
          location={props.id}
          style={{width: '100vw'}}
        >
          <TweenOne
            animation={{ y: '-=30', opacity: 0, type: 'from' }}
            key="h3"
            reverseDelay={300}
            id={`${props.id}-title`}
          >
            <Col span={24}>
              <h2>
                ModelBuilder in ArcGIS
              </h2>
              <br />
            </Col>
          </TweenOne>
          <TweenOne
            key="img"
            animation={animType.one}
            className={`modelbuilder-img`}
            id={`${props.id}-imgWrapper`}
            resetStyleBool
          >
            <Col
              span={22}
              offset={2}
            >
              <img style={{width: '76vw'}} src="./img/ModelBuilder.png" />
            </Col>
            <Col
              span={8}
              offset={14}
              style={{paddingTop:'12em', position: 'absolute'}}
            >
              <h3 key="h3" id={`${props.id}-title`}>
                Amp Up the Automation
              </h3>
              <br />
              <p
                key="p" id={`${props.id}-content`}>
                By building a workflow, more fields (in this case, distances to the nearest 1/3/5 points) could be generated with less efforts.
              </p>
            </Col>
          </TweenOne>
        </OverPack>
      </Row>
    );
  }
};
