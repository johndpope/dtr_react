/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginPage from 'containers/LoginPage/Loadable';
import HomePage from 'containers/HomePage/Loadable';

import NotFoundPage from 'containers/NotFoundPage/Loadable';

import PrivateRoute from '../../hoc/PrivateRoute';
import PublicRoute from '../../hoc/PublicRoute';

import GlobalStyle from '../../global-styles';


export default function App() {
  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/home" component={HomePage} />
        <PublicRoute exact path="/" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
