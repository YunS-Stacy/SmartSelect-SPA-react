import React, {Component} from 'react';
import { Row, Col } from 'antd';

import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

const aboutContent = `Smart Select is a web application that allows you to navigate through the city,
                      find your next investment opportunity of apartments, and ... build it!`;
const problemContent = `Pro forma is EXHAUSTING, and the data sources are complicated to collect,
                        and may sometimes have a large proportion of the MISSING values.`;
const solutionContent = `The final model used only "LOCATION" factors as predictors.
                          Everyone will have an easy access to get a suggested price for a parcel!`
export default class Background extends Component {
  getBlockChildren = (item, i) =>(
    <Col
      span={6}
      key={i} id={`${this.props.id}-block${i}`}
    >
      <h3>{item.title}</h3>
      <p>{item.content}</p>
    </Col>);

  render() {
    const props = { ...this.props };
    delete props.isMode;
    const dataSource = [
      { title: 'About', content: aboutContent},
      { title: 'Problem', content: problemContent },
      { title: 'Solution', content: solutionContent },
    ];
    const listChildren = dataSource.map(this.getBlockChildren);

    return (
      <div
        id = 'Info'
        {...props}
        className={`content-template-wrapper ${props.className}-wrapper`}
      >
        <OverPack
          className={`content-template ${props.className}`}
          location={props.id}
        >
          <TweenOne
            animation={{ y: '-=30', opacity: 0, type: 'from' }}
            key="h1"
            reverseDelay={300}
            id={`${props.id}-title`}
          >
            <h2>
              Background
            </h2>
          </TweenOne>

          <TweenOne
            animation={{ y: '+=30', opacity: 0, type: 'from' }}
            key="block"
            reverseDelay={300}
            id={`${props.id}-title`}
          >
            <Row
              key='content'
              type="flex" justify="space-around" align="top"
            >
              {listChildren}
            </Row>

          </TweenOne>
        </OverPack>
      </div>
    );
  }
};
