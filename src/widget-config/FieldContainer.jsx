import React from 'react'

export class FieldContainer extends React.Component {
  
  render(){
    const {name, type, width='100%', children, required, value, defaultValue, onChange} = this.props
    return (
      <div className={"pb-field pb-field-" + type} style={{width}}>
        <label htmlFor={required ? name : (name + "toggle")} style={{textTransform: 'uppercase', fontSize: 11}}>
          {name}
          {(!required) && <input type="checkbox" 
                                 id={name + "toggle"}
                                 style={{float: 'right'}}
                                 onChange={(e) => onChange(name, e.target.checked ? defaultValue : undefined)} 
                                 checked={value != undefined} />}
        </label>
        {(required || (value != undefined)) && children}
      </div>
    )
  }
}