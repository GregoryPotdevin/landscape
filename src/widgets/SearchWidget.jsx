import React from "react"
import { App as Search } from '../app-search'
import shallowCompare from 'react-addons-shallow-compare';

export class SearchWidget extends React.Component {
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { actors, writers, countries, types } = this.props
    const hasFacets = actors || writers || countries
    return (
      <div className={hasFacets ? '' : 'sk-hide-facets'} style={{width: '100%', position: 'relative'}}>
        <Search {...this.props} />
      </div>
    )
  }
}

