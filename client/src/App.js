import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import store from "./store";
import { logoutUser, setCurrentUser } from "./actions/authAction";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import { clearCurrentProfile } from "./actions/profileActions";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/profile/CreateProfile";
import AddExperience from "./components/info/AddExperience";
import AddEducation from "./components/info/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import ProfileNotFound from "./components/profile/ProfileNotFound";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

if (localStorage.getItem("jwtToken")) {
  setAuthToken(localStorage.getItem("jwtToken"));
  const decoded = jwt_decode(localStorage.getItem("jwtToken"));
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Route exact path="/not-found" component={ProfileNotFound} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <PrivateRoute exact path="/feed" component={Posts} />
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
