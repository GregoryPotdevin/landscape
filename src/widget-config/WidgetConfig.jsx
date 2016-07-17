import React from 'react'
import Rcslider from 'rc-slider'
import { Icon } from '../components/Icon'
require('rc-slider/assets/index.css');
import ColorPicker from 'react-color';
import shallowCompare from 'react-addons-shallow-compare'
import throttle from 'lodash/throttle'
import { FieldContainer } from './FieldContainer'
import { StringField } from './StringField'
import { IconField } from './IconField'


class BoolField extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value, onChange} = this.props
          // <Icon name="question-circle" pullRight fontSize={14} />
    return (
      <div className="pb-field">
        <label htmlFor={name} style={{textTransform: 'uppercase'}}>
          <input  id={name} 
                  type="checkbox"
                  checked={value || false} 
                  onChange={(e) => onChange(name, e.target.checked)} />
          {" " + name}
        </label>
      </div> 
    )
  }
}

class SliderField extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  computeMarks(){
    const { min, max, value } = this.props
    const marks = { [min]: min, [max]: max}
    if (value) {
      marks[value] = <strong>{value}</strong>
    }
    return marks
  }
  
  render(){
    const { name, value, onChange, min, max, required, defaultValue=0} = this.props
    return (
      <FieldContainer {...this.props}>
        <div style={{padding: '8px 8px 20px 8px', overflow: 'hidden'}}>
          <Rcslider min={min} 
                    max={max} 
                    marks={this.computeMarks()}
                    value={value == undefined ? defaultValue : value} 
                    onChange={(v) => onChange(name, v)} />
        </div>
      </FieldContainer>
    )
  }
}

class SelectField extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value, options, onChange, type, autoFocus} = this.props
    
    return (
      <FieldContainer {...this.props} required={true}>
        <select value={value} onChange={(e) => onChange(name, e.target.value)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label || o.value}</option>)}
        </select>
      </FieldContainer>
    )
  }
}



class ToggleField extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value, options, onChange, type, autoFocus} = this.props
    
    return (
      <FieldContainer {...this.props} required={true}>
        <div className="pure-button-group" style={{fontSize:12, width: '100%', display:'inline-block', textAlign: 'center', margin: '0 auto'}}>
          {options.map(o => (
            <button key={o.value} className={"pure-button " + (o.value == value ? "is-selected" : "")}
                    onClick={(e) => { e.preventDefault(); onChange(name, o.value)}}>
              <Icon name={o.icon} /> {o.label || o.value}
            </button>
          ))}
        </div>
      </FieldContainer>
    )
  }
}

function color({r, g, b, a}){
  return `rgba(${r}, ${g}, ${b}, ${a})`  
}

function applyChange(onChange, name, value){
  onChange(name, value)
}

const colorThrottle = throttle(applyChange, 100)

class ColorField extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value, onChange} = this.props
    return (
      <FieldContainer {...this.props} name={name}>
        <div style={{width: 225, margin: 'auto'}}>
          <ColorPicker type="chrome" color={value} 
                      onChange={(c) => colorThrottle(onChange, name, color(c.rgb))} />
        </div>
      </FieldContainer>
    )
  }
}

const fieldComponents = {
  "string": StringField,
  "text": StringField,
  "bool": BoolField,
  "number": SliderField,
  "color": ColorField,
  "select": SelectField,
  "toggle": ToggleField,
  "icon": IconField,
}

function getFieldComponent(type){
  if (type in fieldComponents) return fieldComponents[type]
  return StringField
}

export class WidgetConfig extends React.Component {
  
  constructor(props){
    super(props)
    
    this.updateField = (name, value) => {
      const { widget, onChange } = this.props
      console.log(name, value)
      onChange(widget, name, value)
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { widget, fields, onChange } = this.props

    return (
      <form className="pure-form pure-form-stacked" style={{color: "#777", fontSize: 12}}>
        <fieldset>
          {this.renderFields()}
        </fieldset>
      </form>
    )
  }
  
  renderFields(){
    const { widget, fields, onChange, dataLinks } = this.props
    return fields.map(field => {
      const { name, type } = field
      
      if (type == "componentList") return undefined // TODO: remove
      
      const Component = getFieldComponent(type)
      return <Component key={"field-" + name} 
                        {...field}
                        dataLinks={dataLinks}
                        onChange={this.updateField} 
                        value={widget[name]} />
    })
  }
}
