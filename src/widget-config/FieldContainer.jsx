import React from 'react'

export class FieldContainer extends React.Component {
  
  render(){
    const {name, type, width='100%', children, required, value, defaultValue, onChange} = this.props
    return (
      <div className={"pure-control-group pb-field pb-field-" + type} style={{width, position: 'relative'}}>
        <label htmlFor={required ? name : (name + "toggle")} style={{textTransform: 'uppercase', fontSize: 11, paddingTop: 6, verticalAlign: 'top'}}>
          {name}
          {(!required) && <input type="checkbox" 
                                 id={name + "toggle"}
                                 style={{float: 'right'}}
                                 onChange={(e) => onChange(name, e.target.checked ? defaultValue : undefined)} 
                                 checked={value != undefined} />}
        </label>
        <div className="pb-field-content">
          {(required || (value != undefined)) && children}
        </div>
      </div>
    )
  }
}