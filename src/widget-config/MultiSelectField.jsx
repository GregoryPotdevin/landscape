import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { FieldContainer } from './FieldContainer'
import { Icon } from '../components/Icon'
import Select from 'react-select'
import { faNames } from '../utils/fa'
import 'react-select/dist/react-select.min.css'


// const selectNames = faNames.map(name => ({value: name, label: name}))

export class MultiSelectField extends React.Component {
  
  constructor(props){
    super(props)
    
    this.onChange = (v) => {
      const { name, onChange } = this.props
      console.log(v)
      onChange(name, v.map(v => v.value))
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const {name, value=[], options} = this.props
    return (
      <FieldContainer {...this.props}>
        <Select
          name={name}
          value={value}
          options={options}
          clearable={false}
          multi={true}
          onChange={this.onChange} 
          />
      </FieldContainer>
    )
  }
}

