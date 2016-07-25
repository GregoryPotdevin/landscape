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
import ReactQuill from 'react-quill'
require('quill/dist/quill.snow.css')
import { MultiSelectField } from './MultiSelectField'

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


class NumberInputField extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value, onChange} = this.props
    return (
      <FieldContainer {...this.props} name={name}>
        <input type="number" style={{width: '100%'}} value={value} 
               onChange={(e) => onChange(name, e.target.value)} />
      </FieldContainer>
    )
  }
}


class ImageField extends React.Component {
  
  constructor(props){
    super(props)
    
    this.onDrop = this.onDrop.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.state = {
      hover: false
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  onDrop(evt){
    evt.preventDefault()
    evt.stopPropagation()
    console.log(evt);
    var files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files;
    console.log('files', files)
    this.setState({hover: false})

    if (files && files.length > 0) {
      var reader  = new FileReader();

      reader.addEventListener("load", () => {
        const { onChange, name } = this.props
        onChange(name, reader.result)
      }, false);
      reader.readAsDataURL(files[0]);
    }
  
  }
  
  onEnter(evt){
    evt.preventDefault()
    evt.stopPropagation()
    this.setState({hover: true})
  }
  
  onLeave(evt){
    this.setState({hover: false})
  }
         
  render(){
    const { value, imageWidth, imageHeight } = this.props
    return (
      <FieldContainer {...this.props}>
        <div className={"ac-field-image fit " + (this.state.hover ? 'hover' : '')} 
             onDrop={this.onDrop}
             onDragOver={this.onEnter}
            onDragEnter={this.onEnter}
            onDragLeave={this.onLeave}
            style={{
              backgroundImage: `url(${value})`,
              width: imageWidth, height: imageHeight
            }}>
        </div>
      </FieldContainer>
    )
  }
}

class RichTextField extends React.Component {
    
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value, onChange} = this.props
    return (
      <FieldContainer {...this.props} name={name}>
        <div style={{height: 160, 
          paddingBottom: 40,
          border: '1px solid #ccc',
          boxShadow: 'inset 0 1px 3px #ddd',
          borderRadius: 4,  
      }}>
          <ReactQuill theme="snow"
                      value={value}
                      onChange={(value) => onChange(name, value)} />
        </div>
      </FieldContainer>
    )
  }
}

class Structure extends React.Component {
  
  constructor(props){
    super(props)
    
    this.updateField = (name, value) => {
      console.log("update", name, value)
      const { index, data, onChange } = this.props
      onChange(index, {...data, [name]: value})
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    return (
      <fieldset>
        {this.renderFields()}
      </fieldset>
    )
  }
  
  renderFields(){
    const { data, fields, onChange, dataLinks } = this.props
    return fields.map(field => {
      const { name, type } = field
      
      if (type == "componentList") return undefined // TODO: remove
      
      const Component = getFieldComponent(type)
      return <Component key={"field-" + name} 
                        {...field}
                        dataLinks={dataLinks}
                        onChange={this.updateField} 
                        value={data[name]} />
    })
  } 
}

class ListField extends React.Component {
  constructor(props){
    super(props)
    
    this.updateEntry = (idx, newValue) => {
      const { value=[], data, name, onChange } = this.props
      const newArray = value.map((data, i) => (i == idx) ? newValue : data)
      console.log("newArray", newArray)
      onChange(name, newArray)
    }
    
    this.onAdd = (e) => {
      e.preventDefault()
      const { value=[], data, name, onChange } = this.props
      onChange(name, [...value, {}])
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  entryLabelFor(data){
    const label = data.label || data.title || data.name
    if (label) return " - " + label
    return ""
  }
  
  render(){
    const { fields, value=[], entryLabel="Entry" } = this.props
    
    return (
      <FieldContainer {...this.props}>
        {value.map((data, idx) => (
          <div key={idx} className="pb-list-item">
            <h3>{entryLabel} {idx+1} {this.entryLabelFor(data)}</h3>
            <Structure index={idx} 
                      fields={fields} 
                      data={data} 
                      onChange={this.updateEntry} />
          </div>
        ))}
        {this.renderAddButton()}
      </FieldContainer>
    )
  }
  
  renderAddButton(){
    return (
      <button className="button-success pure-button" 
              style={{fontSize: 14, padding: 6, margin: 1}} 
              onClick={this.onAdd}><Icon name="plus" /> Add</button>
    )
  }
}


const fieldComponents = {
  "string": StringField,
  "text": StringField,
  "richtext": RichTextField,
  "bool": BoolField,
  "number": SliderField,
  "integer": NumberInputField,
  "color": ColorField,
  "select": SelectField,
  "multiselect": MultiSelectField,
  "toggle": ToggleField,
  "icon": IconField,
  "image": ImageField,
  "list": ListField,
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
    const { widget, fields, onChange, aligned } = this.props

    var className = "pure-form " 
    className += aligned ? "pure-form-aligned" : "pure-form-stacked"
    return (
      <form className={className} style={{color: "#777", fontSize: 12}}>
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

export class Form extends React.Component {
  
  constructor(props){
    super(props)
    
    this.updateField = (name, value) => {
      const { data, onChange } = this.props
      onChange(data, name, value)
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { aligned } = this.props
    
    var className = "pure-form " 
    className += aligned ? "pure-form-aligned" : "pure-form-stacked"
    
    return (
      <form className={className} style={{color: "#777", fontSize: 12}}>
        <fieldset>
          {this.renderFields()}
        </fieldset>
      </form>
    )
  }
  
  renderFields(){
    const { data, fields, onChange, dataLinks } = this.props
    return fields.map(field => {
      const { name, type } = field
      
      if (type == "componentList") return undefined // TODO: remove
      
      const Component = getFieldComponent(type)
      return <Component key={"field-" + name} 
                        {...field}
                        dataLinks={dataLinks}
                        onChange={this.updateField} 
                        value={data[name]} />
    })
  }
}
