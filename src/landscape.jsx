import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import WidgetManager from "./WidgetManager"
import { Widget, WidgetColumn, WidgetRow, widgets } from "./widgets"
import { Icon } from "./components"
import { Form } from './widget-config'

import * as _ from "lodash";
import { ComponentsPanel, PropertiesPanel} from './page-builder'

require("../theme/index.scss");

// console.log("window", window);
// console.log("window.frames[0]", window.frames[0]);

class TopBar extends React.Component {
  render(){
    return (
      <div className="pb-topbar">
        <img src="public/img/appcraft.png" width="" height="" alt="AppCraft" />
        <div style={{float: 'right', fontSize: 14, padding: 4}}>
          {/*<div className="pure-button-group" style={{display: 'inline-block'}}>
            <button className="pure-button">English <Icon name="caret-down" /></button>
          </div>
          &nbsp;&nbsp;*/}
          <span><Icon name="cogs" /> </span>
          <span><Icon name="sign-out" /> </span>
          <span><Icon name="user" /> Laurent</span>
        </div>
      </div>
    )
  }
}

const fields = [
  {name: "name", type: "string", required: true},
  {name: "description", type: "text", required: true},
  {name: "website", type: "string", required: true},
  {name: "logo", type: "image", required: true},
  // {name: "maxCount", type: "number", min: 1, max: 20, required: true},
  // {name: "gridSize", type: "number", min: 1, max: 6, required: true},
  // {name: "itemPadding", type: "number", min: 0, max: 50, defaultValue: 4, required: true},
  // {name: "displayMode", type: "toggle", required: true, options: [
  //   {value: "grid", icon: "th", label: "Grid"},
  //   {value: "columns", icon: "pause", label: "Columns"},
  // ]},
  // Fields.backgroundColor,
]

const Logo = ({src}) => {
  return (
  <div className="fit" style={{
    display: "inline-block" ,
    width: 32, 
    height: 32, 
    verticalAlign: 'middle',
    backgroundImage: `url(${src})`}} />
)}

class LandscapeList extends React.Component {
  
  render(){
    const { list=[], selected, onSelect } = this.props
    return (
      <ul className="ac-sidebar-list">
        {list.map(it => {
          console.log(it)
          return <li key={it.id} 
                    onClick={() => onSelect(it.id)}
                    className={selected == it.id ? "active" : ""}>
                    <Logo src={it.logo} /> {it.name}</li>
        })}
      </ul>
    )
  }
}

export class CompanyEditor extends React.Component {
  render(){
    const { company, onChange } = this.props
    
    return (
      <div>
        <h2>{company.name}</h2>
        <Form data={company} fields={fields} onChange={onChange} />
      </div>
    )
  }
}


var defaultList = localStorage.getItem('companies')
if (!defaultList){
  defaultList = [
    {id: 1, name: "AppCraft"},
    {id: 2, name: "OcamlPro"},
    {id: 3, name: "Smile"}
  ]
}

export class Landscape extends React.Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      list: defaultList,
      selected: defaultList.length > 0 ? defaultList[0].id : null
    }
    
    this.onSelect = (selected) => this.setState({selected})
    this.getSelected = () => _.find(this.state.list, {id: this.state.selected})
    this.onChange = (data, name, value) => {
      const { list } = this.state
      const newEntry = {...data, [name]: value}
      console.log(newEntry)
      this.setState({
        list: list.map(el => el.id == data.id ? newEntry : el)
      })
    }
  }
  
  newId(){
    const { list } = this.state
    var max = 0
    defaultList.forEach(el => {if (el.id > max) max = el.id})
    return max+1
  }
  
  
	render(){
    const { list, selected } = this.state
    return (
      <div style={{minHeight: '100%'}}>
        <TopBar />
        <div style={{display: 'flex', padding: '44px 8px 0 8px', height: '100%', backgroundColor: '#F7F7F7'}}>
          {/*<div style={{width: 290, flex: '0 0 250px', overflowY: 'scroll'}}>
          </div>*/}
          <div style={{flex: '0 0 280px', overflowY: 'scroll'}}>
            <LandscapeList list={list} selected={selected} onSelect={this.onSelect}/>
          </div>
          <div className="pb-panel" style={{flex: 'auto', overflowY: 'scroll'}} onClick={this.handlePageClick}>
            <CompanyEditor company={this.getSelected()} onChange={this.onChange} />
          </div>
        </div>
      </div>
    )
		// return (
		// 	<DragDrop pageId={this.props.pageId} />
		// )
	}
}


// widgets["PageBuilder"] = {
//   component: App,
//   icon: "th",
//   label: "Page Builder",
//   fields: [
//   ],
//   defaultValue: {
//     "$type": "PageBuilder",
//   }
// }