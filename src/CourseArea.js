import React from 'react';
import './App.css';
import Course from './Course';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    for(const course of Object.values(this.props.data)) {
      courses.push (
        <Course key={course.name} data={course} click={this.props.click} cartMode={this.props.cartMode} cart={this.props.cart} bookmarkClick={this.props.bookmarkClick} rating={this.props.rating} allData={this.props.allData} bookmark={this.props.bookmark}/>
      )
    }

    return courses;
  }

  render() {
    return (
      <div style={{margin: '5px'}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CourseArea;
