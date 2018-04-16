import React from 'react'
import { connect } from 'react-redux';
import { userActions } from '../actions'



class Profil extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(userActions.getInfoById(this.props.match.params.id));
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        console.log(this.props)
        let { username, firstname, lastname, picture } = this.props;
        picture ? null : picture = '/images/default_user.png';
        return (
            <div className="div-profil">
                <div style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    lineHeight: "90px"
                }} >
                    <h1 className="profil-username">{this.props.username}</h1>
                </div>
                <div className="profil-div-image">
                    <div style={{ backgroundImage: `url("${picture}")` }}></div>
                    <div className="profil-info-div">
                        <p className="profil-info">{firstname}</p>
                        <p className="profil-info">{lastname}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { username, firstname = "null", lastname = "null", picture = "/images/default_user.png" } = state.users.items;
    return {
        username,
        firstname,
        lastname,
        picture,
    }
}

export default connect(mapStateToProps)(Profil)