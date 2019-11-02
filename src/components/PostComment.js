import React from 'react';
import { API, Auth } from 'aws-amplify';

class PostComment extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      content: '',
      postId: this.props.postId,
    }

    this.postComment = this.postComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.addComment = this.addComment.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  updateComment(e) {
    this.setState({
      content: e.target.value,
    })
  }

  postComment(body) {
    let postId = this.state.postId;
    let url = "/comment/" + postId;
    return API.post("forum", url, {
      body: body
    });
  }

  handleErrors(error) {
    alert("This is the error: " + error);
  }

  resetState() {
    this.setState({
      content: '',
    });
  }

  addComment() {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
      let userComment = {"content": that.state.content, "username": that.props.poster }
      resolve(userComment)
    });

    promise.then(this.postComment.bind(this))
      .then(this.props.appendComment)
      .then(this.resetState.bind(this))
      .catch(this.handleErrors);

  }

  render() {
    return (
      <div>
        <textarea value={this.state.content} onChange={this.updateComment} className="form-control" rows="5"></textarea>
        <button type="button" onClick={()=>this.addComment()} className="btn btn-primary">Post Comment</button>
      </div>
    );
  }
}

export default PostComment;
