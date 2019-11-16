import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, Grid, Row, Col } from "react-bootstrap";
import './index.css';
import { Auth } from "aws-amplify";

import './ForumComponents.js';
import Routes from './containers/Routes.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      username: '',
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    var idToken = null;

    await Auth.currentAuthenticatedUser()
      .then(function(user) {
        //console.log(user);
        let clientId = user.pool.clientId;
        let keyPrefix = 'CognitoIdentityServiceProvider.' + clientId;
        let lastAuthUserKey = keyPrefix + '.LastAuthUser';
        let lastAuthUser = user.pool.storage[lastAuthUserKey];
        let userKeyPrefix = keyPrefix + '.' + lastAuthUser;
        let accessTokenKey = userKeyPrefix + '.accessToken';
        idToken = user.pool.storage[userKeyPrefix + '.idToken'];
        let accessToken = user.pool.storage[accessTokenKey];
      })
      .catch(err => console.log(err));

      this.setState({idToken: idToken});

    this.setState({ isAuthenticating: false });
  }

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);
    this.props.history.push('/login');
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      idToken: this.state.idToken
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App">
      <Grid>
        <Row>
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>
              <Link to="/">Home</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
                <NavItem>
                  <Link to="/post/create">Create Post</Link>
                </NavItem>
                <NavItem>
                  <Link to="/profile">Profile</Link>
                </NavItem>
            </Nav>
            <Nav pullRight>
              {this.state.isAuthenticated
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <NavItem>
                    <Link to="/login">Login</Link>
                  </NavItem>
                  <NavItem>
                    <Link to="/signup">Sign Up</Link>
                  </NavItem>
                </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        </Row>
        <div>
        <Routes {...childProps}/>
        </div>
      </Grid>
      </div>
    );
  }
}

export default withRouter(App);
