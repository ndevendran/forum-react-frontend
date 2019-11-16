import React from 'react';
import { Auth, API, Storage } from 'aws-amplify';
import { Glyphicon, Row, Col, Grid, Button } from "react-bootstrap";
import Comment from '../components/Comment.js';
import EditPost from '../components/EditPost.js';
import './css/Comment.css';
import './css/ViewPost.css';
import PostComment from '../components/PostComment.js'

class ViewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      postId: this.props.match.params.id,
      userPost: {},
      likes: 0,
      avatarUrl: '',
      editing: false,
      comments: [],
      currentComment: '',
    }

    this.appendComment = this.appendComment.bind(this);
    this.listComments = this.listComments.bind(this);
    this.savePostEdits = this.savePostEdits.bind(this);
    this.toggleEditPost = this.toggleEditPost.bind(this);
    this.likePost = this.likePost.bind(this);
  }

  // Change savePostEdits into a promise chain with error handling
  // Sequence will be: checkPermissions, saveEdits, updateState, handleErrors

  checkPermissions(data) {
    if(this.state.poster === this.state.userPost.posterUsername) {
      return data;
    } else {
      throw new Error("You can only edit your own posts...");
    }
  }

  updateState(data) {
    if(!data.status) {
      throw new Error("Update Error...")
    } else {
      this.setState({
        userPost: data.post.Attributes
      });
    }

  }

  saveEdits(data) {
    const url = '/forum/' + this.state.postId;
    return API.put("forum", url, {
      body: data
    });
  }



  handleErrors(error) {
    alert(error);
  }

  savePostEdits(newTitle, newContent) {
    const body = {'content': newContent, 'title': newTitle,
                  idToken: this.state.idToken};
    var promise = new Promise(function(resolve, reject){
      resolve(body)
    });

    promise.then(this.checkPermissions.bind(this))
      .then(this.saveEdits.bind(this))
      .then(this.updateState.bind(this))
      .then(this.toggleEditPost.bind(this))
      .catch(this.handleErrors);
  }

  toggleEditPost() {
    this.setState({editing: !this.state.editing});
  }

  appendComment(comment) {
    let comments = this.state.comments;
    comments.push(comment);
    this.setState({
      comments: comments
    })
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

  async getPostLikes() {
    let postId = this.state.postId;
    let url = "/like/" + postId;
    try {
      return API.get("forum", url);
    } catch (e) {
      alert(e.message);
    }
  }

  async likePost() {
    let postId = this.state.postId;
    let url = "/like/" + postId;
    let body = {username: this.state.poster, like: true}
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

  async componentDidMount() {
    this.state.isLoading = true;
    let postId = this.state.postId;
    let apiUrl = '/forum/' + postId;

    await Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then(async user => {
      let clientId = user.pool.clientId;
      let keyPrefix = 'CognitoIdentityServiceProvider.' + clientId;
      let lastAuthUserKey = keyPrefix + '.LastAuthUser';
      let lastAuthUser = user.pool.storage[lastAuthUserKey];
      let userKeyPrefix = keyPrefix + '.' + lastAuthUser;
      let accessTokenKey = userKeyPrefix + '.accessToken';
      let idToken = user.pool.storage[userKeyPrefix + '.idToken'];
      this.setState({poster: user.username, idToken: idToken});
    });

    try {
      const userPost = await API.get('forum', apiUrl);
      const result = await this.getPostLikes();
      var postLikes = 0;
      if(result.status) {
        postLikes = result.likes;
      } else {
        postLikes = 0;
      }
      const myComments = await this.listComments();
      const avatarKey = userPost.posterUsername + '_user_avatar';
      Storage.vault.get(avatarKey)
        .then(url => this.setState({avatarUrl: url}))
        .catch(err => console.log(err));
      this.setState({
        userPost: userPost,
        comments: myComments,
        likes: postLikes,
        isLoading: false
      });
    } catch(e) {
      alert(e);
    }
  }

  render() {
    if(this.state.isLoading) {
      return (
          <div className="loadingPost">
                <Glyphicon glyph="refresh" className="spinning" />
          </div>
      )
    } else {
      return (
          <div className="row">
            <div className="col">
            <div class="postContainer">
              <div class="sidebar">
                <img class="avatar" src={this.state.avatarUrl}></img>
                <div class="likes">{this.state.likes} Likes</div>
              </div>
              <div class="innerContainer">
                <div class="postedBy">Posted by {this.state.userPost.posterUsername} {new Date(this.state.userPost.createdAt).toLocaleString()}</div>
                <div class="header">{this.state.userPost.title}</div>
                <div class="body">
                  {this.state.userPost.content}
                </div>
                <div class="footer">
                  <div onClick={this.likePost}>Like</div><div>Reply</div><div onClick={this.toggleEditPost}>Edit</div><div>Delete</div><div>Report</div>
                </div>
              </div>
            </div>
              <div>
                <EditPost content={this.state.userPost.content}
                  postTitle={this.state.userPost.title}
                  saveEdits={this.savePostEdits}
                  isEditing={this.state.editing}
                  toggleEditPost={this.toggleEditPost}
                  />
              </div>
              <div>
                <PostComment poster={this.state.poster} postId={this.state.postId}
                  appendComment={this.appendComment}
                />
              </div>
              <div className="commentListGrid">
                  {this.state.comments.map(
                    (comment,i) => {
                      return <Comment key={comment.commentId} createdAt={comment.createdAt}
                              username={comment.username} content={comment.content}
                              postId={this.state.postId} commentId={comment.commentId}
                              idToken={this.state.idToken} currentUser={this.state.poster}
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
