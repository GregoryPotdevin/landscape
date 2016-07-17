import React from "react"
import { App as Search } from '../app-search-profile'
import shallowCompare from 'react-addons-shallow-compare'

export class SearchProfileWidget extends React.Component {

  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { eyeColor, hairColor, heightFilter  } = this.props
    const hasFacets = eyeColor || hairColor || heightFilter
    return (
      <div className={hasFacets ? '' : 'sk-hide-facets'} style={{width: '100%', position: 'relative'}}>
        <Search {...this.props} />
      </div>
    )
  }
}

