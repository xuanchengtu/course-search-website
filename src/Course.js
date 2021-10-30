import React from 'react';
import './App.css';
import Section from './Section'
import Accordion from 'react-bootstrap/Accordion';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import { Form, Modal } from 'react-bootstrap';
import App from "./App"
import PopUp from './PopUp'

class Course extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {popup: false}
  }

  undo = () => {
    this.setState({popup: false})
  }

  reqProcessor(req){
    if(req.length == 0){
      return "None";
    }
    let result = "";
    for(let i = 0; i < req.length; i++){
      result += "("
      for(let j = 0; j < req[i].length; j++){
        result += req[i][j];
        if(j < req[i].length - 1){
          result += " OR ";
        }
      }
      result += ")";
      if(i < req.length - 1){
        result += " AND ";
      }
    }
    return result;
  }

  reqCheck(course, finishedCourses, allCourses){
    let reqs = []
  
      for(let c of Object.values(allCourses)){
        if(c["number"] === course){
        
          for(let r of c["requisites"]){
          
            reqs.push(r)
           
          }
        }
      }
  
      for(let i = 0; i < reqs.length; i++){
        for(let j of reqs[i]){
          if(finishedCourses.indexOf(j) !== -1){
            reqs.splice(i, 1)
            i--
            break
          }
        }
      }
   
    return reqs
  }

  isCartMode(cm, click, rating){
    if(cm){
      if(Object.keys(rating).indexOf(this.props.data.number) !== -1){
        return <><button id={this.props.data.number} onClick={(e) => {e.stopPropagation(); this.setState({popup: true})}} data-value={false}>Remove this course</button></>
      }
      else{
        let reqs = this.reqCheck(this.props.data.number, Object.keys(rating), this.props.allData)
        if(reqs.length > 0){
          // let checked = this.props.bookmark.indexOf(this.props.data.number) !== -1
          return(<><button id={this.props.data.number} onClick={this.props.bookmarkClick} style={{marginLeft: "10px"}}>Bookmark this course</button><button id={this.props.data.number} onClick={(e) => {e.stopPropagation(); this.setState({popup: true})}} style={{marginLeft: "10px"}} data-value={false}>Remove Course</button>
                 {/* <Form style={{marginLeft: "5px"}}>
                 <Form.Group>
                     <Form.Check type="checkbox" label="Add to Bookmark" defaultChecked={checked} onClick={event => event.stopPropagation()} onChange={(event) => this.props.bookmarkClick(event, this.props.data.number)}/>
                 </Form.Group>
               </Form></>) */}</>)
        }
        else{
          return <><button id={this.props.data.number} onClick={(e) => {e.stopPropagation(); this.setState({popup: true})}} data-value={false}>Remove Course</button></>
        }
      }
    }
    else{
        return <><button id={this.props.data.number} onClick={click} data-value={true}>Add Course</button></>
    }
  }

  render() {
    if(this.props.cartMode && this.props.cart !== undefined && !this.props.cart[this.props.data.number]["selected"]){
      return ""
    }

    return (
      <div>
      <Accordion>
      <AccordionItem eventKey={1}>
      <AccordionHeader>
        <h5 style={{"display": "inline"}}>({this.props.data.number}) {this.props.data.name} | ({this.props.data.credits} Credits)</h5>
        {this.isCartMode(this.props.cartMode, this.props.click, this.props.rating)}
        {/* <Form style={{marginLeft: "5px"}}>
          <Form.Group>
              <Form.Check type="checkbox" label="Add to Bookmark" onClick={event => event.stopPropagation()} onChange={(event) => this.props.bookmarkClick(event, this.props.data.number)}/>
          </Form.Group>
        </Form> */}
        </AccordionHeader>
        <AccordionBody>
        <p>Subject: {this.props.data.subject}</p>
        <p>{this.props.data.description}</p>
        <p><span style={{"font-weight": "bold"}}>Requisites:</span> {this.reqProcessor(this.props.data.requisites)}</p>
        <p>Keywords: {this.props.data.keywords.join(", ")}</p>
        <Section data={this.props.data} courseNum={this.props.data.number} click={this.props.click} cartMode={this.props.cartMode} cart={this.props.cart} undo={this.undo}/>
        </AccordionBody>
        </AccordionItem>
        </Accordion>
        <PopUp show={this.state.popup} courseInfo={this.props.data.number} remove={this.props.click} undo={this.undo}/>
      </div>
    )
  }
}

export default Course;
