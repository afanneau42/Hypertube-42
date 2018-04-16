import React, { Component } from "react";
import config from '../config/config';
import { connect } from "react-redux";
import { moviesActions, userActions, commentActions } from "../actions";
import { getVersion, resetTranslation } from '../actions/language.actions'
import { getFrenchVersion } from "../actions/language.actions";
import inter from "../i18n";
import VideoPlayer from './VideoPlayer';
import Comment from './Comment';
import moment from 'moment';
import axios from 'axios';
import { history } from '../config/history';


class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            watchMovieClicked: false,
            quality: '',
            badge: '',
            commentError: '',
            sp_subs: false,
            en_subs: false,
            fr_subs: false,
            ge_subs: false
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        const { lang, translated } = nextProps.language;
        const { synopsis, genre, history } = nextProps.movie;
        const { synopsis: oldS, genre: oldG } = this.props.movie;
        const a = oldG !== undefined && oldS !== undefined ? true : false;
        const b = oldG === genre && oldS === synopsis ? true : false;

        const { seeds } = nextProps.movie.torrents !== undefined ? nextProps.movie.torrents[0] : 0;
        if (history !== undefined)
            this.setState({ ...this.state, views: history.length });
        if (this.state.badge === '' && nextProps.movie.torrents !== undefined) {
            console.log("SEEDS", seeds)
            this.whatBadge({ seeds })
        }
        if (lang !== 'en' && !translated && a && b) {
            this.props.dispatch(getVersion(lang, { synopsis, genre }));
        }
        if (seeds && seeds > 200 && nextProps.movie.imdb_id != undefined && this.state.en_subs === false) {
            console.log("COUCOU IMnextProps.DB", nextProps.movie.imdb_id)
            const url = `${config.connectUrl}/api/video/subtitles?movie_id=${this.props.match.params.id}&imdb_id=${nextProps.movie.imdb_id}&lang=`;
            axios.get(url + 'ge').then((res) => {

                if (res.data === 'OK' && this._ismounted)
                    this.state.ge_subs !== undefined ? this.setState({ ...this.state, ge_subs: true }) : 0;
            }).catch()
            axios.get(url + 'sp').then((res) => {

                if (res.data === 'OK' && this._ismounted)
                    this.state.sp_subs !== undefined ? this.setState({ ...this.state, sp_subs: true }) : 0;

                // this.setState({...this.state, sp_subs: true})
            }).catch(e => console.log("ERREUR"))
            axios.get(url + 'en').then((res) => {
                console.log('en', res)
                if (res.data === 'OK' && this._ismounted)
                    this.state.en_subs !== undefined ? this.setState({ ...this.state, en_subs: true }) : 0;

                // this.setState({...this.state, en_subs: true})
            }).catch()
            axios.get(url + 'fr').then((res) => {
                console.log('fr', res)
                if (res.data === 'OK' && this._ismounted)
                    this.state.fr_subs !== undefined ? this.setState({ ...this.state, fr_subs: true }) : 0;

                // this.setState({...this.state, fr_subs: true})
            }).catch()
        }
    }

    componentWillMount() {
        const { id: movie_id } = this.props.match.params;
        // this.props.dispatch(userActions.getInfoFromToken(localStorage.jwtToken));
        this.props.dispatch(moviesActions.getMovieById(movie_id));
        this.props.dispatch(commentActions.getCommentsByMovie(movie_id))

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
        this.props.dispatch(moviesActions.emptyMoviesById());
        this.props.dispatch(resetTranslation());
        // this.props.dispatch(commentActions.resetComments());
    }

    handlePostCom = e => {
        e.preventDefault();
        const { username, picture } = this.props.session;
        console.log("profil data", username, picture);
        if (this.state.comment !== '' && this.state.comment.length > 2) {
            this.props.dispatch(commentActions.postComment({
                movie_id: this.props.match.params.id,
                author_id: this.props.session._id,
                comment: this.state.comment,
                username,
                picture
            }))
            this.setState({ ...this.state, comment: '' })
        }
    }

    whatBadge = ({ seeds = 0 }) => {
        const { lang } = this.props.language;
        if (seeds >= 0 && seeds <= 200)
            this.setState({ quality: inter[lang].itemPage.slow, badge: 'danger' });
        else if (seeds > 200 && seeds <= 500)
            this.setState({ quality: inter[lang].itemPage.average, badge: 'warning' })
        else if (seeds > 500)
            this.setState({ quality: inter[lang].itemPage.fast, badge: 'success' });
        else if (seeds > 1000)
            this.setState({ ...this.state, quality: inter[lang].itemPage.veryFast, badge: 'primary' })
    }

    watchMovie = e => {
        e.preventDefault();
        this.setState({
            ...this.state,
            views: this.state.views + 1,
            watchMovieClicked: true,
        })
        const options = {
            method: 'PUT',
            url: `${config.connectUrl}/api/movies/history`,
            headers: { 'x-access-token': localStorage.jwtToken },
            params: { movie_id: this.props.match.params.id }
        }
        axios(options)
            .then((ret) => {
                console.log("watch movie Axios", ret);
            })
    }

    handleChangeCom = (e) => {
        const { name, value } = e.target;
        console.log(value.length)
        if (value.length < 250)
            this.setState({ [name]: value, commentError: '' })
        else
            this.setState({ commentError: inter[this.props.language].itemPage.comError })
    }

    render() {
        const { comment, views } = this.state;
        const { movie, language, poster, comments, loading } = this.props;
        const { lang } = language;
        const { content, posted, error } = comments;
        const videoJsOptions = {
            autoplay: true,
            controls: true,
            height: 267,
            width: 640,
            poster: false,
            'data-setup': '{"aspectRatio":"640:267"}',
            sources: [{
                src: `${config.connectUrl}/api/video?id=${this.props.match.params.id}`,
                type: 'video/mp4'
            }]
        }

        return (
            < div className="item" >
                {/* {loading ? <div class="loader"></div> : */}
                <div>
                    <div className="row title_div d-flex p-4">
                        {/* <div className=" mb-4"> */}
                        <div className="title_and_year">
                            <div className="movie_title_div">
                                <span className="movie_title">{movie.title}</span>
                                {/* </div>                   */}
                                {/* <div className="movie_year_div"> */}
                                <span className="movie_year pl-3">({movie.year})</span>
                            </div>
                        </div>
                        <div className="movie_rating pr-3">
                            <span className="star movie_rating">{movie.rating}</span>
                            <span className="fa fa-star star movie_rating"></span>
                            {/* </div>                   */}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-5">
                            <img
                                onError={(e) => e.target.src = '/images/default-movie.png'}
                                className="movie_image" src={movie.cover_image} alt={movie.title}
                            />
                            <p className="views_count">
                                {`${views}${views > 1000 ? 'k' : ''} ${inter[lang].itemPage.views}${views > 1 ? lang === 'de' ? 'en' : 's' : ''}`}
                            </p>
                        </div>
                        <div className="col-12 col-lg-7 p-4">
                            <div className="movie_synopsis">
                                <p>
                                    {movie.synopsis}
                                </p>
                            </div>
                            <div className="movie_info mt-5">
                                <div>
                                    <p>Genre : {movie.genre + ''}</p>
                                    {movie.casting && <div>
                                        <p>{inter["fr"].itemPage.direct} {movie.casting[0]}</p>
                                        <p>Casting : {movie.casting[1]}</p>
                                    </div>
                                    }
                                </div>
                                <div>
                                    <p >{inter[lang].itemPage.synopsis} {movie.runtime} minutes</p>
                                </div>
                                <div>
                                    <p style={{ display: "inline" }}>{inter[lang].itemPage.speed}</p>
                                    <span style={{ marginLeft: "0.5em" }} className={`badge badge-pill badge-${this.state.badge}`}>{this.state.quality}
                                        {/* <span class="tooltipText">{movie.title}</span> */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            this.state.watchMovieClicked ?

                                <VideoPlayer { ...videoJsOptions } movie_id={this.props.match.params.id} imdb_id={movie.imdb_id} en_subs={this.state.en_subs} fr_subs={this.state.fr_subs} ge_subs={this.state.ge_subs} sp_subs={this.state.sp_subs} />

                                :

                                this.state.quality === inter[lang].itemPage.slow ?
                                    <div className="div_movie_watch_link">
                                        <span className="not_enough_seeder">Not enough seeders 🙈</span>
                                    </div>
                                    :
                                    <div className="div_movie_watch_link">
                                        <a href='#' onClick={this.watchMovie}>Watch the movie</a>
                                    </div>
                        }
                    </div>
                    <div>
                        <form
                            onSubmit={this.handlePostCom}>
                            <div className="comment-input-div">
                                <textarea
                                    className="comment-textarea"
                                    id="writer_block"
                                    name="comment" value={comment}
                                    onChange={this.handleChangeCom}
                                    placeholder={inter[lang].itemPage.com}>
                                </textarea>
                                {this.state.commentError && <p style={{ color: "red" }}>
                                    {this.state.commentError}
                                </p>}
                                <button className="comment-button">{inter[lang].itemPage.send}</button>
                            </div>
                            {
                                comments.content[0] && comments.content.map((message, index) => (
                                    <Comment
                                        key={index}
                                        {...message}
                                        language={lang}
                                        personal={message.author_id === this.props.session._id ?
                                            true
                                            : false
                                        }
                                    />
                                ))
                            }
                        </form>
                    </div>
                </div>
                {/* } */}
            </div >
        );
    }
}

const mapStateToProps = state => {
    const { movieItem: movie } = state.movies
    return {
        comments: state.comments,
        movie,
        // loading,
        language: state.language,
        session: state.users.session,
    };
};

export default connect(mapStateToProps)(Item);
