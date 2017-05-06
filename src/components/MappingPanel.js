import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';

import { Button, Spin} from 'antd';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';

import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';

import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Slider from 'material-ui/Slider';

import AvLibraryBooks from 'material-ui/svg-icons/av/library-books';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

import SearchInput from '../components/SearchInput';
import Joyride from 'react-joyride';

const paperStyle = {
	"position": 'absolute',
	"width": '25vw',
	"margin": '0',
	"padding": '2em',
	"backgroundColor": 'rgba(255,255,255,0.8)',
}

export default class MappingPanel extends Component{
	state = {
		loading: false,
		finished: false,
		stepIndex: 0,
		slider: 50,
		joyrideOverlay: true,
		run: false,
		steps: [],
		toggled: false
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
				toggled: false,
				run: false,
				steps: [],
			}));
		};
	}

	handlePrev = () => {
		const {stepIndex} = this.state;
		if (!this.state.loading) {
			this.dummyAsync(() => this.setState({
				loading: false,
				stepIndex: stepIndex - 1,
				toggled: false,
				run: false,
				steps: [],
			}));
		};
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

	componentWillUpdate(nextProps,nextState){
		if(this.state.stepIndex !== nextState.stepIndex){
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
				break;
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
				break;
				default:
				break;
			}
		}
	}
   callback = (data)=>{
     console.log('%ccallback', 'color: #47AAAC; font-weight: bold; font-size: 13px;'); //eslint-disable-line no-console
     console.log(data); //eslint-disable-line no-console
		 if (data.type === 'finished') {
			this.refs.joyride.reset(true);
			this.setState({
				toggled: false,
				run: false
			});
		 }
   }

	 showHelp(e,bool){
		 if(bool){
			 this.refs.joyride.reset(true);
			 switch (this.state.stepIndex) {
			 	case 0:
				this.setState({
					toggled: bool,
					steps:[
						{
							title: 'Welcome to SmartSelect',
							text: 'Here is your current state of progress.',
							selector: '.leftPanel',
							type: 'hover',
							position: 'right'
						},
						{
							title: 'Style/Layer Control',
							text: 'Here you can control the map style and layers.',
							selector: '.rightPanel',
							type: 'hover',
							position: 'left'
						},
						{
							title: 'Map Control',
							text: 'Control the map through the buttons',
							selector: '.mapboxgl-ctrl-bottom-right',
							type: 'hover',
							position: 'left'
						},
						{
							title: 'Back to Main Page',
							text: 'Go back and find out some useful information about local market and learn more about the model.',
							selector: '.back',
							type: 'hover',
							position: 'left'
						},
						{
							title: 'Show Help',
							text: 'Toggle the button to show different tools for each step.',
							selector: '.showHelp',
							type: 'hover',
							position: 'right'
						},
					],
					run: true,
				});
			 		break;
					case 1:
						this.setState({
							toggled: true,
							steps:[
								{
									title: 'Find the RIGHT Parcel',
									text: 'Hover on any parcel to get a reference price, comparables information and transit routes. <br/><br/><i><small>*If any comparable is found, you can hover on the point and get more information!</small></i>',
									type: 'hover',
									selector: '.mapboxgl-canvas',
									position: 'middle'
								},
						{
							title: 'Price Slider',
							text: 'You can drag on the chart to define a price range.',
							selector: '.sliderChart',
							type: 'hover',
							position: 'top'
						},

						{
							title: 'Search Your Address',
							text: 'To get transit routes, please search an address and the place will be automatically set as the origin of the route.',
							selector: '.searchInput',
							type: 'hover',
							position: 'left'
						},
					],
					run: true,
				});
					break;
					case 2:
						this.setState({
							toggled: true,
							steps:[
								{
									title: 'Find the RIGHT Parcel',
									text: 'Hover on any parcel to get a reference price, comparables information and transit routes. If any comparable is found, you can hover on the point and get more information!',
									type: 'hover',
									selector: '.mapboxgl-canvas',
									position: 'middle'
								},
						{
							title: 'Draw Toolbox',
							text: 'Use the buttons to draw polygons and lines. You can always delet and draw it again!',
							selector: '.mapbox-gl-draw_polygon',
							type: 'hover',
							position: 'left'
						},

						{
							title: 'Calculate Button',
							text: 'Click on the button to calculate. The results will be shown in the following.',
							selector: '.calculateBtn',
							type: 'hover',
							position: 'right'
						},
					],
					run: true,
				});
					break;
					case 3:
						this.setState({
							toggled: true,
							steps:[
						{
							title: 'Height Slider',
							text: 'Use the slider to define the height.',
							selector: '.heightSlider',
							type: 'hover',
							position: 'right'
						},

					],
					run: true,
				});
				break;
			 	default:
					break;
			 }
		 } else {
			 this.setState({
				 toggled: false,
				 run: false,
			 })
		 }


	 }
	render() {
		const {loading, stepIndex} = this.state;
		return (
			<div>
				<Joyride
					holePadding={0}
					ref="joyride"
					run={this.state.run} // or some other boolean for when you want to start it
					callback={this.callback}
					// disableOverlay={this.state.selector === '.nav'}
					locale={{
						back: (<span>Back</span>),
						close: (<span>Close</span>),
						last: (<span>Finish</span>),
						next: (<span>Next</span>),
						skip: (<span>Skip</span>),
					}}
					steps={this.state.steps}
					run={this.state.run}
					showOverlay={this.state.joyrideOverlay}
					showSkipButton={true}
					showStepsProgress={true}
					type='continuous'
					scrollToSteps={false}

				/>
				<Paper style={paperStyle} zDepth={3} className='leftPanel'>
					<Spin
						spinning={!this.props.mapLoaded}
						delay={500}
						size='large'
						style={{top: '30vh', left: '-38vw', position: 'absolute'}}>
						<div className='showHelp' style={{width:'40%', float: 'right'}}>
							<Toggle
								label="Show Help"
								toggled={this.state.toggled}
								onToggle={(e,bool)=>{this.showHelp(e,bool)}}
							/>
						</div>
						<Stepper
							style={{width: '100%'}}
							activeStep={stepIndex}
							linear={true}
							orientation="vertical">
							<Step>
								<StepLabel>
									Intro
								</StepLabel>
								<StepContent>
									{/* <Button style={{display: 'inline-block', float:'right'}}>Replay</Button> */}
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
											<Button className='calculateBtn' onClick = {this.handleCalculate}>CALCULATE</Button>
											<br></br>
											<em>
												*If you don't like it, clean and draw another one!
											</em>
											<br></br>
											<span style={{
													fontSize:'1.15em',
													fontWeight:'500',
													color: '#2c9ab7'
											}}>
											Polygon</span>
											<br></br>
											&ensp;Perimeter: <strong style={{fontSize: '1.2em'}}>{this.props.calData.polygon.length}</strong> miles
											<br></br>
											&ensp;Area: <strong style={{fontSize: '1.2em'}}>{this.props.calData.polygon.area}</strong> sqft

											<br></br>
											<span style={{
													fontSize:'1.15em',
													fontWeight:'500',
													color: '#2c9ab7'
											}}>
												Line
											</span>
											<br></br>
											&ensp;Length: <strong style={{fontSize: '1.2em'}}>{this.props.calData.line.length}</strong> miles
										</p>
									</div>
									<div
										style={{display:'inline-flex', justifyContent:'space-around', float: 'right', flexDirection: 'column',
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
											className='heightSlider'
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
					<Snackbar
						open={this.props.snackMessage === '' ? false : true}
						message={this.props.snackMessage}
						autoHideDuration={5000}
						bodyStyle={{
							padding: '1em',
							textAlign: 'center',
							lineHeight: '2em',
						}}
					/>
				</Paper>
			</div>
		);
	}
};
