import React from 'react'
import { Icon } from './Icon'


export class FillImg extends React.Component {

  render(){
    const { src, onClick, style={} } = this.props;
    var fillStyle = {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0};
    var imgStyle = {
      // paddingBottom: '100%',
      backgroundImage: `url(${src})`,
      backgroundSize: 'auto 100%', // fill height
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    };
    var containerStyle = {...fillStyle, ...style};
    return (
      <div style={fillStyle} onClick={onClick} >
        <div style={{...fillStyle, ...imgStyle}} />
        {this.props.children}
      </div>
    )
  }
}

export class FilePreview extends React.Component {
  
  constructor(props){
    super(props)
   
    this.state = {
      page: 0
    }
  }
  
  onClick(e, add){
    e.preventDefault()
    e.stopPropagation()
    const { pageCount } = this.props
    var page = this.state.page + add
    if (page < 0) page = 0;
    if (page >= pageCount) page = pageCount-1
    this.setState({page})
  }
  
  render(){
    const { src, pageCount, height } = this.props
    const { page } = this.state
    var fillStyle = {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0};
    return (
      <div style={{width:height/1.5, height, position: 'relative', margin: 'auto'}}>
        <FillImg src={src + '/' + page} />
        <div style={{position: 'absolute', bottom: 3, left: 0, width: '100%', color: 'black', textAlign: 'center'}}>
          <Icon name="arrow-left" circle fontSize={16} onClick={e => this.onClick(e, -1)} opacity={page > 0 ? 0.5 : 0.2} />
          <Icon name="arrow-right" circle fontSize={16} onClick={e => this.onClick(e, 1)} opacity={page < (pageCount-1) ? 0.5 : 0.2} />
        </div>
        <div style={{position: 'absolute', bottom: 0, left: 0, width: (100*page/(pageCount-1)) + '%', height: 3, backgroundColor: '#d33813'}} />
      </div>
    )
  }
}