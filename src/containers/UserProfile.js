import React, { useRef } from 'react';
import { Storage } from "aws-amplify";
import LoaderButton from "../components/LoaderButton.js"
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import config from '../config.js';
import './profile.css';
import { Auth , API } from 'aws-amplify';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: 'avatarUrl',
      username: this.props.username,
      isLoading: false,
      file: null,
      fileData: null,
    }

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.s3Upload = this.s3Upload.bind(this);

  }

  handleFileChange(event) {
    this.state.file = event.target.files[0];
  }

  async componentDidMount() {
    var idToken;

    await Auth.currentAuthenticatedUser()
      .then(user => this.setState({username: user.username}))
      .catch(err => console.log(err));

    // await Auth.currentAuthenticatedUser()
    //   .then(function(user) {
    //     let clientId = user.pool.clientId;
    //     let keyPrefix = 'CognitoIdentityServiceProvider.' + clientId;
    //     let lastAuthUserKey = keyPrefix + '.LastAuthUser';
    //     let lastAuthUser = user.storage[lastAuthUserKey];
    //     let userKeyPrefix = keyPrefix + '.' + lastAuthUser;
    //     let accessTokenKey = userKeyPrefix + '.accessToken';
    //     idToken = user.storage[userKeyPrefix + '.idToken'];
    //     let accessToken = user.storage[accessTokenKey];
    //   })
    //   .catch(err => console.log(err));
    //
    //   this.setState({idToken: idToken});

    const avatarKey = this.state.username + '_user_avatar';
     Storage.vault.get(avatarKey)
      .then(url => this.setState({avatar: url}))
      .catch(err => console.log(err));
  }

  async s3Upload(file) {
    const filename = this.state.username + '_user_avatar';
    const stored = await Storage.vault.put(filename, file, {
      contentType: file.type
    });

    const avatarUrl = await Storage.vault.get(stored.key)
    this.setState({avatar: avatarUrl});
  }

  // async s3Upload(file) {
  //   try {
  //     var promise = new Promise(function(resolve, reject) {
  //       var reader = new FileReader();
  //       var fileData;
  //       reader.onload = function(event) {
  //         resolve(reader.result);
  //       }
  //       reader.onerror = error => reject(error);
  //
  //       reader.readAsDataURL(file);
  //     });
  //
  //     var that = this;
  //     await promise.then(async function(fileData) {
  //       if(fileData) {
  //         let buffer = new Buffer(fileData, 'base64');
  //         that.setState({fileData: fileData})
  //         const response = API.post("forum", '/avatar/upload', {
  //           body: {file: fileData, idToken: that.state.idToken}
  //         });
  //         const storeKey = response['storeKey'];
  //         const avatarUrl = await Storage.vault.get(storeKey);
  //         that.setState({avatar: avatarUrl});
  //       } else {
  //         console.log("Why is it losing scope?: " + fileData);
  //       }
  //     }, function(error) {
  //       console.log("An error occurred: " + error);
  //     });
  //
  //
  //     // const storeKey = await API.post("forum", '/avatar/upload', {
  //     //   body: {file: this.state.file}
  //     // });
  //
  //     //const avatarUrl = await Storage.vault.get(storeKey);
  //     //this.setState({avatar: avatarUrl});
  //
  //   } catch (err) {
  //     alert("An error occurred :" + err);
  //   }
  // }

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
        <span>{this.state.username}</span><br/>
        <img id="avatar" src={this.state.avatar}></img>
        <FormGroup controlId="file">
          <ControlLabel>Avatar</ControlLabel>
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
