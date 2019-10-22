import React from 'react';
import { API, Auth } from "aws-amplify";

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.state = {title: '', content: '', poster: '', isLoading: false};
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then(async user => {
      this.setState({poster: user.username});
      try {
        await this.createPost({
          title: this.state.title,
          content: this.state.content,
          posterUsername: this.state.poster
        });
        this.props.history.push("/");
      } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
      }
    }).catch(err => {
      console.log(err);
    });
  }

  createPost(userPost) {
    return  API.post("forum", "/forum", {
      body: userPost
    });
  }

  render() {
    var title = this.state.title;
    var content = this.state.content;
    return (
      <div className="form-group">
        <input type="text" className="form-control" placeholder="Title"
          onChange={this.handleTitleChange} value={this.state.title}></input>
        <textarea className="form-control" placeholder="Content" rows="3"
          onChange={this.handleContentChange} value={this.state.content}></textarea>
        <button type="submit" className="btn btn-primary"
          onClick={this.handleSubmit}>Submit</button>
      </div>
    )
  }
}

export default CreatePost;
