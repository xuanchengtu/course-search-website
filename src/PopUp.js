import React from "react";
import { Button, Modal } from 'react-bootstrap';

class PopUp extends React.Component {

    // constructor(props){
    //     super(props)
    //     this.state = {show: false}
    // }

    // undo(){
    //     this.setState({show: false})
    // }

    render(){
      return  <Modal
        show={this.props.show}
        onHide={this.props.undo}
        backdrop="static"
        keyboard={false}
        autoFocus={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.courseInfo.replaceAll(",", " ")} has been removed. If you want to undo the removal, click "Undo". Otherwise, click "Confirm".
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.undo}>Undo</Button>
          <Button variant="danger" id={this.props.courseInfo} data-value={false} onClick={(e) => {this.props.undo(); this.props.remove(e)}}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    }

}

export default PopUp