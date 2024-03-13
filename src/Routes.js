import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Main} />
      </Switch>
    );
  }
}
