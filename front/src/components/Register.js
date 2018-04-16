import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userActions } from '../actions/users.actions';
import validator from 'validator';
import xss from 'xss';
import axios from 'axios';
import inter from "../i18n";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        confirmation: '',
        picture: '/images/default_user.png',
      },
      submitted: false,
      disabled: true,
      errors: []
    }
  }

  checkValues(user) {
    for (let key in user) {
      if (user[key] === '') return true;
    }
    return false;
  }

  handleChange = e => {
    const { name, value } = e.target;
    const { user } = this.state;
    const bool = this.checkValues(user);
    this.setState({
      user: { ...user, [name]: value },
      disabled: bool
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { language } = this.props
    this.setState({ submitted: true, errors: [] });
    const { user } = this.state;
    const errors = []

    if (user.username.trim().length < 3) {
      errors.push(inter["en"].register.errUsername)
    }

    if (user.firstname.trim().length < 2) {
      errors.push(inter["en"].register.errFirstname)
    }

    if (user.lastname.trim().length < 2) {
      errors.push(inter["en"].register.errLastname)
    }

    if (user.password.length < 5) {
      errors.push(inter["en"].register.errlenghtmdp)
    }

    if (validator.isEmail(user.email) == false) {
      errors.push(inter["en"].register.errEmail)
    }

    if (user.password.match(/[a-z]/) == null) {
      errors.push(inter["en"].register.errMini)
    }

    if (user.password.match(/[A-Z]/) == null) {
      errors.push(inter["en"].register.errMaj)
    }

    if (user.password.match(/[0-9]/) == null) {
      errors.push(inter["en"].register.errNumber)
    }

    if (user.password !== user.confirmation) {
      errors.push(inter["en"].register.errConf)
    }
    if (user.picture === '') {
      errors.push(inter["en"].register.errPictureNf)
    }

    if (!errors[0]) {
      console.log("go action");
      this.props.dispatch(userActions.register(user));
    } else {
      this.setState({ errors });
    }
  }

  getBase64 = file => {
    if (!file)
      return;
    // if (btoa(atob(file)) !== file || !atob(file)) {
    // if ()
    //   const errors = []
    //   errors.push("Cette error pue du cul");
    //   this.setState({ errors })
    // }
    else {
      const { user } = this.state;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const picture = reader.result;
        if (!picture.match(/^(data:image\/)[A-Za-z0-9+/=]/)) {
          const errors = []
          errors.push("Image format not valid");
          this.setState({ errors })
        } else
          this.setState({
            ...this.state,
            user: { ...user, picture },
            errors: []
          });
      };
    };
  }

  handleUpload = e => {
    e.preventDefault();
    const file = this.uploadInput.files[0];
    this.getBase64(file);
  };

  changeImg = () => {
    $("#register_upload_img").click();
  }

  render() {
    const { user, submitted, errors } = this.state;
    const { loading, language, error } = this.props;
    error ? setTimeout(() =>
      this.props.dispatch(userActions.resetGreetings()), 3000)
      : null;
    return (
      <div className="jumbotron div-register">
        {/* <h1 className="register-title">{inter[language].register.register}</h1> */}
        <form
          onSubmit={(e) => this.handleSubmit(e, language)}
          className="register-form">
          <div className="personal-div-image">
            <div onClick={() => this.changeImg()} style={{ backgroundImage: `url("${user.picture}")` }}></div>
          </div>
          <div className="form-group input-text-register">
            {/* <label>{inter[language].register.username}</label> */}

            <input
              type="text"
              name="username"
              value={user.username}
              onChange={this.handleChange}
              placeholder="Username"
            />
            {submitted && !user.username && <p>{inter["en"].register.errUsernameNf}</p>}
          </div>
          <div className="form-group input-text-register">
            {/* <label>{inter[language].register.firstname}</label> */}
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={this.handleChange}
              placeholder="Firstname"

            />
            {submitted && !user.firstname && <p>{inter["en"].register.errFirstnameNf}</p>}
          </div>
          <div className="form-group input-text-register">
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={this.handleChange}
              placeholder="Lastname"
            />
            {submitted && !user.lastname && <p>{inter["en"].register.errLastnameNf}</p>}
          </div>
          <div className="form-group input-text-register">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={this.handleChange}
              placeholder="Email"
            />
            {submitted && !user.email && <p>{inter["en"].register.errEmailNf}</p>}
          </div>
          <div className="form-group input-text-register">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={this.handleChange}
              placeholder="Password"
            />
            {submitted && !user.password && <p>{inter["en"].register.errMdpNf}</p>}
          </div>
          <div className="form-group input-text-register">
            <input
              type="password"
              name="confirmation"
              value={user.confirmation}
              onChange={this.handleChange}
              placeholder="Confirm password"
            />
          </div>
          {submitted &&
            !user.confirmation && <p>{inter["en"].register.errConfNf}</p>}
          {this.state.error && <p>{this.state.error}</p>}

          <div className="form-group input-text-register input-img-register">
            <input
              ref={ref => {
                this.uploadInput = ref;
              }}
              type="file"
              name="picture"
              onChange={this.handleUpload}
              placeholder="Picture"
              accept="image/x-png,image/gif,image/jpeg"
              id="register_upload_img"
            />
            {submitted && !user.picture && <p>{inter["en"].register.errPictureNf}</p>}
          </div>

          <button
            className="btn register-button"
          >
            OK
          </button>
          {loading && <p>Loading...</p>}
          <Link className="register-link-login" to="/login">Login</Link>
          {
            errors ?
              errors.map((error, index) => <div key={index}>{error}</div>) :
              <div></div>
          }
          {error && <div className="alert alert-danger">{error}</div>}
        </form>
      </div>
    );
  }
}


const mapStateToProps = state => {
  const { loading, error } = state.register;
  return {
    loading,
    error,
    language: state.language.lang
  };
};

export default connect(mapStateToProps)(Register);
