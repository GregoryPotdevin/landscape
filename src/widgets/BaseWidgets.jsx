import React from "react"
import { Icon } from "../components/Icon"
import shallowCompare from 'react-addons-shallow-compare'
import moment from 'moment'

export class Text extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {text, fontSize, color, textAlign, singleLine} = this.props
    
    const styles = {fontSize, color, textAlign}
    // if (singleLine){
    //   styles.textOverflow = 'ellipsis'
    //   styles.overflow = 'hidden'
    //   styles.whiteSpace = 'nowrap'
    // }
    
    return (
      <div style={styles}>{text}</div>
    )
  }
}

export class Title extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {title, fontSize, color, textAlign} = this.props
    return (
      <h2 style={{marginBottom: 4, textAlign, fontSize, color}}>{title}</h2>
    )
  }
}

export class Image extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {url, shape, borderRadius} = this.props
    
    if ((shape == "square") || (shape == "circle")){
      const backgroundImage = `url(${url})`
      return (
        <div style={{width: '100%'}}>
          <div className="pb-center-image" style={{
            backgroundImage, 
            backgroundSize: "cover", 
            backgroundPosition: 'center center',
            borderRadius: (shape == "circle") ? '50%' : borderRadius}} />
          <div style={{width: '100%', paddingBottom: '100%'}} />
        </div>
      )
    }
    
    return (
      <img src={url} style={{
        width: '100%',
        pointerEvents: 'none',
        borderRadius
      }} draggable={false}/>
    )
  }
}

function renderLine(type, borderColor){
  return <div className={"pb-sep-" + type} style={{borderColor}} />
}

export const Separator = ({type, icon, borderColor}) => {
  if (icon){
    return (
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        minHeight: (type == 'spacing' ? 8 : undefined)}}>
        {renderLine(type, borderColor)}
        <div className="pb-sep-icon" style={{borderRadius: '50%', border: '1px solid', borderColor}}>
          <Icon name={icon} color={borderColor} />
        </div>
        {renderLine(type, borderColor)}
      </div>
    )
  } else {
    return renderLine(type, borderColor)
  }
}

export class IconWidget extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  
  render() {
    return <Icon style={{width: '100%'}} {...this.props} />
  }
}

export class DateWidget extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  
  defaultProps = {
    dateFormat: "full",
  }
  
  format(dateString, dateFormat){
    const date = moment(dateString)
    // console.log("dateFormat", dateFormat)
    // console.log("date", date.format('MMMM Do YYYY, h:mm:ss a'))
    switch(dateFormat){
      case "datetime": return date.format('MMMM Do YYYY, h:mm:ss a')
      case "date": return date.format('MMMM Do YYYY')
      case "relative": return date.fromNow()
      default: return date.format('MMMM Do YYYY, h:mm:ss a')
    }
  }
  
  render() {
    const { date, dateFormat, ...props } = this.props
    return <Text {...props} text={this.format(date, dateFormat)} />
  }
}