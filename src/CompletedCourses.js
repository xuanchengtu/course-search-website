import React from 'react';
import { Card, Form, ListGroup } from 'react-bootstrap';
import './App.css';

class CompletedCourses extends React.Component {
    
    getCourses(completed, allCourses, updateRating){
        if(completed === undefined){
            return ""
        }
        let choices = ["No Rating", 1, 2, 3, 4, 5]
        let options = []
        for(let i of choices){
            options.push(<option key={i}>{i}</option>)
        }
        let courses = completed.map(function(course){
            let courseData = null;
            for(let i of allCourses){
                if(i["number"] === course){
   
                    courseData = i
                    break
                }
            }
            if(courseData === null){
                return ""
            }
            
            return(
            <ListGroup.Item>
            <Card>
                <Card.Body>
                    <Card.Title>{courseData.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{course} - {courseData.credits} credits</Card.Subtitle>
                    <Form>
                        <Form.Group>
                            <Form.Control as="select" onChange={e => updateRating(course, e.target.value)} style={{height: "42px"}}>
                                {options}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            </ListGroup.Item>)
        })
        return courses
    }

    render() {
        return (
        <div style={{margin: "5px"}}>
            <ListGroup style={{width: "40%", margin: "auto"}}>
                {this.getCourses(this.props.completed, this.props.allCourses, this.props.updateRating)}
            </ListGroup>
        </div>
        )
    }
}

export default CompletedCourses;