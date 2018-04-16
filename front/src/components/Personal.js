import React from 'react';
import { connect } from 'react-redux';
import { userActions, languageActions } from '../actions';
import { userConstants } from '../constantes/index';
import validator from 'validator';
import inter from "../i18n";
import { getVersion } from '../actions/language.actions';

class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: {

            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            _id,
            username,
            firstname,
            lastname,
            email,
            picture,
            language } = nextProps.session;

        this.setState({
            edit: {
                _id: _id,
                username: username ? username : "",
                firstname: firstname ? firstname : "",
                lastname: lastname ? lastname : "",
                email: email ? email : "",
                password: "",
                confirmation: "",
                picture: picture ? picture : "/images/default_user.png",
                subtitlesLanguage: language ? language : "en",
            }
        });
        console.log("get session", nextProps.session);
    }

    componentWillMount() {
        this.props.dispatch(userActions.getInfoFromToken(localStorage.jwtToken));
    }

    handleSubmit = (e, language) => {
        // handle submit
        e.preventDefault(e);
        this.setState({ submitted: true });
        const user = this.state.edit;
        const errors = []
        if (user.username && user.username.trim().length < 3 && this.props.session.username != user.username) {
            errors.push(inter[language].register.errUsername)
        }
        if (user.username && user.username.length > 10) {
            errors.push(inter[language].register.tooLongueUsername)
        }

        if (user.firstname && user.firstname.trim().length < 2 && this.props.session.firstname != user.firstname) {
            errors.push(inter[language].register.errFirstname)
        }
        if (user.firstname && user.firstname.length > 10) {
            errors.push(inter[language].register.tooLongueFirstname)
        }

        if (user.lastname && user.lastname.trim().length < 2 && this.props.session.lastname != user.lastname) {
            errors.push(inter[language].register.errLastname)
        }
        if (user.lastname && user.lastname.length > 10) {
            errors.push(inter[language].register.tooLongueLastname)
        }
        if (user.password && user.password.length < 5 && user.password.length != 0) {
            errors.push(inter[language].register.errlenghtmdp)
        }
        if (validator.isEmail(user.email) == false) {
            errors.push(inter[language].register.errEmail)
        }
        if (user.password && user.password.match(/[a-z]/) == null && user.password.length != 0) {
            errors.push(inter[language].register.errMini)
        }
        if (user.password && user.password.match(/[A-Z]/) == null && user.password.length != 0) {
            errors.push(inter[language].register.errMaj)
        }
        if (user.password && user.password.match(/[0-9]/) == null && user.password.length != 0) {
            errors.push(inter[language].register.errNumber)
        }
        if (user.password !== user.confirmation) {
            errors.push(inter[language].register.errConf)
        }
        if (errors.length) {
            this.setState({ errors });
            return;
        }
        else
            this.setState({ errors: [] })

        const toUpdateUser = {}
        if (this.props.session.username != user.username)
            toUpdateUser.username = user.username;
        if (this.props.session.firstname != user.firstname)
            toUpdateUser.firstname = user.firstname;
        if (this.props.session.lastname != user.lastname)
            toUpdateUser.lastname = user.lastname;
        if (this.props.session.email != user.email)
            toUpdateUser.email = user.email;
        if (user.password.length != 0)
            toUpdateUser.password = user.password;
        if (user.picture !== undefined && this.props.picture !== user.picture)
            toUpdateUser.picture = user.picture;
        toUpdateUser.language = user.subtitlesLanguage


        if (errors.length === 0) {
            console.table(toUpdateUser);
            this.props.dispatch(userActions.updateUserInfos(user._id, toUpdateUser));
        }
    }


    handleChange = (e) => {
        const { name, value } = e.target;
        const { edit } = this.state;
        this.setState({ edit: { ...edit, [name]: value } })
    }
    getBase64 = file => {
        if (!file)
            return;

        const { edit } = this.state;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const picture = reader.result;
            if (!picture.match(/^(data:image\/)[A-Za-z0-9+/=]/)) {
                const errors = []
                errors.push("Image format not valid");
                this.setState({
                    ...this.state,
                    errors
                })
            } else
                this.setState({ edit: { ...edit, picture: picture }, errors: [] });
        };
    };

    handleUpload = e => {
        e.preventDefault();
        const file = this.uploadInput.files[0];
        // if(file.type == ""){
        //     errors.push(inter["fr"].register.tooLongueFirstname)
        // }
        console.log(file);
        this.getBase64(file);


    };

    setLang = lang => {
        const { edit } = this.state;
        this.setState({ edit: { ...edit, subtitlesLanguage: lang } })
    }

    changeImg = () => {
        $("#personal_upload_img").click();
    }

    render() {
        const { language, session } = this.props;
        const { provider } = session;
        const { _id, username, firstname, lastname, email, picture, subtitlesLanguage, password, confirmation } = this.state.edit;

        return (
            <div className="div-personal">
                <div style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    lineHeight: "90px"
                }} >
                    <h1 className="personal-username" >{username}</h1>
                </div>
                <div className="personal-div-image">
                    <div onClick={() => this.changeImg()} style={{ backgroundImage: `url("${picture}")` }}></div>
                </div>
                <div className="">

                    {_id ?
                        <form className="editMail personal-form" onSubmit={(e) => this.handleSubmit(e, language)}>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    style={{ fontSize: "16px" }}
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => this.handleChange(e)}
                                    placeholder='Email'
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    style={{ fontSize: "16px" }}
                                    type="text"
                                    name="firstname"
                                    value={firstname}
                                    onChange={this.handleChange}
                                    placeholder={inter[language].register.firstname}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    style={{ fontSize: "16px" }}
                                    type="text"
                                    name="lastname"
                                    value={lastname}
                                    onChange={this.handleChange}
                                    placeholder={inter[language].register.lastname}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    style={{ fontSize: "16px" }}
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={this.handleChange}
                                    placeholder={inter[language].register.username}
                                />
                            </div>

                            {provider === 'local' &&
                                <div>
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={this.handleChange}
                                            placeholder={inter[language].register.password}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="confirmation"
                                            value={confirmation}
                                            onChange={this.handleChange}
                                            placeholder={inter[language].register.confir}
                                        />
                                    </div>
                                </div>}

                            <div className="div-language-flags">
                                <img className={subtitlesLanguage === 'fr' ? 'flag_active' : 'flag_inactive'} src='/images/fr.png' onClick={() => { this.setLang('fr') }} />
                                <img className={subtitlesLanguage === 'en' ? 'flag_active' : 'flag_inactive'} src='/images/en.png' onClick={() => { this.setLang('en') }} />
                                <img className={subtitlesLanguage === 'es' ? 'flag_active' : 'flag_inactive'} src='/images/es.png' onClick={() => { this.setLang('es') }} />
                                <img className={subtitlesLanguage === 'de' ? 'flag_active' : 'flag_inactive'} src='/images/de.png' onClick={() => { this.setLang('de') }} />
                            </div>

                            <div className="form-group personal-input-language" >
                                <input
                                    ref={ref => {
                                        this.uploadInput = ref;
                                    }}
                                    type="file"
                                    name="picture"
                                    onChange={this.handleUpload}
                                    accept="image/x-png,image/gif,image/jpeg"
                                    id='personal_upload_img'
                                />
                            </div>
                            <button className="personal-button" style={{ width: "150px", fontSize: "16px", textAlign: "center" }}>Save</button>
                        </form>
                        : <div />
                    }
                    {
                        this.state.errors ?
                            this.state.errors.map((error, index) => <div className="personal-error" key={index}>{error}</div>) :
                            <div></div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { session } = state.users;
    return {
        session,
        language: state.language.lang
    }
}

export default connect(mapStateToProps)(Personal)