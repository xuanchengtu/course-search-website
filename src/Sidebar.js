import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchAndFilter from './SearchAndFilter';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {msg: ""}
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
    this.interestArea = React.createRef()
  }

  // checkInput = () => {
  //   let min = this.minimumCredits.current.value
  //   let max = this.maximumCredits.current.value
  //   let msg = ""
  //   if(!Number.isInteger(Number(min)) || !Number.isInteger(Number(max))){
  //     msg += "Credit number must be valid integer!"
  //   }
  //   min = parseInt(min)
  //   max = parseInt(max)
  //   if(min < 0 || max < 0){
  //     msg += "Credit number must be positive!"
  //   }
  //   if(min > max){
  //     msg += "Minimum credit number must be less than or equal to maximum credit number!"
  //   }
  //   return msg
  // }

  setCourses() {
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.search.current.value, this.subject.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value, this.interestArea.current.value));
  }

  handleCreditsKeyDown(e) {
    if(['0','1','2','3','4','5','6','7','8','9','Backspace','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for(const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  getKeywordsOptions() {
    let keywordsOptions = [];

    for(const keyword of this.props.keywords) {
      keywordsOptions.push(<option key={keyword}>{keyword}</option>);
    }

    return keywordsOptions;
  }

  render() {
    return (
      <>
        <Card style={{width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 10px)', position: 'fixed', overflowY: 'scroll'}}>
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <Form>
              <Form.Group controlId="formKeywords" onChange={() => this.setCourses()} style={{width: '100%'}}>
                <Form.Label>Search</Form.Label>
                <Form.Control type="text" placeholder="Search" autoComplete="off" ref={this.search}/>
              </Form.Group>

              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control as="select" ref={this.subject} onChange={() => this.setCourses()} style={{height: "42px"}}>
                  {this.getSubjectOptions()}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formInterestArea">
                <Form.Label>Interest Area</Form.Label>
                <Form.Control as="select" ref={this.interestArea} onChange={() => this.setCourses()} style={{height: "42px"}}>
                  {this.getKeywordsOptions()}
                </Form.Control>
              </Form.Group>

              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Form.Group controlId="minimumCredits" onChange={() => {this.setState({msg: this.searchAndFilter.checkInput(this.minimumCredits.current.value,this.maximumCredits.current.value)[0]}); this.setCourses()}} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Label>Credits</Form.Label>
                  <Form.Control type="text" placeholder="minimum" autoComplete="off" ref={this.minimumCredits}/>
                </Form.Group>
                <div style={{marginLeft: '5px', marginRight: '5px', marginTop: '38px'}}>to</div>
                <Form.Group controlId="maximumCredits" style={{marginTop: '32px'}} onChange={() => {this.setState({msg: this.searchAndFilter.checkInput(this.minimumCredits.current.value,this.maximumCredits.current.value)[0]}); this.setCourses()}} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Control type="text" placeholder="maximum" autoComplete="off" ref={this.maximumCredits}/>
                </Form.Group>
              </div>
            </Form>
            <Card.Text style={{fontSize: "12px", color: "red"}}>
              {this.state.msg}
              </Card.Text>
            <Card.Text style={{fontSize: "12px"}}>
                <br />If you add a not-yet-taken course that is currently unable to take because of unfulfilled requisites,
                there will be a pop-up alert saying that some requisites of the added course are not fulfilled yet, and
                a possible course path to take to be able to take the desired course will be given. The course will
                still be added to the cart. In the cart, you can bookmark those courses that have some requisites unfulfilled.
                Those bookmarked courses in the cart, along with all requisite courses on the suggested requisite course paths of those bookmarked courses,
                will appear on the top of all recommended courses.
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;
