import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { API } from 'aws-amplify';

class EditComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: this.props.content,
      commentId: this.props.commentId,
      postId: this.props.postId,
      updateComment: this.props.updateComment
    };

    this.handleContentChange = this.handleContentChange.bind(this);
    this.postEdits = this.postEdits.bind(this);
    this.saveEdits = this.saveEdits.bind(this);
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  postEdits() {
    const url = "/comment/" + this.state.postId + "/" + this.state.commentId;
    const body = {'content': this.state.content};
    try {
      const result = API.put("forum", url, {
        body: body
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  saveEdits() {
    const success = this.postEdits();
    if(success) {
      this.state.updateComment(this.state.content);
      this.props.toggleEdit();
    } else {
      alert("Update failed");
    }
  }


  render() {
    return (
      <Modal show={this.props.editingComment} onHide={this.props.toggleEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <textarea placeholder="Content" rows="3"
              onChange={this.handleContentChange} value={this.state.content}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveEdits} variant="primary">Save Changes</Button>
          <Button onClick={this.props.toggleEdit}>Quit</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default EditComment
