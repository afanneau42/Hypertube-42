import React from 'react';
import videojs from 'video.js'
import config from '../config/config';
import axios from 'axios';

export default class VideoPlayer extends React.Component {

  componentDidMount() {
    // instantiate Video.js
    let { sources } = this.props
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      this.player().on('waiting', () => {
        this.player().controls(false)

        // controlBar.addClass('vjs-fade-out');
      })
      this.player().on('playing', () => {
        this.player().controls(true)

      })
    });
  }



  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {

    const url = `${config.connectUrl}/api/video/subtitles?movie_id=${this.props.movie_id}&imdb_id=${this.props.imdb_id}&lang=`;

    return (
      <div className="vjs-container">
        <div data-vjs-player>
          <video ref={node => this.videoNode = node} className="video-js">
            {this.props.en_subs &&
              <track kind="subtitles" src={`/subs/${this.props.imdb_id}_en.vtt`} srcLang="en" label="English" default />
            }
            {this.props.fr_subs &&
              <track kind="subtitles" src={`/subs/${this.props.imdb_id}_fr.vtt`} srcLang="fr" label="Fançais" default />
            }
            {this.props.sp_subs &&
              <track kind="subtitles" src={`/subs/${this.props.imdb_id}_sp.vtt`} srcLang="sp" label="Español" default />
            }
            {this.props.ge_subs &&
              <track kind="subtitles" src={`/subs/${this.props.imdb_id}_ge.vtt`} srcLang="ge" label="German" default />
            }
          </video>
        </div>
      </div>
    )
  }
}