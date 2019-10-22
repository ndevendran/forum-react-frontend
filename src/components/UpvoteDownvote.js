import React from 'react';
import { Glyphicon } from 'react-bootstrap';


class UpvoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upvotes: 100,
    };
  }
  render() {
    return(
      <React.Fragment>
      <Glyphicon glyph="plus-sign" />
      <Glyphicon glyph="minus-sign" />
      </React.Fragment>
    );
  }
}

export default UpvoteModal;
