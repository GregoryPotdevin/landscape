import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { FieldContainer } from './FieldContainer'
import { Icon } from '../components/Icon'

import Portal from 'react-portal'

class Button extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { style={}, pullRight, icon, ...props } = this.props
    return (
      <button {...props} className="button-secondary pure-button" style={
        {...style, 
          float: pullRight ? 'right' : undefined, 
          padding: 4}
        }><Icon name={icon} /></button>
    )
  }
}

import { 
  Overlay,
  Drawer, DrawerBody, DrawerFooter, 
  Menu, MenuItem, 
  Nav, NavItem, NavContent,
  H2, P, Button as But } from 'react-blazecss'

import hogan from 'hogan.js'

function isEmpty(str){
  return !str || str.length == 0
}


function getEntries(){
  let defaultList = localStorage.getItem('companies')
  return JSON.parse(defaultList)
}

function tmpStringValues(name){
  return getEntries().map(e => e[name]).filter(v => v)
}

class StringBatchEditor extends React.Component {
  
  constructor(props){
    super(props)
    
    this.handleActionChange = (e) => this.setState({action: e.target.value})
    
    this.state = {
      visible: false,
      action: 'replace',
      search: "",
      replace: "",
      prepend: "",
      append: ""
    }
  }
  
  componentDidMount(){
    this.setState({visible: true})
  }
  
  applyTemplate(template, data){
    return hogan.compile(template).render(data)
  }
  
  applyTransform(value="", data){
    const { action, replace, search, prepend, append } = this.state
    switch(action){
      case "replace": return isEmpty(replace) ? value : this.applyTemplate(replace, data)
      case "search": return isEmpty(search) ? value : value.replace(new RegExp(search, 'g'), this.applyTemplate(replace, data))
      case "prepend": return isEmpty(prepend) ? value : (this.applyTemplate(prepend, data) + value)
      case "append": return isEmpty(append) ? value : (value + this.applyTemplate(append, data))
      default: return value
    }
  }
  
  render(){
    const { name, value="", closePortal } = this.props
    const { action, appendIfNeeded, prependIfNeeded, visible } = this.state
    return (
      <Overlay animate>
        <Drawer shadow="higher" visible={visible} animate position="right" style={{width: 400}}>
          <Nav inline shadow light>
            <NavContent><span className="c-text--loud"><Icon name="pencil" /> {name}</span></NavContent>
            <NavItem right bStyle="success"  onClick={closePortal}>&nbsp;<Icon name="check" />&nbsp;</NavItem>
            <NavItem right bStyle="error" onClick={closePortal} >&nbsp;<Icon name="remove" />&nbsp;</NavItem>
          </Nav>
          <DrawerBody>
            <div>
              <label className="c-label c-form-element">
                Operation:
                <select className="c-label__field c-choice" 
                        value={action} onChange={this.handleActionChange}>
                  <option value="replace">replace</option>
                  <option value="search">search/replace</option>
                  <option value="prepend">prepend</option>
                  <option value="append">append</option>
                </select>
              </label>
              {action === "replace" && this.renderField('replace', 'Replace with')}
              {action === "search" && this.renderField('search', 'Search')}
              {action === "search" && this.renderField('replace', 'Replace')}
              {action === "prepend" && this.renderField('prepend', 'Prefix')}
              {action === "append" && this.renderField('append', 'Postfix')}
            </div>
          </DrawerBody>
          {/*<DrawerFooter block style={{position: 'inherit', bottom: 'inherit'}}>
            <But>Cancel</But>
            <But bStyle="success">Save</But>
          </DrawerFooter>*/}
          {this.renderPreview()}
        </Drawer>
      </Overlay>
    )
  }
  
  renderPreview(){
    const { name } = this.props
    // const { values=[this.props.value, this.props.value, this.props.value]} = this.props
    // const values = tmpStringValues(this.props.name)
    const values = getEntries().filter(data => data[name]).map(data => this.applyTransform(data[name], data))
    return (
      <Menu grouped style={{
            overflowY: 'scroll',
            maxHeight: 'initial'
        }}>
        <MenuItem divider>Live preview</MenuItem>
        {values.map((v, idx) => (
          <MenuItem key={idx}>{v}</MenuItem>
        ))}
      </Menu>
    )
  }
  
  renderField(key, label){
    return (
      <label key={key} className="c-label c-form-element">
        {label}:
        <input className="c-label__field" value={this.state[key]} onChange={(e) => this.setState({[key]: e.target.value})} />
      </label>
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
        <FieldContainer {...this.props} >
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
      <FieldContainer {...this.props}>
        <div style={{display: 'flex'}}>
          {this.renderInput()}
          {this.renderBatchButton()}
        </div>
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
  
  renderBatchButton(){
    const button = <Button style={{width: 34, height: 32}} icon="pencil" pullRight /> 
    return (
      <Portal closeOnEsc openByClickOn={button}>
        <StringBatchEditor {...this.props}/>
      </Portal>
    )
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
            autoComplete="off"
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