import React from "react"
import { DragSource } from 'react-dnd';
import WidgetManager from "../WidgetManager"
import cx from 'classnames'
import { Icon } from '../components/Icon'
import { widgets } from './'

import mapValues from 'lodash/mapValues'
import get from 'lodash/get'

const WidgetDrag = {
  beginDrag(props) {
    console.log("beginDrag", props);
    return { widget: props._widget }; // Info available to drop targets
  },
  
  canDrag(props){
    return props._widget["$type"] != "Page"
  }
};


class _Widget extends React.Component {

  
  constructor(props){
    super(props)
    
    this.state = {
      hover: false
    }
    
    this.handleClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.context.widgetManager.select(this.props._widget)
    }
    
    this.onMouseOver = (evt) => {
      evt.stopPropagation()
      this.setState({hover: true})
    }
    
    this.onMouseOut = (evt) => {
      evt.stopPropagation()
      this.setState({hover: false})
    }
  }
  
  computeWidgetProps(){
    const { _widget } = this.props
    if (!this.context.widgetLinkData) return _widget 
    
    const data = this.context.widgetLinkData
    return mapValues(_widget, v => {
      if (v && v.$link){
        return get(data, v.$link.key)
      } else {
        return v
      }
    })
  }
  
  render(){
    const { connectDragSource, isDragging, _widget, _selectedWidget, width, verticalCenter} = this.props
    const { hover } = this.state
    const type = _widget["$type"]
    const config = widgets[type]
    const Component = config.component
    const isSelected = _selectedWidget && _selectedWidget == _widget.id
          //  onMouseDown={this.handleClick}
    const className = cx("pb-widget", {
        "is-hover": hover, 
        "is-selected": isSelected,
        "is-dragging": isDragging,
      })
      
    const widgetProps = this.computeWidgetProps()
    // if (this.props.linkIndex) console.log("widgetProps", widgetProps)  
      
    const marginWidth = (width === undefined) ? 0 : 'auto'
    const marginHeight = verticalCenter ? 'auto' : 0
    const margin = (marginWidth || marginHeight) ? (marginHeight + ' ' + marginWidth) : undefined
      
    return connectDragSource(
      <div className={className}
           onClick={this.handleClick}
           onMouseOver={this.onMouseOver}
           onMouseOut={this.onMouseOut}
           style={{ width, margin}}>
        <Component {...widgetProps}
                   _selectedWidget={_selectedWidget} 
                   widgetManager={this.context.widgetManager} />
        {(isSelected || hover) && (
          <div className="pb-widget-overlay">
            <div className="pb-widget-overlay__header">
              <Icon name={config.icon} /> {type}
            </div>
          </div>
        )}
      </div>
    )
  }
}
_Widget.contextTypes = {
  widgetManager: React.PropTypes.any,
  selectedWidget: React.PropTypes.any,
  widgetLinkData: React.PropTypes.any,
}
  
export const Widget = DragSource("widget", WidgetDrag, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(_Widget)

