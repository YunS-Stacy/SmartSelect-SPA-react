import React, { Component } from 'react';
import jquery from 'jquery';
import mapboxgl from 'mapbox-gl';
import Pubsub from 'pubsub-js';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Button} from 'antd';
import Paper from 'material-ui/Paper';
import { Step, Stepper, StepLabel, StepButton, StepContent } from 'material-ui/Stepper';

import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Slider from 'material-ui/Slider';
import Snackbar from 'material-ui/Snackbar';


import AvLibraryBooks from 'material-ui/svg-icons/av/library-books';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

const paperStyle = {
	"position": 'absolute',
	// "overflow": 'auto',
	// "fontSize": '16px',
	"width": '25vw',
	// "maxHeight": '75vh',
	"margin": '0',
	'top':'7vh',
	"padding": '0 0 2em 0',
	"backgroundColor": 'rgba(255,255,255,0.8)',
}

export default class MappingPanel extends Component{
	state={
				loading: false,
				finished: false,
				stepIndex: 0,
				slider: 50,

				// that's for the notice(snackbar)
				message: 'Default',
				open: false,
	}

	handleCalculate = () => {

		PubSub.publish('askforCalculate');
	}

	handleSlider = (event, value) => {
		this.setState({slider: value});
		PubSub.publish('askforExtrude');
		this.props.dispatch({
			type: 'smartselect/buildingHeight',
			height: value
		})
	}

	dummyAsync = (cb) => {
		this.setState({loading: true}, () => {
			this.asyncTimer = setTimeout(cb, 500);
		});
	}


	handleNext = () => {
		const {stepIndex} = this.state;
		if (!this.state.loading) {
			this.dummyAsync(() => this.setState({
				loading: false,
				stepIndex: stepIndex + 1,
				finished: stepIndex >= 4,
			}));
		}
	}

	handlePrev = () => {
		const {stepIndex} = this.state;
		if (!this.state.loading) {
			this.dummyAsync(() => this.setState({
				loading: false,
				stepIndex: stepIndex - 1,
			}));
		}
	}

	renderStepActions(step) {
		return (
			<div style={{margin: '1em 0 0 2em', float: 'right'}}>
				{step > 0 && (
					<FlatButton
						label="Back"
						onTouchTap={this.handlePrev}
					/>
				)}
				{step < 4 && (
					<RaisedButton
						label="Next"
						primary={true}
						onTouchTap={this.handleNext}
					/>
				)}
			</div>
		);
	}
	getStepContent(stepIndex) {
		switch (stepIndex) {


	case 3:
	return (
		<p>
			Find your site!
		</p>
	);
	case 4:
	return (
		<div style={{display:'inline-flex'}}>
			<div style ={{fontSize: '0.9em'}}>
				Find out stories behind the model! or share your thoughts with me?
			</div>
			<br></br>
			{/* <div style={{
				display: 'inline-flex',
				width: '9em',
				justifyContent: 'space-around'
				}}>
				<FloatingActionButton
				backgroundColor={'#49c4db'}
				>
				<AvLibraryBooks />
				</FloatingActionButton>
				<FloatingActionButton
				backgroundColor={'#49c4db'}

				>
				<CommunicationChat />
				</FloatingActionButton>
			</div> */}

		</div>
);
default:
return 'Something went wrong';
}
}

renderContent() {
	const {finished, stepIndex} = this.state;
	if (finished) {
		return (
			<div>
				<p  style={{
					fontSize: '0.9em',
					justifyContent: 'center',
					display: 'flex'
				}}>
					<a
						href="#"
						onClick={(event) => {
							event.preventDefault();
							this.setState({stepIndex: 0, finished: false});
						}}
					>
						Click here
					</a>   to reset the example.
				</p>
			</div>
		);
	}

	return (
		<div style={{
			display: 'flex',
			justifyContent: 'center'
		}}>
			<div className='row clearfix'
				style={{
					width: '75%',
					display: 'flex',
					justifyContent:'center'
				}}>
				<div>
					{/* {this.getStepContent(stepIndex)} */}
				</div>

			</div>
			{/* <div
				className='row clearfix'
				style={{display:'flex', margin: '2em -8em 0 0'}}
				>
				<IconButton
				tooltip="Back"
				tooltipPosition='top-center'
				disabled={stepIndex === 0}
				onTouchTap={this.handlePrev}
				// style={{marginRight: 12}}
				>
				<NavigationChevronLeft />
				</IconButton>
				<IconButton
				tooltip={stepIndex === 5 ? 'Finish' : 'Next'}
				tooltipPosition='top-center'
				onTouchTap={this.handleNext}
				>
				<NavigationChevronRight />
				</IconButton>

			</div> */}
		</div>

);
}



render() {

	// console.log(this.props.mode==='mode-mapping');
	if(this.props.mode==='mode-mapping'){
		jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'visible');
	} else{
		jquery('.mapboxgl-ctrl-bottom-right').css('visibility', 'hidden');
	}
	const {loading, stepIndex} = this.state;



