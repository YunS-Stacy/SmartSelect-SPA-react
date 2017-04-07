import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Button } from 'antd';

const style = {
  container: {
    position: 'relative',
    marginTop: '10vh'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
  button: {
    width: "8.8em",
    height: "3.2em",
    borderRadius: "8px",
    fontSize: "1.2em",
    fontWeight: 600,
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: 'rgb(82, 186, 213)',
  }
};

export default class MainButton extends Component{
  constructor(props) {
    super(props);
    // console.log('mainbuttonProps',props);
  }

	renderContent(){
		if(this.props.mapLoaded === true){
      // console.log('map is loaded');
			return (
				<Button
          style={{textShadow: '0'}}
          // .banner0-wrapper button:hover
          // span {
          //   text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.35);
          // }
          // loading={this.state.loading}
					onClick={(e) => {e.preventDefault();
            this.props.dispatch({
              type: 'smartselect/changeMode',
              mode: 'mode-query',
            })
          }}//use bind(this), if not using constructor
					id="btn-get-started-loader"
          style={style.button}
    >
					GET STARTED
				</Button>
			)

		} else {
      // console.log('map is still loading');
      return (

				<RefreshIndicator
					size={60}
					left={0}
					top={6}
					status="loading"
					style={style.refresh}
    />

		)}
	}


	render() {
		const {mapLoaded} = this.props;
		return (
				<div style={style.container}>
				{this.renderContent()}
			</div>

		); //return
	}
};
