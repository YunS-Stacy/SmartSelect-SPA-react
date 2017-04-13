import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { Button, Spin} from 'antd';
import Paper from 'material-ui/Paper';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';

import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Slider from 'material-ui/Slider';
import Snackbar from 'material-ui/Snackbar';

import AvLibraryBooks from 'material-ui/svg-icons/av/library-books';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

import QuerySlider from '../components/QuerySlider';
import SearchInput from '../components/SearchInput';

const paperStyle = {
	"position": 'absolute',
	"width": '25vw',
	"margin": '0',
	"padding": '0 0 2em 0',
	"backgroundColor": 'rgba(255,255,255,0.8)',
}

export default class MappingPanel extends Component{
	state={
		loading: false,
		finished: false,
		stepIndex: 0,
		slider: 50,
	}

	handleCalculate = () => {
		this.props.dispatch({
			type: 'smartselect/askCalculate'
		})
	}

	handleSlider = (event, value) => {
		this.setState({slider: value});
		this.props.dispatch({
			type: 'smartselect/askExtrude',
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
				finished: stepIndex >= 4,
				stepIndex: stepIndex + 1,
			}));
		};
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
	renderSlider(stepIndex){
		if(stepIndex === 1){
			return (
				<QuerySlider
					data={this.props.dataSlider}
					height={130}
					width={400}
					plotCfg={{margin: [10,30,40,60]}}
					forceFit={true}
					dispatch={this.props.dispatch}
				/>
			)
		} else {return <div></div>}
	}

	componentWillUpdate(nextProps,nextState){
		switch (nextState.stepIndex) {
			case 1:
			this.props.dispatch({
				type: 'smartselect/changeStyle',
				styleName: 'light',
			});
			if(this.props.mode !== 'mode-query'){
				setTimeout(()=>{
					this.props.dispatch({
						type: 'smartselect/changeMode',
						mode: 'mode-query',
					});
				},1000)
			}
			break;
			case 2:
			this.props.dispatch({
				type: 'smartselect/changeMode',
				mode: 'mode-measure',
			});
			break
			case 3:
			if(this.props.mode !== 'mode-build'){
				this.props.dispatch({
					type: 'smartselect/changeMode',
					mode: 'mode-build',
				})
			}
			if(this.props.footVis !== 'visible'){
				this.props.dispatch({
					type: 'smartselect/changeVis',
					layerName: 'footprint',
					layerVis: 'none',
				});
			}
			setTimeout(()=>{
				this.props.dispatch({
					type: 'smartselect/changeStyle',
					styleName: 'customized',
				})
			},1000)
			break;
			case 4:
				this.props.dispatch({
					type: 'smartselect/changeVis',
					layerName: 'footprint',
					layerVis: 'visible',
				});
				// setTimeout(()=>{
				// 	this.props.dispatch({
				// 		type: 'smartselect/changeStyle',
				// 		styleName: 'customized',
				// 	})
				// },1000)

			break;
			default:
			break;
		}
	}
	render() {
		const {loading, stepIndex} = this.state;
		return (
			<div>
				{this.renderSlider(stepIndex)}

				<Paper style={paperStyle} zDepth={3}>
					<Spin
						spinning={!this.props.mapLoaded}
						delay={500}
						size='large'
						style={{top: '30vh', left: '-38vw', position: 'absolute'}}>
						<Stepper
							activeStep={stepIndex}
							linear={true}
							orientation="vertical">
							<Step>
								<StepLabel>
									Intro
								</StepLabel>
								<StepContent>
									<Button style={{display: 'inline-block', float:'right'}}>Replay</Button>

									<p style={{whiteSpace: 'pre-line'}}>
										{`Welcome!

												Click "Next" to find your next INVESTMENT!`}
									</p>
									{this.renderStepActions(0)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Find
								</StepLabel>
								<StepContent>
									<p>
										Don't forget to use the slider below to define a price range.
									</p>
									<SearchInput dispatch={this.props.dispatch}/>
									{this.renderStepActions(1)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Measure
								</StepLabel>
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
									{this.renderStepActions(2)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Build
								</StepLabel>
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
									{this.renderStepActions(3)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Decide
								</StepLabel>
								<StepContent>
									<p>
										Decision time!
									</p>
									{this.renderStepActions(4)}
								</StepContent>
							</Step>
						</Stepper>
					</Spin>

					</Paper>
				</div>
	);
}
};
