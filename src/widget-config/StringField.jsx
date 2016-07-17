import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { FieldContainer } from './FieldContainer'
import { Icon } from '../components/Icon'

class Button extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { style={}, pullRight, onClick, icon } = this.props
    return (
      <button className="button-secondary pure-button" onClick={onClick} style={
        {...style, 
          float: pullRight ? 'right' : undefined, 
          padding: 4}
        }><Icon name={icon} /></button>
    )
  }
}

export class StringField extends React.Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      showLinks: false
    }
    
    this.toggleShowLinks = (e) => {
      e.preventDefault()
      this.setState({showLinks: !this.state.showLinks})
    }
    this.unlink = (e) => this.unlink.bind(this)
    this.onLink = this.onLink.bind(this)
    this.closeDropdown = () => {
      if (this.state.showLinks) {
        this.setState({showLinks: false})
      } 
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  unlink(e){
    e.preventDefault()
    const { onChange, name, defaultValue } = this.props
    onChange(name, defaultValue)
    if (this.state.showLinks) {
      this.setState({showLinks: false})
    }
  }
  
  onLink(key){
    const { name, onChange, dataLinks } = this.props
    onChange(name, {
      $link: {
        id: dataLinks.id,
        key
      }
    })
    this.setState({showLinks: false}) // Autoclose
  }
  
  render(){
    const {name, onChange, dataLinks, required, value, defaultValue=""} = this.props 
    if (dataLinks){
      return (
        <FieldContainer {...this.props} width="100%">
          <div style={{display: 'flex'}}>
            {this.renderInput()}
            {this.renderToggleLink()}
          </div>
          <div className="pb-dropdown" style={{display: this.state.showLinks ? 'block': 'none'}}>
            {dataLinks.keys.map(({key, type, value}) => (
              <div key={key} className="pb-dropdown-item" 
                  onClick={() => this.onLink(key)} >
                <div className="pb-menu-type">{type}</div>
                <div className="pb-menu-title">{key}</div>
                <div className="pb-menu-description">{'ex: ' + value}</div>
              </div>    
            ))}
          </div>
        </FieldContainer>
      )
    }
    
    return (
      <FieldContainer {...this.props} width="100%">
        <div>{this.renderInput()}</div>
      </FieldContainer>
    )
  }
  
  renderToggleLink(){
    const { value } = this.props
    if (value && value.$link){
      return (
        <Button style={{width: 34, height: 32, color: '#42b8dd', background: 'transparent'}} 
                      icon="unlink" onClick={this.unlink} pullRight />
      )
    } else {
      return (
        <Button style={{width: 34, height: 32, color: '#42b8dd', background: 'transparent'}} 
                      icon="link" onClick={this.toggleShowLinks} pullRight />
      )
    }
  }
  
  renderInput(){
    const { name, value, type, onChange, autoFocus } = this.props
    const inputType = type == "string" ? "text" : type
    
    if ((typeof value) === "string" || ((typeof value) === "undefined")){
      return (
        <input type={inputType}
            style={{width: '100%'}}
            id={name} 
            value={value} 
            autoFocus={autoFocus}
            onChange={(e) => onChange(name, e.target.value)} />
      )
    } else {
      return (
        <div className="pb-field-linkinfo" 
             style={{width: '100%'}}
             onClick={this.toggleShowLinks}>
          <Icon name="link" /> {value.$link.key}
        </div>
      )
    }
  }
}