	return (
		<Paper style={paperStyle} zDepth={3}>
			<div style={{margin: 'auto'}}>
				<Stepper
					activeStep={stepIndex}
					linear={false}
					orientation="vertical"
				>
					<Step>
						<StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
							Find
						</StepButton>
						<StepContent>

							<p>
								Switch the satellite layer on to get a clear idea
							</p>
							{this.renderStepActions(0)}
						</StepContent>
					</Step>
					<Step>
						<StepButton onTouchTap={() => this.setState({stepIndex: 1})}>
							Measure
						</StepButton>
						<StepContent>
							<div>
								<p>
									Draw and measure your footprint.
									<br></br>
									<Button onClick = {this.handleCalculate}>CALCULATE</Button>
									<br></br>
									<em>
										*If you don't like it, clean and draw another one!
									</em>

									<br></br>
									<span style={{
										fontSize:'1.3em',
										fontWeight:'600',
										color: '#2c9ab7'
									}}>
									Polygon</span>
									<br></br>
									&ensp;Perimeter: <strong style={{fontSize: '1.2em'}}>{this.props.calData.polygon.length}</strong> miles
									<br></br>
									&ensp;Area: <strong style={{fontSize: '1.2em'}}>{this.props.calData.polygon.area}</strong> square foot

									<br></br>
									<span style={{
										fontSize:'1.3em',
										fontWeight:'600',
										color: '#2c9ab7'
									}}>
										Line
									</span>
									<br></br>
									&ensp;Length: <strong style={{fontSize: '1.2em'}}>{this.props.calData.line.length}</strong> miles

								</p>



							</div>

							<div
								style={{display:'flex', justifyContent:'space-around', float: 'right', flexDirection: 'column',
								width: '40%', float: 'right'}}>
								<div style={{width: '0.5em'}}></div>
							</div>

							{this.renderStepActions(1)}
						</StepContent>
					</Step>
					<Step>
						<StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
							Build
						</StepButton>
						<StepContent>
							<div style={{
								display:'inline-flex',
							}}>
								<Slider
									axis='y'
									min={0}
									max={3500}
									step={1}
									defaultValue={2000}
									value={this.state.slider}
									onChange={this.handleSlider}
									style={{
										position: 'absolute',
										height: '8em',
									}}
									sliderStyle={{
										position: 'absolute',
										height: '6em',
										paddingBottom: 0,
										top: '1em',
										left: '1em'
									}}
								/>
								<span style={{fontSize: '0.8em', height: '10em', width: '6em'}}>(Unit: Foot)</span>

								<div style={{
									justifyContent: 'center',
									alignItems: 'flex-end',
									float:'right',
									textAlign: 'center'
								}}>
									<em>Use the slider to set the height</em><br></br><br></br>
									Your building will be
									<br></br>
									<span style={{
										fontSize:'1.5em',
										fontWeight:'600',
										color: '#2c9ab7'
									}}>{this.props.height} </span>
									feet!


								</div>
								<br></br>
							</div>
							{this.renderStepActions(2)}
						</StepContent>
					</Step>
					<Step>
						<StepButton onTouchTap={() => this.setState({stepIndex: 3})}>
							Compare
						</StepButton>
						<StepContent>
							<p>
								Find you some comps!
							</p>
							{this.renderStepActions(3)}
						</StepContent>
					</Step>
					<Step>
						<StepButton onTouchTap={() => this.setState({stepIndex: 4})}>
							Decide
						</StepButton>
						<StepContent>
							<p>
								Decision time!

							</p>
							{this.renderStepActions(4)}
						</StepContent>
					</Step>
				</Stepper>

				<Snackbar
					open={this.props.calData.num > 1 ? true : false}
					message={'You have drawn ' + this.props.calData.num + ' things. We will calculate only the last of each type of shapes.'}
					autoHideDuration={2000}
					bodyStyle={{
						padding: '1em',
						minHeight: '6em',
						lineHeight: '2em',
					}}
				/>

			</div>
		</Paper>
		);
	}
};
