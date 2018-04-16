import React from 'react';
import inter from '../i18n';
import { connect } from 'react-redux';
import { history } from '../config/history';

class Strategy extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { head, payload, signature } = this.props.match.params
        const token = `${head}.${payload}.${signature}`;
        localStorage.setItem('jwtToken', token)
        history.push('/browse');
    }

    render() {
        const { language } = this.props;
        return (
            <div>
                <h1>Nothing to see here</h1>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.language
    }
}

export default connect(mapStateToProps)(Strategy);