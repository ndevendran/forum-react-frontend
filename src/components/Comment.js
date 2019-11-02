import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import EditComment from '../components/EditComment.js';
import { Storage } from 'aws-amplify';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      username: this.props.username,
      createdAt: new Date(this.props.createdAt).toLocaleString(),
      editing: false,
      avatarUrl: '',
    }

    const avatarKey = this.state.username + '_user_avatar';
    Storage.vault.get(avatarKey)
      .then(url => this.setState({avatarUrl: url}))
      .catch(err => console.log(err));

    this.toggleEdit = this.toggleEdit.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  toggleEdit() {
    this.setState({editing: !this.state.editing});
  }

  updateContent(newValue) {
    this.setState({content: newValue });
  }

  render() {
    return(
      <div class="commentContainer">
        <div class="sidebar">
          <img class="avatar" src={this.state.avatarUrl}></img>
          <div class="likes">24 Likes</div>
        </div>
        <div class="comment">
          <div class="header"><div>{this.state.username}</div><div>{this.state.createdAt}</div></div>
          <div class="body">
              {this.state.content}
          </div>
          <div class="footer">
            <div class="vote">Like</div>
            <div class="reply">Reply</div>
            <div class="edit" onClick={this.toggleEdit}>Edit</div>
          </div>
        </div>
        <EditComment editingComment={this.state.editing} toggleEdit={this.toggleEdit}
          content={this.state.content} commentId={this.props.commentId} updateComment={this.updateContent}
          postId={this.props.postId}
        />
      </div>
    )
  }
}


export default Comment;
