import React from 'react';
import ReactDOM from 'react-dom';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.state = {title: '', content: ''};
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleContentChange(e) {
    this.setState({content: e.target.value});
  }

  submitPost(title, content) {
    this.props.onClick(title, content);
    this.setState({title: '', content: ''});
  }

  render() {
    const title = this.state.title;
    const content = this.state.content;
    return (
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Title"
          onChange={this.handleTitleChange} value={this.state.title}></input>
        <textarea class="form-control" placeholder="Content" rows="3"
          onChange={this.handleContentChange} value={this.state.content}></textarea>
        <button type="submit" class="btn btn-primary"
          onClick={()=>this.submitPost(title, content)}>Submit</button>
      </div>
    )
  }
}

class Threads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: [
        {"title": "First thread", "content": "Test thread 1"}
      ]
    }
  }

  submitPost(postTitle, postContent) {
    let post = {"title": postTitle, "content": postContent};
    let threads = this.state.threads;
    threads.push(post);
    this.setState({
      threads: threads,
    })
  }

  render() {
    return (
      <div class="container">
        <div class="row align-items-start">
          <div class="col align-self-start">
            <ul class="list-group">
            {this.state.threads.map(thread => (
                <li class="list-group-item">{thread.title}</li>
            ))}
            </ul>
          </div>
        </div>
        <div class="row align-items-end">
          <div class="col">
            <CreatePost onClick={(postTitle, postContent) => this.submitPost(postTitle, postContent)}/>
          </div>
        </div>
      </div>
    );
  }
}
