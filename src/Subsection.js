import React from 'react'
import './App.css'
import PopUp from './PopUp'
class Subsection extends React.Component {

	constructor(props){
		super(props)
		this.state = {popup: false, selectedCourse: ""}

	  }

	undo = () => {
		this.setState({popup: false})
	  }

	isCartMode(cm, click, subsec){
		if(cm){
		  return <button id={this.props.data.number + "," + this.props.secNum + "," + subsec.number} data-value={false} onClick={(e) => {e.stopPropagation(); this.setState({popup: true, selectedCourse: this.props.data.number + "," + this.props.secNum + "," + subsec.number})}}>Remove Subsection</button>
		}
		else{
		  return <button id={this.props.data.number + "," + this.props.secNum + "," + subsec.number} data-value={true} onClick={click}>Add Subsection</button>
		}
	}

	subsecProcessor(data, cm, click, cart, secNum, courseNum){
		let subsecs = data.subsections.map((subsec) => {
			if(cm && cart !== undefined && cart[courseNum][secNum] !== undefined && cart[courseNum][secNum][subsec.number] !== undefined && !cart[courseNum][secNum][subsec.number]["selected"]){
				return ""
			  }
			return(<div>
			<li><p style={{"display": "inline"}}>{subsec.number}</p>
				{this.isCartMode(cm, click, subsec)}
				<ul>
					<li>{subsec.location}</li>
					<li>Meeting Times
						<ul>
							{Object.keys(subsec.time).map(t => (<li>{t}: {subsec.time[t]}</li>))}
						</ul>
					</li>
				</ul>
			</li>
			<PopUp show={this.state.popup && this.state.selectedCourse === this.props.data.number + "," + this.props.secNum + "," + subsec.number} courseInfo={this.props.data.number + "," + this.props.secNum + "," + subsec.number} remove={click} undo={this.undo}/> 
			</div>)})
		return subsecs
	}

	

	render() {
		if(this.props.secData.subsections.length == 0){
			return ""
		}
		let content = this.subsecProcessor(this.props.secData, this.props.cartMode, this.props.click, this.props.cart, this.props.secNum, this.props.courseNum)
		let hasContent = new Set(content)
		if(hasContent.size == 1 && hasContent.has("")){
			return ""
		}
		return (
			<div>
				<li style={{"list-style-type": "none"}}>Subsections</li>
				<ul>
					{content}
				</ul>
			</div>
		)
	}
}

export default Subsection;