import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import UtilityBelt from '../components/utilityBelt.js';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      username: this.props.username,
      createdAt: new Date(this.props.createdAt).toLocaleString()
    }
  }

  render() {
    return(
      <div class="commentContainer">
        <div class="sidebar">
          <img class="avatar" src={require('./avatar_test_01.jpg')}></img>
          <div class="likes">24 Likes</div>
        </div>
        <div class="comment">
          <div class="header"><div>{this.state.username}</div><div>{this.state.createdAt}</div></div>
          <div class="body">
              {this.state.content}
          </div>
          <div class="footer">
            <div class="vote">Like</div><div class="reply">Reply</div><div class="edit">Edit</div>
          </div>
        </div>
      </div>
    )
  }
}


export default Comment;
