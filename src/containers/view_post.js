import React from 'react';
import { Auth, API, Storage } from 'aws-amplify';
import { Glyphicon, Row, Col, Grid, Button } from "react-bootstrap";
import Comment from './Comment.js';
import EditPost from './EditPost.js';
import './Comment.css';

class ViewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: this.props.match.params.id,
      userPost: {},
      comments: [],
      currentComment: '',
      isLoading: false,
      editing: false,
      commentFunctions: {
        'edit': this.editComment
      },
      postFunctions: {
        'edit': this.toggleEditPost
      },
      avatarUrl: '',
    }

    this.postComment = this.postComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.listComments = this.listComments.bind(this);
    this.addComment = this.addComment.bind(this);
    this.saveEdits = this.saveEdits.bind(this);
    this.editComment = this.editComment.bind(this);
    this.toggleEditPost = this.toggleEditPost.bind(this);
  }

  saveEdits(newTitle, newContent) {
    const body = {'content': newContent, 'title': newTitle};
    const url = '/forum/' + this.state.postId;
    try {
      API.put("forum", url, {
        body: body
      });
      this.setState({
        userPost: {'content': newContent, 'title': newTitle}
      });
      return true;
    } catch (e) {
      alert(e.message);
      return false;
    }
  }

  toggleEditPost() {
    this.setState({editing: !this.state.editing});
  }

  toggleEditComment() {
    this.setState({editingComment: !this.state.editingComment});
  }

  editComment() {
    alert('To be done');
  }

  addComment(body) {
    let postId = this.state.postId;
    let url = "/comment/" + postId;
    try {
      return API.post("forum", url, {
        body: body
      });
    } catch (e) {
      alert(e.message);
    }
  }

  async postComment() {
    let userPost = this.state.userPost;
    let comments = this.state.comments;
    let userComment = {"content": this.state.currentComment, "username": this.state.poster }

    const newComment = await this.addComment(userComment);
    comments.push(newComment);
    this.setState({
      currentComment: '',
      userPost: userPost,
      comments: comments,
    });
  }

  async listComments() {
    let postId = this.state.postId;
    let url = "/comment/" + this.state.postId;
    try {
      return API.get("forum", url);
    } catch (e) {
      alert(e.message);
    }
  }

  async componentDidMount() {
    this.state.isLoading = true;
    let postId = this.state.postId;
    let apiUrl = '/forum/' + postId;

    await Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then(async user => {
      this.setState({poster: user.username});
    });

    try {
      const userPost = await API.get('forum', apiUrl);
      const myComments = await this.listComments();
      const avatarKey = userPost.posterUsername + '_user_avatar';
      Storage.vault.get(avatarKey)
        .then(url => this.setState({avatarUrl: url}))
        .catch(err => console.log(err));
      this.setState({
        userPost: userPost,
        comments: myComments,
        isLoading: false
      });
    } catch(e) {
      alert(e);
    }
  }

  updateComment(e) {
    this.setState({
      currentComment: e.target.value,
    })
  }

  render() {
    if(this.state.isLoading) {
      return (
          <div className="loadingPost">
            <div className="innerLoader">
              <h1 className="inline">Loading...</h1>
              <div className="spinner">
                <Glyphicon glyph="refresh" className="spinning" />
              </div>
            </div>
          </div>
      )
    } else {
      return (
          <div className="row">
            <div className="col">
            <div class="postContainer">
              <div class="sidebar">
                <img class="avatar" src={this.state.avatarUrl}></img>
                <div class="likes">24 Likes</div>
              </div>
              <div class="innerContainer">
                <div class="postedBy">Posted by {this.state.poster} {new Date(this.state.userPost.createdAt).toLocaleString()}</div>
                <div class="header">{this.state.userPost.title}</div>
                <div class="body">
                  {this.state.userPost.content}
                </div>
                <div class="footer">
                  <div>Like</div><div>Reply</div><div onClick={this.toggleEditPost}>Edit</div><div>Delete</div><div>Report</div>
                </div>
              </div>
            </div>
              <div>
                <EditPost content={this.state.userPost.content}
                  postTitle={this.state.userPost.title}
                  saveEdits={this.saveEdits}
                  isEditing={this.state.editing}
                  toggleEditPost={this.toggleEditPost}
                  />
              </div>
              <textarea value={this.state.currentComment} onChange={this.updateComment} className="form-control" rows="5"></textarea>
              <button type="button" onClick={()=>this.postComment()} className="btn btn-primary">Post Comment</button>
              <div className="commentListGrid">
                  {this.state.comments.map(
                    (comment,i) => {
                      return <Comment key={comment.commentId} createdAt={comment.createdAt}
                              username={comment.username} content={comment.content}
                              functions={this.state.commentFunctions} postId={this.state.postId}
                              commentId={comment.commentId}
                              />;
                    }
                )}
              </div>
            </div>
          </div>
      )
    }

  }
}

export default ViewPost
