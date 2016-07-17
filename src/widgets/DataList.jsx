import React from "react"
import { Widget } from './Widget'
import fetchJsonp from 'fetch-jsonp'


export class DataWidget extends React.Component {
  
  getChildContext(){
    return {
      widgetLinkIndex: this.props.linkIndex,
      widgetLinkData: this.props.linkData
    }
  }
  
  render(){
    const { linkIndex, linkData, ...props} = this.props
    return <Widget {...props} />
  }
}

DataWidget.childContextTypes = {
  widgetLinkIndex: React.PropTypes.number,
  widgetLinkData: React.PropTypes.any,
}

export class DataList extends React.Component {
  
  static defaultProps = {
    displayMode: 'grid'
  }
  
  componentDidMount(){
    this.refresh(this.props.url)
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.url != this.props.url){
      this.refresh(nextProps.url)
    }
  }
    
  refresh(url){
    const { id, widgetManager } = this.props
    var promise;
    if (url.indexOf("api.flickr.com") != -1){
      promise = fetchJsonp(url, {
        jsonpCallback: 'jsoncallback'
      })
    } else {
      promise = fetch(url)
    }
    this.queryUrl = url
    promise
      .then(data => data.json())
      .then(data => {
        if (this.queryUrl == url){
          widgetManager.setState(id, data)
          this.setState({data})
        }
      })
  }
  
  render(){
    const { children, maxCount, gridSize, padding, itemPadding, displayMode, _selectedWidget } = this.props
    const [item] = this.props.children
    
    var widgets = []
    var data = this.props.widgetManager.getState(this.props.id) || []
    if (data.items) data = data.items
    else if (data.records) data = data.records
    const count = (data && (data.length != undefined)) ? Math.min(maxCount, data.length) : maxCount
    
    for(var i=0; i<count; i++){
      widgets.push(
        <DataWidget {...item} 
                    key={i}
                    _widget={item} 
                    _selectedWidget={_selectedWidget}
                    linkIndex={i} 
                    linkData={data.length > i ? data[i] : undefined} />
      )
    }
    
    if (displayMode == 'columns'){
      const columns = []
      for(var i=0; i<gridSize; i++){
        columns.push([])
      }
      widgets.forEach((w, i) => {
        columns[i%gridSize].push(<div key={i} style={{padding: itemPadding}}>{w}</div>)
      })
      return (
        <div className="pb-dynamic-list" style={{padding, width: '100%', display: 'table'}}>
          {columns.map((columnWidgets, i) => (
            <div key={i} style={{width: 100/gridSize + '%', display: 'table-cell', verticalAlign: 'top'}}>
              {columnWidgets}
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div className="pb-dynamic-list" style={{padding, width: '100%'}}>
          {widgets.map((w, i) => (
            <div key={i} style={{width: 100/gridSize + '%', display: 'inline-block', verticalAlign: 'top', padding: itemPadding}}>
              {w}
            </div>
          ))}
        </div>
      )
    }
  }
}
