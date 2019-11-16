import React from 'react';
import './css/ForumThreadList.css';
import UpvoteModal from '../components/UpvoteDownvote.js';
import { API } from "aws-amplify";
import { withRouter } from "react-router-dom";

class ForumThreadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: []
    }
  }

  viewThread(id) {
    let url = '/view/'+id;
    this.props.history.push(url);
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const allPosts = await this.getThreadList()
                              .then(this.addLikes.bind(this));
      this.setState({ threads: allPosts });

    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  getThreadList() {
    return API.get("forum", "/forum");
  }

  getPostLikes(postId) {
    const url = "/like/" + postId;
    return API.get("forum", url);
  }

  async addLikes(postList) {
    for (var index in postList) {
      const result = await this.getPostLikes(postList[index].postId);
      if(result.status) {
        postList[index].likes = result.likes;
      } else {
        postList[index].likes = 0;
      }
    }

    return postList;
  }

  render() {
    return (
      <div className="container listBackground">
        <div className="row align-items-start">
          <div className="col align-self-start">
            {this.state.threads.map(thread => (
                <div className="userThread poppy" key={thread.postId}
                onClick={()=>this.viewThread(thread.postId)}>
                  <h4 className="threadTitle">{thread.title}</h4><br/>
                  <p>{thread.content}</p><br/>
                  <h6>Created At: {new Date(thread.createdAt).toLocaleString()}</h6>
                  <h6>Created By: {thread.posterUsername}</h6><br/>
                  <UpvoteModal likes={thread.likes} postId={thread.postId}/>
                </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ForumThreadList)
