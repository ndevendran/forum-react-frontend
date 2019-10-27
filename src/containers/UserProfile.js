import React, { useRef } from 'react';
import { Storage } from "aws-amplify";
import LoaderButton from "../components/LoaderButton.js"
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import config from '../config.js';
import './profile.css';
import { Auth } from 'aws-amplify';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: 'avatarUrl',
      username: this.props.username,
      isLoading: false,
      file: null
    }

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.s3Upload = this.s3Upload.bind(this);

  }

  handleFileChange(event) {
    this.state.file = event.target.files[0];
  }

  async componentDidMount() {
    await Auth.currentAuthenticatedUser()
      .then(user => this.setState({username: user.username}))
      .catch(err => console.log(err));


    const avatarKey = this.state.username + '_user_avatar';
     Storage.vault.get(avatarKey)
      .then(url => this.setState({avatar: url}))
      .catch(err => console.log(err));
  }

  async s3Upload(file) {
    console.log(file);
    const filename = this.props.username + '_user_avatar';
    const stored = await Storage.vault.put(filename, file, {
      contentType: file.type
    });

    const avatarUrl = await Storage.vault.get(stored.key)
    this.setState({avatar: avatarUrl});
    console.log(avatarUrl);
  }

  validateForm() {
    return true;
  }

  async handleSubmit() {
    const file = this.state.file;
    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SiZE/1000000} MB.`);
      return;
    }

    this.setState({isLoading: true});

    try {
      const attachment = file
        ? await this.s3Upload(file)
        : alert('Please select a file...');
        this.setState({isLoading: false});
    } catch(e) {
      alert(e);
      this.setState({isLoading: false});
    }
  }

  render() {
    return (
      <div>
        <span>{this.props.username}</span><br/>
        <img id="avatar" src={this.state.avatar}></img>
        <FormGroup controlId="file">
          <ControlLabel>Upload Avatar</ControlLabel>
          <FormControl onChange={this.handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton block type="submit" bsSize="large" bsStyle="primary"
          isLoading={this.state.isLoading}
          disabled={!this.validateForm()} onClick={this.handleSubmit}
          text="Upload Avatar" loadingText="Uploading..."
        > Upload Avatar </LoaderButton>
      </div>
    )
  }
}

export default UserProfile;
