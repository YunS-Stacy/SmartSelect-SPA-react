import React from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
// import './less/section3.less';


export default class Section3 extends React.Component {
  static defaultProps = {
    className: 'content0',
  };

  render() {
//props.className =content2_0
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
        className={`content-template-wrapper content-half-wrapper content2_0-wrapper`}
        style={{
          height:'55vh',
        }}
      >
        <OverPack
          className={`content-template content2_0`}
          // hideProps={{ img: { reverse: true } }}
          location={props.id}
        >
          <TweenOne
            key="img"
            animation={animType.one}
            className={`content2_0-img`}
            id={`${props.id}-imgWrapper`}
            resetStyleBool
            style={{
              display: 'inline-block',
              marginLeft: '4vw',
              width: '45vw',
              // height: '05vw',
              padding: '1vh'
              // float:'right',

            }}
          >
            <img style={{
              // left: '4vw',
              width: '100%',
              height: '100%',
              // float: 'right'
            }} src="/img/1_missingData.png" />

          </TweenOne>
          <QueueAnim
            className={`content2_0-text`}
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
            <h1 key="h1" id={`${props.id}-title`}>
              Data
            </h1>
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
              Almost 50% of the data from the OPA dataset is missing, so I turned to Zillow to find the apartment conditions.
            </p>
          </QueueAnim>
        </OverPack>
      </div>
    );
  }
};
