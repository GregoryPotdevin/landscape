import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import WidgetManager from "../WidgetManager"
import { uuid } from '../utils'
import cx from 'classnames'
import { Icon } from '../components/Icon'
import { Widget } from './Widget'
import shallowCompare from 'react-addons-shallow-compare'

import { widgets } from './'



function findWidgetVerticalSlot(clientOffset, refs, count){
  for(var i=0; i<count; i++){
    const box = ReactDOM.findDOMNode(refs["widget-" + i]).getBoundingClientRect()
    if (clientOffset.y < (box.top + box.bottom)/2) return i
  }
  return count
}

function WidgetVerticalTarget(slotSelector){
  return {
    drop(props, monitor, component) {
      if (!monitor.isOver({ shallow: true })) return
      
      const { children, widgetManager, id } = props
      const selected = slotSelector(monitor.getClientOffset(), component.refs, children.length)
      var widget = monitor.getItem().widget 
                   || {"$type": "Image", url: monitor.getItem().urls[0]}
      component.setState({selected: null}) 
      console.log("drop", widget, "on parent", id)
      widgetManager.add(widget, id, "children", selected);
    },
    hover(props, monitor, component) {
      const isJustOverThisOne = monitor.canDrop() && monitor.isOver({ shallow: true });
      var selected;
      if (isJustOverThisOne){
        const { children } = props
        selected = slotSelector(monitor.getClientOffset(), component.refs, children.length)
        component.setState({selected}) 
      }
    },
  };
}


const boxShadowStyles = [
  undefined,
  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
  "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
]

class _Section extends React.Component<any, any> {
  constructor(props){
    super(props)
    this.state = {
      selected: undefined
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { className, children, onDrop, connectDropTarget, isOver, 
            backgroundColor, padding, margin, boxShadowLevel,
            _selectedWidget } = this.props
    const { selected } = this.state
    var components = [this.renderSlot(0, isOver && selected)]
    for(var i=0; i<children.length; i++){
      const name = "widget-" + i
      components.push(<Widget key={children[i].id} 
                              ref={name} {...children[i]} 
                              _widget={children[i]} 
                              _selectedWidget={_selectedWidget} />)
      components.push(this.renderSlot(i+1, isOver && selected))
    }
    const innerBorderColor = isOver ? "rgb(41, 182, 246)" : undefined
    const innerBgColor = isOver ? "rgba(41, 182, 246, 0.05)": undefined
    const boxShadow = boxShadowStyles[boxShadowLevel]
    
    if (children.length == 0){
      return (
        <div className={"pb-container pb-vertical-container is-empty " + className} style={{backgroundColor, padding, margin, boxShadow}}>
          {connectDropTarget(<div className="pb-container-dropzone" style={{borderColor: innerBorderColor, backgroundColor: innerBgColor}}>
            Drop components here
          </div>)}
        </div>
      )
    }
    
    // border: innerBorderColor && ('1px solid ' + innerBorderColor)
    return (
      <div className={"pb-container pb-vertical-container " + className} style={{backgroundColor, padding, margin, boxShadow}}>
        {connectDropTarget(<div className="pb-container-dropzone" style={{backgroundColor: innerBgColor}}>
          {components}
        </div>)}
      </div>
    )
  }
  
  renderSlot(idx, selected){
    return (
      <div key={"slot-" + idx} className={cx("pb-container-slot", {"is-active": idx === selected})} />
    )
  }
}

export const Section = DropTarget(["widget", "widget-new", NativeTypes.FILE, NativeTypes.URL], WidgetVerticalTarget(findWidgetVerticalSlot), (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  draggingType: monitor.getItemType()
}))(_Section)











function findWidgetHorizontalSlot(clientOffset, refs, count){
  for(var i=0; i<count; i++){
    const box = ReactDOM.findDOMNode(refs["widget-" + i]).getBoundingClientRect()
    if (clientOffset.x < (box.left + box.right)/2) return i
  }
  return count
}



function columnCanDrop(monitor){
  const item = monitor.getItem()
  return monitor.canDrop() 
    && ((monitor.getItemType() == "widget-new") || (item.widget && item.widget.$type === "Column"))
}

const WidgetHorizontalTarget = {
  drop(props, monitor, component) {
    if (!monitor.isOver({ shallow: true }) || !columnCanDrop(monitor)) return
    
    const { children, widgetManager, id } = props
    const selected = findWidgetHorizontalSlot(monitor.getClientOffset(), component.refs, children.length)
    var widget = monitor.getItem().widget 
                  || {"$type": "Image", url: monitor.getItem().urls[0]}
    component.setState({selected: null}) 
    
    // Change to column or wrap in column if needed...
    if (widget.$type == "Section") {
      widget = {
        ...widget,
        $type: "Column"
      }
    } else if (widget.$type != "Column") {
      widget = {
        $type: "Column",
        className: "pb-section pb-column",
        backgroundColor: "white",
        children: [widget]
      }
    }
    
    console.log("drop", widget, "on parent", id)
    widgetManager.add(widget, id, "children", selected);
  },
  hover(props, monitor, component) {
    const isJustOverThisOne = columnCanDrop(monitor) && monitor.isOver({ shallow: true });
    var selected;
    if (isJustOverThisOne){
      const { children } = props
      selected = findWidgetHorizontalSlot(monitor.getClientOffset(), component.refs, children.length)
      component.setState({selected}) 
    }
  }
}



class _Columns extends React.Component<any, any> {
  constructor(props){
    super(props)
    this.state = {
      selected: undefined
    }
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  render(){
    const { className, children, onDrop, connectDropTarget, isOver, 
            backgroundColor, padding, margin, boxShadowLevel,
            _selectedWidget } = this.props
    const { selected } = this.state
    var components = [this.renderSlot(0, isOver && selected)]
    for(var i=0; i<children.length; i++){
      const name = "widget-" + i
      components.push(<Widget key={children[i].id} 
                              ref={name} {...children[i]} 
                              _widget={children[i]}
                              _selectedWidget={_selectedWidget}  />)
      components.push(this.renderSlot(i+1, isOver && selected))
    }
    const innerBorderColor = isOver ? "rgb(41, 182, 246)" : undefined
    const innerBgColor = isOver ? "rgba(41, 182, 246, 0.05)": undefined
    const boxShadow = boxShadowStyles[boxShadowLevel]
    
    if (children.length == 0){
      return (
        <div className={"pb-container pb-horizontal-container is-empty " + className} style={{backgroundColor, padding, margin, boxShadow}}>
          {connectDropTarget(<div className="pb-container-dropzone" style={{borderColor: innerBorderColor, backgroundColor: innerBgColor}}>
            Drop components here
          </div>)}
        </div>
      )
    }
    
    // border: innerBorderColor && ('1px solid ' + innerBorderColor)
    return (
      <div className={"pb-container pb-horizontal-container " + className} style={{backgroundColor, padding, margin, boxShadow}}>
        {connectDropTarget(<div className="pb-container-dropzone" style={{backgroundColor: innerBgColor}}>
          {components}
        </div>)}
      </div>
    )
  }
 
  renderSlot(idx, selected){
    return (
      <div key={"slot-" + idx} className={cx("pb-container-slot", {"is-active": idx === selected})} />
    )
  }
}

export const Columns = DropTarget(["column", "widget", "widget-new", NativeTypes.FILE, NativeTypes.URL], WidgetHorizontalTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: columnCanDrop(monitor),
  draggingType: monitor.getItemType()
}))(_Columns)
