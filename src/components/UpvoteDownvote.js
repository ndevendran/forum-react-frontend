import React from 'react';
import { Glyphicon } from 'react-bootstrap';


class UpvoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: this.props.likes,
    };
  }
  render() {
    return(
      <React.Fragment>
      <Glyphicon glyph="plus-sign" />
      <div className="postLikes">{this.state.likes}</div>
      <Glyphicon glyph="minus-sign" />
      </React.Fragment>
    );
  }
}

export default UpvoteModal;
