import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filtersActions, moviesActions } from '../actions';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import inter from '../i18n';
import moment from 'moment'

const Range = Slider.Range;
const style = { width: 200, margin: 50 };

class Filters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            low: 0,
            high: 10,
            older: 1900,
            younger: 2018
        }
    }

    componentWillReceiveProps(nextProps) {
        const { filters } = this.props;
        filters.page++;
        if (JSON.stringify(nextProps.filters) !== JSON.stringify(filters)) {
            this.props.dispatch(moviesActions.getFilteredMovie(nextProps.filters));
        }
    }

    setSort = (id) => {
        switch (id) {
            case '1':
                return "rating";
            case '2':
                return 'year';
            case '3':
                return 'genre';
            case '4':
                return 'title';
        }
    }

    handleRangeChangeRatings = (value) => {

        this.setState({ low: value[0], high: value[1] });
        this.props.dispatch(filtersActions.setRatingsFilter({ min: value[0], max: value[1] }));
    }

    handleRangeChangePeriod = (value) => {

        this.setState({ older: value[0], younger: value[1] });
        this.props.dispatch(filtersActions.setPeriod({ min: value[0], max: value[1] }));
    }

    handleSelect = (e) => {
        const { value } = e.target;
        const { language } = this.props

        if (language !== "en") {
            const { genres } = inter[language].filters
            const { genres: english } = inter["en"].filters;
            const toArray = Object.keys(genres).map(g => genres[g]);
            const englishArray = Object.keys(english).map(g => english[g]);
            for (let i = 0; i < toArray.length; i++) {
                if (toArray[i] === value) {
                    this.props.dispatch(filtersActions.setGenreFilter(englishArray[i]));
                }
            }
        } else {
            this.props.dispatch(filtersActions.setGenreFilter(value));
        }
    }

    // this.props.dispatch(filtersActions.setRatingsFilter({min, max}));
    sortUp = (e) => {
        const { id } = e.target.parentNode.parentNode;
        const sortOrder = 1;
        const sortBy = this.setSort(id);
        this.props.dispatch(filtersActions.setSortFilter({ sortBy, sortOrder }));
        this.props.dispatch(moviesActions.resetLastPage());

    }

    sortDown = (e) => {
        const { id } = e.target.parentNode.parentNode;
        const sortOrder = -1;
        const sortBy = this.setSort(id);
        this.props.dispatch(filtersActions.setSortFilter({ sortBy, sortOrder }));
        this.props.dispatch(moviesActions.resetLastPage());
    }

    // mapObjectGenres = (inter, language) => {
    //     console.log("coucou");
    //     let rows = [];
    //     const { genres } = inter[language].filters;
    //     console.table(genres);
    //     for (let i = 0; i < genres.length; i++) {
    //         rows[i] = <option
    //             key={`id-${genres[i]}`}
    //             value={genres[i]}>{genres[i]}</option >
    //     }
    //     console.log(rows);
    //     return rows;
    // }

    render() {
        const language = this.props.language;
        const { high, low } = this.state;
        const { f_rating_min, f_rating_max } = this.props.filters;
        const now = moment().year();
        const {
            action,
            adventure,
            animation,
            biography,
            comedy,
            crime,
            documentary,
            drama,
            family,
            fantasy,
            noir,
            history,
            horror,
            music,
            musical,
            mystery,
            romance,
            sciFi,
            short,
            sport,
            superhero,
            thriller,
            war,
            western
        } = inter[language].filters.genres
        return (
            <div id="filters-div" className='filters-div filters-div-before'>
                <div className='filters row'>
                    <div id="1" className='col-3'>
                        <div className="div-sort">
                            <span>{inter[language].filters.ratings}</span>
                            <a href="#" onClick={this.sortUp}>▲</a>
                            <a href="#" onClick={this.sortDown}>▼</a>
                        </div>
                    </div>
                    <div id="2" className='col-3'>
                        <div className="div-sort">
                            <span>{inter[language].filters.year}</span>
                            <a href="#" onClick={this.sortUp}>▲</a>
                            <a href="#" onClick={this.sortDown}>▼</a>
                        </div>
                    </div>
                    <div id="3" className='col-3'>
                        <div className="div-sort">
                            <span>{inter[language].filters.genre}</span>
                            <a href="#" onClick={this.sortUp}>▲</a>
                            <a href="#" onClick={this.sortDown}>▼</a>
                        </div>
                    </div>
                    <div id="4" className='col-3'>
                        <div className="div-sort">
                            <span>{inter[language].filters.title}</span>
                            <a href="#" onClick={this.sortUp}>▲</a>
                            <a href="#" onClick={this.sortDown}>▼</a>
                        </div>
                    </div>
                </div>
                <div className="div-filters-bar">
                    <div className="filters-bar">
                        <h2>{inter[language].filters.ratings}</h2>
                        <Range
                            allowCross={false}
                            step={0.5}
                            defaultValue={[0, 10]}
                            min={0}
                            max={10}
                            onChange={this.handleRangeChangeRatings}
                        />
                        <div className="filters-bar-value-div">
                            <p style={{ color: "white" }}>{this.state.low}</p>
                            <p style={{ color: "white" }}>{this.state.high}</p>
                        </div>
                    </div>
                    <div className="filters-bar">
                        <h2>{inter[language].filters.year}</h2>
                        <Range
                            allowCross={false}
                            step={1}
                            defaultValue={[1900, 2018]}
                            min={1900}
                            max={now}
                            onChange={this.handleRangeChangePeriod}
                        />
                        <div className="filters-bar-value-div">
                            <p style={{ color: "white" }}>{this.state.older}</p>
                            <p style={{ color: "white" }}>{this.state.younger}</p>
                        </div>

                    </div>
                    <div className="genre-filter">
                        <select onChange={this.handleSelect}>
                            <option value={action}>{action}</option>
                            <option value={adventure}>{adventure}</option>
                            <option value={animation}>{animation}</option>
                            <option value={biography}>{biography}</option>
                            <option value={comedy}>{comedy}</option>
                            <option value={crime}>{crime}</option>
                            <option value={documentary}>{documentary}</option>
                            <option value={drama}>{drama}</option>
                            <option value={family}>{family}</option>
                            <option value={fantasy}>{fantasy}</option>
                            <option value={noir}>{noir}</option>
                            <option value={history}>{history}</option>
                            <option value={horror}>{horror}</option>
                            <option value={music}>{music}</option>
                            <option value={musical}>{musical}</option>
                            <option value={mystery}>{mystery}</option>
                            <option value={romance}>{romance}</option>
                            <option value={sciFi}>{sciFi}</option>
                            <option value={short}>{short}</option>
                            <option value={sport}>{sport}</option>
                            <option value={superhero}>{superhero}</option>
                            <option value={thriller}>{thriller}</option>
                            <option value={war}>{war}</option>
                            <option value={western}>{western}</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { lastPage } = state.movies;
    const { filters } = state;
    return {
        filters,
        lastPage,
        language: state.language.lang,
    }
}

export default connect(mapStateToProps)(Filters);