import React from 'react'
import Thumbnail from './Thumbnail.js'
import { connect } from 'react-redux';
import { moviesActions, filtersActions, userActions } from '../actions';
import inter from "../i18n"

class List extends React.Component {



    componentDidMount() {
        // if (this.props.moviesState.moviesList.length === 0)
        const { welcomeBack, justArrived } = this.props;
        this.props.dispatch(moviesActions.getMovies(this.props.filters));
        // this.props.dispatch(userActions.getInfoFromToken(localStorage.jwtToken));
        window.addEventListener('scroll', this.handleScroll)
        welcomeBack ?
            setTimeout(() => this.props.dispatch(userActions.resetGreetings()), 4000)
            : null;
        justArrived ?
            setTimeout(() => this.props.dispatch(userActions.resetGreetings()), 4000)
            : null;
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight
    }

    handleScroll = () => {
        const ofList = document.getElementById('list')
        if (this.isBottom(ofList) && !this.props.moviesState.lastPage && !this.props.moviesState.loading) {
            this.props.dispatch(filtersActions.nextPage(this.props.filters.page))
            this.props.dispatch(moviesActions.getMovies(this.props.filters))
        }
    }

    render() {
        const { language, justArrived, welcomeBack } = this.props
        const { moviesList: movies, error } = this.props.moviesState;

        console.log(this.props.filters);
        return (
            <div>
                {justArrived && <div className="alert alert-success">{inter[language].register.success}</div>}
                {welcomeBack && <div className="alert alert-success">{inter[language].login.success}</div>}
                <div
                    className='movie-container row justify-content-between'
                    id='list'
                    onScroll={this.handleScroll}
                >
                    {error && <div className="widget__message">
                        <p>{inter[language].filters.noResult}</p>
                    </div>}
                    {
                        movies.map((page, i) => page.length === 0 ?
                            <div key={i} className="widget__message">
                                <p>{inter[language].filters.noResult}</p>
                            </div>
                            : page.map((movie, index) => <Thumbnail
                                key={index}
                                moviePoster={movie.cover_image}
                                movieGenre={movie.genre}
                                movieYear={movie.year}
                                movieTitle={movie.title}
                                rating={movie.rating}
                                movieId={movie._id}
                                history={movie.history}
                                imdb_id={movie.imdb_id}
                                me={this.props.me}
                            />
                            ))
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { lang: language } = state.language
    return {
        language,
        moviesState: state.movies,
        filters: state.filters,
        justArrived: state.register.success,
        welcomeBack: state.login.success,
        me: state.users.session._id
    }
}

export default connect(mapStateToProps)(List);