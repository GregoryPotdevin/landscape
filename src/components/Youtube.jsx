import React from "react";
import { uuid } from '../utils'
import YouTube from "react-youtube"

// https://github.com/troybetz/react-youtube

function cleanVideoId(videoId){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = videoId.match(regExp);
  return (match&&match[7].length==11)? match[7] : videoId;
}

export class YoutubeWidget extends React.Component {
  
  constructor(props){
    super(props)
    this.uuid = uuid()
  }
  
  render(){
    const { video } = this.props
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    
    return (
      <div className="videoWrapper" style={{textAlign: "center"}}>
        <YouTube
          videoId={cleanVideoId(video)}
          id={this.uuid}    
          opts={opts}
        />
      </div>
    )
  }
}