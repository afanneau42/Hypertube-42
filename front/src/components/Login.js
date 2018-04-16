import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../actions'
import inter from "../i18n"
import axios from 'axios';
import { history } from '../config/history';
import validator from 'validator';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                password: ''
            },
            submitted: false,
            forgotten: true,
            forgotMail: '',
            errorMail: false
        }
    }

    componentWillMount() {
        console.log("hey there");
        if (!!localStorage.jwtToken) {
            history.push('/browse');
        }
    }

    componentDidMount() {
<<<<<<< HEAD
        if (document.getElementsByClassName("alert") !== undefined)
=======
        if (document.getElementsByClassName("alert")[0])
>>>>>>> 5cf215bff44dc71b45e4757d1443c9255b79d3b7
            setTimeout(() => document.getElementsByClassName("alert")[0].style.display = "none", 3000);
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        const { user } = this.state;
        this.setState({ user: { ...user, [name]: value } });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ submitted: true });
        const { user } = this.state;
        this.props.dispatch(userActions.login(user));
    }

    handleForgotten = (e) => {
        e.preventDefault();
        this.setState({ ...this.state, forgotten: false });
    }

    handleForgotMail = (e) => {
        const forgotMail = e.target.value;
        this.setState({ ...this.state, forgotMail, errorMail: false });
    }

    handleForgotSend = (e) => {
        e.preventDefault();
        this.setState({ submitted: true });
        const { forgotMail } = this.state;
        if (validator.isEmail(forgotMail) && forgotMail !== '') {
            const email = forgotMail;
            this.props.dispatch(userActions.ForgottenPassword(email));
        } else
            this.setState({ errorMail: true })
    }

    render() {
        console.log(this.props);
        console.log(this.state);
        const { lang, error, login } = this.props;
        const url = 'http://localhost:3000/api';
        const { user } = this.state;
        error ? setTimeout(() => this.props.dispatch(userActions.resetGreetings()), 4000) : null
        return (
            <div className="jumbotron div-register">
                {/* <h1 className="login-title">{inter[language].login.login}</h1> */}
                <form onSubmit={this.handleSubmit}
                    className="login-form">
                    <div className="form-group input-text-login">
                        <input
                            type="text"
                            value={user.username}
                            name="username"
                            placeholder="Username"
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="form-group input-text-login" >
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={this.handleChange}
                            placeholder="Password"
                        />
                    </div>

                    <button className="login-button">Login</button>

                    <a onClick={this.handleForgotten} href="#" className="login-forgot">Password forgotten</a>

                    <span><p>{inter["en"].login.ou}</p></span>

                    <Link className="login-link-register" to="/signup">{inter["en"].login.register}</Link>
                </form>

                <form
                    hidden={this.state.forgotten}
                    onSubmit={this.handleForgotSend}
                    className="login-form"
                >
                    <div className="form-group input-text-login">
                        <input
                            onChange={this.handleForgotMail}
                            placeholder="Your mail here"
                            value={this.state.forgotMail}
                            name="forgotMail"
                        />
                        {this.state.submitted && this.state.errorMail && <p>Your mail is not valid</p>}
                    </div>
                    <button className="login-button">Send</button>
                    {!!this.props.forgotError && <div className="alert alert-danger">{this.props.forgotError}</div>}
                    {!!this.props.forgotSuccess && <div className="alert alert-success">{this.props.forgotSuccess}</div>}

                </form>

                <div className="oAuth_section">

                    <a href="http://localhost:3000/api/auth/login/github">
                        <button className="oAuthButton"
                            id="github" onClick={this.handleStrategy}>
                            <img style={{ marginTop: "0.1em" }} width={40} height={40} src="/images/github.png" alt="github" />
                            {/* <p style={{ margin: "auto" }}>{inter[language].login.github}</p> */}
                        </button>
                    </a>

                    <a href="http://localhost:3000/api/auth/login/facebook">
                        <button className="oAuthButton"
                            id="facebook"
                            onClick={this.handleStrategy}>
                            <img style={{ marginTop: "0.1em" }} width={40} height={40} src="/images/facebook.png" alt="Facebook" />
                            {/* <p style={{ margin: "auto" }}>{inter[language].login.facebook}</p> */}
                        </button>
                    </a>

                    <a href="http://localhost:3000/api/auth/login/42">
                        <button className="oAuthButton"
                            id="42" onClick={this.handleStrategy}>
                            <img style={{ marginTop: "0.1em" }} width={40} height={40} src="/images/42.png" alt="github" />
                            {/* <p style={{ margin: "auto" }}>{inter[language].login.ecole}</p> */}
                        </button>
                    </a>
                    <a href="http://localhost:3000/api/auth/login/dropbox">
                        <button className="oAuthButton"
                            id="dropbox" onClick={this.handleStrategy}>
                            <img style={{ marginTop: "0.1em" }} width={40} height={40} src="/images/dropbox.png" alt="dropbox" />
                            {/* <p style={{ margin: "auto" }}>{inter[language].login.dropbox}</p> */}
                        </button>
                    </a>
                    <a href="http://localhost:3000/api/auth/login/linkedin">
                        <button className="oAuthButton"
                            id="linkedin" onClick={this.handleStrategy}>
                            <img style={{ marginTop: "0.1em" }} width={40} height={40} src="/images/linkedin.png" alt="linkedin" />
                            {/* <p style={{ margin: "auto" }}>{inter[language].login.linkedin}</p> */}
                        </button>
                    </a>
                </div>
                {login && <img
                    src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
                {error && <div className="alert alert-danger pop-up-danger">{inter["en"].login.error}</div>}
                {this.props.location.pathname.match(/(oAuth=false)/) && <div className="alert alert-danger">oAuth login failed..</div>}
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        login: state.login.login,
        error: state.login.error,
        lang: state.language.lang,
        forgotError: state.users.session.error,
        forgotSuccess: state.users.session.success
    }
}

export default connect(mapStateToProps)(Login)