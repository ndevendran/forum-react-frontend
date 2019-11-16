import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import EditComment from '../components/EditComment.js';
import { Storage, API } from 'aws-amplify';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      username: this.props.username,
      createdAt: new Date(this.props.createdAt).toLocaleString(),
      editing: false,
      likes: 0,
      avatarUrl: '',
    }

    const avatarKey = this.state.username + '_user_avatar';
    Storage.vault.get(avatarKey)
      .then(url => this.setState({avatarUrl: url}))
      .catch(err => console.log(err));

    this.toggleEdit = this.toggleEdit.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.likeComment = this.likeComment.bind(this);
  }

  toggleEdit() {
    this.setState({editing: !this.state.editing});
  }

  updateContent(newValue) {
    this.setState({content: newValue });
  }

  async getCommentLikes() {
    const url = "/like/" + this.props.postId + "/" + this.props.commentId;
    const result = await API.get("forum", url);
    var likes = 0;
    if(result.status) {
      likes = result.likes;
    }

    this.setState({
      likes: likes
    })
  }

  async componentDidMount() {
    this.getCommentLikes();
  }

  async likeComment() {
    let postId = this.props.postId;
    let commentId = this.props.commentId;
    let url = "/like/" + postId + "/" + commentId;
    let body = {username: this.props.currentUser, like: true}
    await API.post("forum", url, {
      body: body
    }).then(function(data) {
      if(data.status) {
        var likes = this.state.likes;
        likes++;
        this.setState({
          likes: likes
        })
      } else {
        alert("Something went wrong");
      }
    }.bind(this))
    .catch(function(error) {
      alert(error);
    });
  }


  render() {
    return(
      <div class="commentContainer">
        <div class="sidebar">
          <img class="avatar" src={this.state.avatarUrl}></img>
          <div class="likes">{this.state.likes} Likes</div>
        </div>
        <div class="comment">
          <div class="header"><div>{this.state.username}</div><div>{this.state.createdAt}</div></div>
          <div class="body">
              {this.state.content}
          </div>
          <div class="footer">
            <div class="vote" onClick={this.likeComment}>Like</div>
            <div class="reply">Reply</div>
            <div class="edit" onClick={this.toggleEdit}>Edit</div>
          </div>
        </div>
        <EditComment editingComment={this.state.editing} toggleEdit={this.toggleEdit}
          content={this.state.content} commentId={this.props.commentId} updateComment={this.updateContent}
          postId={this.props.postId} idToken={this.props.idToken}
        />
      </div>
    )
  }
}


export default Comment;
