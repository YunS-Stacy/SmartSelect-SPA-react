import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Spin, Row, Col } from 'antd';

export default class ListingTable extends Component {
	render() {
			return (
				<Spin
					spinning={this.props.listing.length === 0}
					delay={500}
					size='large'
				>
					<Row>
						<Table
							height={'60vh'}
							selectable={true}
							headerStyle={{width:'98%'}}
						>
							<TableHeader
								adjustForCheckbox={false}
								displaySelectAll={false}
								enableSelectAll={false}
							>
								<TableRow>
									<TableHeaderColumn style={{width:'13vw'}}>Sold Date</TableHeaderColumn>
									<TableHeaderColumn style={{width:'20vw'}}>Address</TableHeaderColumn>
									<TableHeaderColumn style={{width:'12vw'}}>Price</TableHeaderColumn>
									<TableHeaderColumn style={{width:'7vw'}}>Beds</TableHeaderColumn>
									<TableHeaderColumn style={{width:'7vw'}}>Baths</TableHeaderColumn>
									<TableHeaderColumn style={{width:'14vw'}}>Area(sqft)</TableHeaderColumn>
									<TableHeaderColumn style={{width:'14vw'}}>Unit Price(sqft)</TableHeaderColumn>
								</TableRow>
							</TableHeader>
							<TableBody
								displayRowCheckbox={false}
							>
								{(this.props.listing.length >0) && (this.props.listing.map( (row, index) => (
									<TableRow key={index} selected={row.selected}>
										<TableRowColumn style={{width:'13vw'}}>{row.solddate}</TableRowColumn>
										<TableRowColumn style={{width:'20vw'}}>{row.address}</TableRowColumn>
										<TableRowColumn style={{width:'12vw'}}>{row.price}</TableRowColumn>
										<TableRowColumn style={{width:'7vw'}}>{row.beds}</TableRowColumn>
										<TableRowColumn style={{width:'7vw'}}>{row.baths}</TableRowColumn>
										<TableRowColumn style={{width:'14vw'}}>{row.area}</TableRowColumn>
										<TableRowColumn style={{width:'14vw'}}>{row.unitprice}</TableRowColumn>
									</TableRow>
								)))}
							</TableBody>
						</Table>
					</Row>
					{(this.props.listing.length >0) && (
						<Row
							style={{marginTop:'2em'}}
							type="flex" align="middle"
						>
							<Col span={10}>
								<h3>Market Heat</h3>
								<br />
								<p>From the latest transactions, it is easier to spot the market heat far away from your own home.</p>
							</Col>
							<Col span={10} offset={2}>
								<img src={this.props.imgsrc} style={{height:'400px'}}/>
							</Col>
						</Row>
					)}

				</Spin>
			);
		}
	}
