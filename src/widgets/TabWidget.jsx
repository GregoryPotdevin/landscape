import React from 'react'
import 'rc-tabs/assets/index.css'
import Tabs, { TabPane } from 'rc-tabs'
import { Section } from './LayoutWidgets'
import { widgets } from './'
import shallowCompare from 'react-addons-shallow-compare'

export class TabsWidget extends React.Component {
  
  constructor(props){
    super(props)
    
    const children = props.children
    this.state = {
      activeKey: children && children.length > 0 && children[0].id
    }
    
    this.onTabChange = (activeKey) => {
      const { widgetManager } = this.props
      this.setState({activeKey})
      setTimeout(() => widgetManager.select(widgetManager.get(activeKey)))
    }
    this.renderTab = this.renderTab.bind(this)
    this.add = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const { id, widgetManager, children } = this.props
      widgetManager.add(widgets.Tab.defaultValue, id, "children", children.length)
      setTimeout(() => {
        // Select last inserted component
        const { children } = this.props
        this.setState({activeKey: children[children.length-1].id})
      })
    }
  }

  showComponentUpdate(nextProps, nextState){
    return shallowCompare(nextProps, this.props) 
        || shallowCompare(nextState, this.state)
  }
  
  static defaultProps = {
    tabPosition: 'top',
    animation: 'slide'
  }
  
  remove(id, e){
    e.stopPropagation()
    e.preventDefault()
    
    const { widgetManager, children } = this.props
    if (id == this.state.activeKey){
      const firstId = (children[0].id == id) ? children[1].id : children[0].id
      console.log("select", firstId)
      setTimeout(() => widgetManager.select(firstId))
    }
    widgetManager.remove(id)
  }
  
  render(){
    const { children, tabPosition } = this.props
    
    let navStyle = {}
    // let tabStyle = {}
    // let animation = 'slide-horizontal'

    if (tabPosition === 'left' || tabPosition === 'right') {
      // navStyle = {
      //   maxHeight: 400,
      //   overflow: 'hidden',
      // };
      // animation = 'slide-vertical'
      // tabStyle = {
      //   overflow: 'hidden',
      // };
    }
        // animation={animation}
    
    return (
      <Tabs
        tabPosition={tabPosition}
        navStyle={navStyle}
        activeKey={this.state.activeKey}
        onChange={this.onTabChange}
        tabBarExtraContent={
          <button style={{margin: 4}} onClick={this.add}>+</button>
          }>
        {this.props.children.map(this.renderTab)}
      </Tabs>
    )
  }
  
  renderTab(tab){
    const hasRemove = this.props.children.length > 0
    const { _selectedWidget } = this.props
    return (
      <TabPane
        key={tab.id}
        tab={<span>{tab.title}
          {hasRemove && <a href="#" className="rc-tab-btn-close" 
             onClick={(e) => this.remove(tab.id, e)}>x</a>}
        </span>}>
        <div style={{ padding: 8 }}>
          <Section {...tab} _widget={tab} widgetManager={this.props.widgetManager} _selectedWidget={_selectedWidget} />
        </div>
      </TabPane>
    ) 
  }
}

