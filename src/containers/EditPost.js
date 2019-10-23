import React from "react";
import {Modal, Form, Button, FormGroup} from 'react-bootstrap';
import UtilityBelt from '../components/utilityBelt.js';

class EditPost extends React.Component {
  constructor(props) {
    super(constructor);

    this.state = {
      isEditing: false,
      postTitle: this.props.postTitle,
      content: this.props.content
    }

    this.handleClose = this.handleClose.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.setState({
      postTitle: this.props.postTitle,
      content: this.props.content
    })
  }

  handleClose() {
    this.setState({
      isEditing: false,
      postTitle: this.props.postTitle,
      content: this.props.content
    });
  }

  handleTitleChange(e) {
    this.setState({postTitle: e.target.value});
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  handleSave() {
    let title = this.state.postTitle;
    let content = this.state.content;
    let success = this.props.saveEdits(title, content);
    if(success) {
      this.props.toggleEditPost();
    }
  }

  render() {
    return (
      <>
        <Modal show={this.props.isEditing} onHide={this.props.toggleEditPost}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Title"
              onChange={this.handleTitleChange} value={this.state.postTitle}></input>
            <textarea className="form-control" placeholder="Content" rows="3"
              onChange={this.handleContentChange} value={this.state.content}></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditPost}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
  }
}

export default EditPost;
