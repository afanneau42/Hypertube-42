import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Comment = (props) => (
    <div className="comment-div">
        <Link className="comment-div-info" to={props.personal ? `/personal` : `/user/${props.author_id}`} >
            <div width={40} height={40} style={{ backgroundImage: `url("${props.picture}")` }} />
            <span>{props.username}</span>
        </Link>
        <div>
            <p className="comment-text">{props.content}</p>
            <p style={{ fontSize: '0.1em', color: 'grey', fontStyle: 'italic' }}>
                {props.language === "fr" ?
                    moment(props.date).locale('fr').fromNow()
                    : moment(props.date).fromNow()}</p>
        </div>
    </div>
);

export default (Comment);
