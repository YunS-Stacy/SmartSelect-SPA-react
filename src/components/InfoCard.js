import React, { Component } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import TrendingDown from 'material-ui/svg-icons/action/trending-down';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';

export default class InfoCard extends Component {
  render(){
    const message = this.props.tableMessage;
    return (
      <Card style={{
        position: 'absolute',
        right:'16em',
        width: '20em',
      visibility: this.props.tableStatus}}>
        <CardHeader style={{paddingBottom: 0}}
          title="COMPS INFO"
        />
        <CardText style={{paddingTop: '1em', fontSize: '0.95em'}}>
          <ul style={{lineHeight: '2.1em'}}>
            <li><strong>Address: </strong>{message.address}</li>
            <li><strong>Last Sold Price: </strong>{message.lastSoldPrice ? `$${message.lastSoldPrice}, ` : `No Data Available`}<em>{message.lastSoldDate}</em></li>
            <li><strong>Zestimate: </strong>{message.zestimate ? `$${message.zestimate}` : `No Data Available`}</li>
            <li><strong>Value Range: </strong>{(message.valueLow && message.valueHigh) ? `$${message.valueLow} - $${message.valueHigh}` : `No Data Available`}</li>
            <li><strong>Month Change: </strong>{message.monthChange >= 0 ? <TrendingUp style={{width: '18px', height: '18px'}}/>: <TrendingDown style={{width: '18px', height: '18px'}}/>}{message.monthChange >= 0 ? ` Price Up`: ` Price Down`}</li>
          </ul>
        </CardText>
      </Card>
    );
  }
};
