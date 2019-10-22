import React from 'react';
import './utilityBelt.css';
import { Glyphicon } from 'react-bootstrap';

class UtilityBelt extends React.Component {
  render() {
    return (
      <div className="belt">
        <Glyphicon glyph="pencil" onClick={this.props.functions.edit} />
        <Glyphicon glyph="fire" />
        <Glyphicon glyph="trash" />
      </div>
    )
  }
}

export default UtilityBelt;
