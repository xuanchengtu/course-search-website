import React from 'react'
import './App.css'
import Subsection from './Subsection.js'
import PopUp from './PopUp'
class Section extends React.Component {

	constructor(props){
		super(props)
		this.state = {popup: false, selectedCourse: ""}
		this.secProcessor = this.secProcessor.bind(this)
	  }

	undo = () => {
		this.setState({popup: false})
	  }

	secProcessor = (data, cm, click, cart, courseNum) => {	
		let secs = data.sections.map((sec) => {
			if(cm && cart !== undefined && !cart[data.number][sec.number]["selected"]){
				return ""
			  }
			let button = null;
			if(cm){
				button = <button id={data.number + "," + sec.number} data-value={false} onClick={(e) => {e.stopPropagation(); this.setState({popup: true, selectedCourse: data.number + "," + sec.number})}}>Remove Section</button>
			  }
			  else{
				button = <button id={data.number + "," + sec.number} data-value={true} onClick={click}>Add Section</button>
			  }
		  return(
		  <div>
			<li><p style={{"display": "inline"}}>{sec.number}</p>
				{button}
				<ul>
					<li>Instructor:{sec.instructor}</li>
					<li>Location:{sec.location}</li>
					<li>Meeting times
						<ul>
							{Object.keys(sec.time).map(function(t){
								return <li>{t}: {sec.time[t]}</li>
							})}
						</ul>
					</li>
				</ul>
			</li>
			<Subsection data={data} secNum={sec.number} secData = {sec} click={click} cartMode={cm} cart={cart} courseNum={courseNum}/>
			<PopUp show={this.state.popup && this.state.selectedCourse === data.number + "," + sec.number} courseInfo={data.number + "," + sec.number} remove={click} undo={this.undo}/> 
		  </div>
		)})
		return secs
	}


	render() {
		return (
			<div>
				<ul>
					{this.secProcessor(this.props.data, this.props.cartMode, this.props.click, this.props.cart, this.props.courseNum)}
				</ul>
			</div>
		)
	}
}

export default Section;