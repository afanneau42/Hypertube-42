import React from 'react'
import { Link } from 'react-router-dom'

const Thumbnail = (props) => (
    <div className={
        props.history.includes(props.me) ?
            'thumbnail col-md-4 my-4 real-thumbnail-viewved'
            :
            'thumbnail col-md-4 my-4'
    }>
        <Link to={`/movie/${props.movieId}`}>
            <div id={props.movieId} className='real-thumbnail p-4'>
                <div className='row'>
                    <img src={props.moviePoster}
                        alt={`${props.movieTitle}-${props.movieYear}`}
                        onError={(e) => e.target.src = "/images/default-movie.png"}
                        className='mx-auto' />
                </div>
                <h2>{props.movieTitle}</h2>
                <div className='row info'>
                    <div className='col-6'>
                        <h3>({props.movieYear})</h3>
                    </div>
                    <div className='col-6 justify-content-center'>
                        <h4 className='m-1'>{props.rating}  <span className="fa fa-star"></span></h4>
                    </div>
                </div>
            </div>
        </Link>
    </div>
)

export default Thumbnail