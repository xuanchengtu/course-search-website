import React from "react";
import "./App.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import CompletedCourses from "./CompletedCourses";
import RecommendedCourses from "./RecommendedCourses";
import Bookmark from "./Bookmark";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      keywords: [],
      cart: {},
      completed: [],
      rating: {},
      requisiteNotFulfilled: [],
      bookmark: [],
      ready: false
    };
  }

  componentDidMount() {
    fetch("http://cs571.cs.wisc.edu:53706/api/react/classes")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          allCourses: data,
          filteredCourses: data,
          subjects: this.getSubjects(data),
          keywords: this.getKeywords(data)
        }, () => {
          let cartTemp = {}
          let ratingTemp = {}
    for(let i of this.state.allCourses){
      cartTemp[i["number"]] = {"selected": false}
      for(let j of i["sections"]){
        cartTemp[i["number"]][j["number"]] = {"selected": false}
        for(let k of j["subsections"]){
          cartTemp[i["number"]][j["number"]][k["number"]] = {"selected": false}
        }
      }
    }
    
    this.setState({cart: cartTemp}, () => {this.setState({ready: true})})
        })
      );
    
    fetch("http://cs571.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed")
        .then((res) => res.json())
        .then((data) => this.setState({
          completed: data["data"]
        }, () => {
          let ratingTemp = {}
          for(let i of this.state.completed){
            ratingTemp[i] = "No Rating"
          }
          this.setState({rating: ratingTemp})
        }))
    
    
  }

  bookmarkRemove = (event) => {
    let id = event.target.id;
    let bmTemp = JSON.parse(JSON.stringify(this.state.bookmark))
    bmTemp.splice(bmTemp.indexOf(id), 1)
    this.setState({bookmark: bmTemp})
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

  buildPath(curr, path, allCourses, completed){
    for(let c of allCourses){
      if(c["number"] === curr){
        for(let i of c["requisites"]){
          let temp = this.buildPath(i[0], path, allCourses, completed)
          for(let j of temp){
            if(path.indexOf(j) === -1){
              path.push(j)
            }
          }
        }
      }
    }
    if(path.indexOf(curr) === -1){
      path.push(curr)
    }

    for(let i = 0; i < path.length; i++){
      if(completed.indexOf(path[i]) !== -1){
        path.splice(i, 1)
        i--
      }
    }
    
    return path
  }
   bookmarkClick = (event) => {
     event.stopPropagation()
     let id = event.target.id
      let bm = JSON.parse(JSON.stringify(this.state.bookmark))
      if(bm.indexOf(id) === -1){
        bm.push(id)
        alert("Successfully bookmarked course " + id + ' !')
      } else{
        alert("Course " + id + " is already bookmarked!")
      }
      this.setState({bookmark: bm})
   }

  btnClick = (event) => {
    event.stopPropagation()
    let course = event.target.id.split(",");
    let value = event.target.dataset.value === "true"
    let cartTemp = JSON.parse(JSON.stringify(this.state.cart))

    if(value){
      let completeTemp = JSON.parse(JSON.stringify(this.state.completed))
      let allDataTemp = JSON.parse(JSON.stringify(this.state.allCourses))
      let reqs = this.reqCheck(course[0], completeTemp, allDataTemp)
      if(reqs.length !== 0){
        let result = "";
        for(let i = 0; i < reqs.length; i++){
          result += "("
          for(let j = 0; j < reqs[i].length; j++){
            result += reqs[i][j];
            if(j < reqs[i].length - 1){
              result += " OR ";
            }
          }
          result += ")";
          if(i < reqs.length - 1){
            result += " AND ";
          }
        }

        let path = this.buildPath(course[0], [], allDataTemp, completeTemp)

        alert("You have not met requisite(s) " + result + " !" + " Possible requisite path: " + path.join("->"))
      }
    }


    //Case1: selected the whole course
    if(course.length == 1){
      for(let i in cartTemp[course[0]]){
        if(i === "selected"){
          cartTemp[course[0]][i] = value  //select the course
        }
        else{
          for(let j in cartTemp[course[0]][i]){
            if(j === "selected"){
              cartTemp[course[0]][i][j] = value //select all sections
            }
            else{
              cartTemp[course[0]][i][j]["selected"] = value //select all subsections
            }
          }
        }
      }
    }
    
    //Case2: selected a section
    if(course.length == 2){
      if(value){
        cartTemp[course[0]]["selected"] = value
      }
      for(let i in cartTemp[course[0]][course[1]]){
        if(i === "selected"){
          cartTemp[course[0]][course[1]][i] = value
        }
        else{
          cartTemp[course[0]][course[1]][i]["selected"] = value
        }
      }
    }

    //Case3: selected a subsection
    if(course.length == 3){
      if(value){
        cartTemp[course[0]]["selected"] = true
        cartTemp[course[0]][course[1]]["selected"] = true
      }
      cartTemp[course[0]][course[1]][course[2]]["selected"] = value
    }
    this.setState({cart: cartTemp})
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (const course of Object.values(data)) {
      if (subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  getKeywords(data){
    let keywords = []
    keywords.push("All")

    for (const course of Object.values(data)) {
      for(let j of course.keywords){
        if(keywords.indexOf(j) === -1)
        keywords.push(j)
      }
    }

    return keywords
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  updateRating = (course, rating) => {
    let ratingTemp = JSON.parse(JSON.stringify(this.state.rating))
    ratingTemp[course] = rating
    this.setState({rating: ratingTemp})
  }

  render() {
    if(!this.state.ready){
      return ""
    }
    return (
      <>
        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 99,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              keywords={this.state.keywords}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                cartMode={false}
                click={this.btnClick}
                ready={this.state.ready}
                bookmarkClick={this.bookmarkClick}
                rating={this.state.rating}
                bookmark={this.state.bookmark}
              />
            </div>
          </Tab>

          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <Bookmark 
              allCourses={this.state.allCourses}
              bookmark={this.state.bookmark}
              remove={this.bookmarkRemove}
            />
            <div style={{ marginLeft: "23vw" }}>
            <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                cartMode={true}
                cart={this.state.cart}
                click={this.btnClick}
                ready={this.state.ready}
                bookmarkClick={this.bookmarkClick}
                rating={this.state.rating}
                bookmark={this.state.bookmark}
              />
            </div>
          </Tab>

          <Tab eventKey="completedCourses" title="Completed Courses" style={{ paddingTop: "5vh" }}>
            <CompletedCourses 
              completed={this.state.completed}
              allCourses={this.state.allCourses}
              updateRating={this.updateRating}
            />
          </Tab>

          <Tab eventKey="recommendedCourses" title="Recommended Courses" style={{ paddingTop: "5vh" }}>
            <RecommendedCourses 
              rating={this.state.rating}
              allCourses={this.state.allCourses}
              interestAreas={this.state.keywords}
              bookmark={this.state.bookmark}
              buildPath={this.buildPath}
            />
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
