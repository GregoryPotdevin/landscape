import React from 'react'
import { Icon } from "../components"
import shallowCompare from 'react-addons-shallow-compare'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import keys from "lodash/keys"

const AllowDrag = {
  beginDrag(props) {
    console.log("beginDrag");
    return { widget: props.widget.defaultValue }; // Info available to drop targets
  }
};

class _WidgetButton extends React.Component<any, any> {
  render(){
    const { widget, isDragging, connectDragSource } = this.props
    return connectDragSource(
      <div className="pb-button-widget">
        <div style={{padding: 4}}><Icon name={widget.icon} /></div>
        <div style={{fontSize: 10}}>{widget.label}</div>
      </div>
    )
  }
}

const WidgetButton = DragSource("widget-new", AllowDrag, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(_WidgetButton)

export class ComponentsPanel extends React.Component {
  
  constructor(){
    super()
    
    this.state = {
      collapsed: false
    }
    this.toggleCollapsed = () => this.setState({collapsed: !this.state.collapsed})
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(nextProps, this.props) 
        || shallowCompare(nextState, this.state)
  }
  
  render(){
    const { widgets } = this.props
    const { collapsed } = this.state
    const icon = collapsed ? "angle-right" : "angle-down"
    return (
      <div className="pb-panel">
        <h3 onClick={this.toggleCollapsed} style={{cursor: 'pointer'}}><Icon name={icon} /> Components</h3>
        <div style={{display: collapsed ? 'none' : 'flex', 
            flexFlow: "row wrap", textAlign: 'center', color: "#777"}}>
          {keys(widgets).map(name => !widgets[name].hidden && <WidgetButton key={name} widget={widgets[name]} />)}
        </div>
      </div>
    )
  }
}
