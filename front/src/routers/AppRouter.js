import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Login from '../components/Login';
import Hypertube from '../components/Hypertube';
import Register from '../components/Register';
import Item from '../components/Item';
import Profil from '../components/Profil';
import Personal from '../components/Personal';
import About from '../components/About';
import NotFound from '../components/NotFound';
import Strategy from '../components/Strategy';
import { history } from '../config/history';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('jwtToken') ? (<Component {...props} />)
            : (
                <Redirect to={{
                    pathname: "/login",
                    state: { from: props.location }
                }} />
            )
    )}
    />
)

const AppRouter = () => (
    <Router history={history}>
        <div>
            <Header />
            <div className='row'>
                <div className='col-xl-3 col-lg-2 col-0'></div>
                <div className='col-xl-6 col-lg-8 col-12'>
                    <Switch>
                        <Redirect from="/" exact to={`/${localStorage.jwtToken ? "browse" : "login"}`} />
                        {/* <Redirect from="*" exact to="/404" /> */}
                        <Route path="/login" component={Login} />
                        <Route path='/signup' component={Register} />
                        {/* <Route component={NotFound} /> */}
                        <Route path="/strategy/:head/:payload/:signature" component={Strategy} />
                        <AuthenticatedRoute path="/browse" component={Hypertube} />
                        <AuthenticatedRoute path="/movie/:id" component={Item} />
                        <AuthenticatedRoute path="/user/:id" component={Profil} />
                        <AuthenticatedRoute path="/personal" component={Personal} />

                    </Switch>
                </div>
                <div className='col-xl-3 col-lg-2 col-0'></div>
            </div>
        </div>
    </Router>
);

export default AppRouter;