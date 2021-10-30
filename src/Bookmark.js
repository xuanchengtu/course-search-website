import React from 'react';
import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';

class Bookmark extends React.Component{

    getEntries = () => {
        let entries = []
        for(let i of this.props.bookmark){
            let courseName = ""
            for(let j of this.props.allCourses){
                if(j["number"] === i){
                    courseName = j["name"]
                }
            }
            entries.push(<ListGroup.Item>
            <span style={{fontWeight: "bold", display: "inline"}}>{i}</span><button id={i} onClick={this.props.remove}>Remove</button><br />{courseName}
        </ListGroup.Item>)
        }
        return entries
    }

    render(){
       return(<>
        <Card style={{width: 'calc(23vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 10px)', position: 'fixed', overflowY: 'scroll'}}>
          <Card.Body>
            <Card.Title>Bookmarked Courses</Card.Title>
            <ListGroup style={{maxHeight: 'calc(90vh - 70px)', overflowY: "scroll"}}>
                        {this.getEntries()}
            </ListGroup>
          </Card.Body>
        </Card>
      </>)
    }
}

export default Bookmark