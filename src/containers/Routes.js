import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import CreatePost from './create_post.js';
import ViewPost from './view_post.js';
import ForumThreadList from './forum_thread.js';
import Login from './Login.js';
import NotFound from './not_found.js';
import Signup from './Signup.js';
import UserProfile from './UserProfile.js';

class Routes extends React.Component {

render () {
  return (
    <Switch>
      <Route exact path="/"
        render={(props)=><ForumThreadList {...this.props} />}
      />
      <Route path="/login" exact
        render={(props)=><Login {...this.props} />}
      />
      <Route path="/signup" exact
        render={(props)=><Signup {...this.props} />}
      />
      <Route path="/post/create" component={CreatePost} />
      <Route path="/view/:id" component={ViewPost} />
      <Route path="/profile" component={UserProfile} />
      />
      <Route component={NotFound} />
    </Switch>
  )
}

}

export default Routes;
