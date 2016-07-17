import React from 'react'

export class Tags {
  
  static defaultProps = {
    tags: [],
    separator: ',', 
    maxCount: undefined
  }
  
  render(){
    const { tags, separator, maxCount } = this.props
    
    var tagList = []
    if (Array.isArray(tags)) tagList = tags
    else if ((typeof tags) === 'string'){
      if (separator){
        tagList = tags.split(separator).map(str => str.trim())
      } else {
        tagList = [tags]
      }
    }
    
    if (maxCount && tagList.length > maxCount){
      tagList = tagList.slice(0, maxCount)
    }
    
    return (
      <ul className="tags">
        {tagList.map(tag => <li><a href="#">{tag}</a></li>)}
      </ul>
    )
  }
}
