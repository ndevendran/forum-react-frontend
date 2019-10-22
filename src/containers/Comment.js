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
      <div className="comment col align-self-start">
        <div className="avatarLocation">
          <h6>said at {this.state.createdAt}</h6>
        </div>
        <div className="theMeat">
          <h5>{this.state.username} says</h5>
          <p>{this.state.content}</p>
          <UtilityBelt functions={this.props.functions} />
        </div>
        <div className="commentScore"></div>
      </div>
    )
  }
}


export default Comment;
