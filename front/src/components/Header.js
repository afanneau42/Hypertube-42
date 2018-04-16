import React from "react";
import { NavLink } from "react-router-dom";
import { setLanguage, getVersion } from "../actions/language.actions";
import { connect } from "react-redux";
import inter from "../i18n";
import { filtersActions, userActions, moviesActions } from "../actions";
import { history } from "../config/history";
import KonamiCode from "konami-code";
var konami = new KonamiCode();

class Header extends React.Component {

    state = {
        konami: false
    };

    componentDidUpdate() {
        const { jwtToken: token } = localStorage;
        token ? this.props.dispatch(userActions.getInfoFromToken(token)) : console.log("NOT DONE");
    }

    konamiFunc = () => {
        konami.listen(() => {
            this.setState({
                konami: true
            })
        });
    }

    handleRoot = () => {
        console.log("HANDLE ROOOOOOOT")
        this.props.dispatch(moviesActions.emptyMoviesList());
        this.props.dispatch(filtersActions.resetFilters());
    };

    handleLogout = () => {
        this.props.dispatch(userActions.logout());
        this.setState({});
        localStorage.clear();
        history.push('/login');
    }

    componentDidMount() {
        this.konamiFunc();
    }

    render() {
        console.log("RENDER");
        const language = this.props.language;

        return (
            <div className="header row px-5">
                <div className="col-lg-1"></div>
                <div className="title_div col-7 col-md-3 col-lg-3">
                    <NavLink onClick={this.handleRoot} className="navlink" to='/browse'>
                        <h1 className="header__title">Hypertube</h1>
                    </NavLink>
                </div>
                <div className="col-5 col-md-3 col-lg-7 d-flex">
                    <div className="header_right ml-auto">
                        {
                            localStorage.jwtToken ?
                                <div>
                                    <NavLink className="left mt-auto header_login" to="/personal">
                                        <h2>{inter[language].header.profilPage}</h2>
                                    </NavLink>
                                    <a href="#" onClick={this.handleLogout}>{inter[language].header.logout}</a>
                                </div>
                                : <NavLink className="left mt-auto header_login" to="/">
                                    <h2>{inter[language].header.login}</h2>
                                </NavLink>

                        }
                    </div>
                </div>
                <div className="col-lg-1"></div>
                {
                    this.state.konami ?

                        <div className="konami_div">
                            <img src="/images/afanneau_smile.jpg" alt="afanneau_smile" />
                            <img src="/images/nterol_smile.jpg" alt="nterol_smile" />
                            <img src="/images/adaviere_smile.jpg" alt="adaviere_smile" />
                            <img src="/images/rrouis_smile.jpg" alt="rrouis_smile" />
                        </div>

                        :
                        <div />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        movies: state.movies,
        language: state.language.lang,
    };
};

export default connect(mapStateToProps)(Header);
