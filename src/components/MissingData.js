import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

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
      <div
        {...props}
        className={`content-template-wrapper content-half-wrapper missingdata-wrapper`}
        style={{
          height:'60vh',
        }}
      >
        <OverPack
          className={`content-template missingdata`}
          location={props.id}
        >
          <TweenOne
            key="img"
            animation={animType.one}
            className={`missingdata-img`}
            id={`${props.id}-imgWrapper`}
            resetStyleBool
            style={{
              display: 'inline-block',
              marginLeft: '4vw',
              width: '45vw',
              padding: '1vh'
            }}
          >
            <img style={{
              width: '100%',
              height: '100%',
            }} src="./img/MissingData.png" />
          </TweenOne>
          <QueueAnim
            className={`missingdata-text`}
            type={animType.queue}
            key="text"
            leaveReverse
            ease={['easeOutCubic', 'easeInCubic']}
            id={`${props.id}-textWrapper`}
            style={{
              marginTop: '5vh',
              display: 'inline-block',
              float:'right',
              width: '30vw',
              paddingRight: '7vw'
            }}
          >
            <h3 key="h3" id={`${props.id}-title`}
              style={{
                lineHeight: '32px',
                marginTop: '20px',
                marginBottom: '10px',
                fontSize: '24px',
                fontWeight: 400
              }}>Find the Missing Piece</h3>
            <p style={{fontSize: '1.5em'}}
              key="p" id={`${props.id}-content`}>
              As mentioned, public data sources for real estate are complicated with >30% missing values.
            </p>
          </QueueAnim>
        </OverPack>
      </div>
    );
  }
};
