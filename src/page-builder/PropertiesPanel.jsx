import React from 'react'
import { Icon } from "../components"
import { WidgetConfig } from '../widget-config'
import shallowCompare from 'react-addons-shallow-compare'


function addWidget(arr, widget, widgetManager, idx){
  if (!widget) return
  arr.unshift(<span onClick={() => widgetManager.select(widget)} 
                    className="pb-breadcrumb-item" 
                    key={"widget-" + idx}>{widgetManager.getInfo(widget).label}</span>)
  arr.unshift(<Icon key={"icon-" + idx} name="angle-double-right" />)
  addWidget(arr, widgetManager.getParent(widget), widgetManager, idx+1)
}


export class WidgetBreadcrumb extends React.Component {
  render(){
    const { widget, widgetManager } = this.props
    
    const arr = []
    addWidget(arr, widget, widgetManager, 0)
    
    return(
      <div className="pb-breadcrumb">
        {arr}
      </div>
    )
  }
}

export class PropertiesPanel extends React.Component {
  
  constructor(){
    super()
    
    this.remove = () => {
      if (this.props.widget.required) return
      this.props.widgetManager.remove(this.props.widget.id)
    }
    
    this.clone = () => {
      this.props.widgetManager.clone(this.props.widget.id)
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { widget, widgetManager } = this.props
    if (!widget) return <div className="pb-panel" style={{display: 'none'}} />
    
    const config = widgetManager.getInfo(widget)
    return (
      <div className="pb-panel" style={{display: 'block'}}>
        {!widget.required && <button className="button-error pure-button" style={{float: 'right', padding: 6, margin: 1}} onClick={this.remove}><Icon name="trash" /></button>}
        {widget.$type != "Page" && <button className="button-secondary pure-button" style={{float: 'right', padding: 6, margin: 1}} onClick={this.clone}><Icon name="copy" /></button>}
        <h3 style={{marginTop: 0}}><Icon name={config.icon} /> {config.label}</h3>
        <WidgetBreadcrumb widget={widget} widgetManager={widgetManager} />
        {this.renderSelected()}
      </div>
    )
  }
  
  renderSelected(){
    const { widget, widgetManager, onWidgetChange, dataLinks } = this.props
    if (!widget) return undefined
    
    const config = widgetManager.getInfo(widget)
    return (
      <div className="pb-config">
        <WidgetConfig key={widget.id} 
                      widget={widget} 
                      fields={config.fields} 
                      dataLinks={dataLinks}
                      onChange={widgetManager.update.bind(widgetManager)} />
      </div>
    )
  }
}