import React from 'react';
import { connect } from 'react-redux';
import { moviesActions, filtersActions } from '../actions';
import inter from "../i18n";
import { history } from '../config/history';

//Bar de Recherche :
class SearchBar extends React.Component {
    state = {
        error: ''
    }

    //Event handlers :
    handleKeyUp = (e) => {
        const search = e.target.value;
        console.log(e.target.value);
        const { jwtToken: token } = localStorage;
        if (search === "")
            token ? this.props.dispatch(filtersActions.resetFilters()) : history.push('/login');
        else if (search.length < 30 && search.match(/^[a-zA-Z0-9_ ]*$/))
            token ? this.props.dispatch(filtersActions.setTitleFilter(search)) : history.push('/login');
        //     const search = e.target.value
        //     console.log(e.target.value);
        //     console.log("SEARCH", search);
        //     if (search === "")
        //         this.props.dispatch(filtersActions.resetFilters());

        //     else {
        //         setTimeout(() => this.setState({ timeout: true }), 500)
        //         if (this.state.timeout) {
        //             this.props.dispatch(filtersActions.setTitleFilter(search)); 
        //         }
        //         // clearTimeout(timeout);
        //         // console.log("After Clear", timeout);
        //         // timeout = setTimeout(() => this.props.dispatch(filtersActions.setTitleFilter(search)), 2000);
        //         // console.log("BEFORE CLEAR", timeout)
        //     }
    }



    // handleSearch = (e) => {
    //     e.preventDefault();
    //     const { search } = this.state
    //     const { jwtToken: token } = localStorage;
    //     if (search === "")
    //         token ? this.props.dispatch(filtersActions.resetFilters()) : history.push('/login');
    //     else
    //         token ? this.props.dispatch(filtersActions.setTitleFilter(search)) : history.push('/login');
    // }

    handleClick = (e) => {
        e.preventDefault();
        if (!$("#button").hasClass('button-after')) {
            $("#filters-div").removeClass('filters-div-before');
            $("#filters-div").addClass('filters-div-after');
            $("#button").addClass('button-after');
        }
        else {
            $("#filters-div").addClass('filters-div-before');
            $("#filters-div").removeClass('filters-div-after');
            $("#button").removeClass('button-after');
        }
    }

    render() {
        console.log("RENDER");
        const language = this.props.language;
        return (
            <div>
                <form
                    className="add-option"
                    onKeyUp={this.handleKeyUp}
                >
                    <input
                        className="add-option__input"
                        type="text"
                        name="search"
                        maxLength="30"
                        placeholder={inter[language].filters.search}
                    />
                    <button
                        id="button"
                        className="button"
                        onClick={this.handleClick}
                    >▼</button>
                </form>
                {this.state.error && <p className="add-option-error">{this.state.error}</p>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.language.lang
    }
}

export default connect(mapStateToProps)(SearchBar);