import React from 'react';
import './App.css';
import { Card, ListGroup } from 'react-bootstrap';

class RecommendedCourses extends React.Component {

    getCourses(rating, courses, ia, bm){
        let iaRating = []
        for(let i of ia){
            iaRating.push([i, null, null, null])
        }

        for(let i of Object.keys(rating)){ //For every rated course
            if(rating[i] === "No Rating"){
                continue
            }
            for(let j of courses){ 
                if(j["number"] === i){ //Get all data of that course
                    for(let k of j["keywords"]){ //For every keywords of that course
                       
                        for(let m of iaRating){ 
                            if(m[0] === k){ 
                                if(m[1] === null){
                                    m[1] = parseInt(rating[i])
                                    m[2] = 1
                                    m[3] = parseInt(rating[i])
                                }
                                else{
                                    m[1] += parseInt(rating[i])
                                    m[2]++
                                    m[3] = m[1] / m[2]
                                }
                            }
                        }
                    }
                }
            }
        }

        iaRating.sort(function(a,b){
            return b[3] - a[3] 
        })

        let addedCourse = []
        let rcmd = []
        
        for(let i of bm){
            for(let j of courses){
                if(Object.keys(rating).indexOf(j["number"]) !== -1){
                    continue
                }
                if(j["number"] === i && addedCourse.indexOf(j["number"]) !== -1){
                    addedCourse.splice(addedCourse.indexOf(j["number"]), 1)
                    rcmd.splice(addedCourse.indexOf(j["number"]), 1)
                   
                }
                if(j["number"] === i && addedCourse.indexOf(j["number"]) === -1){
                
                    addedCourse.unshift(j["number"])
                    rcmd.unshift(<ListGroup.Item>
                        <Card>
                            <Card.Body>
                                <Card.Title>{j.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{j.number} - {j.credits} credits</Card.Subtitle>
                                <Card.Text>Recommended because you bookmarked this course! </Card.Text>
                            </Card.Body>
                        </Card>
                        </ListGroup.Item>)
                    let reqs = this.props.buildPath(i, [], this.props.allCourses, Object.keys(rating))
                  
                    for(let k of reqs){
                        for(let m of courses){
                            if(m["number"] === k && addedCourse.indexOf(m["number"]) === -1){
                                addedCourse.push(m["number"])
                    rcmd.push(<ListGroup.Item>
                        <Card>
                            <Card.Body>
                                <Card.Title>{m.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{m.number} - {m.credits} credits</Card.Subtitle>
                                <Card.Text>Recommended because this course is a not-yet-taken course on the requisite path of a bookmarked course {j["number"]}! </Card.Text>
                            </Card.Body>
                        </Card>
                        </ListGroup.Item>)
                            }
                        }
                    }
                }
            }
        }

       
        for(let i of iaRating){
            if(i[3] === null){
                continue
            }
            for(let j of courses){
                if(Object.keys(rating).indexOf(j["number"]) !== -1){
                    continue
                }
                if(j["keywords"].indexOf(i[0]) !== -1 && addedCourse.indexOf(j["number"]) === -1){
                    addedCourse.push(j["number"])
                    rcmd.push(<ListGroup.Item>
                        <Card>
                            <Card.Body>
                                <Card.Title>{j.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{j.number} - {j.credits} credits</Card.Subtitle>
                                <Card.Text>Recommended because you gave courses in the interest area {i[0]} high ratings! </Card.Text>
                            </Card.Body>
                        </Card>
                        </ListGroup.Item>)
                }
            }
        }
        
        return rcmd
    }

    render() {
        
        return (
        <div style={{margin: '5px'}}>
            <ListGroup style={{width: "40%", margin: "auto"}}>
            {this.getCourses(this.props.rating, this.props.allCourses, this.props.interestAreas, this.props.bookmark)}
            </ListGroup>
        </div>
        )
    }
}

export default RecommendedCourses;