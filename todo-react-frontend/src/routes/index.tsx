import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../pages/Tasks';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Header from '../components/common/Header';

const Routes = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <ProtectedRoute path="/tasks" component={Tasks} />
                <Route path="/" exact component={Login} />
            </Switch>
        </Router>
    );
};

export default Routes;