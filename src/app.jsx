import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import WidgetManager from "./WidgetManager"
import { Widget, WidgetColumn, WidgetRow, widgets } from "./widgets"
import { Icon } from "./components"

import * as _ from "lodash";
import { ComponentsPanel, PropertiesPanel} from './page-builder'

require("../theme/index.scss");

console.log("window", window);
console.log("window.frames[0]", window.frames[0]);

class TopBar extends React.Component {
  render(){
    return (
      <div className="pb-topbar">
        <img src="public/img/appcraft.png" width="" height="" alt="AppCraft" />
        <div style={{float: 'right', fontSize: 14, padding: 4}}>
          <div className="pure-button-group" style={{fontSize: 16, display: 'inline-block'}}>
            <button className="pure-button is-selected"><Icon name="laptop" /></button>
            <button className="pure-button"><Icon name="tablet" /></button>
            <button className="pure-button"><Icon name="mobile-phone" /></button>
          </div>
          &nbsp;&nbsp;
          <div className="pure-button-group" style={{display: 'inline-block'}}>
            <button className="pure-button">English <Icon name="caret-down" /></button>
          </div>
          &nbsp;&nbsp;
          <span><Icon name="cogs" /> </span>
          <span><Icon name="sign-out" /> </span>
          <span><Icon name="user" /> Gregory</span>
        </div>
      </div>
    )
  }
}

class _DragDrop extends React.Component {
  
  getChildContext() {
    return {
      widgetManager: this.widgetManager, 
      selectedWidget: this.state.selected
    };
  }
  
  constructor(props){
    super(props)
    
    this.widgetManager = new WidgetManager(props.pageId);
    this.widgetManager.onSelect = (selected) => {
      this.setState({selected})
    }
    
    this.onChange = () => this.setState({
      selected: this.state.selected && this.widgetManager.get(this.state.selected.id),
      container: this.widgetManager.root
    })
    this.widgetManager.onUpdate = this.onChange
    this.widgetManager.onRemove = this.onChange
    this.widgetManager.onAdd = (w) => this.setState({
      selected: w,
      container: this.widgetManager.root
    })
    
    this.widgetManager.onRemoteUpdate = () => {
      this.setState({
        selected: this.state.selected && this.widgetManager.get(this.state.selected.id),
        container: this.widgetManager.root
      })
    }
    
    this.handlePageClick = (e) => {
      e.stopPropagation()
      this.widgetManager.select(null)
    }
    
    this.undo = this.undo.bind(this)
    
    this.state = {
      selected: undefined,
      container: this.widgetManager.root,
      widgetsHorizontal: []
    }
  }
  
  componentDidMount(){
    // this.widgetManager.initRemote()
  }
  
  undo(){
    this.widgetManager.undo()
    this.setState({
      selected: this.state.selected && this.widgetManager.get(this.state.selected.id),
      container: this.widgetManager.root
    })
  }
  
  render(){
    const { container, selected } = this.state
    return (
      <div style={{minHeight: '100%'}}>
        <TopBar />
        <div style={{display: 'flex', padding: '44px 8px 0 8px', height: '100%', backgroundColor: '#F7F7F7'}}>
          {/*<div style={{width: 290, flex: '0 0 250px', overflowY: 'scroll'}}>
          </div>*/}
          <div className="pb-panel" style={{flex: 'auto', overflowY: 'scroll'}} onClick={this.handlePageClick}>
            <div className="pb-page" style={{display: 'block', paddingTop: 12}}>
              {/*<button className="button-warning pure-button" style={{float: 'right', padding: 6}} onClick={this.undo}><Icon name="undo"/></button>*/}
              {/*<h3><Icon name="file-text-o" /> Page Builder</h3>*/}
              <Widget key="page" {...container} _widget={container} _selectedWidget={selected && selected.id} />
            </div>
          </div>
          <div style={{flex: '0 0 280px', overflowY: 'scroll'}}>
            <ComponentsPanel widgets={widgets} />
            <PropertiesPanel widget={selected} 
                             widgetManager={this.widgetManager}
                             dataLinks={selected && this.widgetManager.getItemDataLinks(selected.id)} />
          </div>
        </div>
      </div>
    )
  }
}
_DragDrop.childContextTypes = {
  widgetManager: React.PropTypes.any,
  selectedWidget: React.PropTypes.any,
}

const DragDrop = DragDropContext(HTML5Backend)(_DragDrop)

export class App extends React.Component {
	render(){
		return (
			<DragDrop pageId={this.props.pageId} />
		)
	}
}


widgets["PageBuilder"] = {
  component: App,
  icon: "th",
  label: "Page Builder",
  fields: [
  ],
  defaultValue: {
    "$type": "PageBuilder",
  }
}